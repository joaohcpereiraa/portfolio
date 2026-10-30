import { create } from "zustand";

// Lock screen state: the desktop always boots locked, like a real login screen.
const useUiStore = create((set) => ({
  locked: true,

  lock: () => set({ locked: true }),
  unlock: () => set({ locked: false }),
}));

export default useUiStore;
