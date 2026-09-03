import { useState } from 'react';
import {
  Volume2,
  CheckCircle2,
  Bookmark,
  Share2,
  Copy,
  BookOpen,
  Sparkles,
  Info,
  Check,
  RotateCcw,
  X,
} from 'lucide-react';
import { RuqyahItem, ThemeMode } from '../types';

interface MushafViewProps {
  items: RuqyahItem[];
  itemCounts: Record<string, number>;
  onIncrement: (id: string) => void;
  fontSize: number;
  theme: ThemeMode;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  activePlayingItemId: string | null;
  onPlayItem: (item: RuqyahItem) => void;
}

export function MushafView({
  items,
  itemCounts,
  onIncrement,
  fontSize,
  theme,
  bookmarkedIds,
  onToggleBookmark,
  activePlayingItemId,
  onPlayItem,
}: MushafViewProps) {
  const [selectedItemForInfo, setSelectedItemForInfo] = useState<RuqyahItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (item: RuqyahItem) => {
    const text = `﴿${item.arabicText}﴾ [${item.title}]${
      item.virtue ? `\n\nالفضيلة: ${item.virtue}` : ''
    }${item.explanation ? `\n\nالشرح والتفسير: ${item.explanation}` : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isDark = theme === 'dark';

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4">
      {/* Decorative Medina Mushaf Frame Container */}
      <div
        className={`rounded-3xl p-4 sm:p-8 md:p-10 shadow-2xl transition-all border-4 relative ${
          isDark
            ? 'mushaf-paper-dark mushaf-gilded-frame-dark text-stone-100'
            : theme === 'sepia'
            ? 'mushaf-paper-sepia border-[#c09945] text-[#2b2416]'
            : 'mushaf-paper-cream mushaf-gilded-frame text-[#241e15]'
        }`}
      >
        {/* Ornate Corner Accents */}
        <div className="absolute top-2.5 right-2.5 text-amber-600/60 dark:text-amber-400/50 text-base select-none pointer-events-none">
          ❖
        </div>
        <div className="absolute top-2.5 left-2.5 text-amber-600/60 dark:text-amber-400/50 text-base select-none pointer-events-none">
          ❖
        </div>
        <div className="absolute bottom-2.5 right-2.5 text-amber-600/60 dark:text-amber-400/50 text-base select-none pointer-events-none">
          ❖
        </div>
        <div className="absolute bottom-2.5 left-2.5 text-amber-600/60 dark:text-amber-400/50 text-base select-none pointer-events-none">
          ❖
        </div>

        {/* Mushaf Header Title Bar */}
        <div
          className={`flex items-center justify-between pb-3 mb-6 border-b-2 text-xs sm:text-sm font-bold select-none ${
            isDark
              ? 'border-amber-600/30 text-amber-400/90'
              : 'border-[#c59b27]/40 text-[#8c6d1f]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-amber-600 text-xs">۞</span>
            <span className="font-serif">آيَاتُ الرُّقْيَةِ الشَّرْعِيَّةِ</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] opacity-70 tracking-widest font-serif">
            <span>⚜</span>
            <span>مِنَ القُرْآنِ الكَرِيمِ وَالسُّنَّةِ</span>
            <span>⚜</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-serif">عَدَدُ الأَوْرَادِ: {items.length}</span>
            <span className="text-amber-600 text-xs">۞</span>
          </div>
        </div>

        {/* Basmalah Header */}
        <div className="text-center my-6 select-none">
          <div
            className={`mx-auto max-w-sm p-3 rounded-2xl border-2 ${
              isDark
                ? 'bg-gradient-to-r from-amber-950/60 via-stone-900 to-amber-950/60 border-amber-600/50 shadow-lg'
                : 'bg-gradient-to-r from-[#f5ebd7] via-[#fffaf0] to-[#f5ebd7] border-[#c59b27] shadow-md'
            }`}
          >
            <p
              className={`font-quran text-xl sm:text-2xl font-bold ${
                isDark ? 'text-amber-300' : 'text-[#8a681c]'
              }`}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>
        </div>

        {/* Continuous Stream of Verses Styled as an Authentic Mushaf Flow */}
        <div className="space-y-8">
          {items.map((item, idx) => {
            const currentCount = itemCounts[item.id] || 0;
            const isCompleted = currentCount >= item.recommendedCount;
            const isPlaying = activePlayingItemId === item.id;
            const isBookmarked = bookmarkedIds.includes(item.id);

            return (
              <div
                key={item.id}
                id={`mushaf-item-${item.id}`}
                className={`p-4 sm:p-6 rounded-2xl border transition-all duration-200 relative ${
                  isPlaying
                    ? 'border-amber-500 bg-amber-100/40 dark:bg-amber-950/40 ring-2 ring-amber-500 shadow-md'
                    : isCompleted
                    ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-[#c59b27]/30 dark:border-stone-800 bg-[#fffdf7]/50 dark:bg-stone-900/40 hover:border-amber-400'
                }`}
              >
                {/* Item Header Banner */}
                <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#c59b27]/20 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#8a681c] dark:bg-amber-700 text-amber-50 text-xs font-bold font-serif flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 font-serif">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Audio Recitation Button */}
                    {item.audioAyahs && item.audioAyahs.length > 0 && (
                      <button
                        onClick={() => onPlayItem(item)}
                        className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                          isPlaying
                            ? 'bg-emerald-700 text-white'
                            : 'text-stone-600 dark:text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-stone-800'
                        }`}
                        title="استماع صوتي"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] hidden sm:inline">
                          {isPlaying ? 'يُتلى الآن' : 'استماع'}
                        </span>
                      </button>
                    )}

                    {/* Tafsir / Info */}
                    <button
                      onClick={() => setSelectedItemForInfo(item)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors"
                      title="الفضيلة والتفسير"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>

                    {/* Bookmark */}
                    <button
                      onClick={() => onToggleBookmark(item.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isBookmarked ? 'text-amber-500' : 'text-stone-400 hover:text-amber-500'
                      }`}
                      title="حفظ في المفضلة"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                    </button>

                    {/* Copy */}
                    <button
                      onClick={() => handleCopy(item)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                      title="نسخ الآية"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Repetition Counter */}
                    <button
                      onClick={() => onIncrement(item.id)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                        isCompleted
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 hover:bg-amber-200'
                      }`}
                      title="تكرار الورد"
                    >
                      <span>تكرار</span>
                      <span className="font-mono">
                        ({currentCount}/{item.recommendedCount})
                      </span>
                    </button>
                  </div>
                </div>

                {/* Arabic Quranic Ayah Text */}
                <div className="py-2 text-center select-text">
                  <p
                    className="font-quran leading-loose text-stone-900 dark:text-stone-100"
                    style={{ fontSize: `${fontSize + 3}px` }}
                  >
                    {item.arabicText}{' '}
                    <span className="ayah-badge-mushaf inline-block">
                      <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#c59b27] text-[11px] font-bold bg-[#fffaf0] text-[#735414] dark:bg-stone-800 dark:text-amber-400 select-none">
                        {idx + 1}
                      </span>
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Mushaf Footer Medallion */}
        <div className="mt-10 pt-4 border-t-2 border-[#c59b27]/30 text-center select-none">
          <div className="inline-flex items-center justify-center gap-2 px-6 py-1.5 rounded-full border border-amber-600/50 bg-[#fbf7ed] dark:bg-stone-800 shadow-xs">
            <span className="text-amber-600 text-xs">❖</span>
            <span className="text-xs font-bold font-serif text-amber-900 dark:text-amber-300">
              تَمَّتْ آيَاتُ الرُّقْيَةِ الشَّرْعِيَّةِ بِحَمْدِ اللَّهِ
            </span>
            <span className="text-amber-600 text-xs">❖</span>
          </div>
        </div>
      </div>

      {/* Info & Tafsir Modal */}
      {selectedItemForInfo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-amber-500/30 p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span>{selectedItemForInfo.title}</span>
              </h3>
              <button
                onClick={() => setSelectedItemForInfo(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-stone-800 border border-amber-200/60 dark:border-stone-700 text-center">
              <p className="font-quran text-lg text-stone-900 dark:text-stone-100">
                ﴿{selectedItemForInfo.arabicText}﴾
              </p>
            </div>

            {selectedItemForInfo.virtue && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                  ✨ فضل الآية وبركتها:
                </h4>
                <p className="text-xs leading-relaxed text-stone-700 dark:text-stone-300">
                  {selectedItemForInfo.virtue}
                </p>
              </div>
            )}

            {selectedItemForInfo.explanation && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400">
                  📖 الشرح والتفسير:
                </h4>
                <p className="text-xs leading-relaxed text-stone-700 dark:text-stone-300">
                  {selectedItemForInfo.explanation}
                </p>
              </div>
            )}

            {selectedItemForInfo.hadithSource && (
              <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-200 dark:border-stone-800">
                📚 المرجع: {selectedItemForInfo.hadithSource}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
