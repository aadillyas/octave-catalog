import { useState } from 'react'
import Badge from './Badge'

const UseCaseCard = ({ useCase, index, onClick }) => {
  const [hovered, setHovered] = useState(false)
  const isLive = useCase.status === 'approved' && useCase.hasDemo

  return (
    <div
      onClick={isLive ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', borderRadius: '10px',
        background: hovered && isLive ? '#F0F2F5' : '#FFFFFF',
        border: `1px solid ${hovered && isLive ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.08)'}`,
        cursor: isLive ? 'pointer' : 'default',
        opacity: isLive ? 1 : 0.5,
        transform: hovered && isLive ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 250ms cubic-bezier(0.16,1,0.3,1)',
        boxShadow: hovered && isLive ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#9CA3AF', fontWeight: 600, minWidth: '20px' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span style={{ fontSize: '14px', color: '#1A1A2E', fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
          {useCase.title || useCase}
        </span>
      </div>
      {isLive ? <Badge variant="pink">Live Demo</Badge> : <Badge variant="dim">Coming Soon</Badge>}
    </div>
  )
}
export default UseCaseCard
