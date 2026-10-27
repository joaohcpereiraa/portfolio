# Bedroom landing: design

## Intent

Replace the current scroll-based landing page with a 3D bedroom the visitor is
*inside*, first person. The room is the portfolio: every part of João's
portfolio lives on an object in the room that the visitor can see and click.
The desk computer is the door into the existing macOS desktop simulation.

Why: the current landing is a long scroll of sections. João wants something
memorable and playful that still gets a recruiter to the facts (who he is,
timeline, tech, CV, socials) quickly.

## What the visitor experiences

1. A short loading screen (progress bar) while models load, in the same dark
   style as the site.
2. They appear standing in a bedroom at night. Look: **late-night lo-fi**
   (João picked this from three sketches). The room is dark and lit mainly by
   the glowing computer screen, an RGB/neon strip along the wall, warm
   small lamps or fairy lights, and blue moonlight through a window with a
   moon and stars outside. Deep purples and blues with pink/cyan accents. It
   should feel cosy, not scary.
3. They look around by **dragging** (mouse or touch). The camera stays in one
   spot near the middle of the room. No walking.
4. A one-time hint tells them how it works ("Drag to look around · click
   things that glow").
5. Hovering a clickable object highlights it (glow/outline) and shows a short
   label ("Timeline", "CV", ...).
6. Clicking an object flies the camera smoothly toward it and opens a panel
   with that content. Closing the panel (button, Esc, or clicking outside)
   flies the camera back to where it was.
7. Clicking the computer screen zooms into the screen and hands off to the
   existing boot screen → macOS desktop, exactly like the MacBook does today.

## Objects and what they open

João asked that the room cover: timeline, technologies, who he is, CV,
social pages, and the macOS desktop. Mapping (the objects are my call;
the coverage is João's):

| Object | Opens | Data source (existing) |
|---|---|---|
| Laptop on the desk | Zoom into screen → boot → macOS desktop | `useBootStore().enter()` flow |
| Cork board / wall calendar with pinned notes | Career timeline | `careerTimeline` (`src/constants/career.json`) |
| Shelf with gadgets, figurines, stickers | Technologies, grouped by stack | `skillsOrbit` |
| Photo frame (João's photo) | About me: name, role, bio, photo | `profile`, `public/images/joao.png` |
| Papers / printer on the desk | CV: preview + download | `public/files/resumee.pdf` |
| Phone on the nightstand | Social links | `socials` |
| Framed posters on the wall | Projects | `landingProjects` |

All panel content is read from the existing constants so the desktop and the
room never drift apart. No new content needs writing.

## Decisions

- **Replaces the landing phase.** `Experience.jsx` keeps its phases
  (`landing → entering → booting → desktop`); the `landing` phase now renders
  the bedroom instead of `Landing`. Boot screen, desktop, `powerOff` back to
  the landing, and the session "already entered" flag all stay as they are.
- **The old landing goes.** `Hero`, `Journey`, `Skills`, `Projects`,
  `RobotScene`, `Landing` and their CSS in `src/index.css` are removed once
  the bedroom replaces them.
- **The robot stays (João's call).** The procedural astronaut-bot in
  `src/components/landing/Robot.jsx` (currently uncommitted) lives on in the
  room as a small ambient character, e.g. sitting on the shelf, idling,
  blinking and glancing at the cursor. Move it alongside the bedroom code.
  Only its scroll-driven rig (`RobotScene.jsx`) is dropped, since the room
  doesn't scroll. Whether it does anything when clicked is left to the builder. The MacBook GLB
  (`public/models/macbook-pro.glb`) and its screen-click + camera-zoom logic
  are reused for the laptop on the desk.
- **Stack:** existing React Three Fiber + drei + GSAP. Adding
  `@react-three/postprocessing` for bloom (makes the neon/screen glow read
  properly) is approved by me as the designer; nothing else new unless needed.
- **Models:** an *invented* room, not a copy of João's real one (my call;
  he didn't ask for a replica). Furniture from free CC0 low-poly packs
  (e.g. Kenney Furniture Kit, Poly Pizza CC0 models) as GLB in
  `public/models/`, plus simple pieces built in code where that's easier.
  Only CC0 / attribution-free assets; record sources in a short
  `public/models/CREDITS.md`.
- **Screens:** desktop and tablet, same as today (the existing "designed for
  desktop/tablet" notice on small screens stays). Touch drag must work.
- **Skip:** a small, always-visible "Skip to desktop" control, using the
  existing `skip()` in `useBootStore`.

## Goals

- Within a few seconds a visitor understands they can look around and click
  things.
- Every portfolio area (list above) is reachable in one click from the room.
- Feels like João's late-night room: cosy, glowing, a bit of personality.

## Non-goals

- Walking / keyboard movement, physics, collisions.
- Phone-size layouts.
- A realistic replica of João's actual bedroom.
- New portfolio content.

## Anti-goals (would be a failure even if it works)

- Visitors can't tell what's clickable, or miss the CV / socials.
- Panel text is hard to read over the 3D scene.
- Slow first load: aim for under ~8 MB of 3D assets total (a target, not
  a hard cap) and a smooth frame rate on an ordinary laptop. The existing
  MacBook GLB is ~11 MB on its own, so it gets a one-off compression pass
  (gltf-transform: Draco/meshopt geometry + resized textures) before reuse;
  drei's `useGLTF` already handles Draco decoding. Keep the "screen = mesh
  with an emissiveMap" detection working after compression, or tag the
  screen another way. (My call.)
- Motion that makes people dizzy: camera moves are smooth and short; respect
  `prefers-reduced-motion` (instant cuts instead of flights).

## Left to the builder

- Exact room layout, camera position, look-around limits, and the
  per-object camera viewpoints.
- Specific models chosen, lighting setup, bloom strength, colours within the
  lo-fi palette.
- Panel design (overlay vs. side sheet), as long as it matches the site's
  dark style and stays readable.
- Hover highlight technique (outline, emissive pulse, etc.).
- Small ambient touches (twinkling stars, a slowly blinking LED, a cat).
