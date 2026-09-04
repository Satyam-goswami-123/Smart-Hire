import React, { useState } from 'react'
import { Download, Share2, Copy, Check, Star, ChevronRight, AlertCircle, Lightbulb, ArrowRight, Crown } from 'lucide-react'
import './ResumeAnalysis.css'

/* ─── SVG Circular Progress Ring ─── */
function CircleRing({ pct, size = 100, stroke = 8, color = '#2563EB' }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  )
}

/* ─── Score Card ─── */
function ScoreCard({ label, value, subtitle, color, pct, isGrade }) {
  return (
    <div className="ra-score-card">
      <div className="ra-score-ring">
        {isGrade ? (
          <div className="ra-grade-text" style={{ color }}>{value}</div>
        ) : (
          <>
            <CircleRing pct={pct} size={90} stroke={8} color={color} />
            <div className="ra-ring-value" style={{ color }}>{value}</div>
          </>
        )}
      </div>
      <div className="ra-score-label">{label}</div>
      <div className="ra-score-sub" style={{ color }}>{subtitle}</div>
      {label === 'Resume Match Score' && (
        <div className="ra-stars">★★★★★</div>
      )}
    </div>
  )
}

/* ─── Mini Sparkline ─── */
function SparklineCard() {
  return (
    <div className="ra-sparkline-card">
      <div className="ra-sparkline-badge">▲ 96%</div>
      <div className="ra-sparkline-label">Expected Score After Improvements</div>
      <svg viewBox="0 0 120 40" className="ra-sparkline-svg">
        <defs>
          <linearGradient id="spGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(16,185,129,0.35)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0)" />
          </linearGradient>
        </defs>
        <path d="M0 35 Q30 25 60 20 T120 5" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
        <path d="M0 35 Q30 25 60 20 T120 5 L120 40 L0 40 Z" fill="url(#spGrad)" />
      </svg>
      <button className="ra-sparkline-btn">View Improvement Plan</button>
    </div>
  )
}

/* ─── Donut Chart ─── */
function DonutChart({ matched, missing, partial, total }) {
  const matchedPct = matched / total
  const missingPct = missing / total
  const partialPct = partial / total
  const r = 40, circ = 2 * Math.PI * r
  const matchedDash = circ * matchedPct
  const missingDash = circ * missingPct
  const matchedOffset = 0
  const missingOffset = -matchedDash
  const partialOffset = -(matchedDash + missingDash)
  return (
    <div className="ra-donut-wrap">
      <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="#2563EB" strokeWidth="12"
          strokeDasharray={`${matchedDash} ${circ}`} strokeDashoffset={matchedOffset} />
        <circle cx="50" cy="50" r={r} fill="none" stroke="#EF4444" strokeWidth="12"
          strokeDasharray={`${missingDash} ${circ}`} strokeDashoffset={missingOffset} />
        <circle cx="50" cy="50" r={r} fill="none" stroke="#F59E0B" strokeWidth="12"
          strokeDasharray={`${circ * partialPct} ${circ}`} strokeDashoffset={partialOffset} />
      </svg>
      <div className="ra-donut-center">
        <span className="ra-donut-num">{total}</span>
        <span className="ra-donut-sub">Total Skills</span>
      </div>
    </div>
  )
}

/* ─── ATS Checklist Item ─── */
function ChecklistItem({ text, ok, warning }) {
  return (
    <div className="ra-checklist-item">
      <span className={`ra-checklist-icon ${ok ? 'ok' : warning ? 'warn' : 'fail'}`}>
        {ok ? '✓' : warning ? '◉' : '✕'}
      </span>
      <span className="ra-checklist-text">{text}</span>
    </div>
  )
}

/* ─── Copy Button ─── */
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button className={`ra-copy-btn ${copied ? 'copied' : ''}`} onClick={handle}>
      {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
    </button>
  )
}

