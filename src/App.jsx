import { useState } from 'react'
import { tokens } from './styles/tokens.js'
import HomePage from './pages/HomePage.jsx'
import IndustryPage from './pages/IndustryPage.jsx'
import UseCasePage from './pages/UseCasePage.jsx'

export default function App() {
  const [view, setView] = useState('home')               // home | industry | usecase
  const [selectedIndustry, setSelectedIndustry] = useState(null)
  const [selectedUseCase, setSelectedUseCase] = useState(null)

  const goHome = () => { setView('home'); setSelectedIndustry(null); setSelectedUseCase(null) }
  const goIndustry = (industry) => { setSelectedIndustry(industry); setView('industry') }
  const goUseCase = (useCase) => { setSelectedUseCase(useCase); setView('usecase') }

  return (
    <div style={{ background: tokens.bg, minHeight: '100vh', color: tokens.text, fontFamily: 'Lato, sans-serif' }}>
      {view === 'home'     && <HomePage onSelectIndustry={goIndustry} />}
      {view === 'industry' && <IndustryPage industry={selectedIndustry} onSelectUseCase={goUseCase} onBack={goHome} />}
      {view === 'usecase'  && <UseCasePage useCase={selectedUseCase} onBack={() => setView('industry')} />}
    </div>
  )
}
