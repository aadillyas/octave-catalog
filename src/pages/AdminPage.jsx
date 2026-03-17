import { useState } from 'react'
import AdminUploadForm from '../components/AdminUploadForm'
import { CATALOG } from '../data/catalog'

const AdminPage = () => {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')
  const [publishStates, setPublishStates] = useState({}) // { [ucId]: 'idle' | 'loading' | 'done' | 'error' }
  const [publishMessages, setPublishMessages] = useState({})

  const handleAuth = () => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setAuthed(true)
    } else {
      setAuthError('Incorrect password')
      setTimeout(() => setAuthError(''), 2000)
    }
  }

  const handlePublish = async (uc) => {
    const key = uc.id || uc.title
    setPublishStates(p => ({ ...p, [key]: 'loading' }))

    // Build the folder path the same way api/upload.js does
    const sanitize = (s) => s?.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_&-]/g, '').replace(/&/g, 'and') || ''
    const folderPath = `catalog/${sanitize(uc.industryName)}/${sanitize(uc.vcLabel)}/${sanitize(uc.title)}`

    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Publish failed')
      setPublishStates(p => ({ ...p, [key]: 'done' }))
      setPublishMessages(p => ({ ...p, [key]: data.message }))
    } catch (err) {
      setPublishStates(p => ({ ...p, [key]: 'error' }))
      setPublishMessages(p => ({ ...p, [key]: err.message }))
    }
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{
          background: '#111115', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px', padding: '48px', width: '100%', maxWidth: '360px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontFamily: 'Jost, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
            Admin Access
          </h2>
          <p style={{ color: '#7A7A8C', fontSize: '13px', marginBottom: '32px' }}>
            Enter your password to access the upload panel.
          </p>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAuth()}
            placeholder="Password"
            autoFocus
            style={{
              width: '100%', background: '#0A0A0C',
              border: `1px solid ${authError ? '#E82AAE' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '10px', padding: '12px 16px', color: '#F0F0F5', fontSize: '14px',
              fontFamily: 'Lato, sans-serif', outline: 'none', marginBottom: '8px', transition: 'border-color 200ms',
            }}
          />
          {authError && <div style={{ color: '#E82AAE', fontSize: '12px', marginBottom: '12px' }}>{authError}</div>}
          <button onClick={handleAuth} style={{
            width: '100%', background: '#E82AAE', border: 'none', borderRadius: '10px',
            padding: '12px', color: '#fff', fontSize: '14px', fontFamily: 'Jost, sans-serif',
            fontWeight: 700, cursor: 'pointer', marginTop: '8px',
          }}>
            Enter
          </button>
        </div>
      </div>
    )
  }

  // Build flat use case list from catalog
  const allUseCases = []
  CATALOG.forEach(ind => {
    ind.valueChains.forEach(vc => {
      vc.useCases.forEach(uc => {
        allUseCases.push({ ...uc, industryName: ind.name, vcLabel: vc.label })
      })
    })
  })

  const draftUseCases = allUseCases.filter(uc => uc.status === 'approved' && uc.hasDemo)
  const comingSoon = allUseCases.filter(uc => uc.status !== 'approved' || !uc.hasDemo)

  return (
    <div className="page-enter" style={{ minHeight: '100vh', padding: '80px 48px 120px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontFamily: 'Jost, sans-serif', fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>
            Admin Panel
          </h1>
          <p style={{ color: '#7A7A8C', fontSize: '14px' }}>
            Upload new use case demos and publish them live.
          </p>
        </div>

        {uploadSuccess && (
          <div style={{ background: 'rgba(38,234,159,0.08)', border: '1px solid rgba(38,234,159,0.2)',
            borderRadius: '10px', padding: '14px 20px', color: '#26EA9F', fontSize: '13px', marginBottom: '32px' }}>
            ✓ {uploadSuccess}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '32px', alignItems: 'start' }}>

          {/* Upload form */}
          <div style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '32px' }}>
            <AdminUploadForm onSuccess={msg => {
              setUploadSuccess(msg)
              setTimeout(() => setUploadSuccess(''), 8000)
            }} />
          </div>

          {/* Status table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Ready to publish */}
            {draftUseCases.length > 0 && (
              <div style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E82AAE' }} />
                  <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 700 }}>
                    Ready to Publish
                  </h3>
                  <span style={{ fontSize: '12px', color: '#7A7A8C', marginLeft: 'auto' }}>
                    {draftUseCases.length} use case{draftUseCases.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      {['Use Case', 'Industry', 'Value Chain', 'Demo', ''].map(h => (
                        <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: '#7A7A8C',
                          fontFamily: 'Jost, sans-serif', fontWeight: 600, fontSize: '11px', letterSpacing: '0.5px' }}>
                          {h.toUpperCase()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {draftUseCases.map((uc, i) => {
                      const key = uc.id || uc.title
                      const state = publishStates[key] || 'idle'
                      const msg = publishMessages[key]
                      return (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '12px 16px', color: '#F0F0F5', fontWeight: 500 }}>{uc.title}</td>
                          <td style={{ padding: '12px 16px', color: '#7A7A8C' }}>{uc.industryName}</td>
                          <td style={{ padding: '12px 16px', color: '#7A7A8C' }}>{uc.vcLabel}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <a href={uc.demoPath} target="_blank" rel="noreferrer"
                              style={{ color: '#E82AAE', fontSize: '12px', textDecoration: 'none' }}>
                              Preview →
                            </a>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            {state === 'done' ? (
                              <span style={{ color: '#26EA9F', fontSize: '12px', fontWeight: 600 }}>✓ Published</span>
                            ) : state === 'error' ? (
                              <span title={msg} style={{ color: '#E82AAE', fontSize: '12px', cursor: 'help' }}>
                                ✕ Failed — hover for details
                              </span>
                            ) : (
                              <button
                                onClick={() => handlePublish(uc)}
                                disabled={state === 'loading'}
                                style={{
                                  background: state === 'loading' ? 'transparent' : '#E82AAE',
                                  border: `1px solid ${state === 'loading' ? 'rgba(255,255,255,0.1)' : '#E82AAE'}`,
                                  borderRadius: '7px', padding: '6px 16px', color: state === 'loading' ? '#7A7A8C' : '#fff',
                                  fontSize: '12px', fontFamily: 'Jost, sans-serif', fontWeight: 700,
                                  cursor: state === 'loading' ? 'default' : 'pointer', transition: 'all 200ms', whiteSpace: 'nowrap',
                                }}
                              >
                                {state === 'loading' ? 'Publishing…' : 'Publish Live →'}
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* All use cases status */}
            <div style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3A3A4A' }} />
                <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 700 }}>
                  All Use Cases
                </h3>
                <span style={{ fontSize: '12px', color: '#7A7A8C', marginLeft: 'auto' }}>
                  {allUseCases.length} total
                </span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      {['Use Case', 'Industry', 'Value Chain', 'Status', 'Demo'].map(h => (
                        <th key={h} style={{ padding: '11px 16px', textAlign: 'left', color: '#7A7A8C',
                          fontFamily: 'Jost, sans-serif', fontWeight: 600, fontSize: '11px', letterSpacing: '0.5px' }}>
                          {h.toUpperCase()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allUseCases.map((uc, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '11px 16px', color: '#F0F0F5', fontWeight: 500 }}>{uc.title || uc}</td>
                        <td style={{ padding: '11px 16px', color: '#7A7A8C' }}>{uc.industryName}</td>
                        <td style={{ padding: '11px 16px', color: '#7A7A8C' }}>{uc.vcLabel}</td>
                        <td style={{ padding: '11px 16px' }}>
                          {uc.status === 'approved' && uc.hasDemo
                            ? <span style={{ color: '#26EA9F', fontSize: '11px', fontWeight: 600 }}>● Live</span>
                            : <span style={{ color: '#3A3A4A', fontSize: '11px' }}>○ Coming Soon</span>
                          }
                        </td>
                        <td style={{ padding: '11px 16px' }}>
                          {uc.hasDemo
                            ? <a href={uc.demoPath} target="_blank" rel="noreferrer"
                                style={{ color: '#E82AAE', fontSize: '12px', textDecoration: 'none' }}>
                                Preview →
                              </a>
                            : <span style={{ color: '#3A3A4A', fontSize: '12px' }}>—</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
