const Badge = ({ variant = 'dim', children, style = {} }) => {
  const variants = {
    pink:    { background: 'rgba(232,42,174,0.1)', color: '#E82AAE', border: '1px solid rgba(232,42,174,0.25)' },
    teal:    { background: 'rgba(10,138,92,0.08)', color: '#0A8A5C', border: '1px solid rgba(10,138,92,0.2)' },
    dim:     { background: 'rgba(0,0,0,0.05)', color: '#6B7280', border: '1px solid rgba(0,0,0,0.08)' },
    orange:  { background: 'rgba(255,160,50,0.1)', color: '#C47A00', border: '1px solid rgba(255,160,50,0.2)' },
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
      fontFamily: 'Jost, sans-serif', fontWeight: 600, letterSpacing: '0.5px',
      whiteSpace: 'nowrap', ...variants[variant], ...style
    }}>
      {children}
    </span>
  )
}
export default Badge
