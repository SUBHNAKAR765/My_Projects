import React, { useState } from 'react';
import { ChevronLeft, Info, Flame } from 'lucide-react';

export default function SentenceConstructionChallenge({ data, onBack }) {
  const [selectedWords, setSelectedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState(data?.words || []);

  const handleWordClick = (word, index, isFromSelected) => {
    if (isFromSelected) {
      setSelectedWords(selectedWords.filter((_, i) => i !== index));
      setAvailableWords([...availableWords, word]);
    } else {
      setAvailableWords(availableWords.filter((_, i) => i !== index));
      setSelectedWords([...selectedWords, word]);
    }
  };

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
          <h3 className="font-bold text-white tracking-tight">Sentence Construction</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">~3 min · <span className="text-[#e05a35]">+15 XP</span></p>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-6">{data.instruction}</p>

      {/* Target Area */}
      <div className="w-full min-h-32 bg-[#1a1a1a] border-2 border-dashed border-gray-800/50 rounded-3xl p-6 flex flex-wrap gap-3 items-center justify-center relative group">
        {selectedWords.length === 0 && (
          <span className="text-gray-700 font-bold uppercase tracking-widest text-xs select-none">Drop words here</span>
        )}
        {selectedWords.map((word, i) => (
          <button 
            key={i} 
            onClick={() => handleWordClick(word, i, true)}
            className="px-5 py-3 bg-[#1e1e1e] border-2 border-orange-500 text-white rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Word Options */}
      <div className="flex flex-wrap gap-3 justify-center py-6">
        {availableWords.map((word, i) => (
          <button 
            key={i} 
            onClick={() => handleWordClick(word, i, false)}
            className="px-6 py-4 bg-[#1e1e1e] border border-gray-800 text-gray-300 rounded-2xl font-bold text-xl hover:text-white hover:border-gray-600 transition-all active:scale-95 shadow-sm"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Grammar Tip */}
      <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 space-y-3">
        <div className="flex items-center gap-2">
          <Info size={12} className="text-gray-600 font-black" />
          <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-600">Grammar Tip</h5>
        </div>
        <div className="text-left font-bold">
          <p className="text-sm text-gray-300 mb-2">{data.grammarTip}</p>
          <p className="text-xs text-gray-600 leading-relaxed">{data.tipExample}</p>
        </div>
      </div>

      {/* Streak Bonus */}
      <div className="bg-[#e05a35]/10 border border-[#e05a35]/20 p-3 rounded-xl flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
          <Flame size={18} className="text-[#e05a35]" fill="currentColor" />
        </div>
        <p className="text-xs font-bold text-[#e05a35]">Streak bonus: 3 correct in a row = +5 XP</p>
      </div>

      {/* Action Button */}
      <button className="w-full py-4 bg-[#1e1e1e] border border-gray-800 rounded-2xl font-bold text-gray-400 hover:text-white hover:border-orange-500/50 transition-all active:scale-[0.98] shadow-lg">
        Claim +15 XP ✓
      </button>
    </div>
  );
}
