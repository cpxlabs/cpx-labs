# Tasks: add-portfolio-page

## Research

- [x] Fetch repo descriptions, demo URLs, and tech stacks from all 7 GitHub repos
- [x] Verify all demo sites are reachable and note their SPA/SSR behaviour

## Implementation

- [x] Create `src/app/portfolio/page.tsx` with static project data array
- [x] Build `ProjectCard` sub-component with screenshot, tags, description, action buttons
- [x] Add image-error fallback (gradient placeholder)
- [x] Add "Portfólio" link to `src/components/Header.tsx` navLinks array
- [x] Write `scripts/screenshots.mjs` Puppeteer script
- [x] Run screenshot script — capture all 7 demo screenshots to `public/portfolio/`

## Code review fixes

- [x] Fix Smokebuzz description — use all Portuguese, not mixed English/Portuguese
- [x] Add `brand-glow` class to GitHub button for visual consistency with ferramentas page

## Documentation (OpenSpec)

- [x] Write change proposal (`openspec/changes/add-portfolio-page/proposal.md`)
- [x] Write design document (`openspec/changes/add-portfolio-page/design.md`)
- [x] Write task list (`openspec/changes/add-portfolio-page/tasks.md`)
- [x] Write formal spec with requirements + scenarios (`openspec/specs/portfolio-page/spec.md`)
- [x] Update root `openspec/project.md` to list portfolio page change

## Future (not in scope)

- [ ] Category/tag filtering on the portfolio grid
- [ ] Project detail modal or dedicated route (`/portfolio/[slug]`)
- [ ] CMS-driven project data for larger catalogues
