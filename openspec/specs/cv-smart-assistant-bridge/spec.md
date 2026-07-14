# Capability: cv-smart-assistant-bridge

Integration between the CV Smart Assistant Chrome extension and the cpx-labs web
front-end, plus the tools hub front-end that showcases and documents the tool.

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
**Then** it displays a preview of the parsed CV (e.g., name, contact, experience,
skills) without requiring the user to re-upload the PDF.

### Requirement: Tools hub front-end

The `/ferramentas` page lists tools and shows details, sourced from a typed data
module, and supports adding new tools.

#### Scenario: List available tools

**When** a visitor opens the `/ferramentas` page
**Then** all tools defined in the tool data module (`src/lib/tools.ts`) are listed
with their name and a short summary.

#### Scenario: View tool details

**When** a visitor selects a tool from the list
**Then** the page shows the tool's description, features, supported platforms,
repository link, and local code path (`tools/cv-smart-assistant/`).

#### Scenario: Add a new tool

**When** a developer adds a new entry to the typed tool data module
(`src/lib/tools.ts`)
**Then** the new tool automatically appears in the tools hub without additional
UI wiring.

### Requirement: Tool installation & usage guide

The web page must document how to install and use the Chrome extension.

#### Scenario: Document local installation

**When** a visitor reads the install guide on the `/ferramentas` page
**Then** they are instructed to load the unpacked extension from
`tools/cv-smart-assistant/` via `chrome://extensions` (Developer mode → Load
unpacked).

#### Scenario: Document published installation

**When** a visitor prefers the published channel
**Then** the page provides the Chrome Web Store link for the CV Smart Assistant
extension.

#### Scenario: Document usage

**When** a visitor reads the usage guide
**Then** they are told how to parse a PDF resume and autofill application forms on
supported platforms (LinkedIn, Greenhouse, Lever, Workday, generic sites).
