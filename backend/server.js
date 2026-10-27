const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const path = require("path");
const { analyzeResumeMatch } = require("./utils/matchingEngine");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const HISTORY_FILE = path.join(__dirname, "data", "history.json");

// Helper to read history
function readHistory() {
  try {
    if (!fs.existsSync(HISTORY_FILE)) return [];
    const raw = fs.readFileSync(HISTORY_FILE, "utf8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    console.error("Error reading history.json:", err);
    return [];
  }
}

// Helper to write history
function writeHistory(list) {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(list, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing history.json:", err);
  }
}

async function extractPdfText(buffer) {
  const pdfFn = typeof pdfParse === "function" ? pdfParse : pdfParse.default || pdfParse;
  const data = await pdfFn(buffer);
  return data.text;
}

// 📌 /api/analyze — Main analysis endpoint
app.post("/api/analyze", upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "jdFile", maxCount: 1 },
]), async (req, res) => {
  try {
    if (!req.files || !req.files["resume"])
      return res.status(400).json({ error: "Resume PDF is required." });

    const resumeName = req.files["resume"][0].originalname || "Uploaded_Resume.pdf";
    const resumeText = await extractPdfText(req.files["resume"][0].buffer);

    let jdText = req.body.jdText || "";
    let jdName = "Target Job Description";

    if (req.files && req.files["jdFile"]) {
      jdName = req.files["jdFile"][0].originalname || "Job_Description.pdf";
      jdText = await extractPdfText(req.files["jdFile"][0].buffer);
    }

    if (!jdText.trim())
      return res.status(400).json({ error: "Job Description is required." });

    const result = analyzeResumeMatch(resumeText, jdText);

    // Save record to backend history
    const historyItem = {
      id: "analysis_" + Date.now(),
      resumeName,
      jobTitle: jdName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      company: "Target Role",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      timestamp: Date.now(),
      score: result.matchScore,
      atsScore: result.atsScore,
      status: result.matchScore >= 70 ? "Completed" : "Action Needed",
      type: result.matchScore >= 70 ? "success" : "warning",
      fullData: {
        resume: { name: resumeName },
        jd: { name: req.files && req.files["jdFile"] ? jdName : null, text: jdText },
        analysisResult: result
      }
    };

    const currentHistory = readHistory();
    currentHistory.unshift(historyItem);
    // Keep max 50 recent analyses
    writeHistory(currentHistory.slice(0, 50));

    res.json({ success: true, data: result, record: historyItem });

  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: `Analysis failed: ${error.message}` });
  }
});

// 📌 /api/history — Retrieve saved analysis history
app.get("/api/history", (req, res) => {
  const history = readHistory();
  res.json({ success: true, history });
});

// 📌 /api/history/:id — Delete a specific analysis
app.delete("/api/history/:id", (req, res) => {
  const { id } = req.params;
  let history = readHistory();
  history = history.filter(item => item.id !== id);
  writeHistory(history);
  res.json({ success: true, history });
});

// 📌 /api/history — Clear all history
app.delete("/api/history", (req, res) => {
  writeHistory([]);
  res.json({ success: true, history: [] });
});

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`SmartHire Backend running on port ${PORT}`);
  console.log(`Engine: SmartHire Built-in Engine v3 (No API key needed)`);
  console.log(`History Storage: Enabled at ${HISTORY_FILE}`);
});
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") console.error(`Port ${PORT} already in use.`);
  else console.error("Server error:", err);
});
