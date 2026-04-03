import React from 'react';
import { ChevronLeft, Mic, Info } from 'lucide-react';

export default function PictureChallenge({ data, onBack }) {
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
          <h3 className="font-bold text-white tracking-tight">Picture Description</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">~3 min · <span className="text-[#e05a35]">+15 XP</span></p>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-6">{data.instruction}</p>

      {/* Main Image Card */}
      <div className="bg-[#1e1e1e] p-6 rounded-3xl border border-gray-800/50 shadow-2xl flex flex-col items-center">
        <div className="w-full aspect-[16/10] bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden mb-6 relative group">
          <img 
            src="/hindi_market_scene.png" 
            alt="Market Scene"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-4">
             <span className="text-xl font-bold text-white tracking-tight">{data.title}</span>
          </div>
        </div>

        {/* Mic Button */}
        <button className="w-16 h-16 bg-[#252525] border-2 border-white/10 rounded-2xl flex items-center justify-center shadow-xl hover:border-orange-500/50 transition-all active:scale-95 group mb-8">
          <Mic size={28} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
        </button>

        {/* Suggested Sentences */}
        <div className="w-full bg-[#1a1a1a] p-5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
            <Info size={14} className="text-gray-500" />
            <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Suggested Sentences</h5>
          </div>
          <div className="space-y-4">
            {data.suggestedSentences.map((s, i) => (
              <div key={i} className="flex flex-col">
                <p className="text-lg font-bold text-gray-200">{s.hindi}</p>
                <p className="text-[11px] text-gray-500 font-medium">· {s.translation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
