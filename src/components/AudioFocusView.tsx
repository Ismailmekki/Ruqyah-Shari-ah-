import { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Repeat,
  Moon,
  Volume2,
  Clock,
  Sparkles,
  User,
  HeartHandshake,
} from 'lucide-react';
import { Reciter, RuqyahItem, ThemeMode } from '../types';
import { RECITERS } from '../data/recitersData';

interface AudioFocusViewProps {
  currentItem: RuqyahItem | null;
  items: RuqyahItem[];
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  reciter: Reciter;
  onSelectReciter: (r: Reciter) => void;
  repeatMode: 'none' | 'item' | 'all';
  onToggleRepeat: () => void;
  playbackRate: number;
  onChangePlaybackRate: (rate: number) => void;
  progress: number;
  duration: number;
  onSeek: (seconds: number) => void;
  theme: ThemeMode;
  onSelectItem: (item: RuqyahItem) => void;
}

export function AudioFocusView({
  currentItem,
  items,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  reciter,
  onSelectReciter,
  repeatMode,
  onToggleRepeat,
  playbackRate,
  onChangePlaybackRate,
  progress,
  duration,
  onSeek,
  theme,
  onSelectItem,
}: AudioFocusViewProps) {
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimeRemaining, setSleepTimeRemaining] = useState<number | null>(null);
  const [showSleepTimerMenu, setShowSleepTimerMenu] = useState(false);

  // Sleep timer countdown logic
  useEffect(() => {
    if (sleepTimerMinutes === null) {
      setSleepTimeRemaining(null);
      return;
    }

    setSleepTimeRemaining(sleepTimerMinutes * 60);

    const interval = setInterval(() => {
      setSleepTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          if (isPlaying) {
            onTogglePlay();
          }
          setSleepTimerMinutes(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerMinutes, isPlaying, onTogglePlay]);

  const formatTimerRemaining = (seconds: number | null) => {
    if (seconds === null) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentItem) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <Sparkles className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
        <h3 className="text-lg font-bold mb-2">جلسة الاستماع والسكينة</h3>
        <p className="text-xs text-stone-500 mb-6">
          اضغط الزر أدناه لبدء تشغيل الرقية الشرعية كاملة بصوت القارئ
        </p>
        <button
          onClick={() => items[0] && onSelectItem(items[0])}
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-600/30"
        >
          بدء الاستماع للرقية من البداية
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div
        className={`rounded-3xl border p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-all ${
          theme === 'dark'
            ? 'bg-gradient-to-b from-stone-900 to-stone-950 border-stone-800 text-stone-100'
            : theme === 'sepia'
            ? 'bg-gradient-to-b from-amber-50 to-[#f6ede0] border-amber-200 text-stone-900'
            : 'bg-gradient-to-b from-emerald-50/60 to-white border-emerald-100 text-stone-900'
        }`}
      >
        {/* Spiritual Ambient Glow Circles */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Controls: Sleep Timer & Reciter Switcher */}
        <div className="flex items-center justify-between gap-3 mb-8 relative z-10">
          {/* Reciter Selector */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            <select
              value={reciter.id}
              onChange={(e) => {
                const found = RECITERS.find((r) => r.id === e.target.value);
                if (found) onSelectReciter(found);
              }}
              className="text-xs font-semibold py-1.5 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white/80 dark:bg-stone-800/80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sleep Timer */}
          <div className="relative">
            <button
              onClick={() => setShowSleepTimerMenu(!showSleepTimerMenu)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all ${
                sleepTimerMinutes !== null
                  ? 'bg-emerald-600 text-white border-emerald-700 font-bold animate-pulse'
                  : 'border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title="مؤقت إيقاف التشغيل قبل النوم"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>
                {sleepTimerMinutes !== null
                  ? `مؤقت: ${formatTimerRemaining(sleepTimeRemaining)}`
                  : 'مؤقت النوم'}
              </span>
            </button>

            {showSleepTimerMenu && (
              <div
                className={`absolute left-0 mt-2 w-44 p-2 rounded-2xl shadow-xl border z-50 ${
                  theme === 'dark'
                    ? 'bg-stone-800 border-stone-700 text-stone-100'
                    : 'bg-white border-stone-200 text-stone-800'
                }`}
              >
                <div className="text-[11px] font-semibold text-stone-400 mb-1.5 px-2">
                  إيقاف التشغيل بعد:
                </div>
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      setSleepTimerMinutes(mins);
                      setShowSleepTimerMenu(false);
                    }}
                    className={`w-full text-right px-2.5 py-1.5 rounded-lg text-xs font-semibold mb-1 flex items-center justify-between ${
                      sleepTimerMinutes === mins
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'hover:bg-stone-100 dark:hover:bg-stone-700'
                    }`}
                  >
                    <span>{mins} دقيقة</span>
                    {sleepTimerMinutes === mins && <span>✓</span>}
                  </button>
                ))}
                {sleepTimerMinutes !== null && (
                  <button
                    onClick={() => {
                      setSleepTimerMinutes(null);
                      setShowSleepTimerMenu(false);
                    }}
                    className="w-full text-right px-2.5 py-1.5 rounded-lg text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-stone-700"
                  >
                    إلغاء المؤقت
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center Breathing Aura & Active Verse Title */}
        <div className="text-center my-6 relative z-10">
          <div className="relative inline-block mb-4">
            <div
              className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center border-4 transition-all duration-700 mx-auto ${
                isPlaying
                  ? 'border-emerald-500 bg-emerald-500/10 scale-105 shadow-2xl shadow-emerald-500/20 animate-pulse'
                  : 'border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800'
              }`}
            >
              <div className="text-center p-2">
                <Sparkles className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block">
                  {isPlaying ? 'تلاوة خاشعة' : 'متوقف مؤقتاً'}
                </span>
              </div>
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-stone-800 dark:text-stone-100 mb-1">
            {currentItem.title}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            بصوت {reciter.name}
          </p>
        </div>

        {/* Large Quran Script Display Box */}
        <div
          className={`p-6 sm:p-8 rounded-3xl mb-8 text-center leading-loose transition-all shadow-inner relative z-10 ${
            theme === 'dark'
              ? 'bg-stone-900/90 border border-stone-800'
              : theme === 'sepia'
              ? 'bg-amber-100/60 border border-amber-200/80'
              : 'bg-white border border-emerald-100'
          }`}
        >
          <p className="font-quran text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 leading-relaxed">
            {currentItem.arabicText}
          </p>
        </div>

        {/* Virtue & Healing Context Accordion/Box */}
        {currentItem.virtue && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-xs text-stone-700 dark:text-stone-300 relative z-10">
            <strong className="text-emerald-800 dark:text-emerald-300 block mb-1">
              🌿 فضل الآية وسياق الاستشفاء:
            </strong>
            <p>{currentItem.virtue}</p>
          </div>
        )}

        {/* Audio Progress Seeker */}
        <div className="space-y-1 mb-6 relative z-10">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={progress || 0}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full accent-emerald-600 h-2 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-mono text-stone-400">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Listening Controls */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 relative z-10">
          {/* Repeat Mode */}
          <button
            onClick={onToggleRepeat}
            className={`p-3 rounded-2xl border transition-all ${
              repeatMode !== 'none'
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-bold'
                : 'border-stone-300 dark:border-stone-700 text-stone-400 hover:text-stone-600'
            }`}
            title="تكرار الآية"
          >
            <Repeat className="w-5 h-5" />
          </button>

          {/* Prev */}
          <button
            onClick={onPrev}
            className="p-3 rounded-2xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="المقطع السابق"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          {/* Main Play / Pause Button */}
          <button
            onClick={onTogglePlay}
            className="w-16 h-16 rounded-3xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xl shadow-emerald-600/40 active:scale-95 transition-all"
            title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 translate-x-[-2px]" />}
          </button>

          {/* Next */}
          <button
            onClick={onNext}
            className="p-3 rounded-2xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="المقطع التالي"
          >
            <SkipForward className="w-6 h-6" />
          </button>

          {/* Speed Selector */}
          <button
            onClick={() => {
              const speeds = [0.75, 1.0, 1.25];
              const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
              onChangePlaybackRate(speeds[nextIdx]);
            }}
            className="p-3 rounded-2xl border border-stone-300 dark:border-stone-700 text-xs font-mono font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="تغيير السرعة"
          >
            {playbackRate}x
          </button>
        </div>
      </div>
    </div>
  );
}
