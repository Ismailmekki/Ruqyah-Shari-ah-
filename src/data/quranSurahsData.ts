export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  revelationOrder: number;
  juzStart: number;
  pageStart: number;
}

export interface TafsirTranslationEdition {
  identifier: string;
  language: string;
  languageName: string;
  name: string;
  englishName: string;
  format: 'text';
  type: 'tafsir' | 'translation';
  direction: 'rtl' | 'ltr';
}

export const QURAN_SURAHS: SurahMeta[] = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Faatiha', englishNameTranslation: 'The Opening', numberOfAyahs: 7, revelationType: 'Meccan', revelationOrder: 5, juzStart: 1, pageStart: 1 },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqara', englishNameTranslation: 'The Cow', numberOfAyahs: 286, revelationType: 'Medinan', revelationOrder: 87, juzStart: 1, pageStart: 2 },
  { number: 3, name: 'آل عمران', englishName: 'Aal-i-Imraan', englishNameTranslation: 'The Family of Imran', numberOfAyahs: 200, revelationType: 'Medinan', revelationOrder: 89, juzStart: 3, pageStart: 50 },
  { number: 4, name: 'النساء', englishName: 'An-Nisaa', englishNameTranslation: 'The Women', numberOfAyahs: 176, revelationType: 'Medinan', revelationOrder: 92, juzStart: 4, pageStart: 77 },
  { number: 5, name: 'المائدة', englishName: 'Al-Maaida', englishNameTranslation: 'The Table Spread', numberOfAyahs: 120, revelationType: 'Medinan', revelationOrder: 112, juzStart: 6, pageStart: 106 },
  { number: 6, name: 'الأنعام', englishName: 'Al-An\'aam', englishNameTranslation: 'The Cattle', numberOfAyahs: 165, revelationType: 'Meccan', revelationOrder: 55, juzStart: 7, pageStart: 128 },
  { number: 7, name: 'الأعراف', englishName: 'Al-A\'raaf', englishNameTranslation: 'The Heights', numberOfAyahs: 206, revelationType: 'Meccan', revelationOrder: 39, juzStart: 8, pageStart: 151 },
  { number: 8, name: 'الأنفال', englishName: 'Al-Anfaal', englishNameTranslation: 'The Spoils of War', numberOfAyahs: 75, revelationType: 'Medinan', revelationOrder: 88, juzStart: 9, pageStart: 177 },
  { number: 9, name: 'التوبة', englishName: 'At-Tawba', englishNameTranslation: 'The Repentance', numberOfAyahs: 129, revelationType: 'Medinan', revelationOrder: 113, juzStart: 10, pageStart: 187 },
  { number: 10, name: 'يونس', englishName: 'Yunus', englishNameTranslation: 'Jonah', numberOfAyahs: 109, revelationType: 'Meccan', revelationOrder: 51, juzStart: 11, pageStart: 208 },
  { number: 11, name: 'هود', englishName: 'Hud', englishNameTranslation: 'Hud', numberOfAyahs: 123, revelationType: 'Meccan', revelationOrder: 52, juzStart: 11, pageStart: 221 },
  { number: 12, name: 'يوسف', englishName: 'Yusuf', englishNameTranslation: 'Joseph', numberOfAyahs: 111, revelationType: 'Meccan', revelationOrder: 53, juzStart: 12, pageStart: 235 },
  { number: 13, name: 'الرعد', englishName: 'Ar-Ra\'d', englishNameTranslation: 'The Thunder', numberOfAyahs: 43, revelationType: 'Medinan', revelationOrder: 96, juzStart: 13, pageStart: 249 },
  { number: 14, name: 'إبراهيم', englishName: 'Ibrahim', englishNameTranslation: 'Abraham', numberOfAyahs: 52, revelationType: 'Meccan', revelationOrder: 72, juzStart: 13, pageStart: 255 },
  { number: 15, name: 'الحجر', englishName: 'Al-Hijr', englishNameTranslation: 'The Rocky Tract', numberOfAyahs: 99, revelationType: 'Meccan', revelationOrder: 54, juzStart: 14, pageStart: 262 },
  { number: 16, name: 'النحل', englishName: 'An-Nahl', englishNameTranslation: 'The Bee', numberOfAyahs: 128, revelationType: 'Meccan', revelationOrder: 70, juzStart: 14, pageStart: 267 },
  { number: 17, name: 'الإسراء', englishName: 'Al-Israa', englishNameTranslation: 'The Night Journey', numberOfAyahs: 111, revelationType: 'Meccan', revelationOrder: 50, juzStart: 15, pageStart: 282 },
  { number: 18, name: 'الكهف', englishName: 'Al-Kahf', englishNameTranslation: 'The Cave', numberOfAyahs: 110, revelationType: 'Meccan', revelationOrder: 69, juzStart: 15, pageStart: 293 },
  { number: 19, name: 'مريم', englishName: 'Maryam', englishNameTranslation: 'Mary', numberOfAyahs: 98, revelationType: 'Meccan', revelationOrder: 44, juzStart: 16, pageStart: 305 },
  { number: 20, name: 'طه', englishName: 'Taa-Haa', englishNameTranslation: 'Ta-Ha', numberOfAyahs: 135, revelationType: 'Meccan', revelationOrder: 45, juzStart: 16, pageStart: 312 },
  { number: 21, name: 'الأنبياء', englishName: 'Al-Anbiyaa', englishNameTranslation: 'The Prophets', numberOfAyahs: 112, revelationType: 'Meccan', revelationOrder: 73, juzStart: 17, pageStart: 322 },
  { number: 22, name: 'الحج', englishName: 'Al-Hajj', englishNameTranslation: 'The Pilgrimage', numberOfAyahs: 78, revelationType: 'Medinan', revelationOrder: 103, juzStart: 17, pageStart: 332 },
  { number: 23, name: 'المؤمنون', englishName: 'Al-Muminoon', englishNameTranslation: 'The Believers', numberOfAyahs: 118, revelationType: 'Meccan', revelationOrder: 74, juzStart: 18, pageStart: 342 },
  { number: 24, name: 'النور', englishName: 'An-Noor', englishNameTranslation: 'The Light', numberOfAyahs: 64, revelationType: 'Medinan', revelationOrder: 102, juzStart: 18, pageStart: 350 },
  { number: 25, name: 'الفرقان', englishName: 'Al-Furqaan', englishNameTranslation: 'The Criterion', numberOfAyahs: 77, revelationType: 'Meccan', revelationOrder: 42, juzStart: 18, pageStart: 359 },
  { number: 26, name: 'الشعراء', englishName: 'Ash-Shu\'araa', englishNameTranslation: 'The Poets', numberOfAyahs: 227, revelationType: 'Meccan', revelationOrder: 47, juzStart: 19, pageStart: 367 },
  { number: 27, name: 'النمل', englishName: 'An-Naml', englishNameTranslation: 'The Ant', numberOfAyahs: 93, revelationType: 'Meccan', revelationOrder: 48, juzStart: 19, pageStart: 377 },
  { number: 28, name: 'القصص', englishName: 'Al-Qasas', englishNameTranslation: 'The Stories', numberOfAyahs: 88, revelationType: 'Meccan', revelationOrder: 49, juzStart: 20, pageStart: 385 },
  { number: 29, name: 'العنكبوت', englishName: 'Al-Ankaboot', englishNameTranslation: 'The Spider', numberOfAyahs: 69, revelationType: 'Meccan', revelationOrder: 85, juzStart: 20, pageStart: 396 },
  { number: 30, name: 'الروم', englishName: 'Ar-Room', englishNameTranslation: 'The Romans', numberOfAyahs: 60, revelationType: 'Meccan', revelationOrder: 84, juzStart: 21, pageStart: 404 },
  { number: 31, name: 'لقمان', englishName: 'Luqman', englishNameTranslation: 'Luqman', numberOfAyahs: 34, revelationType: 'Meccan', revelationOrder: 57, juzStart: 21, pageStart: 411 },
  { number: 32, name: 'السجدة', englishName: 'As-Sajda', englishNameTranslation: 'The Prostration', numberOfAyahs: 30, revelationType: 'Meccan', revelationOrder: 75, juzStart: 21, pageStart: 415 },
  { number: 33, name: 'الأحزاب', englishName: 'Al-Ahzaab', englishNameTranslation: 'The Combined Forces', numberOfAyahs: 73, revelationType: 'Medinan', revelationOrder: 90, juzStart: 21, pageStart: 418 },
  { number: 34, name: 'سبأ', englishName: 'Saba', englishNameTranslation: 'Sheba', numberOfAyahs: 54, revelationType: 'Meccan', revelationOrder: 58, juzStart: 22, pageStart: 428 },
  { number: 35, name: 'فاطر', englishName: 'Faatir', englishNameTranslation: 'The Originator', numberOfAyahs: 45, revelationType: 'Meccan', revelationOrder: 43, juzStart: 22, pageStart: 434 },
  { number: 36, name: 'يس', englishName: 'Yaseen', englishNameTranslation: 'Ya-Seen', numberOfAyahs: 83, revelationType: 'Meccan', revelationOrder: 41, juzStart: 22, pageStart: 440 },
  { number: 37, name: 'الصافات', englishName: 'As-Saaffaat', englishNameTranslation: 'Those Who Set The Ranks', numberOfAyahs: 182, revelationType: 'Meccan', revelationOrder: 56, juzStart: 23, pageStart: 446 },
  { number: 38, name: 'ص', englishName: 'Saad', englishNameTranslation: 'The Letter Saad', numberOfAyahs: 88, revelationType: 'Meccan', revelationOrder: 38, juzStart: 23, pageStart: 453 },
  { number: 39, name: 'الزمر', englishName: 'Az-Zumar', englishNameTranslation: 'The Troops', numberOfAyahs: 75, revelationType: 'Meccan', revelationOrder: 59, juzStart: 23, pageStart: 458 },
  { number: 40, name: 'غافر', englishName: 'Ghafir', englishNameTranslation: 'The Forgiver', numberOfAyahs: 85, revelationType: 'Meccan', revelationOrder: 60, juzStart: 24, pageStart: 467 },
  { number: 41, name: 'فصلت', englishName: 'Fussilat', englishNameTranslation: 'Explained In Detail', numberOfAyahs: 54, revelationType: 'Meccan', revelationOrder: 61, juzStart: 24, pageStart: 477 },
  { number: 42, name: 'الشورى', englishName: 'Ash-Shura', englishNameTranslation: 'The Consultation', numberOfAyahs: 53, revelationType: 'Meccan', revelationOrder: 62, juzStart: 25, pageStart: 483 },
  { number: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', englishNameTranslation: 'The Ornaments of Gold', numberOfAyahs: 89, revelationType: 'Meccan', revelationOrder: 63, juzStart: 25, pageStart: 489 },
  { number: 44, name: 'الدخان', englishName: 'Ad-Dukhaan', englishNameTranslation: 'The Smoke', numberOfAyahs: 59, revelationType: 'Meccan', revelationOrder: 64, juzStart: 25, pageStart: 496 },
  { number: 45, name: 'الجاثية', englishName: 'Al-Jaathiya', englishNameTranslation: 'The Crouching', numberOfAyahs: 37, revelationType: 'Meccan', revelationOrder: 65, juzStart: 25, pageStart: 499 },
  { number: 46, name: 'الأحقاف', englishName: 'Al-Ahqaaf', englishNameTranslation: 'The Wind-Curved Sandhills', numberOfAyahs: 35, revelationType: 'Meccan', revelationOrder: 66, juzStart: 26, pageStart: 502 },
  { number: 47, name: 'محمد', englishName: 'Muhammad', englishNameTranslation: 'Muhammad', numberOfAyahs: 38, revelationType: 'Medinan', revelationOrder: 95, juzStart: 26, pageStart: 507 },
  { number: 48, name: 'الفتح', englishName: 'Al-Fath', englishNameTranslation: 'The Victory', numberOfAyahs: 29, revelationType: 'Medinan', revelationOrder: 111, juzStart: 26, pageStart: 511 },
  { number: 49, name: 'الحجرات', englishName: 'Al-Hujuraat', englishNameTranslation: 'The Rooms', numberOfAyahs: 18, revelationType: 'Medinan', revelationOrder: 106, juzStart: 26, pageStart: 515 },
  { number: 50, name: 'ق', englishName: 'Qaaf', englishNameTranslation: 'The Letter Qaf', numberOfAyahs: 45, revelationType: 'Meccan', revelationOrder: 34, juzStart: 26, pageStart: 518 },
  { number: 51, name: 'الذاريات', englishName: 'Adh-Dhaariyat', englishNameTranslation: 'The Winnowing Winds', numberOfAyahs: 60, revelationType: 'Meccan', revelationOrder: 67, juzStart: 26, pageStart: 520 },
  { number: 52, name: 'الطور', englishName: 'At-Toor', englishNameTranslation: 'The Mount', numberOfAyahs: 49, revelationType: 'Meccan', revelationOrder: 76, juzStart: 27, pageStart: 523 },
  { number: 53, name: 'النجم', englishName: 'An-Najm', englishNameTranslation: 'The Star', numberOfAyahs: 62, revelationType: 'Meccan', revelationOrder: 23, juzStart: 27, pageStart: 526 },
  { number: 54, name: 'القمر', englishName: 'Al-Qamar', englishNameTranslation: 'The Moon', numberOfAyahs: 55, revelationType: 'Meccan', revelationOrder: 37, juzStart: 27, pageStart: 528 },
  { number: 55, name: 'الرحمن', englishName: 'Ar-Rahmaan', englishNameTranslation: 'The Beneficent', numberOfAyahs: 78, revelationType: 'Medinan', revelationOrder: 97, juzStart: 27, pageStart: 531 },
  { number: 56, name: 'الواقعة', englishName: 'Al-Waaqia', englishNameTranslation: 'The Inevitable', numberOfAyahs: 96, revelationType: 'Meccan', revelationOrder: 46, juzStart: 27, pageStart: 534 },
  { number: 57, name: 'الحديد', englishName: 'Al-Hadid', englishNameTranslation: 'The Iron', numberOfAyahs: 29, revelationType: 'Medinan', revelationOrder: 94, juzStart: 27, pageStart: 537 },
  { number: 58, name: 'المجادلة', englishName: 'Al-Mujaadila', englishNameTranslation: 'The Pleading Woman', numberOfAyahs: 22, revelationType: 'Medinan', revelationOrder: 105, juzStart: 28, pageStart: 542 },
  { number: 59, name: 'الحشر', englishName: 'Al-Hashr', englishNameTranslation: 'The Exile', numberOfAyahs: 24, revelationType: 'Medinan', revelationOrder: 101, juzStart: 28, pageStart: 545 },
  { number: 60, name: 'الممتحنة', englishName: 'Al-Mumtahana', englishNameTranslation: 'She That Is To Be Examined', numberOfAyahs: 13, revelationType: 'Medinan', revelationOrder: 91, juzStart: 28, pageStart: 549 },
  { number: 61, name: 'الصف', englishName: 'As-Saff', englishNameTranslation: 'The Ranks', numberOfAyahs: 14, revelationType: 'Medinan', revelationOrder: 109, juzStart: 28, pageStart: 551 },
  { number: 62, name: 'الجمعة', englishName: 'Al-Jumu\'a', englishNameTranslation: 'Friday', numberOfAyahs: 11, revelationType: 'Medinan', revelationOrder: 110, juzStart: 28, pageStart: 553 },
  { number: 63, name: 'المنافقون', englishName: 'Al-Munaafiqoon', englishNameTranslation: 'The Hypocrites', numberOfAyahs: 11, revelationType: 'Medinan', revelationOrder: 104, juzStart: 28, pageStart: 554 },
  { number: 64, name: 'التغابن', englishName: 'At-Taghaabun', englishNameTranslation: 'The Mutual Disillusion', numberOfAyahs: 18, revelationType: 'Medinan', revelationOrder: 108, juzStart: 28, pageStart: 556 },
  { number: 65, name: 'الطلاق', englishName: 'At-Talaaq', englishNameTranslation: 'The Divorce', numberOfAyahs: 12, revelationType: 'Medinan', revelationOrder: 99, juzStart: 28, pageStart: 558 },
  { number: 66, name: 'التحريم', englishName: 'At-Tahrim', englishNameTranslation: 'The Prohibition', numberOfAyahs: 12, revelationType: 'Medinan', revelationOrder: 107, juzStart: 28, pageStart: 560 },
  { number: 67, name: 'الملك', englishName: 'Al-Mulk', englishNameTranslation: 'The Sovereignty', numberOfAyahs: 30, revelationType: 'Meccan', revelationOrder: 77, juzStart: 29, pageStart: 562 },
  { number: 68, name: 'القلم', englishName: 'Al-Qalam', englishNameTranslation: 'The Pen', numberOfAyahs: 52, revelationType: 'Meccan', revelationOrder: 2, juzStart: 29, pageStart: 564 },
  { number: 69, name: 'الحاقة', englishName: 'Al-Haaqqa', englishNameTranslation: 'The Reality', numberOfAyahs: 52, revelationType: 'Meccan', revelationOrder: 78, juzStart: 29, pageStart: 566 },
  { number: 70, name: 'المعارج', englishName: 'Al-Ma\'aarij', englishNameTranslation: 'The Ascending Stairways', numberOfAyahs: 44, revelationType: 'Meccan', revelationOrder: 79, juzStart: 29, pageStart: 568 },
  { number: 71, name: 'نوح', englishName: 'Nooh', englishNameTranslation: 'Noah', numberOfAyahs: 28, revelationType: 'Meccan', revelationOrder: 71, juzStart: 29, pageStart: 570 },
  { number: 72, name: 'الجن', englishName: 'Al-Jinn', englishNameTranslation: 'The Jinn', numberOfAyahs: 28, revelationType: 'Meccan', revelationOrder: 40, juzStart: 29, pageStart: 572 },
  { number: 73, name: 'المزمل', englishName: 'Al-Muzzammil', englishNameTranslation: 'The Enshrouded One', numberOfAyahs: 20, revelationType: 'Meccan', revelationOrder: 3, juzStart: 29, pageStart: 574 },
  { number: 74, name: 'المدثر', englishName: 'Al-Muddaththir', englishNameTranslation: 'The Cloaked One', numberOfAyahs: 56, revelationType: 'Meccan', revelationOrder: 4, juzStart: 29, pageStart: 575 },
  { number: 75, name: 'القيامة', englishName: 'Al-Qiyaama', englishNameTranslation: 'The Resurrection', numberOfAyahs: 40, revelationType: 'Meccan', revelationOrder: 31, juzStart: 29, pageStart: 577 },
  { number: 76, name: 'الإنسان', englishName: 'Al-Insaan', englishNameTranslation: 'Man', numberOfAyahs: 31, revelationType: 'Medinan', revelationOrder: 98, juzStart: 29, pageStart: 578 },
  { number: 77, name: 'المرسلات', englishName: 'Al-Mursalaat', englishNameTranslation: 'The Emissaries', numberOfAyahs: 50, revelationType: 'Meccan', revelationOrder: 33, juzStart: 29, pageStart: 580 },
  { number: 78, name: 'النبأ', englishName: 'An-Naba', englishNameTranslation: 'The Tidings', numberOfAyahs: 40, revelationType: 'Meccan', revelationOrder: 80, juzStart: 30, pageStart: 582 },
  { number: 79, name: 'النازعات', englishName: 'An-Naazi\'aat', englishNameTranslation: 'Those Who Drag Forth', numberOfAyahs: 46, revelationType: 'Meccan', revelationOrder: 81, juzStart: 30, pageStart: 583 },
  { number: 80, name: 'عبس', englishName: 'Abasa', englishNameTranslation: 'He Frowned', numberOfAyahs: 42, revelationType: 'Meccan', revelationOrder: 24, juzStart: 30, pageStart: 585 },
  { number: 81, name: 'التكوير', englishName: 'At-Takwir', englishNameTranslation: 'The Overthrowing', numberOfAyahs: 29, revelationType: 'Meccan', revelationOrder: 7, juzStart: 30, pageStart: 586 },
  { number: 82, name: 'الانفطار', englishName: 'Al-Infitaar', englishNameTranslation: 'The Cleaving', numberOfAyahs: 19, revelationType: 'Meccan', revelationOrder: 82, juzStart: 30, pageStart: 587 },
  { number: 83, name: 'المطففين', englishName: 'Al-Mutaffifin', englishNameTranslation: 'Defrauding', numberOfAyahs: 36, revelationType: 'Meccan', revelationOrder: 86, juzStart: 30, pageStart: 587 },
  { number: 84, name: 'الانشقاق', englishName: 'Al-Inshiqaaq', englishNameTranslation: 'The Splitting Open', numberOfAyahs: 25, revelationType: 'Meccan', revelationOrder: 83, juzStart: 30, pageStart: 589 },
  { number: 85, name: 'البروج', englishName: 'Al-Burooj', englishNameTranslation: 'The Mansions of the Stars', numberOfAyahs: 22, revelationType: 'Meccan', revelationOrder: 27, juzStart: 30, pageStart: 590 },
  { number: 86, name: 'الطارق', englishName: 'At-Taariq', englishNameTranslation: 'The Morning Star', numberOfAyahs: 17, revelationType: 'Meccan', revelationOrder: 36, juzStart: 30, pageStart: 591 },
  { number: 87, name: 'الأعلى', englishName: 'Al-A\'laa', englishNameTranslation: 'The Most High', numberOfAyahs: 19, revelationType: 'Meccan', revelationOrder: 8, juzStart: 30, pageStart: 591 },
  { number: 88, name: 'الغاشية', englishName: 'Al-Ghaashiya', englishNameTranslation: 'The Overwhelming', numberOfAyahs: 26, revelationType: 'Meccan', revelationOrder: 68, juzStart: 30, pageStart: 592 },
  { number: 89, name: 'الفجر', englishName: 'Al-Fajr', englishNameTranslation: 'The Dawn', numberOfAyahs: 30, revelationType: 'Meccan', revelationOrder: 10, juzStart: 30, pageStart: 593 },
  { number: 90, name: 'البلد', englishName: 'Al-Balad', englishNameTranslation: 'The City', numberOfAyahs: 20, revelationType: 'Meccan', revelationOrder: 35, juzStart: 30, pageStart: 594 },
  { number: 91, name: 'الشمس', englishName: 'Ash-Shams', englishNameTranslation: 'The Sun', numberOfAyahs: 15, revelationType: 'Meccan', revelationOrder: 26, juzStart: 30, pageStart: 595 },
  { number: 92, name: 'الليل', englishName: 'Al-Lail', englishNameTranslation: 'The Night', numberOfAyahs: 21, revelationType: 'Meccan', revelationOrder: 9, juzStart: 30, pageStart: 595 },
  { number: 93, name: 'الضحى', englishName: 'Ad-Dhuhaa', englishNameTranslation: 'The Morning Hours', numberOfAyahs: 11, revelationType: 'Meccan', revelationOrder: 11, juzStart: 30, pageStart: 596 },
  { number: 94, name: 'الشرح', englishName: 'Ash-Sharh', englishNameTranslation: 'The Relief', numberOfAyahs: 8, revelationType: 'Meccan', revelationOrder: 12, juzStart: 30, pageStart: 596 },
  { number: 95, name: 'التين', englishName: 'At-Tin', englishNameTranslation: 'The Fig', numberOfAyahs: 8, revelationType: 'Meccan', revelationOrder: 28, juzStart: 30, pageStart: 597 },
  { number: 96, name: 'العلق', englishName: 'Al-Alaq', englishNameTranslation: 'The Clot', numberOfAyahs: 19, revelationType: 'Meccan', revelationOrder: 1, juzStart: 30, pageStart: 597 },
  { number: 97, name: 'القدر', englishName: 'Al-Qadr', englishNameTranslation: 'The Power', numberOfAyahs: 5, revelationType: 'Meccan', revelationOrder: 25, juzStart: 30, pageStart: 598 },
  { number: 98, name: 'البينة', englishName: 'Al-Bayyina', englishNameTranslation: 'The Clear Proof', numberOfAyahs: 8, revelationType: 'Medinan', revelationOrder: 100, juzStart: 30, pageStart: 598 },
  { number: 99, name: 'الزلزلة', englishName: 'Az-Zalzala', englishNameTranslation: 'The Earthquake', numberOfAyahs: 8, revelationType: 'Medinan', revelationOrder: 93, juzStart: 30, pageStart: 599 },
  { number: 100, name: 'العاديات', englishName: 'Al-Aadiyaat', englishNameTranslation: 'The Courser', numberOfAyahs: 11, revelationType: 'Meccan', revelationOrder: 14, juzStart: 30, pageStart: 599 },
  { number: 101, name: 'القارعة', englishName: 'Al-Qaari\'a', englishNameTranslation: 'The Calamity', numberOfAyahs: 11, revelationType: 'Meccan', revelationOrder: 30, juzStart: 30, pageStart: 600 },
  { number: 102, name: 'التكاثر', englishName: 'At-Takaathur', englishNameTranslation: 'The Rivalry in World Increase', numberOfAyahs: 8, revelationType: 'Meccan', revelationOrder: 16, juzStart: 30, pageStart: 600 },
  { number: 103, name: 'العصر', englishName: 'Al-Asr', englishNameTranslation: 'The Declining Day', numberOfAyahs: 3, revelationType: 'Meccan', revelationOrder: 13, juzStart: 30, pageStart: 601 },
  { number: 104, name: 'الهمزة', englishName: 'Al-Humaza', englishNameTranslation: 'The Traducer', numberOfAyahs: 9, revelationType: 'Meccan', revelationOrder: 32, juzStart: 30, pageStart: 601 },
  { number: 105, name: 'الفيل', englishName: 'Al-Feel', englishNameTranslation: 'The Elephant', numberOfAyahs: 5, revelationType: 'Meccan', revelationOrder: 19, juzStart: 30, pageStart: 601 },
  { number: 106, name: 'قريش', englishName: 'Quraish', englishNameTranslation: 'Quraysh', numberOfAyahs: 4, revelationType: 'Meccan', revelationOrder: 29, juzStart: 30, pageStart: 602 },
  { number: 107, name: 'الماعون', englishName: 'Al-Maa\'oon', englishNameTranslation: 'Small Kindnesses', numberOfAyahs: 7, revelationType: 'Meccan', revelationOrder: 17, juzStart: 30, pageStart: 602 },
  { number: 108, name: 'الكوثر', englishName: 'Al-Kawthar', englishNameTranslation: 'Abundance', numberOfAyahs: 3, revelationType: 'Meccan', revelationOrder: 15, juzStart: 30, pageStart: 602 },
  { number: 109, name: 'الكافرون', englishName: 'Al-Kaafiroon', englishNameTranslation: 'The Disbelievers', numberOfAyahs: 6, revelationType: 'Meccan', revelationOrder: 18, juzStart: 30, pageStart: 603 },
  { number: 110, name: 'النصر', englishName: 'An-Nasr', englishNameTranslation: 'The Divine Support', numberOfAyahs: 3, revelationType: 'Medinan', revelationOrder: 114, juzStart: 30, pageStart: 603 },
  { number: 111, name: 'المسد', englishName: 'Al-Masad', englishNameTranslation: 'The Palm Fibre', numberOfAyahs: 5, revelationType: 'Meccan', revelationOrder: 6, juzStart: 30, pageStart: 603 },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlaas', englishNameTranslation: 'Sincerity', numberOfAyahs: 4, revelationType: 'Meccan', revelationOrder: 22, juzStart: 30, pageStart: 604 },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq', englishNameTranslation: 'The Daybreak', numberOfAyahs: 5, revelationType: 'Meccan', revelationOrder: 20, juzStart: 30, pageStart: 604 },
  { number: 114, name: 'الناس', englishName: 'An-Naas', englishNameTranslation: 'Mankind', numberOfAyahs: 6, revelationType: 'Meccan', revelationOrder: 21, juzStart: 30, pageStart: 604 }
];

