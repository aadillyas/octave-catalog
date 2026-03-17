import { useState } from 'react'
import Badge from './Badge'

const UseCaseCard = ({ useCase, index, onClick }) => {
  const [hovered, setHovered] = useState(false)
  const isLive = useCase.status === 'approved' && useCase.hasDemo
  const isClickable = isLive

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', borderRadius: '10px',
        background: hovered && isClickable ? '#16161C' : '#111115',
        border: `1px solid ${hovered && isClickable ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'}`,
        cursor: isClickable ? 'pointer' : 'default',
        opacity: isClickable ? 1 : 0.5,
        transform: hovered && isClickable ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 250ms cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '12px', color: '#3A3A4A', fontWeight: 600, minWidth: '20px' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span style={{ fontSize: '14px', color: '#F0F0F5', fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
          {useCase.title || useCase}
        </span>
      </div>
      {isLive
        ? <Badge variant="pink">Live Demo</Badge>
        : <Badge variant="dim">Coming Soon</Badge>
      }
    </div>
  )
}

export default UseCaseCard
