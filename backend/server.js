const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// /api/extract — returns raw text only; AI analysis runs in frontend via Web-LLM
app.post('/api/extract', upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'jdFile', maxCount: 1 }
]), async (req, res) => {
  try {
    let resumeText = '';
    let jdText = req.body.jdText || '';

    if (req.files && req.files['resume']) {
      const resumeBuffer = req.files['resume'][0].buffer;
      const pdfFn = (typeof pdfParse === 'function') ? pdfParse : (pdfParse.default || pdfParse);
      try {
        const pdfData = await pdfFn(resumeBuffer);
        resumeText = pdfData.text;
      } catch (err) {
        throw new Error('Could not parse resume PDF.');
      }
    } else {
      return res.status(400).json({ error: 'Resume file is required.' });
    }

    if (req.files && req.files['jdFile']) {
      const jdBuffer = req.files['jdFile'][0].buffer;
      const pdfFn = (typeof pdfParse === 'function') ? pdfParse : (pdfParse.default || pdfParse);
      const jdPdfData = await pdfFn(jdBuffer);
      jdText = jdPdfData.text;
    }

    if (!jdText || !jdText.trim()) {
      return res.status(400).json({ error: 'Job Description is required.' });
    }

    res.json({ success: true, resumeText: resumeText.trim(), jdText: jdText.trim() });

  } catch (error) {
    console.error('Extraction error:', error);
    res.status(500).json({ error: `Backend Error: ${error.message}` });
  }
});

// /api/analyze — legacy rule-based fallback
const { analyzeResumeMatch } = require('./utils/matchingEngine');
app.post('/api/analyze', upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'jdFile', maxCount: 1 }
]), async (req, res) => {
  try {
    let resumeText = '';
    let jdText = req.body.jdText || '';
    if (req.files && req.files['resume']) {
      const pdfFn = (typeof pdfParse === 'function') ? pdfParse : (pdfParse.default || pdfParse);
      const pdfData = await pdfFn(req.files['resume'][0].buffer);
      resumeText = pdfData.text;
    } else return res.status(400).json({ error: 'Resume required' });
    if (req.files && req.files['jdFile']) {
      const pdfFn = (typeof pdfParse === 'function') ? pdfParse : (pdfParse.default || pdfParse);
      const jdPdfData = await pdfFn(req.files['jdFile'][0].buffer);
      jdText = jdPdfData.text;
    }
    if (!jdText) return res.status(400).json({ error: 'JD required' });
    const analysisResult = analyzeResumeMatch(resumeText, jdText);
    res.json({ success: true, data: analysisResult });
  } catch (error) {
    res.status(500).json({ error: `Backend Error: ${error.message}` });
  }
});

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => console.log(`SmartHire Backend running on port ${PORT}`));
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') console.error(`Port ${PORT} already in use.`);
  else console.error('Server error:', err);
});
