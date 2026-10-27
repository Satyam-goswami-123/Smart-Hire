// ============================================================
// SmartHire AI — Built-in Intelligent Analysis Engine v3
// Zero API Key, Zero Cost, 100% Instant & Offline
// ============================================================

const SKILLS_DB = {
  frontend: [
    "React", "React.js", "Next.js", "Vue", "Vue.js", "Nuxt.js", "Angular", "Svelte",
    "HTML", "HTML5", "CSS", "CSS3", "SASS", "SCSS", "Tailwind", "Tailwind CSS",
    "Bootstrap", "Material UI", "Chakra UI", "Redux", "Zustand", "MobX", "Webpack",
    "Vite", "TypeScript", "JavaScript", "ES6", "jQuery", "Three.js", "D3.js", "Framer Motion"
  ],
  backend: [
    "Node.js", "Express", "Express.js", "Django", "Flask", "FastAPI", "Spring Boot",
    "Spring", "Laravel", "Ruby on Rails", "ASP.NET", ".NET", "Golang", "Go", "Rust",
    "PHP", "NestJS", "Fastify", "GraphQL", "REST API", "RESTful", "WebSocket", "gRPC",
    "Microservices", "Serverless", "AWS Lambda", "Kafka", "RabbitMQ", "Celery"
  ],
  databases: [
    "MongoDB", "PostgreSQL", "Postgres", "MySQL", "SQLite", "Redis", "Cassandra",
    "DynamoDB", "Firebase", "Firestore", "Supabase", "Oracle", "SQL Server", "MariaDB",
    "Elasticsearch", "Prisma", "Mongoose", "TypeORM", "Sequelize", "SQL", "NoSQL"
  ],
  cloud_devops: [
    "AWS", "Azure", "GCP", "Google Cloud", "Heroku", "Vercel", "Netlify", "DigitalOcean",
    "Kubernetes", "Docker", "Terraform", "Ansible", "Jenkins", "CI/CD", "GitHub Actions",
    "GitLab CI", "Linux", "Ubuntu", "Bash", "Shell Scripting", "Nginx", "Apache",
    "Prometheus", "Grafana", "CloudWatch"
  ],
  ai_ml_data: [
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Keras", "Scikit-learn",
    "NLP", "Computer Vision", "OpenCV", "Pandas", "NumPy", "Matplotlib", "Seaborn",
    "Hugging Face", "LangChain", "LLM", "Data Science", "Data Analysis", "Data Engineering",
    "MLOps", "Generative AI", "RAG", "Vector DB"
  ],
  languages: [
    "Python", "Java", "C++", "C", "C#", "Kotlin", "Swift", "Ruby", "Go", "Rust",
    "Scala", "R", "Dart", "Flutter", "React Native"
  ],
  tools_methodologies: [
    "Git", "GitHub", "GitLab", "Bitbucket", "Jira", "Confluence", "Postman", "Swagger",
    "VS Code", "Agile", "Scrum", "Kanban", "TDD", "System Design", "Unit Testing",
    "Integration Testing", "Jest", "Cypress", "Selenium", "Playwright"
  ],
  soft_skills: [
    "Leadership", "Communication", "Team Collaboration", "Problem Solving",
    "Critical Thinking", "Project Management", "Mentoring", "Analytical Skills"
  ]
};

const ALL_SKILLS = Object.values(SKILLS_DB).flat();

// Regex patterns for section headers
const SECTION_PATTERNS = {
  contact: /(?:email|phone|tel|linkedin|github|portfolio|contact|mobile|address|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b)/i,
  summary: /(?:summary|profile|about me|objective|professional overview)/i,
  experience: /(?:experience|employment|work history|career|professional background|internship)/i,
  education: /(?:education|academic|university|college|degree|bachelor|master|b\.tech|m\.tech|b\.e|m\.s|phd|bca|mca|diploma)/i,
  skills: /(?:skills|technologies|technical competencies|tech stack|tools|expertise)/i,
  projects: /(?:projects|portfolio|personal projects|key achievements)/i,
  certifications: /(?:certif|credential|license|training|course completion)/i,
  linkedin_github: /(?:linkedin\.com|github\.com|gitlab\.com|portfolio)/i,
};

