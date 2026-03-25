import { useState } from 'react'
import AdminUploadForm from '../components/AdminUploadForm'
import { CATALOG } from '../data/catalog'

const AdminPage = () => {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')

  const handleAuth = () => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) setAuthed(true)
    else { setAuthError('Incorrect password'); setTimeout(() => setAuthError(''), 2000) }
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

  return (
    <div style={{ minHeight: '100vh', padding: '80px 48px 120px', background: '#F7F8FA' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Jost, sans-serif', fontSize: '36px', fontWeight: 700, marginBottom: '12px', color: '#1A1A2E' }}>Admin Panel</h1>
          <p style={{ color: '#6B7280', fontSize: '16px' }}>Manage the Octave Catalog and publish new use cases live.</p>
        </div>

        {uploadSuccess && (
          <div style={{ background: '#0A8A5C', borderRadius: '10px', padding: '16px 24px', color: '#fff', fontSize: '14px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, boxShadow: '0 4px 12px rgba(10,138,92,0.2)' }}>
            <span>✓</span> {uploadSuccess}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px', alignItems: 'start' }}>
          {/* Main Upload Form */}
          <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <AdminUploadForm onSuccess={msg => { setUploadSuccess(msg); setTimeout(() => setUploadSuccess(''), 10000) }} />
          </div>

          {/* Sidebar Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px', fontWeight: 700, marginBottom: '16px', color: '#1A1A2E' }}>Quick Guide</h3>
              {[
                { n: '1', t: 'Prepare Demo', d: 'Use the Demo Creator skill to build your demo.html.' },
                { n: '2', t: 'Fill Details', d: 'Enter the metadata or auto-fill using your KB JSON.' },
                { n: '3', t: 'Publish', d: 'Click Publish. It updates the live site immediately.' },
              ].map(s => (
                <div key={s.n} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(232,42,174,0.1)', color: '#E82AAE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>{s.n}</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A2E', marginBottom: '2px' }}>{s.t}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.4 }}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#1A1A2E', borderRadius: '16px', padding: '24px', color: '#fff' }}>
              <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>Direct Publish</h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                Drafting and PR workflows have been removed. Your changes will be committed directly to the main branch and deployed to Vercel instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Live List Section */}
        <div style={{ marginTop: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'Jost, sans-serif', fontSize: '22px', fontWeight: 700, color: '#1A1A2E' }}>Live Catalog ({liveUCs.length})</h2>
            <div style={{ fontSize: '13px', color: '#6B7280' }}>Recently added at the top</div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#F7F8FA', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  {['Use Case', 'Industry', 'Value Chain', 'ROI Headline', ''].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#9CA3AF', fontFamily: 'Jost, sans-serif', fontWeight: 600, fontSize: '11px', letterSpacing: '0.5px' }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...liveUCs].reverse().slice(0, 10).map((uc, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <td style={{ padding: '14px 20px', color: '#1A1A2E', fontWeight: 600 }}>{uc.title}</td>
                    <td style={{ padding: '14px 20px', color: '#6B7280' }}>{uc.industryName}</td>
                    <td style={{ padding: '14px 20px', color: '#6B7280' }}>{uc.vcLabel}</td>
                    <td style={{ padding: '14px 20px', color: '#6B7280', fontSize: '12px' }}>{uc.roi}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <a href={uc.demoPath} target="_blank" rel="noreferrer" style={{ color: '#E82AAE', fontSize: '12px', textDecoration: 'none', fontWeight: 600 }}>View Demo →</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {liveUCs.length > 10 && (
              <div style={{ padding: '12px', textAlign: 'center', background: '#F7F8FA', color: '#9CA3AF', fontSize: '12px' }}>
                Showing 10 most recent. {liveUCs.length - 10} more in catalog.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
export default AdminPage
