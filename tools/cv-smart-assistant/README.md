# CV Smart Assistant

Chrome extension that extracts data from PDF resumes and autofills job application forms.

## Setup

```bash
npm install
```

## Testing

```bash
npm test
```

## Loading the Extension

- **Chrome**: `chrome://extensions` → Developer mode → Load unpacked → select the repo root
- **Firefox**: `about:debugging#/runtime/this-firefox` → Load Temporary Add-on → `manifest.json`

## Build

```bash
npm run build     # Minified production build → dist/
npm run zip       # Package dist/ into cv-smart-assistant.zip
npm run clean     # Remove dist/
```

Load `dist/` as an unpacked extension, or upload the zip to the Chrome Web Store.

See [BUILD_AND_DEPLOY.md](BUILD_AND_DEPLOY.md) for detailed publishing instructions.
