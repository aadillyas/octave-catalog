import { useState, useEffect } from 'react'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import IndustryPage from './pages/IndustryPage'
import UseCasePage from './pages/UseCasePage'
import AdminPage from './pages/AdminPage'
import ChatBar from './components/ChatBar'

export default function App() {
  const [view, setView] = useState('home')
  const [selectedIndustry, setSelectedIndustry] = useState(null)
  const [selectedValueChain, setSelectedValueChain] = useState(null)
  const [selectedUseCase, setSelectedUseCase] = useState(null)

  // Handle /admin path on mount
  useEffect(() => {
    if (window.location.pathname === '/admin') setView('admin')
  }, [])

  const navigate = (target, state = {}) => {
    const paths = { home: '/', industry: '/', usecase: '/', admin: '/admin' }
    window.history.pushState({}, '', paths[target] || '/')
    // Always update state when provided — even if value is falsy
    if ('industry' in state) setSelectedIndustry(state.industry)
    if ('valueChain' in state) setSelectedValueChain(state.valueChain)
    if ('useCase' in state) setSelectedUseCase(state.useCase)
    setView(target)
    window.scrollTo({ top: 0 })
  }

  const handleNavigate = (target) => navigate(target)

  // Debug: log selected use case whenever it changes
  useEffect(() => {
    if (selectedUseCase) {
      console.log('[App] selectedUseCase:', selectedUseCase)
      console.log('[App] demoPath:', selectedUseCase.demoPath)
      console.log('[App] hasDemo:', selectedUseCase.hasDemo)
    }
  }, [selectedUseCase])

  return (
    <>
      <NavBar
        view={view}
        selectedIndustry={selectedIndustry}
        selectedValueChain={selectedValueChain}
        selectedUseCase={selectedUseCase}
        onNavigate={handleNavigate}
      />

      {view === 'home' && (
        <HomePage
          onSelectIndustry={(industry) => navigate('industry', { industry })}
        />
      )}

      {view === 'industry' && selectedIndustry && (
        <IndustryPage
          industry={selectedIndustry}
          onSelectUseCase={(uc, vc) => {
            console.log('[IndustryPage] uc passed up:', uc)
            navigate('usecase', { useCase: uc, valueChain: vc })
          }}
          onBack={() => navigate('home')}
        />
      )}

      {view === 'usecase' && selectedUseCase && (
        <UseCasePage
          useCase={selectedUseCase}
          industry={selectedIndustry}
          valueChain={selectedValueChain}
          onBack={() => navigate('industry')}
        />
      )}

      {view === 'admin' && <AdminPage />}

      {view !== 'admin' && <ChatBar />}
    </>
  )
}
