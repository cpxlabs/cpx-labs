# Change: deploy-backend

Deploy the CPX Labs API backend on Render using Next.js `output: "standalone"` and Docker.

## Motivation

The project's API routes (`/api/contact`, `/api/whatsapp/webhook`) currently run
only inside the full Next.js app on Vercel. A separate Render deployment provides:

- Dedicated backend instance with predictable scaling
- Independent environment variables (no frontend/build-time leaks)
- Health-check-able web service for the WhatsApp webhook endpoint
- Observability via Render logs without Vercel Function cold starts

## Requirements

1. **Docker support** — multi-stage `Dockerfile` that builds and serves the
   standalone output.
2. **Render Blueprint** — `render.yaml` declaring the web service, port,
   health check path, and all environment variables.
3. **OpenAPI spec** — `docs/api/openapi.yaml` documenting both API routes
   (`/api/contact`, `/api/whatsapp/webhook`) with schemas, responses, and
   examples.
4. **Deployment guide** — `docs/deploy/render.md` with setup steps for both
   Blueprint and manual Docker workflows.
5. **Build pass** — `next build` with `output: "standalone"` must succeed and
   produce a working Docker image.

## Scenarios

### Scenario 1: Blueprint deploy succeeds
- **When** a push is made to the default branch
- **Then** Render auto-deploys from `render.yaml`
- **And** the health check at `GET /api/contact` returns 405

### Scenario 2: Environment variables drive SMTP behavior
- **Given** `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO_EMAIL` are set
- **When** a POST to `/api/contact` passes validation
- **Then** the route logs the submission (SMTP integration is delegated to a
  future change; the current code already has the probe logic)

### Scenario 3: WhatsApp webhook processes incoming messages
- **Given** all `WHATSAPP_*` env vars are configured and `GEMINI_API_KEY` is set
- **When** a signed POST arrives at `/api/whatsapp/webhook`
- **Then** text messages above the threshold are summarized and forwarded to
  the admin number

### Scenario 4: ESLint passes with no errors
- **Given** the project has all dependencies installed
- **When** `npx eslint src/` is run
- **Then** it exits with code 0 and produces no errors

### Scenario 5: TypeScript compiles without errors
- **Given** the project has all dependencies installed
- **When** `npx tsc --noEmit` is run
- **Then** it exits with code 0 and produces no type errors
