import { useState } from 'react'
import Badge from '../components/Badge'

const UseCasePage = ({ useCase, industry, valueChain, onBack, onSelectUseCase, catalog }) => {
  const [hovered, setHovered] = useState(false)

  const launchDemo = () => { if (useCase.demoPath) window.open(useCase.demoPath, '_blank') }

  const col = (title, icon, content) => (
    <div style={{ flex: 1, background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <span style={{ color: '#E82AAE', fontSize: '16px' }}>{icon}</span>
        <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '16px', fontWeight: 700, color: '#1A1A2E' }}>{title}</h3>
      </div>
      {content}
    </div>
  )

  const inputCol = col('Input', '↓',
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6 }}>{useCase.input?.summary}</p>
      {useCase.input?.sources?.map((s, i) => (
        <div key={i} style={{ display: 'flex', gap: '10px' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(232,42,174,0.08)', border: '1px solid rgba(232,42,174,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#E82AAE', fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A2E', fontFamily: 'Jost, sans-serif', marginBottom: '2px' }}>{s.name}</div>
            <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>{s.description}</div>
          </div>
        </div>
      ))}
    </div>
  )

  const modelCol = col('Model', '⬡',
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6, marginBottom: '14px' }}>{useCase.model?.summary}</p>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: '11px', top: '22px', bottom: '22px', width: '1px', background: 'linear-gradient(to bottom, #E82AAE, rgba(232,42,174,0.1))' }} />
        {useCase.model?.stages?.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: i < useCase.model.stages.length - 1 ? '16px' : '0', position: 'relative' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#E82AAE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#fff', fontWeight: 700, flexShrink: 0, zIndex: 1 }}>{i+1}</div>
            <div style={{ paddingTop: '3px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A2E', fontFamily: 'Jost, sans-serif', marginBottom: '2px' }}>{s.name}</div>
              <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>{s.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const outputCol = col('Output', '↑',
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6 }}>{useCase.output?.summary}</p>
      {[{ label: 'Delivery', value: useCase.output?.delivery }, { label: 'Action', value: useCase.output?.action }].map(item => (
        <div key={item.label} style={{ background: '#F7F8FA', borderRadius: '8px', padding: '12px' }}>
          <div style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'Jost, sans-serif', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '4px' }}>{item.label.toUpperCase()}</div>
          <div style={{ fontSize: '12px', color: '#1A1A2E', lineHeight: 1.5 }}>{item.value}</div>
        </div>
      ))}
      {useCase.output?.result && (
        <div style={{ background: 'rgba(10,138,92,0.06)', border: '1px solid rgba(10,138,92,0.15)', borderRadius: '8px', padding: '12px' }}>
          <div style={{ fontSize: '10px', color: '#0A8A5C', fontFamily: 'Jost, sans-serif', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '4px' }}>PROVEN RESULTS</div>
          <div style={{ fontSize: '12px', color: '#1A1A2E', lineHeight: 1.5 }}>{useCase.output.result}</div>
        </div>
      )}
    </div>
  )

  // Resolve related use cases from catalog
  const relatedResolved = (useCase.related || []).map(r => {
    if (!catalog) return r
    for (const ind of catalog) {
      for (const vc of ind.valueChains) {
        const match = vc.useCases.find(u => (u.id === r.id) || (u.title === r.title))
        if (match) return { ...r, ...match, industryObj: ind, vcObj: vc }
      }
    }
    return r
  })

  return (
    <div className="page-enter" style={{ minHeight: '100vh', paddingTop: '56px', background: '#F7F8FA' }}>

      {/* Hero header */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid rgba(0,0,0,0.08)', padding: '32px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '13px', padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>← Back</button>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                {useCase.hasDemo && <Badge variant="pink">Live Demo</Badge>}
                {industry && <Badge variant="dim">{industry.name}</Badge>}
                {valueChain && <Badge variant="dim">{valueChain.label}</Badge>}
              </div>
              <h1 style={{ fontFamily: 'Jost, sans-serif', fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px', color: '#1A1A2E' }}>{useCase.title}</h1>
              <p style={{ color: '#6B7280', fontSize: '15px', maxWidth: '600px', lineHeight: 1.6 }}>{useCase.tagline}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '260px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[{ label: 'Complexity', value: useCase.complexity }, { label: 'Deploy', value: useCase.deployTime }].map(k => (
                  <div key={k.label} style={{ flex: 1, background: '#F7F8FA', borderRadius: '10px', padding: '12px 16px', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'Jost, sans-serif', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '3px' }}>{k.label.toUpperCase()}</div>
                    <div style={{ fontSize: '13px', color: '#1A1A2E', fontWeight: 600 }}>{k.value || '—'}</div>
                  </div>
                ))}
              </div>
              {useCase.roi && (
                <div style={{ background: 'rgba(10,138,92,0.06)', border: '1px solid rgba(10,138,92,0.15)', borderRadius: '10px', padding: '12px 16px' }}>
                  <div style={{ fontSize: '10px', color: '#0A8A5C', fontFamily: 'Jost, sans-serif', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '3px' }}>ROI</div>
                  <div style={{ fontSize: '13px', color: '#1A1A2E', fontWeight: 600 }}>{useCase.roi}</div>
                </div>
              )}
              {useCase.hasDemo && (
                <button onClick={launchDemo} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
                  style={{ background: hovered ? '#c4228f' : '#E82AAE', border: 'none', borderRadius: '10px', padding: '14px 24px', color: '#fff', fontSize: '15px', fontFamily: 'Jost, sans-serif', fontWeight: 700, cursor: 'pointer', transition: 'background 200ms', width: '100%' }}>
                  Launch Interactive Demo →
                </button>
              )}
            </div>
          </div>
          {useCase.overview && (
            <p style={{ color: '#1A1A2E', fontSize: '14px', lineHeight: 1.8, maxWidth: '680px', borderLeft: '3px solid rgba(232,42,174,0.4)', paddingLeft: '16px', marginTop: '20px' }}>
              {useCase.overview}
            </p>
          )}
        </div>
      </div>

      {/* 3-column horizontal layout */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 48px 48px' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          {inputCol}
          <div style={{ display: 'flex', alignItems: 'center', paddingTop: '60px', color: '#9CA3AF', fontSize: '20px' }}>→</div>
          {modelCol}
          <div style={{ display: 'flex', alignItems: 'center', paddingTop: '60px', color: '#9CA3AF', fontSize: '20px' }}>→</div>
          {outputCol}
        </div>
      </div>

      {/* Related use cases */}
      {relatedResolved.length > 0 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px 120px' }}>
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '40px' }}>
            <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '18px', fontWeight: 700, color: '#1A1A2E', marginBottom: '6px' }}>
              You should also look at
            </h3>
            <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '24px' }}>
              Related use cases that complement or extend this solution
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {relatedResolved.map((r, i) => {
                const isClickable = r.hasDemo && onSelectUseCase
                return (
                  <div key={i}
                    onClick={() => isClickable && onSelectUseCase(r, r.vcObj)}
                    style={{
                      background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px',
                      padding: '20px', cursor: isClickable ? 'pointer' : 'default',
                      transition: 'all 200ms', boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    }}
                    onMouseEnter={e => { if (isClickable) { e.currentTarget.style.borderColor = 'rgba(232,42,174,0.3)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)' } }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{r.industry}</span>
                      {r.hasDemo && <Badge variant="pink">Live Demo</Badge>}
                    </div>
                    <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 700, color: '#1A1A2E', marginBottom: '8px' }}>{r.title}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>{r.reason}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default UseCasePage
