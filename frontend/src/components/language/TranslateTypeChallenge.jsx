import React, { useState } from 'react';
import { ChevronLeft, Info } from 'lucide-react';

export default function TranslateTypeChallenge({ data, onBack }) {
  const [inputValue, setInputValue] = useState('');

  if (!data) return null;

  return (
    <div className="animate-fade-in space-y-8 animate-slide-up pb-8">
      {/* Header Info */}
      <div className="flex items-center gap-4 mb-4 pt-2">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 border border-gray-800 rounded-lg hover:bg-white/5 transition-colors text-xs font-semibold"
        >
          <ChevronLeft size={14} className="text-[#e05a35]" />
          <span>Back</span>
        </button>
        <div>
          <h3 className="font-bold text-white tracking-tight">Translate and Type</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">~4 min · <span className="text-[#e05a35]">+15 XP</span></p>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-6">{data.instruction}</p>

      {/* English Prompt Card */}
      <div className="bg-[#1e1e1e] p-8 rounded-3xl border border-gray-800/50 shadow-2xl flex items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-white tracking-tight">{data.english}</h2>
      </div>

      {/* Input Area */}
      <div className="relative">
        <textarea 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type Hindi translation here..."
          className="w-full h-40 bg-[#1e1e1e] border-2 border-gray-800 rounded-3xl p-6 text-xl font-bold text-white placeholder-gray-700 outline-none focus:border-orange-500/30 transition-all resize-none shadow-inner"
        />
      </div>

      {/* Word Map */}
      <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2 mb-4">
          <Info size={12} className="text-gray-600" />
          <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Word Map</h5>
        </div>
        <div className="flex flex-wrap gap-3">
          {data.wordMap.map((word, i) => (
            <div 
              key={i} 
              className={`px-3 py-1.5 rounded-lg text-sm font-bold border flex items-center gap-2 ${
                word.status === 'correct' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 
                word.status === 'hint' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
                'bg-transparent border-gray-800 text-gray-600'
              }`}
            >
              <span>{word.hindi}</span>
              {word.status === 'correct' && <span className="text-[10px]">✓</span>}
              {word.status === 'hint' && <span className="text-[10px]">?</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full py-4 bg-[#1e1e1e] border border-gray-800 rounded-2xl font-bold text-gray-400 hover:text-white hover:border-orange-500/50 transition-all active:scale-[0.98] shadow-lg">
        Claim +15 XP ✓
      </button>
    </div>
  );
}
