import { useState } from 'react'
import catalogConfig from '../../catalog-config.json'

const INDUSTRIES = catalogConfig.industries.map(i => i.name)
const getValueChains = (industryName) => catalogConfig.industries.find(i => i.name === industryName)?.valueChains.map(v => v.label) || []

// Maps KB JSON fields → metadata fields
const parseKB = (kbText) => {
  try {
    const kb = JSON.parse(kbText)
    const ov = kb['USE CASE OVERVIEW'] || kb.overview || {}
    const c1 = kb['COMPONENT 1 — DATA'] || kb.input || {}
    const c2 = kb['COMPONENT 2 — MODEL'] || kb.model || {}
    const c3 = kb['COMPONENT 3 — OUTPUT'] || kb.output || {}
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
  const [step, setStep] = useState(1) // 1 = paste KB, 2 = fill form
  const [kbText, setKbText] = useState('')
  const [kbError, setKbError] = useState('')
  const [form, setForm] = useState({ title: '', industry: '', valueChain: '', tagline: '', complexity: 'Medium', roi: '', deployTime: '', status: 'draft' })
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: null })) }

  const handleKBParse = () => {
    if (!kbText.trim()) { setStep(2); return }
    const parsed = parseKB(kbText)
    if (!parsed) { setKbError('Could not parse KB JSON — check the format or skip to fill manually.'); return }
    setForm(p => ({ ...p, ...parsed }))
    setStep(2)
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
      setForm({ title: '', industry: '', valueChain: '', tagline: '', complexity: 'Medium', roi: '', deployTime: '', status: 'draft' })
      setFile(null); setStep(1); setKbText('')
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
      <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '16px', fontWeight: 700, marginBottom: '4px', color: '#1A1A2E' }}>Upload Use Case</h3>
      <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '20px' }}>
        Run your KB → Feedback → Demo skills first, then upload here.
      </p>

      {/* Step indicators */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[{ n: 1, label: 'Paste KB' }, { n: 2, label: 'Details & Upload' }].map(s => (
          <div key={s.n} onClick={() => step > s.n && setStep(s.n)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: step > s.n ? 'pointer' : 'default', opacity: step === s.n ? 1 : 0.4 }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: step === s.n ? '#E82AAE' : step > s.n ? '#0A8A5C' : '#D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#fff', fontWeight: 700 }}>
              {step > s.n ? '✓' : s.n}
            </div>
            <span style={{ fontSize: '12px', fontFamily: 'Jost, sans-serif', fontWeight: 600, color: '#1A1A2E' }}>{s.label}</span>
            {s.n < 2 && <span style={{ color: '#9CA3AF', fontSize: '12px' }}>→</span>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <label style={lbl}>PASTE YOUR CONFIRMED KB JSON (OPTIONAL)</label>
          <p style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '8px' }}>
            Copy the final KB output from your skill workflow. Claude will auto-fill the form fields below.
          </p>
          <textarea value={kbText} onChange={e => { setKbText(e.target.value); setKbError('') }}
            placeholder={'{\n  "USE CASE OVERVIEW": { "Use Case Name": "...", ... },\n  ...\n}'}
            style={{ ...inp(kbError), height: '160px', resize: 'vertical', fontFamily: 'monospace', fontSize: '12px' }} />
          {kbError && <div style={{ fontSize: '11px', color: '#E82AAE', marginTop: '4px' }}>{kbError}</div>}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button onClick={handleKBParse} style={{ flex: 1, background: '#E82AAE', border: 'none', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px', fontFamily: 'Jost, sans-serif', fontWeight: 700, cursor: 'pointer' }}>
              {kbText.trim() ? 'Parse & Continue →' : 'Skip — Fill Manually →'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          {field('Use Case Title', 'title', 'text', { placeholder: 'e.g. Energy Optimisation' })}
          {field('Industry', 'industry', 'select', { options: INDUSTRIES })}
          {field('Value Chain', 'valueChain', 'select', { options: getValueChains(form.industry) })}
          {field('Tagline', 'tagline', 'text', { placeholder: '1–2 sentence description' })}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={lbl}>COMPLEXITY</label>
              <select value={form.complexity} onChange={e => set('complexity', e.target.value)} style={{ ...inp(false), cursor: 'pointer' }}>
                {['Low','Medium','High'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>STATUS</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} style={{ ...inp(false), cursor: 'pointer' }}>
                <option value="draft">Draft</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          </div>

          {field('ROI Headline', 'roi', 'text', { placeholder: 'e.g. 10% reduction in energy consumption' })}
          {field('Deploy Time', 'deployTime', 'text', { placeholder: 'e.g. 8–12 weeks' })}

          <div style={{ marginBottom: '20px' }}>
            <label style={lbl}>DEMO FILE (.html)</label>
            <div onDragOver={e => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
              style={{ border: `2px dashed ${errors.file ? '#E82AAE' : dragOver ? '#E82AAE' : 'rgba(0,0,0,0.15)'}`, borderRadius: '10px', padding: '28px', textAlign: 'center', cursor: 'pointer', background: dragOver ? 'rgba(232,42,174,0.03)' : '#F7F8FA', transition: 'all 200ms' }}>
              {file
                ? <div><div style={{ color: '#0A8A5C', fontSize: '13px', marginBottom: '2px' }}>✓ {file.name}</div><div style={{ color: '#9CA3AF', fontSize: '11px' }}>{(file.size/1024).toFixed(0)} KB</div></div>
                : <div><div style={{ color: '#6B7280', fontSize: '13px', marginBottom: '2px' }}>Drop demo.html here</div><div style={{ color: '#9CA3AF', fontSize: '11px' }}>or click to browse</div></div>
              }
            </div>
            <input id="file-input" type="file" accept=".html" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) setFile(e.target.files[0]) }} />
            {errors.file && <div style={{ fontSize: '11px', color: '#E82AAE', marginTop: '4px' }}>{errors.file}</div>}
          </div>

          {errors.submit && (
            <div style={{ background: 'rgba(232,42,174,0.06)', border: '1px solid rgba(232,42,174,0.2)', borderRadius: '8px', padding: '12px', fontSize: '13px', color: '#E82AAE', marginBottom: '12px' }}>{errors.submit}</div>
          )}

          <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', background: loading ? '#D1D5DB' : '#E82AAE', border: 'none', borderRadius: '10px', padding: '13px', color: '#fff', fontSize: '14px', fontFamily: 'Jost, sans-serif', fontWeight: 700, cursor: loading ? 'default' : 'pointer' }}>
            {loading ? 'Uploading…' : 'Upload to Draft Branch →'}
          </button>
        </div>
      )}
    </div>
  )
}
export default AdminUploadForm
