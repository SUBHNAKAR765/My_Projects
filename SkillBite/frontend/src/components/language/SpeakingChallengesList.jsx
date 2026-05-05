import React from 'react';
import { Mic, ChevronLeft, ChevronDown } from 'lucide-react';
import { SPEAKING_CHALLENGES } from '../../data/speakingData';

const ICON_MAP = {
  Mic: Mic,
  Volume2: (props) => <div className="p-0.5"><div className="w-full h-full flex items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg></div></div>,
  Image: (props) => <div className="p-0.5"><div className="w-full h-full flex items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div></div>,
  MessageSquare: (props) => <div className="p-0.5"><div className="w-full h-full flex items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div></div>
};

export default function SpeakingChallengesList({ onSelectChallenge, onBack }) {
  return (
    <div className="pt-2 space-y-6 animate-fade-in">
      {/* Skill Detail Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-800 rounded-lg hover:bg-white/5 transition-colors text-xs font-semibold"
          >
            <ChevronLeft size={14} className="text-[#e05a35]" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
                <Mic size={20} />
             </div>
             <h2 className="text-2xl font-bold">Speaking</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-xs">4 tips</span>
          <ChevronDown size={16} />
        </div>
      </div>

      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-400">0 / 4 done</span>
        </div>
        <span className="text-sm font-bold text-blue-500">0 XP</span>
      </div>
      
      {/* Progress Bar Mini */}
      <div className="h-1 w-full bg-gray-800 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-green-500/30 w-0" />
      </div>

      <div className="space-y-3">
        {SPEAKING_CHALLENGES.map((challenge) => {
          const Icon = ICON_MAP[challenge.icon];
          return (
            <button
              key={challenge.id}
              onClick={() => onSelectChallenge(challenge.id)}
              className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${challenge.accent}`}>
                  <Icon size={24} />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-white group-hover:text-white transition-colors">{challenge.title}</h4>
                  <p className="text-xs text-gray-500">{challenge.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${challenge.dotColor}`} />
                <span className="text-xs font-bold text-[#e05a35]">+{challenge.xp} XP</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
