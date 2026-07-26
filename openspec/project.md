# Project: cpx-labs

cpx-labs is a Next.js consulting site. Three initiatives drive feature work:

1. **Tools** — a curated **Ferramentas (Tools) hub** that showcases developer
   tooling and explores tighter integration between standalone tools and the web
   front-end.
2. **Portfolio** — a public-facing **Portfolio page** that displays open-source
   projects built by the team, with screenshots, descriptions, and links to
   GitHub repositories and live demos.
3. **Backend** — standalone deployment of API routes on Render with Docker,
   OpenAPI documentation, and a Render Blueprint config.

## Key references

### Tools

- **Copied tool source**: `tools/cv-smart-assistant/` — a Chrome extension
  (Manifest V3) that parses PDF resumes and autofills job application forms
  across LinkedIn, Greenhouse, Lever, Workday, and generic sites. Upstream repo:
  <https://github.com/az1nn/py>.
- **Tools hub web page**: `/ferramentas` — a web features page that showcases the
  tools, documents installation/usage, and (planned) consumes data from the
  extension.

### Backend

- **Backend API**: `openspec/specs/backend-api/spec.md` — formal specification for
  API routes, build configuration (standalone output + Docker), Render deployment,
  OpenAPI docs, and health checks.

- **Portfolio page**: `/portfolio` — a responsive card grid of open-source
  projects, each with a screenshot, tech tags, description, GitHub link, and
  live demo link.
- **Screenshot script**: `scripts/screenshots.mjs` — Puppeteer-based script
  that captures demo screenshots for regeneration.

## Workstreams

1. **bridges** — integration between the browser extension and the cpx-labs web
   front-end (sharing/exporting parsed CV data from the extension to the web app).
2. **front-end features** — UI work for the tools hub (tool listing, detail
   views, install guides, and a typed tool data module).
3. **portfolio** — UI and data for the `/portfolio` page (project cards,
   screenshots, navigation link).
4. **deploy-backend** — standalone output + Docker + Render Blueprint for
   API backend deployment.

## Active changes

- `integrate-cv-smart-assistant` — integrate the CV Smart Assistant into cpx-labs:
  copy code under `tools/`, add the `/ferramentas` page, and plan the bridge +
  front-end enhancements. (Partially complete — tools hub built, bridge proposed — see
  `changes/integrate-cv-smart-assistant/`.)
- `add-portfolio-page` — add a `/portfolio` page showcasing open-source projects
  with screenshots, descriptions, and links to GitHub/live demos. (Completed — see
  `changes/add-portfolio-page/`.)
- `deploy-backend` — deploy API backend on Render with Docker, standalone
  output, OpenAPI spec, and deployment guide. (Completed — see
  `changes/deploy-backend/` and `specs/backend-api/`.)
