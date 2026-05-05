import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, Mic, PenTool, Clock, Trophy, Target, Flame } from 'lucide-react';
import { LANGUAGE_DATA, SKILL_SECTIONS } from '../data/languageData';
import { PRONUNCIATION_DATA, REPEAT_DATA, PICTURE_DATA } from '../data/speakingData';
import { WRITING_CHALLENGES, TRACING_DATA, TRANSLATE_TYPE_DATA, CONSTRUCTION_DATA } from '../data/writingData';
import SpeakingChallengesList from '../components/language/SpeakingChallengesList';
import WritingChallengesList from '../components/language/WritingChallengesList';
import PronunciationChallenge from '../components/language/PronunciationChallenge';
import RepeatChallenge from '../components/language/RepeatChallenge';
import PictureChallenge from '../components/language/PictureChallenge';
import ScriptTracingChallenge from '../components/language/ScriptTracingChallenge';
import TranslateTypeChallenge from '../components/language/TranslateTypeChallenge';
import SentenceConstructionChallenge from '../components/language/SentenceConstructionChallenge';
import ListeningChallengesList from '../components/language/ListeningChallengesList';

export default function LanguageDetailPage({ onNavigate }) {
  const languageId = localStorage.getItem('skillbite_selected_lang') || 'hindi';
  const categoryId = localStorage.getItem('skillbite_lang_cat') || 'indian';
  
  const category = LANGUAGE_DATA.categories.find(c => c.id === categoryId);
  const language = category?.languages.find(l => l.id === languageId);

  const [view, setView] = useState('overview'); // 'overview', 'skill_list', 'challenge'
  const [activeSkill, setActiveSkill] = useState(null);
  const [activeChallenge, setActiveChallenge] = useState(null);

  if (!language) return null;

  const stats = [
    { label: 'Day streak', value: '1', icon: Flame, color: 'text-orange-500' },
    { label: 'Sections done', value: '0/3', icon: Target, color: 'text-blue-400' },
    { label: 'Total XP', value: '0', icon: Trophy, color: 'text-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-[#111] text-white p-6 animate-fade-in font-sans pb-24">
      {/* Header - Only in Overview */}
      {view === 'overview' && (
        <>
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => onNavigate('language_list')}
              className="flex items-center gap-2 px-3 py-1.5 border border-gray-800 rounded-lg hover:bg-white/5 transition-colors text-sm font-semibold"
            >
              <ChevronLeft size={16} className="text-[#e05a35]" />
              <span>Back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>{language.name}</h1>
              <p className="text-sm text-gray-500">{language.family} · {language.speakers} speakers</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <p className="text-sm text-gray-500">Level 1 · Beginner</p>
              <p className="text-sm font-bold text-[#e05a35]">0 / {language.xp} XP</p>
            </div>
            <div className="h-1.5 w-full bg-gray-800/50 rounded-full overflow-hidden">
              <div className="h-full bg-[#e05a35]/40 rounded-full w-[2%]" />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {stats.map((stat, i) => (
              <div key={i} className="bg-[#1e1e1e] p-4 rounded-xl border border-gray-800/50 flex flex-col items-center justify-center text-center">
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Hero Pills */}
          <div className="flex gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
            {['First step', 'Triple crown', 'On fire'].map(tag => (
              <div key={tag} className="flex items-center gap-2 px-3 py-1 bg-[#1e1e1e]/50 border border-gray-800/50 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{tag}</span>
              </div>
            ))}
          </div>

          {/* Skill Overview Tier 1 */}
          <div className="space-y-3 mb-12">
            {SKILL_SECTIONS.map((section) => {
              const Icon = section.id === 'speaking' ? Mic : section.id === 'writing' ? PenTool : Clock;
              const iconColor = section.id === 'speaking' ? 'bg-green-500/10 text-green-500' : section.id === 'writing' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500';
              
              return (
                <div key={section.id} className="bg-[#1e1e1e] rounded-xl border border-gray-800/50 overflow-hidden hover:border-gray-700 transition-colors">
                  <button 
                    onClick={() => {
                      setActiveSkill(section.id);
                      setView('skill_list');
                    }}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor}`}>
                        <Icon size={20} />
                      </div>
                      <span className="text-lg font-bold">{section.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <span className="text-xs">{section.tips} tips</span>
                      <ChevronDown size={16} className="-rotate-90" />
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Skill List Tier 2 */}
      {view === 'skill_list' && (
        <div className="animate-fade-in">
          {activeSkill === 'speaking' && (
            <SpeakingChallengesList 
              onBack={() => setView('overview')}
              onSelectChallenge={(id) => {
                setActiveChallenge(id);
                setView('challenge');
              }} 
            />
          )}
          {activeSkill === 'writing' && (
            <WritingChallengesList 
              onBack={() => setView('overview')}
              onSelectChallenge={(id) => {
                setActiveChallenge(id);
                setView('challenge');
              }} 
            />
          )}
          {activeSkill === 'listening' && (
             <ListeningChallengesList 
                onBack={() => setView('overview')}
                onSelectChallenge={(id) => {
                  setActiveChallenge(id);
                  setView('challenge');
                }} 
              />
          )}
        </div>
      )}

      {/* Challenge Tier 3 */}
      {view === 'challenge' && (
        <div className="animate-fade-in">
          {activeSkill === 'speaking' && (
            <>
              {activeChallenge === 'pronunciation' && (
                <PronunciationChallenge 
                  data={PRONUNCIATION_DATA[languageId]?.[0]} 
                  onBack={() => setView('skill_list')} 
                />
              )}
              {activeChallenge === 'repeat' && (
                <RepeatChallenge 
                  data={REPEAT_DATA[languageId]?.[0]} 
                  onBack={() => setView('skill_list')} 
                />
              )}
              {activeChallenge === 'picture' && (
                <PictureChallenge 
                  data={PICTURE_DATA[languageId]?.[0]} 
                  onBack={() => setView('skill_list')} 
                />
              )}
              {activeChallenge === 'conversation' && (
                 <div className="pt-2">
                    <button onClick={() => setView('skill_list')} className="flex items-center gap-2 px-3 py-1.5 mb-6 border border-gray-800 rounded-lg hover:bg-white/5 transition-colors text-xs font-semibold">
                      <ChevronLeft size={14} className="text-[#e05a35]" />
                      <span>Back</span>
                    </button>
                    <div className="p-12 text-center text-gray-500 bg-white/5 rounded-2xl animate-fade-in">
                      <h4 className="font-bold text-white mb-2">Conversation Simulation</h4>
                      <p className="text-sm">Coming soon!</p>
                    </div>
                 </div>
              )}
            </>
          )}
          {activeSkill === 'writing' && (
            <>
              {activeChallenge === 'tracing' && (
                <ScriptTracingChallenge 
                  data={TRACING_DATA[languageId]?.[0]} 
                  onBack={() => setView('skill_list')} 
                />
              )}
              {activeChallenge === 'translate_type' && (
                <TranslateTypeChallenge 
                  data={TRANSLATE_TYPE_DATA[languageId]?.[0]} 
                  onBack={() => setView('skill_list')} 
                />
              )}
              {activeChallenge === 'construction' && (
                <SentenceConstructionChallenge 
                  data={CONSTRUCTION_DATA[languageId]?.[0]} 
                  onBack={() => setView('skill_list')} 
                />
              )}
              {activeChallenge === 'blanks' && (
                 <div className="pt-2">
                    <button onClick={() => setView('skill_list')} className="flex items-center gap-2 px-3 py-1.5 mb-6 border border-gray-800 rounded-lg hover:bg-white/5 transition-colors text-xs font-semibold">
                      <ChevronLeft size={14} className="text-[#e05a35]" />
                      <span>Back</span>
                    </button>
                    <div className="p-12 text-center text-gray-500 bg-white/5 rounded-2xl animate-fade-in">
                      <h4 className="font-bold text-white mb-2">Fill in the Blanks</h4>
                      <p className="text-sm">Coming soon!</p>
                    </div>
                 </div>
              )}
            </>
          )}
          {activeSkill === 'listening' && (
             <div className="pt-2 animate-fade-in">
                <button onClick={() => setView('skill_list')} className="flex items-center gap-2 px-3 py-1.5 mb-6 border border-gray-800 rounded-lg hover:bg-white/5 transition-colors text-xs font-semibold">
                  <ChevronLeft size={14} className="text-[#e05a35]" />
                  <span>Back</span>
                </button>
                <div className="p-12 text-center text-gray-500 bg-white/5 rounded-2xl">
                  <h4 className="font-bold text-white mb-2 uppercase tracking-widest text-xs">{activeChallenge?.replace('_', ' ')}</h4>
                  <p className="text-sm">This listening exercise is coming soon!</p>
                </div>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
