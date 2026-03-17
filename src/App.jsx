import { useState, useEffect } from 'react'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import IndustryPage from './pages/IndustryPage'
import UseCasePage from './pages/UseCasePage'
import AdminPage from './pages/AdminPage'
import ChatBar from './components/ChatBar'
import { CATALOG } from './data/catalog'

export default function App() {
  const [view, setView] = useState('home')
  const [selectedIndustry, setSelectedIndustry] = useState(null)
  const [selectedValueChain, setSelectedValueChain] = useState(null)
  const [selectedUseCase, setSelectedUseCase] = useState(null)

  useEffect(() => {
    if (window.location.pathname === '/admin') setView('admin')
  }, [])

  const navigate = (target, state = {}) => {
    const paths = { home: '/', industry: '/', usecase: '/', admin: '/admin' }
    window.history.pushState({}, '', paths[target] || '/')
    if ('industry' in state) setSelectedIndustry(state.industry)
    if ('valueChain' in state) setSelectedValueChain(state.valueChain)
    if ('useCase' in state) setSelectedUseCase(state.useCase)
    setView(target)
    window.scrollTo({ top: 0 })
  }

  const handleSelectUseCase = (uc, vc) => {
    // Find the parent industry for this vc
    const ind = CATALOG.find(i => i.valueChains.some(v => v.id === vc?.id))
    navigate('usecase', { useCase: uc, valueChain: vc, industry: ind || selectedIndustry })
  }

  return (
    <>
      <NavBar view={view} selectedIndustry={selectedIndustry} selectedValueChain={selectedValueChain} selectedUseCase={selectedUseCase} onNavigate={(t) => navigate(t)} />

      {view === 'home' && <HomePage onSelectIndustry={(ind) => navigate('industry', { industry: ind })} />}

      {view === 'industry' && selectedIndustry && (
        <IndustryPage industry={selectedIndustry} onSelectUseCase={handleSelectUseCase} onBack={() => navigate('home')} />
      )}

      {view === 'usecase' && selectedUseCase && (
        <UseCasePage
          useCase={selectedUseCase}
          industry={selectedIndustry}
          valueChain={selectedValueChain}
          catalog={CATALOG}
          onSelectUseCase={handleSelectUseCase}
          onBack={() => navigate('industry')}
        />
      )}

      {view === 'admin' && <AdminPage />}
      {view !== 'admin' && <ChatBar />}
    </>
  )
}
