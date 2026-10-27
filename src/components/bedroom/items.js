// Clickable objects in the bedroom: where each sits, where its glowing marker
// floats, and where the camera flies to frame it. Coordinates are metres in
// room space: x right, y up, z toward the viewer. The room spans -2.5..2.5 on
// x and z; the desk is against the back wall (z = -2.5), the bed in the
// back-left corner, the shelf and posters on the right wall (x = 2.5).

export const ROOM = { half: 2.5, height: 2.8 };

// Where the visitor stands, looking at the desk.
export const HOME_VIEW = {
  position: [0.3, 1.55, 0.9],
  target: [0.3, 1.25, -2.5],
};

// Bedside lamp on the nightstand (decor).
export const LAMP_SPOT = { position: [-0.85, 0.5, -2.3], rotation: [0, 0, 0] };

// Cozy clutter on the lower shelf plank (lava lamp, speaker, cactus, records).
export const SHELF_SPOT = { position: [2.37, 1.2, -0.9], rotation: [0, -Math.PI / 2, 0] };

// `quiet` items are decor you can still fly up to: no marker or label, just
// the hover outline.
export const ITEMS = [
  {
    id: "map",
    quiet: true,
    label: "World map",
    // World map with travel pins on the wall behind the visitor, right of the door.
    spot: { position: [0.88, 1.6, 2.47], rotation: [0, Math.PI, 0] },
    marker: [0.88, 2.1, 2.4],
    view: { position: [0.88, 1.6, 1.4], target: [0.88, 1.6, 2.5] },
  },
  {
    id: "computer",
    label: "Computer",
    spot: { position: [0.4, 0.75, -2.15], rotation: [0, 0, 0] },
    marker: [0.4, 1.12, -2.2],
    view: { position: [0.4, 1.02, -1.75], target: [0.4, 0.88, -2.25] },
  },
  {
    id: "timeline",
    label: "Timeline",
    spot: { position: [0.4, 1.62, -2.47], rotation: [0, 0, 0] },
    marker: [0.4, 2.12, -2.4],
    view: { position: [0.4, 1.6, -1.55], target: [0.4, 1.62, -2.5] },
  },
  {
    id: "tech",
    label: "Tech stack",
    // Lying on the window sill above the bed, top edge toward the glass.
    spot: { position: [-2.41, 1.14, -1.3], rotation: [0, Math.PI / 2 - 0.2, 0] },
    marker: [-2.41, 1.4, -1.3],
    view: { position: [-1.75, 1.55, -1.05], target: [-2.41, 1.14, -1.3] },
  },
  {
    id: "cv",
    label: "CV",
    // The real first page lies on the desk; clicking opens it in front of you.
    spot: { position: [0.92, 0.75, -2.08], rotation: [0, -0.2, 0] },
    marker: [0.92, 0.98, -2.08],
    view: { position: [0.92, 1.15, -1.7], target: [0.92, 0.76, -2.08] },
  },
  {
    id: "phone",
    label: "About me",
    spot: { position: [-1.65, 0.555, -0.95], rotation: [0, 0.5, 0] },
    marker: [-1.65, 0.8, -0.95],
    view: { position: [-1.4, 0.95, -0.6], target: [-1.65, 0.55, -0.95] },
  },
  {
    id: "projects",
    label: "Projects",
    // One poster per project; picking one takes it off the wall.
    spot: { position: [2.48, 1.6, 1.0], rotation: [0, -Math.PI / 2, 0] },
    marker: [2.4, 2.1, 1.0],
    view: { position: [1.0, 1.6, 1.0], target: [2.5, 1.6, 1.0] },
  },
];

export const getItem = (id) => ITEMS.find((item) => item.id === id);
