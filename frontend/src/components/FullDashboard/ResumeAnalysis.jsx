import React, { useState } from 'react';
import { Download, Share2, Copy, Check, Star, ChevronRight, AlertCircle, Lightbulb, ArrowRight, Crown } from 'lucide-react';
import './ResumeAnalysis.css';

/* Circular Progress Ring */
function CircleRing({ pct, size = 100, stroke = 8, color = '#2563EB' }) {
  const safePct = Math.min(100, Math.max(0, isNaN(pct) ? 0 : pct));
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (safePct / 100) * circ;
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
  );
}

/* Score Card */
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
  );
}

/* Mini Sparkline */
function SparklineCard({ expectedPct = 95 }) {
  return (
    <div className="ra-sparkline-card">
      <div className="ra-sparkline-badge">▲ {expectedPct}%</div>
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
  );
}

/* Donut Chart */
function DonutChart({ matched, missing, partial, total }) {
  const safeTotal = total > 0 ? total : (matched + missing || 1);
  const matchedPct = matched / safeTotal;
  const missingPct = missing / safeTotal;
  const partialPct = partial / safeTotal;
  const r = 40, circ = 2 * Math.PI * r;
  const matchedDash = circ * matchedPct;
  const missingDash = circ * missingPct;
  const matchedOffset = 0;
  const missingOffset = -matchedDash;
  const partialOffset = -(matchedDash + missingDash);
  return (
    <div className="ra-donut-wrap">
      <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="#2563EB" strokeWidth={12}
          strokeDasharray={`${matchedDash} ${circ}`} strokeDashoffset={matchedOffset} />
        <circle cx="50" cy="50" r={r} fill="none" stroke="#EF4444" strokeWidth={12}
          strokeDasharray={`${missingDash} ${circ}`} strokeDashoffset={missingOffset} />
        <circle cx="50" cy="50" r={r} fill="none" stroke="#F59E0B" strokeWidth={12}
          strokeDasharray={`${circ * partialPct} ${circ}`} strokeDashoffset={partialOffset} />
      </svg>
      <div className="ra-donut-center">
        <span className="ra-donut-num">{safeTotal}</span>
        <span className="ra-donut-sub">Total Skills</span>
      </div>
    </div>
  );
}

/* ATS Checklist Item */
function ChecklistItem({ text, ok, warning }) {
  return (
    <div className="ra-checklist-item">
      <span className={`ra-checklist-icon ${ok ? 'ok' : warning ? 'warn' : 'fail'}`}>
        {ok ? '✓' : warning ? '◉' : '✕'}
      </span>
      <span className="ra-checklist-text">{text}</span>
    </div>
  );
}

/* Copy Button */
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className={`ra-copy-btn ${copied ? 'copied' : ''}`} onClick={handle}>
      {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
    </button>
  );
}

const INTERVIEW_QS = {
  Technical: [
    'Explain the difference between monoliths and microservices architecture.',
    'How would you design a highly scalable system?',
    'What are the primary factors to optimize database query performance?',
    'Explain CI/CD pipelines and tools you have used.',
    'How do you manage concurrency and race conditions in production?',
  ],
  Behavioral: [
    'Describe a time you led a cross-functional team under pressure.',
    'How do you handle conflicting priorities between speed and code quality?',
    'Tell me about a significant technical failure and what you learned.',
    'How do you mentor junior developers and foster best practices?',
  ],
  'System Design': [
    'Design a URL shortener like bit.ly with high availability.',
    'Design a real-time notification service handling 100k messages/sec.',
    'How would you architect a multi-tenant SaaS application?',
    'Design a distributed caching and rate-limiting system.',
  ],
};

