import { useState, useEffect } from 'react'
import catalogConfig from '../../catalog-config.json'

const INDUSTRIES = catalogConfig.industries.map(i => i.name)
const getValueChains = (industryName) => catalogConfig.industries.find(i => i.name === industryName)?.valueChains.map(v => v.label) || []

// Maps KB JSON fields → metadata fields
const parseKB = (kbText) => {
  try {
    const kb = JSON.parse(kbText)
    const ov = kb['USE CASE OVERVIEW'] || kb.overview || {}
    const c4 = kb['COMPONENT 4 — VALUE CAPTURE'] || kb.value || {}
    const fs = kb['FEASIBILITY SNAPSHOT'] || kb.feasibility || {}

    return {
      title: ov['Use Case Name'] || ov.title || '',
      industry: ov['Industry'] || ov.industry || '',
      tagline: ov['Problem Being Solved'] || ov.tagline || '',
      complexity: fs['Complexity Tier'] || ov.complexity || 'Medium',
      roi: ov['Proven Outcome Headline'] || c4['Proven ROI'] || '',
      deployTime: fs['Typical Time to Deploy'] || '',
    }
  } catch {
    return null
  }
}

const AdminUploadForm = ({ onSuccess }) => {
  const [showKB, setShowKB] = useState(false)
  const [kbText, setKbText] = useState('')
  const [kbError, setKbError] = useState('')
  const [form, setForm] = useState({ title: '', industry: '', valueChain: '', tagline: '', complexity: 'Medium', roi: '', deployTime: '' })
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: null })) }

  const handleKBParse = () => {
    if (!kbText.trim()) { setKbError('Paste JSON first'); return }
    const parsed = parseKB(kbText)
    if (!parsed) { setKbError('Could not parse KB JSON format.'); return }
    setForm(p => ({ ...p, ...parsed }))
    setShowKB(false)
    setKbText('')
    setKbError('')
  }

  const validate = () => {
    const e = {}
    if (!form.title) e.title = 'Required'
    if (!form.industry) e.industry = 'Required'
    if (!form.valueChain) e.valueChain = 'Required'
    if (!form.tagline) e.tagline = 'Required'
    if (!form.roi) e.roi = 'Required'
    if (!form.deployTime) e.deployTime = 'Required'
    if (!file) e.file = 'Please upload a demo.html file'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f?.name.endsWith('.html')) setFile(f)
    else setErrors(p => ({ ...p, file: 'Only .html files accepted' }))
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      fd.append('demo', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      onSuccess(data.message)
      setForm({ title: '', industry: '', valueChain: '', tagline: '', complexity: 'Medium', roi: '', deployTime: '' })
      setFile(null)
    } catch (err) {
      setErrors({ submit: err.message })
    } finally { setLoading(false) }
  }

  const inp = (hasError) => ({
    width: '100%', background: '#F7F8FA', border: `1px solid ${hasError ? '#E82AAE' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: '8px', padding: '10px 14px', color: '#1A1A2E', fontSize: '14px', fontFamily: 'Lato, sans-serif', outline: 'none',
  })
  const lbl = { fontSize: '11px', color: '#6B7280', fontFamily: 'Jost, sans-serif', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '5px', display: 'block' }

  const field = (label, key, type = 'text', opts = {}) => (
    <div style={{ marginBottom: '14px' }}>
      <label style={lbl}>{label.toUpperCase()}</label>
      {type === 'select'
        ? <select value={form[key]} onChange={e => set(key, e.target.value)} style={{ ...inp(errors[key]), cursor: 'pointer' }}>
            <option value="">Select…</option>
            {opts.options?.map(o => <option key={o}>{o}</option>)}
          </select>
        : <input value={form[key]} onChange={e => set(key, e.target.value)} placeholder={opts.placeholder || ''} style={inp(errors[key])} />
      }
      {errors[key] && <div style={{ fontSize: '11px', color: '#E82AAE', marginTop: '3px' }}>{errors[key]}</div>}
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '18px', fontWeight: 700, marginBottom: '4px', color: '#1A1A2E' }}>Publish New Use Case</h3>
          <p style={{ fontSize: '12px', color: '#6B7280' }}>Fill details and upload demo.html to publish live.</p>
        </div>
        <button onClick={() => setShowKB(!showKB)} style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', padding: '6px 12px', fontSize: '11px', color: '#6B7280', cursor: 'pointer', fontWeight: 600 }}>
          {showKB ? '✕ Close JSON' : '⚡ Import from KB JSON'}
        </button>
      </div>

      {showKB && (
        <div style={{ background: '#F7F8FA', borderRadius: '10px', padding: '16px', marginBottom: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
          <label style={lbl}>PASTE KB JSON</label>
          <textarea value={kbText} onChange={e => { setKbText(e.target.value); setKbError('') }}
            placeholder={'Paste the final KB output here...'}
            style={{ ...inp(kbError), height: '100px', resize: 'vertical', fontFamily: 'monospace', fontSize: '11px', marginBottom: '10px' }} />
          {kbError && <div style={{ fontSize: '11px', color: '#E82AAE', marginBottom: '10px' }}>{kbError}</div>}
          <button onClick={handleKBParse} style={{ width: '100%', background: '#1A1A2E', border: 'none', borderRadius: '6px', padding: '8px', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            Auto-fill Fields
          </button>
        </div>
      )}

      {field('Use Case Title', 'title', 'text', { placeholder: 'e.g. Energy Optimisation' })}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {field('Industry', 'industry', 'select', { options: INDUSTRIES })}
        {field('Value Chain', 'valueChain', 'select', { options: getValueChains(form.industry) })}
      </div>

      {field('Tagline', 'tagline', 'text', { placeholder: '1–2 sentence description' })}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={lbl}>COMPLEXITY</label>
          <select value={form.complexity} onChange={e => set('complexity', e.target.value)} style={{ ...inp(false), cursor: 'pointer' }}>
            {['Low','Medium','High'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        {field('Deploy Time', 'deployTime', 'text', { placeholder: 'e.g. 8–12 weeks' })}
      </div>

      {field('ROI Headline', 'roi', 'text', { placeholder: 'e.g. 10% reduction in energy consumption' })}

      <div style={{ marginBottom: '24px', marginTop: '10px' }}>
        <label style={lbl}>DEMO FILE (.html)</label>
        <div onDragOver={e => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
          style={{ border: `2px dashed ${errors.file ? '#E82AAE' : dragOver ? '#E82AAE' : 'rgba(0,0,0,0.15)'}`, borderRadius: '10px', padding: '32px', textAlign: 'center', cursor: 'pointer', background: dragOver ? 'rgba(232,42,174,0.03)' : '#F7F8FA', transition: 'all 200ms' }}>
          {file
            ? <div>
                <div style={{ color: '#0A8A5C', fontSize: '13px', marginBottom: '2px', fontWeight: 600 }}>✓ {file.name}</div>
                <div style={{ color: '#9CA3AF', fontSize: '11px' }}>{(file.size/1024).toFixed(0)} KB</div>
              </div>
            : <div><div style={{ color: '#6B7280', fontSize: '14px', marginBottom: '4px', fontWeight: 500 }}>Drop demo.html here</div><div style={{ color: '#9CA3AF', fontSize: '12px' }}>or click to browse</div></div>
          }
        </div>
        <input id="file-input" type="file" accept=".html" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) setFile(e.target.files[0]) }} />
        {errors.file && <div style={{ fontSize: '11px', color: '#E82AAE', marginTop: '6px' }}>{errors.file}</div>}
      </div>

      {errors.submit && (
        <div style={{ background: 'rgba(232,42,174,0.06)', border: '1px solid rgba(232,42,174,0.2)', borderRadius: '8px', padding: '12px', fontSize: '13px', color: '#E82AAE', marginBottom: '16px' }}>{errors.submit}</div>
      )}

      <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', background: loading ? '#D1D5DB' : '#E82AAE', border: 'none', borderRadius: '10px', padding: '14px', color: '#fff', fontSize: '15px', fontFamily: 'Jost, sans-serif', fontWeight: 700, cursor: loading ? 'default' : 'pointer', boxShadow: '0 4px 12px rgba(232,42,174,0.2)' }}>
        {loading ? 'Publishing Live…' : 'Publish Live to Catalog →'}
      </button>
    </div>
  )
}
export default AdminUploadForm
