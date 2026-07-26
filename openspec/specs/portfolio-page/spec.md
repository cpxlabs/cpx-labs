# Capability: portfolio-page

A public-facing `/portfolio` page that showcases open-source projects developed by CPX Labs and az1nn, with project descriptions, tech tags, screenshots, and links to GitHub repositories and live demos.

## ADDED Requirements

### Requirement: List all projects

The `/portfolio` page must display every project defined in the data source in a visually consistent, responsive grid.

#### Scenario: Visitor sees all projects

**When** a visitor opens the `/portfolio` page
**Then** all projects from the data array are rendered as cards in a grid

**And** the grid adapts to viewport width: 1 column on mobile, 2 on tablet, 3 on desktop

#### Scenario: Each card shows core information

**When** the visitor looks at a project card
**Then** it displays the project's screenshot, name, tech-stack tags, a short description, and two action buttons (GitHub, Live Demo)

#### Scenario: Screenshot fallback on load failure

**When** a project screenshot fails to load
**Then** the card shows a gradient placeholder in its place so the layout does not break

### Requirement: Navigate to project resources

Visitors must be able to open the GitHub repository and live demo for each project.

#### Scenario: Open GitHub repository

**When** the visitor clicks "GitHub" on a project card
**Then** the project's GitHub repository opens in a new tab

#### Scenario: Open live demo

**When** the visitor clicks "Live Demo" on a project card
**Then** the project's live demo site opens in a new tab

### Requirement: Navigate to the portfolio page

Visitors must be able to reach `/portfolio` from the site navigation.

#### Scenario: Header navigation link

**When** a visitor is on any page of the site
**Then** the header contains a "Portfólio" link pointing to `/portfolio`

**And** the link highlights with the brand-300 color when the visitor is on the portfolio page

### Requirement: Screenshot generation

The project screenshots displayed on the portfolio page must be regenerable from the live demo sites.

#### Scenario: Regenerate all screenshots

**When** a developer runs `node scripts/screenshots.mjs`
**Then** Puppeteer launches, navigates to each project's demo URL, captures a 1280×800 viewport screenshot, and writes it to `public/portfolio/{slug}.png`

**And** the script continues to the next project if one demo fails to load, still capturing a partial screenshot

### Requirement: Data extensibility

Adding or removing a project must not require UI code changes.

#### Scenario: Add a new project

**When** a developer adds a new entry to the `projects` array in `src/app/portfolio/page.tsx` with a matching screenshot in `public/portfolio/`
**Then** the new project appears in the grid automatically

#### Scenario: Remove a project

**When** a developer removes an entry from the `projects` array
**Then** the project no longer appears on the page

**And** no orphaned imports, types, or broken UI state result from the removal
