# Capability: cv-smart-assistant-bridge

Delta spec for the `integrate-cv-smart-assistant` change. Mirrors the base
capability requirements; archive this alongside the change once implemented.

## ADDED Requirements

### Requirement: Web bridge for parsed CV data

The extension must be able to export and share parsed CV data (JSON) with the
cpx-labs web app so the web front-end can display and consume it.

#### Scenario: Export parsed CV data from the extension

**When** a user has parsed a PDF resume inside the CV Smart Assistant extension
**Then** the extension provides an export/share action that produces a JSON
representation of the parsed CV data.

#### Scenario: Share parsed CV data to the web app

**When** the user triggers the export/share action
**Then** the parsed CV JSON is delivered to the cpx-labs web app via a shareable
JSON export, a deep link, or a small API/endpoint.

#### Scenario: Web app consumes the CV data

**When** the cpx-labs web app receives the parsed CV JSON
**Then** it displays a preview of the parsed CV without requiring the user to
re-upload the PDF.

### Requirement: Tools hub front-end

The `/ferramentas` page lists tools and shows details, sourced from a typed data
module, and supports adding new tools.

#### Scenario: List available tools

**When** a visitor opens the `/ferramentas` page
**Then** all tools defined in `src/lib/tools.ts` are listed with name and summary.

#### Scenario: View tool details

**When** a visitor selects a tool from the list
**Then** the page shows description, features, supported platforms, repository
link, and local code path.

#### Scenario: Add a new tool

**When** a developer adds a new entry to `src/lib/tools.ts`
**Then** the new tool automatically appears in the tools hub.

### Requirement: Tool installation & usage guide

The web page must document how to install and use the Chrome extension.

#### Scenario: Document local installation

**When** a visitor reads the install guide
**Then** they are instructed to load the unpacked extension from
`tools/cv-smart-assistant/` via `chrome://extensions`.

#### Scenario: Document published installation

**When** a visitor prefers the published channel
**Then** the page provides the Chrome Web Store link.

#### Scenario: Document usage

**When** a visitor reads the usage guide
**Then** they are told how to parse a PDF resume and autofill forms on supported
platforms (LinkedIn, Greenhouse, Lever, Workday, generic sites).
