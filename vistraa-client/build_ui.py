import os

os.makedirs('src/components', exist_ok=True)

fabric_code = ''''use client';

import { useState } from "react";
import { generateFabricPattern } from "@/lib/api";
import { Sparkles, Loader2, Palette } from "lucide-react";

export default function FabricGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await generateFabricPattern(prompt);
      setResult(data);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-white">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-amber-400" />
        <h2 className="text-xl font-semibold tracking-wide">AI Fabric Sentiment Engine</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Enter Mood / Prompt</label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Vibrant summer energy"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-amber-400 text-white placeholder-slate-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing IPC Pipeline...
            </>
          ) : (
            "Generate Pattern"
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-950/50 border border-red-800 text-red-300 rounded-xl text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 p-5 bg-slate-800/60 border border-slate-700 rounded-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-700 pb-3">
            <div>
              <span className="text-xs text-slate-400 block uppercase tracking-wider">Detected Sentiment</span>
              <span className="text-lg font-bold text-amber-400">{result.sentiment_label}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block uppercase tracking-wider">Confidence</span>
              <span className="text-sm font-semibold text-slate-200">{(result.sentiment_score * 100).toFixed(0)}%</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-400 block uppercase tracking-wider mb-1">Enriched AI Prompt</span>
            <p className="text-sm text-slate-300 italic bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              "{result.generated_prompt}"
            </p>
          </div>

          <div>
            <span className="text-xs text-slate-400 flex items-center gap-1 uppercase tracking-wider mb-2">
              <Palette className="w-4 h-4 text-amber-400" /> Color Palette
            </span>
            <div className="flex gap-3">
              {result.color_palette?.map((hex, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div
                    className="w-12 h-12 rounded-lg border border-slate-600 shadow-inner"
                    style={{ backgroundColor: hex }}
                  />
                  <span className="text-xs font-mono text-slate-400">{hex}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'''

page_code = '''import FabricGenerator from "@/components/FabricGenerator";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-3 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
          VISTRAA
        </h1>
        <p className="text-slate-400 text-lg">
          Affective Computing & 3D Digital Apparel Studio
        </p>
      </div>

      <FabricGenerator />
    </main>
  );
}
'''

with open("src/components/FabricGenerator.jsx", "w", encoding="utf-8") as f: f.write(fabric_code)
with open("src/app/page.js", "w", encoding="utf-8") as f: f.write(page_code)
print("=== ALL FILES CREATED SUCCESSFULLY ===")
