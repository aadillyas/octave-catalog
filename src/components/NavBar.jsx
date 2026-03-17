import Badge from './Badge'

const NavBar = ({ view, selectedIndustry, selectedValueChain, selectedUseCase, onNavigate }) => {
  const isAdmin = view === 'admin'

  const crumbs = []
  if (selectedIndustry) crumbs.push({ label: selectedIndustry.name, action: () => onNavigate('industry') })
  if (selectedValueChain) crumbs.push({ label: selectedValueChain.label, action: () => onNavigate('industry') })
  if (selectedUseCase) crumbs.push({ label: selectedUseCase.title, action: null })

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: '56px', display: 'flex', alignItems: 'center',
      padding: '0 32px', justifyContent: 'space-between',
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(0,0,0,0.08)',
    }}>
      <div onClick={() => onNavigate('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontFamily: 'Jost, sans-serif', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.3px' }}>
          <span style={{ color: '#E82AAE' }}>O</span>
          <span style={{ color: '#1A1A2E' }}>ctave</span>
        </span>
        {isAdmin && <Badge variant="orange">Admin</Badge>}
      </div>

      {crumbs.length > 0 && !isAdmin && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#6B7280' }}>
          {crumbs.map((c, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {i > 0 && <span style={{ color: '#9CA3AF' }}>›</span>}
              <span onClick={c.action || undefined}
                style={{ color: c.action ? '#6B7280' : '#1A1A2E', cursor: c.action ? 'pointer' : 'default', transition: 'color 200ms' }}
                onMouseEnter={e => { if (c.action) e.target.style.color = '#1A1A2E' }}
                onMouseLeave={e => { if (c.action) e.target.style.color = '#6B7280' }}
              >{c.label}</span>
            </span>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isAdmin ? (
          <span onClick={() => onNavigate('home')}
            style={{ fontSize: '13px', color: '#6B7280', cursor: 'pointer', transition: 'color 200ms' }}
            onMouseEnter={e => e.target.style.color = '#1A1A2E'}
            onMouseLeave={e => e.target.style.color = '#6B7280'}>
            View Catalog →
          </span>
        ) : (
          <>
            <span onClick={() => onNavigate('admin')} title="Admin"
              style={{ fontSize: '18px', cursor: 'pointer', opacity: 0.3, transition: 'opacity 200ms', lineHeight: 1 }}
              onMouseEnter={e => e.target.style.opacity = '0.7'}
              onMouseLeave={e => e.target.style.opacity = '0.3'}>🔒</span>
            <button style={{
              background: '#E82AAE', color: '#fff', border: 'none', borderRadius: '8px',
              padding: '7px 16px', fontSize: '13px', fontFamily: 'Jost, sans-serif', fontWeight: 600, cursor: 'pointer',
            }}
              onMouseEnter={e => e.target.style.opacity = '0.85'}
              onMouseLeave={e => e.target.style.opacity = '1'}>
              Book a Demo
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default NavBar
