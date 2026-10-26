import React from 'react'
import { FileSearch, Activity, Zap } from 'lucide-react'
import StatCard from './StatCard'
import RecentAnalyses from './RecentAnalyses'
import MissingSkills from './MissingSkills'
import './Overview.css'

export default function Overview({ onNewAnalysis }) {
  return (
    <div className="overview">
      <div className="overview__header-area">
        <div>
          <div className="overview__subtitle">Overview</div>
          <h1 className="overview__title">Welcome back, Alex!</h1>
        </div>
        <div className="overview__header-actions">
          <button className="overview__btn overview__btn--outline">
            Update Resume
          </button>
          <button className="overview__btn overview__btn--primary" onClick={onNewAnalysis}>
            <Zap size={16} strokeWidth={2.5} />
            New Analysis
          </button>
        </div>
      </div>

      <div className="overview__stats">
        <StatCard 
          icon={FileSearch}
          iconBg="#EFF6FF"
          iconColor="#2563EB"
          title="ATS Score"
          value="82%"
          trend="+4%"
          progress={82}
        />
        <StatCard 
          icon={Activity}
          iconBg="#F5F3FF"
          iconColor="#7C3AED"
          title="Resume Match"
          value="75%"
          progress={75}
        />
        <StatCard 
          icon={Zap}
          iconBg="#ECFDF5"
          iconColor="#059669"
          title="Resume Health"
          value="Excellent"
          subtitle="All sections optimized."
          valueColor="#059669"
        />
      </div>

      <div className="overview__grid">
        <div className="overview__grid-main">
          <RecentAnalyses />
        </div>
        <div className="overview__grid-side">
          <MissingSkills />
        </div>
      </div>
    </div>
  )
}
