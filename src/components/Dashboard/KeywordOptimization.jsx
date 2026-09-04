import React from 'react'
import './KeywordOptimization.css'

const KEYWORDS = [
  { label: 'Leadership Experience', pct: 90, color: '#2563EB' },
  { label: 'Cloud Computing',       pct: 72, color: '#2563EB' },
  { label: 'Strategic Planning',    pct: 65, color: '#6366F1' },
  { label: 'Storage Computing',     pct: 55, color: '#2563EB' },
  { label: 'Strategic Planning',    pct: 48, color: '#6366F1' },
]

export default function KeywordOptimization() {
  return (
    <div className="kw">
      <h3 className="kw__title">Keyword Optimization</h3>
      <div className="kw__list">
        {KEYWORDS.map((kw, i) => (
          <div key={i} className="kw__item">
            <div className="kw__item-left">
              <span className="kw__dot" style={{ background: kw.color }} />
              <span className="kw__label">{kw.label}</span>
            </div>
            <div className="kw__bar-track">
              <div
                className="kw__bar-fill"
                style={{
                  width: `${kw.pct}%`,
                  background: kw.color,
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
