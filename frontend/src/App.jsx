import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import TrustedBy from './components/TrustedBy/TrustedBy'
import Footer from './components/Footer/Footer'
import FullDashboard from './components/FullDashboard/FullDashboard'
import WebLLMTest from './components/WebLLMTest/WebLLMTest'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')

  useEffect(() => {
    // Only apply scroll reveal on landing page
    if (currentPage !== 'landing') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    const elements = document.querySelectorAll('.reveal')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [currentPage])

  if (currentPage === 'webllm') {
    return (
      <div className="app">
        <WebLLMTest onNavigateHome={() => setCurrentPage('landing')} />
      </div>
    )
  }

  if (currentPage === 'dashboard') {
    return (
      <div className="app">
        <FullDashboard onNavigateHome={() => setCurrentPage('landing')} />
      </div>
    )
  }

  return (
    <div className="app">
      <Navbar onGetStarted={() => setCurrentPage('dashboard')} onWebLLMTest={() => setCurrentPage('webllm')} />
      <main>
        <Hero onGetStarted={() => setCurrentPage('dashboard')} />
        <TrustedBy />
      </main>
      <Footer />
    </div>
  )
}

export default App
