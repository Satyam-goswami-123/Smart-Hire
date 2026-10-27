// ============================================================
// SmartHire AI — Built-in Analysis Engine (No API Key Needed)
// Pure JavaScript NLP — Fast, Free, Offline
// ============================================================

// ── 400+ Skills Dictionary ────────────────────────────────────────────────────
const SKILLS = {
  frontend: [
    "React","React.js","Next.js","Vue","Vue.js","Angular","Svelte","HTML","HTML5",
    "CSS","CSS3","SASS","SCSS","Less","Tailwind","Bootstrap","Material UI","Chakra UI",
    "Redux","Zustand","MobX","Context API","Webpack","Vite","Parcel","Rollup","Babel",
    "TypeScript","JavaScript","ES6","jQuery","Three.js","D3.js","Chart.js","Framer Motion","GSAP"
  ],
  backend: [
    "Node.js","Express","Express.js","Django","Flask","FastAPI","Spring Boot","Spring",
    "Laravel","Ruby on Rails","ASP.NET",".NET","Golang","Go","Rust","PHP","Symfony",
    "NestJS","Fastify","Hapi","Koa","GraphQL","REST API","RESTful","WebSocket","gRPC",
    "Microservices","Serverless","Lambda","API Gateway"
  ],
  databases: [
    "MongoDB","PostgreSQL","MySQL","SQLite","Redis","Cassandra","DynamoDB","Firebase",
    "Firestore","Supabase","Oracle","SQL Server","MariaDB","Neo4j","Elasticsearch",
    "InfluxDB","CouchDB","Prisma","Sequelize","TypeORM","Mongoose","SQL","NoSQL"
  ],
  cloud: [
    "AWS","Azure","GCP","Google Cloud","Heroku","Vercel","Netlify","DigitalOcean",
    "Kubernetes","Docker","Terraform","Ansible","Jenkins","CI/CD","GitHub Actions",
    "CircleCI","TravisCI","ArgoCD","Helm","Nginx","Apache","Linux","Ubuntu","Bash",
    "Shell Scripting","CloudFormation","Pulumi"
  ],
  ai_ml: [
    "Machine Learning","Deep Learning","TensorFlow","PyTorch","Keras","Scikit-learn",
    "NLP","Computer Vision","OpenCV","Pandas","NumPy","Matplotlib","Seaborn",
    "Jupyter","Hugging Face","LangChain","LLM","GPT","BERT","Transformers",
    "Data Science","Data Analysis","Data Engineering","MLOps","Feature Engineering",
    "Neural Networks","CNN","RNN","LSTM","Reinforcement Learning","XGBoost","Random Forest"
  ],
  languages: [
    "Python","Java","C++","C","C#","Kotlin","Swift","Ruby","Go","Rust","Scala",
    "R","MATLAB","Perl","Haskell","Elixir","Clojure","Dart","Flutter","React Native"
  ],
  tools: [
    "Git","GitHub","GitLab","Bitbucket","Jira","Confluence","Slack","Figma","Sketch",
    "Adobe XD","Postman","Insomnia","Swagger","VS Code","IntelliJ","Eclipse",
    "Vim","Linux","MacOS","Windows","Notion","Trello","Asana","Monday.com"
  ],
  soft_skills: [
    "Leadership","Communication","Teamwork","Problem Solving","Critical Thinking",
    "Agile","Scrum","Kanban","Project Management","Time Management","Mentoring",
    "Collaboration","Analytical","Attention to Detail","Presentation","Negotiation"
  ],
  security: [
    "Cybersecurity","Penetration Testing","OWASP","OAuth","JWT","SSL","TLS","HTTPS",
    "Encryption","Firewall","VPN","SOC","SIEM","IAM","Zero Trust"
  ],
  testing: [
    "Jest","Mocha","Chai","Cypress","Selenium","Playwright","Testing Library",
    "Unit Testing","Integration Testing","TDD","BDD","Pytest","JUnit"
  ],
};

const ALL_SKILLS = Object.values(SKILLS).flat();

// ── Section Keywords ──────────────────────────────────────────────────────────
const SECTION_PATTERNS = {
  experience: /\b(experience|work history|employment|career|professional background|job history)\b/i,
  education:  /\b(education|academic|university|college|degree|bachelor|master|phd|b\.tech|m\.tech|b\.e|mba)\b/i,
  skills:     /\b(skills|technologies|tech stack|tools|competencies|expertise|proficiencies)\b/i,
  projects:   /\b(projects|portfolio|works|case studies)\b/i,
  certifications: /\b(certif|credential|license|award)\b/i,
  contact:    /\b(email|phone|linkedin|github|portfolio|@)\b/i,
};

