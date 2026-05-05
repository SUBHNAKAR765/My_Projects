import React, { useState } from 'react';
import { ArrowLeft, Dumbbell, Play, Check, Zap, Flame, Shield, MapPin, Eye } from 'lucide-react';

const EXERCISES = [
  { id: 1, title: 'Jumping Jacks Warm-Up', xp: 20 },
  { id: 2, title: 'Bodyweight Squats (3x15)', xp: 50 },
  { id: 3, title: 'Push-Ups to failure', xp: 75 },
  { id: 4, title: 'Plank Hold (60s)', xp: 40 },
  { id: 5, title: 'Walking Lunges (3x12/leg)', xp: 60 },
  { id: 6, title: 'Bicycle Crunches (3x20)', xp: 45 },
  { id: 7, title: 'Burpees (2x10)', xp: 80 },
  { id: 8, title: 'Mountain Climbers (45s)', xp: 50 },
  { id: 9, title: 'Glute Bridges (3x15)', xp: 40 },
  { id: 10, title: 'Child’s Pose Cool-down', xp: 15 },
];

const VIDEOS = [
  { id: 1, title: '15 Min Fat Burn HIIT', channel: 'FitPro Daily', duration: '15:20', tag: 'Trending', query: '15 Min Fat Burn HIIT' },
  { id: 2, title: 'Perfect Bodyweight Squat Form', channel: 'Movement Masters', duration: '8:45', tag: 'Essential', query: 'Perfect Bodyweight Squat Form' },
  { id: 3, title: 'Core Strength Progression', channel: 'Iron Athletics', duration: '12:10', tag: 'Popular', query: 'Core Strength Progression' },
  { id: 4, title: 'Full Body Mobility Stretch', channel: 'Zen Fitness', duration: '20:00', tag: 'Recovery', query: 'Full Body Mobility Stretch' },
];

