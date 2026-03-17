import { useState, useEffect } from 'react'
import { CATALOG } from '../data/catalog'

const HomePage = ({ onSelectIndustry }) => {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(null)
  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  return (
    <div className="page-enter" style={{ minHeight: '100vh', padding: '120px 48px 120px', background: '#F7F8FA' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '72px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', background: 'rgba(232,42,174,0.06)', border: '1px solid rgba(232,42,174,0.15)', borderRadius: '999px', padding: '6px 16px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E82AAE' }} />
          <span style={{ fontSize: '12px', color: '#E82AAE', fontFamily: 'Jost, sans-serif', fontWeight: 600, letterSpacing: '0.5px' }}>PRODUCT CATALOG</span>
        </div>
        <h1 style={{ fontFamily: 'Jost, sans-serif', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-1px', color: '#1A1A2E' }}>
          60+ AI & Data Use Cases<br /><span style={{ color: '#E82AAE' }}>Across 5 Industries</span>
        </h1>
        <p style={{ color: '#6B7280', fontSize: '17px', maxWidth: '560px', margin: '0 auto' }}>
          Explore how Octave Analytics delivers proven, deployable AI solutions across retail, FMCG, hospitality, banking, and more.
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {CATALOG.map((industry, i) => (
          <div key={industry.id} onClick={() => onSelectIndustry(industry)}
            onMouseEnter={() => setHovered(industry.id)} onMouseLeave={() => setHovered(null)}
            style={{
              background: '#FFFFFF', borderRadius: '14px', padding: '28px', cursor: 'pointer',
              border: `1px solid ${hovered === industry.id ? 'rgba(232,42,174,0.2)' : 'rgba(0,0,0,0.08)'}`,
              borderTop: `3px solid ${hovered === industry.id ? '#E82AAE' : 'transparent'}`,
              transform: hovered === industry.id ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)',
              boxShadow: hovered === industry.id ? '0 12px 32px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.04)',
              opacity: visible ? 1 : 0,
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h2 style={{ fontFamily: 'Jost, sans-serif', fontSize: '20px', fontWeight: 700, color: '#1A1A2E' }}>{industry.name}</h2>
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '22px', fontWeight: 700, color: hovered === industry.id ? '#E82AAE' : '#D1D5DB', transition: 'color 300ms' }}>{industry.useCaseCount}</span>
            </div>
            <p style={{ color: '#6B7280', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>{industry.tagline}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{industry.valueChains.length} value chains</span>
              <span style={{ fontSize: '13px', color: hovered === industry.id ? '#E82AAE' : '#9CA3AF', transition: 'color 300ms' }}>Explore →</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: '80px' }} />
    </div>
  )
}
export default HomePage
