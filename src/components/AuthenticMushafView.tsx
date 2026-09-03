import { useState, useEffect, useRef, useMemo } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Volume2,
  Bookmark,
  Copy,
  Check,
  Info,
  Layers,
  Sliders,
  Sparkles,
  BookOpen,
  Search,
  Maximize2,
  X,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  QuranMushafPageData,
  QuranMushafPageAyah,
  Reciter,
  ThemeMode,
  QuranAyahItem,
} from '../types';
import { QURAN_SURAHS, SurahMeta, TAFSIR_TRANSLATION_EDITIONS } from '../data/quranSurahsData';
import { fetchMushafPageWithEdition, fetchSurahWithEdition } from '../utils/quranApi';
import { playClickTone, playCompleteChime } from '../utils/audioUtils';

interface AuthenticMushafViewProps {
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
  onPlayAyah: (surah: number, ayah: number) => void;
  onTogglePlay: () => void;
  soundEnabled: boolean;
}

export function AuthenticMushafView({
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
  onPlayAyah,
  onTogglePlay,
  soundEnabled,
}: AuthenticMushafViewProps) {
  // Reading mode: 'page' (Medina 1-604 pages) or 'surah_flow' (Full surah in gilded frame)
  const [mushafMode, setMushafMode] = useState<'page' | 'surah_flow'>('page');
  
  // Page number state (1 - 604)
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (initialPage && initialPage >= 1 && initialPage <= 604) return initialPage;
    const surah = QURAN_SURAHS.find((s) => s.number === currentSurahNumber);
    return surah ? surah.pageStart : 1;
  });

  // Paper visual style
  const [paperStyle, setPaperStyle] = useState<'cream' | 'white' | 'dark' | 'sepia'>(() => {
    if (theme === 'dark') return 'dark';
    if (theme === 'sepia') return 'sepia';
    return 'cream';
  });

  // Data states
  const [pageData, setPageData] = useState<QuranMushafPageData | null>(null);
  const [surahFlowData, setSurahFlowData] = useState<QuranAyahItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Selected ayah for interactive action sheet
  const [selectedAyah, setSelectedAyah] = useState<QuranMushafPageAyah | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [ayahCounters, setAyahCounters] = useState<Record<string, number>>({});
  const [bookmarkedKeys, setBookmarkedKeys] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('quran_mushaf_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Quick jump input
  const [jumpPageInput, setJumpPageInput] = useState<string>('');
  const [showJumpDialog, setShowJumpDialog] = useState<boolean>(false);

  // Get current edition meta
  const currentEditionMeta = useMemo(() => {
    return (
      TAFSIR_TRANSLATION_EDITIONS.find((e) => e.identifier === tafsirEdition) ||
      TAFSIR_TRANSLATION_EDITIONS[0]
    );
  }, [tafsirEdition]);

  // Current Surah metadata
  const currentSurahMeta: SurahMeta = useMemo(() => {
    return QURAN_SURAHS.find((s) => s.number === currentSurahNumber) || QURAN_SURAHS[0];
  }, [currentSurahNumber]);

  // Synchronize paper style when global theme changes
  useEffect(() => {
    if (theme === 'dark') setPaperStyle('dark');
    else if (theme === 'sepia') setPaperStyle('sepia');
  }, [theme]);

  // When currentSurahNumber prop changes, update page if in page mode
  useEffect(() => {
    const surah = QURAN_SURAHS.find((s) => s.number === currentSurahNumber);
    if (surah && mushafMode === 'page') {
      setCurrentPage(surah.pageStart);
    }
  }, [currentSurahNumber, mushafMode]);

  // Fetch data on page or edition change
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    if (mushafMode === 'page') {
      fetchMushafPageWithEdition(currentPage, tafsirEdition)
        .then((data) => {
          if (!isCancelled) {
            setPageData(data);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (!isCancelled) {
            console.error('Error loading mushaf page:', err);
            setLoading(false);
          }
        });
    } else {
      // Surah flow mode
      fetchSurahWithEdition(currentSurahNumber, tafsirEdition)
        .then((data) => {
          if (!isCancelled) {
            setSurahFlowData(data.ayahs);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (!isCancelled) {
            console.error('Error loading surah flow:', err);
            setLoading(false);
          }
        });
    }

    return () => {
      isCancelled = true;
    };
  }, [currentPage, mushafMode, currentSurahNumber, tafsirEdition]);

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
  const handleJumpToPage = (pageNum: number) => {
    const safe = Math.max(1, Math.min(604, pageNum));
    setCurrentPage(safe);
    setShowJumpDialog(false);
    setJumpPageInput('');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Bookmark toggle
  const handleToggleBookmark = (surahNum: number, ayahNum: number) => {
    const key = `${surahNum}:${ayahNum}`;
    setBookmarkedKeys((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      try {
        localStorage.setItem('quran_mushaf_bookmarks', JSON.stringify(next));
      } catch {
        // storage full
      }
      return next;
    });
  };

  // Copy Ayah
  const handleCopyAyah = (ayah: QuranMushafPageAyah) => {
    const text = `﴿${ayah.text}﴾ [سورة ${ayah.surahName}: آية ${ayah.numberInSurah}]${
      ayah.tafsir ? `\n\nتفسير: ${ayah.tafsir}` : ayah.translation ? `\n\nTranslation: ${ayah.translation}` : ''
    }`;
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  // Increment memorization repetition counter
  const handleIncrementCount = (surahNum: number, ayahNum: number) => {
    if (soundEnabled) playClickTone();
    const key = `${surahNum}:${ayahNum}`;
    setAyahCounters((prev) => {
      const count = (prev[key] || 0) + 1;
      if (count === 3 || count === 7) {
        if (soundEnabled) playCompleteChime();
      }
      return { ...prev, [key]: count };
    });
  };

  // Page Header Details
  const pageSurahName = pageData?.surahs?.[0]?.name || currentSurahMeta.name;
  const pageJuzNumber = pageData?.juzNumber || currentSurahMeta.juzStart;
  const pageHizbQuarter = pageData?.hizbQuarter ? Math.ceil(pageData.hizbQuarter / 4) : 1;

  // Paper Theme Colors
  const paperClasses = {
    cream: 'mushaf-paper-cream text-[#241e15] border-[#d4af37]',
    white: 'mushaf-paper-white text-stone-900 border-[#c59b27]',
    dark: 'mushaf-paper-dark text-stone-100 border-[#997825]',
    sepia: 'mushaf-paper-sepia text-[#2b2416] border-[#c09945]',
  }[paperStyle];

  const isDarkPaper = paperStyle === 'dark';

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4">
      {/* Top Mushaf Control Toolbar */}
      <div className="mb-5 p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
          <button
            onClick={() => setMushafMode('page')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mushafMode === 'page'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>صفحات المصحف (١ - ٦٠٤)</span>
          </button>
          <button
            onClick={() => setMushafMode('surah_flow')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mushafMode === 'surah_flow'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>المصحف المتصل (السورة كاملة)</span>
          </button>
        </div>

        {/* Paper Color Schemes */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-stone-400 hidden sm:inline">لون الورق:</span>
          <button
            onClick={() => setPaperStyle('cream')}
            title="ورق مصحف المدينة الأصيل"
            className={`w-6 h-6 rounded-full border-2 transition-transform ${
              paperStyle === 'cream' ? 'scale-110 border-amber-600 ring-2 ring-amber-400/40' : 'border-stone-300'
            } bg-[#faf6eb]`}
          />
          <button
            onClick={() => setPaperStyle('white')}
            title="ورق أبيض ناصع"
            className={`w-6 h-6 rounded-full border-2 transition-transform ${
              paperStyle === 'white' ? 'scale-110 border-emerald-600 ring-2 ring-emerald-400/40' : 'border-stone-300'
            } bg-white`}
          />
          <button
            onClick={() => setPaperStyle('sepia')}
            title="ورق تراثي دافئ"
            className={`w-6 h-6 rounded-full border-2 transition-transform ${
              paperStyle === 'sepia' ? 'scale-110 border-amber-700 ring-2 ring-amber-600/40' : 'border-stone-300'
            } bg-[#f7efe0]`}
          />
          <button
            onClick={() => setPaperStyle('dark')}
            title="المصحف الليلي الملكي"
            className={`w-6 h-6 rounded-full border-2 transition-transform ${
              paperStyle === 'dark' ? 'scale-110 border-amber-400 ring-2 ring-amber-400/40' : 'border-stone-600'
            } bg-[#171513]`}
          />
        </div>

        {/* Reciter & Tafsir Quick triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReciterModal}
            className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-[11px] font-bold text-stone-700 dark:text-stone-300 hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="truncate max-w-[100px]">{reciter.name.split(' ')[0]}</span>
          </button>
          <button
            onClick={onOpenTafsirModal}
            className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-[11px] font-bold text-stone-700 dark:text-stone-300 hover:text-amber-700 flex items-center gap-1 transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-amber-600" />
            <span className="truncate max-w-[90px]">{currentEditionMeta.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>

      {/* Page Navigation Top Bar (Only in Page Mode) */}
      {mushafMode === 'page' && (
        <div className="mb-4 flex items-center justify-between gap-2 px-2">
          {/* Next Page in RTL is on the left */}
          <button
            disabled={currentPage >= 604}
            onClick={handleNextPage}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-bold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 shadow-2xs transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
            <span>الصفحة التالية ({currentPage + 1})</span>
          </button>

          {/* Quick Page Jump Button */}
          <button
            onClick={() => setShowJumpDialog(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-700/60 text-amber-900 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>صفحة {currentPage} من ٦٠٤</span>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-200/50 dark:bg-amber-900/50 px-1.5 py-0.5 rounded-md">
              انتقال
            </span>
          </button>

          {/* Prev Page in RTL is on the right */}
          <button
            disabled={currentPage <= 1}
            onClick={handlePrevPage}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-bold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 shadow-2xs transition-colors"
          >
            <span>الصفحة السابقة ({currentPage - 1})</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Jump Dialog Modal */}
      {showJumpDialog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-amber-500/30 p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>الانتقال السريع في المصحف</span>
              </h3>
              <button
                onClick={() => setShowJumpDialog(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 mb-1.5">
                  رقم الصفحة (١ - ٦٠٤):
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    max={604}
                    value={jumpPageInput}
                    onChange={(e) => setJumpPageInput(e.target.value)}
                    placeholder="مثال: ٥٠"
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-emerald-600"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && jumpPageInput) {
                        handleJumpToPage(parseInt(jumpPageInput, 10));
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (jumpPageInput) handleJumpToPage(parseInt(jumpPageInput, 10));
                    }}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl"
                  >
                    انتقال
                  </button>
                </div>
              </div>

              {/* Slider for smooth page browsing */}
              <div>
                <div className="flex justify-between text-xs text-stone-500 mb-1">
                  <span>صفحة ١ (الفاتحة)</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    صفحة {currentPage}
                  </span>
                  <span>صفحة ٦٠٤ (الناس)</span>
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

              {/* Quick Jump to Juz */}
              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 mb-2">
                  الانتقال حسب الأجزاء:
                </label>
                <div className="grid grid-cols-5 gap-1.5 max-h-36 overflow-y-auto p-1 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const juzNum = i + 1;
                    // Approximate start page for each Juz
                    const juzPages: Record<number, number> = {
                      1: 1, 2: 22, 3: 42, 4: 62, 5: 82, 6: 102, 7: 121, 8: 142, 9: 162, 10: 182,
                      11: 201, 12: 222, 13: 242, 14: 262, 15: 282, 16: 302, 17: 322, 18: 342, 19: 362, 20: 382,
                      21: 402, 22: 422, 23: 442, 24: 462, 25: 482, 26: 502, 27: 522, 28: 542, 29: 562, 30: 582,
                    };
                    return (
                      <button
                        key={juzNum}
                        onClick={() => handleJumpToPage(juzPages[juzNum] || 1)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                          pageJuzNumber === juzNum
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

              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 text-center">
                <button
                  onClick={onOpenSurahList}
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  أو فتح فهرس السور الـ ١١٤ ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AUTHENTIC MEDINA MUSHAF PAGE CANVAS (إطار مصحف المدينة المنورة الحقيقي) */}
      {/* ========================================================================= */}
      <div
        className={`relative rounded-3xl p-4 sm:p-8 md:p-10 shadow-2xl transition-all border-4 ${paperClasses} ${
          isDarkPaper ? 'mushaf-gilded-frame-dark' : 'mushaf-gilded-frame'
        }`}
        style={{ minHeight: '620px' }}
      >
        {/* Ornate Corner Cartouches */}
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

        {/* Outer Top Header Bar of the Mushaf Page */}
        <div
          className={`flex items-center justify-between pb-3 mb-6 border-b-2 text-xs sm:text-sm font-bold select-none ${
            isDarkPaper
              ? 'border-amber-600/30 text-amber-400/90'
              : 'border-[#c59b27]/40 text-[#8c6d1f]'
          }`}
        >
          {/* Surah Name Banner (Right) */}
          <div className="flex items-center gap-1.5">
            <span className="text-amber-600 text-xs">۞</span>
            <span className="font-serif">
              سُورَةُ {mushafMode === 'page' ? pageSurahName : currentSurahMeta.name}
            </span>
          </div>

          {/* Center decorative motif */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] opacity-70 tracking-widest font-serif">
            <span>⚜</span>
            <span>المُصْحَفُ الشَّرِيفُ</span>
            <span>⚜</span>
          </div>

          {/* Juz & Hizb Quarter (Left) */}
          <div className="flex items-center gap-1.5">
            <span className="font-serif">
              الجُزْءُ {mushafMode === 'page' ? pageJuzNumber : currentSurahMeta.juzStart}
            </span>
            <span className="text-amber-600 text-xs">۞</span>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-24 text-center">
            <div className="inline-block animate-spin w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full mb-3" />
            <p className="text-sm font-bold text-amber-800 dark:text-amber-400 font-serif">
              جاري فتح صفحة المصحف الشريف...
            </p>
          </div>
        )}

        {/* Mushaf Content: Page Mode */}
        {!loading && mushafMode === 'page' && pageData && (
          <div className="space-y-6">
            {/* If the page contains the beginning of a Surah, render its Ornate Islamic Headpiece */}
            {pageData.surahs.map((surah) => {
              const startsOnThisPage = pageData.ayahs.some(
                (a) => a.surahNumber === surah.number && a.numberInSurah === 1
              );

              if (!startsOnThisPage) return null;

              return (
                <div key={surah.number} className="my-6 text-center select-none animate-in fade-in">
                  {/* Surah Ornate Frame Banner */}
                  <div
                    className={`mx-auto max-w-lg p-3 sm:p-4 rounded-2xl border-2 relative ${
                      isDarkPaper
                        ? 'bg-gradient-to-r from-amber-950/60 via-stone-900 to-amber-950/60 border-amber-600/50 shadow-lg'
                        : 'bg-gradient-to-r from-[#f5ebd7] via-[#fffaf0] to-[#f5ebd7] border-[#c59b27] shadow-md'
                    }`}
                  >
                    {/* Islamic Geometric Motifs */}
                    <div className="flex items-center justify-between px-2 text-xs opacity-70">
                      <span className="text-amber-600">◈ ❖ ◈</span>
                      <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400">
                        {surah.revelationType === 'Meccan' ? 'مَكِّيَّة' : 'مَدَنِيَّة'} • آيَاتُهَا {surah.numberOfAyahs}
                      </span>
                      <span className="text-amber-600">◈ ❖ ◈</span>
                    </div>

                    <h2
                      className={`text-xl sm:text-2xl font-bold font-quran my-1 ${
                        isDarkPaper ? 'text-amber-300' : 'text-[#8a681c]'
                      }`}
                    >
                      سُورَةُ {surah.name}
                    </h2>
                  </div>

                  {/* Basmalah for Surah (Except Surah 9 At-Tawbah and Surah 1 Al-Fatiha which has it as Ayah 1) */}
                  {surah.number !== 1 && surah.number !== 9 && (
                    <div className="mt-4 mb-2 text-center">
                      <p
                        className={`font-quran text-lg sm:text-xl font-bold ${
                          isDarkPaper ? 'text-amber-200/90' : 'text-[#735414]'
                        }`}
                      >
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Continuous Justified Uthmani Quranic Text */}
            <div
              className="text-justify font-quran leading-loose select-text px-1 sm:px-3"
              style={{
                fontSize: `${fontSize + 3}px`,
                textAlignLast: 'center',
              }}
            >
              {pageData.ayahs.map((ayah) => {
                const isPlayingThis =
                  activePlayingAyah?.surah === ayah.surahNumber &&
                  activePlayingAyah?.ayah === ayah.numberInSurah;
                const ayahKey = `${ayah.surahNumber}:${ayah.numberInSurah}`;
                const isBookmarked = bookmarkedKeys.includes(ayahKey);

                return (
                  <span
                    key={`${ayah.surahNumber}-${ayah.numberInSurah}`}
                    onClick={() => setSelectedAyah(ayah)}
                    className={`cursor-pointer transition-all duration-200 px-1 py-0.5 rounded-lg inline relative group ${
                      isPlayingThis
                        ? 'bg-amber-300/40 dark:bg-amber-900/60 ring-2 ring-amber-500 font-bold rounded-lg'
                        : isBookmarked
                        ? 'bg-amber-100/60 dark:bg-amber-950/40'
                        : 'hover:bg-amber-200/30 dark:hover:bg-amber-950/30'
                    }`}
                    title={`انقر للخيارات: سورة ${ayah.surahName} • آية ${ayah.numberInSurah}`}
                  >
                    {/* Quranic Text */}
                    <span>{ayah.text}</span>{' '}
                    {/* Medina Mushaf Rosette Ayah Flower */}
                    <span className="ayah-badge-mushaf select-none inline-block">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-amber-600/60 text-[11px] sm:text-xs font-bold ${
                          isPlayingThis
                            ? 'bg-emerald-700 text-white'
                            : isDarkPaper
                            ? 'bg-stone-800 text-amber-400 border-amber-500'
                            : 'bg-[#fffaf0] text-[#735414] border-[#c59b27]'
                        }`}
                      >
                        {ayah.numberInSurah}
                      </span>
                    </span>{' '}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Mushaf Content: Full Surah Flow Mode */}
        {!loading && mushafMode === 'surah_flow' && (
          <div className="space-y-6">
            {/* Surah Header */}
            <div className="text-center my-4 select-none">
              <div
                className={`mx-auto max-w-md p-3 rounded-2xl border-2 ${
                  isDarkPaper
                    ? 'bg-gradient-to-r from-amber-950/60 via-stone-900 to-amber-950/60 border-amber-600/50 shadow-lg'
                    : 'bg-gradient-to-r from-[#f5ebd7] via-[#fffaf0] to-[#f5ebd7] border-[#c59b27] shadow-md'
                }`}
              >
                <div className="flex items-center justify-between px-2 text-xs opacity-70">
                  <span className="text-amber-600">◈ ❖ ◈</span>
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400">
                    {currentSurahMeta.revelationType === 'Meccan' ? 'مَكِّيَّة' : 'مَدَنِيَّة'} • آيَاتُهَا {currentSurahMeta.numberOfAyahs}
                  </span>
                  <span className="text-amber-600">◈ ❖ ◈</span>
                </div>
                <h2
                  className={`text-2xl font-bold font-quran my-1 ${
                    isDarkPaper ? 'text-amber-300' : 'text-[#8a681c]'
                  }`}
                >
                  سُورَةُ {currentSurahMeta.name}
                </h2>
              </div>

              {/* Basmalah */}
              {currentSurahNumber !== 1 && currentSurahNumber !== 9 && (
                <div className="mt-4 mb-3">
                  <p
                    className={`font-quran text-xl font-bold ${
                      isDarkPaper ? 'text-amber-200/90' : 'text-[#735414]'
                    }`}
                  >
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                </div>
              )}
            </div>

            {/* Continuous Text */}
            <div
              className="text-justify font-quran leading-loose select-text px-1 sm:px-3"
              style={{ fontSize: `${fontSize + 3}px`, textAlignLast: 'center' }}
            >
              {surahFlowData.map((ayah) => {
                const isPlayingThis =
                  activePlayingAyah?.surah === currentSurahNumber &&
                  activePlayingAyah?.ayah === ayah.numberInSurah;
                const ayahKey = `${currentSurahNumber}:${ayah.numberInSurah}`;
                const isBookmarked = bookmarkedKeys.includes(ayahKey);

                const mushafAyahItem: QuranMushafPageAyah = {
                  ...ayah,
                  surahNumber: currentSurahNumber,
                  surahName: currentSurahMeta.name,
                };

                return (
                  <span
                    key={ayah.numberInSurah}
                    onClick={() => setSelectedAyah(mushafAyahItem)}
                    className={`cursor-pointer transition-all duration-200 px-1 py-0.5 rounded-lg inline relative ${
                      isPlayingThis
                        ? 'bg-amber-300/40 dark:bg-amber-900/60 ring-2 ring-amber-500 font-bold rounded-lg'
                        : isBookmarked
                        ? 'bg-amber-100/60 dark:bg-amber-950/40'
                        : 'hover:bg-amber-200/30 dark:hover:bg-amber-950/30'
                    }`}
                    title={`انقر للخيارات: آية ${ayah.numberInSurah}`}
                  >
                    <span>{ayah.text}</span>{' '}
                    <span className="ayah-badge-mushaf select-none inline-block">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-amber-600/60 text-[11px] sm:text-xs font-bold ${
                          isPlayingThis
                            ? 'bg-emerald-700 text-white'
                            : isDarkPaper
                            ? 'bg-stone-800 text-amber-400 border-amber-500'
                            : 'bg-[#fffaf0] text-[#735414] border-[#c59b27]'
                        }`}
                      >
                        {ayah.numberInSurah}
                      </span>
                    </span>{' '}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Page Number Medallion (Only in Page Mode) */}
        {mushafMode === 'page' && (
          <div className="mt-8 pt-4 border-t-2 border-[#c59b27]/30 text-center select-none">
            <div className="inline-flex items-center justify-center gap-2 px-5 py-1 rounded-full border border-amber-600/50 bg-[#fbf7ed] dark:bg-stone-800 shadow-xs">
              <span className="text-amber-600 text-xs">❖</span>
              <span className="text-xs font-bold font-serif text-amber-900 dark:text-amber-300">
                صفحة {currentPage}
              </span>
              <span className="text-amber-600 text-xs">❖</span>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE AYAH ACTION MODAL / BOTTOM SHEET */}
      {/* ========================================================================= */}
      {selectedAyah && (
        <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6 bg-black/60 backdrop-blur-xs flex justify-center items-end animate-in slide-in-from-bottom-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-amber-500/40 p-5 max-w-2xl w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Header with Ayah details & close button */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                  {selectedAyah.numberInSurah}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    سورة {selectedAyah.surahName} • الآية {selectedAyah.numberInSurah}
                  </h4>
                  <span className="text-[11px] text-stone-400">
                    الجزء {selectedAyah.juz} • صفحة {selectedAyah.page || currentPage}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedAyah(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ayah Calligraphy Box */}
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-stone-800/80 border border-amber-200/70 dark:border-stone-700 text-center">
              <p className="font-quran text-lg sm:text-xl text-stone-900 dark:text-stone-100 leading-relaxed">
                ﴿{selectedAyah.text}﴾
              </p>
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Play Audio */}
              <button
                onClick={() => {
                  onPlayAyah(selectedAyah.surahNumber, selectedAyah.numberInSurah);
                  setSelectedAyah(null);
                }}
                className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>استماع {reciter.name.split(' ')[0]}</span>
              </button>

              {/* Bookmark */}
              <button
                onClick={() => handleToggleBookmark(selectedAyah.surahNumber, selectedAyah.numberInSurah)}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  bookmarkedKeys.includes(`${selectedAyah.surahNumber}:${selectedAyah.numberInSurah}`)
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                    : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${bookmarkedKeys.includes(`${selectedAyah.surahNumber}:${selectedAyah.numberInSurah}`) ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>حفظ فاصلة</span>
              </button>

              {/* Copy */}
              <button
                onClick={() => handleCopyAyah(selectedAyah)}
                className="p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSuccess ? 'تم النسخ' : 'نسخ الآية'}</span>
              </button>

              {/* Repetition Counter */}
              <button
                onClick={() => handleIncrementCount(selectedAyah.surahNumber, selectedAyah.numberInSurah)}
                className="p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>
                  تكرار الحفظ{' '}
                  {ayahCounters[`${selectedAyah.surahNumber}:${selectedAyah.numberInSurah}`]
                    ? `(${ayahCounters[`${selectedAyah.surahNumber}:${selectedAyah.numberInSurah}`]})`
                    : ''}
                </span>
              </button>
            </div>

            {/* Tafsir / Translation Box */}
            <div className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 text-xs leading-relaxed">
              <div className="flex items-center justify-between mb-2">
                <strong className="text-emerald-800 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>تفسير / ترجمة ({currentEditionMeta.name})</span>
                </strong>
                <button
                  onClick={onOpenTafsirModal}
                  className="text-[11px] text-amber-700 dark:text-amber-400 underline font-bold"
                >
                  تغيير التفسير
                </button>
              </div>
              <p className="text-stone-800 dark:text-stone-200 select-text font-serif">
                {selectedAyah.tafsir || selectedAyah.translation || 'التفسير متاح عند الاتصال بالشبكة.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