export default function FitnessModulePage({ onNavigate }) {
  const [checkedItems, setCheckedItems] = useState(new Set());

  const toggleCheck = (id) => {
    const next = new Set(checkedItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedItems(next);
  };

  const completedCount = checkedItems.size;
  const progressPercent = Math.round((completedCount / EXERCISES.length) * 100);
  const totalXPEarned = EXERCISES.filter(ex => checkedItems.has(ex.id)).reduce((acc, curr) => acc + curr.xp, 0);
  const totalXPMax = EXERCISES.reduce((acc, curr) => acc + curr.xp, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-24 font-sans text-gray-200" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      
      {/* Breadcrumb Nav */}
      <button 
        onClick={() => onNavigate('fitness')}
        className="flex items-center gap-2 text-gray-400 hover:text-[#E85D04] transition-colors text-sm font-semibold"
      >
        <ArrowLeft size={16} /> Back to Modules
      </button>

      {/* Module Hero */}
      <div 
        style={{ borderRadius: '12px', border: '0.5px solid rgba(255,255,255,0.07)', background: '#242424' }}
        className="relative overflow-hidden p-6 md:p-8"
      >
        {/* Abstract Glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#E85D04]/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">
          <div className="w-16 h-16 bg-[#1a1a1a] shadow-[0_0_15px_rgba(232,93,4,0.2)] rounded-2xl border border-[#E85D04]/30 flex items-center justify-center shrink-0">
            <Dumbbell size={32} color="#E85D04" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Quick Workouts</h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-3xl">
              A high-impact curated list of bodyweight exercises designed to elevate your heart rate, build core strength, and maximize calorie burn in under 20 minutes. No equipment necessary.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#E85D04] bg-[#E85D04]/10 px-3 py-1.5 rounded-lg border border-[#E85D04]/20">
                <Flame size={14} /> 3 Day Streak
              </span>
              <span className="flex items-center gap-1.5 text-gray-300 bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-gray-800">
                <Shield size={14} /> Difficulty: Medium
              </span>
              <span className="flex items-center gap-1.5 text-green-400 bg-green-900/20 px-3 py-1.5 rounded-lg border border-green-800/30">
                <Zap size={14} /> Up to {totalXPMax} XP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'Syne, sans-serif' }}>
          <MapPin size={20} className="text-[#E85D04]" /> Task Checklist
        </h2>
        <div className="space-y-3">
          {EXERCISES.map((ex) => {
            const isChecked = checkedItems.has(ex.id);
            return (
              <div 
                key={ex.id}
                onClick={() => toggleCheck(ex.id)}
                style={{ borderRadius: '12px', border: '0.5px solid rgba(255,255,255,0.07)', background: '#242424' }}
                className={`flex items-center justify-between p-4 cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 hover:border-[#E85D04]/40 ${isChecked ? 'bg-[#1e1e1e] border-gray-800 opacity-60' : ''}`}
              >
                <div className="flex items-center gap-4">
                  {/* Circular Checkbox */}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isChecked ? 'bg-[#E85D04] border-[#E85D04]' : 'bg-[#1a1a1a] border-[#E85D04]/30'}`}>
                    {isChecked && <Check size={14} className="text-white" strokeWidth={3} />}
                  </div>
                  <span className={`text-sm md:text-base font-semibold transition-all ${isChecked ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                    {ex.title}
                  </span>
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors ${isChecked ? 'bg-gray-900 border-gray-800 text-gray-600' : 'bg-[#E85D04]/10 border-[#E85D04]/30 text-[#E85D04]'}`}>
                  <Zap size={12} /> {ex.xp} XP
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Recommendations Section */}
      <div className="pt-4">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'Syne, sans-serif' }}>
          <Play size={22} className="text-[#E85D04]" /> Recommended on YouTube
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VIDEOS.map((vid, idx) => {
            // cycle through some deep gradients for thumbnails
            const gradients = [
              'from-[#E85D04]/40 to-[#1a1a1a]', 
              'from-blue-900/40 to-[#1a1a1a]', 
              'from-purple-900/40 to-[#1a1a1a]', 
              'from-green-900/40 to-[#1a1a1a]'
            ];
            const bgGrad = gradients[idx % gradients.length];

            return (
              <a 
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(vid.query)}`}
                target="_blank" rel="noopener noreferrer"
                key={vid.id}
                style={{ borderRadius: '12px', border: '0.5px solid rgba(255,255,255,0.07)', background: '#242424' }}
                className="group block overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#E85D04]/50 hover:shadow-[0_8px_30px_rgba(232,93,4,0.15)] flex-col"
              >
                {/* Thumbnail placeholder */}
                <div className={`w-full h-32 bg-gradient-to-br ${bgGrad} flex items-center justify-center relative`}>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white opacity-80 group-hover:bg-[#E85D04] group-hover:scale-110 group-hover:opacity-100 transition-all shadow-lg">
                    <Play size={16} fill="currentColor" className="ml-1" />
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider backdrop-blur">
                    {vid.duration}
                  </span>
                </div>
                
                {/* Card Details */}
                <div className="p-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#E85D04] mb-1.5 inline-block">
                    {vid.tag}
                  </span>
                  <h3 className="font-bold text-gray-200 text-sm mb-1 leading-tight line-clamp-2 group-hover:text-white transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {vid.title}
                  </h3>
                  <p className="text-gray-500 text-xs flex items-center gap-1.5 font-medium">
                    <Eye size={12} /> {vid.channel}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Floating Progress Footer */}
      <div className="fixed bottom-0 left-0 lg:left-60 right-0 p-4 bg-[#1a1a1a]/80 backdrop-blur-md border-t border-[#E85D04]/20 shadow-[0_-10px_40px_rgba(232,93,4,0.05)] z-40 transform transition-transform">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="flex-1 w-full flex items-center gap-4">
            <div className="w-full h-2.5 bg-gray-900 rounded-full overflow-hidden shadow-inner border border-gray-800">
              <div 
                className="h-full rounded-full transition-all duration-700 ease-out bg-[#E85D04] shadow-[0_0_10px_#E85D04]"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="text-sm font-bold text-gray-300 w-12 text-right">{progressPercent}%</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-semibold whitespace-nowrap">
            <span className="text-gray-400">Total Earned: </span>
            <span className={`text-[#E85D04] flex items-center gap-1 text-base ${progressPercent === 100 ? 'animate-pulse scale-110 drop-shadow-[0_0_8px_#E85D04] duration-300' : 'transition-all duration-300'}`}>
              <Zap size={16} fill={progressPercent === 100 ? '#E85D04' : 'none'} /> {totalXPEarned} XP 
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
