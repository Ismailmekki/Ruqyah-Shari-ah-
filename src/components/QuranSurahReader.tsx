import { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Search,
  Globe,
  User,
  Copy,
  Check,
  Bookmark,
  Share2,
  Sparkles,
  Info,
  SlidersHorizontal,
  RefreshCw,
  Play,
  Pause,
  Layers,
  FileText,
} from 'lucide-react';
import { QuranSurahData, QuranAyahItem, Reciter, ThemeMode } from '../types';
import { QURAN_SURAHS, SurahMeta, TAFSIR_TRANSLATION_EDITIONS } from '../data/quranSurahsData';
import { fetchSurahWithEdition } from '../utils/quranApi';
import { playClickTone, playCompleteChime } from '../utils/audioUtils';
import { PhotographedMushafView } from './PhotographedMushafView';


interface QuranSurahReaderProps {
  surahNumber: number;
  onSelectSurah: (num: number) => void;
  reciter: Reciter;
  onOpenReciterModal: () => void;
  tafsirEdition: string;
  onOpenTafsirModal: () => void;
  fontSize: number;
  theme: ThemeMode;
  onOpenSurahList: () => void;
  // Audio playback connection
  activePlayingAyah: { surah: number; ayah: number } | null;
  isPlaying: boolean;
  isAudioBuffering?: boolean;
  onPlayAyah: (surah: number, ayah: number) => void;
  onTogglePlay: () => void;
  soundEnabled: boolean;
}

