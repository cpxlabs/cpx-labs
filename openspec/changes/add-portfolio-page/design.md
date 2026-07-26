# Design: add-portfolio-page

## Page layout

The `/portfolio` page matches the visual conventions of `/ferramentas` and the rest of the site:

```
<section> (min-h-screen bg-brand-950 pt-28 pb-24 text-white)
  <div> (max-w-7xl mx-auto px-4 sm:px-6 lg:px-8)
    <header>   ← gradient title + subtitle, centered
    <grid>     ← 1/2/3 column responsive grid
      <ProjectCard />  ← repeated per project
```

### Typography

- **Title**: `text-4xl sm:text-5xl font-extrabold` with `bg-gradient-to-r from-white via-brand-100 to-brand-300 bg-clip-text text-transparent`
- **Subtitle**: `text-brand-100/70 text-lg max-w-2xl mx-auto`
- **Card heading**: `text-xl font-bold` → `group-hover:text-brand-300`
- **Description**: `text-sm leading-relaxed text-brand-100/60`

## Project card anatomy

```
+-----------------------------------+
|  [ screenshot  h-48  rounded-2xl ] |
|                                   |
|  Project Name                     |
|  [tag] [tag] [tag] [tag]          |
|                                   |
|  Short description text here...   |
|  that fills remaining space       |
|                                   |
|  [   GitHub   ] [ Live Demo    ] |
+-----------------------------------+
```

### Screenshot

- Image source: `/portfolio/{slug}.png`
- Sizing: `h-48 w-full object-cover` inside a `rounded-2xl overflow-hidden` container
- Hover: `group-hover:scale-105` slow zoom
- Error state: `onError` handler swaps to a `bg-gradient-to-br from-brand-800 to-brand-950` placeholder with a diamond symbol
- Background during load: `bg-brand-900/40` matches the dark theme

### Tags

Styled identically to ferramentas tags:
- `text-xs bg-brand-800/60 text-brand-300 border border-brand-700/40 rounded-full px-3 py-1 font-medium`

### Action buttons

Two same-width buttons fill the card bottom:

| Button | Style |
|---|---|
| **GitHub** | `bg-brand-500` filled + GitHub SVG icon + `brand-glow` shadow |
| **Live Demo** | `border border-brand-700` outlined + external-link SVG icon |

Both use `target="_blank" rel="noopener noreferrer"` and share an identical `flex-1 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold` base.

## Data model

Static typed array co-located with the page component:

```typescript
interface Project {
  name: string;
  slug: string;
  description: string;
  repo: string;
  demo: string;
  tags: string[];
}
```

Key decisions:
- **Co-located data** rather than a shared lib module — portfolio projects are presentation-only and unlikely to be consumed elsewhere
- **No external CMS** — the project list changes infrequently; static data avoids latency, build complexity, and auth overhead
- **Slug maps to screenshot filename** — `slug: "openband"` → `/portfolio/openband.png`

## Screenshot pipeline

1. Developer runs `node scripts/screenshots.mjs`
2. Puppeteer launches headless Chromium (already a devDependency)
3. For each of the 7 URLs, navigates with `waitUntil: "domcontentloaded"` + 3s delay
4. Captures a 1280×800 viewport screenshot to `public/portfolio/{slug}.png`
5. On timeout/error, saves whatever rendered (partial capture) and continues
6. Screenshots are committed to the repo for CI/CD and production builds

SPA sites that require JavaScript will render their loading shell — this is acceptable because the loading state still communicates the app's visual identity and colour palette.

## Accessibility

- All external links use `rel="noopener noreferrer"`
- Screenshot images carry `alt={project.name}`
- Cards use semantic HTML (`<h3>` for project name)
- Reduced-motion respects the site-wide `prefers-reduced-motion` reset in `globals.css`

## Future considerations

- **Filtering**: could add category/tag filter controls (similar to MR. BANDS site filter system)
- **Detail modal**: clicking a card could open a lightbox with more screenshots and a longer description
- **CMS integration**: if the project list grows beyond ~15, migrate to a headless CMS or markdown collection
