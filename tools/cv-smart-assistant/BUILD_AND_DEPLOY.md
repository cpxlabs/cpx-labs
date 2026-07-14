# Build & Deploy

## Project Structure

```
extension/
├── src/
│   ├── background/   # Service worker (background.js)
│   ├── content/      # Content script (content.js)
│   ├── popup/        # Popup UI (popup.js, popup.html, popup.css)
│   ├── lib/          # Shared libraries (storage, parser, formFiller, templates)
│   ├── sites/        # Site-specific adapters (linkedin, greenhouse, etc.)
│   └── vendors/      # Third-party scripts (pdf.js)
├── tests/            # Test suites (mirrors src/ layout)
├── manifest.json     # Extension manifest (V3)
├── package.json
└── jest.config.js
```

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
npm install
```

## Testing

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# E2E tests (requires Puppeteer)
npm run test:e2e
```

## Building for Production

### 1. Package the extension

There is no build step required — the extension runs as-is. To create a distributable zip:

```bash
zip -r cv-smart-assistant.zip manifest.json src/ -x "src/vendors/pdf.*"
```

> **Note:** pdf.js files are loaded from CDN in `popup.js`. If you want offline support, bundle them and update the import path.

### 2. Optional: Minify source

If desired, use a tool like Terser to minify JS files before publishing:

```bash
npx terser src/background/background.js -o dist/background.js
npx terser src/content/content.js -o dist/content.js
# etc.
```

Update `manifest.json` paths to point to `dist/` after minification.

## Publishing to Chrome Web Store

### Prerequisites

1. A Google Chrome Web Store developer account (one-time fee: $5)
2. Create an account at https://chrome.google.com/webstore/devconsole

### Steps

1. **Increment version** in `manifest.json`
2. **Create zip** (see above)
3. **Go to Chrome Web Store Developer Dashboard**
4. Click **New item**
5. Upload the zip
6. Fill in:
   - **Store listing** - description, screenshots, promo images
   - **Privacy practices** - data usage disclosure
7. Submit for review

### Checklist before submitting

- [ ] Version bumped in `manifest.json`
- [ ] Icons provided (16, 48, 128 px)
- [ ] Screenshots taken (1280x800 or 640x400)
- [ ] Privacy policy URL (if collecting user data)
- [ ] Description and promo tile ready

## Loading Unpacked (Development)

### Chrome

```
chrome://extensions
```
- Enable **Developer mode**
- Click **Load unpacked**
- Select the repo root directory

### Firefox

```
about:debugging#/runtime/this-firefox
```
- Click **Load Temporary Add-on**
- Select `manifest.json`

## CI/CD

Example GitHub Actions workflow (`.github/workflows/test.yml`):

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
```
