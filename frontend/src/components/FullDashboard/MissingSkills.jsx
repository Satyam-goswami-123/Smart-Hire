import React from 'react'
import { MapPin } from 'lucide-react'
import './MissingSkills.css'

export default function MissingSkills() {
  return (
    <div className="missing">
      <div className="missing__header">
        <div className="missing__icon-wrapper">
          <MapPin size={18} color="#EF4444" strokeWidth={2.5} />
        </div>
        <h2 className="missing__title">Missing Skills<br/>Summary</h2>
      </div>

      <p className="missing__desc">
        Based on your recent job analyses, these skills appear frequently but are missing from your resume.
      </p>

      <div className="missing__tags">
        <span className="missing__tag">Python</span>
        <span className="missing__tag">Kubernetes</span>
        <span className="missing__tag">Cloud Architecture</span>
      </div>

      <button className="missing__btn">
        View Gap Analysis Details
      </button>
    </div>
  )
}
