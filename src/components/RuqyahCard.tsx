import React, { useState } from 'react';
import {
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  BookOpen,
  Info,
  Copy,
  Bookmark,
  Share2,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { RuqyahItem, ThemeMode } from '../types';
import { playClickTone, playCompleteChime } from '../utils/audioUtils';

interface RuqyahCardProps {
  key?: string | number;
  item: RuqyahItem;
  currentCount: number;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onResetItem: (id: string) => void;
  fontSize: number;
  theme: ThemeMode;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  isPlayingThis: boolean;
  onPlayAudioItem: (item: RuqyahItem) => void;
  onStopAudio: () => void;
  soundEnabled: boolean;
}

export function RuqyahCard({
  item,
  currentCount,
  onIncrement,
  onDecrement,
  onResetItem,
  fontSize,
  theme,
  isBookmarked,
  onToggleBookmark,
  isPlayingThis,
  onPlayAudioItem,
  onStopAudio,
  soundEnabled,
}: RuqyahCardProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [copied, setCopied] = useState(false);

  const isCompleted = currentCount >= item.recommendedCount;
  const progressRatio = Math.min(1, currentCount / item.recommendedCount);

  const handleTap = () => {
    if (soundEnabled) {
      if (currentCount + 1 >= item.recommendedCount && currentCount < item.recommendedCount) {
        playCompleteChime();
      } else {
        playClickTone();
      }
    }
    onIncrement(item.id);
  };

  const handleCopy = () => {
    const textToCopy = `${item.title}\n\n${item.arabicText}\n\n${
      item.virtue ? `الفضيلة: ${item.virtue}` : ''
    }`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `${item.title}\n\n${item.arabicText}\n\n(من تطبيق الرقية الشرعية)`,
        });
      } catch {
        // Share cancelled or not supported
      }
    } else {
      handleCopy();
    }
  };

  return (
    <article
      id={`ruqyah-card-${item.id}`}
      className={`rounded-2xl border transition-all duration-200 relative overflow-hidden shadow-xs ${
        isCompleted
          ? theme === 'dark'
            ? 'bg-emerald-950/20 border-emerald-700/60 ring-1 ring-emerald-500/20'
            : theme === 'sepia'
            ? 'bg-emerald-900/5 border-emerald-600/40 ring-1 ring-emerald-600/20'
            : 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400/20'
          : theme === 'dark'
          ? 'bg-stone-800/90 border-stone-700/80 text-stone-100 hover:border-stone-600'
          : theme === 'sepia'
          ? 'bg-amber-50/80 border-amber-200/90 text-stone-800 hover:border-amber-300'
          : 'bg-white border-stone-200/90 text-stone-900 hover:border-emerald-200 shadow-sm'
      }`}
    >
      {/* Completion Indicator Accent Header Line */}
      {isCompleted && (
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400" />
      )}

      <div className="p-4 sm:p-5">
        {/* Card Header Top Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-stone-100 dark:border-stone-700/60">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                item.source === 'quran'
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                  : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
              }`}
            >
              {item.source === 'quran' ? (
                <>
                  <BookOpen className="w-3 h-3" />
                  <span>قرآن كريم</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3" />
                  <span>سنة نبوية</span>
                </>
              )}
            </span>

            {item.surahName && (
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                سورة {item.surahName}
                {item.ayahStart && (
                  <span className="font-mono mr-1">
                    [{item.ayahStart}
                    {item.ayahEnd && item.ayahEnd !== item.ayahStart ? ` - ${item.ayahEnd}` : ''}]
                  </span>
                )}
              </span>
            )}
          </div>

          {/* Action Icons (Bookmark, Copy, Share, Audio) */}
          <div className="flex items-center gap-1">
            {/* Audio Recitation button */}
            {item.audioAyahs && item.audioAyahs.length > 0 && (
              <button
                id={`card-audio-btn-${item.id}`}
                onClick={() => (isPlayingThis ? onStopAudio() : onPlayAudioItem(item))}
                className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
                  isPlayingThis
                    ? 'bg-emerald-600 text-white shadow-xs animate-pulse'
                    : 'text-stone-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-stone-700'
                }`}
                title={isPlayingThis ? 'إيقاف الاستماع' : 'استماع للتلاوة'}
                aria-label="استماع"
              >
                {isPlayingThis ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span className="text-[11px] font-bold hidden sm:inline">إيقاف</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span className="text-[11px] hidden sm:inline">تلاوة</span>
                  </>
                )}
              </button>
            )}

            {/* Bookmark button */}
            <button
              id={`card-bookmark-btn-${item.id}`}
              onClick={() => onToggleBookmark(item.id)}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                isBookmarked
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-stone-400 hover:text-amber-500 hover:bg-stone-100 dark:hover:bg-stone-700'
              }`}
              title={isBookmarked ? 'إزالة من المحفوظات' : 'حفظ في المفضلة'}
              aria-label="حفظ"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>

            {/* Copy button */}
            <button
              id={`card-copy-btn-${item.id}`}
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors text-xs"
              title="نسخ النص"
              aria-label="نسخ"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Share button */}
            <button
              id={`card-share-btn-${item.id}`}
              onClick={handleShare}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors text-xs"
              title="مشاركة الآية"
              aria-label="مشاركة"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card Title */}
        <h2 className="text-sm sm:text-base font-bold text-stone-800 dark:text-stone-100 mb-3 flex items-center gap-2">
          <span>{item.title}</span>
        </h2>

        {/* Quran / Sunnah Main Text Box */}
        <div
          className={`p-4 sm:p-6 rounded-2xl mb-4 text-center select-text transition-all leading-loose ${
            theme === 'dark'
              ? 'bg-stone-900/60 border border-stone-800'
              : theme === 'sepia'
              ? 'bg-amber-100/50 border border-amber-200/60 text-stone-900'
              : 'bg-stone-50/80 border border-stone-100 text-stone-900'
          }`}
        >
          <p
            className="font-quran whitespace-pre-line tracking-wide transition-all"
            style={{ fontSize: `${fontSize}px` }}
          >
            {item.arabicText}
          </p>
        </div>

        {/* Counter & Reading Controls Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Recommendation Note */}
          <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 order-2 sm:order-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>
              التكرار الموصى به:{' '}
              <strong className="text-emerald-700 dark:text-emerald-400 font-bold">
                {item.recommendedCount} {item.recommendedCount === 1 ? 'مرة' : 'مرات'}
              </strong>
            </span>
          </div>

          {/* Interactive Tap-To-Count Component */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end order-1 sm:order-2">
            {/* Minus Button */}
            {currentCount > 0 && (
              <button
                id={`card-decrement-btn-${item.id}`}
                onClick={() => onDecrement(item.id)}
                className="w-8 h-8 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center justify-center text-sm font-bold transition-all"
                title="إنقاص مرة"
              >
                -١
              </button>
            )}

            {/* Main Interactive Count Button */}
            <button
              id={`card-counter-btn-${item.id}`}
              onClick={handleTap}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-5 py-2.5 rounded-xl font-bold transition-all transform active:scale-95 shadow-xs ${
                isCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/40'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20'
              }`}
            >
              <span className="text-sm">
                {isCompleted ? 'أتممت القراءة ✓' : 'تلاوة / تكرار +١'}
              </span>

              {/* Progress Count Badge */}
              <div className="flex items-center gap-1 bg-black/20 px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold">
                <span>{currentCount}</span>
                <span className="opacity-60">/</span>
                <span>{item.recommendedCount}</span>
              </div>
            </button>

            {/* Reset Button */}
            {currentCount > 0 && (
              <button
                id={`card-reset-btn-${item.id}`}
                onClick={() => onResetItem(item.id)}
                className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-stone-700 transition-colors"
                title="إعادة تصفير"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar under card */}
        <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-700/60 rounded-full mt-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isCompleted
                ? 'bg-emerald-500'
                : 'bg-gradient-to-r from-emerald-600 to-teal-500'
            }`}
            style={{ width: `${progressRatio * 100}%` }}
          />
        </div>

        {/* Expandable Explanation & Virtue Drawer */}
        {(item.virtue || item.explanation || item.hadithSource) && (
          <div className="mt-3 pt-2">
            <button
              id={`card-info-toggle-${item.id}`}
              onClick={() => setShowInfo(!showInfo)}
              className="w-full flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400 py-1 hover:opacity-80 transition-opacity"
            >
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>فضيلة الآية وسياق الاستشفاء والتفسير</span>
              </span>
              {showInfo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showInfo && (
              <div
                className={`mt-2 p-3.5 rounded-xl text-xs space-y-2.5 transition-all leading-relaxed ${
                  theme === 'dark'
                    ? 'bg-stone-900/80 border border-stone-800 text-stone-300'
                    : theme === 'sepia'
                    ? 'bg-amber-100/70 border border-amber-200 text-stone-800'
                    : 'bg-emerald-50/60 border border-emerald-100 text-stone-700'
                }`}
              >
                {item.virtue && (
                  <div>
                    <strong className="text-emerald-800 dark:text-emerald-300 font-bold block mb-1">
                      🌿 الفضيلة والأثر الشرعي:
                    </strong>
                    <p>{item.virtue}</p>
                  </div>
                )}

                {item.explanation && (
                  <div>
                    <strong className="text-stone-700 dark:text-stone-300 font-bold block mb-1">
                      📖 المعنى والتدبر:
                    </strong>
                    <p>{item.explanation}</p>
                  </div>
                )}

                {item.hadithSource && (
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-emerald-200/40 dark:border-stone-700">
                    <span>المصدر: {item.hadithSource}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
