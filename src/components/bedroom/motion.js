// Visitors who ask the OS for less motion get instant camera cuts and no idle bobbing.
export const reducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
