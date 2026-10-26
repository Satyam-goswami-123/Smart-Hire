import React from 'react'
import { Check } from 'lucide-react'
import './ProgressBar.css'

export default function ProgressBar({ resumeAdded, jdAdded, isAnalyzing }) {
  // Logic to determine active step
  // Step 1: Upload Resume (Active initially, completed if resumeAdded)
  // Step 2: Add JD (Active if resumeAdded, completed if jdAdded)
  // Step 3: AI Analysis (Active if isAnalyzing)
  // Step 4: View Results (Active when results shown - handled in parent)

  return (
    <div className="progress-card">
      <div className="progress-steps">
        
        {/* Step 1 */}
        <div className={`progress-step ${resumeAdded ? 'progress-step--completed' : 'progress-step--active'}`}>
          <div className="progress-step__circle">
            {resumeAdded ? <Check size={16} strokeWidth={3} /> : '1'}
          </div>
          <div className="progress-step__text">
            <h4>Upload Resume</h4>
            <span>PDF, DOCX (Max 5MB)</span>
          </div>
        </div>
        <div className="progress-line">
          <div className="progress-line__fill" style={{ width: resumeAdded ? '100%' : '0%' }}></div>
        </div>

        {/* Step 2 */}
        <div className={`progress-step ${jdAdded ? 'progress-step--completed' : (resumeAdded && !isAnalyzing ? 'progress-step--active' : '')}`}>
          <div className="progress-step__circle">
            {jdAdded ? <Check size={16} strokeWidth={3} /> : '2'}
          </div>
          <div className="progress-step__text">
            <h4>Add Job Description</h4>
            <span>Paste or upload JD</span>
          </div>
        </div>
        <div className="progress-line">
          <div className="progress-line__fill" style={{ width: jdAdded ? '100%' : '0%' }}></div>
        </div>

        {/* Step 3 */}
        <div className={`progress-step ${isAnalyzing ? 'progress-step--active' : ''}`}>
          <div className="progress-step__circle">3</div>
          <div className="progress-step__text">
            <h4>AI Analysis</h4>
            <span>Get AI-powered insights</span>
          </div>
        </div>
        <div className="progress-line"></div>

        {/* Step 4 */}
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
