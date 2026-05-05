import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChefHat, Salad, Drumstick, Clock, Trophy, Target, Flame, CheckCircle2, ArrowLeft } from 'lucide-react';
import { COOKING_CATEGORIES, COOKING_TOPICS, COOKING_STEPS } from '../data/cookingData';

export default function CookingDetailPage({ onNavigate }) {
  const categoryId = localStorage.getItem('skillbite_selected_cooking_cat') || 'veg';
  const category = COOKING_CATEGORIES.find(c => c.id === categoryId);
  const recipes = COOKING_TOPICS[categoryId] || [];

  const [view, setView] = useState('list'); // 'list', 'step_by_step'
  const [activeRecipeId, setActiveRecipeId] = useState(null);

  const activeRecipe = recipes.find(r => r.id === activeRecipeId);
  const steps = activeRecipe ? COOKING_STEPS[activeRecipe.id] : [];

  if (!category) return null;

  return (
    <div className="min-h-screen bg-[#111] text-white p-6 animate-fade-in font-sans pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (view === 'step_by_step') setView('list');
              else onNavigate('cooking_list');
            }}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-800 rounded-lg hover:bg-white/5 transition-colors text-xs font-semibold"
          >
            <ChevronLeft size={14} className="text-[#e05a35]" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-3">
             <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${category.bg} ${category.color}`}>
                {category.icon === 'Salad' ? <Salad size={20} /> : <Drumstick size={20} />}
             </div>
             <div>
                <h2 className="text-xl font-bold leading-tight">{category.title}</h2>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Mastery Level 1</p>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#e05a35] bg-[#e05a35]/10 px-3 py-1 rounded-full border border-[#e05a35]/20">
          <Trophy size={14} />
          <span className="text-xs font-bold">120 XP</span>
        </div>
      </div>

      {view === 'list' ? (
        <div className="animate-fade-in space-y-6">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-lg font-bold">Recommended Recipes</h3>
            <span className="text-xs text-gray-500">{recipes.length} available</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {recipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => {
                  setActiveRecipeId(recipe.id);
                  setView('step_by_step');
                }}
                className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-zinc-800 text-gray-400 group-hover:bg-[#e05a35]/20 group-hover:text-[#e05a35] transition-colors`}>
                    <ChefHat size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-white transition-colors">{recipe.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[10px] text-gray-500">
                        <Clock size={10} /> {recipe.time}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        recipe.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' :
                        recipe.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {recipe.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#e05a35]">+{recipe.xp} XP</span>
                  <ChevronRight size={18} className="text-gray-600 group-hover:text-[#e05a35] transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-fade-in space-y-8">
          <div className="glass-card rounded-2xl p-6 border border-[#e05a35]/20 shadow-[0_0_40px_rgba(224,90,53,0.08)] bg-zinc-900/40">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white tracking-tight">{activeRecipe?.title}</h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                 <Clock size={12} className="text-gray-400" />
                 <span className="text-xs text-gray-400">{activeRecipe?.time}</span>
              </div>
            </div>

            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col gap-2 p-4 glass-card-interactive rounded-xl border border-white/5 hover:border-[#e05a35]/30 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#e05a35]/20 text-[#e05a35] text-[10px] font-bold border border-[#e05a35]/30">
                      {idx + 1}
                    </div>
                    <p className="text-base font-bold text-white">Step {idx + 1}</p>
                  </div>
                  <div className="pl-9">
                    <p className="text-sm text-gray-400 leading-relaxed italic border-l-2 border-[#e05a35]/20 pl-3">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-[#e05a35]/20 transition-all">
                <span className="text-[10px] font-black uppercase text-[#e05a35] mb-2 block tracking-widest">Chef's Secret</span>
                <p className="text-xs leading-relaxed text-gray-400">Always prep your ingredients (Mise en place) before turning on the heat. This prevents overcooking and stress.</p>
              </div>
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-green-500/20 transition-all">
                <span className="text-[10px] font-black uppercase text-green-500 mb-2 block tracking-widest">Nutrition Tip</span>
                <p className="text-xs leading-relaxed text-gray-400">Sautéing on high heat preserves the texture and nutrients of vegetables better than long boiling.</p>
              </div>
            </div>

            <button
              onClick={() => setView('list')}
              className="w-full mt-10 bg-gradient-to-r from-[#e85d04] to-[#f48c06] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_10px_20px_rgba(232,93,4,0.2)] hover:shadow-[0_15px_30px_rgba(232,93,4,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Finish Recipe
              <CheckCircle2 size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
