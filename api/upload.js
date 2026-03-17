import { IncomingForm } from 'formidable'
import { readFileSync } from 'fs'

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH = 'draft' } = process.env
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
  const status    = get('status') || 'draft'

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

  const apiBase = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents`
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  }

  // Helper: get existing file SHA (needed for updates)
  const getSHA = async (path) => {
    try {
      const r = await fetch(`${apiBase}/${path}?ref=${GITHUB_BRANCH}`, { headers })
      if (r.ok) { const d = await r.json(); return d.sha }
    } catch {}
    return null
  }

  // Commit both files
  const commitFile = async (path, content, message) => {
    const sha = await getSHA(path)
    const body = { message, content, branch: GITHUB_BRANCH, ...(sha ? { sha } : {}) }
    const r = await fetch(`${apiBase}/${path}`, { method: 'PUT', headers, body: JSON.stringify(body) })
    if (!r.ok) {
      const err = await r.json()
      throw new Error(err.message || `Failed to commit ${path}`)
    }
    return r.json()
  }

  try {
    await commitFile(
      `${folderPath}/metadata.json`,
      metaBase64,
      `Add ${title} metadata — uploaded via admin panel`
    )
    await commitFile(
      `${folderPath}/demo.html`,
      demoBase64,
      `Add ${title} demo — uploaded via admin panel`
    )

    return res.status(200).json({
      success: true,
      message: `${title} committed to ${GITHUB_BRANCH} branch. Open a PR to publish.`
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
