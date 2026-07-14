# Tasks: integrate-cv-smart-assistant

## Bridge (extension <-> web)

- [ ] Define the `CVData` export schema (name, contact, summary, experience,
      education, skills, parsedAt, source) and mirror it in both the extension
      and `src/lib/`.
- [ ] Add an "Export / Share CV" action in the extension popup
      (`tools/cv-smart-assistant/src/popup/`) that serializes parsed CV data to JSON.
- [ ] Implement a transport from extension to web: deep link
      (`/ferramentas?cv=...`), downloadable JSON, or clipboard copy.
- [ ] Create a web import flow / route handler (`/api/cv-import` or client-side
      query-param/read) to receive the CV JSON without persisting PII.
- [ ] Render a parsed-CV preview (`CvPreview`) on `/ferramentas` from the
      received `CVData`.
- [ ] Write tests for the schema validation and the import/parse flow.

## Front-end features

- [ ] Create the typed tool data module `src/lib/tools.ts` (`Tool` interface +
      `tools` array) including the CV Smart Assistant entry.
- [ ] Build the `ToolCard` presentational component.
- [ ] Build the `/ferramentas` hub page listing tools, a featured-tool section,
      and a "planned tools" placeholder.
- [ ] Add the tool-detail route `/ferramentas/[id]` showing description,
      features, supported platforms, repo link, and local code path.
- [ ] Add the installation & usage guide section (load unpacked from
      `tools/cv-smart-assistant/` and the Web Store link).
- [ ] Add more tools to the data module (additional `available`/`planned` entries).
- [ ] Write tests for the tools data module and hub/detail rendering.
