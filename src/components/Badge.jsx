import { tokens } from '../styles/tokens'

const Badge = ({ variant = 'dim', children, style = {} }) => {
  const variants = {
    pink:    { background: 'rgba(232,42,174,0.1)', color: tokens.pink, border: '1px solid rgba(232,42,174,0.25)' },
    teal:    { background: 'rgba(38,234,159,0.12)', color: tokens.tealText, border: '1px solid rgba(38,234,159,0.28)' },
    dim:     { background: tokens.surface2, color: tokens.muted, border: `1px solid ${tokens.border}` },
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
      fontFamily: 'Jost, sans-serif', fontWeight: 600, letterSpacing: '0.5px',
      whiteSpace: 'nowrap', ...(variants[variant] || variants.dim), ...style
    }}>
      {children}
    </span>
  )
}
export default Badge