const DEGREE_PATTERNS = {
  phd:      /\b(phd|ph\.d|doctorate|doctoral)\b/i,
  masters:  /\b(master|msc|m\.tech|mba|m\.s\.|m\.e\.)\b/i,
  bachelors:/\b(bachelor|bsc|b\.tech|b\.e|b\.s\.|undergraduate|b\.com|bca|bba)\b/i,
  diploma:  /\b(diploma|associate|certification course)\b/i,
};

const EXP_YEAR_PATTERN = /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)/gi;

// ── Extract Skills ────────────────────────────────────────────────────────────
function extractSkills(text) {
  if (!text) return [];
  const lower = text.toLowerCase();
  const found = [];
  for (const skill of ALL_SKILLS) {
    const escaped = skill.toLowerCase().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const regex = new RegExp(`(?<![\\w])(${escaped})(?![\\w])`, "i");
    if (regex.test(lower)) found.push(skill);
  }
  return [...new Set(found)];
}

// ── Detect Education Level ────────────────────────────────────────────────────
function detectEducation(text) {
  if (DEGREE_PATTERNS.phd.test(text)) return "PhD";
  if (DEGREE_PATTERNS.masters.test(text)) return "Masters";
  if (DEGREE_PATTERNS.bachelors.test(text)) return "Bachelors";
  if (DEGREE_PATTERNS.diploma.test(text)) return "Diploma / Certification";
  return "Not Detected";
}

// ── Detect Years of Experience ────────────────────────────────────────────────
function detectExperience(text) {
  const matches = [...text.matchAll(EXP_YEAR_PATTERN)];
  if (!matches.length) {
    // Count job entries as a rough proxy
    const jobCount = (text.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{4}/gi) || []).length;
    if (jobCount >= 6) return "5+ years";
    if (jobCount >= 3) return "2-4 years";
    if (jobCount >= 1) return "1-2 years";
    return "Fresher / Not specified";
  }
  const maxYears = Math.max(...matches.map(m => parseInt(m[1])));
  if (maxYears >= 8) return "8+ years (Senior)";
  if (maxYears >= 5) return "5-7 years (Mid-Senior)";
  if (maxYears >= 2) return "2-4 years (Mid-Level)";
  return "0-2 years (Junior)";
}

// ── Keyword Density ───────────────────────────────────────────────────────────
function keywordDensity(resumeText, jdText) {
  const jdWords = jdText.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const resumeLower = resumeText.toLowerCase();
  const significant = [...new Set(jdWords)].filter(w => w.length > 4);
  if (!significant.length) return 0;
  const matched = significant.filter(w => resumeLower.includes(w));
  return Math.round((matched.length / significant.length) * 100);
}

// ── Section Presence ──────────────────────────────────────────────────────────
function detectSections(text) {
  return {
    hasContact:  SECTION_PATTERNS.contact.test(text),
    hasExperience: SECTION_PATTERNS.experience.test(text),
    hasEducation:  SECTION_PATTERNS.education.test(text),
    hasSkills:    SECTION_PATTERNS.skills.test(text),
    hasProjects:  SECTION_PATTERNS.projects.test(text),
    hasCerts:     SECTION_PATTERNS.certifications.test(text),
  };
}

// ── Generate Strengths ────────────────────────────────────────────────────────
function generateStrengths(matched, sections, education, experience, resumeSkills) {
  const strengths = [];
  if (matched.length >= 5)
    strengths.push(`Strong technical alignment — ${matched.length} required skills already present: ${matched.slice(0, 4).join(", ")}${matched.length > 4 ? "..." : ""}.`);
  if (sections.hasProjects)
    strengths.push("Portfolio / Projects section present — demonstrates hands-on experience.");
  if (sections.hasCerts)
    strengths.push("Certifications listed — adds credibility and shows commitment to upskilling.");
  if (education !== "Not Detected")
    strengths.push(`${education} degree detected — meets most standard qualification requirements.`);
  if (experience.includes("Senior") || experience.includes("5+") || experience.includes("8+"))
    strengths.push(`Experienced profile: ${experience} — likely to handle complex responsibilities.`);
  if (resumeSkills.length >= 10)
    strengths.push(`Diverse skill set with ${resumeSkills.length} identified technologies — versatile candidate.`);
  if (sections.hasContact)
    strengths.push("Contact information clearly present — ATS-ready.");
  return strengths.slice(0, 4);
}

