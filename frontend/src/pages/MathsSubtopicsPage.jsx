import React from 'react';
import { ChevronLeft, Zap, Clock, Play } from 'lucide-react';
import { MATHS_DATA } from '../data/mathsData';

export default function MathsSubtopicsPage({ onNavigate }) {
  const subId = parseInt(localStorage.getItem('skillbite_maths_sub') || '1');
  const subject = MATHS_DATA.subjects.find(s => s.id === subId);

  if (!subject) return null;

  return (
    <div className="bg-[#111] min-h-screen text-white p-6 space-y-8 animate-fade-in font-sans">
      <button 
        onClick={() => onNavigate('maths')}
        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-bold text-sm"
      >
        <ChevronLeft size={18} /> Back to Subjects
      </button>

      {/* Subject Hero */}
      <div className="bg-[#252525] p-8 rounded-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10 blur-sm pointer-events-none text-9xl">{subject.icon}</div>
        <div className="relative z-10 space-y-4 max-w-2xl">
          <h1 className="text-4xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>{subject.title}</h1>
          <p className="text-gray-400 text-lg leading-relaxed">{subject.description}</p>
          <div className="flex gap-4">
            <span className="bg-red-900/30 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-900/50 uppercase tracking-widest">{subject.difficulty}</span>
            <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-xs font-bold border border-gray-700 uppercase tracking-widest">{subject.estHours} Hours</span>
          </div>
          <button 
            onClick={() => {
              if (subject.subtopics && subject.subtopics.length > 0) {
                localStorage.setItem('skillbite_maths_topic', subject.subtopics[0].id);
                onNavigate('maths_problems');
              }
            }}
            className="bg-[#E85D04] text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-[#E85D04]/20"
          >
            Start all Topics
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {subject.subtopics.map((topic) => (
          <div 
            key={topic.id}
            onClick={() => {
              localStorage.setItem('skillbite_maths_topic', topic.id);
              onNavigate('maths_problems');
            }}
            className="group block bg-[#1e1e1e] hover:bg-[#252525] p-6 rounded-2xl border border-white/5 hover:border-[#E85D04]/30 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{topic.name}</h3>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: topic.color }}></div>
            </div>
            <p className="text-gray-500 text-sm mb-6">{topic.description}</p>
            <div className="space-y-4">
              <div className="flex justify-between items-end text-xs font-bold uppercase tracking-wider text-gray-600">
                <span>0% Complete</span>
                <span>{topic.problems} Problems</span>
              </div>
              <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden">
                <div className="w-0 h-full bg-[#E85D04]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* YouTube Strip */}
      <div className="pt-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: 'Syne, sans-serif' }}>
          <Play className="text-[#E85D04]" /> YouTube Resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {(subject.videos || []).map((vid, i) => (
            <a 
              key={i}
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(vid.query)}`}
              target="_blank" rel="noopener noreferrer"
              className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-white/5 group hover:border-[#E85D04]/30 transition-all"
            >
              <div className="h-32 bg-gray-800 flex items-center justify-center relative">
                 <div className="text-[#E85D04] opacity-50"><Play size={32} fill="currentColor" /></div>
                 <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold">{vid.duration}</div>
              </div>
              <div className="p-4">
                <p className="text-xs text-[#E85D04] font-bold mb-1 uppercase tracking-tighter">{vid.channel}</p>
                <h4 className="font-bold text-sm leading-tight group-hover:text-white transition-colors">{vid.title}</h4>
                <button className="mt-4 text-xs font-bold bg-white/5 hover:bg-[#E85D04] w-full py-2 rounded transition-colors px-2">Watch</button>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
