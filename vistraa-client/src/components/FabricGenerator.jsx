'use client';

import { useState } from 'react';

export default function FabricGenerator({ onSentimentData }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/ai/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error('API Error');

      const data = await res.json();
      setResult(data);

      if (onSentimentData) {
        onSentimentData(data);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl text-white shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-amber-400 text-xl">✨</span>
        <h2 className="text-xl font-bold">AI Fabric Sentiment Engine</h2>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">
            Enter Mood / Prompt
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. vibrant summer energy, calm ocean breeze..."
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/20"
        >
          {loading ? 'Analyzing Sentiment...' : 'Generate Pattern'}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <div>
              <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Detected Sentiment</p>
              <p className="text-lg font-black text-amber-400">{result.sentiment}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Confidence</p>
              <p className="text-lg font-black text-slate-200">{(result.confidence * 100).toFixed(0)}%</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase mb-1">Enriched AI Prompt</p>
            <p className="text-xs italic text-slate-300 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              "{result.enriched_prompt}"
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase mb-2">Generative Fabric Palette</p>
            <div className="flex gap-3">
              {result.color_palette?.map((hex, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-xl border-2 border-slate-700 shadow-md"
                    style={{ backgroundColor: hex }}
                  />
                  <span className="text-[10px] font-mono text-slate-400 mt-1">{hex}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}