'use client';

import React, { useState } from 'react';
import Garment3DOverlay from '../components/Garment3DOverlay';
import CartDrawer from '../components/CartDrawer';
import { Sparkles, ShoppingCart } from 'lucide-react';

export default function Home() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sentiment Engine State
  const [promptText, setPromptText] = useState('calm ocean blue');
  const [detectedSentiment, setDetectedSentiment] = useState('CALM');
  const [confidence, setConfidence] = useState(88);
  const [enrichedPrompt, setEnrichedPrompt] = useState(
    '"Serene silk fabric texture based on mood \'CALM\': calm ocean blue"'
  );
  const [activePalette, setActivePalette] = useState(['#0077B6', '#00B4D8', '#90E0EF']);
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Sentiment Analysis Handler
  const handleGeneratePattern = (e) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const text = promptText.toLowerCase();
      let sentiment = 'CALM';
      let palette = ['#0077B6', '#00B4D8', '#90E0EF'];
      let conf = Math.floor(Math.random() * 15) + 80; // 80-95%

      if (text.includes('fire') || text.includes('energetic') || text.includes('sun') || text.includes('red') || text.includes('warm')) {
        sentiment = 'ENERGETIC';
        palette = ['#FF5733', '#FFC300', '#DAF7A6'];
      } else if (text.includes('dark') || text.includes('mystery') || text.includes('purple') || text.includes('night')) {
        sentiment = 'MYSTERIOUS';
        palette = ['#4A0E17', '#7B2CBF', '#E0AAFF'];
      } else if (text.includes('neon') || text.includes('cyber') || text.includes('vibrant') || text.includes('zap')) {
        sentiment = 'CREATIVE';
        palette = ['#FF007F', '#7F00FF', '#00FFFF'];
      }

      setDetectedSentiment(sentiment);
      setConfidence(conf);
      setEnrichedPrompt(`"Generative woven silk fabric texture based on mood '${sentiment}': ${promptText}"`);
      setActivePalette(palette);
      setIsGenerating(false);
    }, 500);
  };

  const handleAddToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
    setIsCartOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#070b14] text-white p-4 md:p-8 font-sans">
      {/* Top Navigation */}
      <header className="flex justify-between items-center mb-6 max-w-2xl mx-auto border-b border-slate-800/80 pb-4">
        <h1 className="text-xl font-bold tracking-widest text-teal-400 flex items-center gap-2">
          VISTRAA AI
        </h1>
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative px-4 py-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center gap-2"
        >
          <ShoppingCart className="w-4 h-4 text-amber-400" />
          <span>Cart</span>
          {cartItems.length > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-full">
              {cartItems.length}
            </span>
          )}
        </button>
      </header>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Card 1: AI Fabric Sentiment Engine */}
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl space-y-5">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-slate-100">AI Fabric Sentiment Engine</h2>
          </div>

          <form onSubmit={handleGeneratePattern} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Enter Mood / Prompt
              </label>
              <input
                type="text"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="e.g. calm ocean blue"
                className="w-full px-4 py-3 rounded-xl bg-[#030712] border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/80 text-sm transition"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-bold text-sm rounded-xl transition shadow-lg shadow-amber-500/10 disabled:opacity-50"
            >
              {isGenerating ? 'Analyzing Sentiment...' : 'Generate Pattern'}
            </button>
          </form>

          {/* Analysis Results Display */}
          <div className="p-4 bg-[#030712]/90 border border-slate-800/80 rounded-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
              <div>
                <span className="block text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                  Detected Sentiment
                </span>
                <span className="text-base font-extrabold text-amber-400 tracking-wide">
                  {detectedSentiment}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                  Confidence
                </span>
                <span className="text-base font-extrabold text-slate-200">
                  {confidence}%
                </span>
              </div>
            </div>

            <div>
              <span className="block text-[10px] font-semibold text-slate-400 tracking-wider uppercase mb-1">
                Enriched AI Prompt
              </span>
              <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-xs italic text-slate-300">
                {enrichedPrompt}
              </div>
            </div>

            <div>
              <span className="block text-[10px] font-semibold text-slate-400 tracking-wider uppercase mb-2">
                Generative Fabric Palette
              </span>
              <div className="flex gap-3">
                {activePalette.map((color, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div
                      className="w-12 h-12 rounded-xl border border-white/10 shadow-inner"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {color}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: 3D Procedural Fabric Draping */}
        <Garment3DOverlay
          activePalette={activePalette}
          activeSentiment={detectedSentiment}
          onAddToCart={handleAddToCart}
        />
      </div>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        clearCart={() => setCartItems([])}
      />
    </main>
  );
}