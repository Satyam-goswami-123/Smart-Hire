import React from 'react'
import { LayoutGrid, Plus, FileText, BarChart3, History, Settings } from 'lucide-react'
import './Sidebar.css'

export default function Sidebar({ onNavigateHome, currentView, onNewAnalysis, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo-area" onClick={onNavigateHome} style={{ cursor: 'pointer' }}>
        <div className="sidebar__logo-icon">
          <LayoutGrid size={18} strokeWidth={2.5} color="#fff" />
        </div>
        <div className="sidebar__logo-text">
          <h1>SmartHire AI</h1>
          <span>Recruitment Suite</span>
        </div>
      </div>

      <button className="sidebar__new-btn" onClick={onNewAnalysis}>
        <Plus size={16} strokeWidth={2.5} />
        New Analysis
      </button>

      <nav className="sidebar__nav">
        <a href="#" className={`sidebar__nav-item ${currentView === 'newAnalysis' ? 'sidebar__nav-item--active' : ''}`} onClick={(e) => {e.preventDefault(); onNavigate('newAnalysis');}}>
          <FileText size={18} />
          Resume Upload
        </a>
        <a href="#" className={`sidebar__nav-item ${currentView === 'resumeAnalysis' ? 'sidebar__nav-item--active' : ''}`} onClick={(e) => {e.preventDefault(); onNavigate('resumeAnalysis');}}>
          <BarChart3 size={18} />
          Resume Analysis
        </a>
        <a href="#" className={`sidebar__nav-item ${currentView === 'history' ? 'sidebar__nav-item--active' : ''}`} onClick={(e) => {e.preventDefault(); onNavigate('history');}}>
          <History size={18} />
          History
        </a>
        <a href="#" className={`sidebar__nav-item ${currentView === 'settings' ? 'sidebar__nav-item--active' : ''}`} onClick={(e) => {e.preventDefault(); onNavigate('settings');}}>
          <Settings size={18} />
          Settings
        </a>
      </nav>
    </aside>
  )
}
