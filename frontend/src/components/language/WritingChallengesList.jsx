import { Feather, ChevronLeft, ChevronDown, FileText, Type, Puzzle } from 'lucide-react';
import { WRITING_CHALLENGES } from '../../data/writingData';

const ICON_MAP = {
  Feather: Feather,
  FileText: FileText,
  Type: Type,
  Puzzle: Puzzle
};

export default function WritingChallengesList({ onSelectChallenge, onBack }) {
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
             <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Feather size={20} />
             </div>
             <h2 className="text-2xl font-bold">Writing</h2>
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
        <div className="h-full bg-blue-500/30 w-0" />
      </div>

      <div className="space-y-3">
        {WRITING_CHALLENGES.map((challenge) => {
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
