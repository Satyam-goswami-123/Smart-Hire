import React from 'react'
import './RecentAnalyses.css'

const DATA = [
  { jobTitle: 'Senior Cloud Engineer', date: 'Oct 24, 2024', score: '88%', status: 'Completed', type: 'success' },
  { jobTitle: 'DevOps Architect', date: 'Oct 22, 2024', score: '72%', status: 'Action Needed', type: 'warning' },
  { jobTitle: 'Backend Developer', date: 'Oct 18, 2024', score: '91%', status: 'Completed', type: 'success' },
]

export default function RecentAnalyses() {
  return (
    <div className="recent">
      <div className="recent__header">
        <h2 className="recent__title">Recent Analyses</h2>
        <a href="#" className="recent__link">View All</a>
      </div>

      <div className="recent__table-wrapper">
        <table className="recent__table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Date</th>
              <th>Match Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {DATA.map((row, i) => (
              <tr key={i}>
                <td className="recent__cell-title">{row.jobTitle}</td>
                <td className="recent__cell-date">
                  {row.date.split(',')[0]},<br/>
                  {row.date.split(',')[1]}
                </td>
                <td className="recent__cell-score">{row.score}</td>
                <td className="recent__cell-status">
                  <span className={`recent__status-pill recent__status-pill--${row.type}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
