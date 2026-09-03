/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  ActiveTab,
  Reciter,
  RuqyahCategoryType,
  RuqyahItem,
  ThemeMode,
} from './types';
import { RUQYAH_ITEMS } from './data/ruqyahData';
import { RECITERS } from './data/recitersData';
import { QURAN_SURAHS } from './data/quranSurahsData';
import { getAyahAudioUrl } from './utils/audioUtils';
import { Header } from './components/Header';
import { CategoriesFilter } from './components/CategoriesFilter';
import { RuqyahCard } from './components/RuqyahCard';
import { MushafView } from './components/MushafView';
import { PhotographedMushafView } from './components/PhotographedMushafView';
import { QuranSurahReader } from './components/QuranSurahReader';

import { QuranSurahListModal } from './components/QuranSurahListModal';
import { TafsirLanguageModal } from './components/TafsirLanguageModal';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { AudioFocusView } from './components/AudioFocusView';
import { RuqyahGuide } from './components/RuqyahGuideModal';
import { ReciterModal } from './components/ReciterModal';
import { DailyTrackerModal } from './components/DailyTrackerModal';
import {
  Calendar,
  Bookmark,
  BookOpen,
  Sparkles,
} from 'lucide-react';


export default function App() {
  // Theme & Reading Preferences
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('ruqyah_theme') as ThemeMode) || 'light';
  });
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem('ruqyah_fontsize');
    return saved ? parseInt(saved, 10) : 26;
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('ruqyah_sound_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  // Navigation & Category Filtering
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    const savedTab = localStorage.getItem('quran_active_tab') as ActiveTab;
    return savedTab || 'quran';
  });
  const [selectedCategory, setSelectedCategory] = useState<RuqyahCategoryType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyBookmarks, setOnlyBookmarks] = useState<boolean>(false);
  const [mushafTabScope, setMushafTabScope] = useState<'complete_quran' | 'ruqyah'>('complete_quran');


  // Quran State (Surah & Tafsir)
  const [currentSurahNumber, setCurrentSurahNumber] = useState<number>(() => {
    const saved = localStorage.getItem('quran_current_surah');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [tafsirEdition, setTafsirEdition] = useState<string>(() => {
    return localStorage.getItem('quran_tafsir_edition') || 'ar.muyassar';
  });

  // User Progress & Bookmarks (Ruqyah)
  const [itemCounts, setItemCounts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('ruqyah_counts');
    return saved ? JSON.parse(saved) : {};
  });
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ruqyah_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  // Reciter & Audio Playback State
  const [reciter, setReciter] = useState<Reciter>(() => {
    const savedId = localStorage.getItem('ruqyah_reciter_id');
    return RECITERS.find((r) => r.id === savedId) || RECITERS[0];
  });
  const [currentItem, setCurrentItem] = useState<RuqyahItem | null>(null);
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number>(0);
  const [quranPlayingRef, setQuranPlayingRef] = useState<{ surah: number; ayah: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'item' | 'all'>('all');
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);

  // Modals
  const [showReciterModal, setShowReciterModal] = useState<boolean>(false);
  const [showTrackerModal, setShowTrackerModal] = useState<boolean>(false);
  const [showSurahListModal, setShowSurahListModal] = useState<boolean>(false);
  const [showTafsirModal, setShowTafsirModal] = useState<boolean>(false);
  const [isAudioBuffering, setIsAudioBuffering] = useState<boolean>(false);

  // Audio HTML Element Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Current Surah metadata
  const currentSurahMeta = useMemo(() => {
    return QURAN_SURAHS.find((s) => s.number === currentSurahNumber) || QURAN_SURAHS[0];
  }, [currentSurahNumber]);

  // Synchronize Preferences with LocalStorage
  useEffect(() => {
    localStorage.setItem('ruqyah_theme', theme);
    document.documentElement.classList.remove('dark', 'sepia');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-stone-950 text-stone-100 antialiased';
    } else if (theme === 'sepia') {
      document.documentElement.classList.add('sepia');
      document.body.className = 'bg-[#fbf7ee] text-[#2b2416] antialiased';
    } else {
      document.body.className = 'bg-stone-50 text-stone-900 antialiased';
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('quran_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('quran_current_surah', String(currentSurahNumber));
  }, [currentSurahNumber]);

  useEffect(() => {
    localStorage.setItem('quran_tafsir_edition', tafsirEdition);
  }, [tafsirEdition]);

  useEffect(() => {
    localStorage.setItem('ruqyah_fontsize', String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('ruqyah_sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('ruqyah_counts', JSON.stringify(itemCounts));
  }, [itemCounts]);

  useEffect(() => {
    localStorage.setItem('ruqyah_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  useEffect(() => {
    localStorage.setItem('ruqyah_reciter_id', reciter.id);
  }, [reciter]);

  // Filter Ruqyah items based on category, search query, and bookmarks
  const filteredItems = useMemo(() => {
    return RUQYAH_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (!item.categories.includes(selectedCategory)) {
          return false;
        }
      }

      // Bookmark filter
      if (onlyBookmarks && !bookmarkedIds.includes(item.id)) {
        return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const inTitle = item.title.toLowerCase().includes(q);
        const inText = item.arabicText.toLowerCase().includes(q);
        const inVirtue = item.virtue ? item.virtue.toLowerCase().includes(q) : false;
        const inSurah = item.surahName ? item.surahName.toLowerCase().includes(q) : false;
        return inTitle || inText || inVirtue || inSurah;
      }

      return true;
    });
  }, [selectedCategory, onlyBookmarks, bookmarkedIds, searchQuery]);

  // Counts per category for pills
  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = { all: RUQYAH_ITEMS.length };
    RUQYAH_ITEMS.forEach((item) => {
      item.categories.forEach((cat) => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return counts;
  }, []);

  // Total Completed Verses count
  const completedCount = useMemo(() => {
    return RUQYAH_ITEMS.filter(
      (item) => (itemCounts[item.id] || 0) >= item.recommendedCount
    ).length;
  }, [itemCounts]);

  // Audio Playback Engine for Quran Verses
  const playAudioForQuranAyah = useCallback(
    (surah: number, ayah: number) => {
      const url = getAyahAudioUrl(reciter.baseUrl, surah, ayah);

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      const audio = audioRef.current;
      audio.pause();
      setIsAudioBuffering(true);
      audio.src = url;
      audio.playbackRate = playbackRate;

      setQuranPlayingRef({ surah, ayah });
      setCurrentItem(null);
      setCurrentSurahNumber(surah);

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsAudioBuffering(false);
        })
        .catch((err) => {
          console.warn('Quran audio playback error:', err);
          setIsAudioBuffering(false);
          setIsPlaying(false);
        });
    },
    [reciter.baseUrl, playbackRate]
  );

  // Audio Playback Engine for Ruqyah Verses
  const playAudioForRuqyahAyah = useCallback(
    (item: RuqyahItem, ayahIdx: number) => {
      if (!item.audioAyahs || item.audioAyahs.length === 0) return;
      const ref = item.audioAyahs[ayahIdx];
      if (!ref) return;

      const url = getAyahAudioUrl(reciter.baseUrl, ref.surah, ref.ayah);

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      const audio = audioRef.current;
      audio.pause();
      setIsAudioBuffering(true);
      audio.src = url;
      audio.playbackRate = playbackRate;

      setQuranPlayingRef(null);
      setCurrentItem(item);
      setCurrentAyahIndex(ayahIdx);

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsAudioBuffering(false);
        })
        .catch((err) => {
          console.warn('Ruqyah audio playback error:', err);
          setIsAudioBuffering(false);
          setIsPlaying(false);
        });
    },
    [reciter.baseUrl, playbackRate]
  );

  // Handler for smoothly switching surahs (from modal, random button, or reader)
  const handleSelectSurah = useCallback(
    (surahNum: number, autoPlayIfActive: boolean = true) => {
      const safeNum = Math.max(1, Math.min(114, surahNum));
      setCurrentSurahNumber(safeNum);
      if (isPlaying && autoPlayIfActive) {
        playAudioForQuranAyah(safeNum, 1);
      } else {
        setQuranPlayingRef({ surah: safeNum, ayah: 1 });
        setCurrentItem(null);
      }
    },
    [isPlaying, playAudioForQuranAyah]
  );

  // Play next Ayah
  const handleAudioNext = useCallback(() => {
    // If playing Quran
    if (quranPlayingRef) {
      const { surah, ayah } = quranPlayingRef;
      const currentMeta = QURAN_SURAHS.find((s) => s.number === surah);
      const maxAyahs = currentMeta ? currentMeta.numberOfAyahs : 7;

      if (ayah < maxAyahs) {
        playAudioForQuranAyah(surah, ayah + 1);
      } else if (surah < 114) {
        // Next surah
        setCurrentSurahNumber(surah + 1);
        playAudioForQuranAyah(surah + 1, 1);
      } else if (repeatMode === 'all') {
        setCurrentSurahNumber(1);
        playAudioForQuranAyah(1, 1);
      } else {
        setIsPlaying(false);
      }
      return;
    }

    // If playing Ruqyah
    if (!currentItem) {
      if (filteredItems.length > 0) {
        playAudioForRuqyahAyah(filteredItems[0], 0);
      }
      return;
    }

    const totalAyahs = currentItem.audioAyahs?.length || 0;
    if (currentAyahIndex + 1 < totalAyahs) {
      playAudioForRuqyahAyah(currentItem, currentAyahIndex + 1);
    } else {
      const currentItemIdx = RUQYAH_ITEMS.findIndex((i) => i.id === currentItem.id);
      const nextItems = RUQYAH_ITEMS.slice(currentItemIdx + 1).filter(
        (i) => i.audioAyahs && i.audioAyahs.length > 0
      );

      if (nextItems.length > 0) {
        playAudioForRuqyahAyah(nextItems[0], 0);
      } else if (repeatMode === 'all') {
        const firstAudioItem = RUQYAH_ITEMS.find((i) => i.audioAyahs && i.audioAyahs.length > 0);
        if (firstAudioItem) {
          playAudioForRuqyahAyah(firstAudioItem, 0);
        }
      } else {
        setIsPlaying(false);
      }
    }
  }, [quranPlayingRef, currentItem, currentAyahIndex, filteredItems, repeatMode, playAudioForQuranAyah, playAudioForRuqyahAyah]);

  // Play previous Ayah
  const handleAudioPrev = useCallback(() => {
    // If playing Quran
    if (quranPlayingRef) {
      const { surah, ayah } = quranPlayingRef;
      if (ayah > 1) {
        playAudioForQuranAyah(surah, ayah - 1);
      } else if (surah > 1) {
        const prevMeta = QURAN_SURAHS.find((s) => s.number === surah - 1);
        setCurrentSurahNumber(surah - 1);
        playAudioForQuranAyah(surah - 1, prevMeta?.numberOfAyahs || 1);
      }
      return;
    }

    // If playing Ruqyah
    if (!currentItem) return;

    if (currentAyahIndex > 0) {
      playAudioForRuqyahAyah(currentItem, currentAyahIndex - 1);
    } else {
      const currentItemIdx = RUQYAH_ITEMS.findIndex((i) => i.id === currentItem.id);
      const prevItems = RUQYAH_ITEMS.slice(0, currentItemIdx)
        .reverse()
        .filter((i) => i.audioAyahs && i.audioAyahs.length > 0);

      if (prevItems.length > 0) {
        const prevItem = prevItems[0];
        const lastAyahIdx = (prevItem.audioAyahs?.length || 1) - 1;
        playAudioForRuqyahAyah(prevItem, lastAyahIdx);
      }
    }
  }, [quranPlayingRef, currentItem, currentAyahIndex, playAudioForQuranAyah, playAudioForRuqyahAyah]);

  // Audio Event Listeners Setup
  useEffect(() => {
    const audio = audioRef.current || new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setAudioProgress(audio.currentTime);
      setAudioDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      if (repeatMode === 'item') {
        if (quranPlayingRef) {
          playAudioForQuranAyah(quranPlayingRef.surah, quranPlayingRef.ayah);
        } else if (currentItem) {
          const totalAyahs = currentItem.audioAyahs?.length || 0;
          if (currentAyahIndex + 1 < totalAyahs) {
            playAudioForRuqyahAyah(currentItem, currentAyahIndex + 1);
          } else {
            playAudioForRuqyahAyah(currentItem, 0);
          }
        }
      } else {
        handleAudioNext();
      }
    };

    const handleError = () => {
      setIsPlaying(false);
      setIsAudioBuffering(false);
    };

    const handleWaiting = () => {
      setIsAudioBuffering(true);
    };

    const handleCanPlay = () => {
      setIsAudioBuffering(false);
    };

    const handlePlaying = () => {
      setIsAudioBuffering(false);
      setIsPlaying(true);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('playing', handlePlaying);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('playing', handlePlaying);
    };
  }, [quranPlayingRef, currentItem, currentAyahIndex, repeatMode, handleAudioNext, playAudioForQuranAyah, playAudioForRuqyahAyah]);

  // Toggle Global Play / Pause
  const handleTogglePlayGlobal = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (quranPlayingRef) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            playAudioForQuranAyah(quranPlayingRef.surah, quranPlayingRef.ayah);
          });
      } else if (currentItem) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            playAudioForRuqyahAyah(currentItem, currentAyahIndex);
          });
      } else {
        if (activeTab === 'quran') {
          playAudioForQuranAyah(currentSurahNumber, 1);
        } else {
          const first = RUQYAH_ITEMS.find((i) => i.audioAyahs && i.audioAyahs.length > 0);
          if (first) {
            playAudioForRuqyahAyah(first, 0);
          }
        }
      }
    }
  };

  const handleSeek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setAudioProgress(seconds);
    }
  };

  const handleChangePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleSelectReciter = (newReciter: Reciter) => {
    setReciter(newReciter);
    if (isPlaying) {
      if (quranPlayingRef) {
        playAudioForQuranAyah(quranPlayingRef.surah, quranPlayingRef.ayah);
      } else if (currentItem) {
        playAudioForRuqyahAyah(currentItem, currentAyahIndex);
      }
    }
  };

  // Repetition Counter Actions (Ruqyah)
  const handleIncrement = (id: string) => {
    setItemCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecrement = (id: string) => {
    setItemCounts((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1),
    }));
  };

  const handleResetItem = (id: string) => {
    setItemCounts((prev) => ({
      ...prev,
      [id]: 0,
    }));
  };

  const handleResetProgressAll = () => {
    setItemCounts({});
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors pb-28 ${
        theme === 'dark'
          ? 'bg-stone-950 text-stone-100'
          : theme === 'sepia'
          ? 'bg-[#fbf7ee] text-[#2b2416]'
          : 'bg-stone-50 text-stone-900'
      }`}
    >
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
        completedCount={completedCount}
        totalCount={RUQYAH_ITEMS.length}
        onResetProgress={handleResetProgressAll}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isPlayingGlobal={isPlaying}
        onTogglePlayGlobal={handleTogglePlayGlobal}
        currentReciterName={reciter.name}
        onOpenReciterSelector={() => setShowReciterModal(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        currentSurahName={currentSurahMeta.name}
        onOpenSurahListModal={() => setShowSurahListModal(true)}
        onOpenTafsirModal={() => setShowTafsirModal(true)}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-4 w-full flex-1">
        {/* Quick Top Bar: Daily Habit & Bookmarks (Only on Ruqyah tabs) */}
        {activeTab !== 'quran' && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-2 border-b border-stone-200/60 dark:border-stone-800">
            {/* Daily Tracker Button */}
            <button
              id="open-daily-tracker-btn"
              onClick={() => setShowTrackerModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors shadow-2xs"
            >
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>حصني اليومي • جدول المواظبة</span>
            </button>

            {/* Bookmarks Toggle */}
            <div className="flex items-center gap-2">
              <button
                id="toggle-bookmarks-filter"
                onClick={() => setOnlyBookmarks(!onlyBookmarks)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                  onlyBookmarks
                    ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarks ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>المحفوظات ({bookmarkedIds.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 0: Complete Quran Reader (114 Surahs with Tafsir & 32 Reciters) */}
        {activeTab === 'quran' && (
          <QuranSurahReader
            surahNumber={currentSurahNumber}
            onSelectSurah={(num) => handleSelectSurah(num)}
            reciter={reciter}
            onOpenReciterModal={() => setShowReciterModal(true)}
            tafsirEdition={tafsirEdition}
            onOpenTafsirModal={() => setShowTafsirModal(true)}
            fontSize={fontSize}
            theme={theme}
            onOpenSurahList={() => setShowSurahListModal(true)}
            activePlayingAyah={quranPlayingRef}
            isPlaying={isPlaying}
            isAudioBuffering={isAudioBuffering}
            onPlayAyah={(s, a) => playAudioForQuranAyah(s, a)}
            onTogglePlay={handleTogglePlayGlobal}
            soundEnabled={soundEnabled}
          />
        )}

        {/* Tab 1: Cards View */}
        {activeTab === 'cards' && (
          <div>
            {/* Category Pills */}
            <div className="mb-4">
              <CategoriesFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                countsByCategory={countsByCategory}
              />
            </div>

            {/* List of Ruqyah Cards */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-16 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50">
                <BookOpen className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300 mb-1">
                  لم يتم العثور على آيات مطابقة للبحث
                </h3>
                <p className="text-xs text-stone-400 mb-4">
                  جرب تغيير كلمات البحث أو إلغاء فلتر المحفوظات
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setOnlyBookmarks(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  عرض جميع آيات الرقية
                </button>
              </div>
            ) : (
              <div className="grid gap-5">
                {filteredItems.map((item) => (
                  <RuqyahCard
                    key={item.id}
                    item={item}
                    currentCount={itemCounts[item.id] || 0}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    onResetItem={handleResetItem}
                    fontSize={fontSize}
                    theme={theme}
                    isBookmarked={bookmarkedIds.includes(item.id)}
                    onToggleBookmark={handleToggleBookmark}
                    isPlayingThis={isPlaying && currentItem?.id === item.id}
                    onPlayAudioItem={(target) => playAudioForRuqyahAyah(target, 0)}
                    onStopAudio={() => {
                      if (audioRef.current) {
                        audioRef.current.pause();
                        setIsPlaying(false);
                      }
                    }}
                    soundEnabled={soundEnabled}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Authentic Medina Mushaf View (114 Surahs & 604 Pages + Ruqyah) */}
        {activeTab === 'mushaf' && (
          <div>
            {/* Scope Switcher: Complete Quran vs Ruqyah Mushaf */}
            <div className="flex items-center justify-center mb-5">
              <div className="inline-flex items-center p-1 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs">
                <button
                  onClick={() => setMushafTabScope('complete_quran')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    mushafTabScope === 'complete_quran'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>مصحف المدينة المنورة (المصحف كاملاً ١ - ٦٠٤)</span>
                </button>
                <button
                  onClick={() => setMushafTabScope('ruqyah')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    mushafTabScope === 'ruqyah'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>مصحف الرقية الشرعية</span>
                </button>
              </div>
            </div>

            {mushafTabScope === 'complete_quran' ? (
              <PhotographedMushafView
                initialPage={currentSurahMeta.pageStart}
                currentSurahNumber={currentSurahNumber}
                onSelectSurah={(num) => handleSelectSurah(num)}
                reciter={reciter}
                onOpenReciterModal={() => setShowReciterModal(true)}
                tafsirEdition={tafsirEdition}
                onOpenTafsirModal={() => setShowTafsirModal(true)}
                fontSize={fontSize}
                theme={theme}
                onOpenSurahList={() => setShowSurahListModal(true)}
                activePlayingAyah={quranPlayingRef}
                isPlaying={isPlaying}
                isAudioBuffering={isAudioBuffering}
                onPlayAyah={(s, a) => playAudioForQuranAyah(s, a)}
                onTogglePlay={handleTogglePlayGlobal}
                soundEnabled={soundEnabled}
              />
            ) : (
              <MushafView
                items={filteredItems}
                itemCounts={itemCounts}
                onIncrement={handleIncrement}
                fontSize={fontSize}
                theme={theme}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={handleToggleBookmark}
                activePlayingItemId={isPlaying && currentItem ? currentItem.id : null}
                onPlayItem={(target) => playAudioForRuqyahAyah(target, 0)}
              />
            )}
          </div>
        )}


        {/* Tab 3: Audio Focus Mode */}
        {activeTab === 'audio' && (
          <AudioFocusView
            currentItem={currentItem || RUQYAH_ITEMS[0]}
            items={RUQYAH_ITEMS}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlayGlobal}
            onNext={handleAudioNext}
            onPrev={handleAudioPrev}
            reciter={reciter}
            onSelectReciter={handleSelectReciter}
            repeatMode={repeatMode}
            onToggleRepeat={() => {
              setRepeatMode((m) => (m === 'none' ? 'item' : m === 'item' ? 'all' : 'none'));
            }}
            playbackRate={playbackRate}
            onChangePlaybackRate={handleChangePlaybackRate}
            progress={audioProgress}
            duration={audioDuration}
            onSeek={handleSeek}
            theme={theme}
            onSelectItem={(target) => playAudioForRuqyahAyah(target, 0)}
          />
        )}

        {/* Tab 4: Ruqyah Guide */}
        {activeTab === 'guide' && (
          <RuqyahGuide
            theme={theme}
            onStartRuqyah={() => {
              setActiveTab('cards');
              setSelectedCategory('all');
            }}
          />
        )}
      </main>

      {/* Floating Bottom Audio Player Bar (Sticky) */}
      <AudioPlayerBar
        isPlaying={isPlaying}
        isBuffering={isAudioBuffering}
        onTogglePlay={handleTogglePlayGlobal}
        onNext={handleAudioNext}
        onPrev={handleAudioPrev}
        currentItem={currentItem}
        currentAyahIndex={currentAyahIndex}
        totalAyahsInItem={currentItem?.audioAyahs?.length || 1}
        quranPlayingRef={quranPlayingRef}
        reciter={reciter}
        onSelectReciter={handleSelectReciter}
        repeatMode={repeatMode}
        onToggleRepeat={() => {
          setRepeatMode((m) => (m === 'none' ? 'item' : m === 'item' ? 'all' : 'none'));
        }}
        playbackRate={playbackRate}
        onChangePlaybackRate={handleChangePlaybackRate}
        progress={audioProgress}
        duration={audioDuration}
        onSeek={handleSeek}
        theme={theme}
        onOpenFocusMode={() => setActiveTab('audio')}
        onOpenQuranReader={(s) => {
          handleSelectSurah(s);
          setActiveTab('quran');
        }}
      />

      {/* 114 Surahs Index Modal */}
      <QuranSurahListModal
        isOpen={showSurahListModal}
        onClose={() => setShowSurahListModal(false)}
        currentSurahNumber={currentSurahNumber}
        onSelectSurah={(num) => {
          handleSelectSurah(num);
          setActiveTab('quran');
        }}
        theme={theme}
      />

      {/* Tafsir & Translation Edition Modal */}
      <TafsirLanguageModal
        isOpen={showTafsirModal}
        onClose={() => setShowTafsirModal(false)}
        selectedEdition={tafsirEdition}
        onSelectEdition={(ed) => setTafsirEdition(ed)}
        theme={theme}
      />

      {/* Reciter Selection Modal (32 Reciters) */}
      <ReciterModal
        isOpen={showReciterModal}
        onClose={() => setShowReciterModal(false)}
        selectedReciter={reciter}
        onSelectReciter={handleSelectReciter}
        theme={theme}
      />

      {/* Daily Tracker & Habits Modal */}
      <DailyTrackerModal
        isOpen={showTrackerModal}
        onClose={() => setShowTrackerModal(false)}
        theme={theme}
      />
    </div>
  );
}
