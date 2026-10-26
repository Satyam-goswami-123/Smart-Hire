const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { analyzeResumeMatch } = require('./utils/matchingEngine');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Setup multer for in-memory file uploads
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/analyze', upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'jdFile', maxCount: 1 }
]), async (req, res) => {
  try {
    let resumeText = '';
    let jdText = req.body.jdText || '';

    // 1. Extract text from Resume (PDF)
    if (req.files && req.files['resume']) {
      const resumeBuffer = req.files['resume'][0].buffer;
      const pdfFn = (typeof pdfParse === 'function') ? pdfParse : (pdfParse.default || pdfParse);
      
      try {
        const pdfData = await pdfFn(resumeBuffer);
        resumeText = pdfData.text;
      } catch (err) {
        console.error("PDF Parse Execution Error:", err);
        throw new Error("Could not parse PDF. Ensure it is a valid PDF file.");
      }
    } else {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    // 2. Extract text from JD File (if provided instead of text)
    if (req.files && req.files['jdFile']) {
      const jdBuffer = req.files['jdFile'][0].buffer;
      const jdPdfData = await pdfParse(jdBuffer);
      jdText = jdPdfData.text;
    }

    if (!jdText) {
      return res.status(400).json({ error: 'Job Description is required' });
    }

    // 3. Run Custom Rule-Based Engine
    const analysisResult = analyzeResumeMatch(resumeText, jdText);

    // 4. Return results to frontend
    res.json({
      success: true,
      data: analysisResult
    });

  } catch (error) {
    console.error('Error during analysis:', error);
    res.status(500).json({ error: `Backend Error: ${error.message}` });
  }
});

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`SmartHire Backend running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try another port or stop the other server.`);
  } else {
    console.error('Server error:', err);
  }
});