// Action verbs list
const ACTION_VERBS = [
  "architected", "built", "spearheaded", "engineered", "developed", "designed",
  "deployed", "implemented", "optimized", "orchestrated", "refactored", "scaled",
  "automated", "streamlined", "led", "mentored", "delivered", "created", "reduced",
  "accelerated", "integrated", "managed", "collaborated", "launched", "executed"
];

// Extract skills matching dictionary + dynamic high-priority technical terms
function extractSkills(text) {
  if (!text) return [];
  const lower = text.toLowerCase();
  const found = new Set();

  // 1. Dictionary scan
  for (const skill of ALL_SKILLS) {
    const escaped = skill.toLowerCase().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const regex = new RegExp(`(?<![a-zA-Z0-9_])(${escaped})(?![a-zA-Z0-9_])`, "i");
    if (regex.test(lower)) {
      found.add(skill);
    }
  }

  // 2. Dynamic Acronyms & Tech terms (e.g., ETL, SDK, API, CRM, ERP, CLI, SaaS)
  const acronymMatches = text.match(/\b[A-Z]{2,5}\b/g) || [];
  const validAcronyms = new Set(["API", "SDK", "CLI", "ETL", "CRM", "ERP", "SaaS", "PaaS", "IaaS", "RPC", "ORM", "UI", "UX", "SEO", "CDN", "WAF", "IAM", "JWT", "SSO"]);
  for (const acr of acronymMatches) {
    if (validAcronyms.has(acr)) {
      found.add(acr);
    }
  }

  return Array.from(found);
}

// Check ATS Checklist items
function evaluateATSChecklist(text) {
  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text);
  const hasPhone = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/.test(text);
  const hasContact = hasEmail || hasPhone;
  const hasSummary = SECTION_PATTERNS.summary.test(text);
  const hasSkills = SECTION_PATTERNS.skills.test(text);
  const hasExperience = SECTION_PATTERNS.experience.test(text);
  const hasEducation = SECTION_PATTERNS.education.test(text);
  const hasProjects = SECTION_PATTERNS.projects.test(text);
  const hasCerts = SECTION_PATTERNS.certifications.test(text);
  const hasLinks = SECTION_PATTERNS.linkedin_github.test(text);

  // Check action verbs
  const lower = text.toLowerCase();
  const verbCount = ACTION_VERBS.filter(v => lower.includes(v)).length;
  const hasActionVerbs = verbCount >= 3;
  const actionVerbWarning = verbCount > 0 && verbCount < 3;

  // Check quantifiable metrics (percentages, numbers with + or k or ms or $)
  const metricsMatches = text.match(/(?:\d+%\s*|\$\d+[\d,]*|\b\d+\s*(?:k\+|k|million|x|ms|sec|hours|users)\b|\b\d+\+\b)/gi) || [];
  const hasMetrics = metricsMatches.length >= 2;

  const items = [
    { text: "Contact Information", ok: hasContact, warning: !hasContact },
    { text: "Professional Summary", ok: hasSummary, warning: !hasSummary },
    { text: "Skills Section", ok: hasSkills, warning: !hasSkills },
    { text: "Work Experience", ok: hasExperience, warning: !hasExperience },
    { text: "Education", ok: hasEducation, warning: !hasEducation },
    { text: "Projects", ok: hasProjects, warning: !hasProjects },
    { text: "Certifications", ok: hasCerts, warning: !hasCerts },
    { text: "Action Verbs", ok: hasActionVerbs, warning: actionVerbWarning },
    { text: "Quantifiable Metrics", ok: hasMetrics, warning: !hasMetrics },
    { text: "LinkedIn/GitHub", ok: hasLinks, warning: !hasLinks }
  ];

  const passedCount = items.filter(i => i.ok).length;
  const checklistScore = Math.round((passedCount / items.length) * 100);

  return { items, checklistScore, metricsMatches, verbCount };
}

