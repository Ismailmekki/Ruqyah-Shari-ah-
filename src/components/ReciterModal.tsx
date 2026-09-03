import { useState } from 'react';
import { Check, User, Volume2, Search } from 'lucide-react';
import { Reciter, ThemeMode } from '../types';
import { RECITERS } from '../data/recitersData';

interface ReciterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedReciter: Reciter;
  onSelectReciter: (r: Reciter) => void;
  theme: ThemeMode;
}

export function ReciterModal({
  isOpen,
  onClose,
  selectedReciter,
  onSelectReciter,
  theme,
}: ReciterModalProps) {
  const [search, setSearch] = useState('');
  const [filterStyle, setFilterStyle] = useState<'all' | 'murattal' | 'mujawwad' | 'haramain'>('all');

  if (!isOpen) return null;

  const filteredReciters = RECITERS.filter((r) => {
    if (filterStyle === 'mujawwad' && !r.name.includes('مجود')) return false;
    if (filterStyle === 'murattal' && (r.name.includes('مجود') || r.name.includes('المعلم'))) return false;
    if (filterStyle === 'haramain' && !r.subname.includes('المسجد') && !r.subname.includes('الحرام') && !r.subname.includes('النبوي')) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return r.name.toLowerCase().includes(q) || r.subname.toLowerCase().includes(q);
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
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">اختيار صوت القارئ (٣٢ قارئاً)</h3>
              <p className="text-[11px] text-stone-400">تلاوات خاشعة لجميع سور القرآن الكريم والرقية</p>
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
            placeholder="ابحث باسم القارئ..."
            className="w-full pl-8 pr-9 py-2 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-3.5 h-3.5 absolute right-3 top-2.5 text-stone-400" />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setFilterStyle('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              filterStyle === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
            }`}
          >
            الكل ({RECITERS.length})
          </button>
          <button
            onClick={() => setFilterStyle('murattal')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              filterStyle === 'murattal'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
            }`}
          >
            المصحف المرتل
          </button>
          <button
            onClick={() => setFilterStyle('mujawwad')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              filterStyle === 'mujawwad'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
            }`}
          >
            المصحف المجود
          </button>
          <button
            onClick={() => setFilterStyle('haramain')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              filterStyle === 'haramain'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
            }`}
          >
            أئمة الحرمين
          </button>
        </div>

        {/* Reciters List */}
        <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
          {filteredReciters.map((r) => {
            const isSelected = selectedReciter.id === r.id;
            return (
              <button
                key={r.id}
                onClick={() => {
                  onSelectReciter(r);
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
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold">{r.name}</h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">{r.subname}</p>
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

        <div className="mt-4 pt-3 border-t border-stone-200/50 dark:border-stone-800 text-center">
          <p className="text-[11px] text-stone-400">
            تلاوات رقمية نقية متوافقة مع كل آيات وسور المصحف الشريف
          </p>
        </div>
      </div>
    </div>
  );
}
