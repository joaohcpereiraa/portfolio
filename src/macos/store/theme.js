import { create } from "zustand";

const applyTheme = (isDark) => {
  document.documentElement.classList.toggle("dark", isDark);
};

const stored = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialDark = stored ? stored === "dark" : prefersDark;
applyTheme(initialDark);

const useThemeStore = create((set) => ({
  isDark: initialDark,
  toggleTheme: () =>
    set((state) => {
      const next = !state.isDark;
      localStorage.setItem("theme", next ? "dark" : "light");
      applyTheme(next);
      return { isDark: next };
    }),
}));

export default useThemeStore;
