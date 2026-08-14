# João's Portfolio

An interactive portfolio built as a macOS desktop. Visitors land on a scroll-driven 3D MacBook, click to "enter the pc", watch it boot, and end up on a full desktop environment with draggable windows, a dock, a working terminal, and a PDF viewer for my CV.

**Live:** [joaohcpereiraa.github.io/portfolio](https://joaohcpereiraa.github.io/portfolio/)

---

## Features

**The intro sequence** — Four gated phases (`landing → entering → booting → desktop`) driven by a Zustand store. The landing page renders a real `.glb` MacBook model with `@react-three/fiber`; clicking the CTA zooms the camera into the screen, cuts to an Apple-logo boot screen, and hands off to the desktop. The phase is persisted in `sessionStorage`, so a refresh drops you straight back onto the desktop instead of replaying the whole intro.

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

**Terminal commands read from the same source of truth as the UI** — `src/constants/index.js` feeds both the rendered components and the terminal output, so project and skill data never drifts between the two.

---

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | React 19, Vite 7 |
| Styling | Tailwind CSS 4 |
| State | Zustand (+ immer) |
| Animation | GSAP (Draggable, `@gsap/react`) |
| 3D | Three.js, `@react-three/fiber`, `@react-three/drei` |
| Misc | react-pdf, lucide-react, react-tooltip, dayjs, clsx |

---

## Architecture

`Experience.jsx` is the entry gate — it reads the boot phase and renders either the landing, the boot screen, or `App.jsx` (the desktop).

Windows are composed with a `WindowWrapper` HOC (`src/hoc/WindowWrapper.jsx`) that wraps any component with GSAP open/close animation, GSAP `Draggable`, and click-to-focus. Adding a new window means writing the component, wrapping it, and registering it in `WINDOW_CONFIG`. Window open/close/focus state and z-index ordering live in `src/store/window.js`.

State is split into small focused stores rather than one global blob:

```
store/
├── boot.js       intro phases + sessionStorage persistence
├── window.js     open/close/focus, z-index stacking
├── ui.js         lock screen
├── theme.js      light/dark
├── network.js    online/offline detection
├── location.js   Finder navigation
└── landing.js    landing scroll state
```

### Project structure

```
src/
├── Experience.jsx        phase gate (landing | booting | desktop)
├── App.jsx               the desktop
├── components/
│   ├── landing/          Hero, MacbookScene, Journey, Projects, Skills
│   ├── Dock, Navbar, BootScreen, LockScreen, ControlCenter, ...
├── windows/              Terminal, Safari, Finder, Resume, Contact, ...
├── hoc/WindowWrapper.jsx window behaviour (drag, focus, animate)
├── store/                zustand stores
├── constants/index.js    all portfolio content
└── utils/assetUrl.js     base-path-aware asset resolver
```

Import aliases are configured in `vite.config.js` and `jsconfig.json`: `#components`, `#constants`, `#store`, `#hoc`, `#windows`.

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

Because of that split, **never hardcode `/`-prefixed asset paths** — always run them through `assetUrl()` (`src/utils/assetUrl.js`), which prefixes `import.meta.env.BASE_URL` and leaves absolute URLs, `mailto:`, and `data:` alone. Hardcoding breaks the Pages build silently.

Vercel redeploys itself on push. GitHub Pages does **not** — it only updates when you run:

```bash
npm run deploy
```

---

## Credits

The MacBook Pro 14" model in `macbook-pro-14-inch-m5/` (served from `public/models/macbook-pro.glb`) is a third-party asset — see its original listing for licensing and attribution.
