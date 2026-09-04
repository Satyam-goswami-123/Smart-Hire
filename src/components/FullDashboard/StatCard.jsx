import React from 'react'
import './StatCard.css'

export default function StatCard({ icon: Icon, iconBg, iconColor, title, value, trend, progress, subtitle, subtitleColor = '#4B5563', valueColor = '#111827' }) {
  return (
    <div className="statcard">
      <div className="statcard__header">
        <div className="statcard__icon" style={{ backgroundColor: iconBg, color: iconColor }}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        {trend && (
          <div className="statcard__trend">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            {trend}
          </div>
        )}
      </div>

      <div className="statcard__body">
        <div className="statcard__title">{title}</div>
        <div className="statcard__value" style={{ color: valueColor }}>{value}</div>
      </div>

      {progress !== undefined && (
        <div className="statcard__progress-track">
          <div className="statcard__progress-fill" style={{ width: `${progress}%`, backgroundColor: iconColor }}></div>
        </div>
      )}

      {subtitle && (
        <div className="statcard__subtitle" style={{ color: subtitleColor }}>
          {subtitle}
        </div>
      )}
    </div>
  )
}