/* ─── DATA ─── */
const SUGGESTIONS = [
  {
    issue: 'Missing quantifiable metrics in your recent experience.',
    why: 'The JD repeatedly emphasises "scaling systems" and "reducing latency." Hiring managers want to see the exact impact you had.',
    optimized: 'Reduced database query latency by 45% by implementing Redis caching layer, supporting a scale of 10k+ concurrent users.'
  },
  {
    issue: 'Missing key technical keyword: "Kubernetes".',
    why: 'The JD lists Kubernetes as a strict requirement. If you have experience with it, it must be explicitly mentioned to pass the ATS.',
    optimized: 'Orchestrated deployment of 50+ microservices using Kubernetes (EKS), achieving 99.99% uptime and zero-downtime deployments.'
  },
  {
    issue: 'Leadership experience is not highlighted.',
    why: 'The role is Senior-level and the JD mentions "lead cross-functional teams." Add team leadership context to your bullets.',
    optimized: 'Led a team of 6 backend engineers to deliver a real-time data pipeline, cutting processing time by 60% within 3 sprints.'
  },
]

const SKILL_REPLACEMENTS = [
  { current: 'Basic DSA', suggested: 'Data Structures & Algorithms' },
  { current: 'Basic Python', suggested: 'Python Programming' },
  { current: 'Basic Java', suggested: 'Core Java' },
  { current: 'React', suggested: 'ReactJS' },
  { current: 'Node', suggested: 'Node.js + Express.js' },
  { current: 'Mongo', suggested: 'MongoDB' },
  { current: 'HTML CSS JS', suggested: 'HTML5 + CSS3 + JavaScript (ES6+)' },
  { current: 'Git', suggested: 'Git & GitHub' },
  { current: 'Cloud', suggested: 'AWS / Google Cloud Platform' },
]

const IMPACT_SCORES = [
  { label: 'Technical Skills', pct: 90, color: '#2563EB' },
  { label: 'Projects', pct: 80, color: '#7C3AED' },
  { label: 'Experience', pct: 75, color: '#059669' },
  { label: 'Leadership', pct: 60, color: '#F59E0B' },
  { label: 'Achievements', pct: 45, color: '#EF4444' },
  { label: 'Communication', pct: 70, color: '#0891B2' },
]

const ROADMAP = [
  { step: 1, action: 'Add Kubernetes experience', gain: '+3%' },
  { step: 2, action: 'Add more quantifiable metrics', gain: '+6%' },
  { step: 3, action: 'Improve project descriptions', gain: '+4%' },
  { step: 4, action: 'Add CI/CD experience', gain: '+3%' },
  { step: 5, action: 'Add relevant certifications', gain: '+2%' },
]

const INTERVIEW_QS = {
  Technical: [
    'Explain the difference between monoliths and microservices architecture.',
    'How would you design a highly scalable system?',
    'What is Kubernetes and how does it work?',
    'Explain CI/CD pipelines and tools you have used.',
    'How do you optimise database performance?',
  ],
  Behavioral: [
    'Describe a time you led a cross-functional team under pressure.',
    'How do you handle conflicting priorities?',
    'Tell me about a significant technical failure and what you learned.',
    'How do you mentor junior developers?',
  ],
  'System Design': [
    'Design a URL shortener like bit.ly.',
    'Design a real-time notification system.',
    'How would you architect a multi-tenant SaaS application?',
    'Design a distributed caching system.',
  ],
}

