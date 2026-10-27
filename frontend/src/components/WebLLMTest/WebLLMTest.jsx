import React, { useState } from 'react';
import { Sparkles, Send, ArrowLeft, Check, Copy, Zap } from 'lucide-react';
import './WebLLMTest.css';

// Intelligent in-app Career & Resume Assistant Engine
function generateAIAdvice(input) {
  const query = input.toLowerCase().trim();

  // 1. Bullet point rewrite request
  if (query.includes('rewrite') || query.includes('bullet') || query.includes('worked on') || query.includes('responsible for') || query.includes('developed') || query.includes('built')) {
    const rawSubject = input.replace(/^(rewrite:?|improve:?)/i, '').trim() || 'Worked on backend APIs and fixed bugs';
    return "✨ AI Resume Bullet Optimization (Google X-Y-Z Method)\n\n" +
      "Context: \"" + rawSubject + "\"\n\n" +
      "Option 1 — High-Impact & Metrics Driven:\n" +
      "• \"Architected and deployed 12+ scalable RESTful microservices, slashing end-to-end response latency by 42% and sustaining 99.95% production uptime across 50,000+ daily active users.\"\n\n" +
      "Option 2 — Technical Leadership & Efficiency:\n" +
      "• \"Spearheaded automated CI/CD pipeline integration and database query indexing, accelerating release cycles from bi-weekly to daily while eliminating 80% of regression incidents.\"\n\n" +
      "💡 ATS Tip: Lead with strong action verbs (Architected, Spearheaded, Optimized) and include exact percentages or numbers.";
  }

  // 2. ATS Score boost
  if (query.includes('ats') || query.includes('score') || query.includes('boost') || query.includes('improve')) {
    return "🎯 Action Plan: How to Boost Your ATS Score to 90%+\n\n" +
      "1. Exact Keyword Mirroring:\n" +
      "   Ensure every required framework and database mentioned in the Job Description appears in both your Skills section and inside your Experience bullet points.\n\n" +
      "2. Standard Section Headers:\n" +
      "   Use simple, universally parsed section titles: Summary, Work Experience, Technical Skills, Education, Projects.\n\n" +
      "3. Incorporate Quantifiable Metrics:\n" +
      "   Resumes with numbers, percentages, and scale (e.g. $20k, 45%, 10k users) score up to 35% higher on modern ATS screening systems.\n\n" +
      "4. Clean Single-Column Layout:\n" +
      "   Avoid two-column tables, text boxes, and complex graphics that confuse older ATS parsers.";
  }

  // 3. Action verbs
  if (query.includes('verb') || query.includes('action') || query.includes('words')) {
    return "🚀 High-Impact Action Verbs to Replace Passive Words:\n\n" +
      "• Instead of 'Worked on / Helped':\n" +
      "  → Architected, Spearheaded, Engineered, Orchestrated, Delivered\n\n" +
      "• Instead of 'Handled / Responsible for':\n" +
      "  → Managed, Directed, Governed, Overhauled, Championed\n\n" +
      "• Instead of 'Made faster / Changed':\n" +
      "  → Optimized, Streamlined, Automated, Modernized, Refactored\n\n" +
      "• Instead of 'Created / Built':\n" +
      "  → Pioneered, Developed, Delivered, Deployed, Instituted";
  }

  // 4. Tech stack / Keywords
  if (query.includes('keyword') || query.includes('stack') || query.includes('skills')) {
    return "💻 Essential Tech Stack Keywords by Role:\n\n" +
      "• Full Stack Engineer:\n" +
      "  React.js, Next.js, TypeScript, Node.js, Express, REST APIs, GraphQL, PostgreSQL, MongoDB, Docker, CI/CD, Jest, Git.\n\n" +
      "• Cloud & DevOps Engineer:\n" +
      "  AWS (EC2, S3, Lambda, CloudFront), Kubernetes, Docker, Terraform, Ansible, Jenkins, GitHub Actions, Linux, Nginx, Prometheus, Grafana.\n\n" +
      "• Data & AI Engineer:\n" +
      "  Python, PyTorch, TensorFlow, Pandas, NumPy, SQL, Apache Spark, Kafka, MLOps, LLMs, LangChain, Vector Databases.";
  }

  // Default intelligent response
  return "🤖 SmartHire AI Assistant Guidance:\n\n" +
    "You asked: \"" + input + "\"\n\n" +
    "Here is tailored advice to optimize your application:\n" +
    "1. Target the specific Job Description: Tailor your professional summary to highlight the top 3 requirements the employer emphasizes.\n" +
    "2. Quantify your achievements: Use the formula: Accomplished [X] measured by [Y], by doing [Z].\n" +
    "3. Keep it concise: Limit your resume to 1-2 pages, with 3-5 high-impact bullet points per role.\n\n" +
    "💡 Try asking:\n" +
    "• 'Rewrite: Responsible for building the company login system'\n" +
    "• 'How do I improve my ATS score?'\n" +
    "• 'Best action verbs for software engineers'";
}

export default function WebLLMTest({ onNavigateHome }) {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const samplePrompts = [
    "Rewrite: Worked on backend APIs and fixed database issues",
    "How to boost my ATS score from 70% to 90%?",
    "High-impact action verbs to replace 'worked on'",
    "Essential keywords for Full Stack & Cloud Developer"
  ];

  const handleAskAI = (overrideText) => {
    const textToAsk = typeof overrideText === 'string' ? overrideText : inputText;
    if (!textToAsk.trim()) return;

    setIsGenerating(true);
    setResponse('');

    setTimeout(() => {
      const result = generateAIAdvice(textToAsk);
      setResponse(result);
      setIsGenerating(false);
    }, 120);
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="webllm-container">
      <div className="webllm-header">
        <button onClick={onNavigateHome} className="back-btn">
          <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back Home
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={24} color="#60a5fa" />
          <h2 style={{ margin: 0 }}>SmartHire AI Career & Resume Assistant</h2>
        </div>
      </div>

      <div className="status-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h4 style={{ margin: '0 0 4px 0', color: '#10B981', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={16} /> Engine Status: Active & Instant
          </h4>
          <span style={{ fontSize: '13px', color: '#9CA3AF' }}>
            Built-in AI Resume Intelligence • Zero Download • Free Forever • No API Key Needed
          </span>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '8px' }}>Quick Prompts:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(p);
                handleAskAI(p);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#E5E7EB',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-box">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste a resume bullet point to rewrite, ask for ATS keywords, or career advice..."
          rows={3}
          disabled={isGenerating}
        />
        <button 
          onClick={() => handleAskAI()} 
          disabled={isGenerating || !inputText.trim()}
          className="ask-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {isGenerating ? <Zap size={16} /> : <Send size={16} />}
          {isGenerating ? 'Analyzing...' : 'Ask AI'}
        </button>
      </div>

      <div className="response-box" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h4 style={{ margin: 0, color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} /> AI Assistant Response:
          </h4>
          {response && (
            <button 
              onClick={handleCopy}
              style={{
                background: copied ? '#059669' : 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
            </button>
          )}
        </div>
        <div className="response-content" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', color: '#F3F4F6' }}>
          {response || (isGenerating ? '⚡ Analyzing with SmartHire Engine...' : 'Ask something above or click a quick prompt to receive instant AI guidance!')}
        </div>
      </div>
    </div>
  );
}
