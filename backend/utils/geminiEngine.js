const { GoogleGenerativeAI } = require("@google/generative-ai");

async function analyzeWithGemini(resumeText, jdText) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set in .env file");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Truncate to stay well within token limits
  const truncate = (text, max) => text.length > max ? text.slice(0, max) + "..." : text;
  const resumeSnippet = truncate(resumeText, 3000);
  const jdSnippet = truncate(jdText, 2000);

  const prompt = `You are an expert ATS (Applicant Tracking System) and resume coach with 10+ years of experience in hiring.

Analyze the following RESUME against the JOB DESCRIPTION and return ONLY a valid JSON object.

RESUME:
${resumeSnippet}

JOB DESCRIPTION:
${jdSnippet}

Return ONLY this JSON (no markdown, no extra text):
{
  "matchScore": <integer 0-100, how well resume matches JD>,
  "atsScore": <integer 0-100, how ATS-friendly the resume is>,
  "hiringProbability": "<High|Medium|Low>",
  "matchedSkills": [<list of skills present in BOTH resume and JD>],
  "missingSkills": [<list of skills in JD but NOT in resume>],
  "strengths": [<3 specific strengths of this resume for this role>],
  "improvements": [<3 specific actionable improvements>],
  "summary": "<2-sentence professional verdict on this candidate's fit>",
  "keywordDensity": <integer 0-100, how well resume keywords match JD keywords>,
  "experienceMatch": "<Strong|Partial|Weak>"
}`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text();

  // Extract JSON from response
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Gemini returned unexpected format");

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    matchScore: Math.min(100, Math.max(0, Number(parsed.matchScore) || 0)),
    atsScore: Math.min(100, Math.max(0, Number(parsed.atsScore) || 0)),
    hiringProbability: parsed.hiringProbability || "Low",
    matchedSkills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills : [],
    missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
    summary: parsed.summary || "",
    keywordDensity: Number(parsed.keywordDensity) || 0,
    experienceMatch: parsed.experienceMatch || "Partial",
    totalJdSkills: (parsed.matchedSkills?.length || 0) + (parsed.missingSkills?.length || 0),
    aiPowered: true,
    engine: "gemini-1.5-flash",
  };
}

module.exports = { analyzeWithGemini };
