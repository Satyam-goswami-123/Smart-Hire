import React, { useState } from 'react'
import { Search, Filter, MoreVertical } from 'lucide-react'
import './History.css'

const HISTORY_DATA = [
  { id: '1', jobTitle: 'Senior Cloud Engineer', company: 'TechCorp', date: 'Oct 24, 2024', score: 88, status: 'Completed', type: 'success' },
  { id: '2', jobTitle: 'DevOps Architect', company: 'CloudNet', date: 'Oct 22, 2024', score: 72, status: 'Action Needed', type: 'warning' },
  { id: '3', jobTitle: 'Backend Developer', company: 'DataSystems', date: 'Oct 18, 2024', score: 91, status: 'Completed', type: 'success' },
  { id: '4', jobTitle: 'Full Stack Engineer', company: 'WebSolutions', date: 'Oct 15, 2024', score: 65, status: 'Action Needed', type: 'warning' },
  { id: '5', jobTitle: 'Site Reliability Eng', company: 'TechCorp', date: 'Oct 10, 2024', score: 95, status: 'Completed', type: 'success' },
  { id: '6', jobTitle: 'Frontend Lead', company: 'DesignUI', date: 'Oct 05, 2024', score: 81, status: 'Completed', type: 'success' },
]

export default function History() {
  const [filter, setFilter] = useState('All')

  const filteredData = HISTORY_DATA.filter(row => {
    if (filter === 'All') return true
    return row.status === filter
  })

  return (
    <div className="history">
      <div className="history__header">
        <h1 className="history__title">Analysis History</h1>
        <div className="history__controls">
          <div className="history__search">
            <Search size={16} color="#9CA3AF" />
            <input type="text" placeholder="Search past analyses..." />
          </div>
          <button className="history__filter-btn">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      <div className="history__tabs">
        <button 
          className={`history__tab ${filter === 'All' ? 'history__tab--active' : ''}`}
          onClick={() => setFilter('All')}
        >
          All Analyses
        </button>
        <button 
          className={`history__tab ${filter === 'Completed' ? 'history__tab--active' : ''}`}
          onClick={() => setFilter('Completed')}
        >
          Completed
        </button>
        <button 
          className={`history__tab ${filter === 'Action Needed' ? 'history__tab--active' : ''}`}
          onClick={() => setFilter('Action Needed')}
        >
          Action Needed
        </button>
      </div>

      <div className="history__table-container">
        <table className="history__table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Date</th>
              <th>Match Score</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id}>
                <td className="history__cell-title">{row.jobTitle}</td>
                <td className="history__cell-company">{row.company}</td>
                <td className="history__cell-date">{row.date}</td>
                <td className="history__cell-score">
                  <div className="history__score-bar">
                    <div 
                      className="history__score-fill" 
                      style={{ 
                        width: `${row.score}%`,
                        backgroundColor: row.score >= 80 ? '#10B981' : row.score >= 70 ? '#F59E0B' : '#EF4444' 
                      }}
                    ></div>
                  </div>
                  <span>{row.score}%</span>
                </td>
                <td className="history__cell-status">
                  <span className={`history__status-pill history__status-pill--${row.type}`}>
                    {row.status}
                  </span>
                </td>
                <td className="history__cell-actions">
                  <button className="history__action-btn">
                    <MoreVertical size={16} color="#9CA3AF" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
