import { useState } from 'react'
import { CATALOG } from '../data/catalog'

const INDUSTRIES = CATALOG.map(i => i.name)

const AdminUploadForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    title: '', industry: '', valueChain: '', tagline: '',
    complexity: 'Medium', roi: '', deployTime: '', status: 'draft'
  })
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const selectedIndustry = CATALOG.find(i => i.name === form.industry)
  const valueChains = selectedIndustry?.valueChains.map(v => v.label) || []

  const set = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }))
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
    if (f && f.name.endsWith('.html')) setFile(f)
    else setErrors(prev => ({ ...prev, file: 'Only .html files are accepted' }))
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
      onSuccess('Use case uploaded to draft branch. Open a PR to publish.')
      setForm({ title: '', industry: '', valueChain: '', tagline: '', complexity: 'Medium', roi: '', deployTime: '', status: 'draft' })
      setFile(null)
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (hasError) => ({
    width: '100%', background: '#0A0A0C', border: `1px solid ${hasError ? '#E82AAE' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '8px', padding: '10px 14px', color: '#F0F0F5', fontSize: '14px',
    fontFamily: 'Lato, sans-serif', outline: 'none',
  })

  const labelStyle = { fontSize: '12px', color: '#7A7A8C', fontFamily: 'Jost, sans-serif',
    fontWeight: 600, letterSpacing: '0.5px', marginBottom: '6px', display: 'block' }

  const field = (label, key, type = 'text', opts = {}) => (
    <div style={{ marginBottom: '16px' }}>
      <label style={labelStyle}>{label.toUpperCase()}</label>
      {type === 'select' ? (
        <select value={form[key]} onChange={e => set(key, e.target.value)} style={{ ...inputStyle(errors[key]), cursor: 'pointer' }}>
          <option value="">Select…</option>
          {opts.options?.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type="text" value={form[key]} onChange={e => set(key, e.target.value)}
          placeholder={opts.placeholder || ''} style={inputStyle(errors[key])} />
      )}
      {errors[key] && <div style={{ fontSize: '11px', color: '#E82AAE', marginTop: '4px' }}>{errors[key]}</div>}
    </div>
  )

  return (
    <div>
      <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '16px', fontWeight: 600, marginBottom: '24px', color: '#F0F0F5' }}>
        Upload Use Case
      </h3>

      {field('Use Case Title', 'title', 'text', { placeholder: 'e.g. Energy Optimisation' })}
      {field('Industry', 'industry', 'select', { options: INDUSTRIES })}
      {field('Value Chain', 'valueChain', 'select', { options: valueChains })}
      {field('Tagline', 'tagline', 'text', { placeholder: '1–2 sentence description' })}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={labelStyle}>COMPLEXITY</label>
          <select value={form.complexity} onChange={e => set('complexity', e.target.value)} style={{ ...inputStyle(false), cursor: 'pointer' }}>
            {['Low','Medium','High'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>STATUS</label>
          <select value={form.status} onChange={e => set('status', e.target.value)} style={{ ...inputStyle(false), cursor: 'pointer' }}>
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </div>

      {field('ROI Headline', 'roi', 'text', { placeholder: 'e.g. 10% reduction in energy consumption' })}
      {field('Deploy Time', 'deployTime', 'text', { placeholder: 'e.g. 8–12 weeks' })}

      {/* File drop zone */}
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>DEMO FILE (.html)</label>
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
          style={{
            border: `2px dashed ${errors.file ? '#E82AAE' : dragOver ? '#E82AAE' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: '10px', padding: '32px', textAlign: 'center', cursor: 'pointer',
            background: dragOver ? 'rgba(232,42,174,0.05)' : 'transparent',
            transition: 'all 200ms',
          }}
        >
          {file ? (
            <div>
              <div style={{ color: '#26EA9F', fontSize: '13px', marginBottom: '4px' }}>✓ {file.name}</div>
              <div style={{ color: '#7A7A8C', fontSize: '11px' }}>{(file.size / 1024).toFixed(0)} KB</div>
            </div>
          ) : (
            <div>
              <div style={{ color: '#7A7A8C', fontSize: '14px', marginBottom: '4px' }}>Drop demo.html here</div>
              <div style={{ color: '#3A3A4A', fontSize: '12px' }}>or click to browse</div>
            </div>
          )}
        </div>
        <input id="file-input" type="file" accept=".html" style={{ display: 'none' }}
          onChange={e => { const f = e.target.files[0]; if (f) setFile(f) }} />
        {errors.file && <div style={{ fontSize: '11px', color: '#E82AAE', marginTop: '4px' }}>{errors.file}</div>}
      </div>

      {errors.submit && (
        <div style={{ background: 'rgba(232,42,174,0.1)', border: '1px solid rgba(232,42,174,0.3)',
          borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#E82AAE', marginBottom: '16px' }}>
          {errors.submit}
        </div>
      )}

      <button onClick={handleSubmit} disabled={loading} style={{
        width: '100%', background: loading ? '#3A3A4A' : '#E82AAE', border: 'none',
        borderRadius: '10px', padding: '13px', color: '#fff', fontSize: '14px',
        fontFamily: 'Jost, sans-serif', fontWeight: 700, cursor: loading ? 'default' : 'pointer',
        transition: 'all 200ms',
      }}>
        {loading ? 'Uploading…' : 'Upload to Draft Branch →'}
      </button>
    </div>
  )
}

export default AdminUploadForm
