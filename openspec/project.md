# Project: cpx-labs Tools Initiative

cpx-labs is a Next.js consulting site. This initiative ("cpx-labs tools") brings
developer tooling into the site as a curated **Ferramentas (Tools) hub** and
explores tighter integration between standalone tools and the web front-end.

## Key references

- **Copied tool source**: `tools/cv-smart-assistant/` — a Chrome extension
  (Manifest V3) that parses PDF resumes and autofills job application forms
  across LinkedIn, Greenhouse, Lever, Workday, and generic sites. Upstream repo:
  <https://github.com/az1nn/py>.
- **Tools hub web page**: `/ferramentas` — a web features page that showcases the
  tools, documents installation/usage, and (planned) consumes data from the
  extension.

## Workstreams

1. **bridges** — integration between the browser extension and the cpx-labs web
   front-end (sharing/exporting parsed CV data from the extension to the web app).
2. **front-end features** — UI work for the tools hub (tool listing, detail
   views, install guides, and a typed tool data module).

## Active changes

- `integrate-cv-smart-assistant` — integrate the CV Smart Assistant into cpx-labs:
  copy code under `tools/`, add the `/ferramentas` page, and plan the bridge +
  front-end enhancements. (Proposed — see `changes/integrate-cv-smart-assistant/`.)
- `add-portfolio-page` — add a `/portfolio` page showcasing open-source projects
  with screenshots, descriptions, and links to GitHub/live demos. (Completed — see
  `changes/add-portfolio-page/`.)