/* ─── MAIN COMPONENT ─── */
export default function ResumeAnalysis() {
  const [showAllSuggestions, setShowAllSuggestions] = useState(false)
  const [activeTab, setActiveTab] = useState('Technical')
  const visibleSuggestions = showAllSuggestions ? SUGGESTIONS : SUGGESTIONS.slice(0, 2)

  return (
    <div className="ra">

      {/* ── HEADER ── */}
      <div className="ra-header">
        <div className="ra-header-left">
          <div className="ra-header-back">
            <span>←</span> Analysis Results
          </div>
          <h1 className="ra-header-title">Senior Cloud Engineer vs. Alex_Johnson_Resume.pdf</h1>
          <p className="ra-header-meta">Analysed on Oct 25, 2024 at 10:30 AM <span className="ra-badge-done">✓ Analysis Completed</span></p>
        </div>
        <div className="ra-header-actions">
          <button className="ra-btn-outline"><Download size={15} /> Download Report</button>
          <button className="ra-btn-primary"><Share2 size={15} /> Share</button>
        </div>
      </div>

      {/* ── ROW 1: SCORE CARDS ── */}
      <div className="ra-scores-row">
        <ScoreCard label="Resume Match Score" value="85%" subtitle="Strong Match" color="#2563EB" pct={85} />
        <ScoreCard label="ATS Score" value="91%" subtitle="Excellent" color="#10B981" pct={91} />
        <ScoreCard label="Hiring Probability" value="78%" subtitle="Good Chance" color="#F59E0B" pct={78} />
        <ScoreCard label="Resume Grade" value="A-" subtitle="Very Good" color="#7C3AED" pct={88} isGrade />
        <SparklineCard />
      </div>

      {/* ── ROW 2: SKILL MATCH + KEYWORD + ATS CHECKLIST ── */}
      <div className="ra-row2">

        {/* Skill Match */}
        <div className="ra-card">
          <h3 className="ra-card-title">Skill Match Overview</h3>
          <div className="ra-skill-legend">
            <span className="ra-legend-dot" style={{ background: '#2563EB' }} />Matched (18)
            <span className="ra-legend-dot ml" style={{ background: '#EF4444' }} />Missing (7)
            <span className="ra-legend-dot ml" style={{ background: '#F59E0B' }} />Partial (4)
          </div>
          <div className="ra-skill-body">
            <DonutChart matched={18} missing={7} partial={4} total={29} />
            <div className="ra-skill-tags">
              <div className="ra-tags-group">
                <div className="ra-tags-label">Matched Skills</div>
                <div className="ra-tags">
                  {['AWS', 'Python', 'SQL', 'Docker', 'Linux', 'CI/CD', 'Java', 'Git', '+10 more'].map(s => (
                    <span key={s} className="ra-tag ra-tag--matched">{s}</span>
                  ))}
                </div>
              </div>
              <div className="ra-tags-group mt-8">
                <div className="ra-tags-label">Missing Skills</div>
                <div className="ra-tags">
                  {['Kubernetes', 'Redis', 'Terraform', 'GCP', 'Prometheus', 'Jenkins', 'Grafana'].map(s => (
                    <span key={s} className="ra-tag ra-tag--missing">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Keyword Coverage */}
        <div className="ra-card">
          <h3 className="ra-card-title">Keyword Coverage</h3>
          <div className="ra-keyword-legend">
            <span className="ra-legend-dot" style={{ background: '#2563EB' }} />Matched Keywords
            <span className="ra-legend-dot ml" style={{ background: '#EF4444' }} />Missing Keywords
          </div>
          <div className="ra-keyword-bar-wrap">
            <div className="ra-keyword-bar">
              <div className="ra-keyword-fill matched" style={{ width: '82%' }}>82%</div>
              <div className="ra-keyword-fill missing" style={{ width: '18%' }}>18%</div>
            </div>
          </div>
          <div className="ra-card-sub">Top Missing Keywords</div>
          <div className="ra-tags mt-4">
            {['Kubernetes', 'Microservices', 'Scalability', 'Cloud Architecture', 'Load Balancing'].map(k => (
              <span key={k} className="ra-tag ra-tag--keyword">{k}</span>
            ))}
          </div>
          <button className="ra-link-btn">View All Keywords <ChevronRight size={13} /></button>
        </div>

        {/* ATS Checklist */}
        <div className="ra-card">
          <h3 className="ra-card-title">ATS Checklist</h3>
          <p className="ra-card-hint">Your resume is almost ATS-friendly</p>
          <div className="ra-ats-ring-wrap">
            <CircleRing pct={95} size={72} stroke={7} color="#10B981" />
            <div className="ra-ats-ring-val">95%</div>
          </div>
          <div className="ra-checklist">
            {[
              { text: 'Contact Information', ok: true },
              { text: 'Professional Summary', ok: true },
              { text: 'Skills Section', ok: true },
              { text: 'Work Experience', ok: true },
              { text: 'Education', ok: true },
              { text: 'Projects', ok: true },
              { text: 'Certifications', warning: true },
              { text: 'Action Verbs', warning: true },
              { text: 'Quantifiable Metrics', ok: false },
              { text: 'LinkedIn/GitHub', ok: false },
            ].map(item => (
              <ChecklistItem key={item.text} {...item} />
            ))}
          </div>
          <button className="ra-link-btn">Improve ATS Score <ChevronRight size={13} /></button>
        </div>

      </div>

      {/* ── AI SUGGESTIONS ── */}
      <div className="ra-card ra-full-width">
        <div className="ra-suggestions-header">
          <div>
            <h3 className="ra-card-title">🤖 AI Suggestions & Rewrites</h3>
            <p className="ra-card-hint">Copy and paste these AI-optimised bullet points directly into your resume.</p>
          </div>
        </div>
        <div className="ra-suggestions-list">
          {visibleSuggestions.map((item, i) => (
            <div key={i} className="ra-suggestion-item">
              <div className="ra-suggestion-left">
                <div className="ra-issue-row">
                  <AlertCircle size={15} className="ra-icon-issue" />
                  <div>
                    <div className="ra-issue-label">The Issue</div>
                    <div className="ra-issue-text">{item.issue}</div>
                  </div>
                </div>
                <div className="ra-issue-row">
                  <Lightbulb size={15} className="ra-icon-why" />
                  <div>
                    <div className="ra-issue-label">Why it matters</div>
                    <div className="ra-issue-text">{item.why}</div>
                  </div>
                </div>
              </div>
              <div className="ra-suggestion-right">
                <div className="ra-rewrite-header">
                  <div className="ra-rewrite-title">✨ AI Optimized Rewrite</div>
                  <CopyBtn text={item.optimized} />
                </div>
                <div className="ra-rewrite-box">{item.optimized}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="ra-toggle-btn" onClick={() => setShowAllSuggestions(!showAllSuggestions)}>
          {showAllSuggestions ? '▲ Show Less' : `▼ View ${SUGGESTIONS.length - 2} More Suggestions`}
        </button>
      </div>

      {/* ── SKILL REPLACEMENT + RECRUITER VIEW ── */}
      <div className="ra-row2">

        {/* Skill Replacements */}
        <div className="ra-card ra-col-span-2">
          <h3 className="ra-card-title">🔄 Skill Replacement Suggestions</h3>
          <p className="ra-card-hint">Improve your skills wording for better match</p>
          <div className="ra-replace-table">
            <div className="ra-replace-head">
              <span>Current</span>
              <span></span>
              <span>Suggested</span>
            </div>
            {SKILL_REPLACEMENTS.map(row => (
              <div className="ra-replace-row" key={row.current}>
                <span className="ra-replace-current">{row.current}</span>
                <ArrowRight size={14} className="ra-replace-arrow" />
                <span className="ra-replace-suggested">{row.suggested}</span>
              </div>
            ))}
          </div>
          <button className="ra-link-btn mt-8">Apply All Suggestions <ChevronRight size={13} /></button>
        </div>

        {/* What Recruiters See */}
        <div className="ra-card">
          <h3 className="ra-card-title">👁️ What Recruiters See</h3>
          <div className="ra-recruiter-cols">
            <div>
              <div className="ra-recruiter-head strength">Strengths</div>
              {[
                'Strong backend development',
                'Good cloud understanding',
                'Hands-on with AWS',
                'Solid project experience',
              ].map(s => <div key={s} className="ra-recruiter-item strength">✓ {s}</div>)}
            </div>
            <div>
              <div className="ra-recruiter-head improve">Areas to Improve</div>
              {[
                'Missing Kubernetes experience',
                'No DevOps certifications',
                'Limited leadership keywords',
                'No measurable impact shown',
              ].map(s => <div key={s} className="ra-recruiter-item improve">✕ {s}</div>)}
            </div>
          </div>
          <button className="ra-link-btn mt-8">View Recruiter Perspective <ChevronRight size={13} /></button>
        </div>

      </div>

      {/* ── IMPACT SCORE + ROADMAP ── */}
      <div className="ra-row-half">

        {/* Resume Impact Score */}
        <div className="ra-card">
          <h3 className="ra-card-title">📊 Resume Impact Score</h3>
          <div className="ra-impact-list">
            {IMPACT_SCORES.map(item => (
              <div key={item.label} className="ra-impact-row">
                <div className="ra-impact-label">{item.label}</div>
                <div className="ra-impact-track">
                  <div className="ra-impact-fill" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                </div>
                <div className="ra-impact-pct" style={{ color: item.color }}>{item.pct}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Improvement Roadmap */}
        <div className="ra-card">
          <h3 className="ra-card-title">🗺️ Improvement Roadmap</h3>
          <div className="ra-roadmap-scores">
            <div className="ra-roadmap-current">
              <div className="ra-roadmap-score-label">Current Match Score</div>
              <div className="ra-roadmap-score blue">85%</div>
            </div>
            <div className="ra-roadmap-arrow">→</div>
            <div className="ra-roadmap-expected">
              <div className="ra-roadmap-score-label">Expected Match Score</div>
              <div className="ra-roadmap-score green">96%</div>
            </div>
          </div>
          <div className="ra-roadmap-badge">Total Improvement +11%</div>
          <div className="ra-roadmap-steps">
            {ROADMAP.map(item => (
              <div key={item.step} className="ra-roadmap-step">
                <div className="ra-roadmap-num">{item.step}</div>
                <div className="ra-roadmap-action">{item.action}</div>
                <div className="ra-roadmap-gain">{item.gain}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── INTERVIEW QUESTIONS + PREMIUM ── */}
      <div className="ra-row-half">

        {/* Top Interview Questions */}
        <div className="ra-card">
          <h3 className="ra-card-title">💬 Top Interview Questions <span className="ra-ai-chip">AI Generated</span></h3>
          <div className="ra-itabs">
            {Object.keys(INTERVIEW_QS).map(tab => (
              <button
                key={tab}
                className={`ra-itab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <ul className="ra-iq-list">
            {INTERVIEW_QS[activeTab].map((q, i) => (
              <li key={i} className="ra-iq-item">
                <span className="ra-iq-num">{i + 1}.</span>{q}
              </li>
            ))}
          </ul>
          <button className="ra-link-btn">View All Questions <ChevronRight size={13} /></button>
        </div>

        {/* Premium Upgrade */}
        <div className="ra-card ra-premium-card">
          <div className="ra-premium-header">
            <Crown size={20} className="ra-crown" />
            <h3>Unlock SmartHire Premium Features</h3>
          </div>
          <ul className="ra-premium-list">
            {[
              'Unlimited AI analyses',
              'AI Resume Rewrite (Unlimited)',
              'Cover Letter Generator',
              'LinkedIn Profile Optimisation',
              'Mock Interview with AI',
              'Resume Version Comparison',
              'Priority Support',
            ].map(f => (
              <li key={f}><Star size={13} className="ra-premium-star" /> {f}</li>
            ))}
          </ul>
          <button className="ra-premium-btn">Upgrade to Premium</button>
        </div>

      </div>

    </div>
  )
}