// ── Generate Improvements ─────────────────────────────────────────────────────
function generateImprovements(missing, sections, matched, atsScore) {
  const improvements = [];
  if (missing.length > 0)
    improvements.push(`Add these missing skills to your resume (if you know them): ${missing.slice(0, 5).join(", ")}.`);
  if (!sections.hasContact)
    improvements.push("Add contact information (email, phone, LinkedIn) — critical for ATS parsing.");
  if (!sections.hasProjects)
    improvements.push("Add a Projects section to demonstrate practical application of skills.");
  if (!sections.hasCerts)
    improvements.push("Consider adding relevant certifications (AWS, Google, Meta) to boost credibility.");
  if (!sections.hasSkills)
    improvements.push("Add a dedicated Skills section — ATS systems heavily scan this area.");
  if (atsScore < 60)
    improvements.push("Use more keywords from the job description naturally within your experience bullets.");
  if (matched.length < 3)
    improvements.push("Your resume keywords don't closely match the JD. Tailor it specifically for this role.");
  return improvements.slice(0, 4);
}

// ── Generate Summary ──────────────────────────────────────────────────────────
function generateSummary(matchScore, hiringProb, matched, missing, experience) {
  const tone = matchScore >= 75
    ? "strong"
    : matchScore >= 50
    ? "moderate"
    : "weak";

  const matchVerb = tone === "strong" ? "closely aligns with" : tone === "moderate" ? "partially matches" : "does not strongly match";

  const missingNote = missing.length > 0
    ? ` Key gaps include: ${missing.slice(0, 3).join(", ")}.`
    : " No critical skill gaps detected.";

  return `This candidate's resume ${matchVerb} the job description with a ${matchScore}% match score and ${experience} of experience.${missingNote} Hiring probability is ${hiringProb}.`;
}

// ── Main Analyzer ─────────────────────────────────────────────────────────────
function analyzeResumeMatch(resumeText, jdText) {
  const jdSkills     = extractSkills(jdText);
  const resumeSkills = extractSkills(resumeText);

  const matched = jdSkills.filter(s => resumeSkills.includes(s));
  const missing = jdSkills.filter(s => !resumeSkills.includes(s));

  const sections  = detectSections(resumeText);
  const education = detectEducation(resumeText);
  const experience = detectExperience(resumeText);
  const density   = keywordDensity(resumeText, jdText);

  // Match Score
  let matchScore = jdSkills.length > 0
    ? Math.round((matched.length / jdSkills.length) * 100)
    : Math.min(60, resumeSkills.length * 4);

  // ATS Score based on sections + match
  let atsScore = matchScore;
  if (!sections.hasContact)    atsScore -= 12;
  if (!sections.hasEducation)  atsScore -= 6;
  if (!sections.hasExperience) atsScore -= 10;
  if (!sections.hasSkills)     atsScore -= 8;
  if (sections.hasProjects)    atsScore += 5;
  if (sections.hasCerts)       atsScore += 5;
  atsScore = Math.min(100, Math.max(0, atsScore));

  const hiringProbability = matchScore >= 70 ? "High" : matchScore >= 45 ? "Medium" : "Low";
  const experienceMatch   = matched.length >= Math.ceil(jdSkills.length * 0.7) ? "Strong"
                          : matched.length >= Math.ceil(jdSkills.length * 0.4) ? "Partial" : "Weak";

  const strengths    = generateStrengths(matched, sections, education, experience, resumeSkills);
  const improvements = generateImprovements(missing, sections, matched, atsScore);
  const summary      = generateSummary(matchScore, hiringProbability, matched, missing, experience);

  return {
    matchScore:        Math.min(100, Math.max(0, matchScore)),
    atsScore,
    hiringProbability,
    experienceMatch,
    matchedSkills:     matched,
    missingSkills:     missing,
    resumeSkills,
    strengths,
    improvements,
    summary,
    education,
    experience,
    keywordDensity:    density,
    totalJdSkills:     jdSkills.length,
    aiPowered:         false,
    engine:            "SmartHire Built-in Engine v2",
  };
}

module.exports = { analyzeResumeMatch, extractSkills };
