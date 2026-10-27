const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { analyzeResumeMatch } = require("./utils/matchingEngine");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

async function extractPdfText(buffer) {
  const pdfFn = typeof pdfParse === "function" ? pdfParse : pdfParse.default || pdfParse;
  const data = await pdfFn(buffer);
  return data.text;
}

// ── /api/analyze ─ Main endpoint ─────────────────────────────────────────────
app.post("/api/analyze", upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "jdFile", maxCount: 1 },
]), async (req, res) => {
  try {
    if (!req.files || !req.files["resume"])
      return res.status(400).json({ error: "Resume PDF is required." });

    const resumeText = await extractPdfText(req.files["resume"][0].buffer);

    let jdText = req.body.jdText || "";
    if (req.files && req.files["jdFile"])
      jdText = await extractPdfText(req.files["jdFile"][0].buffer);

    if (!jdText.trim())
      return res.status(400).json({ error: "Job Description is required." });

    const result = analyzeResumeMatch(resumeText, jdText);
    res.json({ success: true, data: result });

  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: `Analysis failed: ${error.message}` });
  }
});

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`SmartHire Backend running on port ${PORT}`);
  console.log(`Engine: SmartHire Built-in Engine v2 (No API key needed)`);
});
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") console.error(`Port ${PORT} already in use.`);
  else console.error("Server error:", err);
});
