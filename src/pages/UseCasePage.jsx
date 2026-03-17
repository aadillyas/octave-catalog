import { useState, useEffect } from 'react'
import Badge from '../components/Badge'

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: '◈' },
  { id: 'input',    label: 'Input',    icon: '↓' },
  { id: 'model',    label: 'Model',    icon: '⬡' },
  { id: 'output',   label: 'Output',   icon: '↑' },
]

const UseCasePage = ({ useCase, industry, valueChain, onBack }) => {
  const [activeSection, setActiveSection] = useState('overview')
  const [hovered, setHovered] = useState(false)

  const scrollTo = (id) => {
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(id)
  }

  useEffect(() => {
    const handler = () => {
      for (const s of [...SECTIONS].reverse()) {
        const el = document.getElementById(`section-${s.id}`)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 140) { setActiveSection(s.id); break }
        }
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const launchDemo = () => {
    if (useCase.demoPath) window.open(useCase.demoPath, '_blank')
  }

  const sectionCard = (children) => (
    <div style={{
      background: '#111115', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '14px', padding: '28px', marginBottom: '16px',
    }}>
      {children}
    </div>
  )

  return (
    <div className="page-enter" style={{ minHeight: '100vh', display: 'flex', paddingTop: '56px' }}>

      {/* Sticky left rail */}
      <aside style={{
        width: '220px', flexShrink: 0, position: 'sticky', top: '56px',
        height: 'calc(100vh - 56px)', overflowY: 'auto',
        padding: '32px 24px', borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column',
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: '#7A7A8C', cursor: 'pointer',
          fontSize: '12px', padding: 0, textAlign: 'left', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Back
        </button>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 700,
            color: '#F0F0F5', marginBottom: '6px', lineHeight: 1.3 }}>
            {useCase.title}
          </div>
          <div style={{ fontSize: '11px', color: '#7A7A8C' }}>
            {industry?.name} · {valueChain?.label}
          </div>
        </div>

        {/* KPIs */}
        <div style={{ background: '#0A0A0C', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
          {[
            { label: 'Complexity', value: useCase.complexity },
            { label: 'Deploy time', value: useCase.deployTime },
            { label: 'ROI', value: useCase.roi },
          ].map(k => (
            <div key={k.label} style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', color: '#3A3A4A', fontFamily: 'Jost, sans-serif',
                fontWeight: 600, letterSpacing: '0.5px', marginBottom: '3px' }}>
                {k.label.toUpperCase()}
              </div>
              <div style={{ fontSize: '12px', color: '#F0F0F5', lineHeight: 1.4 }}>{k.value || '—'}</div>
            </div>
          ))}
        </div>

        {/* Launch Demo CTA */}
        {useCase.hasDemo && (
          <button
            onClick={launchDemo}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              background: hovered ? '#c4228f' : '#E82AAE', border: 'none', borderRadius: '10px',
              padding: '12px', color: '#fff', fontSize: '13px', fontFamily: 'Jost, sans-serif',
              fontWeight: 700, cursor: 'pointer', width: '100%', transition: 'background 200ms',
              marginBottom: '20px',
            }}
          >
            Launch Demo →
          </button>
        )}

        {/* Section nav */}
        <div style={{ fontSize: '10px', color: '#3A3A4A', fontFamily: 'Jost, sans-serif',
          fontWeight: 600, letterSpacing: '0.5px', marginBottom: '8px' }}>
          SECTIONS
        </div>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => scrollTo(s.id)} style={{
            background: activeSection === s.id ? 'rgba(232,42,174,0.08)' : 'none',
            border: `1px solid ${activeSection === s.id ? 'rgba(232,42,174,0.2)' : 'transparent'}`,
            borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', textAlign: 'left',
            color: activeSection === s.id ? '#E82AAE' : '#7A7A8C', fontSize: '13px',
            display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 200ms', width: '100%',
          }}>
            <span style={{ fontSize: '12px' }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '48px 56px 120px', maxWidth: '860px' }}>

        {/* Hero */}
        <div id="section-overview" style={{ marginBottom: '56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {useCase.hasDemo && <Badge variant="pink">Live Demo</Badge>}
            {industry && <Badge variant="dim">{industry.name}</Badge>}
            {valueChain && <Badge variant="dim">{valueChain.label}</Badge>}
          </div>
          <h1 style={{ fontFamily: 'Jost, sans-serif', fontSize: '40px', fontWeight: 700,
            letterSpacing: '-0.5px', marginBottom: '16px', lineHeight: 1.1 }}>
            {useCase.title}
          </h1>
          <p style={{ color: '#7A7A8C', fontSize: '16px', lineHeight: 1.7, maxWidth: '640px', marginBottom: '28px' }}>
            {useCase.tagline}
          </p>
          {useCase.overview && (
            <p style={{ color: '#F0F0F5', fontSize: '15px', lineHeight: 1.8, maxWidth: '640px',
              borderLeft: '3px solid rgba(232,42,174,0.4)', paddingLeft: '20px' }}>
              {useCase.overview}
            </p>
          )}
        </div>

        {/* INPUT */}
        {useCase.input && (
          <div id="section-input" style={{ marginBottom: '56px' }}>
            <SectionHeader icon="↓" label="Input" />
            <p style={{ color: '#7A7A8C', fontSize: '14px', marginBottom: '20px' }}>
              {useCase.input.summary}
            </p>
            {sectionCard(
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {useCase.input.sources?.map((src, i) => (
                  <div key={i} style={{
                    padding: '16px 0',
                    borderBottom: i < useCase.input.sources.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    display: 'flex', gap: '16px', alignItems: 'flex-start',
                  }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                      background: 'rgba(232,42,174,0.1)', border: '1px solid rgba(232,42,174,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', color: '#E82AAE', fontFamily: 'Jost, sans-serif', fontWeight: 700,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 600,
                        color: '#F0F0F5', marginBottom: '4px' }}>
                        {src.name}
                      </div>
                      <div style={{ fontSize: '13px', color: '#7A7A8C', lineHeight: 1.6 }}>
                        {src.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODEL */}
        {useCase.model && (
          <div id="section-model" style={{ marginBottom: '56px' }}>
            <SectionHeader icon="⬡" label="Model" />
            <p style={{ color: '#7A7A8C', fontSize: '14px', marginBottom: '20px' }}>
              {useCase.model.summary}
            </p>
            {sectionCard(
              <div style={{ position: 'relative' }}>
                {/* Pipeline connector line */}
                <div style={{
                  position: 'absolute', left: '22px', top: '36px',
                  bottom: '36px', width: '1px',
                  background: 'linear-gradient(to bottom, #E82AAE, rgba(232,42,174,0.1))',
                }} />
                {useCase.model.stages?.map((stage, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: '16px', alignItems: 'flex-start',
                    marginBottom: i < useCase.model.stages.length - 1 ? '24px' : '0',
                    position: 'relative',
                  }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                      background: '#E82AAE', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '11px', color: '#fff',
                      fontFamily: 'Jost, sans-serif', fontWeight: 700, zIndex: 1,
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ paddingTop: '4px' }}>
                      <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', fontWeight: 600,
                        color: '#F0F0F5', marginBottom: '4px' }}>
                        {stage.name}
                      </div>
                      <div style={{ fontSize: '13px', color: '#7A7A8C', lineHeight: 1.6 }}>
                        {stage.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* OUTPUT */}
        {useCase.output && (
          <div id="section-output" style={{ marginBottom: '56px' }}>
            <SectionHeader icon="↑" label="Output" />
            <p style={{ color: '#7A7A8C', fontSize: '14px', marginBottom: '20px' }}>
              {useCase.output.summary}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              {[
                { label: 'Delivery', value: useCase.output.delivery, color: '#E82AAE' },
                { label: 'Action', value: useCase.output.action, color: '#7A7A8C' },
              ].map(item => (
                <div key={item.label} style={{
                  background: '#111115', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '12px', padding: '20px',
                }}>
                  <div style={{ fontSize: '10px', color: '#3A3A4A', fontFamily: 'Jost, sans-serif',
                    fontWeight: 600, letterSpacing: '0.5px', marginBottom: '8px' }}>
                    {item.label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '13px', color: '#F0F0F5', lineHeight: 1.6 }}>{item.value}</div>
                </div>
              ))}
            </div>
            {useCase.output.result && (
              <div style={{
                background: 'rgba(38,234,159,0.06)', border: '1px solid rgba(38,234,159,0.2)',
                borderRadius: '12px', padding: '20px',
              }}>
                <div style={{ fontSize: '10px', color: '#26EA9F', fontFamily: 'Jost, sans-serif',
                  fontWeight: 600, letterSpacing: '0.5px', marginBottom: '8px' }}>
                  PROVEN RESULTS
                </div>
                <div style={{ fontSize: '14px', color: '#F0F0F5', lineHeight: 1.7 }}>
                  {useCase.output.result}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{
          background: 'rgba(232,42,174,0.06)', border: '1px solid rgba(232,42,174,0.15)',
          borderRadius: '16px', padding: '40px', textAlign: 'center',
        }}>
          <h3 style={{ fontFamily: 'Jost, sans-serif', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
            Experience this use case
          </h3>
          <p style={{ color: '#7A7A8C', fontSize: '14px', marginBottom: '24px' }}>
            Walk through an interactive simulation of {useCase.title} in action.
          </p>
          {useCase.hasDemo ? (
            <button onClick={launchDemo} style={{
              background: '#E82AAE', border: 'none', borderRadius: '10px', padding: '13px 32px',
              color: '#fff', fontSize: '15px', fontFamily: 'Jost, sans-serif', fontWeight: 700,
              cursor: 'pointer', transition: 'background 200ms',
            }}
              onMouseEnter={e => e.target.style.background = '#c4228f'}
              onMouseLeave={e => e.target.style.background = '#E82AAE'}
            >
              Launch Interactive Demo →
            </button>
          ) : (
            <div style={{ color: '#3A3A4A', fontSize: '14px' }}>Demo coming soon</div>
          )}
        </div>

      </main>
    </div>
  )
}

const SectionHeader = ({ icon, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
    <span style={{ fontSize: '20px', color: '#E82AAE' }}>{icon}</span>
    <h2 style={{ fontFamily: 'Jost, sans-serif', fontSize: '24px', fontWeight: 700 }}>{label}</h2>
  </div>
)

export default UseCasePage
