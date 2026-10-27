import React, { useState, useEffect } from 'react';
import { Search, Trash2, ExternalLink, RefreshCw, PlusCircle, AlertCircle, CheckCircle } from 'lucide-react';
import './History.css';

const DEFAULT_DEMO_DATA = [
  { 
    id: 'demo_1', 
    resumeName: 'Senior_FullStack_Resume.pdf', 
    jobTitle: 'Senior Cloud Engineer', 
    company: 'TechCorp', 
    date: 'Oct 24, 2026', 
    score: 88, 
    atsScore: 92, 
    status: 'Completed', 
    type: 'success',
    fullData: {
      resume: { name: 'Senior_FullStack_Resume.pdf' },
      jd: { name: 'Senior Cloud Engineer JD' },
      analysisResult: {
        matchScore: 88,
        atsScore: 92,
        hiringProbability: 'High',
        matchedSkills: ['React', 'Node.js', 'AWS', 'Docker', 'TypeScript', 'Git'],
        missingSkills: ['Kubernetes', 'Terraform'],
        totalJdSkills: 8,
        strengths: ['Strong technical alignment in Cloud & Backend', 'Hands-on project experience with AWS'],
        improvements: ['Add Kubernetes container orchestration experience', 'Include quantifiable metrics']
      }
    }
  },
  { 
    id: 'demo_2', 
    resumeName: 'Alex_Johnson_Backend.pdf', 
    jobTitle: 'DevOps & Infrastructure Architect', 
    company: 'CloudNet Systems', 
    date: 'Oct 22, 2026', 
    score: 72, 
    atsScore: 78, 
    status: 'Completed', 
    type: 'success',
    fullData: {
      resume: { name: 'Alex_Johnson_Backend.pdf' },
      jd: { name: 'DevOps Architect JD' },
      analysisResult: {
        matchScore: 72,
        atsScore: 78,
        hiringProbability: 'Medium',
        matchedSkills: ['Docker', 'Linux', 'Python', 'CI/CD'],
        missingSkills: ['AWS Lambda', 'Prometheus', 'Grafana'],
        totalJdSkills: 7,
        strengths: ['Solid Linux and Docker fundamentals'],
        improvements: ['Include monitoring tools (Prometheus, Grafana)']
      }
    }
  },
  { 
    id: 'demo_3', 
    resumeName: 'Frontend_Engineer_CV.pdf', 
    jobTitle: 'Full Stack Web Developer', 
    company: 'WebSolutions Inc', 
    date: 'Oct 15, 2026', 
    score: 64, 
    atsScore: 68, 
    status: 'Action Needed', 
    type: 'warning',
    fullData: {
      resume: { name: 'Frontend_Engineer_CV.pdf' },
      jd: { name: 'Full Stack Web Developer' },
      analysisResult: {
        matchScore: 64,
        atsScore: 68,
        hiringProbability: 'Low',
        matchedSkills: ['HTML', 'CSS', 'JavaScript'],
        missingSkills: ['React', 'Node.js', 'MongoDB', 'REST API'],
        totalJdSkills: 7,
        strengths: ['Good foundational frontend skills'],
        improvements: ['Missing backend and full-stack frameworks (React, Node, Mongo)']
      }
    }
  }
];

