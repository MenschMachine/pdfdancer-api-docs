# Deployment Guide

This document explains how the automated deployment and search indexing works for the PDFDancer SDK documentation.

## Overview

The documentation site uses GitHub Actions to automatically:
1. Build the Docusaurus site
2. Deploy search indexes to Cloudflare KV
3. Upload markdown content to Cloudflare KV

This happens automatically on every push to the `main` branch.

## Cloudflare Setup (One-Time)

### 1. Create a Cloudflare KV Namespace

```bash
npx wrangler kv:namespace create SEARCH_INDEXES
```

Copy the namespace ID from the output (you'll need this for GitHub Secrets).

### 2. Get Cloudflare Credentials

- **Account ID**:
  - Go to Cloudflare Dashboard → Workers & Pages → Overview
  - Copy your Account ID

- **API Token**:
  - Go to Cloudflare Dashboard → My Profile → API Tokens
  - Click "Create Token"
  - Use "Edit Cloudflare Workers" template
  - Or create a custom token with "Workers KV Storage:Edit" permission
  - Copy the generated token

### 3. Configure GitHub Secrets

Add the following secrets to your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following repository secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare Account ID | `abc123def456...` |
| `CLOUDFLARE_API_TOKEN` | API token with KV edit permissions | `YOUR_API_TOKEN` |
| `CLOUDFLARE_KV_NAMESPACE_ID` | KV namespace ID from step 1 | `xyz789...` |

## How It Works

### Automated Workflow

The `.github/workflows/deploy.yml` file defines the deployment pipeline:

```yaml
1. Checkout code (with submodules)
2. Setup Node.js 20
3. Install dependencies (npm ci)
4. Build Docusaurus site (npm run build)
5. Deploy search indexes (npx dcs deploy)
6. Upload markdown content (npx dcs upload-content)
```

### Search Index Generation

During the build step, the `@mlahr/docusaurus-cloudflare-search` plugin automatically generates search index files in the `build/` directory:
- `build/search-index-docs-default-current.json` - Main documentation index
- Other indexes based on your site structure

### What Gets Uploaded

**Search Indexes** (`npx dcs deploy`):
- Lunr.js search indexes for fast full-text search
- Stored in Cloudflare KV with keys like `search-index-docs-default-current`

**Markdown Content** (`npx dcs upload-content`):
- Original markdown files from the `docs/` directory
- Stored in Cloudflare KV with keys like `content:/docs/getting-started`
- Useful for RAG/AI applications and documentation mirrors

## Local Testing

To test the deployment locally:

### Prerequisites

Set up environment variables:

```bash
export CLOUDFLARE_ACCOUNT_ID=your-account-id
export CLOUDFLARE_API_TOKEN=your-api-token
export CLOUDFLARE_KV_NAMESPACE_ID=your-kv-namespace-id
```

### Build and Deploy

```bash
# Build the site
npm run build

# Deploy search indexes
npx dcs deploy

# Upload markdown content
npx dcs upload-content

# Dry run (see what would be deployed without actually deploying)
npx dcs deploy --dry-run
npx dcs upload-content --dry-run
```

## Accessing the Search API

Once deployed, your search indexes and content are available through the Cloudflare Worker API:

### Search Endpoint

```bash
curl -X POST https://your-worker.workers.dev/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "authentication",
    "maxResults": 10
  }'
```

### List Available Indexes

```bash
curl https://your-worker.workers.dev/indexes
```

### Get Markdown Content

```bash
curl "https://your-worker.workers.dev/content?route=/docs/getting-started"
```

### List All Content

```bash
curl https://your-worker.workers.dev/list-content
```

## Troubleshooting

### Workflow fails with "No search index files found"

- Check that the build step completed successfully
- Verify that the `@mlahr/docusaurus-cloudflare-search` plugin is configured in `docusaurus.config.ts`

### Authentication errors

- Verify GitHub Secrets are set correctly
- Check that the API token has the correct permissions
- Ensure the KV namespace ID is correct

### Content upload fails

- Verify that the `docs/` directory exists and contains markdown files
- Check that the build step completed successfully

## Configuration

The deployment configuration is stored in `.searchdeployrc.json`:

```json
{
  "buildDir": "./build"
}
```

The Cloudflare credentials are read directly from environment variables and should not be stored in the config file:
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_KV_NAMESPACE_ID`

These are automatically picked up by the CLI tool from the environment.

## Cost

Using Cloudflare's free tier is sufficient for most documentation sites:

- ✅ Worker requests: 100,000/day
- ✅ KV storage: 1GB
- ✅ KV reads: 100,000/day

**Total: $0/month** for typical usage

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare KV Documentation](https://developers.cloudflare.com/kv/)
- [@mlahr/docusaurus-cloudflare-search GitHub](https://github.com/mlahr/docusaurus-cloudflare-search)
