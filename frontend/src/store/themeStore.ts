import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  // Read initial preference from localStorage or system
  const saved = localStorage.getItem('mailshield-theme');
  const initialDark = saved !== null ? saved === 'dark' : true;

  if (typeof document !== 'undefined') {
    if (initialDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }

  return {
    isDark: initialDark,
    toggleTheme: () => {
      set((state) => {
        const next = !state.isDark;
        localStorage.setItem('mailshield-theme', next ? 'dark' : 'light');
        if (next) {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        }
        return { isDark: next };
      });
    },
    setTheme: (dark: boolean) => {
      localStorage.setItem('mailshield-theme', dark ? 'dark' : 'light');
      if (dark) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
      set({ isDark: dark });
    }
  };
});
