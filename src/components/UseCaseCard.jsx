import { useState } from 'react'
import Badge from './Badge'
import { Icon } from './icons'

const UseCaseCard = ({ useCase, index, onClick }) => {
  const [hovered, setHovered] = useState(false)
  const isLive = useCase.status === 'approved' && useCase.hasDemo
  const accent = useCase.accent || '#6B7280'

  return (
    <div
      onClick={isLive ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '16px', padding: '16px 18px', borderRadius: '16px',
        background: hovered && isLive ? '#FBFCFF' : '#FFFFFF',
        border: `1px solid ${hovered && isLive ? `${accent}44` : 'rgba(0,0,0,0.08)'}`,
        cursor: isLive ? 'pointer' : 'default',
        opacity: isLive ? 1 : 0.5,
        transform: hovered && isLive ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 250ms cubic-bezier(0.16,1,0.3,1)',
        boxShadow: hovered && isLive ? `0 10px 24px ${accent}18` : '0 2px 8px rgba(17,24,39,0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${accent}12`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={useCase.iconKey} size={20} />
        </div>
        <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#9CA3AF', fontWeight: 600, minWidth: '20px', flexShrink: 0 }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span style={{ fontSize: '14px', color: '#1A1A2E', fontFamily: 'Jost, sans-serif', fontWeight: 600, minWidth: 0 }}>
          {useCase.title || useCase}
        </span>
      </div>
      {isLive ? <Badge variant="pink">Live Demo</Badge> : <Badge variant="dim">Coming Soon</Badge>}
    </div>
  )
}
export default UseCaseCard
