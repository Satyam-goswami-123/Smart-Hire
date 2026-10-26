import React, { useState } from 'react'
import { AlertCircle, Lightbulb, Copy, Check } from 'lucide-react'
import './ActionableFeedback.css'

const FEEDBACK_DATA = [
  {
    id: 1,
    issue: 'Missing quantifiable metrics in your recent experience.',
    why: 'The JD repeatedly emphasizes "scaling systems" and "reducing latency." Hiring managers want to see the exact impact you had.',
    original: 'Improved database query performance for the main application.',
    optimized: 'Reduced database query latency by 45% by implementing Redis caching layer, supporting a scale of 10k+ concurrent users.'
  },
  {
    id: 2,
    issue: 'Missing key technical keyword: "Kubernetes".',
    why: 'The job description lists Kubernetes as a strict requirement. If you have experience with it, it must be explicitly mentioned to pass the ATS.',
    original: 'Deployed containerized applications to cloud environments.',
    optimized: 'Orchestrated the deployment of 50+ microservices using Kubernetes (EKS), achieving 99.99% uptime and zero-downtime deployments.'
  }
]

export default function ActionableFeedback() {
  const [copiedId, setCopiedId] = useState(null)

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="actionable-feedback">
      <div className="actionable-feedback__header">
        <h2 className="actionable-feedback__title">Smart Suggestions & Rewrites</h2>
        <p className="actionable-feedback__subtitle">Copy and paste these AI-optimized bullet points directly into your resume.</p>
      </div>

      <div className="actionable-feedback__list">
        {FEEDBACK_DATA.map((item) => (
          <div key={item.id} className="feedback-card">
            <div className="feedback-card__analysis">
              <div className="feedback-card__row">
                <div className="feedback-card__icon feedback-card__icon--issue">
                  <AlertCircle size={16} />
                </div>
                <div>
                  <h4>The Issue</h4>
                  <p>{item.issue}</p>
                </div>
              </div>
              <div className="feedback-card__row">
                <div className="feedback-card__icon feedback-card__icon--why">
                  <Lightbulb size={16} />
                </div>
                <div>
                  <h4>Why it matters</h4>
                  <p>{item.why}</p>
                </div>
              </div>
            </div>

            <div className="feedback-card__rewrite">
              <div className="feedback-card__rewrite-header">
                <h4>AI Optimized Rewrite</h4>
                <button 
                  className={`feedback-card__copy-btn ${copiedId === item.id ? 'feedback-card__copy-btn--copied' : ''}`}
                  onClick={() => handleCopy(item.optimized, item.id)}
                >
                  {copiedId === item.id ? (
                    <><Check size={14} /> Copied</>
                  ) : (
                    <><Copy size={14} /> Copy to Clipboard</>
                  )}
                </button>
              </div>
              <div className="feedback-card__rewrite-box">
                {item.optimized}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
