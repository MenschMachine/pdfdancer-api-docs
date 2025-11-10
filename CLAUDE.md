# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Docusaurus-based documentation site for PDFDancer SDK. The documentation covers multiple SDKs (Java, Python,
TypeScript) with content both manually authored in the `docs/` directory and synced from SDK repositories via git
submodules in the `external/` directory.

## Development Commands

```bash
# Start local dev server (hot reload at http://localhost:3000)
npm start

# Build for production
npm run build

# Serve production build locally
npm run serve

# Type checking
npm run typecheck

# Clear Docusaurus cache (useful when troubleshooting)
npm run clear
```

## Architecture

### Documentation Sources

1. **Manual docs**: Markdown files in `docs/` directory (getting-started, authentication, quickstart, etc.)
2. **SDK docs**: Synced from git submodules in `external/` directory
3. **Roadmap**: Use /Users/michael/Documents/TFC/projects/pdfdancer/Product/Roadmap.md - These are just keywords and also with internal details. Rewrite it so that it can be published. Skip everything not relevant for end users (like mysql, payment).

### Git Submodules

The repository uses git submodules to pull SDK documentation:

- `external/pdfdancer-client-python/` → Python SDK
- `external/pdfdancer-client-typescript/` → TypeScript SDK

After cloning or pulling updates:

```bash
git submodule update --init --recursive
```

To update submodules to latest:

```bash
git submodule update --remote --merge
```

### Configuration Files

- `docusaurus.config.ts`: Main Docusaurus configuration. Docs are served at root path (`routeBasePath: '/'`). No blog
  enabled.
- `sidebars.ts`: Defines sidebar navigation structure (flat list of doc IDs)
- `src/css/custom.css`: Custom "PDFDancer Cyber Orange" theme with Sora font for UI and JetBrains Mono for code

### Documentation Workflow

When adding/editing documentation:

1. Edit or create markdown files in `docs/`
2. Update `sidebars.ts` if adding new pages
3. Test locally with `npm start`
4. Run `npm run typecheck` before committing
5. Build and verify with `npm run build` then `npm run serve`

### Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically builds and deploys on push to any branch. The
workflow:

1. Checks out with submodules recursively
2. Installs dependencies with `npm ci`
3. Builds with `npm run build`

## Important Details

- **Node.js requirement**: >= 20.0
- **Config strictness**: `onBrokenLinks: 'throw'` - builds fail on broken internal links
- **Docs at root**: Documentation is served at site root, not `/docs`
