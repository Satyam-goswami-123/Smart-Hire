import { useRef, useState, useCallback } from "react";
import * as webllm from "@mlc-ai/web-llm";

let globalEngine = null;
let globalLoadPromise = null;
const MODEL = "TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC";

export function useWebLLM() {
  const [modelStatus, setModelStatus] = useState(globalEngine ? "ready" : "idle");
  const [loadProgress, setLoadProgress] = useState(globalEngine ? 1 : 0);

  const loadModel = useCallback(async () => {
    if (globalEngine) { setModelStatus("ready"); setLoadProgress(1); return globalEngine; }
    if (globalLoadPromise) return globalLoadPromise;
    setModelStatus("loading");
    globalLoadPromise = (async () => {
      try {
        const engine = new webllm.MLCEngine();
        engine.setInitProgressCallback((report) => {
          setModelStatus(report.text || "loading");
          if (report.progress) setLoadProgress(report.progress);
        });
        await engine.reload(MODEL);
        globalEngine = engine;
        setModelStatus("ready");
        setLoadProgress(1);
        return engine;
      } catch (err) {
        globalLoadPromise = null;
        setModelStatus("error");
        throw new Error("WebGPU not supported or model failed to load. Try Chrome 113+.");
      }
    })();
    return globalLoadPromise;
  }, []);

  const analyzeResume = useCallback(async (resumeText, jdText, onToken) => {
    const engine = await loadModel();
    const truncate = (t, n) => t.length > n ? t.slice(0, n) + "..." : t;
    const resumeSnippet = truncate(resumeText, 1200);
    const jdSnippet = truncate(jdText, 800);

    const prompt = `You are an expert ATS resume coach. Analyze the resume vs the job description. Reply ONLY with a valid JSON object, no markdown.

RESUME:
${resumeSnippet}

JOB DESCRIPTION:
${jdSnippet}

Reply with this JSON only:
{"matchScore":<0-100>,"atsScore":<0-100>,"hiringProbability":"High|Medium|Low","matchedSkills":[...],"missingSkills":[...],"strengths":["...","..."],"improvements":["...","..."],"summary":"<2 sentences>"}`;

    const messages = [
      { role: "system", content: "You are a precise ATS analysis engine. Respond with valid JSON only." },
      { role: "user", content: prompt }
    ];

    const chunks = await engine.chat.completions.create({ messages, stream: true, temperature: 0.1, max_tokens: 512 });

    let raw = "";
    for await (const chunk of chunks) {
      const token = chunk.choices[0]?.delta?.content || "";
      raw += token;
      if (onToken) onToken(raw);
    }

    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON in response");
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
        totalJdSkills: (parsed.matchedSkills?.length || 0) + (parsed.missingSkills?.length || 0),
        aiPowered: true,
      };
    } catch (err) {
      console.error("JSON parse failed:", raw);
      throw new Error("AI returned unexpected format. Please try again.");
    }
  }, [loadModel]);

  return {
    modelStatus,
    loadProgress,
    isReady: modelStatus === "ready",
    isLoading: modelStatus === "loading",
    loadModel,
    analyzeResume,
  };
}
