import React, { useState } from 'react'
import { FileText, Check, Trash2, ArrowRight, UploadCloud, ClipboardPaste, Upload, Loader2 } from 'lucide-react'
import './UploadSection.css'

export default function UploadSection({ onAnalyze }) {
  const [jdUploaded, setJdUploaded] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleUploadJD = () => {
    setJdUploaded(true)
  }

  const handleRemoveJD = () => {
    setJdUploaded(false)
  }

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      if (onAnalyze) onAnalyze()
    }, 1500) // mock 1.5s loading time
  }

  return (
    <div className="upload-wrapper">
      <div className="upload-cards-row">
        
        {/* LEFT CARD - RESUME */}
        <div className="upload-card">
          <div className="upload-card__header">
            <div className="upload-card__title">
              <FileText size={18} color="#2563EB" strokeWidth={2.5} />
              <h3>Your Resume</h3>
            </div>
            <div className="upload-card__status upload-card__status--success">
              <Check size={14} strokeWidth={3} />
              Uploaded
            </div>
          </div>

          <div className="upload-card__file-box">
            <div className="upload-card__file-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#FCA5A5"></path>
                <path d="M14 2v6h6" fill="#EF4444"></path>
                <path d="M16 13H8v2h8v-2zM16 17H8v2h8v-2zM10 9H8v2h2V9z" fill="#fff"></path>
              </svg>
            </div>
            <div className="upload-card__file-info">
              <div className="upload-card__filename">Alex_Johnson_Resume.pdf</div>
              <div className="upload-card__file-meta">Uploaded on Oct 25, 2024</div>
            </div>
            <div className="upload-card__file-size">245 KB</div>
          </div>

          <div className="upload-card__actions">
            <button className="upload-card__btn-view">View Resume</button>
            <button className="upload-card__btn-delete">
              <Trash2 size={16} color="#9CA3AF" />
            </button>
          </div>
        </div>

        {/* MIDDLE ARROW */}
        <div className="upload-arrow" style={{ backgroundColor: jdUploaded ? '#DBEAFE' : '#E5E7EB' }}>
          <ArrowRight size={20} color={jdUploaded ? '#2563EB' : '#9CA3AF'} strokeWidth={3} />
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
            {jdUploaded ? (
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

          {jdUploaded ? (
            <div className="upload-card__file-box">
              <div className="upload-card__file-icon" style={{ backgroundColor: '#F3E8FF' }}>
                <FileText size={24} color="#8B5CF6" />
              </div>
              <div className="upload-card__file-info">
                <div className="upload-card__filename">Senior_Cloud_Eng_JD.docx</div>
                <div className="upload-card__file-meta">Added just now</div>
              </div>
              <div className="upload-card__file-size">18 KB</div>
            </div>
          ) : (
            <div className="upload-card__dropzone">
              <div className="upload-card__dropzone-icon">
                <UploadCloud size={24} color="#8B5CF6" />
              </div>
              <h4>Add Job Description</h4>
              <p>Paste job description or upload file</p>
              <span>PDF, DOCX or TXT (Max 10MB)</span>

              <div className="upload-card__dropzone-actions">
                <button className="upload-card__btn-outline" onClick={handleUploadJD}>
                  <ClipboardPaste size={16} color="#8B5CF6" />
                  Paste JD
                </button>
                <button className="upload-card__btn-outline" onClick={handleUploadJD}>
                  <Upload size={16} color="#8B5CF6" />
                  Upload JD
                </button>
              </div>
            </div>
          )}

          {jdUploaded && (
            <div className="upload-card__actions">
              <button className="upload-card__btn-view" style={{ borderColor: '#8B5CF6', color: '#8B5CF6' }}>View JD</button>
              <button className="upload-card__btn-delete" onClick={handleRemoveJD}>
                <Trash2 size={16} color="#9CA3AF" />
              </button>
            </div>
          )}

        </div>

      </div>

      <div className="upload-footer">
        <button 
          className={`upload-footer__btn ${jdUploaded ? 'upload-footer__btn--active' : ''}`}
          disabled={!jdUploaded || isAnalyzing}
          onClick={handleAnalyze}
        >
          {isAnalyzing ? (
            <Loader2 size={16} className="spin-icon" />
          ) : (
            <span className="upload-footer__stars">✨</span>
          )}
          {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>
    </div>
  )
}
