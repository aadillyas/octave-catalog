const Badge = ({ variant = 'dim', children, style = {} }) => {
  const variants = {
    pink:    { background: 'rgba(232,42,174,0.15)', color: '#E82AAE', border: '1px solid rgba(232,42,174,0.3)' },
    teal:    { background: 'rgba(38,234,159,0.12)', color: '#26EA9F', border: '1px solid rgba(38,234,159,0.25)' },
    dim:     { background: 'rgba(255,255,255,0.05)', color: '#7A7A8C', border: '1px solid rgba(255,255,255,0.08)' },
    orange:  { background: 'rgba(255,160,50,0.12)', color: '#FFA032', border: '1px solid rgba(255,160,50,0.25)' },
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '20px', fontSize: '11px',
      fontFamily: 'Jost, sans-serif', fontWeight: 600, letterSpacing: '0.5px',
      whiteSpace: 'nowrap',
      ...variants[variant],
      ...style
    }}>
      {children}
    </span>
  )
}

export default Badge
