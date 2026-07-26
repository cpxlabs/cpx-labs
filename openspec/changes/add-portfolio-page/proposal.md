# Change: add-portfolio-page

## Why

The cpx-labs site showcases consulting services (`/servicos`) and internal tools (`/ferramentas`), but there is no page dedicated to the open-source projects built by the team. Prospective clients and collaborators have no way to discover shipping work — a music production platform (OpenBand), a children's pet-care game (Lilly's Box), a 3D product configurator (Hemp), a log-analysis platform (Log Tower), and others.

Adding a `/portfolio` page closes this gap and serves as a public portfolio of real, deployed software.

## What Changes

- **New page** at `/portfolio` renders a responsive grid of project cards.
- **Each card** shows a Puppeteer-captured screenshot, project name, tech-stack tags, short description (PT-BR), and two action buttons (GitHub, Live Demo).
- **Header nav** gains a "Portfólio" link between "Ferramentas" and "Quem Somos".
- **Screenshot script** at `scripts/screenshots.mjs` automates regeneration of all demo screenshots.
- **OpenSpec** formalises requirements, design decisions, and tasks for this capability.

## Projects included

| Project | Owner | Stack |
|---|---|---|
| Smokebuzz | az1nn | React Native, Expo, NativeWind, PWA |
| OpenBand | cpxlabs | Expo Router, Supabase, Three.js, Electron |
| Cazimu | cpxlabs | React, Vite, Framer Motion |
| Lilly's Box | cpxlabs | React Native, Expo, i18n, Google OAuth |
| Fullstack Log Tower | az1nn | Fastify, Prisma, PostgreSQL, Docker |
| Hemp Ramps 3D | cpxlabs | Three.js, React Three Fiber, Expo |
| MR. BANDS | cpxlabs | Vite, Canvas API, PWA, CSS Animations |

## Impact

- **New files**: `src/app/portfolio/page.tsx`, `scripts/screenshots.mjs`, `public/portfolio/*.png`, `openspec/changes/add-portfolio-page/*`, `openspec/specs/portfolio-page/spec.md`
- **Modified files**: `src/components/Header.tsx` (nav link), `openspec/project.md`
- **Affected areas**: public web front-end (`/portfolio`), header navigation, project documentation
- **No breaking changes** to existing pages, routes, or data modules
- **No new dependencies** — Puppeteer is already a devDependency
