import { create } from "zustand";

// Interaction state for the 3D bedroom landing: which object the camera is
// focused on (its panel is open), which one is hovered, and whether the
// "drag to look around" hint has already been dismissed this session.
const HINT_KEY = "portfolio:bedroom-hint";

const readHintSeen = () => {
  try {
    return sessionStorage.getItem(HINT_KEY) === "true";
  } catch {
    return false;
  }
};

const useBedroomStore = create((set) => ({
  focused: null,
  hovered: null,
  hintSeen: readHintSeen(),
  // Project posters and experience badges: noteIndex is the one asked for
  // (null = none open, just looking at the wall); takenIndex is the one
  // actually off the wall (it changes only after the open card flips away);
  // closing asks the open card to put itself away before the wall closes.
  // The CV sets noteIndex to 0 while it's picked up off the desk.
  noteIndex: null,
  takenIndex: null,
  closing: false,

  // Opening the board shows it with every note pinned; the visitor picks one.
  focus: (id) =>
    set({
      focused: id,
      hovered: null,
      takenIndex: null,
      closing: false,
      noteIndex: null,
    }),
  setNoteIndex: (noteIndex) => set({ noteIndex }),
  setTakenIndex: (takenIndex) => set({ takenIndex }),
  close: () => set({ focused: null, takenIndex: null, closing: false }),
  // Back / Esc / clicking the room: let an open note / poster card put itself
  // away first (focus always starts with nothing taken).
  requestClose: () => set((s) => (s.takenIndex !== null ? { closing: true } : { focused: null })),
  setHovered: (id) => set({ hovered: id }),

  dismissHint: () => {
    try {
      sessionStorage.setItem(HINT_KEY, "true");
    } catch {
      // ignore (private mode / storage disabled)
    }
    set({ hintSeen: true });
  },

  // Back to a fresh room (e.g. after powering off from the desktop).
  reset: () => set({ focused: null, hovered: null, takenIndex: null, closing: false }),
}));

export default useBedroomStore;
