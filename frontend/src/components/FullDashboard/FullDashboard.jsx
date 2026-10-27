import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import NewAnalysis from './NewAnalysis';
import ResumeAnalysis from './ResumeAnalysis';
import History from './History';
import Settings from './Settings';
import './FullDashboard.css';

export default function FullDashboard({ onNavigateHome }) {
  const [currentView, setCurrentView] = useState('newAnalysis');
  const [analysisData, setAnalysisData] = useState(null);

  // Load most recent analysis from localStorage on initial render if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem('smarthire_analysis_history');
      if (stored) {
        const list = JSON.parse(stored);
        if (list && list.length > 0 && list[0].fullData) {
          // Keep as ready cache
          setAnalysisData(list[0].fullData);
        }
      }
    } catch (e) {
      console.error('Error reading stored analysis:', e);
    }
  }, []);

  const handleAnalyze = (data) => {
    setAnalysisData(data);
    setCurrentView('resumeAnalysis');

    // Automatically save into browser localStorage history
    try {
      const historyRecord = data.record || {
        id: 'analysis_' + Date.now(),
        resumeName: data.resume?.name || 'Uploaded_Resume.pdf',
        jobTitle: data.jd?.name ? data.jd.name.split('.')[0].replace(/[-_]/g, ' ') : (data.jd?.text ? 'Target Job Description' : 'Senior Cloud Engineer'),
        company: 'Target Role',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: Date.now(),
        score: data.analysisResult?.matchScore !== undefined ? data.analysisResult.matchScore : 78,
        atsScore: data.analysisResult?.atsScore !== undefined ? data.analysisResult.atsScore : 82,
        status: (data.analysisResult?.matchScore >= 70) ? 'Completed' : 'Action Needed',
        type: (data.analysisResult?.matchScore >= 70) ? 'success' : 'warning',
        fullData: data
      };

      const existingRaw = localStorage.getItem('smarthire_analysis_history');
      let existing = existingRaw ? JSON.parse(existingRaw) : [];
      // Remove any duplicate id
      existing = existing.filter(i => i.id !== historyRecord.id);
      existing.unshift(historyRecord);
      localStorage.setItem('smarthire_analysis_history', JSON.stringify(existing.slice(0, 50)));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  };

  const handleSelectFromHistory = (itemData) => {
    setAnalysisData(itemData);
    setCurrentView('resumeAnalysis');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'newAnalysis': 
        return <NewAnalysis onAnalyze={handleAnalyze} />;
      case 'resumeAnalysis': 
        return <ResumeAnalysis analysisData={analysisData} />;
      case 'history': 
        return (
          <History 
            onSelectAnalysis={handleSelectFromHistory} 
            onNewAnalysis={() => setCurrentView('newAnalysis')} 
          />
        );
      case 'settings': 
        return <Settings />;
      default:
        return <NewAnalysis onAnalyze={handleAnalyze} />;
    }
  };

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
  );
}
