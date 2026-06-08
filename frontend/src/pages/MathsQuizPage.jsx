import React, { useState, useEffect } from 'react';
import { X, Clock, Zap, CheckCircle2, AlertCircle, ArrowRight, Trophy } from 'lucide-react';
import { MATHS_DATA } from '../data/mathsData';

export default function MathsQuizPage({ onNavigate }) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);
  
  const subId = parseInt(localStorage.getItem('skillbite_maths_sub') || '1');
  const topicId = parseInt(localStorage.getItem('skillbite_maths_topic') || '0');
  const probId = parseInt(localStorage.getItem('skillbite_maths_prob') || '0');
  
  const problems = MATHS_DATA.problems[`${subId}-${topicId}`] || [];
  const prob = problems.find(p => p.id === probId);
  const quiz = prob?.quiz;

  useEffect(() => {
    if (finished) return;
    const timer = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { clearInterval(timer); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [finished]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelect = (idx) => {
    if (showFeedback) return;
    setSelected(idx);
    setTimeout(() => {
      setShowFeedback(true);
    }, 800);
  };

  if (!quiz) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#111] text-white flex flex-col font-sans animate-fade-in">
      {/* Top Bar */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Challenge</span>
          <h2 className="font-bold text-sm tracking-wide">Engineering & Discrete Math</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-mono text-[#E85D04] bg-[#E85D04]/10 px-3 py-1.5 rounded-lg border border-[#E85D04]/20">
            <Clock size={16} />
            <span className="font-bold">{formatTime(timeLeft)}</span>
          </div>
          <button 
            onClick={() => onNavigate('maths_problems')} 
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="w-full h-1 bg-gray-900 overflow-hidden">
        <div className="h-full bg-[#E85D04] transition-all duration-300" style={{ width: '33%' }} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
        {!finished ? (
          <div className="w-full space-y-8 animate-fade-in">
            <div className="bg-[#1e1e1e] p-8 rounded-3xl border border-white/5 shadow-2xl">
              <span className="text-[#E85D04] font-black uppercase italic text-xs mb-4 block">Question 01</span>
              <h3 className="text-2xl font-bold leading-relaxed">{quiz.question}</h3>
              {prob.formula && <p className="mt-4 font-mono text-gray-500 bg-black/30 p-4 rounded-xl border border-white/5">{prob.formula}</p>}
            </div>

            <div className="grid gap-4">
              {quiz.options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrect = quiz.correct === i;
                let bg = 'bg-[#1e1e1e] border-white/5 hover:border-[#E85D04]/30';
                if (showFeedback) {
                   if (isCorrect) bg = 'bg-green-900/40 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]';
                   else if (isSelected) bg = 'bg-red-900/40 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]';
                   else bg = 'bg-[#1e1e1e] border-white/5 opacity-50';
                } else if (isSelected) {
                   bg = 'bg-[#E85D04]/10 border-[#E85D04] shadow-[0_0_20px_rgba(232,93,4,0.2)]';
                }

                return (
                  <button 
                    key={i} 
                    onClick={() => handleSelect(i)}
                    className={`p-6 rounded-2xl border transition-all text-left flex items-center justify-between group ${bg}`}
                  >
                    <div className="flex items-center gap-4">
                       <span className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-xs font-black text-gray-500 group-hover:text-white transition-colors">
                          {String.fromCharCode(65 + i)}
                       </span>
                       <span className="text-lg font-bold">{opt}</span>
                    </div>
                    {showFeedback && isCorrect && <CheckCircle2 className="text-green-500" size={24} />}
                    {showFeedback && !isCorrect && isSelected && <AlertCircle className="text-red-500" size={24} />}
                  </button>
                );
              })}
            </div>

            {showFeedback && (
              <div className="animate-slide-up bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 space-y-3">
                <p className="text-[#E85D04] font-black uppercase tracking-widest text-[10px]">Explanation</p>
                <p className="text-gray-400 leading-relaxed">{quiz.explanation}</p>
                <button 
                  onClick={() => setFinished(true)}
                  className="mt-6 flex items-center gap-2 bg-[#E85D04] hover:bg-[#ff7a29] text-white px-8 py-3 rounded-xl font-bold ml-auto transition-all"
                >
                  Next question <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center space-y-8 animate-fade-in w-full max-w-lg">
             <div className="w-32 h-32 bg-[#E85D04]/10 rounded-full flex items-center justify-center mx-auto border border-[#E85D04]/20 shadow-[0_0_40px_rgba(232,93,4,0.2)]">
                <Trophy size={64} className="text-[#E85D04]" strokeWidth={1} />
             </div>
             <div>
                <h2 className="text-4xl font-bold mb-2">Challenge Complete!</h2>
                <p className="text-gray-500">You've mastered {prob.title}.</p>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1e1e1e] p-5 rounded-2xl border border-white/5">
                   <p className="text-xs text-gray-500 uppercase font-black tracking-widest mb-1">Score</p>
                   <p className="text-2xl font-bold text-white">100%</p>
                </div>
                <div className="bg-[#1e1e1e] p-5 rounded-2xl border border-white/5">
                   <p className="text-xs text-gray-500 uppercase font-black tracking-widest mb-1">XP Earned</p>
                   <p className="text-2xl font-bold text-green-400">+{prob.xp}</p>
                </div>
             </div>

             <div className="space-y-4 pt-10">
                <button 
                  onClick={() => onNavigate('maths_problems')}
                  className="w-full bg-[#E85D04] hover:bg-[#ff7a29] text-white py-4 rounded-2xl font-bold shadow-lg transition-all"
                >
                  Continue Journey
                </button>
                <button className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all">
                   See solutions
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
