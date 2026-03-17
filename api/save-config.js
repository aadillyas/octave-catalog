export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH = 'draft' } = process.env
  if (!GITHUB_TOKEN) return res.status(500).json({ error: 'GitHub env vars not configured' })

  let body = ''
  await new Promise(resolve => { req.on('data', c => body += c); req.on('end', resolve) })
  const { config } = JSON.parse(body)
  if (!config) return res.status(400).json({ error: 'config required' })

  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  }
  const apiBase = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`

  // Get existing SHA
  let sha
  try {
    const r = await fetch(`${apiBase}/contents/catalog-config.json?ref=${GITHUB_BRANCH}`, { headers })
    if (r.ok) { const d = await r.json(); sha = d.sha }
  } catch {}

  const content = Buffer.from(JSON.stringify(config, null, 2)).toString('base64')
  const body2 = { message: 'Update catalog config via admin panel', content, branch: GITHUB_BRANCH, ...(sha ? { sha } : {}) }

  const r = await fetch(`${apiBase}/contents/catalog-config.json`, { method: 'PUT', headers, body: JSON.stringify(body2) })
  if (!r.ok) { const e = await r.json(); return res.status(500).json({ error: e.message }) }

  return res.status(200).json({ success: true })
}
