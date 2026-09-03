import { useState } from 'react';
import {
  ShieldCheck,
  HandHelping,
  Droplets,
  AlertTriangle,
  Heart,
  CheckCircle2,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { ThemeMode } from '../types';
import { RUQYAH_GUIDE_SECTIONS } from '../data/ruqyahData';

interface RuqyahGuideProps {
  theme: ThemeMode;
  onStartRuqyah: () => void;
}

export function RuqyahGuide({ theme, onStartRuqyah }: RuqyahGuideProps) {
  const [activeSection, setActiveSection] = useState<string>('how_to_ruqyah');

  const getSectionIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      case 'HandHelping':
        return <HandHelping className="w-5 h-5" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Hero Spiritual Introduction Card */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border mb-8 text-center transition-all ${
          theme === 'dark'
            ? 'bg-stone-900/90 border-stone-800 text-stone-100'
            : theme === 'sepia'
            ? 'bg-amber-50 border-amber-200 text-stone-900'
            : 'bg-emerald-800 text-white border-emerald-900 shadow-lg shadow-emerald-900/10'
        }`}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-xs font-bold mb-3 backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>توجيهات الشفاء وآداب الرقية الشرعية</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold mb-3 font-quran">
          ﴿قُلْ هُوَ لِلَّذِينَ آمَنُوا هُدًى وَشِفَاءٌ﴾
        </h2>
        <p className="text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed opacity-90">
          القرآن الكريم كلام الله الذي لا يأتيه الباطل من بين يديه ولا من خلفه، جعله الله شفاءً للقلوب والأبدان، وحصناً منيعاً للمؤمن من كل أذى وسوء.
        </p>

        <div className="mt-5">
          <button
            onClick={onStartRuqyah}
            className="px-6 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold transition-all shadow-md active:scale-95"
          >
            بدء تلاوة آيات الرقية الآن
          </button>
        </div>
      </div>

      {/* Guide Content Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {RUQYAH_GUIDE_SECTIONS.map((sec) => {
          const isSelected = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-50'
              }`}
            >
              <div className={isSelected ? 'text-amber-300' : 'text-emerald-600'}>
                {getSectionIcon(sec.icon)}
              </div>
              <span className="text-xs font-bold leading-snug">{sec.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Section Detail Card */}
      {RUQYAH_GUIDE_SECTIONS.filter((s) => s.id === activeSection).map((sec) => (
        <div
          key={sec.id}
          className={`p-6 sm:p-8 rounded-3xl border transition-all ${
            theme === 'dark'
              ? 'bg-stone-900 border-stone-800 text-stone-200'
              : theme === 'sepia'
              ? 'bg-amber-50/80 border-amber-200 text-stone-800'
              : 'bg-white border-stone-200 text-stone-800'
          }`}
        >
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-stone-200/60 dark:border-stone-700/60">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
              {getSectionIcon(sec.icon)}
            </div>
            <h3 className="text-base sm:text-lg font-bold">{sec.title}</h3>
          </div>

          <div className="space-y-4">
            {sec.content.map((paragraph, pIdx) => (
              <div
                key={pIdx}
                className="flex items-start gap-3 text-xs sm:text-sm leading-relaxed p-3.5 rounded-2xl bg-stone-50/80 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <p>{paragraph}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Pillars of True Healing Box */}
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
          <Heart className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1">
            اليقين التام بالله
          </h4>
          <p className="text-[11px] text-stone-600 dark:text-stone-400">
            أن تعتقد بقلبك أن الشفاء من الله وحده والقرآن سبب مبارك.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-center">
          <BookOpen className="w-6 h-6 text-teal-600 mx-auto mb-2" />
          <h4 className="text-xs font-bold text-teal-900 dark:text-teal-200 mb-1">
            التدبر والخشوع
          </h4>
          <p className="text-[11px] text-stone-600 dark:text-stone-400">
            حضور القلب أثناء التلاوة وتأمل معاني الآيات العظيمة.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
          <ShieldCheck className="w-6 h-6 text-amber-600 mx-auto mb-2" />
          <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 mb-1">
            المواظبة والاستمرار
          </h4>
          <p className="text-[11px] text-stone-600 dark:text-stone-400">
            المحافظة على أذكار الصباح والمساء والرقية في كل يوم.
          </p>
        </div>
      </div>
    </div>
  );
}
