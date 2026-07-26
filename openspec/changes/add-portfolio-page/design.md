# Design: add-portfolio-page

## Page structure

The `/portfolio` page follows the same layout conventions as `/ferramentas`:

- Full-screen dark section (`min-h-screen bg-brand-950 pt-28 pb-24 text-white`)
- Centered title with gradient text and subtitle
- Responsive grid of project cards (1 col mobile, 2 col tablet, 3 col desktop)

## Project card layout

Each card is a `rounded-3xl` container with:

1. **Screenshot** — `h-48 rounded-2xl` image from `/portfolio/{slug}.png`, with gradient fallback on error and hover scale effect
2. **Project name** — `text-xl font-bold` with hover color transition to brand-300
3. **Tech tags** — `rounded-full` pills matching the ferramentas tag style
4. **Description** — `text-sm` paragraph, flex-1 to push buttons to the bottom
5. **Actions** — two full-width buttons: "GitHub" (brand-500 filled) and "Live Demo" (bordered)

## Screenshots

A Puppeteer script (`scripts/screenshots.mjs`) captures each live demo at 1280×800 viewport. SPAs that require JS will show their loading/error state, which is acceptable — it still demonstrates the app exists and its visual identity.

## Data model

Projects are defined as a static array of objects in `src/app/portfolio/page.tsx`:

- `name` — display name
- `slug` — screenshot filename (no extension)
- `description` — short PT-BR description
- `repo` — GitHub URL
- `demo` — live demo URL
- `tags` — tech stack labels
