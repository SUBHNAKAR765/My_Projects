import React from 'react';
import { ChevronRight, Calculator, Zap, Clock, Star } from 'lucide-react';
import { MATHS_DATA } from '../data/mathsData';

export default function MathsCategoryPage({ onNavigate }) {
  return (
    <div className="bg-[#111] min-h-screen text-white p-6 space-y-8 animate-fade-in font-sans">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Engineering & Discrete Math</h1>
        <p className="text-gray-400 text-lg">Select a main subject to begin your practice.</p>
      </div>

      {/* Hero Stats */}
      <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-white/5 flex flex-wrap gap-8 items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#E85D04]/10 rounded-xl text-[#E85D04]">
            <Calculator size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold">6</p>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Subjects</p>
          </div>
        </div>
        <div className="w-px h-10 bg-gray-800 hidden sm:block"></div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#E85D04]/10 rounded-xl text-[#E85D04]">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold">1,850</p>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Total Problems</p>
          </div>
        </div>
        <div className="w-px h-10 bg-gray-800 hidden sm:block"></div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#E85D04]/10 rounded-xl text-[#E85D04]">
            <Star size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold">Hard</p>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Avg Difficulty</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {MATHS_DATA.subjects.map((sub, idx) => (
          <button 
            key={sub.id}
            onClick={() => {
              localStorage.setItem('skillbite_maths_sub', sub.id);
              onNavigate('maths_subtopics');
            }}
            className="w-full group bg-[#1e1e1e] hover:bg-[#252525] p-5 rounded-xl border border-white/5 transition-all flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-5">
              <span className="text-2xl text-gray-700 font-black group-hover:text-[#E85D04] transition-colors">{idx + 1}</span>
              <div className="text-3xl">{sub.icon}</div>
              <div>
                <h3 className="text-xl font-bold text-gray-200 group-hover:text-white transition-colors">{sub.title}</h3>
                <p className="text-sm text-gray-500">{sub.description}</p>
              </div>
            </div>
            <ChevronRight size={24} className="text-gray-700 group-hover:text-[#E85D04] group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
}
