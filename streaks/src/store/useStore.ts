import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dayKey } from '../lib/streak';
import type { ThemeName } from '../theme';

export interface Habit {
  id: string;
  name: string;
  createdAt: string;
  logs: string[]; // day keys
}

export const FREE_HABIT_LIMIT = 1;

interface State {
  habits: Habit[];
  activeId: string | null;
  isPro: boolean;
  theme: ThemeName;
  hydrated: boolean;
  addHabit: (name: string) => boolean; // false => blocked by free limit
  logToday: (id: string) => void;
  setActive: (id: string) => void;
  setPro: (v: boolean) => void;
  setTheme: (t: ThemeName) => void;
  replaceFromCloud: (s: Pick<State, 'habits' | 'activeId' | 'isPro' | 'theme'>) => void;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      habits: [],
      activeId: null,
      isPro: false,
      theme: 'volt',
      hydrated: false,
      addHabit: (name) => {
        const { habits, isPro } = get();
        const trimmed = name.trim();
        if (!trimmed) return false;
        if (!isPro && habits.length >= FREE_HABIT_LIMIT) return false;
        const h: Habit = { id: String(Date.now()), name: trimmed, createdAt: dayKey(), logs: [] };
        set({ habits: [...habits, h], activeId: h.id });
        return true;
      },
      logToday: (id) =>
        set((s) => ({
          habits: s.habits.map((h) =>
            h.id === id && !h.logs.includes(dayKey()) ? { ...h, logs: [...h.logs, dayKey()] } : h,
          ),
        })),
      setActive: (id) => set({ activeId: id }),
      setPro: (isPro) => set({ isPro }),
      setTheme: (theme) => set({ theme }),
      replaceFromCloud: (s) => set(s),
    }),
    {
      name: 'streaks-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ habits: s.habits, activeId: s.activeId, isPro: s.isPro, theme: s.theme }),
    },
  ),
);

// Flip `hydrated` once AsyncStorage has been read, so the UI never flashes onboarding.
if (useStore.persist.hasHydrated()) useStore.setState({ hydrated: true });
else useStore.persist.onFinishHydration(() => useStore.setState({ hydrated: true }));
