import React from 'react';
import { ChevronLeft, Play, Zap, BookOpen } from 'lucide-react';
import { MATHS_DATA } from '../data/mathsData';

export default function MathsProblemsPage({ onNavigate }) {
  const subId = parseInt(localStorage.getItem('skillbite_maths_sub') || '1');
  const topicId = parseInt(localStorage.getItem('skillbite_maths_topic') || '0');
  
  const subject = MATHS_DATA.subjects.find(s => s.id === subId);
  const topic = subject?.subtopics.find(t => t.id === topicId);
  const problems = MATHS_DATA.problems[`${subId}-${topicId}`] || [];

  if (!subject || !topic) return null;

  return (
    <div className="bg-[#111] min-h-screen text-white p-6 space-y-8 animate-fade-in font-sans">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => {
            if (window.history.length > 2) {
              window.history.back();
            } else {
              onNavigate('maths_subtopics');
            }
          }}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-bold text-sm"
        >
          <ChevronLeft size={18} /> Back to Sub-topics
        </button>
        <span className="bg-[#E85D04]/20 text-[#E85D04] px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#E85D04]/30">{subject.title}</span>
      </div>

      {/* Topic Hero */}
      <div className="bg-[#1e1e1e] p-8 rounded-2xl border border-white/5 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>{topic.name}</h1>
          <p className="text-gray-400 leading-relaxed max-w-3xl">{topic.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {topic.concepts.map((concept, i) => (
            <span key={i} className="bg-gray-900 text-gray-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-800 flex items-center gap-2">
              <BookOpen size={12} /> {concept}
            </span>
          ))}
        </div>
      </div>

      {/* YouTube Playlist */}
      <div className="bg-[#242424] border border-[#E85D04]/10 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 group hover:border-[#E85D04]/40 transition-all">
        <div className="w-full md:w-48 h-28 bg-[#111] rounded-xl flex items-center justify-center text-[#E85D04] relative group-hover:scale-[1.02] transition-all">
          <Play size={48} className="text-[#E85D04]" />
        </div>
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h3 className="text-lg font-bold">Recommended Playlist: {topic.name}</h3>
          <p className="text-sm text-gray-500 font-medium">MIT OpenCourseWare · 24 High Quality Videos</p>
          <a 
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(topic.name + ' playlist')}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 bg-white/5 hover:bg-[#E85D04] text-white px-5 py-2 rounded-lg text-sm font-bold transition-all"
          >
            <Play size={14} fill="currentColor" /> Open Playlist
          </a>
        </div>
      </div>

      {/* Problem list */}
      <div className="space-y-4">
        {problems.map((prob, idx) => (
          <button 
            key={prob.id}
            onClick={() => {
              localStorage.setItem('skillbite_maths_prob', prob.id);
              onNavigate('maths_quiz');
            }}
            className="w-full group bg-[#1e1e1e] hover:bg-[#252525] p-5 rounded-xl border border-white/5 hover:border-white/10 transition-all flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-6">
              <span className="text-lg font-black text-gray-800 group-hover:text-white/20 transition-colors uppercase italic">{String(idx + 1).padStart(2, '0')}</span>
              <div>
                <h4 className="text-lg font-bold group-hover:text-[#E85D04] transition-colors">{prob.title}</h4>
                <p className="text-sm font-mono text-gray-600 mt-1">{prob.formula}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter border ${
                prob.difficulty === 'Easy' ? 'text-green-500 border-green-900/30' : 
                prob.difficulty === 'Medium' ? 'text-yellow-500 border-yellow-900/30' : 'text-red-500 border-red-900/30'
              }`}>
                {prob.difficulty}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-black text-[#E85D04] bg-[#E85D04]/10 px-2 py-1 rounded">
                <Zap size={12} fill="currentColor" /> {prob.xp} XP
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
