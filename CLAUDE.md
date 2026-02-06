# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Docusaurus-based documentation site for PDFDancer SDK covering Java, Python, and TypeScript. Content comes from manual docs in `docs/` and SDK repositories via git submodules in `external/`.

## Development Commands

```bash
npm start          # Dev server with hot reload at localhost:3000
npm run build      # Production build
npm run serve      # Serve production build locally
npm run typecheck  # TypeScript type checking
npm run clear      # Clear Docusaurus cache
```

## Git Submodules

SDK documentation is pulled from submodules in `external/`:
- `external/pdfdancer-client-java/`
- `external/pdfdancer-client-python/`
- `external/pdfdancer-client-typescript/`

```bash
git submodule update --init --recursive     # After cloning
git submodule update --remote --merge       # Update to latest
```

## Documentation Workflow

1. Edit/create markdown files in `docs/`
2. Update `sidebars.ts` if adding new pages
3. Test with `npm start`
4. Run `npm run typecheck` before committing
5. Build and verify with `npm run build && npm run serve`

## Key Configuration

- `docusaurus.config.ts`: Main config. Docs at root path (`routeBasePath: '/'`). No blog. Includes Cloudflare search and PostHog analytics.
- `sidebars.ts`: Sidebar navigation structure
- `src/css/custom.css`: "PDFDancer Cyber Orange" theme (Sora UI font, JetBrains Mono code font)

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) auto-deploys on push to `main`:
1. Checkout with submodules
2. `npm ci && npm run build`
3. Deploy search indexes to Cloudflare KV (`npx dcs deploy`)
4. Upload markdown to Cloudflare KV (`npx dcs upload-content`)

## Important Details

- **Node.js**: >= 20.0
- **Strict links**: `onBrokenLinks: 'throw'` - builds fail on broken internal links
- **Roadmap source**: Use `/Users/michael/Documents/TFC/projects/pdfdancer/Product/Roadmap.md` - rewrite for public consumption, skip internal details (mysql, payment, etc.)

## Testing

Tests exist to proof correctness or capture wrong behavior. They do *not* exist to just pass.
