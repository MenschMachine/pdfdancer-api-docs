# PDFDancer API Documentation

Unified documentation site for PDFDancer SDK across Java, Python, and TypeScript.

## Overview

This repository contains the API documentation for PDFDancer SDK, built with [Docusaurus](https://docusaurus.io/). The
docs are automatically synced from the SDK repositories using git submodules and deployed via GitHub Actions.

## Prerequisites

- Node.js >= 20.0
- npm or yarn
- Git

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/MenschMachine/pdfdancer-api-docs.git
cd pdfdancer-api-docs
git submodule update --init --recursive
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm start
```

This starts a local development server at `http://localhost:3000` with hot reload enabled.

## Project Structure

```
pdfdancer-api-docs/
├── docs/                    # Documentation content
│   ├── getting-started.md
│   ├── authentication.md
│   ├── java/               # Java SDK docs
│   ├── python/             # Python SDK docs
│   └── typescript/         # TypeScript SDK docs
├── src/
│   ├── components/         # Custom React components
│   ├── css/               # Custom styles (Cyber Orange theme)
│   └── pages/             # Custom pages
├── static/                 # Static assets (images, logos)
├── external/              # Git submodules for SDK repos
│   ├── MenschMachine-java/
│   ├── MenschMachine-python/
│   └── MenschMachine-typescript/
├── docusaurus.config.ts   # Docusaurus configuration
└── sidebars.ts           # Sidebar structure
```

## Contributing Documentation

### Adding New Documentation

1. Create or edit markdown files in the `docs/` directory
2. Update `sidebars.ts` if adding new pages
3. Test locally with `npm start`
4. Run type checking: `npm run typecheck`
5. Build and verify: `npm run build`

### Updating SDK Submodules

Pull latest changes from SDK repositories:

```bash
git submodule update --remote --merge
git add .
git commit -m "docs: sync SDK documentation"
```

## Available Commands

| Command             | Description                      |
|---------------------|----------------------------------|
| `npm start`         | Start development server         |
| `npm run build`     | Build static site for production |
| `npm run serve`     | Serve built site locally         |
| `npm run typecheck` | Run TypeScript type checking     |
| `npm run clear`     | Clear Docusaurus cache           |

## Theming

The site uses a custom "PDFDancer Cyber Orange" theme defined in `src/css/custom.css`. Key features:

- Orange color scheme (`#ffa500`)
- Sora font family for UI
- JetBrains Mono for code
- Dark mode with cyber aesthetics
- Glowing effects and transitions

To modify the theme, edit `src/css/custom.css`.

## Deployment

The site deploys automatically via GitHub Actions on push to any branch. The workflow:

1. Checks out code with submodules
2. Installs dependencies
3. Builds the site
4. Deploys to GitHub Pages

Manual deployment:

```bash
npm run build
npm run serve  # Test the build locally first
```

## Troubleshooting

### Submodule Issues

If submodules are not loading:

```bash
git submodule update --init --recursive --force
```

### Build Errors

Clear cache and rebuild:

```bash
npm run clear
npm install
npm run build
```

### Port Already in Use

Change the port:

```bash
npm start -- --port 3001
```

## Resources

- [Docusaurus Documentation](https://docusaurus.io/)
- [Markdown Guide](https://www.markdownguide.org/)
- [MDX Documentation](https://mdxjs.com/)

## License

See individual SDK repositories for license information.
