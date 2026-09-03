import { useState, useEffect } from 'react';
import {
  Calendar,
  Flame,
  CheckCircle2,
  Circle,
  Sun,
  Moon,
  Sparkles,
  Award,
} from 'lucide-react';
import { ThemeMode } from '../types';

interface DailyTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

interface RoutineItem {
  id: string;
  title: string;
  time: string;
  icon: 'sun' | 'moon' | 'sparkles';
  completed: boolean;
}

export function DailyTrackerModal({ isOpen, onClose, theme }: DailyTrackerModalProps) {
  const [routines, setRoutines] = useState<RoutineItem[]>(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`ruqyah_routine_${today}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      { id: 'morning', title: 'رقية وتحصين الصباح', time: 'بعد صلاة الفجر', icon: 'sun', completed: false },
      { id: 'evening', title: 'رقية وتحصين المساء', time: 'بعد صلاة العصر', icon: 'moon', completed: false },
      { id: 'sleep', title: 'رقية النوم وسورة الملك والمعوذات', time: 'قبل النوم مباشرة', icon: 'sparkles', completed: false },
    ];
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('ruqyah_streak_count');
    return saved ? parseInt(saved, 10) : 3;
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`ruqyah_routine_${today}`, JSON.stringify(routines));

    // Calculate completion
    const allDone = routines.every((r) => r.completed);
    if (allDone) {
      localStorage.setItem('ruqyah_streak_count', String(streak));
    }
  }, [routines, streak]);

  const toggleRoutine = (id: string) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div
        className={`max-w-md w-full p-6 rounded-3xl shadow-2xl border ${
          theme === 'dark'
            ? 'bg-stone-900 border-stone-800 text-stone-100'
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">حِصْنِي اليَوْمِي والمواظبة</h3>
              <p className="text-[11px] text-stone-400">متابعة أوراد الرقية والتحصين</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-300"
          >
            ✕
          </button>
        </div>

        {/* Streak Counter Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white mb-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Flame className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="text-xs opacity-90">المواظبة المستمرة</div>
              <div className="text-lg font-bold">
                {streak} {streak === 1 ? 'يوم' : 'أيام متتالية'}
              </div>
            </div>
          </div>
          <Award className="w-8 h-8 opacity-40" />
        </div>

        {/* Today's Checklist */}
        <div className="space-y-2 mb-6">
          <div className="text-xs font-semibold text-stone-500 mb-2">أوراد اليوم:</div>
          {routines.map((routine) => {
            return (
              <button
                key={routine.id}
                onClick={() => toggleRoutine(routine.id)}
                className={`w-full text-right p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  routine.completed
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-850 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-emerald-600">
                    {routine.icon === 'sun' && <Sun className="w-4 h-4 text-amber-500" />}
                    {routine.icon === 'moon' && <Moon className="w-4 h-4 text-indigo-400" />}
                    {routine.icon === 'sparkles' && <Sparkles className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{routine.title}</h4>
                    <p className="text-[10px] text-stone-400">{routine.time}</p>
                  </div>
                </div>

                <div>
                  {routine.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-300 dark:text-stone-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Motivational Tip */}
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 text-center leading-relaxed">
          «أحب الأعمال إلى الله أدومها وإن قل» [صحيح البخاري]
        </div>
      </div>
    </div>
  );
}
