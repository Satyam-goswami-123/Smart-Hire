import React, { useState, useEffect, useRef } from 'react';
import * as webllm from '@mlc-ai/web-llm';
import './WebLLMTest.css';

export default function WebLLMTest({ onNavigateHome }) {
  const [modelStatus, setModelStatus] = useState('Not loaded');
  const [progress, setProgress] = useState(0);
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const engineRef = useRef(null);

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      setModelStatus('Loading...');
      
      const initProgressCallback = (report) => {
        setModelStatus(report.text);
        if (report.progress) {
          setProgress(report.progress);
        }
      };

      // Select a small, fast model for testing
      const selectedModel = "TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC";
      
      const engine = new webllm.MLCEngine();
      engine.setInitProgressCallback(initProgressCallback);
      
      await engine.reload(selectedModel);
      
      engineRef.current = engine;
      setModelStatus('Model Loaded Successfully (WebGPU Active)');
      setProgress(1);
    } catch (err) {
      console.error(err);
      setModelStatus('Failed to load model. Does your browser support WebGPU?');
    }
  };

  const handleAskAI = async () => {
    if (!engineRef.current || !inputText.trim()) return;
    
    setIsGenerating(true);
    setResponse('');
    
    try {
      const messages = [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: inputText }
      ];

      const chunks = await engineRef.current.chat.completions.create({
        messages,
        stream: true,
      });

      let currentResponse = '';
      for await (const chunk of chunks) {
        currentResponse += chunk.choices[0]?.delta?.content || '';
        setResponse(currentResponse);
      }
    } catch (err) {
      console.error(err);
      setResponse("Error generating response.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="webllm-container">
      <div className="webllm-header">
        <button onClick={onNavigateHome} className="back-btn">← Back Home</button>
        <h2>WebLLM + WebGPU Test</h2>
      </div>

      <div className="status-box">
        <h4>Model Status: {modelStatus}</h4>
        <progress value={progress} max="1" style={{ width: '100%' }}></progress>
      </div>

      <div className="chat-box">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask something..."
          rows={4}
          disabled={!engineRef.current || isGenerating}
        />
        <button 
          onClick={handleAskAI} 
          disabled={!engineRef.current || isGenerating || !inputText.trim()}
          className="ask-btn"
        >
          {isGenerating ? 'Generating...' : 'Ask AI'}
        </button>
      </div>

      <div className="response-box">
        <h4>AI Response:</h4>
        <div className="response-content">
          {response || (isGenerating ? '...' : 'No response yet.')}
        </div>
      </div>
    </div>
  );
}
