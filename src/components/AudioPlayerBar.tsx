import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Repeat,
  Headphones,
  User,
  Gauge,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Reciter, RuqyahItem, ThemeMode } from '../types';
import { RECITERS } from '../data/recitersData';
import { QURAN_SURAHS } from '../data/quranSurahsData';

interface AudioPlayerBarProps {
  isPlaying: boolean;
  isBuffering?: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  // Either ruqyah item or quran ayah info
  currentItem: RuqyahItem | null;
  currentAyahIndex: number;
  totalAyahsInItem: number;
  quranPlayingRef: { surah: number; ayah: number } | null;
  // Reciter & controls
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
  onOpenFocusMode: () => void;
  onOpenQuranReader?: (surah: number) => void;
}

export function AudioPlayerBar({
  isPlaying,
  isBuffering = false,
  onTogglePlay,
  onNext,
  onPrev,
  currentItem,
  currentAyahIndex,
  totalAyahsInItem,
  quranPlayingRef,
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
  onOpenFocusMode,
  onOpenQuranReader,
}: AudioPlayerBarProps) {
  const [showReciterMenu, setShowReciterMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // If nothing is playing / queued, don't show the bar
  if (!currentItem && !quranPlayingRef) return null;

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    onSeek(newTime);
  };

  const currentSurahMeta = quranPlayingRef
    ? QURAN_SURAHS.find((s) => s.number === quranPlayingRef.surah)
    : null;

  const displayTitle = quranPlayingRef
    ? `سورة ${currentSurahMeta?.name || quranPlayingRef.surah} • الآية ${quranPlayingRef.ayah}`
    : currentItem?.title || 'تلاوة مباركة';

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 border-t shadow-2xl backdrop-blur-lg transition-all ${
        theme === 'dark'
          ? 'bg-stone-900/95 border-stone-800 text-stone-100'
          : theme === 'sepia'
          ? 'bg-amber-50/95 border-amber-200/90 text-stone-900'
          : 'bg-white/95 border-stone-200 text-stone-900'
      }`}
    >
      {/* Top Seeker Progress Line */}
      <div className="relative w-full h-1.5 bg-stone-200 dark:bg-stone-800 cursor-pointer group">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={progress || 0}
          onChange={handleSeekChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div
          className="h-full bg-emerald-600 relative transition-all duration-150"
          style={{ width: `${duration > 0 ? (progress / duration) * 100 : 0}%` }}
        >
          <div className="absolute right-0 -top-1 w-3 h-3 bg-emerald-700 border-2 border-white rounded-full shadow-xs opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Active Audio Info */}
        <div className="flex items-center gap-3 min-w-[200px] flex-1">
          <button
            onClick={() => {
              if (quranPlayingRef && onOpenQuranReader) {
                onOpenQuranReader(quranPlayingRef.surah);
              } else {
                onOpenFocusMode();
              }
            }}
            className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center hover:scale-105 transition-transform shrink-0"
            title="فتح السورة أو وضع الاستماع"
          >
            {quranPlayingRef ? <BookOpen className="w-5 h-5" /> : <Headphones className="w-5 h-5 animate-pulse" />}
          </button>
          <div className="truncate">
            <h4 className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-100 truncate">
              {displayTitle}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold truncate">
                {reciter.name.replace('الشيخ ', '')}
              </span>
              {!quranPlayingRef && totalAyahsInItem > 1 && (
                <span className="font-mono bg-stone-100 dark:bg-stone-800 px-1.5 py-0.2 rounded text-[10px]">
                  الآية {currentAyahIndex + 1}/{totalAyahsInItem}
                </span>
              )}
              {quranPlayingRef && currentSurahMeta && (
                <span className="font-mono bg-stone-100 dark:bg-stone-800 px-1.5 py-0.2 rounded text-[10px]">
                  {quranPlayingRef.ayah}/{currentSurahMeta.numberOfAyahs}
                </span>
              )}
              <span className="font-mono text-[10px]">
                {formatTime(progress)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Center Main Audio Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Repeat Button */}
          <button
            id="audio-repeat-btn"
            onClick={onToggleRepeat}
            className={`p-2 rounded-xl text-xs transition-colors relative ${
              repeatMode !== 'none'
                ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
            }`}
            title={
              repeatMode === 'item'
                ? 'تكرار الآية فقط'
                : repeatMode === 'all'
                ? 'تكرار مستمر للسورة / الرقية'
                : 'بدون تكرار'
            }
          >
            <Repeat className="w-4 h-4" />
            {repeatMode === 'item' && (
              <span className="absolute -top-1 -right-1 text-[9px] bg-emerald-600 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">
                ١
              </span>
            )}
            {repeatMode === 'all' && (
              <span className="absolute -top-1 -right-1 text-[9px] bg-teal-600 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">
                ∞
              </span>
            )}
          </button>

          {/* Previous Ayah */}
          <button
            id="audio-prev-btn"
            onClick={onPrev}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="الآية السابقة"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* Main Play / Pause */}
          <button
            id="audio-main-play-btn"
            onClick={onTogglePlay}
            className="w-12 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
            title={isBuffering ? 'جاري تحميل الصوت...' : isPlaying ? 'إيقاف مؤقت' : 'متابعة الاستماع'}
          >
            {isBuffering ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 translate-x-[-1px]" />
            )}
          </button>

          {/* Next Ayah */}
          <button
            id="audio-next-btn"
            onClick={onNext}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="الآية التالية"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          {/* Focus Mode button */}
          <button
            id="audio-focus-open-btn"
            onClick={onOpenFocusMode}
            className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-stone-800 transition-colors text-xs flex items-center gap-1 font-semibold hidden sm:flex"
            title="شاشة الاستماع الكاملة والسكينة"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden md:inline">السكينة</span>
          </button>
        </div>

        {/* Right Settings (Reciter & Speed) */}
        <div className="flex items-center gap-1.5">
          {/* Playback Rate Dropdown */}
          <div className="relative">
            <button
              id="audio-speed-btn"
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 text-xs font-mono font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1"
              title="سرعة التلاوة"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>{playbackRate}x</span>
            </button>

            {showSpeedMenu && (
              <div
                className={`absolute left-0 bottom-full mb-2 w-28 p-1.5 rounded-xl shadow-lg border z-50 ${
                  theme === 'dark'
                    ? 'bg-stone-800 border-stone-700 text-stone-100'
                    : 'bg-white border-stone-200 text-stone-800'
                }`}
              >
                {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      onChangePlaybackRate(rate);
                      setShowSpeedMenu(false);
                    }}
                    className={`w-full text-right px-2 py-1 text-xs rounded-lg font-mono flex items-center justify-between ${
                      playbackRate === rate
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 font-bold'
                        : 'hover:bg-stone-100 dark:hover:bg-stone-700'
                    }`}
                  >
                    <span>{rate}x</span>
                    {playbackRate === rate && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reciter Selector Dropdown */}
          <div className="relative">
            <button
              id="audio-reciter-btn"
              onClick={() => setShowReciterMenu(!showReciterMenu)}
              className="p-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-xs flex items-center gap-1"
              title="اختيار القارئ"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs font-medium truncate max-w-[80px]">
                {reciter.name.split(' ')[1] || reciter.name}
              </span>
            </button>

            {showReciterMenu && (
              <div
                className={`absolute left-0 bottom-full mb-2 w-64 p-2 rounded-2xl shadow-xl border z-50 max-h-64 overflow-y-auto ${
                  theme === 'dark'
                    ? 'bg-stone-800 border-stone-700 text-stone-100'
                    : 'bg-white border-stone-200 text-stone-800'
                }`}
              >
                <div className="text-xs font-semibold text-stone-400 mb-1.5 px-2">
                  اختر صوت القارئ (٣٢ قارئاً)
                </div>
                {RECITERS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      onSelectReciter(r);
                      setShowReciterMenu(false);
                    }}
                    className={`w-full text-right p-2 rounded-xl text-xs flex items-center justify-between mb-1 transition-colors ${
                      reciter.id === r.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-800'
                        : 'hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{r.name}</div>
                      <div className="text-[10px] text-stone-400">{r.subname}</div>
                    </div>
                    {reciter.id === r.id && (
                      <span className="text-emerald-600 font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
