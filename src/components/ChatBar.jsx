import { useState, useRef, useEffect } from 'react'

const SYSTEM_PROMPT = `You are the Octave Advisor — a helpful assistant for Octave Analytics' product catalog.
Octave is an AI and data science firm with 60+ use cases across 5 industries.

Industries and use cases:
- Retail: Assortment Optimisation, Dynamic Pricing, Fresh Procurement Optimisation, Labour Scheduling, Customer Segmentation, Churn Prediction
- FMCG: Production Scheduling, Route Optimisation, Trade Spend Optimisation, Media Mix Modelling
- Leisure & Hospitality: Dynamic Room Pricing, Energy Optimisation (LIVE DEMO available), Guest Personalisation, Menu Optimisation, Labour Scheduling
- Banking & Financial Services: Lead Scoring, Churn Prediction, Credit Scoring, Fraud Detection
- Transport & Energy: Passenger Demand Forecasting, Fuel Procurement Optimisation

Help visitors find relevant use cases. Be concise. The only live demo is Energy Optimisation under Leisure & Hospitality.`

const ChatBar = () => {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 100) }, [open])
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)
    try {
      const history = messages.map(m => ({ role: m.role === 'model' ? 'model' : 'user', parts: [{ text: m.content }] }))
      history.push({ role: 'user', parts: [{ text: userMsg }] })
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: history, systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }, generationConfig: { maxOutputTokens: 300 } }) }
      )
      const data = await res.json()
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response.'
      setMessages(prev => [...prev, { role: 'model', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'model', content: 'Advisor unavailable — please try again.' }])
    } finally { setLoading(false) }
  }

  return (
    <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '640px', zIndex: 200, padding: '0 16px' }}>
      {open && (
        <div style={{
          background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '16px',
          marginBottom: '8px', overflow: 'hidden', animation: 'slideUp 300ms cubic-bezier(0.16,1,0.3,1)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0A8A5C' }} />
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: 600, color: '#1A1A2E' }}>Octave Advisor</span>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>×</button>
          </div>
          <div style={{ height: '280px', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.length === 0 && (
              <div style={{ color: '#6B7280', fontSize: '13px', textAlign: 'center', marginTop: '60px' }}>
                Describe your business challenge and I'll point you to the right use case.
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: '12px', fontSize: '13px', lineHeight: 1.5,
                  background: m.role === 'user' ? '#E82AAE' : '#F0F2F5',
                  color: m.role === 'user' ? '#fff' : '#1A1A2E',
                  border: m.role === 'model' ? '1px solid rgba(0,0,0,0.08)' : 'none',
                }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: '5px', padding: '8px 0' }}>
                {[0,1,2].map(i => <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9CA3AF', animation: `fadeIn 600ms ease-in-out ${i*200}ms infinite alternate` }} />)}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', gap: '8px' }}>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendMessage() }}
              placeholder="Ask about a business problem..."
              style={{ flex: 1, background: '#F7F8FA', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '9px 14px', color: '#1A1A2E', fontSize: '13px', outline: 'none', fontFamily: 'Lato, sans-serif' }} />
            <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
              background: '#E82AAE', border: 'none', borderRadius: '8px', padding: '9px 16px',
              color: '#fff', fontSize: '13px', fontFamily: 'Jost, sans-serif', fontWeight: 600,
              cursor: input.trim() ? 'pointer' : 'default', opacity: input.trim() && !loading ? 1 : 0.4,
            }}>Send</button>
          </div>
        </div>
      )}
      <div onClick={() => setOpen(true)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? '#F0F2F5' : '#FFFFFF',
          border: `1px solid ${hovered ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.08)'}`,
          borderRadius: '999px', padding: '12px 20px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '10px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        }}>
        <span style={{ fontSize: '14px', color: '#E82AAE' }}>✦</span>
        <span style={{ color: '#6B7280', fontSize: '13px', flex: 1 }}>{hovered ? 'Ask about our use cases…' : 'Ask Octave Advisor…'}</span>
        <span style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'Jost, sans-serif' }}>AI</span>
      </div>
    </div>
  )
}
export default ChatBar
