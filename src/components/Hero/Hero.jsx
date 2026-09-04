import React, { useRef, useEffect } from 'react'
import { FileText, Play } from 'lucide-react'
import Dashboard from '../Dashboard/Dashboard'
import './Hero.css'

function createRipple(e) {
  const btn = e.currentTarget
  const circle = document.createElement('span')
  const rect = btn.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  circle.style.width = circle.style.height = `${size}px`
  circle.style.left = `${e.clientX - rect.left - size / 2}px`
  circle.style.top = `${e.clientY - rect.top - size / 2}px`
  circle.classList.add('ripple')
  btn.appendChild(circle)
  circle.addEventListener('animationend', () => circle.remove())
}

export default function Hero({ onGetStarted }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    /* ── Animation loop for 4 auto-hover spots ── */
    let rafId
    let startTime = performance.now()

    const animate = (now) => {
      const t = (now - startTime) / 1000
      const rect = section.getBoundingClientRect()
      const w = rect.width
      const h = rect.height

      // Spot 1: Lazy figure-eight
      const x1 = w * 0.5 + w * 0.3 * Math.sin(t * 0.4)
      const y1 = h * 0.5 + h * 0.3 * Math.sin(t * 0.8)

      // Spot 2: Large circular orbit
      const x2 = w * 0.5 + w * 0.4 * Math.cos(t * 0.3 + 2)
      const y2 = h * 0.5 + h * 0.3 * Math.sin(t * 0.3 + 2)

      // Spot 3: Bouncing sine wave bottom
      const x3 = w * 0.5 + w * 0.4 * Math.sin(t * 0.5 + 4)
      const y3 = h * 0.7 + h * 0.2 * Math.cos(t * 0.7 + 4)

      // Spot 4: Top sweeping wave
      const x4 = w * 0.5 + w * 0.45 * Math.sin(t * 0.25 + 1)
      const y4 = h * 0.3 + h * 0.15 * Math.cos(t * 0.6 + 1)

      section.style.setProperty('--auto1-x', `${x1}px`)
      section.style.setProperty('--auto1-y', `${y1}px`)
      section.style.setProperty('--auto2-x', `${x2}px`)
      section.style.setProperty('--auto2-y', `${y2}px`)
      section.style.setProperty('--auto3-x', `${x3}px`)
      section.style.setProperty('--auto3-y', `${y3}px`)
      section.style.setProperty('--auto4-x', `${x4}px`)
      section.style.setProperty('--auto4-y', `${y4}px`)

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    /* ── Mouse events ── */
    const handleMouseMove = (e) => {
      const rect = section.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      section.style.setProperty('--mouse-x', `${x}px`)
      section.style.setProperty('--mouse-y', `${y}px`)
      section.classList.add('hero--mouse-active')
    }

    const handleMouseLeave = () => {
      section.classList.remove('hero--mouse-active')
    }

    section.addEventListener('mousemove', handleMouseMove)
    section.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(rafId)
      section.removeEventListener('mousemove', handleMouseMove)
      section.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <section ref={sectionRef} className="hero" id="hero" aria-label="Hero section">
      {/* Decorative blur blobs */}
      <div className="hero__blob hero__blob--1" aria-hidden="true" />
      <div className="hero__blob hero__blob--2" aria-hidden="true" />

      {/* ── ORIGINAL CSS DOT GRID AND HOVER EFFECTS ── */}
      {/* Dot grid base */}
      <div className="hero__dotgrid" aria-hidden="true" />
      {/* Interactive mouse spotlight */}
      <div className="hero__spotlight" aria-hidden="true" />
      {/* Blue dot highlight layer (masked to cursor radius) */}
      <div className="hero__dotgrid-hover" aria-hidden="true" />

      <div className="hero__inner">
        {/* Announcement badge */}
        <div className="hero__badge reveal">
          <span className="hero__badge-star">✨</span>
          <span>New: Gemini Pro Integration now live</span>
        </div>

        {/* Headline */}
        <h1 className="hero__headline reveal" style={{ animationDelay: '0.1s' }}>
          Master Your Job Search with
          <br />
          <span className="hero__headline-gradient">
            AI-Powered Resume Analysis.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero__subtitle reveal" style={{ animationDelay: '0.18s' }}>
          Optimize your resume for ATS, identify critical skill gaps, and land your dream
          <br className="hero__br" />
          job faster. SmartHire analyzes your experience against real-world job
          <br className="hero__br" />
          descriptions in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="hero__buttons reveal" style={{ animationDelay: '0.26s' }}>
          <button
            className="hero__btn hero__btn--primary"
            id="btn-upload-resume"
            onClick={(e) => { createRipple(e); if (onGetStarted) onGetStarted(); }}
          >
            <FileText size={16} strokeWidth={2} />
            Upload Resume
          </button>
          <button
            className="hero__btn hero__btn--secondary"
            id="btn-view-demo"
            onClick={(e) => { createRipple(e); if (onGetStarted) onGetStarted(); }}
          >
            View Demo
            <Play size={14} strokeWidth={2} />
          </button>
        </div>

        {/* Dashboard preview */}
        <div className="hero__dashboard reveal" style={{ animationDelay: '0.38s' }}>
          <Dashboard />
        </div>
      </div>
    </section>
  )
}
