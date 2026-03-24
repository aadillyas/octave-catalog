export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH = 'draft' } = process.env
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return res.status(500).json({ error: 'GitHub env vars not configured' })
  }

  const { folderPath } = await req.json?.() || await new Promise((resolve) => {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => resolve(JSON.parse(body || '{}')))
  })

  if (!folderPath) return res.status(400).json({ error: 'folderPath required' })

  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  }
  const apiBase = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`

  try {
    // 1. Get SHA of main branch head
    const mainRef = await fetch(`${apiBase}/git/ref/heads/main`, { headers })
    if (!mainRef.ok) throw new Error('Could not get main branch ref')
    const mainData = await mainRef.json()
    const mainSha = mainData.object.sha

    // 2. Get SHA of draft branch head
    const draftRef = await fetch(`${apiBase}/git/ref/heads/${GITHUB_BRANCH}`, { headers })
    if (!draftRef.ok) throw new Error('Could not get draft branch ref')
    const draftData = await draftRef.json()
    const draftSha = draftData.object.sha

    // 3. Create PR
    const prTitle = `Publish: ${folderPath.split('/').pop().replace(/_/g, ' ')}`
    const prRes = await fetch(`${apiBase}/pulls`, {
      method: 'POST', headers,
      body: JSON.stringify({
        title: prTitle,
        head: GITHUB_BRANCH,
        base: 'main',
        body: `Auto-published via Octave Admin Panel.\n\nUse case: \`${folderPath}\``,
      })
    })

    if (!prRes.ok) {
      const err = await prRes.json()
      // PR might already exist — try to find it
      if (err.errors?.[0]?.message?.includes('already exists')) {
        const listRes = await fetch(`${apiBase}/pulls?head=${GITHUB_OWNER}:${GITHUB_BRANCH}&base=main&state=open`, { headers })
        const prs = await listRes.json()
        if (!prs.length) throw new Error('No open PR found and could not create one')
        const pr = prs[0]
        await mergePR(apiBase, headers, pr.number)
        await regenerateApprovedUseCases(apiBase, headers)
        return res.status(200).json({ success: true, message: `Published via existing PR #${pr.number}` })
      }
      throw new Error(err.message || 'Failed to create PR')
    }

    const pr = await prRes.json()

    // 4. Merge the PR
    await mergePR(apiBase, headers, pr.number)

    // 5. Regenerate approvedUseCases.json on main
    await regenerateApprovedUseCases(apiBase, headers)

    return res.status(200).json({ success: true, message: `Published via PR #${pr.number}. Vercel is deploying now.` })

  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

async function mergePR(apiBase, headers, prNumber) {
  const mergeRes = await fetch(`${apiBase}/pulls/${prNumber}/merge`, {
    method: 'PUT', headers,
    body: JSON.stringify({
      commit_title: `Publish use case via admin panel`,
      merge_method: 'squash',
    })
  })
  if (!mergeRes.ok) {
    const err = await mergeRes.json()
    throw new Error(err.message || 'Failed to merge PR')
  }
  return mergeRes.json()
}

async function regenerateApprovedUseCases(apiBase, headers) {
  // Fetch the catalog/ tree from main
  const treeRes = await fetch(`${apiBase}/git/trees/main?recursive=1`, { headers })
  if (!treeRes.ok) return
  const { tree } = await treeRes.json()

  // Find all metadata.json files under catalog/
  const metaPaths = tree
    .filter(f => f.type === 'blob' && f.path.startsWith('catalog/') && f.path.endsWith('/metadata.json'))
    .map(f => f.path)

  // Fetch and parse each metadata file
  const approvedUseCases = []
  for (const path of metaPaths) {
    const r = await fetch(`${apiBase}/contents/${path}?ref=main`, { headers })
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

  // Get current SHA of approvedUseCases.json so we can update it
  const filePath = 'src/data/approvedUseCases.json'
  const existing = await fetch(`${apiBase}/contents/${filePath}?ref=main`, { headers })
  const existingData = existing.ok ? await existing.json() : null

  const newContent = Buffer.from(JSON.stringify(approvedUseCases, null, 2)).toString('base64')

  await fetch(`${apiBase}/contents/${filePath}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: `Auto-update approvedUseCases.json (${approvedUseCases.length} use case${approvedUseCases.length !== 1 ? 's' : ''})`,
      content: newContent,
      sha: existingData?.sha,
      branch: 'main',
    }),
  })
}
