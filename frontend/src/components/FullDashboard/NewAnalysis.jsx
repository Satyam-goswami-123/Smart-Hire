import React, { useState } from 'react'
import ProgressBar from './ProgressBar'
import UploadSection from './UploadSection'
import './NewAnalysis.css'

export default function NewAnalysis({ onAnalyze }) {
  const [resumeAdded, setResumeAdded] = useState(false)
  const [jdAdded, setJdAdded] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyzeStart = (data) => {
    setIsAnalyzing(true)
    setTimeout(() => {
      if (onAnalyze) onAnalyze(data)
    }, 1500)
  }

  return (
    <div className="new-analysis">
      <ProgressBar 
        resumeAdded={resumeAdded} 
        jdAdded={jdAdded} 
        isAnalyzing={isAnalyzing} 
      />
      <UploadSection 
        onAnalyze={handleAnalyzeStart}
        onResumeChange={setResumeAdded}
        onJdChange={setJdAdded}
      />
    </div>
  )
}
