# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Docusaurus-based documentation site for the PDFDancer SDKs covering Java, Python, and TypeScript. API v1 is maintained in `versioned_docs/version-1/`; the upcoming API v2 documentation is authored in `docs/`.

## Development Commands

```bash
npm start          # Dev server with hot reload at localhost:3000
npm run build      # Production build
npm run serve      # Serve production build locally
npm run typecheck  # TypeScript type checking
npm run clear      # Clear Docusaurus cache
```

## Documentation Workflow

1. Edit API v2 markdown in `docs/`, or supported API v1 markdown in `versioned_docs/version-1/`
2. Update `sidebars.ts` for v2 navigation, or `versioned_sidebars/version-1-sidebars.json` for v1 navigation
3. Test with `npm start`
4. Run `npm run test:docs:v1 && npm run typecheck` before committing
5. Build and verify with `npm run build && npm run serve`

Do not rerun `docusaurus docs:version 1`; the v1 snapshot already exists and is directly maintainable.

## Key Configuration

- `docusaurus.config.ts`: Main config. Docs at root path (`routeBasePath: '/'`). No blog. Includes Cloudflare search and PostHog analytics.
- `sidebars.ts`: API v2 sidebar navigation
- `versioned_sidebars/version-1-sidebars.json`: API v1 sidebar navigation
- `src/css/custom.css`: "PDFDancer Cyber Orange" theme (Sora UI font, JetBrains Mono code font)
- `src/pages/roadmap.md`: Non-versioned product roadmap

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) auto-deploys on push to `main`:
1. `npm ci && npm run build`
2. Deploy search indexes to Cloudflare KV (`npx dcs deploy`)

Raw Markdown upload (`npx dcs upload-content`) is intentionally disabled.

## Important Details

- **Node.js**: >= 20.0
- **Strict links**: `onBrokenLinks: 'throw'` - builds fail on broken internal links
- **Release switch**: Set `V2_RELEASED` in `docusaurus.config.ts`; explicit `/v1/` and `/v2/` URLs must not change
- **Roadmap source**: Use `/Users/michael/Documents/TFC/projects/pdfdancer/Product/Roadmap.md` and update `src/pages/roadmap.md`; rewrite for public consumption and omit internal details (mysql, payment, etc.)

## Testing

Tests exist to proof correctness or capture wrong behavior. They do *not* exist to just pass.
