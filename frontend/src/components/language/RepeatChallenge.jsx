import React, { useState } from 'react';
import { ChevronLeft, Play, Pause, RotateCcw } from 'lucide-react';

export default function RepeatChallenge({ data, onBack }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  if (!data) return null;

  return (
    <div className="animate-fade-in space-y-8 animate-slide-up pb-6">
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
          <h3 className="font-bold text-white tracking-tight">Repeat After Me</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">~3 min · <span className="text-[#e05a35]">+10 XP</span></p>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-8">{data.instruction}</p>

      {/* Main Content Card */}
      <div className="bg-[#1e1e1e] p-6 rounded-3xl border border-gray-800/50 shadow-2xl relative overflow-hidden">
        {/* Audio Player Box */}
        <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-white/5 flex items-center justify-between mb-8 group">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 bg-[#e05a35] rounded-lg flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
            </button>
            <div className="text-left">
              <h4 className="font-bold text-white">{data.phrase}</h4>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{data.translation}</p>
            </div>
          </div>
          <div className="bg-[#242424] px-2 py-1 rounded text-[10px] font-black text-gray-400 border border-white/5">0.75x</div>
        </div>

        {/* Waveforms */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {/* Your Pronunciation */}
          <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-white/5 text-center flex flex-col items-center">
            <p className="text-[10px] font-black uppercase text-gray-600 mb-4 tracking-widest">Your Pronunciation</p>
            <div className="flex items-end gap-1 h-12">
              {[3, 5, 8, 4, 6, 9, 7, 5, 3].map((h, i) => (
                <div key={i} className="w-1.5 bg-orange-500/40 rounded-full" style={{ height: `${h * 10}%` }} />
              ))}
            </div>
          </div>
          {/* Native Speaker */}
          <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-white/5 text-center flex flex-col items-center">
            <p className="text-[10px] font-black uppercase text-gray-600 mb-4 tracking-widest">Native Speaker</p>
            <div className="flex items-end gap-1 h-12">
              {[2, 4, 7, 9, 8, 6, 9, 5, 2].map((h, i) => (
                <div key={i} className="w-1.5 bg-green-500/40 rounded-full" style={{ height: `${h * 10}%` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Similarity Score */}
        <div className="space-y-3 mb-8">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-1">
            <span className="text-gray-500">Similarity score</span>
            <span className="text-[#e05a35]">68%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 w-[68%]" />
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => setIsClaimed(true)}
          disabled={isClaimed}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${isClaimed ? 'bg-[#1a1a1a] text-gray-600' : 'bg-[#e05a35] text-white hover:brightness-110 active:scale-[0.98] shadow-lg shadow-orange-900/20'}`}
        >
          {isClaimed ? 'XP Claimed ✓' : 'Claim +10 XP ✓'}
        </button>
      </div>

      {/* Retry Footer */}
      {!isClaimed && (
        <div className="flex flex-col items-center gap-4">
           <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
              <RotateCcw size={14} /> Retry Recording
           </button>
        </div>
      )}
    </div>
  );
}
