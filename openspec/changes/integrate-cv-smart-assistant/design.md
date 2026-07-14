# Design: integrate-cv-smart-assistant

## Bridge architecture (extension <-> web)

The extension already parses the PDF and holds structured CV data in its
`storage`/`content` scripts. The bridge exposes that data to the web app with a
minimal, client-side-first approach:

1. **Export in the extension popup** — add an "Export / Share CV" action in
   `src/popup/` that serializes the parsed CV into a stable JSON schema
   (`CVData`).
2. **Transport** — prefer a self-contained transport with no backend: a
   downloadable JSON file, a `data:`/deep-link URL (e.g.
   `/ferramentas?cv=<encoded>`), or `navigator.clipboard` copy. Optionally add a
   small Next.js route handler (`/api/cv-import`) that accepts the JSON if a
   server round-trip is desired; keep it stateless and never persist PII.
3. **Web consumption** — the `/ferramentas` page reads the incoming CV JSON
   (from query param, upload, or paste) and renders a read-only preview component
   (`CvPreview`) using the same `CVData` schema shared between extension and web
   (duplicate the type in `src/lib/`; sync from the extension source).
4. **Schema** — define `CVData` with fields: `name`, `contact` (email/phone),
   `summary`, `experience[]`, `education[]`, `skills[]`, `parsedAt`, `source`.

## Front-end component plan

- **Tool data module** (`src/lib/tools.ts`) — typed `Tool` interface
  (`id`, `name`, `description`, `features[]`, `platforms[]`, `repoUrl`,
  `localPath`, `status: 'available' | 'planned'`) and an exported `tools` array.
- **Tool card** — presentational component rendering a single `Tool` (name,
  summary, platforms, links).
- **Tools hub page** (`/ferramentas`) — maps over `tools`, renders `ToolCard`s,
  includes a featured-tool section (CV Smart Assistant) and a "planned tools"
  placeholder for `status: 'planned'`.
- **Tool detail route** (`/ferramentas/[id]`) — server/client component that
  looks up a tool by id and shows full details + install guide.
- **Install guide** — static section/component documenting load-unpacked from
  `tools/cv-smart-assistant/` and the Web Store link.
- **CvPreview** — renders incoming `CVData` for the bridge scenario.

## Notes

- Keep the `tools/` mirror in sync with upstream; treat `src/lib/tools.ts` as the
  single source for the hub UI.
- Favor client-side CV handling to avoid sending resume PII to a server.
