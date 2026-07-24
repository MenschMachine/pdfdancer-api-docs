# PDFDancer API Documentation

Unified documentation site for PDFDancer SDK across Java, Python, and TypeScript.

## Prerequisites

- Node.js >= 20.0
- npm or yarn
- Git

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/MenschMachine/pdfdancer-api-docs.git
cd pdfdancer-api-docs
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
├── docs/                    # Upcoming API v3 documentation
├── versioned_docs/
│   └── version-1/          # Supported API v1 documentation
├── versioned_sidebars/     # API v1 navigation
├── src/
│   ├── components/         # Custom React components
│   ├── css/               # Custom styles (Cyber Orange theme)
│   └── pages/              # Global pages, including /roadmap
├── static/                 # Static assets (images, logos)
├── docusaurus.config.ts    # Version routing and release configuration
└── sidebars.ts             # API v3 navigation
```

## Contributing Documentation

### Adding New Documentation

1. Edit API v3 content in `docs/`, or supported API v1 content in `versioned_docs/version-1/`
2. Update the matching v3 or v1 sidebar
3. Test locally with `npm start`
4. Validate v1 examples: `npm run test:docs:v1`
5. Run type checking and build: `npm run typecheck && npm run build`

API v1 and API v3 use stable `/v1/` and `/v3/` paths. Do not recreate the v1 snapshot. When API v3 is released, change only `V3_RELEASED` in `docusaurus.config.ts`.

## Available Commands

| Command             | Description                      |
|---------------------|----------------------------------|
| `npm start`         | Start development server         |
| `npm run build`     | Build static site for production |
| `npm run serve`     | Serve built site locally         |
| `npm run typecheck` | Run TypeScript type checking     |
| `npm run test:docs:v1` | Validate supported API v1 examples |
| `npm run test:versioning` | Verify routes and search indexes after a build |
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

The site deploys automatically via GitHub Actions on pushes to `main`. The workflow:

1. Checks out the SDK revisions pinned by API v1
2. Validates API v1 examples
3. Builds the site
4. Deploys versioned search indexes to Cloudflare KV

Raw Markdown upload to Cloudflare KV is retained in the workflow but explicitly disabled.

Manual deployment:

```bash
npm run build
npm run serve  # Test the build locally first
```

## Troubleshooting

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