export default function History({ onSelectAnalysis, onNewAnalysis }) {
  const [historyList, setHistoryList] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load from both backend API and localStorage
  const loadHistory = async () => {
    setIsLoading(true);
    let items = [];

    // 1. Try fetching from Backend API
    try {
      const res = await fetch('http://localhost:5001/api/history');
      if (res.ok) {
        const json = await res.json();
        if (json.history && json.history.length > 0) {
          items = json.history;
        }
      }
    } catch (e) {
      console.log('Backend history not reachable, falling back to local storage.');
    }

    // 2. If backend has nothing, check localStorage
    if (items.length === 0) {
      try {
        const local = localStorage.getItem('smarthire_analysis_history');
        if (local) {
          items = JSON.parse(local);
        }
      } catch (err) {
        console.error('Error parsing localStorage history:', err);
      }
    }

    // 3. Fallback to demo items if never analyzed before
    if (items.length === 0) {
      items = DEFAULT_DEMO_DATA;
    }

    setHistoryList(items);
    setIsLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to remove this analysis from history?')) return;

    const updated = historyList.filter(item => item.id !== id);
    setHistoryList(updated);
    try {
      localStorage.setItem('smarthire_analysis_history', JSON.stringify(updated));
      await fetch(`http://localhost:5001/api/history/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all analysis history? This cannot be undone.')) return;
    setHistoryList([]);
    try {
      localStorage.removeItem('smarthire_analysis_history');
      await fetch('http://localhost:5001/api/history', { method: 'DELETE' });
    } catch (err) {
      console.error('Clear error:', err);
    }
  };

  const filteredData = historyList.filter(row => {
    const matchesFilter = filter === 'All' ? true : row.status === filter;
    const titleMatch = (row.jobTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    const resumeMatch = (row.resumeName || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && (titleMatch || resumeMatch);
  });

  return (
    <div className="history">
      <div className="history__header">
        <div>
          <h1 className="history__title">Analysis History</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6B7280' }}>
            Saved locally in browser and synchronized with server storage
          </p>
        </div>
        <div className="history__controls">
          <div className="history__search">
            <Search size={16} color="#9CA3AF" />
            <input 
              type="text" 
              placeholder="Search past analyses..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="history__filter-btn" onClick={loadHistory} title="Refresh History">
            <RefreshCw size={15} /> Refresh
          </button>
          {historyList.length > 0 && (
            <button 
              className="history__filter-btn" 
              onClick={handleClearAll} 
              style={{ color: '#EF4444', borderColor: '#FCA5A5' }}
              title="Clear all stored analyses"
            >
              <Trash2 size={15} /> Clear All
            </button>
          )}
        </div>
      </div>

      <div className="history__tabs">
        <button 
          className={`history__tab ${filter === 'All' ? 'history__tab--active' : ''}`}
          onClick={() => setFilter('All')}
        >
          All Analyses ({historyList.length})
        </button>
        <button 
          className={`history__tab ${filter === 'Completed' ? 'history__tab--active' : ''}`}
          onClick={() => setFilter('Completed')}
        >
          Completed ({historyList.filter(i => i.status === 'Completed').length})
        </button>
        <button 
          className={`history__tab ${filter === 'Action Needed' ? 'history__tab--active' : ''}`}
          onClick={() => setFilter('Action Needed')}
        >
          Action Needed ({historyList.filter(i => i.status === 'Action Needed').length})
        </button>
      </div>

      <div className="history__table-container">
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
            Loading analysis history...
          </div>
        ) : filteredData.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <AlertCircle size={36} color="#9CA3AF" style={{ marginBottom: '12px' }} />
            <h3 style={{ margin: '0 0 8px 0', color: '#111827' }}>No Analyses Found</h3>
            <p style={{ margin: '0 0 20px 0', color: '#6B7280', fontSize: '14px' }}>
              {searchTerm ? 'No results matched your search keyword.' : 'You have not uploaded or analyzed any resumes yet.'}
            </p>
            {onNewAnalysis && (
              <button 
                onClick={onNewAnalysis}
                style={{
                  background: '#2563EB',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <PlusCircle size={16} /> Analyze a Resume Now
              </button>
            )}
          </div>
        ) : (
          <table className="history__table">
            <thead>
              <tr>
                <th>Job Title / Role</th>
                <th>Resume File</th>
                <th>Date</th>
                <th>Match Score</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr 
                  key={row.id} 
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectAnalysis && onSelectAnalysis(row.fullData || row)}
                  title="Click to view full analysis report"
                >
                  <td className="history__cell-title">
                    {row.jobTitle || 'Target Role'}
                  </td>
                  <td className="history__cell-company">
                    {row.resumeName || 'Uploaded Resume'}
                  </td>
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
                    <span className={`history__status-pill history__status-pill--${row.type || (row.score >= 70 ? 'success' : 'warning')}`}>
                      {row.status || (row.score >= 70 ? 'Completed' : 'Action Needed')}
                    </span>
                  </td>
                  <td className="history__cell-actions" style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button 
                        className="history__action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectAnalysis) onSelectAnalysis(row.fullData || row);
                        }}
                        title="View Report"
                        style={{ color: '#2563EB' }}
                      >
                        <ExternalLink size={16} />
                      </button>
                      <button 
                        className="history__action-btn"
                        onClick={(e) => handleDelete(row.id, e)}
                        title="Delete from history"
                        style={{ color: '#EF4444' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
