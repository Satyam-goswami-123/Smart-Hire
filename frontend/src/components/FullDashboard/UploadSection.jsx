import React, { useState, useRef, useEffect } from 'react'
import { useWebLLM } from '../../hooks/useWebLLM'
import { FileText, Check, Trash2, ArrowRight, UploadCloud, ClipboardPaste, Upload, Loader2 } from 'lucide-react'
import './UploadSection.css'

export default function UploadSection({ onAnalyze, onResumeChange, onJdChange }) {
  // State for Resume
  const [resumeFile, setResumeFile] = useState(null)
  
  // State for JD
  const [jdFile, setJdFile] = useState(null)
  const [jdText, setJdText] = useState('')
  const [isPastingJD, setIsPastingJD] = useState(false)
  const [tempJdText, setTempJdText] = useState('')
  
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiStatus, setAiStatus] = useState('')
  const { analyzeResume, modelStatus, isLoading: llmLoading, loadModel } = useWebLLM()
  
  const resumeInputRef = useRef(null)
  const jdInputRef = useRef(null)

  const jdAdded = !!(jdFile || jdText)
  const resumeAdded = !!resumeFile

  // Notify parent of state changes
  useEffect(() => {
    if (onResumeChange) onResumeChange(resumeAdded)
  }, [resumeAdded, onResumeChange])

  useEffect(() => {
    if (onJdChange) onJdChange(jdAdded)
  }, [jdAdded, onJdChange])

  const formatBytes = (bytes, decimals = 1) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // --- Handlers for Resume ---
  const handleResumeUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setResumeFile({
        name: file.name,
        size: formatBytes(file.size),
        date: getTodayDate(),
        raw: file
      })
    }
  }

  const handleRemoveResume = () => {
    setResumeFile(null)
    if (resumeInputRef.current) resumeInputRef.current.value = ''
  }

  // --- Handlers for JD ---
  const handleJdUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setJdFile({
        name: file.name,
        size: formatBytes(file.size),
        date: getTodayDate(),
        raw: file
      })
      setJdText('')
      setIsPastingJD(false)
    }
  }
  
  const handleRemoveJD = () => {
    setJdFile(null)
    setJdText('')
    if (jdInputRef.current) jdInputRef.current.value = ''
  }

  const handleStartPaste = () => {
    setIsPastingJD(true)
    setTempJdText(jdText)
  }

  const handleSavePastedJD = () => {
    if (tempJdText.trim()) {
      setJdText(tempJdText)
      setJdFile(null)
    }
    setIsPastingJD(false)
  }

  const handleCancelPaste = () => {
    setIsPastingJD(false)
  }

  // --- Analyze Handler (Web-LLM powered) ---
  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setAiStatus('Extracting text from PDF...')

    try {
      // Step 1: Send files to backend for PDF text extraction only
      const formData = new FormData()
      if (resumeFile && resumeFile.raw) formData.append('resume', resumeFile.raw)
      if (jdFile && jdFile.raw) formData.append('jdFile', jdFile.raw)
      else if (jdText) formData.append('jdText', jdText)

      const extractRes = await fetch('http://localhost:5001/api/extract', {
        method: 'POST',
        body: formData
      })
      const extracted = await extractRes.json()
      if (!extractRes.ok) throw new Error(extracted.error || 'Text extraction failed')

      // Step 2: Load Web-LLM model if not already loaded
      setAiStatus('Loading AI model (first time may take ~1 min)...')
      await loadModel()

      // Step 3: Run AI analysis locally in the browser
      setAiStatus('Analyzing with AI...')
      const aiResult = await analyzeResume(
        extracted.resumeText,
        extracted.jdText,
        (partial) => setAiStatus('AI thinking...')
      )

      if (onAnalyze) {
        onAnalyze({
          resume: resumeFile,
          jd: jdFile || { text: jdText },
          analysisResult: aiResult
        })
      }
    } catch (error) {
      console.error('Analysis error:', error)
      // Fallback to rule-based backend if Web-LLM fails
      try {
        setAiStatus('AI unavailable — using rule-based analysis...')
        const formData = new FormData()
        if (resumeFile && resumeFile.raw) formData.append('resume', resumeFile.raw)
        if (jdFile && jdFile.raw) formData.append('jdFile', jdFile.raw)
        else if (jdText) formData.append('jdText', jdText)
        const fallbackRes = await fetch('http://localhost:5001/api/analyze', { method: 'POST', body: formData })
        const fallbackData = await fallbackRes.json()
        if (!fallbackRes.ok) throw new Error(fallbackData.error)
        if (onAnalyze) onAnalyze({ resume: resumeFile, jd: jdFile || { text: jdText }, analysisResult: fallbackData.data })
      } catch (fallbackErr) {
        alert(`Analysis failed: ${fallbackErr.message}\n\nMake sure backend is running on port 5001 and you uploaded a valid PDF.`)
      }
    } finally {
      setIsAnalyzing(false)
      setAiStatus('')
    }
  }

  return (
    <div className="upload-wrapper">
      {/* Hidden file inputs */}
      <input type="file" ref={resumeInputRef} onChange={handleResumeUpload} style={{ display: 'none' }} accept=".pdf,.docx" />
      <input type="file" ref={jdInputRef} onChange={handleJdUpload} style={{ display: 'none' }} accept=".pdf,.docx,.txt" />

      <div className="upload-cards-row">
        
        {/* LEFT CARD - RESUME */}
        <div className="upload-card">
          <div className="upload-card__header">
            <div className="upload-card__title">
              <FileText size={18} color="#2563EB" strokeWidth={2.5} />
              <h3>Your Resume</h3>
            </div>
            {resumeAdded ? (
              <div className="upload-card__status upload-card__status--success">
                <Check size={14} strokeWidth={3} />
                Uploaded
              </div>
            ) : (
              <div className="upload-card__status upload-card__status--warning">
                Not Added
              </div>
            )}
          </div>

          {resumeAdded ? (
            <div className="upload-card__file-box">
              <div className="upload-card__file-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#FCA5A5"></path>
                  <path d="M14 2v6h6" fill="#EF4444"></path>
                  <path d="M16 13H8v2h8v-2zM16 17H8v2h8v-2zM10 9H8v2h2V9z" fill="#fff"></path>
                </svg>
              </div>
              <div className="upload-card__file-info">
                <div className="upload-card__filename" title={resumeFile.name}>
                  {resumeFile.name.length > 30 ? resumeFile.name.substring(0, 30) + '...' : resumeFile.name}
                </div>
                <div className="upload-card__file-meta">Uploaded on {resumeFile.date}</div>
              </div>
              <div className="upload-card__file-size">{resumeFile.size}</div>
            </div>
          ) : (
            <div className="upload-card__dropzone" style={{ borderColor: '#93C5FD', backgroundColor: '#EFF6FF', cursor: 'pointer' }} onClick={() => resumeInputRef.current?.click()}>
              <div className="upload-card__dropzone-icon" style={{ backgroundColor: '#3B82F6' }}>
                <UploadCloud size={24} color="#fff" />
              </div>
              <h4 style={{ color: '#2563EB' }}>Upload Resume</h4>
              <p>Click to browse or drag file here</p>
              <span>PDF, DOCX (Max 5MB)</span>

              <div className="upload-card__dropzone-actions" style={{ justifyContent: 'center' }}>
                <button className="upload-card__btn-outline" style={{ borderColor: '#3B82F6', color: '#2563EB' }}>
                  <Upload size={16} color="#2563EB" />
                  Select File
                </button>
              </div>
            </div>
          )}

          {resumeAdded && (
            <div className="upload-card__actions">
              <button className="upload-card__btn-view">View Resume</button>
              <button className="upload-card__btn-delete" onClick={handleRemoveResume}>
                <Trash2 size={16} color="#9CA3AF" />
              </button>
            </div>
          )}
        </div>

        {/* MIDDLE ARROW */}
        <div className="upload-arrow" style={{ backgroundColor: jdAdded ? '#DBEAFE' : '#E5E7EB' }}>
          <ArrowRight size={20} color={jdAdded ? '#2563EB' : '#9CA3AF'} strokeWidth={3} />
        </div>

        {/* RIGHT CARD - JOB DESCRIPTION */}
        <div className="upload-card">
          <div className="upload-card__header">
            <div className="upload-card__title">
              <div className="upload-card__icon-jd">
                <FileText size={16} color="#8B5CF6" strokeWidth={2.5} />
              </div>
              <h3>Job Description</h3>
            </div>
            {jdAdded ? (
              <div className="upload-card__status upload-card__status--success">
                <Check size={14} strokeWidth={3} />
                Added
              </div>
            ) : (
              <div className="upload-card__status upload-card__status--warning">
                Not Added
              </div>
            )}
          </div>

          {isPastingJD ? (
            <div className="upload-card__paste-area">
              <textarea 
                placeholder="Paste job description here..."
                value={tempJdText}
                onChange={(e) => setTempJdText(e.target.value)}
                className="upload-card__textarea"
                autoFocus
              />
              <div className="upload-card__paste-actions">
                <button className="upload-card__btn-cancel" onClick={handleCancelPaste}>Cancel</button>
                <button className="upload-card__btn-save" onClick={handleSavePastedJD}>Save JD</button>
              </div>
            </div>
          ) : jdAdded ? (
            <div className="upload-card__file-box">
              <div className="upload-card__file-icon" style={{ backgroundColor: '#F3E8FF' }}>
                <FileText size={24} color="#8B5CF6" />
              </div>
              <div className="upload-card__file-info">
                {jdFile ? (
                  <>
                    <div className="upload-card__filename" title={jdFile.name}>
                      {jdFile.name.length > 30 ? jdFile.name.substring(0, 30) + '...' : jdFile.name}
                    </div>
                    <div className="upload-card__file-meta">Uploaded on {jdFile.date}</div>
                  </>
                ) : (
                  <>
                    <div className="upload-card__filename">Pasted Job Description</div>
                    <div className="upload-card__file-meta">{jdText.trim().split(/\s+/).length} words</div>
                  </>
                )}
              </div>
              {jdFile && <div className="upload-card__file-size">{jdFile.size}</div>}
            </div>
          ) : (
            <div className="upload-card__dropzone">
              <div className="upload-card__dropzone-icon">
                <UploadCloud size={24} color="#ffffff" />
              </div>
              <h4>Add Job Description</h4>
              <p>Paste job description or upload file</p>
              <span>PDF, DOCX or TXT (Max 10MB)</span>

              <div className="upload-card__dropzone-actions">
                <button className="upload-card__btn-outline" onClick={handleStartPaste}>
                  <ClipboardPaste size={16} color="#8B5CF6" />
                  Paste JD
                </button>
                <button className="upload-card__btn-outline" onClick={() => jdInputRef.current?.click()}>
                  <Upload size={16} color="#8B5CF6" />
                  Upload JD
                </button>
              </div>
            </div>
          )}

          {jdAdded && !isPastingJD && (
            <div className="upload-card__actions">
              <button className="upload-card__btn-view" style={{ borderColor: '#8B5CF6', color: '#8B5CF6' }} onClick={() => !jdFile ? handleStartPaste() : null}>
                {jdFile ? 'View JD' : 'Edit JD'}
              </button>
              <button className="upload-card__btn-delete" onClick={handleRemoveJD}>
                <Trash2 size={16} color="#9CA3AF" />
              </button>
            </div>
          )}

        </div>

      </div>

      <div className="upload-footer">
        <button 
          className={`upload-footer__btn ${resumeAdded && jdAdded ? 'upload-footer__btn--active' : ''}`}
          disabled={!resumeAdded || !jdAdded || isAnalyzing}
          onClick={handleAnalyze}
        >
          {isAnalyzing ? (
            <Loader2 size={16} className="spin-icon" />
          ) : (
            <span className="upload-footer__stars">âœ¨</span>
          )}
          {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
        </button>
        {(!resumeAdded || !jdAdded) && (
          <div className="upload-footer__hint">Please add both resume and job description to continue</div>
        )}
      </div>
    </div>
  )
}


