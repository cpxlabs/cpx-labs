# Change: add-portfolio-page

## Why

The cpx-labs site showcases consulting services and internal tools, but there is no dedicated page to display open-source projects developed by the team. Adding a `/portfolio` page lets prospective clients and collaborators see real shipping work — music production platforms, games, 3D configurators, log analysis tools, and more.

## What Changes

- Add a new `/portfolio` page that lists 7 open-source projects in a responsive card grid.
- Each card shows a screenshot, description, tech tags, and links to GitHub + live demo.
- Add "Portfólio" to the header navigation.
- Take Puppeteer screenshots of each live demo for card previews.
- Create a screenshot script under `scripts/` for repeatable regeneration.

## Impact

- **New files**: `src/app/portfolio/page.tsx`, `scripts/screenshots.mjs`, `public/portfolio/*.png`
- **Modified files**: `src/components/Header.tsx` (nav link)
- **Affected areas**: public web front-end (`/portfolio`), header navigation
- **No breaking changes** to existing cpx-labs pages.
