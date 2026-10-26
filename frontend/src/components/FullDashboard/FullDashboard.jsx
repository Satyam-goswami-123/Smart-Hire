import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import NewAnalysis from './NewAnalysis'
import ResumeAnalysis from './ResumeAnalysis'
import History from './History'
import Settings from './Settings'
import './FullDashboard.css'

export default function FullDashboard({ onNavigateHome }) {
  const [currentView, setCurrentView] = useState('newAnalysis')
  const [analysisData, setAnalysisData] = useState(null)

  const handleAnalyze = (data) => {
    setAnalysisData(data)
    setCurrentView('resumeAnalysis')
  }

  const renderContent = () => {
    switch (currentView) {
      case 'newAnalysis': return <NewAnalysis onAnalyze={handleAnalyze} />
      case 'resumeAnalysis': return <ResumeAnalysis analysisData={analysisData} />
      case 'history': return <History />
      case 'settings': return <Settings />
      default:
        return <NewAnalysis onAnalyze={handleAnalyze} />
    }
  }

  return (
    <div className="fulldashboard">
      <Sidebar 
        currentView={currentView}
        onNavigateHome={onNavigateHome} 
        onNavigate={(view) => setCurrentView(view)}
        onNewAnalysis={() => setCurrentView('newAnalysis')} 
      />
      <div className="fulldashboard__main">
        <Topbar />
        <div className="fulldashboard__content">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
