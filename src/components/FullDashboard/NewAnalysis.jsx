import React from 'react'
import ProgressBar from './ProgressBar'
import UploadSection from './UploadSection'
import './NewAnalysis.css'

export default function NewAnalysis({ onAnalyze }) {
  return (
    <div className="new-analysis">
      <ProgressBar />
      <UploadSection onAnalyze={onAnalyze} />
    </div>
  )
}
