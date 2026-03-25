import { useState, useEffect } from 'react'
import { CATALOG } from '../data/catalog'
import { Icon } from '../components/icons'
import { tokens } from '../styles/tokens'

const HomePage = ({ onSelectIndustry }) => {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(null)
  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  return (
    <div className="page-enter" style={{ minHeight: '100vh', padding: '120px clamp(20px, 4vw, 48px) 120px', background: `radial-gradient(circle at top, rgba(232,42,174,0.08), transparent 28%), ${tokens.bg}` }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '72px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', background: 'rgba(232,42,174,0.06)', border: '1px solid rgba(232,42,174,0.15)', borderRadius: '999px', padding: '6px 16px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: tokens.pink }} />
          <span style={{ fontSize: '12px', color: tokens.pink, fontFamily: 'Jost, sans-serif', fontWeight: 600, letterSpacing: '0.5px' }}>PRODUCT CATALOG</span>
        </div>
        <h1 style={{ fontFamily: 'Jost, sans-serif', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-1px', color: tokens.text }}>
          60+ AI & Data Use Cases<br /><span style={{ color: tokens.pink }}>Across 5 Industries</span>
        </h1>
        <p style={{ color: tokens.muted, fontSize: '17px', maxWidth: '560px', margin: '0 auto' }}>
          Explore how Octave Analytics delivers proven, deployable AI solutions across retail, FMCG, hospitality, banking, and more.
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px' }}>
        {CATALOG.map((industry, i) => (
          <div key={industry.id} onClick={() => onSelectIndustry(industry)}
            onMouseEnter={() => setHovered(industry.id)} onMouseLeave={() => setHovered(null)}
            style={{
              background: tokens.surface, borderRadius: '24px', padding: '28px', cursor: 'pointer',
              border: `1px solid ${hovered === industry.id ? `${industry.accent}44` : tokens.border}`,
              transform: hovered === industry.id ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)',
              boxShadow: hovered === industry.id ? `0 18px 42px ${industry.accent}18` : '0 2px 8px rgba(0,0,0,0.06)',
              opacity: visible ? 1 : 0,
              overflow: 'hidden',
              position: 'relative',
            }}>
            <div style={{ position: 'absolute', inset: '-30% -10% auto auto', width: '180px', height: '180px', borderRadius: '50%', background: `radial-gradient(circle, ${industry.accent}1C 0%, transparent 68%)`, pointerEvents: 'none' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', position: 'relative' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: `${industry.accent}12`, color: industry.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={industry.iconKey} size={30} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '11px', fontWeight: 600, color: tokens.dim, letterSpacing: '0.08em' }}>LIVE CATALOG</div>
                <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '30px', lineHeight: 1, fontWeight: 700, color: hovered === industry.id ? industry.accent : tokens.dim, transition: 'color 300ms' }}>{industry.useCaseCount}</span>
              </div>
            </div>
            <h2 style={{ fontFamily: 'Jost, sans-serif', fontSize: '22px', fontWeight: 700, color: tokens.text, marginBottom: '10px', position: 'relative' }}>{industry.name}</h2>
            <p style={{ color: tokens.muted, fontSize: '13px', lineHeight: 1.6, marginBottom: '22px', position: 'relative' }}>{industry.tagline}</p>
            <div style={{ display: 'grid', gap: '9px', marginBottom: '22px', position: 'relative' }}>
              {industry.valueChains.slice(0, 4).map((vc, idx) => (
                <div key={vc.id} style={{ display: 'grid', gridTemplateColumns: '24px 1fr auto', gap: '10px', alignItems: 'center' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '8px', background: `${vc.accent}12`, color: vc.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={vc.iconKey} size={13} />
                  </div>
                  <div style={{ position: 'relative', height: '8px', borderRadius: '999px', background: tokens.surface2, overflow: 'hidden' }}>
                    <div style={{ width: `${48 + idx * 12}%`, height: '100%', borderRadius: '999px', background: `linear-gradient(90deg, ${industry.accent}, ${vc.accent})` }} />
                  </div>
                  <span style={{ fontSize: '11px', color: tokens.muted, fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{vc.label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              <span style={{ fontSize: '12px', color: tokens.dim }}>{industry.valueChains.length} value chains</span>
              <span style={{ fontSize: '13px', color: hovered === industry.id ? industry.accent : tokens.dim, fontWeight: 600, transition: 'color 300ms' }}>Explore ecosystem →</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: '80px' }} />
    </div>
  )
}
export default HomePage
