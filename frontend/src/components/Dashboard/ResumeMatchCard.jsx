import React from 'react'
import './ResumeMatchCard.css'

export default function ResumeMatchCard({ score = 85 }) {
  const radius = 54
  const stroke = 9
  const normalizedRadius = radius - stroke / 2
  const circumference = 2 * Math.PI * normalizedRadius
  const dashOffset = circumference - (score / 100) * circumference

  return (
    <div className="rmc">
      <h3 className="rmc__title">Resume Match Score</h3>
      <div className="rmc__ring-wrapper">
        <svg
          className="rmc__svg"
          width={radius * 2}
          height={radius * 2}
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        >
          {/* Background track */}
          <circle
            className="rmc__track"
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            strokeWidth={stroke}
          />
          {/* Progress arc */}
          <circle
            className="rmc__progress"
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${radius} ${radius})`}
          />
        </svg>
        <div className="rmc__center">
          <span className="rmc__label">Resume Match Score</span>
          <span className="rmc__score">{score}%</span>
        </div>
      </div>
    </div>
  )
}
