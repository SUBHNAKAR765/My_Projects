import React from 'react';
import { ChevronLeft, Mic } from 'lucide-react';

export default function PronunciationChallenge({ data, onBack }) {
  if (!data) return null;

  return (
    <div className="animate-fade-in space-y-8 animate-slide-up">
      {/* Header Info */}
      <div className="flex items-center gap-4 mb-6 pt-2">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 border border-gray-800 rounded-lg hover:bg-white/5 transition-colors text-xs font-semibold"
        >
          <ChevronLeft size={14} className="text-[#e05a35]" />
          <span>Back</span>
        </button>
        <div>
          <h3 className="font-bold text-white tracking-tight">Pronunciation Challenge</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">~2 min · <span className="text-[#e05a35]">+10 XP</span></p>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-8">{data.instruction}</p>

      {/* Main Card */}
      <div className="bg-[#1e1e1e] p-12 rounded-3xl border border-gray-800/50 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
        {/* Subtle glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <h2 className="text-7xl font-bold mb-4 text-white drop-shadow-sm tracking-tight">{data.word}</h2>
        <p className="text-2xl text-gray-400 font-medium tracking-wide">{data.transliteration}</p>
      </div>

      {/* Mic Footer */}
      <div className="flex flex-col items-center gap-6 pt-8">
        <button className="w-20 h-20 bg-[#1e1e1e] border-2 border-orange-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(224,90,53,0.1)] hover:border-orange-500/50 hover:shadow-[0_0_40px_rgba(224,90,53,0.2)] transition-all group active:scale-95">
          <Mic size={32} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
        </button>
        <p className="text-xs text-gray-500 font-bold tracking-wider uppercase">Press the mic and say the word clearly</p>
      </div>
    </div>
  );
}
