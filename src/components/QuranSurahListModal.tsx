import { useState, useMemo } from 'react';
import { Search, BookOpen, Compass, ChevronLeft, Sparkles, Filter, Dices, Shuffle } from 'lucide-react';
import { QURAN_SURAHS, SurahMeta } from '../data/quranSurahsData';
import { ThemeMode } from '../types';

interface QuranSurahListModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSurahNumber: number;
  onSelectSurah: (surahNumber: number) => void;
  theme: ThemeMode;
}

export function QuranSurahListModal({
  isOpen,
  onClose,
  currentSurahNumber,
  onSelectSurah,
  theme,
}: QuranSurahListModalProps) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Meccan' | 'Medinan'>('all');
  const [selectedJuz, setSelectedJuz] = useState<number | 'all'>('all');

  const handleSelectRandomSurah = () => {
    const randomSurahNumber = Math.floor(Math.random() * 114) + 1;
    onSelectSurah(randomSurahNumber);
    onClose();
  };

  const filteredSurahs = useMemo(() => {
    return QURAN_SURAHS.filter((surah) => {
      if (filterType !== 'all' && surah.revelationType !== filterType) {
        return false;
      }

      if (selectedJuz !== 'all' && surah.juzStart !== selectedJuz) {
        return false;
      }

      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      const matchNum = String(surah.number) === q;
      const matchName = surah.name.includes(q);
      const matchEng = surah.englishName.toLowerCase().includes(q);
      const matchTrans = surah.englishNameTranslation.toLowerCase().includes(q);

      return matchNum || matchName || matchEng || matchTrans;
    });
  }, [search, filterType, selectedJuz]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in">
      <div
        className={`max-w-2xl w-full p-4 sm:p-6 rounded-3xl shadow-2xl border flex flex-col max-h-[88vh] ${
          theme === 'dark'
            ? 'bg-stone-900 border-stone-800 text-stone-100'
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <span>فهرس سور القرآن الكريم</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-normal">
                  ١١٤ سورة
                </span>
              </h3>
              <p className="text-xs text-stone-400">اختر السورة الكريمة للقراءة والاستماع والتدبر</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectRandomSurah}
              title="اختيار سورة عشوائية للتدبر والتلاوة"
              className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300/60 dark:border-amber-700/60 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>سورة عشوائية</span>
            </button>
            <button
              onClick={onClose}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-300 font-medium cursor-pointer"
            >
              إغلاق ✕
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="pt-3 pb-2 space-y-2.5 shrink-0">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث باسم السورة (مثال: الكهف، يس، 18، Yasin)..."
              className="w-full pl-8 pr-9 py-2 rounded-xl text-xs sm:text-sm border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />
            <Search className="w-4 h-4 absolute right-3 top-2.5 text-stone-400" />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute left-3 top-2 text-xs text-stone-400 hover:text-stone-600 px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-700"
              >
                مسح
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <div className="flex gap-1.5 items-center">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setFilterType('Meccan')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  filterType === 'Meccan'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                مكية (٨٦)
              </button>
              <button
                onClick={() => setFilterType('Medinan')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  filterType === 'Medinan'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                مدنية (٢٨)
              </button>
            </div>

            {/* Quick Juz Select */}
            <div className="flex items-center gap-1.5">
              <span className="text-stone-400 text-[11px] whitespace-nowrap">الجزء:</span>
              <select
                value={selectedJuz}
                onChange={(e) => setSelectedJuz(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="px-2 py-1 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs text-stone-700 dark:text-stone-300"
              >
                <option value="all">جميع الأجزاء (١-٣٠)</option>
                {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
                  <option key={j} value={j}>
                    الجزء {j}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Surahs Grid */}
        <div className="overflow-y-auto pr-1 flex-1 py-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filteredSurahs.map((surah) => {
            const isCurrent = currentSurahNumber === surah.number;
            return (
              <button
                key={surah.number}
                onClick={() => {
                  onSelectSurah(surah.number);
                  onClose();
                }}
                className={`p-3 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-xs ring-1 ring-emerald-500'
                    : 'border-stone-200 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-stone-50/80 dark:hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Surah Number Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                      isCurrent
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-100 dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {surah.number}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm font-quran text-stone-900 dark:text-stone-100">
                        سورة {surah.name}
                      </h4>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                          surah.revelationType === 'Meccan'
                            ? 'bg-amber-100/70 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                            : 'bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        }`}
                      >
                        {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      {surah.numberOfAyahs} آية • صفحة {surah.pageStart} • جزء {surah.juzStart}
                    </p>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <span className="text-[11px] font-mono text-stone-400 block">
                    {surah.englishName}
                  </span>
                  <ChevronLeft className="w-4 h-4 text-stone-300 inline-block" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-400 shrink-0">
          <span>المصحف الشريف كامل برواية حفص عن عاصم بالرسم العثماني</span>
          <button
            onClick={handleSelectRandomSurah}
            className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>اختر سورة عشوائية</span>
          </button>
        </div>
      </div>
    </div>
  );
}
