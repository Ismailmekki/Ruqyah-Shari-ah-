import { QuranSurahData, QuranAyahItem } from '../types';
import { QURAN_SURAHS, SurahMeta } from '../data/quranSurahsData';

// In-memory cache for loaded surahs
const surahCache: Record<string, QuranSurahData> = {};

// Fallback basic text data for critical Surahs (Al-Fatiha, Al-Ikhlas, Al-Falaq, An-Nas, Al-Kafirun, Al-Kawthar, Al-Asr)
const FALLBACK_SURAHS: Record<number, { ayahs: { text: string; numberInSurah: number; juz: number }[] }> = {
  1: {
    ayahs: [
      { numberInSurah: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', juz: 1 },
      { numberInSurah: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', juz: 1 },
      { numberInSurah: 3, text: 'الرَّحْمَٰنِ الرَّحِيمِ', juz: 1 },
      { numberInSurah: 4, text: 'مَالِكِ يَوْمِ الدِّينِ', juz: 1 },
      { numberInSurah: 5, text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', juz: 1 },
      { numberInSurah: 6, text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', juz: 1 },
      { numberInSurah: 7, text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', juz: 1 },
    ],
  },
  112: {
    ayahs: [
      { numberInSurah: 1, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ', juz: 30 },
      { numberInSurah: 2, text: 'اللَّهُ الصَّمَدُ', juz: 30 },
      { numberInSurah: 3, text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', juz: 30 },
      { numberInSurah: 4, text: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', juz: 30 },
    ],
  },
  113: {
    ayahs: [
      { numberInSurah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', juz: 30 },
      { numberInSurah: 2, text: 'مِن شَرِّ مَا خَلَقَ', juz: 30 },
      { numberInSurah: 3, text: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', juz: 30 },
      { numberInSurah: 4, text: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', juz: 30 },
      { numberInSurah: 5, text: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', juz: 30 },
    ],
  },
  114: {
    ayahs: [
      { numberInSurah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', juz: 30 },
      { numberInSurah: 2, text: 'مَلِكِ النَّاسِ', juz: 30 },
      { numberInSurah: 3, text: 'إِلَٰهِ النَّاسِ', juz: 30 },
      { numberInSurah: 4, text: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', juz: 30 },
      { numberInSurah: 5, text: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', juz: 30 },
      { numberInSurah: 6, text: 'مِنَ الْجِنَّةِ وَالنَّاسِ', juz: 30 },
    ],
  },
  108: {
    ayahs: [
      { numberInSurah: 1, text: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', juz: 30 },
      { numberInSurah: 2, text: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', juz: 30 },
      { numberInSurah: 3, text: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', juz: 30 },
    ],
  },
  103: {
    ayahs: [
      { numberInSurah: 1, text: 'وَالْعَصْرِ', juz: 30 },
      { numberInSurah: 2, text: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ', juz: 30 },
      { numberInSurah: 3, text: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ', juz: 30 },
    ],
  },
};

/**
 * Fetch Surah text and optional tafsir/translation edition
 */
export async function fetchSurahWithEdition(
  surahNumber: number,
  editionIdentifier: string = 'ar.muyassar'
): Promise<QuranSurahData> {
  const meta: SurahMeta = QURAN_SURAHS.find((s) => s.number === surahNumber) || {
    number: surahNumber,
    name: `سورة رقم ${surahNumber}`,
    englishName: `Surah ${surahNumber}`,
    englishNameTranslation: '',
    numberOfAyahs: 0,
    revelationType: 'Meccan',
    revelationOrder: 1,
    juzStart: 1,
    pageStart: 1,
  };

  const cacheKey = `${surahNumber}_${editionIdentifier}`;
  if (surahCache[cacheKey]) {
    return surahCache[cacheKey];
  }

  // Check localStorage cache
  try {
    const localSaved = localStorage.getItem(`quran_surah_${cacheKey}`);
    if (localSaved) {
      const parsed = JSON.parse(localSaved);
      surahCache[cacheKey] = parsed;
      return parsed;
    }
  } catch {
    // Ignore localStorage read error
  }

  try {
    // Query API with both Quran Uthmani text and the selected translation/tafsir edition
    const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,${editionIdentifier}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API response failed with status ${response.status}`);
    }

    const json = await response.json();
    if (json.code === 200 && Array.isArray(json.data) && json.data.length >= 1) {
      const quranData = json.data[0];
      const editionData = json.data[1] || null;

      const isTafsir = editionIdentifier.startsWith('ar.');
      
      const combinedAyahs: QuranAyahItem[] = quranData.ayahs.map(
        (ayah: { number: number; numberInSurah: number; text: string; juz: number; page?: number; hizbQuarter?: number }, idx: number) => {
          let text = ayah.text;
          
          // Remove Bismillah from first ayah if not Surah Al-Fatiha (Surah 1) or Surah At-Tawbah (Surah 9)
          if (surahNumber !== 1 && surahNumber !== 9 && idx === 0) {
            const bismillahPrefix = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ';
            const bismillahPrefixAlt = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ';
            if (text.startsWith(bismillahPrefix)) {
              text = text.substring(bismillahPrefix.length);
            } else if (text.startsWith(bismillahPrefixAlt)) {
              text = text.substring(bismillahPrefixAlt.length);
            }
          }

          const secondaryAyah = editionData?.ayahs?.[idx];
          const secondaryText = secondaryAyah ? secondaryAyah.text : '';

          return {
            number: ayah.number,
            numberInSurah: ayah.numberInSurah,
            text,
            juz: ayah.juz,
            page: ayah.page || meta.pageStart,
            hizbQuarter: ayah.hizbQuarter,
            tafsir: isTafsir ? secondaryText : undefined,
            translation: !isTafsir ? secondaryText : undefined,
          };
        }
      );

      const result: QuranSurahData = {
        number: meta.number,
        name: quranData.name || meta.name,
        englishName: meta.englishName,
        englishNameTranslation: meta.englishNameTranslation,
        revelationType: meta.revelationType,
        numberOfAyahs: meta.numberOfAyahs || combinedAyahs.length,
        ayahs: combinedAyahs,
      };

      surahCache[cacheKey] = result;
      try {
        localStorage.setItem(`quran_surah_${cacheKey}`, JSON.stringify(result));
      } catch {
        // Cache full
      }

      return result;
    }
  } catch (err) {
    console.warn('Failed to fetch from Quran API, falling back...', err);
  }

  // Fallback generation if offline / network error
  const fallback = FALLBACK_SURAHS[surahNumber];
  if (fallback) {
    const fallbackAyahs: QuranAyahItem[] = fallback.ayahs.map((a, i) => ({
      number: i + 1,
      numberInSurah: a.numberInSurah,
      text: a.text,
      juz: a.juz,
      page: meta.pageStart,
      tafsir: 'تفسير الآية متاح عند الاتصال بالشبكة.',
    }));

    const result: QuranSurahData = {
      number: meta.number,
      name: meta.name,
      englishName: meta.englishName,
      englishNameTranslation: meta.englishNameTranslation,
      revelationType: meta.revelationType,
      numberOfAyahs: meta.numberOfAyahs,
      ayahs: fallbackAyahs,
    };
    return result;
  }

  // Generic placeholder fallback
  const placeholderAyahs: QuranAyahItem[] = Array.from({ length: meta.numberOfAyahs }).map((_, i) => ({
    number: i + 1,
    numberInSurah: i + 1,
    text: `الآية رقم ${i + 1} من ${meta.name} (جاري تحميل النص القرآني...)`,
    juz: meta.juzStart,
    page: meta.pageStart,
  }));

  return {
    number: meta.number,
    name: meta.name,
    englishName: meta.englishName,
    englishNameTranslation: meta.englishNameTranslation,
    revelationType: meta.revelationType,
    numberOfAyahs: meta.numberOfAyahs,
    ayahs: placeholderAyahs,
  };
}

// In-memory cache for Mushaf pages
const pageCache: Record<string, import('../types').QuranMushafPageData> = {};

/**
 * Fetch a specific Mushaf page (1 to 604) in authentic Uthmani text with Tafsir / Translation
 */
export async function fetchMushafPageWithEdition(
  pageNumber: number,
  editionIdentifier: string = 'ar.muyassar'
): Promise<import('../types').QuranMushafPageData> {
  const safePage = Math.max(1, Math.min(604, pageNumber));
  const cacheKey = `page_${safePage}_${editionIdentifier}`;

  if (pageCache[cacheKey]) {
    return pageCache[cacheKey];
  }

  try {
    const saved = localStorage.getItem(`quran_mushaf_${cacheKey}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      pageCache[cacheKey] = parsed;
      return parsed;
    }
  } catch {
    // Ignore cache read
  }

  try {
    const url = `https://api.alquran.cloud/v1/page/${safePage}/editions/quran-uthmani,${editionIdentifier}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      if (json.code === 200 && Array.isArray(json.data) && json.data.length >= 1) {
        const quranData = json.data[0];
        const editionData = json.data[1] || null;
        const isTafsir = editionIdentifier.startsWith('ar.');

        const surahsMap: Record<number, { number: number; name: string; englishName: string; revelationType: 'Meccan' | 'Medinan'; numberOfAyahs: number }> = {};

        const ayahs: import('../types').QuranMushafPageAyah[] = quranData.ayahs.map(
          (
            rawAyah: {
              number: number;
              numberInSurah: number;
              text: string;
              juz: number;
              page: number;
              hizbQuarter?: number;
              surah: { number: number; name: string; englishName: string; revelationType: 'Meccan' | 'Medinan'; numberOfAyahs: number };
            },
            idx: number
          ) => {
            const surahNumber = rawAyah.surah.number;
            let text = rawAyah.text;

            if (!surahsMap[surahNumber]) {
              surahsMap[surahNumber] = {
                number: surahNumber,
                name: rawAyah.surah.name,
                englishName: rawAyah.surah.englishName,
                revelationType: rawAyah.surah.revelationType,
                numberOfAyahs: rawAyah.surah.numberOfAyahs,
              };
            }

            const isFirst = rawAyah.numberInSurah === 1;

            // Strip Bismillah if not Al-Fatiha or At-Tawbah at the beginning of surah
            if (isFirst && surahNumber !== 1 && surahNumber !== 9) {
              const bismillahPrefix = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ';
              const bismillahPrefixAlt = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ';
              if (text.startsWith(bismillahPrefix)) {
                text = text.substring(bismillahPrefix.length);
              } else if (text.startsWith(bismillahPrefixAlt)) {
                text = text.substring(bismillahPrefixAlt.length);
              }
            }

            const secondaryAyah = editionData?.ayahs?.[idx];
            const secondaryText = secondaryAyah ? secondaryAyah.text : '';

            return {
              number: rawAyah.number,
              numberInSurah: rawAyah.numberInSurah,
              text,
              juz: rawAyah.juz,
              page: rawAyah.page || safePage,
              hizbQuarter: rawAyah.hizbQuarter,
              surahNumber,
              surahName: rawAyah.surah.name,
              isFirstAyahOfSurah: isFirst,
              tafsir: isTafsir ? secondaryText : undefined,
              translation: !isTafsir ? secondaryText : undefined,
            };
          }
        );

        const juzNumber = ayahs.length > 0 ? ayahs[0].juz : 1;
        const hizbQuarter = ayahs.length > 0 ? ayahs[0].hizbQuarter : 1;

        // Register ayahs to page cache
        ayahs.forEach((a) => {
          ayahPageCache[`${a.surahNumber}:${a.numberInSurah}`] = safePage;
        });

        const result: import('../types').QuranMushafPageData = {
          pageNumber: safePage,
          juzNumber,
          hizbQuarter,
          ayahs,
          surahs: Object.values(surahsMap),
        };

        pageCache[cacheKey] = result;
        try {
          localStorage.setItem(`quran_mushaf_${cacheKey}`, JSON.stringify(result));
        } catch {
          // Cache full
        }

        return result;
      }
    }
  } catch (err) {
    console.warn(`Failed to load page ${safePage}:`, err);
  }

  // Fallback if network issue: find surah that starts around this page
  const candidateSurah =
    QURAN_SURAHS.find((s) => s.pageStart === safePage) ||
    QURAN_SURAHS.slice().reverse().find((s) => s.pageStart <= safePage) ||
    QURAN_SURAHS[0];

  return {
    pageNumber: safePage,
    juzNumber: candidateSurah.juzStart,
    ayahs: [
      {
        number: 1,
        numberInSurah: 1,
        text: `صفحة ${safePage} - سورة ${candidateSurah.name}`,
        juz: candidateSurah.juzStart,
        page: safePage,
        surahNumber: candidateSurah.number,
        surahName: candidateSurah.name,
        isFirstAyahOfSurah: true,
        tafsir: 'يتطلب اتصالاً بالشبكة لعرض الصفحة كاملة.',
      },
    ],
    surahs: [
      {
        number: candidateSurah.number,
        name: candidateSurah.name,
        englishName: candidateSurah.englishName,
        revelationType: candidateSurah.revelationType,
        numberOfAyahs: candidateSurah.numberOfAyahs,
      },
    ],
  };
}

// In-memory cache for Ayah -> Page mapping
const ayahPageCache: Record<string, number> = {};

/**
 * Get the exact Mushaf page (1 - 604) for any Surah and Ayah number
 */
export async function getAyahPageNumber(surah: number, ayah: number): Promise<number> {
  const key = `${surah}:${ayah}`;
  if (ayahPageCache[key]) {
    return ayahPageCache[key];
  }

  // Try from localStorage
  try {
    const saved = localStorage.getItem(`ayah_page_${key}`);
    if (saved) {
      const p = parseInt(saved, 10);
      if (p >= 1 && p <= 604) {
        ayahPageCache[key] = p;
        return p;
      }
    }
  } catch {
    // Ignore cache error
  }

  // Fetch page from AlQuran Cloud Ayah API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json.code === 200 && json.data?.page) {
        const page = json.data.page;
        ayahPageCache[key] = page;
        try {
          localStorage.setItem(`ayah_page_${key}`, String(page));
        } catch {
          // storage full
        }
        return page;
      }
    }
  } catch {
    // network timeout fallback
  }

  // Fallback estimation using Surah start page
  const s = QURAN_SURAHS.find((item) => item.number === surah);
  return s ? s.pageStart : 1;
}

