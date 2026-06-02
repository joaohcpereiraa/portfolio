import { create } from "zustand";

// Scroll progress (0 = top of landing, 1 = fully scrolled) shared from the
// DOM ScrollTrigger into the 3D scene so the laptop can rotate with scroll.
const useLandingStore = create((set) => ({
  progress: 0,
  setProgress: (progress) => set({ progress }),
}));

export default useLandingStore;
