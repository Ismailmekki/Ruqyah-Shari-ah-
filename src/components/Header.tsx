import { useState } from 'react';
import {
  BookOpen,
  Headphones,
  ScrollText,
  HelpCircle,
  Sun,
  Moon,
  Coffee,
  RotateCcw,
  Search,
  CheckCircle2,
  Volume2,
  SlidersHorizontal,
  Globe,
  User,
  Sparkles,
  Layers,
  LogOut,
} from 'lucide-react';
import { ActiveTab, ThemeMode } from '../types';
import { useAuth } from '../context/AuthContext.tsx';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  fontSize: number;
  setFontSize: (size: number | ((prev: number) => number)) => void;
  completedCount: number;
  totalCount: number;
  onResetProgress: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isPlayingGlobal: boolean;
  onTogglePlayGlobal: () => void;
  currentReciterName: string;
  onOpenReciterSelector: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
  currentSurahName?: string;
  onOpenSurahListModal: () => void;
  onOpenTafsirModal: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  fontSize,
  setFontSize,
  completedCount,
  totalCount,
  onResetProgress,
  searchQuery,
  setSearchQuery,
  isPlayingGlobal,
  onTogglePlayGlobal,
  currentReciterName,
  onOpenReciterSelector,
  soundEnabled,
  setSoundEnabled,
  currentSurahName,
  onOpenSurahListModal,
  onOpenTafsirModal,
}: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signInWithGoogle, logOut } = useAuth();

  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
        theme === 'dark'
          ? 'bg-stone-900/90 border-stone-800 text-stone-100'
          : theme === 'sepia'
          ? 'bg-amber-50/90 border-amber-200/80 text-stone-900'
          : 'bg-white/90 border-stone-200 text-stone-900'
      }`}
    >
      {/* Top Banner */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight flex items-center gap-2">
              <span>المصحف الشريف والرقية الشرعية</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-normal border border-emerald-200 hidden sm:inline">
                ١١٤ سورة • ٣٢ قارئاً • تفسير بكل اللغات
              </span>
            </h1>
            <p className="text-xs text-stone-500 hidden md:block">
              قراءة واستماع • تفسير وترجمات عالمية • رقية شرعية كاملة مع التكرار
            </p>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Audio Play Button */}
          <button
            id="header-play-ruqyah-btn"
            onClick={onTogglePlayGlobal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${
              isPlayingGlobal
                ? 'bg-emerald-600 text-white animate-pulse'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
            }`}
            title="تشغيل التلاوة الصوتية"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingGlobal ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {isPlayingGlobal ? 'التلاوة جارية...' : 'استماع صوتي'}
            </span>
          </button>

          {/* Reciter quick badge */}
          <button
            id="header-reciter-btn"
            onClick={onOpenReciterSelector}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-emerald-300 transition-colors bg-stone-50/70 dark:bg-stone-800/70"
            title="اختيار القارئ من بين 32 قارئاً"
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-stone-400 hidden lg:inline">القارئ:</span>
            <span className="font-medium text-emerald-700 dark:text-emerald-300 truncate max-w-[110px]">
              {currentReciterName.replace('الشيخ ', '')}
            </span>
          </button>

          {/* Tafsir Quick Button */}
          <button
            id="header-tafsir-btn"
            onClick={onOpenTafsirModal}
            className="hidden sm:flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-emerald-300 transition-colors bg-stone-50/70 dark:bg-stone-800/70"
            title="اختيار التفسير أو لغة الترجمة"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium text-stone-700 dark:text-stone-300">التفسير واللغات</span>
          </button>

          {/* Search Toggle (For Ruqyah) */}
          {activeTab === 'cards' && (
            <button
              id="header-search-toggle"
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-xl transition-colors border ${
                showSearch
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
              title="البحث في آيات الرقية"
              aria-label="البحث"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Settings & Customization Dropdown Button */}
          <div className="relative">
            <button
              id="header-settings-toggle"
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
              title="تخصيص الخط والمظهر والأصوات"
              aria-label="الإعدادات"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {showSettingsMenu && (
              <div
                className={`absolute left-0 mt-2 w-64 p-3 rounded-2xl shadow-xl border z-50 transition-all ${
                  theme === 'dark'
                    ? 'bg-stone-800 border-stone-700 text-stone-100'
                    : 'bg-white border-stone-200 text-stone-800'
                }`}
              >
                {/* Theme Selector */}
                <div className="mb-3">
                  <div className="text-xs font-semibold text-stone-400 mb-1.5">مظهر القراءة</div>
                  <div className="grid grid-cols-3 gap-1.5 bg-stone-100 dark:bg-stone-900 p-1 rounded-xl">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex items-center justify-center gap-1 py-1.5 text-xs rounded-lg font-medium transition-all ${
                        theme === 'light'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      <span>نهاري</span>
                    </button>
                    <button
                      onClick={() => setTheme('sepia')}
                      className={`flex items-center justify-center gap-1 py-1.5 text-xs rounded-lg font-medium transition-all ${
                        theme === 'sepia'
                          ? 'bg-amber-100 text-amber-900 shadow-xs'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      <Coffee className="w-3.5 h-3.5" />
                      <span>دافئ</span>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex items-center justify-center gap-1 py-1.5 text-xs rounded-lg font-medium transition-all ${
                        theme === 'dark'
                          ? 'bg-stone-700 text-white shadow-xs'
                          : 'text-stone-500 hover:text-stone-300'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span>ليلي</span>
                    </button>
                  </div>
                </div>

                {/* Font Size Adjuster */}
                <div className="mb-3">
                  <div className="text-xs font-semibold text-stone-400 mb-1.5 flex justify-between">
                    <span>حجم الخط القرآني</span>
                    <span className="text-emerald-600 font-bold">{fontSize}px</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFontSize((s) => Math.max(18, s - 2))}
                      className="flex-1 py-1 text-xs font-bold border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700"
                    >
                      أ- تصغير
                    </button>
                    <button
                      onClick={() => setFontSize(26)}
                      className="px-2 py-1 text-xs border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700"
                    >
                      افتراضي
                    </button>
                    <button
                      onClick={() => setFontSize((s) => Math.min(44, s + 2))}
                      className="flex-1 py-1 text-xs font-bold border border-stone-200 dark:border-stone-700 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700"
                    >
                      أ+ تكبير
                    </button>
                  </div>
                </div>

                {/* Sound toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-700">
                  <span className="text-xs">صوت التكرار الهادئ</span>
                  <button
                    onClick={() => setSoundEnabled((v) => !v)}
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                      soundEnabled ? 'bg-emerald-600 justify-end' : 'bg-stone-300 dark:bg-stone-700 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Account / Cloud Sync Button */}
          <div className="relative">
            {user ? (
              <button
                id="header-user-profile-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 p-1.5 px-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                title="الملف الشخصي والمزامنة السحابية"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                    {user.displayName ? user.displayName.charAt(0) : 'م'}
                  </div>
                )}
                <span className="hidden sm:inline max-w-[80px] truncate">{user.displayName || 'حسابي'}</span>
              </button>
            ) : (
              <button
                id="header-signin-btn"
                onClick={() => signInWithGoogle()}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 transition-colors"
                title="تسجيل الدخول لمزامنة تقدم القراءة والأوراد"
              >
                <User className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">مزامنة الحساب</span>
              </button>
            )}

            {/* User Menu Dropdown */}
            {showUserMenu && user && (
              <div
                className={`absolute left-0 mt-2 w-56 p-3 rounded-2xl shadow-xl border z-50 transition-all ${
                  theme === 'dark'
                    ? 'bg-stone-800 border-stone-700 text-stone-100'
                    : 'bg-white border-stone-200 text-stone-800'
                }`}
              >
                <div className="pb-2 mb-2 border-b border-stone-100 dark:border-stone-700">
                  <div className="text-xs font-bold truncate">{user.displayName || 'المستخدم'}</div>
                  <div className="text-[11px] text-stone-400 truncate">{user.email}</div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="w-3 h-3" />
                    <span>المزامنة السحابية مفعلة</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logOut();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-right py-1.5 px-2 rounded-lg text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>تسجيل الخروج</span>
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Ruqyah Progress counter */}
          {activeTab !== 'quran' && (
            <div className="flex items-center gap-1.5 pl-1 border-r border-stone-200 dark:border-stone-800 pr-2">
              <div className="flex items-center gap-1 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {completedCount}/{totalCount}
                </span>
              </div>

              <button
                id="header-reset-progress-btn"
                onClick={() => setShowResetConfirm(true)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="إعادة ضبط عدادات الرقية"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Input Bar (Expandable in cards tab) */}
      {showSearch && activeTab === 'cards' && (
        <div className="border-t border-stone-200 dark:border-stone-800 px-4 py-2 bg-stone-50 dark:bg-stone-900/50">
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              id="ruqyah-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم السورة، كلمات من الآية، أو فضلها..."
              className="w-full pl-8 pr-10 py-2 rounded-xl text-sm border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />
            <Search className="w-4 h-4 absolute right-3 top-3 text-stone-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-2.5 text-xs text-stone-400 hover:text-stone-600 px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700"
              >
                مسح
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800/80 overflow-x-auto no-scrollbar">
          <nav className="flex gap-1 py-1.5" aria-label="أنماط العرض">
            {/* Tab 1: Complete Quran (114 Surahs) */}
            <button
              id="tab-quran"
              onClick={() => setActiveTab('quran')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'quran'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>المصحف الشريف كاملاً (١١٤ سورة)</span>
            </button>

            {/* Tab 2: Ruqyah Cards */}
            <button
              id="tab-cards"
              onClick={() => setActiveTab('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'cards'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>أوراد الرقية الشرعية</span>
            </button>

            {/* Tab 3: Ruqyah Mushaf */}
            <button
              id="tab-mushaf"
              onClick={() => setActiveTab('mushaf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'mushaf'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <ScrollText className="w-4 h-4" />
              <span>مصحف آيات الرقية</span>
            </button>

            {/* Tab 4: Audio Focus */}
            <button
              id="tab-audio"
              onClick={() => setActiveTab('audio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'audio'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>الاستماع والسكينة</span>
            </button>

            {/* Tab 5: Ruqyah Guide */}
            <button
              id="tab-guide"
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'guide'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>آداب وتوجيهات الشفاء</span>
            </button>
          </nav>

          {/* Quick Index Button when in Quran tab */}
          {activeTab === 'quran' && (
            <button
              onClick={onOpenSurahListModal}
              className="hidden lg:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800"
            >
              <span>اختر سورة: {currentSurahName || 'الفاتحة'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div
            className={`max-w-sm w-full p-5 rounded-2xl shadow-2xl border ${
              theme === 'dark'
                ? 'bg-stone-800 border-stone-700 text-stone-100'
                : 'bg-white border-stone-200 text-stone-800'
            }`}
          >
            <h3 className="font-bold text-base mb-2">إعادة تصفير عدادات الرقية؟</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              سيتم إعادة ضبط جميع أعداد التلاوة المقروءة في هذه الجلسة للبدء من جديد.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onResetProgress();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                تأكيد البدء من جديد
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
