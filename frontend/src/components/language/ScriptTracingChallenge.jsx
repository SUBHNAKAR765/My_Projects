import React from 'react';
import { ChevronLeft, Play, RotateCcw } from 'lucide-react';

export default function ScriptTracingChallenge({ data, onBack }) {
  if (!data) return null;

  return (
    <div className="animate-fade-in space-y-6 animate-slide-up pb-8">
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
          <h3 className="font-bold text-white tracking-tight">Script Tracing</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">~3 min · <span className="text-[#e05a35]">+10 XP</span></p>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-6">{data.instruction}</p>

      {/* Attempt Tabs */}
      <div className="flex items-center justify-center gap-3 mb-6">
        {['Attempt 1', 'Attempt 2', 'Attempt 3'].map((attempt, i) => (
          <div key={i} className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-colors ${i === 0 ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-gray-800 text-gray-600'}`}>
            {attempt}
          </div>
        ))}
      </div>

      {/* Tracing Canvas Area */}
      <div className="bg-[#1e1e1e] rounded-3xl border border-gray-800/50 shadow-2xl overflow-hidden relative group">
        <div className="aspect-[16/9] flex items-center justify-center relative">
          {/* Character Outline */}
          <span className="text-[12rem] font-bold text-white/5 select-none">{data.character}</span>
          
          {/* Mock Draw Indicator */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 border-2 border-dashed border-orange-500/30 rounded-full animate-ping" />
          </div>
          
          <span className="absolute bottom-6 right-6 text-[10px] font-black uppercase text-gray-600 tracking-widest">Draw here</span>
        </div>
      </div>

      {/* Stroke Animation Button */}
      <div className="flex justify-center pt-4">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] border border-gray-800 rounded-xl text-sm font-bold text-white hover:bg-white/5 transition-all">
          <Play size={16} fill="currentColor" />
          <span>Show stroke animation</span>
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 flex items-center gap-6">
        <div className="text-4xl font-bold text-white">{data.character}</div>
        <div className="text-left">
          <h4 className="font-bold text-xl text-white">{data.transliteration}</h4>
          <p className="text-sm text-gray-500">{data.example}</p>
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full py-4 bg-[#1e1e1e] border border-gray-800 rounded-2xl font-bold text-gray-400 hover:text-white hover:border-orange-500/50 transition-all active:scale-[0.98]">
        Claim +10 XP ✓
      </button>
    </div>
  );
}
