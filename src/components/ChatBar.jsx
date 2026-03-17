import { useState, useRef, useEffect } from 'react'

const SYSTEM_PROMPT = `You are the Octave Advisor — a helpful assistant for Octave Analytics' product catalog. 
Octave is an AI and data science firm with 60+ use cases across 5 industries.

Industries and use cases:
- Retail: Assortment Optimisation, Dynamic Pricing, Fresh Procurement Optimisation, Labour Scheduling, Customer Segmentation, Churn Prediction
- FMCG: Production Scheduling, Route Optimisation, Trade Spend Optimisation, Media Mix Modelling
- Leisure & Hospitality: Dynamic Room Pricing, Energy Optimisation (LIVE DEMO available), Guest Personalisation, Menu Optimisation, Labour Scheduling
- Banking & Financial Services: Lead Scoring, Churn Prediction, Credit Scoring, Fraud Detection
- Transport & Energy: Passenger Demand Forecasting, Fuel Procurement Optimisation

Your job is to help visitors find relevant use cases based on their business problem. Be concise and direct. 
When a use case matches, name it specifically and mention which industry it falls under.
The only live demo currently available is Energy Optimisation under Leisure & Hospitality.`

const ChatBar = () => {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }))
      history.push({ role: 'user', parts: [{ text: userMsg }] })

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: history,
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: { maxOutputTokens: 300 }
          })
        }
      )
      const data = await res.json()
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn\'t get a response.'
      setMessages(prev => [...prev, { role: 'model', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'model', content: 'Advisor unavailable — please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: '640px', zIndex: 200, padding: '0 16px',
    }}>
      {/* Chat panel */}
      {open && (
        <div style={{
          background: '#111115', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px', marginBottom: '8px', overflow: 'hidden',
          animation: 'slideUp 300ms cubic-bezier(0.16,1,0.3,1)',
          boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#26EA9F' }} />
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 600, color: '#F0F0F5' }}>
                Octave Advisor
              </span>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: 'none', border: 'none', color: '#7A7A8C', cursor: 'pointer',
              fontSize: '18px', lineHeight: 1, padding: '2px 6px', borderRadius: '4px',
            }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ height: '280px', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.length === 0 && (
              <div style={{ color: '#7A7A8C', fontSize: '13px', textAlign: 'center', marginTop: '60px' }}>
                Describe your business challenge and I'll point you to the right use case.
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: '12px', fontSize: '13px', lineHeight: 1.5,
                  background: m.role === 'user' ? '#E82AAE' : '#16161C',
                  color: m.role === 'user' ? '#fff' : '#F0F0F5',
                  border: m.role === 'model' ? '1px solid rgba(255,255,255,0.07)' : 'none',
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: '5px', padding: '8px 0' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: '6px', height: '6px', borderRadius: '50%', background: '#7A7A8C',
                    animation: `fadeIn 600ms ease-in-out ${i * 200}ms infinite alternate`,
                  }} />
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '8px' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage() }}
              placeholder="Ask about a business problem..."
              style={{
                flex: 1, background: '#16161C', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', padding: '9px 14px', color: '#F0F0F5', fontSize: '13px',
                outline: 'none', fontFamily: 'Lato, sans-serif',
              }}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
              background: '#E82AAE', border: 'none', borderRadius: '8px', padding: '9px 16px',
              color: '#fff', fontSize: '13px', fontFamily: 'Jost, sans-serif', fontWeight: 600,
              cursor: input.trim() ? 'pointer' : 'default',
              opacity: input.trim() && !loading ? 1 : 0.4, transition: 'opacity 200ms',
            }}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* Bar */}
      <div
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? '#16161C' : '#111115',
          border: `1px solid ${hovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: '999px', padding: '12px 20px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '10px',
          transition: 'all 200ms', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}
      >
        <span style={{ fontSize: '14px' }}>✦</span>
        <span style={{ color: '#7A7A8C', fontSize: '13px', flex: 1 }}>
          {hovered ? 'Ask about our use cases…' : 'Ask Octave Advisor…'}
        </span>
        <span style={{ fontSize: '11px', color: '#3A3A4A', fontFamily: 'Jost, sans-serif' }}>AI</span>
      </div>
    </div>
  )
}

export default ChatBar
