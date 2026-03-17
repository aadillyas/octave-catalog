import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { readdirSync, readFileSync, existsSync, copyFileSync, mkdirSync, writeFileSync } from 'fs'

function buildCatalog() {
  const catalogDir = resolve(process.cwd(), 'catalog')
  const publicDemosDir = resolve(process.cwd(), 'public/demos')
  const outPath = resolve(process.cwd(), 'src/data/approvedUseCases.json')

  if (!existsSync(catalogDir)) {
    writeFileSync(outPath, '[]')
    return
  }

  const approvedUseCases = []

  const industries = readdirSync(catalogDir, { withFileTypes: true })
    .filter(d => d.isDirectory()).map(d => d.name)

  for (const industry of industries) {
    const industryPath = `${catalogDir}/${industry}`
    const valueChains = readdirSync(industryPath, { withFileTypes: true })
      .filter(d => d.isDirectory()).map(d => d.name)

    for (const vc of valueChains) {
      const vcPath = `${industryPath}/${vc}`
      const useCaseDirs = readdirSync(vcPath, { withFileTypes: true })
        .filter(d => d.isDirectory()).map(d => d.name)

      for (const ucDir of useCaseDirs) {
        const ucPath = `${vcPath}/${ucDir}`
        const metaPath = `${ucPath}/metadata.json`
        const demoPath = `${ucPath}/demo.html`

        if (!existsSync(metaPath)) continue
        const meta = JSON.parse(readFileSync(metaPath, 'utf-8'))
        if (meta.status !== 'approved') continue

        const hasDemo = existsSync(demoPath)
        if (hasDemo) {
          const destDir = `${publicDemosDir}/${meta.id}`
          mkdirSync(destDir, { recursive: true })
          copyFileSync(demoPath, `${destDir}/demo.html`)
        }

        approvedUseCases.push({
          ...meta,
          hasDemo,
          demoPath: hasDemo ? `/demos/${meta.id}/demo.html` : null
        })
      }
    }
  }

  writeFileSync(outPath, JSON.stringify(approvedUseCases, null, 2))
  console.log(`[catalog] ${approvedUseCases.length} approved use case(s) loaded`)
}

function catalogPlugin() {
  return {
    name: 'catalog-loader',
    buildStart() { buildCatalog() },
    configureServer(server) {
      server.watcher.add(resolve(process.cwd(), 'catalog'))
      server.watcher.on('change', (file) => {
        if (file.includes('/catalog/')) buildCatalog()
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), catalogPlugin()],
  base: '/',
  build: { outDir: 'dist' }
})
