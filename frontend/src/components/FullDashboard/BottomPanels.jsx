import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import './BottomPanels.css'

export default function BottomPanels() {
  return (
    <div className="bottom-panels">
      
      {/* LEFT: ANALYSIS SUMMARY */}
      <div className="summary-panel">
        <div className="summary-panel__header">
          <h3 className="summary-panel__title">Analysis Summary <span>(Last 3 Analyses)</span></h3>
          <a href="#" className="summary-panel__link">View All</a>
        </div>
        
        <div className="summary-cards">
          {/* Card 1 */}
          <div className="summary-card">
            <div className="summary-card__top">
              <div className="summary-card__label">Average Match Score</div>
            </div>
            <div className="summary-card__mid">
              <div className="summary-card__value">78%</div>
              <div className="summary-card__trend summary-card__trend--up">↑ 12%</div>
            </div>
            <div className="summary-card__graph">
              <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0 20 Q 25 30 50 15 T 100 5" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
                <path d="M0 20 Q 25 30 50 15 T 100 5 L100 30 L0 30 Z" fill="url(#blue-grad)" />
                <defs>
                  <linearGradient id="blue-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(37, 99, 235, 0.2)" />
                    <stop offset="100%" stopColor="rgba(37, 99, 235, 0)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Card 2 */}
          <div className="summary-card">
            <div className="summary-card__top">
              <div className="summary-card__label">Average ATS Score</div>
            </div>
            <div className="summary-card__mid">
              <div className="summary-card__value">85%</div>
              <div className="summary-card__trend summary-card__trend--up">↑ 8%</div>
            </div>
            <div className="summary-card__graph">
              <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0 25 Q 25 15 50 25 T 100 10" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
                <path d="M0 25 Q 25 15 50 25 T 100 10 L100 30 L0 30 Z" fill="url(#purple-grad)" />
                <defs>
                  <linearGradient id="purple-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(139, 92, 246, 0.2)" />
                    <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Card 3 */}
          <div className="summary-card">
            <div className="summary-card__top">
              <div className="summary-card__label">Jobs Applied</div>
            </div>
            <div className="summary-card__mid">
              <div className="summary-card__value">24</div>
              <div className="summary-card__trend summary-card__trend--up">↑ 6</div>
            </div>
            <div className="summary-card__graph">
              <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0 25 Q 25 10 50 20 T 100 15" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
                <path d="M0 25 Q 25 10 50 20 T 100 15 L100 30 L0 30 Z" fill="url(#green-grad)" />
                <defs>
                  <linearGradient id="green-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(16, 185, 129, 0.2)" />
                    <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: AI QUICK TIPS */}
      <div className="tips-panel">
        <div className="tips-panel__content">
          <div className="tips-panel__header">
            <div className="tips-panel__icon">💡</div>
            <h3>AI Quick Tips</h3>
          </div>
          <ul className="tips-panel__list">
            <li>
              <CheckCircle2 size={16} color="#4B5563" />
              <span>Add more quantifiable achievements</span>
            </li>
            <li>
              <CheckCircle2 size={16} color="#4B5563" />
              <span>Include missing keywords from JD</span>
            </li>
            <li>
              <CheckCircle2 size={16} color="#4B5563" />
              <span>Improve your summary section</span>
            </li>
            <li>
              <CheckCircle2 size={16} color="#4B5563" />
              <span>Add more technical skills</span>
            </li>
          </ul>
        </div>
        <div className="tips-panel__image">
          <img src="/robot.png" alt="AI Robot Assistant" />
        </div>
      </div>

    </div>
  )
}
