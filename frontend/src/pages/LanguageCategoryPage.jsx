import { ChevronRight, X } from 'lucide-react';
import { LANGUAGE_DATA } from '../data/languageData';

export default function LanguageCategoryPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#111] text-white p-6 animate-fade-in font-sans">
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Language Learning Methods</h1>
          <p className="text-gray-500">Choose a category to begin your journey.</p>
        </div>
        <button 
          onClick={() => onNavigate('daily')}
          className="flex items-center gap-2 px-4 py-2 border border-gray-800 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X size={18} />
          <span className="font-semibold text-sm">Close</span>
        </button>
      </div>

      <div className="space-y-4">
        {LANGUAGE_DATA.categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => {
              localStorage.setItem('skillbite_lang_cat', cat.id);
              onNavigate('language_list');
            }}
            className="w-full group flex items-center justify-between p-6 bg-[#1e1e1e] border-b border-gray-800 hover:bg-[#252525] transition-all text-left"
          >
            <div>
              <h2 className="text-xl font-bold mb-1">{cat.title}</h2>
              <p className="text-sm text-gray-500">{cat.subtitle}</p>
            </div>
            <ChevronRight size={24} className="text-[#e05a35] group-hover:translate-x-1 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
}
