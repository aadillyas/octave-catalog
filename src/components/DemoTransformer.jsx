import { useState, useRef } from 'react'

const OCTAVE_STYLE_INJECTION = `
  /* ── Octave Design System ── */
  :root {
    --bg: #F7F8FA;
    --surface: #FFFFFF;
    --surface2: #F0F2F5;
    --border: rgba(0,0,0,0.08);
    --border-active: rgba(0,0,0,0.15);
    --pink: #E82AAE;
    --teal: #0A8A5C;
    --text: #1A1A2E;
    --muted: #6B7280;
    --dim: #C4C9D4;
  }
  body {
    font-family: 'Lato', sans-serif !important;
    background: var(--bg) !important;
    color: var(--text) !important;
  }
`

const OCTAVE_FONTS_LINK = '<link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">'

function applyOctaveStyling(html) {
  let result = html

  // Inject fonts if not already present
  if (!result.includes('fonts.googleapis.com')) {
    result = result.replace(/<head([^>]*)>/i, `<head$1>\n${OCTAVE_FONTS_LINK}`)
  }

  // Inject Octave CSS variables + body overrides
  if (!result.includes('--pink: #E82AAE')) {
    const styleTag = `<style>\n${OCTAVE_STYLE_INJECTION}\n</style>`
    // Insert after fonts link, or just inside <head>
    if (result.includes(OCTAVE_FONTS_LINK)) {
      result = result.replace(OCTAVE_FONTS_LINK, OCTAVE_FONTS_LINK + '\n' + styleTag)
    } else {
      result = result.replace(/<head([^>]*)>/i, `<head$1>\n${styleTag}`)
    }
  }

  return result
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function openAsBlob(htmlString, filename) {
  const blob = new Blob([htmlString], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}

function downloadHtml(htmlString, filename) {
  const blob = new Blob([htmlString], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const DemoTransformer = ({ onUseFile }) => {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)         // { name, size, raw }
  const [transformed, setTransformed] = useState(null)  // transformed HTML string
  const [mode, setMode] = useState(null)          // 'asis' | 'styled'
  const dropRef = useRef()
  const inputRef = useRef()

  const handleFile = (f) => {
    if (!f || !f.name.endsWith('.html')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setFile({ name: f.name, size: f.size, raw: e.target.result })
      setTransformed(null)
      setMode(null)
    }
    reader.readAsText(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    handleFile(f)
  }

  const handleSelectMode = (m) => {
    setMode(m)
    if (m === 'styled') {
      setTransformed(applyOctaveStyling(file.raw))
    } else {
      setTransformed(file.raw)
    }
  }

  const handleUseFile = () => {
    const content = transformed || file.raw
    const blob = new Blob([content], { type: 'text/html' })
    const fileObj = new File([blob], file.name, { type: 'text/html' })
    onUseFile(fileObj)
  }

  const reset = () => {
    setFile(null)
    setTransformed(null)
    setMode(null)
  }

  const card = {
    background: '#FFFFFF',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: '14px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  }

  const btn = (primary) => ({
    padding: '9px 20px',
    borderRadius: '8px',
    border: primary ? 'none' : '1px solid rgba(0,0,0,0.1)',
    background: primary ? '#E82AAE' : '#FFFFFF',
    color: primary ? '#fff' : '#1A1A2E',
    fontSize: '13px',
    fontFamily: 'Jost, sans-serif',
    fontWeight: 700,
    cursor: 'pointer',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Stage 1 — Drop zone */}
      <div style={card}>
        <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px', fontWeight: 700, color: '#1A1A2E', marginBottom: '6px' }}>
          Drop your HTML file
        </h3>
        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>
          Upload any HTML demo file. You can use it as-is or apply Octave styling before uploading to the catalog.
        </p>

        {!file ? (
          <div
            ref={dropRef}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
            style={{
              border: `2px dashed ${dragging ? '#E82AAE' : 'rgba(0,0,0,0.15)'}`,
              borderRadius: '12px',
              padding: '48px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragging ? 'rgba(232,42,174,0.03)' : '#F7F8FA',
              transition: 'all 200ms',
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>📄</div>
            <div style={{ fontSize: '14px', fontFamily: 'Jost, sans-serif', fontWeight: 600, color: '#1A1A2E', marginBottom: '4px' }}>
              Drag & drop your demo.html
            </div>
            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>or click to browse — .html files only</div>
            <input ref={inputRef} type="file" accept=".html" style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files[0])} />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#F7F8FA', borderRadius: '10px', padding: '14px 16px' }}>
            <div style={{ fontSize: '22px' }}>📄</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A2E', fontFamily: 'Jost, sans-serif' }}>{file.name}</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{formatBytes(file.size)}</div>
            </div>
            <button onClick={reset} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>×</button>
          </div>
        )}
      </div>

      {/* Stage 2 — Choose mode */}
      {file && (
        <div style={card}>
          <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px', fontWeight: 700, color: '#1A1A2E', marginBottom: '6px' }}>
            How would you like to use it?
          </h3>
          <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>
            Preview first, then choose.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              {
                key: 'asis',
                title: 'Use As-Is',
                desc: 'Upload the file exactly as it is. Best if it\'s already branded or has its own design.',
                icon: '✓',
              },
              {
                key: 'styled',
                title: 'Apply Octave Styling',
                desc: 'Inject Octave fonts, colors, and CSS variables. Best for raw or unbranded HTML files.',
                icon: '✦',
              },
            ].map(opt => (
              <div
                key={opt.key}
                style={{
                  border: `2px solid ${mode === opt.key ? '#E82AAE' : 'rgba(0,0,0,0.08)'}`,
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  background: mode === opt.key ? 'rgba(232,42,174,0.03)' : '#FFFFFF',
                  transition: 'all 200ms',
                }}
                onClick={() => handleSelectMode(opt.key)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: mode === opt.key ? '#E82AAE' : '#F0F2F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: mode === opt.key ? '#fff' : '#6B7280', fontWeight: 700 }}>{opt.icon}</div>
                  {mode === opt.key && <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#E82AAE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />
                  </div>}
                </div>
                <div style={{ fontSize: '14px', fontFamily: 'Jost, sans-serif', fontWeight: 700, color: '#1A1A2E', marginBottom: '4px' }}>{opt.title}</div>
                <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>{opt.desc}</div>
                <button
                  onClick={e => { e.stopPropagation(); openAsBlob(opt.key === 'styled' ? applyOctaveStyling(file.raw) : file.raw, file.name) }}
                  style={{ ...btn(false), marginTop: '14px', fontSize: '12px', padding: '6px 14px' }}
                >
                  Preview →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stage 3 — Actions */}
      {mode && transformed && (
        <div style={card}>
          <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px', fontWeight: 700, color: '#1A1A2E', marginBottom: '6px' }}>
            Ready
          </h3>
          <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>
            {mode === 'styled'
              ? 'Octave styling has been applied. Download the file or send it directly to the Upload tab.'
              : 'File will be used as-is. Download a copy or send it directly to the Upload tab.'}
          </p>

          {/* Inline iframe preview */}
          <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', marginBottom: '20px', height: '320px' }}>
            <iframe
              srcDoc={transformed}
              sandbox="allow-scripts"
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Demo preview"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={btn(false)} onClick={() => downloadHtml(transformed, file.name)}>
              Download file
            </button>
            <button style={btn(true)} onClick={handleUseFile}>
              Use in Upload →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DemoTransformer
