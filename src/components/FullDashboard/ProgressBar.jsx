import React from 'react'
import './ProgressBar.css'

export default function ProgressBar() {
  return (
    <div className="progress-card">
      <div className="progress-steps">
        <div className="progress-step progress-step--active">
          <div className="progress-step__circle">1</div>
          <div className="progress-step__text">
            <h4>Upload Resume</h4>
            <span>PDF, DOCX (Max 5MB)</span>
          </div>
        </div>
        <div className="progress-line">
          <div className="progress-line__fill"></div>
        </div>

        <div className="progress-step">
          <div className="progress-step__circle">2</div>
          <div className="progress-step__text">
            <h4>Add Job Description</h4>
            <span>Paste or upload JD</span>
          </div>
        </div>
        <div className="progress-line"></div>

        <div className="progress-step">
          <div className="progress-step__circle">3</div>
          <div className="progress-step__text">
            <h4>AI Analysis</h4>
            <span>Get AI-powered insights</span>
          </div>
        </div>
        <div className="progress-line"></div>

        <div className="progress-step">
          <div className="progress-step__circle">4</div>
          <div className="progress-step__text">
            <h4>View Results</h4>
            <span>Optimize & Improve</span>
          </div>
        </div>
      </div>
    </div>
  )
}
