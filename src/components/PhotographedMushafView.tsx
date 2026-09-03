import { useState, useEffect, useRef, useMemo } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Volume2,
  Bookmark,
  Sparkles,
  BookOpen,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Moon,
  Sun,
  Layers,
  FileText,
  Info,
  Play,
  Pause,
  Check,
  X,
  Search,
  List,
  Radio,
  SkipForward,
  SkipBack,
  Navigation,
  Headphones,
} from 'lucide-react';
import {
  QuranMushafPageData,
  QuranMushafPageAyah,
  Reciter,
  ThemeMode,
} from '../types';
import { QURAN_SURAHS, SurahMeta, TAFSIR_TRANSLATION_EDITIONS } from '../data/quranSurahsData';
import { fetchMushafPageWithEdition, getAyahPageNumber } from '../utils/quranApi';
import { playClickTone, playCompleteChime } from '../utils/audioUtils';

interface PhotographedMushafViewProps {
  initialPage?: number;
  currentSurahNumber: number;
  onSelectSurah: (num: number) => void;
  reciter: Reciter;
  onOpenReciterModal: () => void;
  tafsirEdition: string;
  onOpenTafsirModal: () => void;
  fontSize: number;
  theme: ThemeMode;
  onOpenSurahList: () => void;
  activePlayingAyah: { surah: number; ayah: number } | null;
  isPlaying: boolean;
  isAudioBuffering?: boolean;
  onPlayAyah: (surah: number, ayah: number) => void;
  onTogglePlay: () => void;
  soundEnabled: boolean;
  onNextAyah?: () => void;
  onPrevAyah?: () => void;
  audioProgress?: number;
  audioDuration?: number;
}

