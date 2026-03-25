import { useState } from 'react'
import Badge from '../components/Badge'
import { Icon } from '../components/icons'
import { tokens } from '../styles/tokens'

const cardBase = {
  background: tokens.surface,
  border: `1px solid ${tokens.border}`,
  borderRadius: '22px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
}

const FlowPanel = ({ title, icon, accent, eyebrow, children }) => (
  <div style={{ ...cardBase, padding: '22px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: '0 auto auto 0', width: '100%', height: '96px', background: `linear-gradient(180deg, ${accent}10, transparent)` }} />
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '18px' }}>
        <div>
          <div style={{ fontSize: '11px', color: accent, fontFamily: 'Jost, sans-serif', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '8px' }}>{eyebrow}</div>
          <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '18px', fontWeight: 700, color: tokens.text }}>{title}</h3>
        </div>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${accent}12`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={icon} size={24} />
        </div>
      </div>
      {children}
    </div>
  </div>
)

const MetricCard = ({ label, value, accent }) => (
  <div style={{ flex: 1, minWidth: '120px', background: tokens.surface2, borderRadius: '14px', padding: '12px 16px', border: `1px solid ${tokens.border}` }}>
    <div style={{ fontSize: '10px', color: tokens.dim, fontFamily: 'Jost, sans-serif', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '4px' }}>{label}</div>
    <div style={{ fontSize: '14px', color: accent || tokens.text, fontWeight: 700 }}>{value || '—'}</div>
  </div>
)

const UseCasePage = ({ useCase, industry, valueChain, onBack, onSelectUseCase, catalog }) => {
  const [hovered, setHovered] = useState(false)
  const accent = useCase.accent || valueChain?.accent || industry?.accent || '#E82AAE'

  const launchDemo = () => { if (useCase.demoPath) window.open(useCase.demoPath, '_blank') }

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

  const flowLegend = [
    { label: 'Input', icon: 'input', accent: tokens.pink },
    { label: 'Model', icon: 'model', accent: tokens.pink },
    { label: 'Output', icon: 'output', accent: tokens.tealText },
  ]

  return (
    <div className="page-enter" style={{ minHeight: '100vh', paddingTop: '56px', background: `radial-gradient(circle at top, ${accent}12, transparent 28%), ${tokens.bg}` }}>
      <div style={{ background: tokens.surface, borderBottom: `1px solid ${tokens.border}`, padding: '36px clamp(20px, 4vw, 48px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: tokens.muted, cursor: 'pointer', fontSize: '13px', padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>← Back</button>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '28px', flexWrap: 'wrap' }}>
            <div style={{ maxWidth: '720px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {useCase.hasDemo && <Badge variant="pink">Live Demo</Badge>}
                {industry && <Badge variant="dim">{industry.name}</Badge>}
                {valueChain && <Badge variant="dim">{valueChain.label}</Badge>}
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ width: '66px', height: '66px', borderRadius: '20px', background: `${accent}12`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={useCase.iconKey} size={32} />
                </div>
                <div>
                  <h1 style={{ fontFamily: 'Jost, sans-serif', fontSize: '32px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '8px', color: tokens.text }}>{useCase.title}</h1>
                  <p style={{ color: tokens.muted, fontSize: '15px', maxWidth: '600px', lineHeight: 1.6 }}>{useCase.tagline}</p>
                </div>
              </div>
              {useCase.overview && (
                <p style={{ color: tokens.text, fontSize: '14px', lineHeight: 1.8, maxWidth: '680px', borderLeft: `3px solid ${accent}66`, paddingLeft: '16px', marginTop: '20px' }}>
                  {useCase.overview}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '310px', flex: '1 1 320px' }}>
              <div style={{ ...cardBase, padding: '18px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <MetricCard label="COMPLEXITY" value={useCase.complexity} accent={accent} />
                  <MetricCard label="DEPLOY" value={useCase.deployTime} accent={accent} />
                </div>
                {useCase.roi && (
                  <div style={{ borderRadius: '16px', padding: '14px 16px', background: `${accent}0E`, border: `1px solid ${accent}22` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', color: accent }}>
                      <Icon name="results" size={16} />
                      <div style={{ fontSize: '10px', fontFamily: 'Jost, sans-serif', fontWeight: 700, letterSpacing: '0.08em' }}>ROI SIGNAL</div>
                    </div>
                    <div style={{ fontSize: '14px', color: tokens.text, fontWeight: 700 }}>{useCase.roi}</div>
                  </div>
                )}
              </div>
              {useCase.hasDemo && (
                <button
                  onClick={launchDemo}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  style={{
                    background: hovered ? tokens.text : accent,
                    border: 'none',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    color: '#fff',
                    fontSize: '15px',
                    fontFamily: 'Jost, sans-serif',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 200ms',
                    width: '100%',
                    boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.12)' : `0 4px 12px ${accent}22`,
                  }}
                >
                  Launch Interactive Demo →
                </button>
              )}
              <div style={{ ...cardBase, padding: '16px 18px' }}>
                <div style={{ fontSize: '11px', color: tokens.dim, fontFamily: 'Jost, sans-serif', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '10px' }}>FLOW LEGEND</div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {flowLegend.map(item => (
                    <div key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '999px', background: `${item.accent}12`, color: item.accent, fontSize: '12px', fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>
                      <Icon name={item.icon} size={14} />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px clamp(20px, 4vw, 48px) 48px' }}>
        <div style={{ ...cardBase, padding: '26px', overflow: 'hidden' }}>
          <div style={{ marginBottom: '22px' }}>
            <div style={{ fontSize: '11px', color: accent, fontFamily: 'Jost, sans-serif', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '8px' }}>SOLUTION FLOW</div>
            <h2 style={{ fontFamily: 'Jost, sans-serif', fontSize: '24px', fontWeight: 700, color: tokens.text, marginBottom: '8px' }}>How the data becomes a deployable decision</h2>
            <p style={{ color: tokens.muted, fontSize: '14px', maxWidth: '780px' }}>The page now reads as a flow instead of three isolated text columns: source signals feed the model spine, then the outcome turns into a concrete operating action.</p>
          </div>

          <div className="usecase-flow-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1.2fr) 110px minmax(280px, 1fr) 110px minmax(280px, 1.05fr)', gap: '0', alignItems: 'stretch' }}>
            <FlowPanel title="Input Signals" icon="input" accent={tokens.pink} eyebrow="INPUT">
              <p style={{ fontSize: '13px', color: tokens.muted, lineHeight: 1.65, marginBottom: '16px' }}>{useCase.input?.summary || 'Key signals entering the workflow.'}</p>
              <div style={{ display: 'grid', gap: '12px' }}>
                {(useCase.input?.sources || []).map((source, i) => (
                  <div key={i} style={{ border: `1px solid ${tokens.border}`, background: tokens.surface2, borderRadius: '16px', padding: '14px 14px 14px 12px', display: 'grid', gridTemplateColumns: '38px 1fr', gap: '12px', alignItems: 'start' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: `${source.accent || tokens.pink}12`, color: source.accent || tokens.pink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={source.iconKey} size={18} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: tokens.text, fontFamily: 'Jost, sans-serif' }}>{source.name}</div>
                        <div style={{ fontSize: '10px', color: tokens.dim, fontFamily: 'Jost, sans-serif', fontWeight: 700, letterSpacing: '0.08em' }}>SOURCE {String(i + 1).padStart(2, '0')}</div>
                      </div>
                      <div style={{ fontSize: '12px', color: tokens.muted, lineHeight: 1.55 }}>{source.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </FlowPanel>

            <div className="usecase-flow-connector" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <svg viewBox="0 0 120 520" style={{ width: '100%', height: '100%', minHeight: '280px', overflow: 'visible' }}>
                <path d="M20 90 C60 90, 56 260, 96 260" stroke={tokens.pink} strokeOpacity="0.28" strokeWidth="2.5" fill="none" />
                <path d="M20 430 C60 430, 56 260, 96 260" stroke={tokens.pink} strokeOpacity="0.14" strokeWidth="2.5" fill="none" />
                <circle cx="96" cy="260" r="9" fill={tokens.pink} fillOpacity="0.15" />
                <circle cx="96" cy="260" r="4" fill={tokens.pink} />
              </svg>
            </div>

            <FlowPanel title="Model Spine" icon="model" accent={tokens.pink} eyebrow="MODEL">
              <p style={{ fontSize: '13px', color: tokens.muted, lineHeight: 1.65, marginBottom: '18px' }}>{useCase.model?.summary || 'Core modeling logic and sequencing.'}</p>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '19px', top: '22px', bottom: '22px', width: '2px', background: `linear-gradient(180deg, ${tokens.pink}, rgba(232,42,174,0.08))` }} />
                <div style={{ display: 'grid', gap: '14px' }}>
                  {(useCase.model?.stages || []).map((stage, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: '14px', position: 'relative' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: tokens.pink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, fontFamily: 'Jost, sans-serif', zIndex: 1 }}>{i + 1}</div>
                      <div style={{ borderRadius: '16px', border: `1px solid ${tokens.border}`, background: tokens.surface2, padding: '14px 14px 14px 16px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: tokens.text, fontFamily: 'Jost, sans-serif', marginBottom: '4px' }}>{stage.name}</div>
                        <div style={{ fontSize: '12px', color: tokens.muted, lineHeight: 1.55 }}>{stage.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FlowPanel>

            <div className="usecase-flow-connector" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <svg viewBox="0 0 120 520" style={{ width: '100%', height: '100%', minHeight: '280px', overflow: 'visible' }}>
                <path d="M18 260 C58 260, 60 100, 100 100" stroke={tokens.tealText} strokeOpacity="0.28" strokeWidth="2.5" fill="none" />
                <path d="M18 260 C58 260, 60 420, 100 420" stroke={tokens.tealText} strokeOpacity="0.18" strokeWidth="2.5" fill="none" />
                <circle cx="18" cy="260" r="9" fill={tokens.teal} fillOpacity="0.2" />
                <circle cx="18" cy="260" r="4" fill={tokens.tealText} />
              </svg>
            </div>

            <FlowPanel title="Operational Output" icon="output" accent={tokens.tealText} eyebrow="OUTPUT">
              <p style={{ fontSize: '13px', color: tokens.muted, lineHeight: 1.65, marginBottom: '16px' }}>{useCase.output?.summary || 'Decisioning outputs and next actions.'}</p>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { label: 'Delivery', value: useCase.output?.delivery, icon: 'delivery', accent: tokens.tealText },
                  { label: 'Action', value: useCase.output?.action, icon: 'action', accent: tokens.pink },
                ].map(item => (
                  <div key={item.label} style={{ borderRadius: '16px', border: `1px solid ${tokens.border}`, background: tokens.surface2, padding: '14px', display: 'grid', gridTemplateColumns: '40px 1fr', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${item.accent}12`, color: item.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={item.icon} size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: tokens.dim, fontFamily: 'Jost, sans-serif', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '4px' }}>{item.label.toUpperCase()}</div>
                      <div style={{ fontSize: '12px', color: tokens.text, lineHeight: 1.55 }}>{item.value || '—'}</div>
                    </div>
                  </div>
                ))}
                {useCase.output?.result && (
                  <div style={{ borderRadius: '18px', padding: '16px', background: 'rgba(38,234,159,0.12)', border: '1px solid rgba(38,234,159,0.28)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: tokens.tealText, marginBottom: '8px' }}>
                      <Icon name="results" size={16} />
                      <div style={{ fontSize: '10px', fontFamily: 'Jost, sans-serif', fontWeight: 700, letterSpacing: '0.08em' }}>PROVEN RESULTS</div>
                    </div>
                    <div style={{ fontSize: '12px', color: tokens.text, lineHeight: 1.6 }}>{useCase.output.result}</div>
                  </div>
                )}
              </div>
            </FlowPanel>
          </div>
        </div>
      </div>

      {relatedResolved.length > 0 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(20px, 4vw, 48px) 120px' }}>
          <div style={{ borderTop: `1px solid ${tokens.border}`, paddingTop: '40px' }}>
            <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '18px', fontWeight: 700, color: tokens.text, marginBottom: '6px' }}>
              You should also look at
            </h3>
            <p style={{ color: tokens.muted, fontSize: '13px', marginBottom: '24px' }}>
              Related use cases that complement or extend this solution
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {relatedResolved.map((r, i) => {
                const isClickable = r.hasDemo && onSelectUseCase
                const relatedAccent = r.accent || tokens.pink
                return (
                  <div key={i}
                    onClick={() => isClickable && onSelectUseCase(r, r.vcObj)}
                    style={{
                      background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: '18px',
                      padding: '20px', cursor: isClickable ? 'pointer' : 'default',
                      transition: 'all 200ms', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                    onMouseEnter={e => { if (isClickable) { e.currentTarget.style.borderColor = `${relatedAccent}44`; e.currentTarget.style.boxShadow = `0 4px 12px ${relatedAccent}14` } }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = tokens.border; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${relatedAccent}12`, color: relatedAccent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon name={r.iconKey} size={18} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '11px', color: tokens.dim, fontFamily: 'Jost, sans-serif', fontWeight: 600 }}>{r.industry}</span>
                          {r.hasDemo && <Badge variant="pink">Live Demo</Badge>}
                        </div>
                        <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 700, color: tokens.text, marginBottom: '8px' }}>{r.title}</div>
                        <div style={{ fontSize: '12px', color: tokens.muted, lineHeight: 1.5 }}>{r.reason}</div>
                      </div>
                    </div>
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
