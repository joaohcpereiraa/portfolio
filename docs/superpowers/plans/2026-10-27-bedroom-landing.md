# Bedroom Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the scroll landing with a first-person, late-night 3D bedroom whose clickable objects open each part of the portfolio, and whose laptop boots into the existing macOS desktop.

**Architecture:** A new `src/components/bedroom/` feature folder rendered by `Experience.jsx` in the `landing` phase. One R3F `<Canvas>` holds the room, furniture, clickable items and a camera rig; a small zustand store (`#store/bedroom`) holds focus/hover state; HTML panels render over the canvas and read the existing constants. The boot flow (`useBootStore`) is unchanged.

**Tech Stack:** React 19, @react-three/fiber 9, @react-three/drei 10, three 0.184, GSAP 3, zustand 5, Tailwind 4, react-pdf. New: `@react-three/postprocessing` (bloom). Dev-only, run once via npx: `@gltf-transform/cli`.

**Spec:** `docs/superpowers/specs/2026-10-27-bedroom-landing-design.md`

## Global Constraints

- **No git commits or pushes.** João commits himself (overrides the skill's commit steps).
- **No `npm run build` / `npm run dev` / browser checks by the agent.** João verifies visually. The agent's check is `npx eslint src` and must pass with 0 errors.
- No test runner exists, and none gets added. Each task ends with a **visual checklist** for João instead of automated tests.
- Look: late-night lo-fi. Dark room; light from the laptop screen, a neon/RGB strip, small warm lamps/fairy lights, blue moonlight through a window with moon and stars. Deep purples/blues with pink (`#ff4fd8`) / cyan (`#4fc3ff`) accents. Cosy, not scary.
- Camera stays in one spot; **drag** (mouse or touch) to look. No walking.
- 3D assets: target under ~8 MB total (soft). Only CC0/attribution-free models, credited in `public/models/CREDITS.md`.
- Desktop + tablet only; keep the existing small-screen notice.
- Respect `prefers-reduced-motion`: camera flights become instant cuts, no bobbing.
- All panel content comes from existing exports of `#constants`: `profile`, `careerTimeline`, `skillsOrbit`, `socials`, `landingProjects`; CV from `assetUrl("/files/resumee.pdf")`.
- Asset URLs go through `assetUrl()` (`src/utils/assetUrl.js`), as the existing code does.
- Match the surrounding code style: function components with arrow syntax, `#store/...` aliases, short "why" comments.

## Review Focus

1. **Click during a camera flight or with a panel open** — clicking another item must cancel the running tween and fly to the new item; the panel swaps. (Manual check in Task 4.)
2. **Drag that ends over an item** — must not count as a click (reuse the existing 6px `CLICK_THRESHOLD` rule). (Task 4.)
3. **Power off from the desktop** (`powerOff()` → `landing`) — bedroom remounts with nothing focused, camera at home, hint not shown again this session. (Task 4.)
4. **Touch (no hover)** — first tap on an item focuses it directly; labels must not get stuck visible. (Task 4.)
5. **Resize while an item is focused** — the camera stays on the item and the panel stays readable. (Task 4.)

---

### Task 1: Foundations — store, item registry, compressed laptop model, dependency

**Files:**
- Create: `src/store/bedroom.js`
- Create: `src/components/bedroom/items.js`
- Modify: `public/models/macbook-pro.glb` (compressed in place)
- Modify: `package.json` / `package-lock.json` (add `@react-three/postprocessing`)

**Interfaces:**
- Produces: `useBedroomStore` (default export) with state `{ focused: string|null, hovered: string|null, hintSeen: boolean }` and actions `focus(id: string)`, `close()`, `setHovered(id: string|null)`, `dismissHint()`, `reset()` (focused/hovered → null; keeps `hintSeen`).
- Produces: `ITEMS` (named export from `items.js`): array of `{ id, label, view: { position: [x,y,z], target: [x,y,z] } }` with ids exactly `"computer" | "timeline" | "tech" | "about" | "cv" | "socials" | "projects"`. Labels: `Computer`, `Timeline`, `Tech stack`, `About me`, `CV`, `Socials`, `Projects`. View coordinates are placeholders until Task 3 places furniture. Also export `HOME_VIEW = { position, target }` and `getItem(id)`.

- [ ] **Step 1:** `npm install @react-three/postprocessing@^3` (the R3F 9 compatible major).
- [ ] **Step 2:** Compress the laptop: `npx @gltf-transform/cli optimize public/models/macbook-pro.glb public/models/macbook-pro.glb --compress draco --texture-compress webp --texture-size 1024`. Expected: file well under 3 MB (check with `ls -la public/models`).
- [ ] **Step 3:** Confirm the screen is still detectable: write a throwaway node script in the scratchpad using `@gltf-transform/core` (`NodeIO` + `KHRONOS_EXTENSIONS`/draco decoder from `draco3dgltf`) that lists materials with an `emissiveTexture`. Expected: at least one. If none, the laptop component in Task 4 tags the screen by mesh/material name instead — record the name.
- [ ] **Step 4:** Write `src/store/bedroom.js` and `items.js` per Interfaces. `hintSeen` initialises from `sessionStorage["portfolio:bedroom-hint"] === "true"` (try/catch like `#store/boot`), `dismissHint()` writes it.
- [ ] **Step 5:** `npx eslint src` → 0 errors.

---

### Task 2: The room — canvas, architecture, lighting, look-around, loader, hint, skip; swap out the old landing

**Files:**
- Create: `src/components/bedroom/Bedroom.jsx` (root: canvas + HTML overlays)
- Create: `src/components/bedroom/Room.jsx` (floor, walls, ceiling, window with moon + stars outside, neon strip, lights)
- Create: `src/components/bedroom/CameraRig.jsx`
- Create: `src/components/bedroom/Loader.jsx`
- Modify: `src/Experience.jsx` — render `<Bedroom />` for `landing` and `entering`
- Delete: `src/components/landing/{Landing,Hero,Journey,Skills,Projects,RobotScene}.jsx`
- Move: `src/components/landing/MacbookScene.jsx` → keep only as reference until Task 4, then delete; move `src/components/landing/Robot.jsx` → `src/components/bedroom/Robot.jsx`
- Modify: `src/index.css` — delete the whole `#landing { … }` block and its now-unused keyframes (`stars-drift`, `tip-pulse`, `orbit-*`); add a `#bedroom` block
- Delete: `src/store/landing.js` (only the old landing used it — grep first)

**Interfaces:**
- Consumes: `HOME_VIEW`, `getItem`, `useBedroomStore` (Task 1); `useBootStore` `phase`, `skip`.
- Produces: `<CameraRig />` (inside Canvas). It owns the camera: look-around from `HOME_VIEW` when nothing is focused, and (Task 4) flights. Exposes nothing else; reads the store.

Room: roughly 5 m wide × 2.8 m tall × 5 m deep, camera at `HOME_VIEW.position ≈ [0, 1.55, 0.8]`. Lights: low ambient (~0.15, bluish), moonlight directional through the window, a pink and a cyan point/rect light for the neon strip, a warm point light for a lamp. `<EffectComposer><Bloom mipmapBlur luminanceThreshold≈0.8 intensity≈0.9 /></EffectComposer>` so only emissive bits glow.

Look-around: pointer drag rotates yaw/pitch around the camera position (≈0.004 rad/px), clamped to yaw ±110° and pitch −35°…+25°, damped toward the target. Attach listeners to the canvas element, not window. No OrbitControls (it orbits a target, which is the wrong feel for first person).

Overlays in `Bedroom.jsx`: `<Loader />` (drei `useProgress`, fades out at 100%), the hint "Drag to look around · click things that glow" shown until the first drag or click when `!hintSeen`, a "Skip to desktop" button calling `useBootStore().skip`, the existing small-screen notice markup, and the black `.bedroom-fade` that fades in when `phase === "entering"` (same as old `.landing-fade`).

- [ ] **Step 1:** Grep for `landing` imports across `src/` and list everything that depends on the files being deleted. Expected: only `Experience.jsx` and `src/store/landing.js` users inside the landing folder.
- [ ] **Step 2:** Build the files above; swap `Experience.jsx`; delete the old landing files and CSS.
- [ ] **Step 3:** `npx eslint src` → 0 errors.
- [ ] **Step 4 — Visual checklist for João:** loader shows then fades; you stand in a dark, lit-by-neon-and-moon room; dragging looks around and stops at the limits; hint disappears on first drag; "Skip to desktop" goes to the desktop; no leftover scroll page.

---

### Task 3: Furniture and decor, robot on the shelf

**Files:**
- Create: `src/components/bedroom/Furniture.jsx` (bed, desk, chair, nightstand, shelf, rug, lamp, plant, fairy lights)
- Create: `public/models/*.glb` (chosen CC0 pieces) and `public/models/CREDITS.md`
- Modify: `src/components/bedroom/Robot.jsx` — make `liveRef` optional; when absent it idles (gentle bob, blink, head follows the pointer via its own window `pointermove`). Remove `fly`/`jet` dependence on scroll (no velocity input).
- Modify: `src/components/bedroom/items.js` — real `view` coordinates for each item now that positions exist

**Interfaces:**
- Consumes: Room dimensions from Task 2.
- Produces: an anchor position for each item object (desk surface for laptop + CV papers, wall above desk for cork board, shelf for tech, nightstand for phone and photo frame, wall opposite bed for posters). Task 5 places item objects at these spots — export them from `Furniture.jsx` as `SPOTS` `{ [itemId]: { position, rotation } }`.

Models: try Kenney "Furniture Kit" (CC0) GLBs first; any piece that's missing, too heavy, or doesn't fit the look is built in code from boxes / `RoundedBox`, in the lo-fi palette. Tint materials toward the palette rather than using bright defaults. The robot sits on the shelf at roughly 0.25 m tall.

- [ ] **Step 1:** Fetch chosen CC0 models into a fresh scratchpad directory, inspect sizes, copy only the used `.glb` files to `public/models/`, write `CREDITS.md` (name, author, licence, URL per asset).
- [ ] **Step 2:** Build `Furniture.jsx`, place the robot, export `SPOTS`, update `items.js` views so each view frames its spot.
- [ ] **Step 3:** `du -ch public/models/*.glb` → total around 8 MB or less. `npx eslint src` → 0 errors.
- [ ] **Step 4 — Visual checklist for João:** the room reads as a cosy bedroom at night; robot on the shelf blinks and looks at the cursor; nothing is too bright or flat.

---

### Task 4: Interaction — clickable items, camera flights, panel shell, laptop boot

**Files:**
- Create: `src/components/bedroom/Clickable.jsx`
- Create: `src/components/bedroom/Laptop.jsx` (ported from `MacbookScene.jsx`: normalise + tag screen + click-to-enter + zoom-into-screen; then delete `src/components/landing/` entirely)
- Create: `src/components/bedroom/panels/Panel.jsx`
- Modify: `CameraRig.jsx` (flights), `Bedroom.jsx` (render the panel), `src/index.css`

**Interfaces:**
- Consumes: `useBedroomStore`, `getItem`, `SPOTS`.
- Produces: `<Clickable id={itemId}>{children}</Clickable>` — wraps any 3D object. Hover → `setHovered(id)`, pointer cursor, highlight (emissive pulse or drei `<Outlines>`), and a drei `<Html>` label with `getItem(id).label`. Press+release under 6 px movement → `focus(id)`. Stops propagation so the look-around drag doesn't fire.
- Produces: `<Panel title onClose>{children}</Panel>` — HTML side sheet over the canvas: dark translucent background with backdrop blur, readable 15–16px body text, close button, closes on Esc and on click outside. Task 5 fills it.
- Produces: `PANELS` map in `Bedroom.jsx` `{ [itemId]: Component }` that Task 5 fills; `computer` has no panel.

Camera flights: when `focused` changes, GSAP-tween camera position and look-at target to `getItem(id).view` (≈1.0 s, `power2.inOut`; 0 s under reduced motion), killing any running tween first. `close()` flies back to the last home look direction. Look-around is disabled while focused.

Laptop: clicking the laptop focuses `"computer"` and shows the tip "Click the screen to start"; clicking the screen while `focused === "computer"` calls `useBootStore().enter()`. On `phase === "entering"` the camera zooms into the screen's world position (same as old `CameraRig`), then `boot()`. Remove `OrbitControls` from the ported code.

On `phase` returning to `landing` (power off), call `reset()` on mount.

- [ ] **Step 1:** Build the files; wrap the laptop in `Clickable`; render `Panel` with a placeholder body for every other id so flights can be checked before Task 5.
- [ ] **Step 2:** `npx eslint src` → 0 errors.
- [ ] **Step 3 — Visual checklist for João (covers Review Focus 1–5):** hover shows glow + label; click flies to the object and opens the panel; clicking a second item mid-flight switches cleanly; dragging across an item doesn't open it; Esc / ✕ / click outside closes and flies back; laptop → screen click → zoom → boot → desktop; power off returns to the bedroom un-focused; on a touchscreen one tap opens an item; resizing with a panel open keeps things readable.

---

### Task 5: The six content items and their panels

**Files:**
- Create in `src/components/bedroom/items/`: `CorkBoard.jsx`, `TechShelf.jsx`, `PhotoFrame.jsx`, `Papers.jsx`, `Phone.jsx`, `Posters.jsx`
- Create in `src/components/bedroom/panels/`: `TimelinePanel.jsx`, `TechPanel.jsx`, `AboutPanel.jsx`, `CvPanel.jsx`, `SocialsPanel.jsx`, `ProjectsPanel.jsx`
- Modify: `Bedroom.jsx` (`PANELS` map), the scene (place each item at its `SPOTS` entry inside `<Clickable>`), `src/index.css`

| id | 3D object | Panel shows |
|---|---|---|
| `timeline` | cork board with pinned notes (one per `careerTimeline` entry, colour by `type`) | vertical timeline: period, title, place, description, Work/Education tag |
| `tech` | shelf with small glowing cubes/figurines, one per stack | tabs per `skillsOrbit` stack; each item icon + name + `blurb` + `usedAt` |
| `about` | photo frame with `public/images/joao.png` as texture | photo, `profile.name`, `profile.role`, `profile.bio` |
| `cv` | stack of papers / printer | first page preview with react-pdf (same worker setup as `src/windows/Resume.jsx`), "Open" and "Download" links |
| `socials` | phone on the nightstand, screen glowing | one big link per `socials` entry with its icon and `bg` colour |
| `projects` | framed posters, using `landingProjects[].image` or the `accent` gradient | cards: image/cover, `tagline`, `name`, `description`, stack chips, link with `linkLabel` |

The old landing components (deleted in Task 2) are useful markup references in git history for the timeline, orbit tabs and project cards.

- [ ] **Step 1:** Build the six objects and six panels; register them.
- [ ] **Step 2:** `npx eslint src` → 0 errors.
- [ ] **Step 3 — Visual checklist for João:** every object glows on hover and opens the right panel with real content; the CV preview loads and downloads; social links open in a new tab; text is easy to read over the scene.

---

### Task 6: Polish and cleanup

**Files:**
- Modify: anything under `src/components/bedroom/`, `src/index.css`, `README.md` (if it describes the old landing)

- [ ] **Step 1:** Reduced motion: confirm every GSAP tween and idle animation checks `prefers-reduced-motion`.
- [ ] **Step 2:** Small ambient touches as time allows (twinkling stars, blinking LED on the desk).
- [ ] **Step 3:** Grep for dead references: `landing-`, `useLandingStore`, `skillsOrbit`/`landingProjects` still used? (keep exports used by panels). Remove unused CSS.
- [ ] **Step 4:** Update `README.md` mentions of the scroll landing, if any.
- [ ] **Step 5:** `npx eslint src` → 0 errors.
- [ ] **Step 6 — Visual checklist for João:** with OS "reduce motion" on, flights are instant cuts; full run-through from load to desktop and back.
