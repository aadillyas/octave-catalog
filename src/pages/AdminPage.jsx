import { useState } from 'react'
import AdminUploadForm from '../components/AdminUploadForm'
import { CATALOG } from '../data/catalog'
import catalogConfig from '../../catalog-config.json'

const AdminPage = () => {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [tab, setTab] = useState('upload') // 'upload' | 'status' | 'config'
  const [uploadSuccess, setUploadSuccess] = useState('')
  const [publishStates, setPublishStates] = useState({})
  const [publishMessages, setPublishMessages] = useState({})

  // Config editor state
  const [config, setConfig] = useState(JSON.parse(JSON.stringify(catalogConfig)))
  const [configSaving, setConfigSaving] = useState(false)
  const [configMsg, setConfigMsg] = useState('')
  const [expandedIndustry, setExpandedIndustry] = useState(null)
  const [expandedVC, setExpandedVC] = useState(null)

  const handleAuth = () => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) setAuthed(true)
    else { setAuthError('Incorrect password'); setTimeout(() => setAuthError(''), 2000) }
  }

  const handlePublish = async (uc) => {
    const key = uc.id || uc.title
    setPublishStates(p => ({ ...p, [key]: 'loading' }))
    const sanitize = s => s?.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_&-]/g, '').replace(/&/g, 'and') || ''
    const folderPath = `catalog/${sanitize(uc.industryName)}/${sanitize(uc.vcLabel)}/${sanitize(uc.title)}`
    try {
      const res = await fetch('/api/publish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ folderPath }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPublishStates(p => ({ ...p, [key]: 'done' }))
      setPublishMessages(p => ({ ...p, [key]: data.message }))
    } catch (err) {
      setPublishStates(p => ({ ...p, [key]: 'error' }))
      setPublishMessages(p => ({ ...p, [key]: err.message }))
    }
  }

  const saveConfig = async () => {
    setConfigSaving(true)
    try {
      const res = await fetch('/api/save-config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ config }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setConfigMsg('✓ Config saved to draft branch. Merge to publish.')
    } catch (err) {
      setConfigMsg('✕ ' + err.message)
    } finally { setConfigSaving(false); setTimeout(() => setConfigMsg(''), 5000) }
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7F8FA' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', padding: '48px', width: '100%', maxWidth: '360px', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontFamily: 'Jost, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '8px', color: '#1A1A2E' }}>Admin Access</h2>
          <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '32px' }}>Enter your password to access the admin panel.</p>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAuth()} placeholder="Password" autoFocus
            style={{ width: '100%', background: '#F7F8FA', border: `1px solid ${authError ? '#E82AAE' : 'rgba(0,0,0,0.1)'}`, borderRadius: '10px', padding: '12px 16px', color: '#1A1A2E', fontSize: '14px', fontFamily: 'Lato, sans-serif', outline: 'none', marginBottom: '8px' }} />
          {authError && <div style={{ color: '#E82AAE', fontSize: '12px', marginBottom: '12px' }}>{authError}</div>}
          <button onClick={handleAuth} style={{ width: '100%', background: '#E82AAE', border: 'none', borderRadius: '10px', padding: '12px', color: '#fff', fontSize: '14px', fontFamily: 'Jost, sans-serif', fontWeight: 700, cursor: 'pointer', marginTop: '8px' }}>Enter</button>
        </div>
      </div>
    )
  }

  const allUseCases = []
  CATALOG.forEach(ind => ind.valueChains.forEach(vc => vc.useCases.forEach(uc => allUseCases.push({ ...uc, industryName: ind.name, vcLabel: vc.label }))))
  const liveUCs = allUseCases.filter(uc => uc.status === 'approved' && uc.hasDemo)

  const tabStyle = (t) => ({
    padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px',
    fontFamily: 'Jost, sans-serif', fontWeight: 600, transition: 'all 200ms',
    background: tab === t ? '#E82AAE' : 'transparent',
    color: tab === t ? '#fff' : '#6B7280',
  })

  const inp = { width: '100%', background: '#F7F8FA', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '8px 12px', color: '#1A1A2E', fontSize: '13px', fontFamily: 'Lato, sans-serif', outline: 'none' }

  return (
    <div style={{ minHeight: '100vh', padding: '80px 48px 120px', background: '#F7F8FA' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'Jost, sans-serif', fontSize: '32px', fontWeight: 700, marginBottom: '8px', color: '#1A1A2E' }}>Admin Panel</h1>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Upload demos, publish use cases, and manage catalog structure.</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '32px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '6px', width: 'fit-content', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
          <button style={tabStyle('upload')} onClick={() => setTab('upload')}>Upload Use Case</button>
          <button style={tabStyle('status')} onClick={() => setTab('status')}>Status & Publish</button>
          <button style={tabStyle('config')} onClick={() => setTab('config')}>Catalog Structure</button>
        </div>

        {uploadSuccess && <div style={{ background: 'rgba(10,138,92,0.08)', border: '1px solid rgba(10,138,92,0.2)', borderRadius: '10px', padding: '14px 20px', color: '#0A8A5C', fontSize: '13px', marginBottom: '24px' }}>✓ {uploadSuccess}</div>}

        {/* Upload tab */}
        {tab === 'upload' && (
          <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '32px', alignItems: 'start' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <AdminUploadForm onSuccess={msg => { setUploadSuccess(msg); setTimeout(() => setUploadSuccess(''), 8000) }} />
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: '#1A1A2E' }}>How to add a use case</h3>
              {[
                { n: '01', title: 'Run the KB Generator', desc: 'Use the octave-kb-generator skill with your source documents to produce a structured Knowledge Base.' },
                { n: '02', title: 'Run the Feedback Framework', desc: 'Use octave-feedback-framework to verify all 5 components. Get the confirmed KB JSON output.' },
                { n: '03', title: 'Run the Demo Creator', desc: 'Use octave-demo-creator to build the interactive HTML demo file.' },
                { n: '04', title: 'Upload here', desc: 'Paste the confirmed KB JSON in Step 1 to auto-fill fields, then upload your demo.html.' },
                { n: '05', title: 'Publish', desc: 'Go to Status & Publish tab and click Publish Live to merge to main and deploy.' },
              ].map(s => (
                <div key={s.n} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(232,42,174,0.08)', border: '1px solid rgba(232,42,174,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#E82AAE', fontWeight: 700, flexShrink: 0 }}>{s.n}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A2E', fontFamily: 'Jost, sans-serif', marginBottom: '2px' }}>{s.title}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status & Publish tab */}
        {tab === 'status' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {liveUCs.length > 0 && (
              <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E82AAE' }} />
                  <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 700, color: '#1A1A2E' }}>Ready to Publish</h3>
                  <span style={{ fontSize: '12px', color: '#9CA3AF', marginLeft: 'auto' }}>{liveUCs.length} use case{liveUCs.length !== 1 ? 's' : ''}</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead><tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    {['Use Case', 'Industry', 'Value Chain', 'Demo', ''].map(h => (
                      <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: '#9CA3AF', fontFamily: 'Jost, sans-serif', fontWeight: 600, fontSize: '11px', letterSpacing: '0.5px' }}>{h.toUpperCase()}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {liveUCs.map((uc, i) => {
                      const key = uc.id || uc.title
                      const state = publishStates[key] || 'idle'
                      return (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                          <td style={{ padding: '12px 16px', color: '#1A1A2E', fontWeight: 500 }}>{uc.title}</td>
                          <td style={{ padding: '12px 16px', color: '#6B7280' }}>{uc.industryName}</td>
                          <td style={{ padding: '12px 16px', color: '#6B7280' }}>{uc.vcLabel}</td>
                          <td style={{ padding: '12px 16px' }}><a href={uc.demoPath} target="_blank" rel="noreferrer" style={{ color: '#E82AAE', fontSize: '12px', textDecoration: 'none' }}>Preview →</a></td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            {state === 'done' ? <span style={{ color: '#0A8A5C', fontSize: '12px', fontWeight: 600 }}>✓ Published</span>
                              : state === 'error' ? <span title={publishMessages[key]} style={{ color: '#E82AAE', fontSize: '12px', cursor: 'help' }}>✕ Failed</span>
                              : <button onClick={() => handlePublish(uc)} disabled={state === 'loading'} style={{ background: state === 'loading' ? '#F0F2F5' : '#E82AAE', border: 'none', borderRadius: '7px', padding: '6px 16px', color: state === 'loading' ? '#9CA3AF' : '#fff', fontSize: '12px', fontFamily: 'Jost, sans-serif', fontWeight: 700, cursor: state === 'loading' ? 'default' : 'pointer' }}>
                                  {state === 'loading' ? 'Publishing…' : 'Publish Live →'}
                                </button>
                            }
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 700, color: '#1A1A2E' }}>All Use Cases</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead><tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  {['Use Case', 'Industry', 'Value Chain', 'Status', 'Demo'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: '#9CA3AF', fontFamily: 'Jost, sans-serif', fontWeight: 600, fontSize: '11px', letterSpacing: '0.5px' }}>{h.toUpperCase()}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {allUseCases.map((uc, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <td style={{ padding: '11px 16px', color: '#1A1A2E', fontWeight: 500 }}>{uc.title || uc}</td>
                      <td style={{ padding: '11px 16px', color: '#6B7280' }}>{uc.industryName}</td>
                      <td style={{ padding: '11px 16px', color: '#6B7280' }}>{uc.vcLabel}</td>
                      <td style={{ padding: '11px 16px' }}>
                        {uc.status === 'approved' && uc.hasDemo
                          ? <span style={{ color: '#0A8A5C', fontSize: '11px', fontWeight: 600 }}>● Live</span>
                          : <span style={{ color: '#9CA3AF', fontSize: '11px' }}>○ Coming Soon</span>}
                      </td>
                      <td style={{ padding: '11px 16px' }}>
                        {uc.hasDemo ? <a href={uc.demoPath} target="_blank" rel="noreferrer" style={{ color: '#E82AAE', fontSize: '12px', textDecoration: 'none' }}>Preview →</a> : <span style={{ color: '#D1D5DB', fontSize: '12px' }}>—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Catalog Structure tab */}
        {tab === 'config' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {config.industries.map((ind, ii) => (
                <div key={ii} style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                  {/* Industry header */}
                  <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: expandedIndustry === ii ? '1px solid rgba(0,0,0,0.06)' : 'none' }}
                    onClick={() => setExpandedIndustry(expandedIndustry === ii ? null : ii)}>
                    <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{String(ii+1).padStart(2,'0')}</span>
                    <input value={ind.name} onChange={e => { const c = JSON.parse(JSON.stringify(config)); c.industries[ii].name = e.target.value; setConfig(c) }}
                      onClick={e => e.stopPropagation()}
                      style={{ ...inp, flex: 1, fontFamily: 'Jost, sans-serif', fontWeight: 700, fontSize: '15px', background: 'transparent', border: '1px solid transparent', padding: '4px 8px', borderRadius: '6px' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(232,42,174,0.3)'}
                      onBlur={e => e.target.style.borderColor = 'transparent'} />
                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{ind.valueChains.length} chains</span>
                    <span style={{ color: '#9CA3AF', fontSize: '14px' }}>{expandedIndustry === ii ? '▲' : '▼'}</span>
                  </div>

                  {expandedIndustry === ii && (
                    <div style={{ padding: '16px 20px' }}>
                      <input value={ind.tagline} onChange={e => { const c = JSON.parse(JSON.stringify(config)); c.industries[ii].tagline = e.target.value; setConfig(c) }}
                        placeholder="Industry tagline" style={{ ...inp, marginBottom: '16px', fontSize: '13px' }} />

                      {/* Value chains */}
                      {ind.valueChains.map((vc, vi) => (
                        <div key={vi} style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', marginBottom: '10px', overflow: 'hidden' }}>
                          <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: '#F7F8FA' }}
                            onClick={() => setExpandedVC(expandedVC === `${ii}-${vi}` ? null : `${ii}-${vi}`)}>
                            <input value={vc.label} onChange={e => { const c = JSON.parse(JSON.stringify(config)); c.industries[ii].valueChains[vi].label = e.target.value; setConfig(c) }}
                              onClick={e => e.stopPropagation()}
                              style={{ ...inp, flex: 1, fontFamily: 'Jost, sans-serif', fontWeight: 600, fontSize: '13px', background: 'transparent', border: '1px solid transparent', padding: '2px 6px' }}
                              onFocus={e => e.target.style.borderColor = 'rgba(232,42,174,0.3)'}
                              onBlur={e => e.target.style.borderColor = 'transparent'} />
                            <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{vc.useCases.length} use cases</span>
                            <button onClick={e => { e.stopPropagation(); const c = JSON.parse(JSON.stringify(config)); c.industries[ii].valueChains.splice(vi, 1); setConfig(c) }}
                              style={{ background: 'none', border: 'none', color: '#D1D5DB', cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: '0 4px' }}>×</button>
                          </div>

                          {expandedVC === `${ii}-${vi}` && (
                            <div style={{ padding: '12px 16px' }}>
                              <input value={vc.summary} onChange={e => { const c = JSON.parse(JSON.stringify(config)); c.industries[ii].valueChains[vi].summary = e.target.value; setConfig(c) }}
                                placeholder="Value chain summary" style={{ ...inp, marginBottom: '10px', fontSize: '12px' }} />
                              {vc.useCases.map((uc, ui) => (
                                <div key={ui} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                                  <input value={uc} onChange={e => { const c = JSON.parse(JSON.stringify(config)); c.industries[ii].valueChains[vi].useCases[ui] = e.target.value; setConfig(c) }}
                                    style={{ ...inp, flex: 1, fontSize: '12px' }} />
                                  <button onClick={() => { const c = JSON.parse(JSON.stringify(config)); c.industries[ii].valueChains[vi].useCases.splice(ui, 1); setConfig(c) }}
                                    style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', color: '#9CA3AF', cursor: 'pointer', padding: '0 10px', fontSize: '14px' }}>×</button>
                                </div>
                              ))}
                              <button onClick={() => { const c = JSON.parse(JSON.stringify(config)); c.industries[ii].valueChains[vi].useCases.push('New Use Case'); setConfig(c) }}
                                style={{ background: 'none', border: '1px dashed rgba(0,0,0,0.15)', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', color: '#6B7280', cursor: 'pointer', marginTop: '4px' }}>
                                + Add use case
                              </button>
                            </div>
                          )}
                        </div>
                      ))}

                      <button onClick={() => { const c = JSON.parse(JSON.stringify(config)); c.industries[ii].valueChains.push({ id: `vc-${Date.now()}`, label: 'New Value Chain', summary: '', useCases: [] }); setConfig(c) }}
                        style={{ background: 'none', border: '1px dashed rgba(0,0,0,0.15)', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', color: '#6B7280', cursor: 'pointer', width: '100%', marginTop: '4px' }}>
                        + Add value chain
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <button onClick={() => { const c = JSON.parse(JSON.stringify(config)); c.industries.push({ id: `ind-${Date.now()}`, name: 'New Industry', tagline: '', useCaseCount: 0, valueChains: [] }); setConfig(c) }}
                style={{ background: '#FFFFFF', border: '2px dashed rgba(0,0,0,0.12)', borderRadius: '14px', padding: '16px', fontSize: '13px', color: '#6B7280', cursor: 'pointer', width: '100%', fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                + Add Industry
              </button>
            </div>

            {/* Save panel */}
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '24px', position: 'sticky', top: '80px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px', fontWeight: 700, color: '#1A1A2E', marginBottom: '8px' }}>Save Changes</h3>
              <p style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.6, marginBottom: '20px' }}>
                Changes are saved to the draft branch. Merge to main to update the live catalog structure.
              </p>
              <div style={{ background: '#F7F8FA', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'Jost, sans-serif', fontWeight: 600, marginBottom: '6px' }}>SUMMARY</div>
                <div style={{ fontSize: '13px', color: '#1A1A2E' }}>{config.industries.length} industries</div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>{config.industries.reduce((a, i) => a + i.valueChains.length, 0)} value chains</div>
                <div style={{ fontSize: '13px', color: '#6B7280' }}>{config.industries.reduce((a, i) => a + i.valueChains.reduce((b, v) => b + v.useCases.length, 0), 0)} use cases</div>
              </div>
              {configMsg && <div style={{ fontSize: '12px', color: configMsg.startsWith('✓') ? '#0A8A5C' : '#E82AAE', marginBottom: '12px' }}>{configMsg}</div>}
              <button onClick={saveConfig} disabled={configSaving} style={{ width: '100%', background: configSaving ? '#D1D5DB' : '#E82AAE', border: 'none', borderRadius: '10px', padding: '12px', color: '#fff', fontSize: '13px', fontFamily: 'Jost, sans-serif', fontWeight: 700, cursor: configSaving ? 'default' : 'pointer' }}>
                {configSaving ? 'Saving…' : 'Save to Draft Branch →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default AdminPage
