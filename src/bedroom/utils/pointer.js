import useBootStore from "#shared/store/boot";

// Pointer movement (px) below which a press counts as a click, not a drag to
// look around.
const CLICK_THRESHOLD = 6;

// Whether a three.js click event was really the end of a drag.
export const isDrag = (e) => e.delta > CLICK_THRESHOLD;

// The room only reacts to the pointer while it's on screen (not while booting
// into the desktop).
export const canInteract = () => useBootStore.getState().phase === "landing";
