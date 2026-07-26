# Capability: backend-api

The CPX Labs backend API — a standalone deployment of the Next.js API routes on Render using Docker and `output: "standalone"`.

## ADDED Requirements

### Requirement: Build configuration

The backend must produce a self-contained deployment artifact using Next.js standalone output, wrapped in a Docker image.

#### Scenario: Standalone output is enabled

**Given** `next.config.ts` has `output: "standalone"`
**When** `npm run build` runs
**Then** `.next/standalone/` contains `server.js`, `package.json`, `node_modules/`, and `.next/`

#### Scenario: Docker image builds successfully

**Given** the Dockerfile at project root
**When** `docker build -t cpx-labs-api .` runs
**Then** a multi-stage build produces a runner image with `server.js`, `.next/static`, and `public/`

**And** the runner image is based on `node:22-alpine`, runs as the `nextjs` user, and exposes port 3001

#### Scenario: ESLint passes

**Given** all dependencies are installed
**When** `npx eslint src/` runs
**Then** it exits with code 0 and produces no errors

#### Scenario: TypeScript compiles

**Given** all dependencies are installed
**When** `npx tsc --noEmit` runs
**Then** it exits with code 0 (excluding auto-generated `.next/types/`)

### Requirement: API routes

The backend serves three API endpoints: contact form, WhatsApp webhook, and health check.

#### Scenario: Contact form accepts valid submissions

**Given** the server is running
**When** a POST to `/api/contact` with `{ name, email, message }` is sent
**Then** the response has status 200 with `{ success: true }`

#### Scenario: Contact form rejects invalid data

**When** a POST to `/api/contact` omits required fields
**Then** the response has status 422 with a PT-BR error message

#### Scenario: WhatsApp webhook verification

**When** a GET to `/api/whatsapp/webhook` with `hub.mode=subscribe` and valid `hub.verify_token` is sent
**Then** the response echoes the `hub.challenge` value with status 200

#### Scenario: WhatsApp webhook processes messages

**Given** all `WHATSAPP_*` env vars are configured and `GEMINI_API_KEY` is set
**When** a signed POST arrives at `/api/whatsapp/webhook` with a text message above the minimum character threshold
**Then** the message is summarized via Gemini and forwarded to the admin WhatsApp number

#### Scenario: Health check responds

**When** a GET to `/api/health` is sent
**Then** the response has status 200 with `{ "status": "ok" }` and a timestamp

### Requirement: Deployment (Render)

The backend must be deployable to Render via Blueprint or manual Docker workflow.

#### Scenario: Blueprint deploys automatically

**Given** `render.yaml` exists at project root with `runtime: image`
**When** a push is made to the default branch
**Then** Render builds the Docker image and deploys the web service

**And** Render polls `GET /api/health` every 60 seconds as a health check

#### Scenario: Environment variables are configurable

**Given** `render.yaml` declares env vars with `sync: false` for secrets
**When** the developer sets env vars in the Render dashboard
**Then** the web service reads them from `process.env` at runtime

### Requirement: API documentation

The API must have a formal OpenAPI 3.1 specification.

#### Scenario: OpenAPI spec exists

**Given** `docs/api/openapi.yaml`
**When** a developer opens the spec
**Then** it documents both API routes with request schemas, response schemas, example values, and error responses

### Requirement: Deployment documentation

A deployment guide must document setup steps for both Blueprint and manual workflows.

#### Scenario: Guide covers all env vars

**Given** `docs/deploy/render.md`
**When** a developer reads the guide
**Then** it lists all required and optional environment variables with descriptions
