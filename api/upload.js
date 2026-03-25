import { IncomingForm } from 'formidable'
import { readFileSync } from 'fs'

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH = 'main' } = process.env
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return res.status(500).json({ error: 'GitHub env vars not configured' })
  }

  // Parse multipart form
  const form = new IncomingForm({ keepExtensions: true })
  const [fields, files] = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      else resolve([fields, files])
    })
  })

  const get = (key) => Array.isArray(fields[key]) ? fields[key][0] : fields[key]
  const title     = get('title')
  const industry  = get('industry')
  const valueChain = get('valueChain')
  const tagline   = get('tagline')
  const complexity = get('complexity')
  const roi       = get('roi')
  const deployTime = get('deployTime')
  const status    = 'approved' // Always approved for direct publish

  if (!title || !industry || !valueChain || !files.demo) {
    return res.status(400).json({ error: 'Missing required fields or demo file' })
  }

  // Build folder path
  const sanitize = (s) => s.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_&-]/g, '').replace(/&/g, 'and')
  const id = sanitize(title).toLowerCase().replace(/_/g, '-')
  const folderPath = `catalog/${sanitize(industry)}/${sanitize(valueChain)}/${sanitize(title)}`

  // Read the uploaded demo file
  const demoFile = Array.isArray(files.demo) ? files.demo[0] : files.demo
  const demoContent = readFileSync(demoFile.filepath)
  const demoBase64 = demoContent.toString('base64')

  // Build metadata
  const metadata = {
    id, title, industry, valueChain, tagline,
    status, complexity, roi, deployTime,
    publishedDate: new Date().toISOString().split('T')[0]
  }
  const metaBase64 = Buffer.from(JSON.stringify(metadata, null, 2)).toString('base64')

  const apiBase = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  }

  // Helper: get existing file SHA (needed for updates)
  const getFile = async (path) => {
    try {
      const r = await fetch(`${apiBase}/contents/${path}?ref=${GITHUB_BRANCH}`, { headers })
      if (r.ok) return await r.json()
    } catch {}
    return null
  }

  // Commit file
  const commitFile = async (path, content, message, sha) => {
    const body = { message, content, branch: GITHUB_BRANCH, ...(sha ? { sha } : {}) }
    const r = await fetch(`${apiBase}/contents/${path}`, { method: 'PUT', headers, body: JSON.stringify(body) })
    if (!r.ok) {
      const err = await r.json()
      throw new Error(err.message || `Failed to commit ${path}`)
    }
    return r.json()
  }

  try {
    // 1. Update catalog-config.json if the use case is new
    const configPath = 'catalog-config.json'
    const configFile = await getFile(configPath)
    if (configFile) {
      const configData = JSON.parse(Buffer.from(configFile.content, 'base64').toString('utf-8'))
      const ind = configData.industries.find(i => i.name === industry)
      if (ind) {
        const vc = ind.valueChains.find(v => v.label === valueChain)
        if (vc && !vc.useCases.includes(title)) {
          vc.useCases.push(title)
          const newConfigBase64 = Buffer.from(JSON.stringify(configData, null, 2)).toString('base64')
          await commitFile(configPath, newConfigBase64, `Register ${title} in ${industry} -> ${valueChain}`, configFile.sha)
        }
      }
    }

    // 2. Commit metadata
    const existingMeta = await getFile(`${folderPath}/metadata.json`)
    await commitFile(
      `${folderPath}/metadata.json`,
      metaBase64,
      `Add ${title} metadata — published via admin panel`,
      existingMeta?.sha
    )

    // 3. Commit demo
    const existingDemo = await getFile(`${folderPath}/demo.html`)
    await commitFile(
      `${folderPath}/demo.html`,
      demoBase64,
      `Add ${title} demo — published via admin panel`,
      existingDemo?.sha
    )

    // 4. Regenerate approvedUseCases.json
    await regenerateApprovedUseCases(apiBase, headers, GITHUB_BRANCH)

    return res.status(200).json({
      success: true,
      message: `${title} published successfully to ${GITHUB_BRANCH}.`
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

async function regenerateApprovedUseCases(apiBase, headers, branch) {
  // Fetch the catalog/ tree
  const treeRes = await fetch(`${apiBase}/git/trees/${branch}?recursive=1`, { headers })
  if (!treeRes.ok) return
  const { tree } = await treeRes.json()

  // Find all metadata.json files under catalog/
  const metaPaths = tree
    .filter(f => f.type === 'blob' && f.path.startsWith('catalog/') && f.path.endsWith('/metadata.json'))
    .map(f => f.path)

  // Fetch and parse each metadata file
  const approvedUseCases = []
  for (const path of metaPaths) {
    const r = await fetch(`${apiBase}/contents/${path}?ref=${branch}`, { headers })
    if (!r.ok) continue
    const { content } = await r.json()
    const meta = JSON.parse(Buffer.from(content, 'base64').toString('utf-8'))
    if (meta.status !== 'approved') continue

    // Check if demo.html exists alongside it
    const demoPath = path.replace('metadata.json', 'demo.html')
    const hasDemo = tree.some(f => f.path === demoPath)

    approvedUseCases.push({
      ...meta,
      hasDemo,
      demoPath: hasDemo ? `/demos/${meta.id}/demo.html` : null,
    })
  }

  // Get current SHA of approvedUseCases.json
  const filePath = 'src/data/approvedUseCases.json'
  const existing = await fetch(`${apiBase}/contents/${filePath}?ref=${branch}`, { headers })
  const existingData = existing.ok ? await existing.json() : null

  const newContent = Buffer.from(JSON.stringify(approvedUseCases, null, 2)).toString('base64')

  await fetch(`${apiBase}/contents/${filePath}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: `Auto-update approvedUseCases.json (${approvedUseCases.length} use cases)`,
      content: newContent,
      sha: existingData?.sha,
      branch: branch,
    }),
  })
}