/* MAIN COMPONENT */
export default function ResumeAnalysis({ analysisData }) {
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState('Technical');

  const resumeName = analysisData?.resume?.name || 'Uploaded_Resume.pdf';
  let jdTitle = 'Software Engineer Role';
  if (analysisData?.jd?.name) {
    jdTitle = analysisData.jd.name.split('.')[0].replace(/[-_]/g, ' ');
  } else if (analysisData?.jd?.text) {
    jdTitle = 'Target Job Description';
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  // Backend Data Extraction
  const result = analysisData?.analysisResult || {};
  const matchScore = result.matchScore !== undefined ? result.matchScore : 78;
  const atsScore = result.atsScore !== undefined ? result.atsScore : 82;
  const hiringProbability = result.hiringProbability || (matchScore >= 70 ? 'High' : matchScore >= 45 ? 'Medium' : 'Low');
  
  const matchedSkills = Array.isArray(result.matchedSkills) ? result.matchedSkills : ['React', 'JavaScript', 'Node.js', 'Git'];
  const missingSkills = Array.isArray(result.missingSkills) ? result.missingSkills : ['Docker', 'AWS', 'Kubernetes', 'CI/CD'];
  const totalJdSkills = (matchedSkills.length + missingSkills.length > 0) 
    ? (matchedSkills.length + missingSkills.length) 
    : (result.totalJdSkills || 1);

  const matchSubtitle = matchScore >= 80 ? 'Strong Match' : matchScore >= 50 ? 'Average Match' : 'Weak Match';
  const atsSubtitle = atsScore >= 80 ? 'Excellent' : atsScore >= 50 ? 'Needs Work' : 'Poor';
  
  let grade = 'B';
  if (atsScore >= 90) grade = 'A+';
  else if (atsScore >= 80) grade = 'A-';
  else if (atsScore >= 70) grade = 'B';
  else if (atsScore >= 60) grade = 'C';
  else grade = 'D';

  const probColor = hiringProbability === 'High' ? '#10B981' : hiringProbability === 'Medium' ? '#F59E0B' : '#EF4444';

  const checklistItems = result.checklist?.items || [
    { text: 'Contact Information', ok: true },
    { text: 'Professional Summary', ok: true },
    { text: 'Skills Section', ok: true },
    { text: 'Work Experience', ok: true },
    { text: 'Education', ok: true },
    { text: 'Projects', ok: true },
    { text: 'Certifications', warning: true },
    { text: 'Action Verbs', ok: true },
    { text: 'Quantifiable Metrics', ok: false },
    { text: 'LinkedIn/GitHub', ok: true },
  ];
  const atsChecklistPct = result.checklist?.checklistScore !== undefined ? result.checklist.checklistScore : atsScore;

  const defaultSuggestions = [
    {
      issue: 'Missing quantifiable metrics in your recent experience.',
      why: 'The JD repeatedly emphasizes impact. Hiring managers want to see the exact measurable outcomes you achieved.',
      optimized: 'Reduced database query latency by 45% by implementing Redis caching, supporting 10k+ concurrent users.'
    },
    {
      issue: missingSkills.length > 0 ? `Missing key technical requirement: ${missingSkills[0]}` : 'Lack of modern delivery keywords',
      why: 'ATS screening systems filter candidates who lack key required keywords.',
      optimized: `Orchestrated production services with automated CI/CD and ${missingSkills[0] || 'Docker'}, achieving 99.9% uptime.`
    }
  ];

  const aiSuggestions = (result.aiSuggestions && result.aiSuggestions.length > 0) 
    ? result.aiSuggestions 
    : defaultSuggestions;

  const visibleSuggestions = showAllSuggestions ? aiSuggestions : aiSuggestions.slice(0, 2);

  const skillReplacements = (result.skillReplacements && result.skillReplacements.length > 0)
    ? result.skillReplacements
    : [
        { current: 'Basic Git', suggested: 'Git & Automated GitHub Actions' },
        { current: 'REST API', suggested: 'Secure RESTful APIs & Microservices' },
        { current: 'SQL', suggested: 'Advanced SQL Query Optimization & Indexing' },
        { current: 'React', suggested: 'React.js (Next.js & Modern State Architecture)' },
      ];

  const recruiterStrengths = (result.strengths && result.strengths.length > 0)
    ? result.strengths
    : [
        'Strong alignment with core software engineering competencies',
        'Demonstrates practical project implementation',
        'Standard ATS-compliant layout and structure'
      ];

  const recruiterImprovements = (result.improvements && result.improvements.length > 0)
    ? result.improvements
    : [
        'Add measurable metrics (percentages, speed, scale) to experience bullets',
        'Incorporate missing target job keywords explicitly',
        'Add clickable links to LinkedIn and GitHub profiles'
      ];

  const impactScores = (result.impactScores && result.impactScores.length > 0)
    ? result.impactScores
    : [
        { label: 'Technical Skills', pct: Math.min(100, Math.max(50, matchScore)), color: '#2563EB' },
        { label: 'Projects & Portfolio', pct: 85, color: '#7C3AED' },
        { label: 'Experience & Depth', pct: 75, color: '#059669' },
        { label: 'Leadership & Initiative', pct: 60, color: '#F59E0B' },
        { label: 'Quantifiable Results', pct: 45, color: '#EF4444' },
        { label: 'ATS Formatting', pct: atsScore, color: '#0891B2' },
      ];

  const roadmap = result.roadmap || {
    steps: [
      { step: 1, action: 'Add top missing technical keywords to resume bullets', gain: '+6%' },
      { step: 2, action: 'Incorporate quantifiable metrics (% improved, scale handled)', gain: '+5%' },
      { step: 3, action: 'Include LinkedIn & GitHub links in contact header', gain: '+3%' },
      { step: 4, action: 'Highlight automated testing and cloud deployments', gain: '+2%' },
    ],
    totalGain: '+16%',
    expectedScore: Math.min(98, matchScore + 16)
  };

  return (
    <div className="ra">

      {/* HEADER */}
      <div className="ra-header">
        <div className="ra-header-left">
          <div className="ra-header-back">
            <span>←</span> Analysis Results
          </div>
          <h1 className="ra-header-title">{jdTitle} vs. {resumeName}</h1>
          <p className="ra-header-meta">Analysed on {dateStr} at {timeStr} <span className="ra-badge-done">✓ Analysis Completed</span></p>
        </div>
        <div className="ra-header-actions">
          <button className="ra-btn-outline" onClick={() => window.print()}><Download size={15} /> Download Report</button>
          <button className="ra-btn-primary"><Share2 size={15} /> Share</button>
        </div>
      </div>

      {/* ROW 1: SCORE CARDS */}
      <div className="ra-scores-row">
        <ScoreCard label="Resume Match Score" value={`${matchScore}%`} subtitle={matchSubtitle} color="#2563EB" pct={matchScore} />
        <ScoreCard label="ATS Score" value={`${atsScore}%`} subtitle={atsSubtitle} color="#10B981" pct={atsScore} />
        <ScoreCard label="Hiring Probability" value={`${matchScore > 70 ? 82 : matchScore >= 45 ? 65 : 35}%`} subtitle={hiringProbability} color={probColor} pct={matchScore > 70 ? 82 : matchScore >= 45 ? 65 : 35} />
        <ScoreCard label="Resume Grade" value={grade} subtitle={atsSubtitle} color="#7C3AED" pct={atsScore} isGrade />
        <SparklineCard expectedPct={roadmap.expectedScore} />
      </div>

      {/* ROW 2: SKILL MATCH + KEYWORD + ATS CHECKLIST */}
      <div className="ra-row2">

        {/* Skill Match */}
        <div className="ra-card">
          <h3 className="ra-card-title">Skill Match Overview</h3>
          <div className="ra-skill-legend">
            <span className="ra-legend-dot" style={{ background: '#2563EB' }} />Matched ({matchedSkills.length})
            <span className="ra-legend-dot ml" style={{ background: '#EF4444' }} />Missing ({missingSkills.length})
            <span className="ra-legend-dot ml" style={{ background: '#F59E0B' }} />Partial (0)
          </div>
          <div className="ra-skill-body">
            <DonutChart matched={matchedSkills.length} missing={missingSkills.length} partial={0} total={totalJdSkills} />
            <div className="ra-skill-tags">
              <div className="ra-tags-group">
                <div className="ra-tags-label">Matched Skills</div>
                <div className="ra-tags">
                  {matchedSkills.length > 0 ? matchedSkills.map(s => (
                    <span key={s} className="ra-tag ra-tag--matched">{s}</span>
                  )) : <span className="ra-tag">None found</span>}
                </div>
              </div>
              <div className="ra-tags-group mt-8">
                <div className="ra-tags-label">Missing Skills</div>
                <div className="ra-tags">
                  {missingSkills.length > 0 ? missingSkills.map(s => (
                    <span key={s} className="ra-tag ra-tag--missing">{s}</span>
                  )) : <span className="ra-tag">None missing!</span>}
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
              <div className="ra-keyword-fill matched" style={{ width: `${matchScore}%` }}>{matchScore}%</div>
              <div className="ra-keyword-fill missing" style={{ width: `${100 - matchScore}%` }}>{100 - matchScore}%</div>
            </div>
          </div>
          <div className="ra-card-sub">Top Missing Keywords</div>
          <div className="ra-tags mt-4">
            {missingSkills.length > 0 ? (
              missingSkills.slice(0, 5).map(k => (
                <span key={k} className="ra-tag ra-tag--keyword">{k}</span>
              ))
            ) : (
              <span className="ra-tag">All core keywords covered!</span>
            )}
          </div>
          <button className="ra-link-btn">View All Keywords <ChevronRight size={13} /></button>
        </div>

        {/* ATS Checklist */}
        <div className="ra-card">
          <h3 className="ra-card-title">ATS Checklist</h3>
          <p className="ra-card-hint">{atsScore >= 80 ? 'Your resume is ATS-optimized' : 'Key improvements recommended'}</p>
          <div className="ra-ats-ring-wrap">
            <CircleRing pct={atsChecklistPct} size={72} stroke={7} color={atsChecklistPct >= 80 ? '#10B981' : '#F59E0B'} />
            <div className="ra-ats-ring-val">{atsChecklistPct}%</div>
          </div>
          <div className="ra-checklist">
            {checklistItems.map(item => (
              <ChecklistItem key={item.text} {...item} />
            ))}
          </div>
          <button className="ra-link-btn">Improve ATS Score <ChevronRight size={13} /></button>
        </div>

      </div>

      {/* AI SUGGESTIONS */}
      <div className="ra-card ra-full-width">
        <div className="ra-suggestions-header">
          <div>
            <h3 className="ra-card-title">✨ AI Suggestions & Rewrites</h3>
            <p className="ra-card-hint">Copy and paste these optimized bullet points directly into your resume.</p>
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
                  <div className="ra-rewrite-title">✓ AI Optimized Rewrite</div>
                  <CopyBtn text={item.optimized} />
                </div>
                <div className="ra-rewrite-box">{item.optimized}</div>
              </div>
            </div>
          ))}
        </div>
        {aiSuggestions.length > 2 && (
          <button className="ra-toggle-btn" onClick={() => setShowAllSuggestions(!showAllSuggestions)}>
            {showAllSuggestions ? '▲ Show Less' : `▼ View ${aiSuggestions.length - 2} More Suggestions`}
          </button>
        )}
      </div>

      {/* SKILL REPLACEMENT + RECRUITER VIEW */}
      <div className="ra-row2">

        {/* Skill Replacements */}
        <div className="ra-card ra-col-span-2">
          <h3 className="ra-card-title">💡 Skill Replacement Suggestions</h3>
          <p className="ra-card-hint">Improve your skills wording for better ATS keyword recognition</p>
          <div className="ra-replace-table">
            <div className="ra-replace-head">
              <span>Current</span>
              <span></span>
              <span>Suggested</span>
            </div>
            {skillReplacements.map(row => (
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
              {recruiterStrengths.map(s => <div key={s} className="ra-recruiter-item strength">✓ {s}</div>)}
            </div>
            <div>
              <div className="ra-recruiter-head improve">Areas to Improve</div>
              {recruiterImprovements.map(s => <div key={s} className="ra-recruiter-item improve">✕ {s}</div>)}
            </div>
          </div>
          <button className="ra-link-btn mt-8">View Recruiter Perspective <ChevronRight size={13} /></button>
        </div>

      </div>

      {/* IMPACT SCORE + ROADMAP */}
      <div className="ra-row-half">

        {/* Resume Impact Score */}
        <div className="ra-card">
          <h3 className="ra-card-title">📊 Resume Impact Score</h3>
          <div className="ra-impact-list">
            {impactScores.map(item => (
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
          <h3 className="ra-card-title">🚀 Improvement Roadmap</h3>
          <div className="ra-roadmap-scores">
            <div className="ra-roadmap-current">
              <div className="ra-roadmap-score-label">Current Match Score</div>
              <div className="ra-roadmap-score blue">{matchScore}%</div>
            </div>
            <div className="ra-roadmap-arrow">→</div>
            <div className="ra-roadmap-expected">
              <div className="ra-roadmap-score-label">Expected Match Score</div>
              <div className="ra-roadmap-score green">{roadmap.expectedScore}%</div>
            </div>
          </div>
          <div className="ra-roadmap-badge">Total Improvement {roadmap.totalGain}</div>
          <div className="ra-roadmap-steps">
            {roadmap.steps.map(item => (
              <div key={item.step} className="ra-roadmap-step">
                <div className="ra-roadmap-num">{item.step}</div>
                <div className="ra-roadmap-action">{item.action}</div>
                <div className="ra-roadmap-gain">{item.gain}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* INTERVIEW QUESTIONS + PREMIUM */}
      <div className="ra-row-half">

        {/* Top Interview Questions */}
        <div className="ra-card">
          <h3 className="ra-card-title">🎯 Top Interview Questions <span className="ra-ai-chip">AI Generated</span></h3>
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
              'LinkedIn Profile Optimization',
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
  );
}
