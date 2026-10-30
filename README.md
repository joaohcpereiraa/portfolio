# João's Portfolio

An interactive portfolio built as a macOS desktop. Visitors land in a first-person 3D bedroom at night, click objects around the room to explore my timeline, tech stack, projects, CV and socials, then click the laptop on the desk to "enter the pc", watch it boot, and end up on a full desktop environment with draggable windows, a dock, a working terminal, and a PDF viewer for my CV.

**Live:** [joaohcpereiraa.github.io/portfolio](https://joaohcpereiraa.github.io/portfolio/)

---

## Features

**The intro sequence** — Four gated phases (`landing → entering → booting → desktop`) driven by a Zustand store. The landing is a 3D bedroom built with `@react-three/fiber` (drag to look around, bloom + hover outlines via `@react-three/postprocessing`); clicking the laptop's screen zooms the camera into it, cuts to an Apple-logo boot screen, and hands off to the desktop. The phase is persisted in `sessionStorage`, so a refresh drops you straight back onto the desktop instead of replaying the whole intro.

**The desktop** — Draggable, focusable windows with proper z-index stacking, a dock, a navbar, a control center, and a lock screen.

| Window | What it does |
| --- | --- |
| Terminal | Real command parser — `whoami`, `skills`, `projects`, `journey`, `contact`, `resume`, `open <app>`, `neofetch`, `echo`, `date`, `clear`, `exit` |
| Finder | Browse projects and files, opens them in the matching window |
| Safari | Embedded browser frame for live project links |
| Resume | Renders my CV as a real PDF via `react-pdf`, with download |
| Contact | Email and socials |
| Text / Image | Viewers for text and image files opened from Finder |
| NetworkError | Auto-appears when the browser goes offline |

**Terminal commands read from the same source of truth as the UI** — `src/shared/constants/index.js` feeds both the rendered components and the terminal output, so project and skill data never drifts between the two.

---

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | React 19, Vite 7 |
| Styling | Tailwind CSS 4 |
| State | Zustand (+ immer) |
| Animation | GSAP (Draggable, `@gsap/react`) |
| 3D | Three.js, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` |
| Misc | react-pdf, lucide-react, react-tooltip, dayjs, clsx |

---

## Architecture

`Experience.jsx` is the entry gate — it reads the boot phase and renders either the 3D bedroom, the boot screen, or `macos/App.jsx` (the desktop).

Windows are composed with a `WindowWrapper` HOC (`src/macos/hoc/WindowWrapper.jsx`) that wraps any component with GSAP open/close animation, GSAP `Draggable`, and click-to-focus. Adding a new window means writing the component, wrapping it, and registering it in `WINDOW_CONFIG`. Window open/close/focus state and z-index ordering live in `src/macos/store/window.js`.

State is split into small focused stores rather than one global blob, each kept with the part of the site it belongs to:

```
shared/store/boot.js      intro phases + sessionStorage persistence
bedroom/store/            bedroom focus / hover / hint state, picked-item selector, laptop screen position
macos/store/
├── window.js             open/close/focus, z-index stacking
├── ui.js                 lock screen
├── theme.js              light/dark
├── network.js            online/offline detection
└── location.js           Finder navigation
```

### Project structure

One folder per part of the site, plus `shared/` for what more than one of them uses:

```
src/
├── main.jsx · Experience.jsx · index.css   entry, phase gate (bedroom | booting | desktop), styles
├── shared/
│   ├── constants/        all portfolio content (index.js, career.json)
│   ├── utils/            assetUrl (base-path-aware assets), textHover (letter-weight hover), pdf (pdf.js worker)
│   ├── hooks/useEscape   capture-phase Escape for overlays
│   └── store/boot.js     intro phases
├── bedroom/              the 3D room (the landing)
│   ├── Bedroom.jsx       entry: the canvas plus the DOM overlays
│   ├── components/       React components only
│   │   ├── scene/        3D plumbing: Scene, CameraRig, Clickable
│   │   ├── room/         static decor: Room, Furniture, Bed, Rug, Door
│   │   ├── items/        3D objects you interact with: Laptop, Badges, Posters, Phone, ...
│   │   ├── guide/        the robot guide: Guide, Robot
│   │   └── ui/           DOM overlays: Loader, error boundary, TipBar, Pager,
│   │                     cards/ (BadgeCard, ProjectCard, CvCard, ...), phone/, handheld/
│   ├── hooks/            usePickable, usePickedCard, useTypewriter, useDragScroll, useLampSwitch
│   ├── store/            useBedroomStore, selectors, laptopScreen
│   ├── utils/            plain helpers, no React: motion, period, badges, pointer
│   └── data/             static config: items (spots + camera views), mapPins, guideLines
├── landing/              Quick view: the scrolling page
│   ├── Landing.jsx       entry: the overlay and its close button
│   ├── components/       sections/ (Hero, Journey, Skills, Projects), ui/ (SectionTitle)
│   ├── hooks/            useScrollEffects (card reveal + backdrop colour)
│   └── data/             backdrops (section → backdrop colour)
└── macos/                the desktop simulation
    ├── App.jsx · BootScreen.jsx
    ├── components/       Dock, Navbar, LockScreen, ControlCenter, ...
    ├── windows/          Terminal, Safari, Finder, Resume, Contact, ...
    ├── hoc/              WindowWrapper (drag, focus, animate)
    └── store/            window, ui, theme, network, location
```

Import aliases are configured in `vite.config.js` and `jsconfig.json`: `#constants` (→ `shared/constants`), `#shared`, `#bedroom`, `#landing`, `#macos`. Imports inside a folder stay relative; imports across folders use an alias.

---

## Getting started

```bash
npm install
npm run dev
```

| Script | Does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the built output locally |
| `npm run lint` | ESLint |
| `npm run deploy` | Build + publish `dist/` to the `gh-pages` branch |

---

## Deployment

This deploys to **two** targets, which need different base paths:

- **Vercel** — deploys automatically on push to `main`. Serves from the domain root, so `base` is `/`.
- **GitHub Pages** — served from `/portfolio/`, so `base` is `/portfolio/`.

`vite.config.js` picks between them off the `VERCEL` env var:

```js
base: process.env.VERCEL ? "/" : "/portfolio/"
```

Because of that split, **never hardcode `/`-prefixed asset paths** — always run them through `assetUrl()` (`src/shared/utils/assetUrl.js`), which prefixes `import.meta.env.BASE_URL` and leaves absolute URLs, `mailto:`, and `data:` alone. Hardcoding breaks the Pages build silently.

Vercel redeploys itself on push. GitHub Pages does **not** — it only updates when you run:

```bash
npm run deploy
```

---

## Credits

The MacBook Pro 14" model in `macbook-pro-14-inch-m5/` (served from `public/models/macbook-pro.glb`) is a third-party asset — see its original listing for licensing and attribution.