export function QuranSurahReader({
  surahNumber,
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
}: QuranSurahReaderProps) {
  const [surahData, setSurahData] = useState<QuranSurahData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'verse' | 'mushaf'>('verse');
  const [showAllTafsir, setShowAllTafsir] = useState<boolean>(false);
  const [expandedTafsirAyahs, setExpandedTafsirAyahs] = useState<Record<number, boolean>>({});
  const [searchInSurah, setSearchInSurah] = useState<string>('');
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [ayahCounters, setAyahCounters] = useState<Record<number, number>>({});
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(`quran_bookmarks_${surahNumber}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const activeAyahRef = useRef<HTMLDivElement | null>(null);

  // Get current surah metadata
  const surahMeta: SurahMeta =
    QURAN_SURAHS.find((s) => s.number === surahNumber) || QURAN_SURAHS[0];

  // Get current tafsir edition metadata
  const currentEditionMeta =
    TAFSIR_TRANSLATION_EDITIONS.find((e) => e.identifier === tafsirEdition) ||
    TAFSIR_TRANSLATION_EDITIONS[0];

  // Fetch Surah when surahNumber or tafsirEdition changes
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    fetchSurahWithEdition(surahNumber, tafsirEdition)
      .then((data) => {
        if (!isCancelled) {
          setSurahData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error('Error fetching surah:', err);
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [surahNumber, tafsirEdition]);

  // Load bookmarks when surah changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`quran_bookmarks_${surahNumber}`);
      setBookmarkedAyahs(saved ? JSON.parse(saved) : []);
    } catch {
      setBookmarkedAyahs([]);
    }
    setAyahCounters({});
  }, [surahNumber]);

  // Auto-scroll to active playing ayah
  useEffect(() => {
    if (
      activePlayingAyah &&
      activePlayingAyah.surah === surahNumber &&
      activeAyahRef.current
    ) {
      activeAyahRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activePlayingAyah, surahNumber]);

  // Bookmark toggle handler
  const handleToggleBookmark = (ayahNum: number) => {
    setBookmarkedAyahs((prev) => {
      const next = prev.includes(ayahNum)
        ? prev.filter((n) => n !== ayahNum)
        : [...prev, ayahNum];
      try {
        localStorage.setItem(`quran_bookmarks_${surahNumber}`, JSON.stringify(next));
      } catch {
        // Ignore storage error
      }
      return next;
    });
  };

  // Copy ayah text handler
  const handleCopyAyah = (ayah: QuranAyahItem) => {
    const textToCopy = `﴿${ayah.text}﴾ [سورة ${surahMeta.name}: ${ayah.numberInSurah}]${
      ayah.tafsir ? `\n\nتفسير: ${ayah.tafsir}` : ayah.translation ? `\n\nTranslation: ${ayah.translation}` : ''
    }`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAyah(ayah.numberInSurah);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  // Ayah repetition counter for memorization
  const handleIncrementAyahCount = (ayahNum: number) => {
    if (soundEnabled) {
      playClickTone();
    }
    setAyahCounters((prev) => {
      const count = (prev[ayahNum] || 0) + 1;
      if (count === 3 || count === 7) {
        if (soundEnabled) playCompleteChime();
      }
      return { ...prev, [ayahNum]: count };
    });
  };

  // Filter ayahs based on search term in surah
  const displayAyahs = (surahData?.ayahs || []).filter((ayah) => {
    if (!searchInSurah.trim()) return true;
    const q = searchInSurah.toLowerCase().trim();
    return (
      ayah.text.includes(q) ||
      (ayah.tafsir && ayah.tafsir.toLowerCase().includes(q)) ||
      (ayah.translation && ayah.translation.toLowerCase().includes(q)) ||
      String(ayah.numberInSurah) === q
    );
  });

  const isCurrentPlayingSurah = activePlayingAyah?.surah === surahNumber;

  return (
    <div className="max-w-4xl mx-auto py-2">
      {/* Top Quran Navigation and Quick Controls */}
      <div
        className={`p-4 rounded-3xl border mb-4 shadow-sm transition-all ${
          theme === 'dark'
            ? 'bg-stone-900 border-stone-800 text-stone-100'
            : theme === 'sepia'
            ? 'bg-[#fcf7ed] border-[#e6d8c3] text-[#2b2416]'
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Surah Selector Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200/60 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSurahList}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs"
            >
              <BookOpen className="w-4 h-4" />
              <span>فهرس السور ({surahNumber}/١١٤)</span>
            </button>

            {/* Quick Prev/Next Surah */}
            <div className="flex items-center gap-1">
              <button
                disabled={surahNumber <= 1}
                onClick={() => onSelectSurah(surahNumber - 1)}
                className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 disabled:opacity-30 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
                title="السورة السابقة"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                disabled={surahNumber >= 114}
                onClick={() => onSelectSurah(surahNumber + 1)}
                className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 disabled:opacity-30 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
                title="السورة التالية"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reciter & Tafsir Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Play Whole Surah Button */}
            <button
              onClick={() => {
                if (isCurrentPlayingSurah && isPlaying) {
                  onTogglePlay();
                } else {
                  onPlayAyah(surahNumber, 1);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isCurrentPlayingSurah && isPlaying
                  ? 'bg-amber-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
            >
              {isCurrentPlayingSurah && isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>إيقاف التلاوة</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>استماع للسورة كاملة</span>
                </>
              )}
            </button>

            {/* Reciter Selector Button */}
            <button
              onClick={onOpenReciterModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs hover:border-emerald-500 transition-colors"
              title="تغيير القارئ"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-stone-400 hidden sm:inline">القارئ:</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-300 truncate max-w-[130px]">
                {reciter.name.replace('الشيخ ', '')}
              </span>
            </button>

            {/* Tafsir / Translation Selector Button */}
            <button
              onClick={onOpenTafsirModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs hover:border-emerald-500 transition-colors"
              title="تغيير التفسير أو لغة الترجمة"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-stone-400 hidden sm:inline">التفسير:</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-300 truncate max-w-[130px]">
                {currentEditionMeta.name}
              </span>
            </button>
          </div>
        </div>

        {/* View Options & Search Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
          {/* Mode switch (Verse by Verse vs Continuous Mushaf) */}
          <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800/80 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('verse')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'verse'
                  ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>آية وتفسير</span>
            </button>
            <button
              onClick={() => setViewMode('mushaf')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'mushaf'
                  ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>المصحف المتصل</span>
            </button>
          </div>

          {/* Quick Tafsir Global Toggle (In Verse Mode) */}
          {viewMode === 'verse' && (
            <button
              onClick={() => setShowAllTafsir(!showAllTafsir)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                showAllTafsir
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'border-stone-200 dark:border-stone-700 text-stone-500 hover:bg-stone-50'
              }`}
            >
              {showAllTafsir ? 'إخفاء التفسير للكل' : 'عرض التفسير لجميع الآيات'}
            </button>
          )}

          {/* Search inside Surah */}
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              value={searchInSurah}
              onChange={(e) => setSearchInSurah(e.target.value)}
              placeholder="ابحث في آيات السورة..."
              className="w-full pl-7 pr-8 py-1.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <Search className="w-3.5 h-3.5 absolute right-2.5 top-2 text-stone-400" />
            {searchInSurah && (
              <button
                onClick={() => setSearchInSurah('')}
                className="absolute left-2.5 top-1.5 text-[10px] text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Ornate Surah Header Card */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border-2 text-center mb-6 shadow-md relative overflow-hidden ${
          theme === 'dark'
            ? 'bg-stone-900 border-amber-900/40 text-stone-100'
            : theme === 'sepia'
            ? 'bg-[#fdf9f0] border-amber-200 text-[#2b2416]'
            : 'bg-white border-emerald-800/20 text-stone-900'
        }`}
      >
        {/* Background Decorative Pattern */}
        <div className="absolute top-2 right-4 text-amber-500/20 text-xl select-none">۞</div>
        <div className="absolute top-2 left-4 text-amber-500/20 text-xl select-none">۞</div>
        <div className="absolute bottom-2 right-4 text-amber-500/20 text-xl select-none">۞</div>
        <div className="absolute bottom-2 left-4 text-amber-500/20 text-xl select-none">۞</div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700 text-emerald-100 text-xs font-semibold mb-2">
          <span>الجزء {surahMeta.juzStart}</span>
          <span>•</span>
          <span>صفحة {surahMeta.pageStart}</span>
          <span>•</span>
          <span>{surahMeta.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
          <span>•</span>
          <span>ترتيب النزول: {surahMeta.revelationOrder}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold font-quran text-amber-800 dark:text-amber-400 mb-2">
          سُورَةُ {surahMeta.name}
        </h2>

        <p className="text-xs text-stone-500 dark:text-stone-400 mb-4 font-mono">
          {surahMeta.englishName} • {surahMeta.englishNameTranslation} • {surahMeta.numberOfAyahs} آيات
        </p>

        {/* Basmalah (Shown for all Surahs except Surah 9 At-Tawbah and Surah 1 Al-Fatiha which starts with Basmalah) */}
        {surahNumber !== 9 && (
          <div className="pt-3 border-t border-amber-500/20 inline-block px-8">
            <h3 className="text-xl sm:text-2xl font-quran text-emerald-800 dark:text-emerald-300 font-bold">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </h3>
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <div className="text-center py-20">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-stone-600 dark:text-stone-400">
            جاري تحميل سورة {surahMeta.name} ونصوص التفسير...
          </p>
        </div>
      ) : displayAyahs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
          <BookOpen className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <p className="text-xs text-stone-500">لا توجد آيات مطابقة للبحث في هذه السورة</p>
        </div>
      ) : viewMode === 'verse' ? (
        /* Verse by Verse Mode */
        <div className="space-y-4">
          {displayAyahs.map((ayah) => {
            const isPlayingThis =
              activePlayingAyah?.surah === surahNumber &&
              activePlayingAyah?.ayah === ayah.numberInSurah;
            const isBookmarked = bookmarkedAyahs.includes(ayah.numberInSurah);
            const count = ayahCounters[ayah.numberInSurah] || 0;
            const isTafsirOpen = showAllTafsir || expandedTafsirAyahs[ayah.numberInSurah];

            return (
              <div
                key={ayah.numberInSurah}
                ref={isPlayingThis ? activeAyahRef : null}
                id={`quran-ayah-${surahNumber}-${ayah.numberInSurah}`}
                className={`p-4 sm:p-6 rounded-2xl border transition-all relative ${
                  isPlayingThis
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 ring-2 ring-emerald-500/40 shadow-md'
                    : 'border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-emerald-300 dark:hover:border-emerald-800 shadow-2xs'
                }`}
              >
                {/* Top Ayah Meta & Action Bar */}
                <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                        isPlayingThis
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      {ayah.numberInSurah}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      سورة {surahMeta.name} • آية {ayah.numberInSurah}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {/* Play Ayah Audio */}
                    <button
                      onClick={() => onPlayAyah(surahNumber, ayah.numberInSurah)}
                      className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                        isPlayingThis
                          ? 'bg-emerald-600 text-white'
                          : 'text-stone-500 hover:text-emerald-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                      title="استماع لهذه الآية"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="text-[11px] hidden sm:inline">
                        {isPlayingThis ? 'يُتلى الآن' : 'استماع'}
                      </span>
                    </button>

                    {/* Toggle Tafsir */}
                    <button
                      onClick={() =>
                        setExpandedTafsirAyahs((prev) => ({
                          ...prev,
                          [ayah.numberInSurah]: !prev[ayah.numberInSurah],
                        }))
                      }
                      className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                        isTafsirOpen
                          ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                          : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                      title="عرض التفسير والترجمة"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span className="text-[11px] hidden sm:inline">التفسير</span>
                    </button>

                    {/* Bookmark */}
                    <button
                      onClick={() => handleToggleBookmark(ayah.numberInSurah)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isBookmarked ? 'text-amber-500' : 'text-stone-400 hover:text-amber-500'
                      }`}
                      title="حفظ الآية في المحفوظات"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                    </button>

                    {/* Copy */}
                    <button
                      onClick={() => handleCopyAyah(ayah)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      title="نسخ الآية مع المرجع"
                    >
                      {copiedAyah === ayah.numberInSurah ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Memorization Repetition Counter */}
                    <button
                      onClick={() => handleIncrementAyahCount(ayah.numberInSurah)}
                      className="px-2 py-1 rounded-lg text-[11px] font-bold bg-stone-100 dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 transition-colors"
                      title="عداد تكرار الحفظ"
                    >
                      تكرار {count > 0 ? `(${count})` : '+١'}
                    </button>
                  </div>
                </div>

                {/* Quranic Ayah Text */}
                <div className="py-2 text-center sm:text-right px-1 sm:px-3">
                  <p
                    className="font-quran leading-loose text-stone-900 dark:text-stone-100 select-text"
                    style={{ fontSize: `${fontSize + 2}px` }}
                  >
                    {ayah.text}{' '}
                    <span className="ayah-number text-emerald-600 font-serif text-[0.85em] select-none">
                      ﴿{ayah.numberInSurah}﴾
                    </span>
                  </p>
                </div>

                {/* Tafsir or Translation Drawer */}
                {isTafsirOpen && (
                  <div className="mt-3 pt-3 border-t border-stone-200/60 dark:border-stone-800 animate-in fade-in">
                    <div
                      className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                        theme === 'dark'
                          ? 'bg-stone-800/80 border-stone-700 text-stone-200'
                          : theme === 'sepia'
                          ? 'bg-[#f7efe0] border-[#decbb2] text-[#3d3320]'
                          : 'bg-emerald-50/50 border-emerald-200/60 text-stone-800'
                      }`}
                      dir={currentEditionMeta.direction}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <strong className="text-emerald-800 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                          <span>📖 {currentEditionMeta.name}</span>
                          <span className="text-[10px] font-normal text-stone-500">
                            ({currentEditionMeta.languageName})
                          </span>
                        </strong>
                      </div>
                      <p className="select-text">
                        {ayah.tafsir || ayah.translation || 'التفسير متاح عند الاتصال بالشبكة.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Photographed Medina Mushaf View */
        <PhotographedMushafView
          initialPage={surahMeta.pageStart}
          currentSurahNumber={surahNumber}
          onSelectSurah={onSelectSurah}
          reciter={reciter}
          onOpenReciterModal={onOpenReciterModal}
          tafsirEdition={tafsirEdition}
          onOpenTafsirModal={onOpenTafsirModal}
          fontSize={fontSize}
          theme={theme}
          onOpenSurahList={onOpenSurahList}
          activePlayingAyah={activePlayingAyah}
          isPlaying={isPlaying}
          onPlayAyah={onPlayAyah}
          onTogglePlay={onTogglePlay}
          soundEnabled={soundEnabled}
        />
      )}


      {/* Bottom Surah Navigation Footer */}
      <div className="flex items-center justify-between gap-3 mt-8 pt-4 border-t border-stone-200/60 dark:border-stone-800">
        <button
          disabled={surahNumber <= 1}
          onClick={() => {
            onSelectSurah(surahNumber - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 text-xs font-bold transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
          <span>السورة السابقة</span>
        </button>

        <button
          onClick={onOpenSurahList}
          className="px-4 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors"
        >
          فهرس جميع السور (١١٤)
        </button>

        <button
          disabled={surahNumber >= 114}
          onClick={() => {
            onSelectSurah(surahNumber + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30 text-xs font-bold transition-colors"
        >
          <span>السورة التالية</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