// Generate tailored AI bullet rewrites based on actual missing skills & metrics
function generateAISuggestions(missingSkills, resumeText, metricsMatches) {
  const suggestions = [];

  // Suggestion 1: Missing Tech Skills Rewrite
  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 2);
    const skillList = topMissing.join(" and ");
    suggestions.push({
      issue: `Missing critical JD skill requirements: ${topMissing.join(", ")}.`,
      why: `The Job Description specifically highlights ${skillList}. Without these explicit keywords, automated ATS scanners may score your resume below the screening threshold.`,
      optimized: `Architected and deployed scalable microservices using ${skillList}, improving system reliability to 99.9% and decreasing build and deployment cycles by 35%.`
    });
  }

  // Suggestion 2: Quantifiable metrics rewrite
  if (metricsMatches.length < 3) {
    suggestions.push({
      issue: "Limited quantifiable business impact and metrics in project bullets.",
      why: "Hiring managers look for measurable results. Stating 'improved performance' is weak; stating 'reduced database latency by 45%' demonstrates exact commercial impact.",
      optimized: "Streamlined core application pipeline, reducing response latency by 42% and successfully supporting 15,000+ daily active users without downtime."
    });
  }

  // Suggestion 3: Architectural / System Design impact
  suggestions.push({
    issue: "Need stronger technical leadership and modern delivery practices.",
    why: "Top engineering roles favor candidates who show ownership of architecture, automated testing, and cross-functional delivery.",
    optimized: "Spearheaded end-to-end refactoring of legacy modules into modular services, cutting technical debt by 30% and onboarding 4 junior engineers."
  });

  return suggestions;
}

// Generate intelligent skill replacement recommendations
function generateSkillReplacements(resumeSkills, missingSkills) {
  const replacementMap = {
    "React": "React.js / Next.js (SSR & App Router)",
    "Node.js": "Node.js (Async Event-Driven Architecture)",
    "Python": "Python (Data Processing & Backend APIs)",
    "Java": "Core Java (Multithreading & Spring Boot)",
    "JavaScript": "Modern JavaScript (ES6+, TypeScript)",
    "HTML": "Semantic HTML5 & Web Accessibility (WCAG)",
    "CSS": "Modern CSS3 (Flexbox, Grid & Tailwind CSS)",
    "Git": "Git Version Control & CI/CD Pipelines",
    "SQL": "Relational Databases & Advanced SQL Optimization",
    "MongoDB": "MongoDB (NoSQL Document Modeling & Aggregations)",
    "Docker": "Docker Containerization & Multi-stage Builds",
    "AWS": "AWS Cloud Services (EC2, S3, Lambda, CloudFront)"
  };

  const results = [];
  for (const s of resumeSkills) {
    if (replacementMap[s]) {
      results.push({ current: s, suggested: replacementMap[s] });
      if (results.length >= 6) break;
    }
  }

  // If few detected, add standard modern replacements
  if (results.length === 0) {
    results.push(
      { current: "Basic Git", suggested: "Git & Automated GitHub Actions" },
      { current: "REST API", suggested: "Secure RESTful APIs & GraphQL Endpoints" },
      { current: "SQL Queries", suggested: "Indexed SQL & Query Performance Tuning" }
    );
  }

  return results;
}

// Calculate realistic Impact Scores
function calculateImpactScores(matchScore, atsScore, checklist) {
  return [
    { label: "Technical Skills", pct: Math.min(100, Math.max(45, matchScore)), color: "#2563EB" },
    { label: "Projects & Portfolio", pct: checklist.items.find(i => i.text === "Projects")?.ok ? 85 : 50, color: "#7C3AED" },
    { label: "Experience & Depth", pct: checklist.items.find(i => i.text === "Work Experience")?.ok ? 80 : 45, color: "#059669" },
    { label: "Leadership & Initiative", pct: checklist.verbCount >= 3 ? 75 : 55, color: "#F59E0B" },
    { label: "Quantifiable Results", pct: checklist.metricsMatches.length >= 2 ? 80 : 40, color: "#EF4444" },
    { label: "ATS Formatting", pct: atsScore, color: "#0891B2" }
  ];
}

