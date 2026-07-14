# Change: integrate-cv-smart-assistant

## Why

We have a working Chrome extension (CV Smart Assistant) that parses PDF resumes
and autofills job applications, but it currently lives outside the cpx-labs site.
Bringing it into cpx-labs as a featured tool (1) showcases real, shipping work to
prospective clients, (2) gives us a home page (`/ferramentas`) to document
installation and usage, and (3) opens the door to a tighter loop where parsed CV
data flows from the extension into the web front-end.

## What Changes

- Copy the extension source under `tools/cv-smart-assistant/` (source of truth
  mirrored locally; upstream at <https://github.com/az1nn/py>).
- Add a new `/ferramentas` web page that lists tools, shows tool details, and
  documents installation/usage.
- Introduce a typed tool data module (`src/lib/tools.ts`) so new tools can be
  added without UI changes.
- Plan and implement a **bridge** so the extension can export/share parsed CV
  JSON to the web app, which then renders a CV preview.
- Plan and implement front-end enhancements: tool-detail routes, featured-tool
  section, install guide, and a placeholder for planned tools.

## Impact

- **New files**: `tools/cv-smart-assistant/*`, `src/app/ferramentas/*`,
  `src/lib/tools.ts`, bridge endpoint/import flow.
- **Affected areas**: public web front-end (`/ferramentas`), tooling/build docs,
  and a new web-facing data flow (parsed CV JSON).
- **Risks**: keeping the local `tools/` mirror in sync with the upstream repo;
  validating CV JSON shapes consumed by the web app; privacy of exported CV data
  (keep processing client-side where possible).
- **No breaking changes** to existing cpx-labs pages.
