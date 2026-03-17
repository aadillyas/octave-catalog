import { useState } from 'react'
import UseCaseCard from '../components/UseCaseCard'

const IndustryPage = ({ industry, onSelectUseCase, onBack }) => {
  const [activeVC, setActiveVC] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)

  const handleNodeClick = (vc) => setActiveVC(prev => prev?.id === vc.id ? null : vc)

  return (
    <div className="page-enter" style={{ minHeight: '100vh', padding: '96px 48px 120px', background: '#F7F8FA' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '13px', marginBottom: '32px', padding: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>← Back</button>
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontFamily: 'Jost, sans-serif', fontSize: '40px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px', color: '#1A1A2E' }}>{industry.name}</h1>
          <p style={{ color: '#6B7280', fontSize: '16px' }}>{industry.tagline}</p>
        </div>

        <div style={{ overflowX: 'auto', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', minWidth: 'max-content' }}>
            {industry.valueChains.map((vc, i) => {
              const isActive = activeVC?.id === vc.id
              const liveCount = vc.useCases.filter(u => u.status === 'approved' && u.hasDemo).length
              return (
                <div key={vc.id} style={{ display: 'flex', alignItems: 'center' }}>
                  {i > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '32px', height: '1px', background: 'rgba(0,0,0,0.15)' }} />
                      <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '7px solid rgba(0,0,0,0.15)' }} />
                    </div>
                  )}
                  <div onClick={() => handleNodeClick(vc)} onMouseEnter={() => setHoveredNode(vc.id)} onMouseLeave={() => setHoveredNode(null)}
                    style={{
                      width: '180px', padding: '18px 16px', borderRadius: '12px', cursor: 'pointer',
                      background: isActive ? '#FFFFFF' : '#FFFFFF',
                      border: `1px solid ${isActive ? '#E82AAE' : hoveredNode === vc.id ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.08)'}`,
                      borderTop: `3px solid ${isActive ? '#E82AAE' : 'transparent'}`,
                      transform: hoveredNode === vc.id || isActive ? 'translateY(-4px)' : 'translateY(0)',
                      transition: 'all 250ms cubic-bezier(0.16,1,0.3,1)',
                      boxShadow: isActive ? '0 8px 24px rgba(232,42,174,0.12)' : hoveredNode === vc.id ? '0 4px 12px rgba(0,0,0,0.08)' : '0 2px 6px rgba(0,0,0,0.04)',
                      position: 'relative',
                    }}>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'Jost, sans-serif', fontWeight: 600, marginBottom: '6px' }}>{String(i+1).padStart(2,'0')}</div>
                    <div style={{ fontFamily: 'Jost, sans-serif', fontWeight: 600, fontSize: '13px', color: '#1A1A2E', marginBottom: '6px', lineHeight: 1.3 }}>{vc.label}</div>
                    <div style={{ fontSize: '11px', color: '#6B7280', lineHeight: 1.4, marginBottom: '10px' }}>{vc.summary}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{vc.useCases.length} cases</span>
                      {liveCount > 0 && <span style={{ fontSize: '10px', color: '#E82AAE', fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{liveCount} live</span>}
                    </div>
                    <div style={{ position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: `8px solid ${isActive ? '#E82AAE' : 'transparent'}`, transition: 'border-top-color 200ms' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {activeVC && (
          <div style={{ marginTop: '16px', padding: '28px', borderRadius: '14px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', animation: 'expandDown 300ms cubic-bezier(0.16,1,0.3,1)', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '18px', fontWeight: 700, marginBottom: '4px', color: '#1A1A2E' }}>{activeVC.label}</h3>
              <p style={{ color: '#6B7280', fontSize: '13px' }}>{activeVC.summary}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
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
