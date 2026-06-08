import React from 'react';
import { ChevronLeft, ChevronRight, Salad, Drumstick } from 'lucide-react';
import { COOKING_CATEGORIES } from '../data/cookingData';

export default function CookingCategoryPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#111] text-white p-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => onNavigate('daily')}
          className="flex items-center gap-2 px-3 py-1.5 border border-gray-800 rounded-lg hover:bg-white/5 transition-colors text-xs font-semibold"
        >
          <ChevronLeft size={14} className="text-[#e05a35]" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>Cooking Mastery</h1>
      </div>

      <p className="text-gray-500 mb-8 text-sm max-w-md">
        Select your specialization to discover regional recipes and professional cooking techniques.
      </p>

      {/* Specialist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COOKING_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              localStorage.setItem('skillbite_selected_cooking_cat', cat.id);
              onNavigate('cooking_detail');
            }}
            className="group relative bg-[#1e1e1e] border border-gray-800/50 rounded-2xl p-6 hover:border-[#e05a35]/40 transition-all text-left overflow-hidden"
          >
            {/* Background Glow */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity rounded-full ${cat.id === 'veg' ? 'bg-green-500' : 'bg-orange-500'}`} />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-gray-800/50 ${cat.bg} ${cat.color}`}>
                {cat.icon === 'Salad' ? <Salad size={24} /> : <Drumstick size={24} />}
              </div>
              
              <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{cat.title}</h3>
              <p className="text-xs text-gray-500 mb-6 flex-grow leading-relaxed">
                {cat.id === 'veg' 
                  ? 'Master the art of plant-based cuisine, from hearty curries to fresh salads.'
                  : 'Learn to cook succulent meats and sustainable seafood like a professional chef.'}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#e05a35]">10 Recipes</span>
                <div className="w-8 h-8 rounded-full border border-gray-800 flex items-center justify-center group-hover:border-[#e05a35] group-hover:bg-[#e05a35] group-hover:text-white transition-all">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
