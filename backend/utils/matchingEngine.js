const SKILL_DICTIONARY = [
  'React', 'Node.js', 'Express', 'MongoDB', 'Python', 'Java', 'C++', 'SQL',
  'AWS', 'Azure', 'GCP', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD',
  'Jenkins', 'Git', 'Linux', 'Machine Learning', 'Data Science', 'Redis',
  'GraphQL', 'REST API', 'Agile', 'Scrum', 'Leadership', 'Communication',
  'Scalability', 'Microservices', 'Load Balancing', 'System Design',
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Next.js', 'Redux', 'Vue',
  'Angular', 'PostgreSQL', 'MySQL', 'NoSQL', 'Spring Boot', 'Django'
];

function extractSkills(text) {
  if (!text) return [];
  const lowerText = text.toLowerCase();
  const foundSkills = [];
  
  SKILL_DICTIONARY.forEach(skill => {
    // Escape + or . if present (e.g. C++, Node.js)
    const escapedSkill = skill.toLowerCase().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
    
    // Using simple includes as a fallback because \b sometimes fails on special chars
    if (regex.test(lowerText) || lowerText.includes(skill.toLowerCase())) {
       foundSkills.push(skill);
    }
  });
  
  return [...new Set(foundSkills)];
}

function analyzeResumeMatch(resumeText, jdText) {
  const jdSkills = extractSkills(jdText);
  const resumeSkills = extractSkills(resumeText);
  
  const matchedSkills = jdSkills.filter(skill => resumeSkills.includes(skill));
  const missingSkills = jdSkills.filter(skill => !resumeSkills.includes(skill));
  
  let matchScore = 0;
  if (jdSkills.length > 0) {
    matchScore = Math.round((matchedSkills.length / jdSkills.length) * 100);
  } else {
    // If no specific skills found in JD, fallback to a base score based on overall tech density
    matchScore = Math.min(100, resumeSkills.length * 5); 
  }

  // Also extract action verbs and formatting checks (simulated checks)
  const hasContactInfo = /email|phone|@|\d{10}/i.test(resumeText);
  const hasEducation = /education|university|college|degree|bachelor/i.test(resumeText);
  const hasExperience = /experience|work|employment|career/i.test(resumeText);
  
  let atsScore = matchScore;
  if (!hasContactInfo) atsScore -= 10;
  if (!hasEducation) atsScore -= 5;
  if (!hasExperience) atsScore -= 10;
  
  return {
    matchScore: Math.min(100, Math.max(0, matchScore)),
    atsScore: Math.min(100, Math.max(0, atsScore)),
    hiringProbability: matchScore > 80 ? 'High' : matchScore > 60 ? 'Medium' : 'Low',
    matchedSkills,
    missingSkills,
    totalJdSkills: jdSkills.length
  };
}

module.exports = {
  extractSkills,
  analyzeResumeMatch
};
