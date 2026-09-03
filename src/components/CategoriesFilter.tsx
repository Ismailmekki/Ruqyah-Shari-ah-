import {
  BookOpen,
  ShieldCheck,
  EyeOff,
  Flame,
  HeartPulse,
  Sparkles,
  Moon,
} from 'lucide-react';
import { CATEGORIES_DATA } from '../data/recitersData';
import { RuqyahCategoryType } from '../types';

interface CategoriesFilterProps {
  selectedCategory: RuqyahCategoryType;
  onSelectCategory: (cat: RuqyahCategoryType) => void;
  countsByCategory: Record<string, number>;
}

export function CategoriesFilter({
  selectedCategory,
  onSelectCategory,
  countsByCategory,
}: CategoriesFilterProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'EyeOff':
        return <EyeOff className="w-3.5 h-3.5" />;
      case 'Flame':
        return <Flame className="w-3.5 h-3.5" />;
      case 'HeartPulse':
        return <HeartPulse className="w-3.5 h-3.5" />;
      case 'Sparkles':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'Moon':
        return <Moon className="w-3.5 h-3.5" />;
      default:
        return <BookOpen className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max pb-1">
        {CATEGORIES_DATA.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = countsByCategory[cat.id] || 0;

          return (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              onClick={() => onSelectCategory(cat.id as RuqyahCategoryType)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isSelected
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm shadow-emerald-700/20'
                  : 'bg-white/80 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border-stone-200/80 dark:border-stone-700/80 hover:bg-stone-100 dark:hover:bg-stone-700'
              }`}
            >
              <span className={isSelected ? 'text-emerald-200' : 'text-emerald-600 dark:text-emerald-400'}>
                {getIcon(cat.icon)}
              </span>
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                  isSelected
                    ? 'bg-emerald-800 text-emerald-100'
                    : 'bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
