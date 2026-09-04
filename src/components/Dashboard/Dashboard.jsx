import React from 'react'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Settings,
  Bell,
  X,
  LayoutGrid,
} from 'lucide-react'
import ResumeMatchCard from './ResumeMatchCard'
import SkillGapChart from './SkillGapChart'
import KeywordOptimization from './KeywordOptimization'
import './Dashboard.css'

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Users,           label: 'Candidates' },
  { icon: Briefcase,       label: 'Jobs' },
  { icon: Settings,        label: 'Settings' },
]

export default function Dashboard() {
  return (
    <div className="db-wrapper">
      {/* Browser chrome */}
      <div className="db-browser">
        {/* Browser top bar */}
        <div className="db-browser__topbar">
          <div className="db-browser__dots">
            <span className="db-browser__dot db-browser__dot--red"   />
            <span className="db-browser__dot db-browser__dot--yellow"/>
            <span className="db-browser__dot db-browser__dot--green" />
          </div>
        </div>

        {/* App content inside browser */}
        <div className="db-app">
          {/* App header */}
          <div className="db-app__header">
            <div className="db-app__logo">
              <span className="db-app__logo-icon">
                <LayoutGrid size={13} strokeWidth={2.5} color="#fff" />
              </span>
              <span className="db-app__logo-text">TalentFlow</span>
            </div>
            <div className="db-app__header-actions">
              <Bell size={15} color="#9CA3AF" />
              <X size={15} color="#9CA3AF" />
            </div>
          </div>

          <div className="db-app__body">
            {/* Sidebar */}
            <aside className="db-sidebar">
              {SIDEBAR_ITEMS.map(({ icon: Icon, label, active }) => (
                <div
                  key={label}
                  className={`db-sidebar__item ${active ? 'db-sidebar__item--active' : ''}`}
                >
                  <Icon size={13} strokeWidth={2} />
                  <span>{label}</span>
                </div>
              ))}
            </aside>

            {/* Main dashboard content */}
            <div className="db-main">
              {/* Top cards row */}
              <div className="db-cards-row">
                <ResumeMatchCard score={85} />
                <SkillGapChart />
              </div>

              {/* Keyword optimization */}
              <KeywordOptimization />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