export function PhotographedMushafView({
  initialPage,
  currentSurahNumber,
  onSelectSurah,
  reciter,
  onOpenReciterModal,
  tafsirEdition,
  onOpenTafsirModal,
  fontSize,
  theme,
  onOpenSurahList,
  activePlayingAyah,
  isPlaying,
  isAudioBuffering = false,
  onPlayAyah,
  onTogglePlay,
  soundEnabled,
  onNextAyah,
  onPrevAyah,
  audioProgress = 0,
  audioDuration = 0,
}: PhotographedMushafViewProps) {
  // Page number state (1 - 604)
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (initialPage && initialPage >= 1 && initialPage <= 604) return initialPage;
    const surah = QURAN_SURAHS.find((s) => s.number === currentSurahNumber);
    return surah ? surah.pageStart : 1;
  });

  // Display mode: 'scanned' (المصحف المصور الحقيقي) or 'clean_text' (نص عثماني نقي بدون زخارف)
  const [viewMode, setViewMode] = useState<'scanned' | 'clean_text'>('scanned');

  // Auto-follow reciter toggle (مؤشر التلاوة التلقائي مع القارئ)
  const [autoFollowReciter, setAutoFollowReciter] = useState<boolean>(true);

  // Scanned page image zoom level: 100%, 120%, 140%
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isNightFilter, setIsNightFilter] = useState<boolean>(() => theme === 'dark');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Image loading & fallback management
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [imageSourceIndex, setImageSourceIndex] = useState<number>(0);

  // Data for the current page (verses, tafsir, surah info)
  const [pageData, setPageData] = useState<QuranMushafPageData | null>(null);
  const [loadingPageData, setLoadingPageData] = useState<boolean>(false);
  const [showPageAyahsList, setShowPageAyahsList] = useState<boolean>(false);

  // Quick jump modal
  const [showJumpModal, setShowJumpModal] = useState<boolean>(false);
  const [jumpInputValue, setJumpInputValue] = useState<string>('');

  // Selected ayah for Tafsir popup
  const [selectedAyahForTafsir, setSelectedAyahForTafsir] = useState<QuranMushafPageAyah | null>(null);

  // Saved bookmarked pages
  const [savedBookmarks, setSavedBookmarks] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('quran_mushaf_saved_pages');
      return saved ? JSON.parse(saved) : [1];
    } catch {
      return [1];
    }
  });

  // Helper to format 3-digit page number: 1 -> "001", 45 -> "045", 604 -> "604"
  const padPage = (page: number) => String(page).padStart(3, '0');

  // Candidate CDN image sources for the scanned Medina Mushaf
  const imageSources = useMemo(() => {
    const padded = padPage(currentPage);
    return [
      `https://android.quran.com/data/width_1260/page${padded}.png`,
      `https://quran.ksu.edu.sa/png_big/${currentPage}.png`,
      `https://raw.githubusercontent.com/thetruereality/Quran-App/master/app/src/main/assets/pages/page${currentPage}.png`,
    ];
  }, [currentPage]);

  const currentImageUrl = imageSources[imageSourceIndex] || imageSources[0];

  // Surah meta for current page
  const pageSurah = useMemo(() => {
    const s = QURAN_SURAHS.slice().reverse().find((item) => item.pageStart <= currentPage);
    return s || QURAN_SURAHS[0];
  }, [currentPage]);

  // Current Tafsir edition meta
  const currentEditionMeta = useMemo(() => {
    return (
      TAFSIR_TRANSLATION_EDITIONS.find((e) => e.identifier === tafsirEdition) ||
      TAFSIR_TRANSLATION_EDITIONS[0]
    );
  }, [tafsirEdition]);

  // Sync night filter when global theme changes
  useEffect(() => {
    if (theme === 'dark') setIsNightFilter(true);
  }, [theme]);

  // Reset image loading state on page change
  useEffect(() => {
    setImageLoading(true);
    setImageSourceIndex(0);

    // Prefetch next and previous page images into browser cache for instant flipping
    const nextPage = currentPage < 604 ? currentPage + 1 : null;
    const prevPage = currentPage > 1 ? currentPage - 1 : null;

    if (nextPage) {
      const imgNext = new Image();
      imgNext.src = `https://android.quran.com/data/width_1260/page${padPage(nextPage)}.png`;
    }
    if (prevPage) {
      const imgPrev = new Image();
      imgPrev.src = `https://android.quran.com/data/width_1260/page${padPage(prevPage)}.png`;
    }
  }, [currentPage]);

  // Fetch page text data (for ayah list, audio and tafsir)
  useEffect(() => {
    let isCancelled = false;
    setLoadingPageData(true);

    fetchMushafPageWithEdition(currentPage, tafsirEdition)
      .then((data) => {
        if (!isCancelled) {
          setPageData(data);
          setLoadingPageData(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error('Failed to load page text:', err);
          setLoadingPageData(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [currentPage, tafsirEdition]);

  // When currentSurahNumber prop changes, jump to its starting page
  useEffect(() => {
    const targetSurah = QURAN_SURAHS.find((s) => s.number === currentSurahNumber);
    if (targetSurah && targetSurah.pageStart !== currentPage) {
      setCurrentPage(targetSurah.pageStart);
    }
  }, [currentSurahNumber]);

  // AUTO-FOLLOW RECITER: When playing Ayah changes and audio is not buffering, auto-flip the page to match reciter
  useEffect(() => {
    if (!autoFollowReciter || !activePlayingAyah || !isPlaying || isAudioBuffering) return;

    let isCancelled = false;
    getAyahPageNumber(activePlayingAyah.surah, activePlayingAyah.ayah).then((targetPage) => {
      if (!isCancelled && targetPage && targetPage >= 1 && targetPage <= 604) {
        if (targetPage !== currentPage) {
          setCurrentPage(targetPage);
        }
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [activePlayingAyah, isPlaying, isAudioBuffering, autoFollowReciter, currentPage]);

  // Auto-scroll to active playing ayah in Clean Text mode
  useEffect(() => {
    if (viewMode === 'clean_text' && activePlayingAyah && isPlaying) {
      const el = document.getElementById(
        `clean-ayah-${activePlayingAyah.surah}-${activePlayingAyah.ayah}`
      );
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activePlayingAyah, viewMode, isPlaying]);

  // Details for currently playing Ayah
  const currentlyRecitingAyah = useMemo(() => {
    if (!activePlayingAyah) return null;
    const surahMeta = QURAN_SURAHS.find((s) => s.number === activePlayingAyah.surah);
    const inPageAyah = pageData?.ayahs.find(
      (a) => a.surahNumber === activePlayingAyah.surah && a.numberInSurah === activePlayingAyah.ayah
    );
    return {
      surah: activePlayingAyah.surah,
      ayah: activePlayingAyah.ayah,
      surahName: surahMeta?.name || `سورة ${activePlayingAyah.surah}`,
      text: inPageAyah?.text || '',
      tafsir: inPageAyah?.tafsir,
      translation: inPageAyah?.translation,
      maxAyahs: surahMeta?.numberOfAyahs || 7,
    };
  }, [activePlayingAyah, pageData]);

  // Navigate to previous page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      if (soundEnabled) playClickTone();
      setCurrentPage((p) => p - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Navigate to next page
  const handleNextPage = () => {
    if (currentPage < 604) {
      if (soundEnabled) playClickTone();
      setCurrentPage((p) => p + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Jump to specific page
  const handleJumpToPage = (num: number) => {
    const safe = Math.max(1, Math.min(604, num));
    if (soundEnabled) playClickTone();
    setCurrentPage(safe);
    setShowJumpModal(false);
    setJumpInputValue('');
  };

  // Toggle bookmark for current page
  const handleToggleBookmarkCurrentPage = () => {
    if (soundEnabled) playCompleteChime();
    setSavedBookmarks((prev) => {
      const next = prev.includes(currentPage)
        ? prev.filter((p) => p !== currentPage)
        : [...prev, currentPage].sort((a, b) => a - b);
      try {
        localStorage.setItem('quran_mushaf_saved_pages', JSON.stringify(next));
      } catch {
        // full
      }
      return next;
    });
  };

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Handle image loading error (fallback to next CDN)
  const handleImageError = () => {
    if (imageSourceIndex < imageSources.length - 1) {
      setImageSourceIndex((prev) => prev + 1);
    } else {
      // If all image CDNs fail, fallback smoothly to clean text mode
      setImageLoading(false);
      setViewMode('clean_text');
    }
  };

  // Play audio for the first ayah of this page
  const handlePlayCurrentPageAudio = () => {
    if (pageData && pageData.ayahs.length > 0) {
      const firstAyah = pageData.ayahs[0];
      onPlayAyah(firstAyah.surahNumber, firstAyah.numberInSurah);
    } else {
      onPlayAyah(pageSurah.number, 1);
    }
  };

  // Step to Next Ayah
  const handleStepNextAyah = () => {
    if (onNextAyah) {
      onNextAyah();
    } else if (activePlayingAyah) {
      const meta = QURAN_SURAHS.find((s) => s.number === activePlayingAyah.surah);
      const max = meta ? meta.numberOfAyahs : 7;
      if (activePlayingAyah.ayah < max) {
        onPlayAyah(activePlayingAyah.surah, activePlayingAyah.ayah + 1);
      } else if (activePlayingAyah.surah < 114) {
        onPlayAyah(activePlayingAyah.surah + 1, 1);
      }
    }
  };

  // Step to Prev Ayah
  const handleStepPrevAyah = () => {
    if (onPrevAyah) {
      onPrevAyah();
    } else if (activePlayingAyah) {
      if (activePlayingAyah.ayah > 1) {
        onPlayAyah(activePlayingAyah.surah, activePlayingAyah.ayah - 1);
      } else if (activePlayingAyah.surah > 1) {
        const prevMeta = QURAN_SURAHS.find((s) => s.number === activePlayingAyah.surah - 1);
        onPlayAyah(activePlayingAyah.surah - 1, prevMeta?.numberOfAyahs || 1);
      }
    }
  };

  const isCurrentPageBookmarked = savedBookmarks.includes(currentPage);
  const currentJuzNumber = pageData?.juzNumber || pageSurah.juzStart;

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto py-3 px-2 sm:px-4">
      {/* ========================================================================= */}
      {/* 🔴 REAL-TIME RECITER FOLLOWER & CURSOR HUD (مؤشر التلاوة المباشر مع القارئ) */}
      {/* ========================================================================= */}
      {activePlayingAyah && isPlaying && (
        <div className="mb-4 p-3.5 sm:p-4 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white shadow-xl border border-emerald-600/40 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-emerald-700/50">
            {/* Reciter & Live Indicator */}
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping absolute opacity-75" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 relative" />
              </div>
              <span className="text-xs font-bold text-emerald-200 flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5 text-emerald-300" />
                <span>مؤشر التلاوة المباشر: {reciter.name}</span>
              </span>
            </div>

            {/* Auto-Follow Toggle */}
            <button
              onClick={() => setAutoFollowReciter((prev) => !prev)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                autoFollowReciter
                  ? 'bg-emerald-600/90 text-white ring-1 ring-emerald-300 shadow-xs'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
              }`}
              title="مزامنة وتقليب صفحات المصحف تلقائياً مع تسلسل القارئ"
            >
              <Navigation className="w-3 h-3" />
              <span>{autoFollowReciter ? '📍 التتبع التلقائي مفعل' : '📍 تتبع القارئ متوقف'}</span>
            </button>
          </div>

          {/* Current Ayah Tracking Card */}
          <div className="mt-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-emerald-700/80 text-[11px] font-bold text-emerald-100">
                  سورة {currentlyRecitingAyah?.surahName}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-[11px] font-bold text-amber-300 border border-amber-400/30">
                  الآية {activePlayingAyah.ayah} من {currentlyRecitingAyah?.maxAyahs}
                </span>
                {isAudioBuffering ? (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/30 text-[10px] text-amber-200 font-bold animate-pulse">
                    جاري التحميل...
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-300/80">
                    (صفحة {currentPage})
                  </span>
                )}
              </div>

              {currentlyRecitingAyah?.text ? (
                <p className="font-quran text-base sm:text-lg text-amber-100 font-bold leading-relaxed pt-1">
                  ﴿{currentlyRecitingAyah.text}﴾
                </p>
              ) : (
                <p className="text-xs text-emerald-200/80 italic pt-1">
                  جاري تلاوة الآية {activePlayingAyah.ayah}...
                </p>
              )}
            </div>

            {/* Fast Control Buttons */}
            <div className="flex items-center gap-1.5 self-center md:self-auto bg-emerald-950/60 p-1.5 rounded-2xl border border-emerald-700/40">
              <button
                onClick={handleStepNextAyah}
                className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors"
                title="الآية التالية"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={onTogglePlay}
                className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-xs transition-colors"
                title={isPlaying ? 'إيقاف مؤقت' : 'استئناف'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={handleStepPrevAyah}
                className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors"
                title="الآية السابقة"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => onPlayAyah(activePlayingAyah.surah, activePlayingAyah.ayah)}
                className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors"
                title="إعادة قراءة الآية الحالية"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Controls Toolbar */}
      <div className="mb-4 p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
        {/* Mode Selector (المصحف المصور vs نص عثماني نقي) */}
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('scanned')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'scanned'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>المصحف المصور (صفحات المدينة)</span>
          </button>
          <button
            onClick={() => setViewMode('clean_text')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'clean_text'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>نص عثماني نقي (بدون زخارف)</span>
          </button>
        </div>

        {/* Action Tools */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Quick Page Jump Button */}
          <button
            onClick={() => setShowJumpModal(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-700/60 text-amber-900 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1 shadow-2xs"
          >
            <Search className="w-3.5 h-3.5 text-amber-600" />
            <span>صفحة {currentPage}</span>
          </button>

          {/* Bookmark Current Page */}
          <button
            onClick={handleToggleBookmarkCurrentPage}
            className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
              isCurrentPageBookmarked
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100'
            }`}
            title={isCurrentPageBookmarked ? 'الصفحة محفوظة في الفواصل' : 'حفظ فاصلة عند هذه الصفحة'}
          >
            <Bookmark className={`w-4 h-4 ${isCurrentPageBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>

          {/* Night Filter for Images */}
          {viewMode === 'scanned' && (
            <button
              onClick={() => setIsNightFilter((prev) => !prev)}
              className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                isNightFilter
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100'
              }`}
              title={isNightFilter ? 'إيقاف الوضع الليلي للمصحف' : 'تفعيل الوضع الليلي المريح للعين'}
            >
              {isNightFilter ? <Moon className="w-4 h-4 text-indigo-500" /> : <Sun className="w-4 h-4" />}
            </button>
          )}

          {/* Zoom controls (Only in Scanned Mode) */}
          {viewMode === 'scanned' && (
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-0.5 border border-stone-200 dark:border-stone-700">
              <button
                onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-stone-900"
                title="تصغير"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-bold px-1 text-stone-700 dark:text-stone-300 font-mono">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(160, z + 10))}
                className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-stone-900"
                title="تكبير"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Reciter & Play Page Audio */}
          <button
            onClick={handlePlayCurrentPageAudio}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
            title={`تلاوة صفحة ${currentPage} بصوت ${reciter.name}`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تلاوة الصفحة</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={handleToggleFullscreen}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 text-xs font-bold"
            title="ملء الشاشة"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Page Navigation Bar */}
      <div className="mb-3 flex items-center justify-between gap-2 px-1">
        {/* Next Page (RTL Next = Page + 1) */}
        <button
          disabled={currentPage >= 604}
          onClick={handleNextPage}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-4 py-2 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-emerald-50 dark:hover:bg-stone-800 disabled:opacity-30 shadow-2xs transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-emerald-700" />
          <span>الصفحة التالية ({currentPage + 1})</span>
        </button>

        {/* Middle Page Info Badge */}
        <div className="text-center px-2">
          <div className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center justify-center gap-1.5">
            <span className="text-emerald-700 font-bold">سورة {pageSurah.name}</span>
            <span className="text-stone-300 dark:text-stone-600">•</span>
            <span className="text-amber-700 dark:text-amber-400">الجزء {currentJuzNumber}</span>
          </div>
        </div>

        {/* Prev Page (RTL Prev = Page - 1) */}
        <button
          disabled={currentPage <= 1}
          onClick={handlePrevPage}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-4 py-2 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-emerald-50 dark:hover:bg-stone-800 disabled:opacity-30 shadow-2xs transition-colors"
        >
          <span>الصفحة السابقة ({currentPage - 1})</span>
          <ChevronLeft className="w-4 h-4 text-emerald-700" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. SCANNED PHOTOGRAPHED MEDINA MUSHAF VIEW (المصحف المصور الحقيقي) */}
      {/* ========================================================================= */}
      {viewMode === 'scanned' && (
        <div className="relative rounded-3xl overflow-hidden bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 shadow-xl flex flex-col items-center justify-center p-2 sm:p-6 min-h-[580px]">
          {/* Loading Indicator */}
          {imageLoading && (
            <div className="absolute inset-0 z-20 bg-stone-50/90 dark:bg-stone-900/90 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-bold text-stone-700 dark:text-stone-300">
                جاري تحميل صفحة المصحف المصورة ({currentPage})...
              </p>
              <span className="text-[11px] text-stone-400 mt-1">طبعة مجمع الملك فهد لطباعة المصحف الشريف</span>
            </div>
          )}

          {/* High Resolution Scanned Page Image */}
          <div
            className="w-full flex justify-center transition-transform duration-200"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
            }}
          >
            <img
              src={currentImageUrl}
              alt={`صفحة المصحف الشريف ${currentPage}`}
              onLoad={() => setImageLoading(false)}
              onError={handleImageError}
              className={`max-w-full h-auto rounded-xl shadow-md transition-all duration-300 select-none ${
                isNightFilter ? 'invert hue-rotate-180 brightness-90 contrast-125' : ''
              }`}
              style={{
                maxHeight: isFullscreen ? '92vh' : '780px',
                objectFit: 'contain',
              }}
              draggable={false}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Bottom Medallion for Page Number */}
          <div className="mt-3 pt-2 text-center text-xs font-bold text-stone-500 select-none flex items-center justify-center gap-2">
            <span>❖</span>
            <span>صفحة {currentPage} من ٦٠٤</span>
            <span>❖</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CLEAN TEXT MODE (نص عثماني نقي وواضح مع مؤشر وتظليل الآية المقروءة) */}
      {/* ========================================================================= */}
      {viewMode === 'clean_text' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-lg space-y-6">
          {loadingPageData && (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-stone-500">جاري تحميل آيات الصفحة...</p>
            </div>
          )}

          {!loadingPageData && pageData && (
            <div>
              {/* Surah Headers if start of surah on this page */}
              {pageData.surahs.map((s) => {
                const startsHere = pageData.ayahs.some(
                  (a) => a.surahNumber === s.number && a.numberInSurah === 1
                );
                if (!startsHere) return null;

                return (
                  <div key={s.number} className="my-6 text-center border-y border-stone-200 dark:border-stone-800 py-3">
                    <h2 className="text-xl sm:text-2xl font-bold font-quran text-emerald-800 dark:text-emerald-400">
                      سورة {s.name}
                    </h2>
                    <span className="text-xs text-stone-400">
                      {s.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} • {s.numberOfAyahs} آية
                    </span>
                    {s.number !== 1 && s.number !== 9 && (
                      <p className="mt-3 font-quran text-lg text-stone-700 dark:text-stone-300">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </p>
                    )}
                  </div>
                );
              })}

              {/* Justified Clean Uthmani Text with Live Reciter Highlighting */}
              <div
                className="text-justify font-quran leading-loose text-stone-900 dark:text-stone-100"
                style={{ fontSize: `${fontSize + 3}px`, textAlignLast: 'center' }}
              >
                {pageData.ayahs.map((ayah) => {
                  const isPlayingThis =
                    activePlayingAyah?.surah === ayah.surahNumber &&
                    activePlayingAyah?.ayah === ayah.numberInSurah &&
                    isPlaying;

                  return (
                    <span
                      id={`clean-ayah-${ayah.surahNumber}-${ayah.numberInSurah}`}
                      key={`${ayah.surahNumber}-${ayah.numberInSurah}`}
                      onClick={() => setSelectedAyahForTafsir(ayah)}
                      className={`cursor-pointer transition-all duration-300 px-1.5 py-0.5 rounded-xl inline-block ${
                        isPlayingThis
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-100 font-bold ring-2 ring-amber-500 shadow-md transform scale-[1.02]'
                          : 'hover:bg-emerald-50 dark:hover:bg-stone-800'
                      }`}
                      title={`انقر للتفسير والاستماع: آية ${ayah.numberInSurah}`}
                    >
                      {isPlayingThis && (
                        <span className="text-emerald-700 dark:text-emerald-400 text-xs font-sans ml-1 inline-flex items-center gap-0.5 align-middle">
                          <Radio className="w-3 h-3 animate-pulse text-amber-600" />
                        </span>
                      )}
                      <span>{ayah.text}</span>{' '}
                      <span className={`font-serif text-[0.85em] select-none mx-1 font-bold ${
                        isPlayingThis ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'
                      }`}>
                        ﴿{ayah.numberInSurah}﴾
                      </span>{' '}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. UNDER-PAGE DRAWER: VERSES LIST & TAFSIR (آيات الصفحة وتفاسيرها) */}
      {/* ========================================================================= */}
      <div className="mt-5 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <button
            onClick={() => setShowPageAyahsList((prev) => !prev)}
            className="flex items-center gap-2 font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 hover:text-emerald-700"
          >
            <List className="w-4 h-4 text-emerald-600" />
            <span>آيات صفحة {currentPage} وتفسيرها ({pageData?.ayahs?.length || 0} آية)</span>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md font-normal">
              {showPageAyahsList ? 'إخفاء' : 'عرض والتفسير'}
            </span>
          </button>

          <button
            onClick={onOpenTafsirModal}
            className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>التفسير: {currentEditionMeta.name}</span>
          </button>
        </div>

        {/* Verses Table / Accordion */}
        {showPageAyahsList && pageData && (
          <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {pageData.ayahs.map((ayah) => {
              const isPlayingThis =
                activePlayingAyah?.surah === ayah.surahNumber &&
                activePlayingAyah?.ayah === ayah.numberInSurah &&
                isPlaying;

              return (
                <div
                  key={`${ayah.surahNumber}-${ayah.numberInSurah}`}
                  className={`p-3 rounded-2xl border transition-all ${
                    isPlayingThis
                      ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 ring-1 ring-amber-400'
                      : 'border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full text-white text-[11px] font-bold flex items-center justify-center ${
                        isPlayingThis ? 'bg-amber-600 animate-pulse' : 'bg-emerald-700'
                      }`}>
                        {ayah.numberInSurah}
                      </span>
                      <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                        سورة {ayah.surahName} • الآية {ayah.numberInSurah}
                      </span>
                      {isPlayingThis && (
                        <span className="text-[10px] bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-md font-bold">
                          🎙️ يُتلى الآن
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onPlayAyah(ayah.surahNumber, ayah.numberInSurah)}
                        className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                          isPlayingThis
                            ? 'bg-amber-600 text-white'
                            : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                        }`}
                        title="استماع"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setSelectedAyahForTafsir(ayah)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-stone-700 text-xs"
                        title="تفسير مفصل"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Ayah Text */}
                  <p className="font-quran text-base sm:text-lg text-stone-900 dark:text-stone-100 leading-relaxed">
                    ﴿{ayah.text}﴾
                  </p>

                  {/* Direct Tafsir preview */}
                  {(ayah.tafsir || ayah.translation) && (
                    <div className="mt-2 pt-2 border-t border-stone-200/60 dark:border-stone-700/60 text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-serif">
                      <span className="font-bold text-emerald-800 dark:text-emerald-400">التفسير: </span>
                      {ayah.tafsir || ayah.translation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* QUICK JUMP MODAL (انتقال سريع للصفحات والأجزاء والسور) */}
      {/* ========================================================================= */}
      {showJumpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>الانتقال السريع في المصحف</span>
              </h3>
              <button
                onClick={() => setShowJumpModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input Page Number & Random Action */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                أدخل رقم الصفحة (١ - ٦٠٤):
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={604}
                  value={jumpInputValue}
                  onChange={(e) => setJumpInputValue(e.target.value)}
                  placeholder="مثال: ٥٠"
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-emerald-600"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && jumpInputValue) {
                      handleJumpToPage(parseInt(jumpInputValue, 10));
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (jumpInputValue) handleJumpToPage(parseInt(jumpInputValue, 10));
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  انتقال
                </button>
                <button
                  onClick={() => {
                    const randomPage = Math.floor(Math.random() * 604) + 1;
                    handleJumpToPage(randomPage);
                  }}
                  className="px-3 py-2 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-900 dark:text-amber-200 text-xs font-bold rounded-xl border border-amber-300 dark:border-amber-700 cursor-pointer"
                  title="الانتقال إلى صفحة عشوائية"
                >
                  🎲 عشوائي
                </button>
              </div>
            </div>

            {/* Smooth Range Slider */}
            <div>
              <div className="flex justify-between text-xs text-stone-500 mb-1">
                <span>صفحة ١</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">صفحة {currentPage}</span>
                <span>صفحة ٦٠٤</span>
              </div>
              <input
                type="range"
                min={1}
                max={604}
                value={currentPage}
                onChange={(e) => setCurrentPage(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Quick Juz Jump (1-30) */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                الانتقال حسب الأجزاء الثلاثين:
              </label>
              <div className="grid grid-cols-5 gap-1.5 max-h-36 overflow-y-auto p-1 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
                {Array.from({ length: 30 }).map((_, i) => {
                  const juzNum = i + 1;
                  const juzStartPages: Record<number, number> = {
                    1: 1, 2: 22, 3: 42, 4: 62, 5: 82, 6: 102, 7: 121, 8: 142, 9: 162, 10: 182,
                    11: 201, 12: 222, 13: 242, 14: 262, 15: 282, 16: 302, 17: 322, 18: 342, 19: 362, 20: 382,
                    21: 402, 22: 422, 23: 442, 24: 462, 25: 482, 26: 502, 27: 522, 28: 542, 29: 562, 30: 582,
                  };
                  return (
                    <button
                      key={juzNum}
                      onClick={() => handleJumpToPage(juzStartPages[juzNum] || 1)}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                        currentJuzNumber === juzNum
                          ? 'bg-emerald-700 text-white'
                          : 'bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-emerald-50'
                      }`}
                    >
                      ج {juzNum}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Saved Bookmarks */}
            {savedBookmarks.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-amber-800 dark:text-amber-400 mb-1.5">
                  🔖 الفواصل والصفحات المحفوظة:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {savedBookmarks.map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handleJumpToPage(pageNum)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                        currentPage === pageNum
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 text-amber-900 dark:text-amber-300'
                      }`}
                    >
                      صفحة {pageNum}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Open Surah List Modal Trigger */}
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 text-center">
              <button
                onClick={() => {
                  setShowJumpModal(false);
                  onOpenSurahList();
                }}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                أو تصفح فهرس السور الـ ١١٤ كاملاً ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAFSIR / AYAH DETAILS MODAL */}
      {/* ========================================================================= */}
      {selectedAyahForTafsir && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                  {selectedAyahForTafsir.numberInSurah}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    سورة {selectedAyahForTafsir.surahName} • الآية {selectedAyahForTafsir.numberInSurah}
                  </h4>
                  <span className="text-[11px] text-stone-400">
                    الجزء {selectedAyahForTafsir.juz} • صفحة {selectedAyahForTafsir.page || currentPage}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAyahForTafsir(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center">
              <p className="font-quran text-lg sm:text-xl text-stone-900 dark:text-stone-100 leading-relaxed">
                ﴿{selectedAyahForTafsir.text}﴾
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onPlayAyah(selectedAyahForTafsir.surahNumber, selectedAyahForTafsir.numberInSurah);
                  setSelectedAyahForTafsir(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Volume2 className="w-4 h-4" />
                <span>استماع بصوت {reciter.name}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 text-xs leading-relaxed space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>تفسير / ترجمة ({currentEditionMeta.name})</span>
                </span>
                <button
                  onClick={() => {
                    setSelectedAyahForTafsir(null);
                    onOpenTafsirModal();
                  }}
                  className="text-[11px] text-amber-700 dark:text-amber-400 underline font-bold"
                >
                  تغيير التفسير
                </button>
              </div>
              <p className="text-stone-800 dark:text-stone-200 font-serif">
                {selectedAyahForTafsir.tafsir || selectedAyahForTafsir.translation || 'التفسير متاح عند الاتصال.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
