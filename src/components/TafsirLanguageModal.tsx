import { useState } from 'react';
import { Search, Globe, Check, BookText } from 'lucide-react';
import { TAFSIR_TRANSLATION_EDITIONS, TafsirTranslationEdition } from '../data/quranSurahsData';
import { ThemeMode } from '../types';

interface TafsirLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEdition: string;
  onSelectEdition: (editionId: string) => void;
  theme: ThemeMode;
}

export function TafsirLanguageModal({
  isOpen,
  onClose,
  selectedEdition,
  onSelectEdition,
  theme,
}: TafsirLanguageModalProps) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'tafsir' | 'translation'>('all');

  if (!isOpen) return null;

  const filtered = TAFSIR_TRANSLATION_EDITIONS.filter((ed) => {
    if (filterType === 'tafsir' && ed.type !== 'tafsir') return false;
    if (filterType === 'translation' && ed.type !== 'translation') return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      ed.name.toLowerCase().includes(q) ||
      ed.languageName.toLowerCase().includes(q) ||
      ed.englishName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div
        className={`max-w-md w-full p-6 rounded-3xl shadow-2xl border ${
          theme === 'dark'
            ? 'bg-stone-900 border-stone-800 text-stone-100'
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">كتب التفسير وترجمات المعاني</h3>
              <p className="text-[11px] text-stone-400">اختر التفسير العربي أو لغة الترجمة المرغوبة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-300"
          >
            إغلاق ✕
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث باللغة أو اسم التفسير..."
            className="w-full pl-8 pr-9 py-2 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-3.5 h-3.5 absolute right-3 top-2.5 text-stone-400" />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 mb-3">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
            }`}
          >
            الكل ({TAFSIR_TRANSLATION_EDITIONS.length})
          </button>
          <button
            onClick={() => setFilterType('tafsir')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'tafsir'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
            }`}
          >
            التفاسير العربية
          </button>
          <button
            onClick={() => setFilterType('translation')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'translation'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
            }`}
          >
            الترجمات العالمية
          </button>
        </div>

        {/* List of Editions */}
        <div className="space-y-1.5 max-h-[55vh] overflow-y-auto pr-1">
          {filtered.map((ed) => {
            const isSelected = selectedEdition === ed.identifier;
            return (
              <button
                key={ed.identifier}
                onClick={() => {
                  onSelectEdition(ed.identifier);
                  onClose();
                }}
                className={`w-full text-right p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                    }`}
                  >
                    <BookText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold">{ed.name}</h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-200/70 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                        {ed.languageName}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">{ed.englishName}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
