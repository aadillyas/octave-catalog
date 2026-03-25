import { useState } from 'react'
import UseCaseCard from '../components/UseCaseCard'
import { Icon } from '../components/icons'
import { tokens } from '../styles/tokens'

const IndustryPage = ({ industry, onSelectUseCase, onBack }) => {
  const [activeVC, setActiveVC] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)

  const handleNodeClick = (vc) => setActiveVC(prev => prev?.id === vc.id ? null : vc)
  const visibleValueChains = industry.valueChains
  const activeAccent = activeVC?.accent || industry.accent

  return (
    <div className="page-enter" style={{ minHeight: '100vh', padding: '96px clamp(20px, 4vw, 48px) 120px', background: `radial-gradient(circle at top left, ${industry.accent}14, transparent 24%), ${tokens.bg}` }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: tokens.muted, cursor: 'pointer', fontSize: '13px', marginBottom: '32px', padding: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>← Back</button>
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '999px', background: `${industry.accent}10`, color: industry.accent, marginBottom: '18px' }}>
              <Icon name={industry.iconKey} size={20} />
              <span style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600, letterSpacing: '0.06em', fontSize: '12px' }}>INDUSTRY MAP</span>
            </div>
            <h1 style={{ fontFamily: 'Jost, sans-serif', fontSize: '40px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px', color: tokens.text }}>{industry.name}</h1>
            <p style={{ color: tokens.muted, fontSize: '16px', maxWidth: '720px' }}>{industry.tagline}</p>
          </div>
          <div style={{ minWidth: '250px', background: tokens.surface, border: `1px solid ${tokens.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderRadius: '20px', padding: '18px 20px' }}>
            <div style={{ fontSize: '11px', color: tokens.dim, fontFamily: 'Jost, sans-serif', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '10px' }}>VALUE CHAIN COVERAGE</div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <div style={{ flex: 1, borderRadius: '14px', background: tokens.surface2, padding: '12px' }}>
                <div style={{ fontSize: '12px', color: tokens.muted }}>Value chains</div>
                <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '24px', fontWeight: 700, color: tokens.text }}>{industry.valueChains.length}</div>
              </div>
              <div style={{ flex: 1, borderRadius: '14px', background: tokens.surface2, padding: '12px' }}>
                <div style={{ fontSize: '12px', color: tokens.muted }}>Use cases</div>
                <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '24px', fontWeight: 700, color: tokens.text }}>{industry.useCaseCount}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {visibleValueChains.slice(0, 5).map(vc => (
                <div key={vc.id} style={{ padding: '6px 10px', borderRadius: '999px', background: `${vc.accent}12`, color: vc.accent, display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                  <Icon name={vc.iconKey} size={12} />
                  {vc.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: '28px', padding: '30px 24px 26px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: '0 auto auto 0', width: '100%', height: '140px', background: `linear-gradient(180deg, ${industry.accent}08, transparent)` }} />
          <div style={{ position: 'relative', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '11px', color: industry.accent, fontFamily: 'Jost, sans-serif', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '8px' }}>VALUE CHAIN EXPLORER</div>
              <h2 style={{ fontFamily: 'Jost, sans-serif', fontSize: '24px', fontWeight: 700, color: tokens.text, marginBottom: '6px' }}>Browse the operating system of this vertical</h2>
              <p style={{ color: tokens.muted, fontSize: '14px', maxWidth: '660px' }}>Select a value-chain node to reveal the use cases beneath it. The map keeps the flow visual, while the detail panel stays focused on what is already live.</p>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: tokens.surface2, borderRadius: '999px', padding: '10px 14px', border: `1px solid ${tokens.border}` }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: activeAccent }} />
              <span style={{ fontSize: '12px', color: tokens.muted }}>{activeVC ? `${activeVC.label} selected` : 'Select a node to explore'}</span>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '6%', right: '6%', height: '2px', background: `linear-gradient(90deg, transparent, ${industry.accent}30 12%, ${industry.accent}24 88%, transparent)`, transform: 'translateY(-50%)' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '18px', position: 'relative' }}>
            {industry.valueChains.map((vc, i) => {
              const isActive = activeVC?.id === vc.id
              const liveCount = vc.useCases.filter(u => u.status === 'approved' && u.hasDemo).length
              return (
                <button key={vc.id} onClick={() => handleNodeClick(vc)} onMouseEnter={() => setHoveredNode(vc.id)} onMouseLeave={() => setHoveredNode(null)}
                  style={{
                    appearance: 'none',
                    textAlign: 'left', width: '100%', padding: '20px 18px', borderRadius: '20px', cursor: 'pointer', background: tokens.surface,
                    border: `1px solid ${isActive ? `${vc.accent}55` : hoveredNode === vc.id ? tokens.border2 : tokens.border}`,
                    transform: hoveredNode === vc.id || isActive ? 'translateY(-4px)' : 'translateY(0)',
                    transition: 'all 250ms cubic-bezier(0.16,1,0.3,1)',
                    boxShadow: isActive ? `0 12px 24px ${vc.accent}16` : hoveredNode === vc.id ? '0 4px 12px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.06)',
                    position: 'relative',
                    zIndex: isActive ? 2 : 1,
                    minHeight: '230px',
                  }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${vc.accent}12`, color: vc.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    <Icon name={vc.iconKey} size={24} />
                  </div>
                  <div style={{ fontSize: '11px', color: tokens.dim, fontFamily: 'Jost, sans-serif', fontWeight: 600, marginBottom: '6px' }}>{String(i+1).padStart(2,'0')}</div>
                  <div style={{ fontFamily: 'Jost, sans-serif', fontWeight: 700, fontSize: '16px', color: tokens.text, marginBottom: '8px', lineHeight: 1.25 }}>{vc.label}</div>
                  <div style={{ fontSize: '12px', color: tokens.muted, lineHeight: 1.55, marginBottom: '16px' }}>{vc.summary}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <span style={{ fontSize: '11px', color: tokens.dim }}>{vc.useCases.length} cases</span>
                    <span style={{ fontSize: '10px', color: liveCount > 0 ? tokens.tealText : tokens.dim, fontFamily: 'Jost, sans-serif', fontWeight: 700, letterSpacing: '0.05em' }}>{liveCount > 0 ? `${liveCount} LIVE` : 'PLANNED'}</span>
                  </div>
                  <div style={{ position: 'absolute', left: '18px', right: '18px', bottom: '12px', height: '4px', borderRadius: '999px', background: isActive ? `linear-gradient(90deg, ${vc.accent}, transparent)` : tokens.surface2 }} />
                </button>
              )
            })}
            </div>
          </div>
        </div>

        {activeVC && (
          <div style={{ marginTop: '20px', padding: '28px', borderRadius: '24px', background: tokens.surface, border: `1px solid ${tokens.border}`, animation: 'expandDown 300ms cubic-bezier(0.16,1,0.3,1)', overflow: 'hidden', boxShadow: `0 4px 16px ${activeAccent}14` }}>
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: `${activeVC.accent}12`, color: activeVC.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={activeVC.iconKey} size={26} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '4px', color: tokens.text }}>{activeVC.label}</h3>
                  <p style={{ color: tokens.muted, fontSize: '13px', maxWidth: '700px' }}>{activeVC.summary}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ padding: '10px 12px', borderRadius: '14px', background: tokens.surface2, border: `1px solid ${tokens.border}` }}>
                  <div style={{ fontSize: '10px', color: tokens.dim, fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>TOTAL</div>
                  <div style={{ fontFamily: 'Jost, sans-serif', fontWeight: 700, color: tokens.text }}>{activeVC.useCases.length} use cases</div>
                </div>
                <div style={{ padding: '10px 12px', borderRadius: '14px', background: `${activeVC.accent}10`, border: `1px solid ${activeVC.accent}22` }}>
                  <div style={{ fontSize: '10px', color: activeVC.accent, fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>LIVE NOW</div>
                  <div style={{ fontFamily: 'Jost, sans-serif', fontWeight: 700, color: tokens.text }}>{activeVC.useCases.filter(uc => uc.status === 'approved' && uc.hasDemo).length} demos</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {activeVC.useCases.map((uc, i) => (
                <UseCaseCard key={i} useCase={uc} index={i} onClick={() => { if (uc.status === 'approved' && uc.hasDemo) onSelectUseCase(uc, activeVC) }} />
              ))}
            </div>
          </div>
        )}
        <div style={{ height: '80px' }} />
      </div>
    </div>
  )
}
export default IndustryPage
