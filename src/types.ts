export type RuqyahSource = 'quran' | 'sunnah';

export type RuqyahCategoryType =
  | 'all'
  | 'general'
  | 'hasad_ayn'
  | 'sihr'
  | 'healing_peace'
  | 'protection'
  | 'sleep';

export interface QuranAudioRef {
  surah: number;
  ayah: number;
}

export interface RuqyahItem {
  id: string;
  title: string;
  source: RuqyahSource;
  surahName?: string;
  surahNumber?: number;
  ayahStart?: number;
  ayahEnd?: number;
  arabicText: string;
  transliteration?: string;
  recommendedCount: number;
  categories: RuqyahCategoryType[];
  virtue: string;
  audioAyahs?: QuranAudioRef[];
  explanation?: string;
  hadithSource?: string;
}

export interface Reciter {
  id: string;
  name: string;
  subname: string;
  baseUrl: string;
  formatPadding: number; // 3 digits standard: e.g. 001001.mp3
}

export type ThemeMode = 'light' | 'sepia' | 'dark';

export type ActiveTab = 'quran' | 'cards' | 'mushaf' | 'audio' | 'guide';

export interface DailySessionLog {
  date: string;
  completedItems: string[];
  durationMinutes: number;
  reciterUsed?: string;
}

export interface QuranAyahItem {
  number: number;
  numberInSurah: number;
  text: string;
  juz: number;
  page?: number;
  hizbQuarter?: number;
  translation?: string;
  tafsir?: string;
}

export interface QuranSurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
  ayahs: QuranAyahItem[];
}

export interface QuranMushafPageAyah extends QuranAyahItem {
  surahNumber: number;
  surahName: string;
  isFirstAyahOfSurah?: boolean;
}

export interface QuranMushafPageData {
  pageNumber: number;
  juzNumber: number;
  hizbQuarter?: number;
  ayahs: QuranMushafPageAyah[];
  surahs: {
    number: number;
    name: string;
    englishName: string;
    revelationType: 'Meccan' | 'Medinan';
    numberOfAyahs: number;
  }[];
}

