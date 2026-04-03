import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LANGUAGE_DATA } from '../data/languageData';

export default function LanguageListPage({ onNavigate }) {
  const categoryId = localStorage.getItem('skillbite_lang_cat') || 'indian';
  const category = LANGUAGE_DATA.categories.find(c => c.id === categoryId);

  if (!category) return null;

  return (
    <div className="min-h-screen bg-[#111] text-white p-6 animate-fade-in font-sans">
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={() => onNavigate('language')}
          className="flex items-center gap-2 px-3 py-1.5 border border-gray-800 rounded-lg hover:bg-white/5 transition-colors text-sm font-semibold"
        >
          <ChevronLeft size={16} className="text-[#e05a35]" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>{category.title}</h1>
      </div>

      <div className="divide-y divide-gray-800/50">
        {category.languages.map((lang) => (
          <div 
            key={lang.id}
            onClick={() => {
              localStorage.setItem('skillbite_selected_lang', lang.id);
              onNavigate('language_detail');
            }}
            className="group flex items-center justify-between py-6 cursor-pointer hover:bg-white/[0.02] px-2 transition-colors border-b border-gray-800/50"
          >
            <div>
              <h2 className="text-lg font-bold mb-0.5">{lang.name}</h2>
              <p className="text-sm text-gray-500">{lang.family} · {lang.speakers} speakers</p>
            </div>
            <ChevronRight size={20} className="text-[#e05a35] group-hover:translate-x-1 transition-transform" />
          </div>
        ))}
      </div>
    </div>
  );
}
