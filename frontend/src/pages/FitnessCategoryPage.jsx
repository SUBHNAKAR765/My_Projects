import React from 'react';
import { Dumbbell, Clock, Zap, ArrowRight, HeartPulse, Apple, Trophy, LineChart } from 'lucide-react';

const FITNESS_MODULES = [
  { id: 'quick_workouts', title: 'Quick Workouts', icon: Dumbbell, xp: 250, time: '15 Min', desc: 'High-intensity sessions for busy schedules.' },
  { id: 'flexibility', title: 'Flexibility & Mobility', icon: HeartPulse, xp: 180, time: '20 Min', desc: 'Stretch, recover, and increase range of motion.' },
  { id: 'nutrition', title: 'Nutrition Basics', icon: Apple, xp: 300, time: '10 Min', desc: 'Learn the fundamentals of macros and fueling.' },
  { id: 'challenges', title: 'Fitness Challenges', icon: Trophy, xp: 500, time: '30 Min', desc: 'Push your limits with weekly gamified tasks.' },
  { id: 'progress', title: 'Progress Tracking', icon: LineChart, xp: 120, time: '5 Min', desc: 'Log your metrics and visualize your growth.' },
];

export default function FitnessCategoryPage({ onNavigate }) {
  return (
    <div className="space-y-8 animate-fade-in pb-12 font-sans">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#242424] border border-white/10 p-8 shadow-2xl">
        {/* Abstract shapes for decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E85D04]/10 rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none"></div>
        <div className="absolute bottom-0 right-32 w-48 h-48 bg-[#ff7a29]/5 rounded-full blur-2xl translate-y-12 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="w-16 h-16 bg-[#1a1a1a] border border-[#E85D04]/30 rounded-xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(232,93,4,0.3)]">
            <Dumbbell size={32} color="#E85D04" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-black text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
            Fitness Mastery
          </h1>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Level up your physical health. Dive into curated modules testing your endurance, strength, entirely tailored for holistic growth.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#E85D04]/10 rounded-lg text-[#E85D04]">
                <Dumbbell size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-lg">45</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Active Exercises</p>
              </div>
            </div>
            <div className="w-px h-10 bg-gray-700 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#E85D04]/10 rounded-lg text-[#E85D04]">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-lg">25 mins</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Avg. Time</p>
              </div>
            </div>
            <div className="w-px h-10 bg-gray-700 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#E85D04]/10 rounded-lg text-[#E85D04]">
                <Zap size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-lg">1,250</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total XP Value</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extracted Modules Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-white tracking-wide" style={{ fontFamily: 'Syne, sans-serif' }}>
            Learning Modules
          </h2>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        {/* Horizontal Module Selector Row - built with a flex container allowing internal wrap or explicit horizontal scroll if desired, doing grid for responsiveness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FITNESS_MODULES.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div 
                key={mod.id}
                onClick={() => onNavigate('fitness_module')}
                style={{ 
                  borderRadius: '12px',
                  border: '0.5px solid rgba(255,255,255,0.07)',
                  backgroundColor: '#242424'
                }}
                className="group relative p-6 cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#E85D04]/50 hover:shadow-[0_8px_30px_rgba(232,93,4,0.15)] flex flex-col h-full"
              >
                {/* Active Highlight Mock (Could evaluate url state later, statically mock 1st active) */}
                {idx === 0 && (
                   <div className="absolute top-0 right-0 p-3">
                      <span className="w-2.5 h-2.5 bg-[#E85D04] rounded-full inline-block shadow-[0_0_8px_#E85D04]"></span>
                   </div>
                )}
                
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-[#E85D04]/10">
                  <Icon size={24} className="text-gray-300 group-hover:text-[#E85D04] transition-colors" />
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 tracking-wide" style={{ fontFamily: 'Syne, sans-serif' }}>{mod.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-1">{mod.desc}</p>
                
                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex gap-3">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#E85D04] bg-[#E85D04]/10 px-2 py-1 rounded">
                      <Zap size={12} /> {mod.xp} XP
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-gray-400 bg-[#1a1a1a] px-2 py-1 rounded border border-gray-800">
                      <Clock size={12} /> {mod.time}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-gray-800 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-[#E85D04] group-hover:border-[#E85D04] transition-colors shadow">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}
