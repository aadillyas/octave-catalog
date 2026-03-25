import { useState } from 'react'
import UseCaseCard from '../components/UseCaseCard'
import { Icon } from '../components/icons'

const IndustryPage = ({ industry, onSelectUseCase, onBack }) => {
  const [activeVC, setActiveVC] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)

  const handleNodeClick = (vc) => setActiveVC(prev => prev?.id === vc.id ? null : vc)
  const visibleValueChains = industry.valueChains
  const activeAccent = activeVC?.accent || industry.accent

  return (
    <div className="page-enter" style={{ minHeight: '100vh', padding: '96px clamp(20px, 4vw, 48px) 120px', background: `radial-gradient(circle at top left, ${industry.accent}14, transparent 24%), #F7F8FA` }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '13px', marginBottom: '32px', padding: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>← Back</button>
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '999px', background: `${industry.accent}10`, color: industry.accent, marginBottom: '18px' }}>
              <Icon name={industry.iconKey} size={20} />
              <span style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600, letterSpacing: '0.06em', fontSize: '12px' }}>INDUSTRY MAP</span>
            </div>
            <h1 style={{ fontFamily: 'Jost, sans-serif', fontSize: '40px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px', color: '#1A1A2E' }}>{industry.name}</h1>
            <p style={{ color: '#6B7280', fontSize: '16px', maxWidth: '720px' }}>{industry.tagline}</p>
          </div>
          <div style={{ minWidth: '250px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 12px 24px rgba(15,23,42,0.05)', borderRadius: '20px', padding: '18px 20px' }}>
            <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'Jost, sans-serif', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '10px' }}>VALUE CHAIN COVERAGE</div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <div style={{ flex: 1, borderRadius: '14px', background: '#F8FAFC', padding: '12px' }}>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>Value chains</div>
                <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1A1A2E' }}>{industry.valueChains.length}</div>
              </div>
              <div style={{ flex: 1, borderRadius: '14px', background: '#F8FAFC', padding: '12px' }}>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>Use cases</div>
                <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1A1A2E' }}>{industry.useCaseCount}</div>
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

        <div style={{ position: 'relative', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '28px', padding: '30px 24px 26px', boxShadow: '0 20px 40px rgba(15,23,42,0.06)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: '0 auto auto 0', width: '100%', height: '140px', background: `linear-gradient(180deg, ${industry.accent}08, transparent)` }} />
          <div style={{ position: 'relative', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '11px', color: industry.accent, fontFamily: 'Jost, sans-serif', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '8px' }}>VALUE CHAIN EXPLORER</div>
              <h2 style={{ fontFamily: 'Jost, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1A1A2E', marginBottom: '6px' }}>Browse the operating system of this vertical</h2>
              <p style={{ color: '#6B7280', fontSize: '14px', maxWidth: '660px' }}>Select a value-chain node to reveal the use cases beneath it. The map keeps the flow visual, while the detail panel stays focused on what is already live.</p>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F8FAFC', borderRadius: '999px', padding: '10px 14px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: activeAccent }} />
              <span style={{ fontSize: '12px', color: '#6B7280' }}>{activeVC ? `${activeVC.label} selected` : 'Select a node to explore'}</span>
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
                    textAlign: 'left', width: '100%', padding: '20px 18px', borderRadius: '20px', cursor: 'pointer', background: '#FFFFFF',
                    border: `1px solid ${isActive ? `${vc.accent}55` : hoveredNode === vc.id ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.08)'}`,
                    transform: hoveredNode === vc.id || isActive ? 'translateY(-4px)' : 'translateY(0)',
                    transition: 'all 250ms cubic-bezier(0.16,1,0.3,1)',
                    boxShadow: isActive ? `0 18px 32px ${vc.accent}18` : hoveredNode === vc.id ? '0 12px 28px rgba(15,23,42,0.08)' : '0 4px 14px rgba(15,23,42,0.04)',
                    position: 'relative',
                    zIndex: isActive ? 2 : 1,
                    minHeight: '230px',
                  }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${vc.accent}12`, color: vc.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    <Icon name={vc.iconKey} size={24} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'Jost, sans-serif', fontWeight: 600, marginBottom: '6px' }}>{String(i+1).padStart(2,'0')}</div>
                  <div style={{ fontFamily: 'Jost, sans-serif', fontWeight: 700, fontSize: '16px', color: '#1A1A2E', marginBottom: '8px', lineHeight: 1.25 }}>{vc.label}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.55, marginBottom: '16px' }}>{vc.summary}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{vc.useCases.length} cases</span>
                    <span style={{ fontSize: '10px', color: liveCount > 0 ? vc.accent : '#9CA3AF', fontFamily: 'Jost, sans-serif', fontWeight: 700, letterSpacing: '0.05em' }}>{liveCount > 0 ? `${liveCount} LIVE` : 'PLANNED'}</span>
                  </div>
                  <div style={{ position: 'absolute', left: '18px', right: '18px', bottom: '12px', height: '4px', borderRadius: '999px', background: isActive ? `linear-gradient(90deg, ${vc.accent}, transparent)` : 'rgba(148,163,184,0.12)' }} />
                </button>
              )
            })}
            </div>
          </div>
        </div>

        {activeVC && (
          <div style={{ marginTop: '20px', padding: '28px', borderRadius: '24px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', animation: 'expandDown 300ms cubic-bezier(0.16,1,0.3,1)', overflow: 'hidden', boxShadow: `0 18px 36px ${activeAccent}14` }}>
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: `${activeVC.accent}12`, color: activeVC.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={activeVC.iconKey} size={26} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '4px', color: '#1A1A2E' }}>{activeVC.label}</h3>
                  <p style={{ color: '#6B7280', fontSize: '13px', maxWidth: '700px' }}>{activeVC.summary}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ padding: '10px 12px', borderRadius: '14px', background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>TOTAL</div>
                  <div style={{ fontFamily: 'Jost, sans-serif', fontWeight: 700, color: '#1A1A2E' }}>{activeVC.useCases.length} use cases</div>
                </div>
                <div style={{ padding: '10px 12px', borderRadius: '14px', background: `${activeVC.accent}10`, border: `1px solid ${activeVC.accent}22` }}>
                  <div style={{ fontSize: '10px', color: activeVC.accent, fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>LIVE NOW</div>
                  <div style={{ fontFamily: 'Jost, sans-serif', fontWeight: 700, color: '#1A1A2E' }}>{activeVC.useCases.filter(uc => uc.status === 'approved' && uc.hasDemo).length} demos</div>
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
