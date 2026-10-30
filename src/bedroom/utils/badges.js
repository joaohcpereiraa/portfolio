import { careerTimeline, placeLogos } from "#constants";

// One colour per place, in order of first appearance, so every badge from the
// same employer matches (like a real company's lanyards).
const PALETTE = ["#7dd3fc", "#86efac", "#ffd166", "#f9a8d4", "#c4b5fd"];
const places = [...new Set(careerTimeline.map((e) => e.place))];

export const badgeColor = (entry) => PALETTE[places.indexOf(entry.place) % PALETTE.length];

// "ISEP — Instituto Superior…" → "ISEP".
export const shortPlace = (place) => place.split(" — ")[0];

// The place's logo URL, or undefined if there isn't one.
export const placeLogo = (entry) => placeLogos[shortPlace(entry.place)];

// "Software Engineer · Summer Internship" → "Software Engineer".
export const shortTitle = (title) => title.split(" · ")[0];