export const TAFSIR_TRANSLATION_EDITIONS: TafsirTranslationEdition[] = [
  // Arabic Tafsirs
  { identifier: 'ar.muyassar', language: 'ar', languageName: 'العربية', name: 'التفسير الميسر', englishName: 'Tafseer Al-Muyassar', format: 'text', type: 'tafsir', direction: 'rtl' },
  { identifier: 'ar.jalalayn', language: 'ar', languageName: 'العربية', name: 'تفسير الجلالين', englishName: 'Tafseer Al-Jalalayn', format: 'text', type: 'tafsir', direction: 'rtl' },
  { identifier: 'ar.saadi', language: 'ar', languageName: 'العربية', name: 'تفسير السعدي (تيسير الكريم الرحمن)', englishName: 'Tafseer Al-Saadi', format: 'text', type: 'tafsir', direction: 'rtl' },
  
  // World Languages Translations
  { identifier: 'en.sahih', language: 'en', languageName: 'English', name: 'Sahih International', englishName: 'Saheeh International', format: 'text', type: 'translation', direction: 'ltr' },
  { identifier: 'en.pickthall', language: 'en', languageName: 'English', name: 'Pickthall', englishName: 'Pickthall', format: 'text', type: 'translation', direction: 'ltr' },
  { identifier: 'en.yusufali', language: 'en', languageName: 'English', name: 'Yusuf Ali', englishName: 'Yusuf Ali', format: 'text', type: 'translation', direction: 'ltr' },
  { identifier: 'fr.hamidullah', language: 'fr', languageName: 'Français', name: 'Muhammad Hamidullah', englishName: 'Hamidullah', format: 'text', type: 'translation', direction: 'ltr' },
  { identifier: 'ur.jalandhry', language: 'ur', languageName: 'اردو', name: 'فتح محمد جالندھری', englishName: 'Fateh Muhammad Jalandhry', format: 'text', type: 'translation', direction: 'rtl' },
  { identifier: 'tr.diyanet', language: 'tr', languageName: 'Türkçe', name: 'Diyanet İşleri', englishName: 'Diyanet Isleri', format: 'text', type: 'translation', direction: 'ltr' },
  { identifier: 'id.indonesian', language: 'id', languageName: 'Bahasa Indonesia', name: 'Kementerian Agama', englishName: 'Indonesian Ministry of Religious Affairs', format: 'text', type: 'translation', direction: 'ltr' },
  { identifier: 'ru.kuliev', language: 'ru', languageName: 'Русский', name: 'Эльмир Кулиев', englishName: 'Elmir Kuliev', format: 'text', type: 'translation', direction: 'ltr' },
  { identifier: 'es.cortes', language: 'es', languageName: 'Español', name: 'Julio Cortes', englishName: 'Julio Cortes', format: 'text', type: 'translation', direction: 'ltr' },
  { identifier: 'de.bubenheim', language: 'de', languageName: 'Deutsch', name: 'Bubenheim & Elyas', englishName: 'Frank Bubenheim and Nadeem Elyas', format: 'text', type: 'translation', direction: 'ltr' },
  { identifier: 'fa.ansarian', language: 'fa', languageName: 'فارسی', name: 'حسین انصاریان', englishName: 'Hossein Ansarian', format: 'text', type: 'translation', direction: 'rtl' },
  { identifier: 'bn.bengali', language: 'bn', languageName: 'বাংলা', name: 'মুহিউদ্দীন খান', englishName: 'Muhiuddin Khan', format: 'text', type: 'translation', direction: 'ltr' },
  { identifier: 'zh.jian', language: 'zh', languageName: '中文 (简体)', name: '马仲刚 (Ma Zhong Gang)', englishName: 'Ma Jian', format: 'text', type: 'translation', direction: 'ltr' },
  { identifier: 'it.piccardo', language: 'it', languageName: 'Italiano', name: 'Hamza Roberto Piccardo', englishName: 'Hamza Roberto Piccardo', format: 'text', type: 'translation', direction: 'ltr' },
  { identifier: 'ku.asan', language: 'ku', languageName: 'Kurdî (کوردی)', name: 'تەفسیری ئاسان', englishName: 'Burhan Muhammad-Amin', format: 'text', type: 'translation', direction: 'rtl' },
  { identifier: 'ms.basmeih', language: 'ms', languageName: 'Bahasa Melayu', name: 'Abdullah Muhammad Basmeih', englishName: 'Abdullah Muhammad Basmeih', format: 'text', type: 'translation', direction: 'ltr' },
  { identifier: 'sw.barwani', language: 'sw', languageName: 'Kiswahili', name: 'Ali Muhsin Al-Barwani', englishName: 'Ali Muhsin Al-Barwani', format: 'text', type: 'translation', direction: 'ltr' },
  { identifier: 'hi.hindi', language: 'hi', languageName: 'हिन्दी', name: 'सुहैल फ़ारूक़ ख़ान और सैफ़ुर्रहमान नदवी', englishName: 'Suhel Farooq Khan and Saifur Rahman Nadwi', format: 'text', type: 'translation', direction: 'ltr' },
  { identifier: 'ja.japanese', language: 'ja', languageName: '日本語', name: '日本ムスリム協会', englishName: 'Ryoichi Mita', format: 'text', type: 'translation', direction: 'ltr' },
  { identifier: 'pt.elhayek', language: 'pt', languageName: 'Português', name: 'Samir El-Hayek', englishName: 'Samir El-Hayek', format: 'text', type: 'translation', direction: 'ltr' },
  { identifier: 'bs.korkut', language: 'bs', languageName: 'Bosanski', name: 'Besim Korkut', englishName: 'Besim Korkut', format: 'text', type: 'translation', direction: 'ltr' },
  { identifier: 'nl.keyzer', language: 'nl', languageName: 'Nederlands', name: 'Salomo Keyzer', englishName: 'Salomo Keyzer', format: 'text', type: 'translation', direction: 'ltr' }
];

export interface AyahData {
  number: number; // overall ayah number in Quran (1..6236)
  numberInSurah: number;
  text: string;
  juz: number;
  manzil?: number;
  page?: number;
  ruku?: number;
  hizbQuarter?: number;
  sajda?: boolean | object;
  translation?: string;
  tafsir?: string;
}

export interface SurahDetailData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
  ayahs: AyahData[];
}
