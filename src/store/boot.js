import { create } from "zustand";

// Phases of the intro experience that gates the macOS desktop:
//   landing  → hero + scroll-driven 3D macbook reveal
//   entering → camera zoom-into-screen transition (CTA clicked)
//   booting  → black screen with Apple logo + loading bar
//   desktop  → the actual macOS desktop (existing App)
const ENTERED_KEY = "portfolio:entered";

const hasEntered =
  typeof sessionStorage !== "undefined" &&
  sessionStorage.getItem(ENTERED_KEY) === "true";

const markEntered = () => {
  try {
    sessionStorage.setItem(ENTERED_KEY, "true");
  } catch {
    // ignore (private mode / storage disabled)
  }
};

const clearEntered = () => {
  try {
    sessionStorage.removeItem(ENTERED_KEY);
  } catch {
    // ignore (private mode / storage disabled)
  }
};

const useBootStore = create((set) => ({
  phase: hasEntered ? "desktop" : "landing",

  enter: () => set({ phase: "entering" }),
  boot: () => set({ phase: "booting" }),

  finish: () => {
    markEntered();
    set({ phase: "desktop" });
  },

  skip: () => {
    markEntered();
    set({ phase: "desktop" });
  },

  // Shut down: forget the session and return to the landing experience.
  powerOff: () => {
    clearEntered();
    set({ phase: "landing" });
  },
}));

export default useBootStore;