// Generate step-by-step improvement roadmap
function generateRoadmap(missingSkills, atsScore, matchScore) {
  const steps = [];
  let currentGain = 0;

  if (missingSkills.length > 0) {
    steps.push({
      step: 1,
      action: `Add key missing skills: ${missingSkills.slice(0, 3).join(", ")}`,
      gain: "+6%"
    });
    currentGain += 6;
  }

  steps.push({
    step: steps.length + 1,
    action: "Incorporate metrics (percentages, speed, scale) into your experience bullets",
    gain: "+5%"
  });
  currentGain += 5;

  if (atsScore < 85) {
    steps.push({
      step: steps.length + 1,
      action: "Include LinkedIn, GitHub, and explicit Education/Skills section titles",
      gain: "+4%"
    });
    currentGain += 4;
  }

  steps.push({
    step: steps.length + 1,
    action: "Highlight cloud, automated testing, or production deployment workflows",
    gain: "+3%"
  });
  currentGain += 3;

  const expectedScore = Math.min(98, matchScore + currentGain);
  return { steps, totalGain: `+${currentGain}%`, expectedScore };
}

// Main Analyzer
function analyzeResumeMatch(resumeText, jdText) {
  const jdSkills = extractSkills(jdText);
  let resumeSkills = extractSkills(resumeText);

  // If JD has no recognized skills (generic job description), extract meaningful words
  let effectiveJdSkills = [...jdSkills];
  if (effectiveJdSkills.length === 0) {
    const jdWords = jdText.match(/\b[A-Z][a-z]{3,}\b/g) || [];
    effectiveJdSkills = Array.from(new Set(jdWords)).slice(0, 10);
  }

  const matched = effectiveJdSkills.filter(s => 
    resumeSkills.some(rs => rs.toLowerCase() === s.toLowerCase())
  );
  const missing = effectiveJdSkills.filter(s => 
    !resumeSkills.some(rs => rs.toLowerCase() === s.toLowerCase())
  );

  const checklist = evaluateATSChecklist(resumeText);

  // Match score calculation
  let matchScore = effectiveJdSkills.length > 0
    ? Math.round((matched.length / effectiveJdSkills.length) * 100)
    : Math.min(80, Math.max(30, resumeSkills.length * 7));

  // ATS Score calculation based on checklist and match
  let atsScore = Math.round((checklist.checklistScore * 0.6) + (matchScore * 0.4));
  atsScore = Math.min(100, Math.max(35, atsScore));

  const hiringProbability = matchScore >= 70 ? "High" : matchScore >= 45 ? "Medium" : "Low";

  // Strengths and Improvements
  const strengths = [];
  if (matched.length > 0) {
    strengths.push(`Matches ${matched.length} key technical requirements: ${matched.slice(0, 4).join(", ")}.`);
  }
  if (checklist.items.find(i => i.text === "Projects")?.ok) {
    strengths.push("Hands-on Projects section clearly listed with practical demonstrations.");
  }
  if (checklist.items.find(i => i.text === "Contact Information")?.ok) {
    strengths.push("Complete and accessible contact credentials ready for HR screening.");
  }
  if (checklist.verbCount >= 3) {
    strengths.push("Strong action verbs utilized across professional experiences.");
  }

  const improvements = [];
  if (missing.length > 0) {
    improvements.push(`Target missing requirements: ${missing.slice(0, 5).join(", ")}.`);
  }
  if (!checklist.items.find(i => i.text === "Quantifiable Metrics")?.ok) {
    improvements.push("Add quantifiable metrics (e.g. 40% faster, 10k users) to demonstrate impact.");
  }
  if (!checklist.items.find(i => i.text === "LinkedIn/GitHub")?.ok) {
    improvements.push("Add clickable links to your LinkedIn profile and GitHub repository.");
  }
  if (!checklist.items.find(i => i.text === "Certifications")?.ok) {
    improvements.push("Consider acquiring recognized cloud or technical certifications.");
  }

  const aiSuggestions = generateAISuggestions(missing, resumeText, checklist.metricsMatches);
  const skillReplacements = generateSkillReplacements(resumeSkills, missing);
  const impactScores = calculateImpactScores(matchScore, atsScore, checklist);
  const roadmap = generateRoadmap(missing, atsScore, matchScore);

  return {
    matchScore,
    atsScore,
    hiringProbability,
    matchedSkills: matched,
    missingSkills: missing,
    resumeSkills,
    totalJdSkills: effectiveJdSkills.length,
    checklist,
    strengths,
    improvements,
    aiSuggestions,
    skillReplacements,
    impactScores,
    roadmap,
    engine: "SmartHire Built-in Engine v3 (Instant & Free)"
  };
}

module.exports = { analyzeResumeMatch, extractSkills };
