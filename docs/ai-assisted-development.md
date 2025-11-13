---
sidebar_position: 4
---

# AI-Assisted Development

The **PDFDancer MCP Server** gives AI coding assistants instant, searchable access to the entire PDFDancer SDK documentation. With just one command, your AI assistant can help you build PDF applications faster by automatically finding the right APIs, providing code examples, and guiding you through implementation.

## Why Use the MCP Server?

Instead of manually searching documentation, your AI assistant can:

- 🔍 **Search** the docs for relevant APIs and examples
- 📖 **Retrieve** complete guides with code samples in your preferred language
- 🚀 **Generate** working code based on official documentation
- 🛠️ **Troubleshoot** errors by referencing the latest SDK patterns

## Real-World Example

Here's a complete session where a developer went from zero to a working TypeScript project with custom image placement—all guided by the MCP server:

```bash
> create a typescript project which creates a pdf with the words
  "Hello World" on it. Use pdfdancer

⏺ I'll help you create a TypeScript project that generates a PDF
  with "Hello World" using PDFDancer. Let me start by exploring
  the PDFDancer documentation.

# AI searches documentation, finds quickstart guides, and:
# - Initializes npm project
# - Installs dependencies (typescript, pdfdancer-client-typescript)
# - Creates src/main.ts with working code
# - Sets up build scripts
# - Generates output.pdf

⏺ Done! The PDF is saved as output.pdf.

> add logo.png to the top-right corner

# AI searches for image documentation, then:
# - Creates a sample logo.png
# - Updates code to add the image
# - Handles API errors by consulting docs again
# - Rebuilds and generates updated PDF

⏺ Perfect! The PDF now contains the logo in the top-right
  and "Hello World" text.
```

**Total time: ~2 minutes** from idea to working application.

## Installation

### One-Click Install (Cursor)

Visit [cursor.directory](https://cursor.directory) and search for "pdfdancer" to install with one click.

### Manual Installation (All Clients)

Add this configuration to your MCP client's config file:

```json
{
  "mcpServers": {
    "pdfdancer-mcp": {
      "command": "npx",
      "args": ["-y", "@pdfdancer/pdfdancer-mcp"]
    }
  }
}
```

#### Configuration File Locations

| Client | Configuration Path |
|--------|-------------------|
| **Claude Code** | `~/.config/claude/claude_desktop_config.json` |
| **Cursor** | Use one-click install or manual JSON config |
| **VS Code** | Varies by MCP extension |
| **Windsurf** | Check extension documentation |
| **Zed** | `~/.config/zed/settings.json` |

After adding the configuration, restart your AI assistant.

### Requirements

- Node.js 18 or higher
- MCP-compatible client (Claude Code, Cursor, VS Code with MCP extension, etc.)

## Available Tools

Once installed, your AI assistant has access to five powerful tools:

### 1. **help**
Displays a comprehensive SDK overview with multi-language code samples and common use cases.

```
Example: "Show me what PDFDancer can do"
→ AI uses help tool to get SDK overview
```

### 2. **search-docs**
Searches the entire documentation by keyword, returning relevant pages with titles and relevance scores.

```
Example: "How do I authenticate with the API?"
→ AI searches for "authentication"
→ Returns: /authentication, /getting-started, etc.
```

### 3. **get-docs**
Retrieves the full markdown content of a specific documentation page.

```
Example: "Show me the authentication guide"
→ AI fetches /authentication page
→ Provides complete guide with code examples
```

### 4. **list-indexes**
Shows all available documentation indexes and tags for browsing.

```
Example: "What documentation sections are available?"
→ Returns: getting-started, concepts, working-with-text, etc.
```

### 5. **list-routes**
Displays all accessible documentation pages in the system.

```
Example: "List all available guides"
→ Returns complete route listing
```

## Typical Workflow

Here's how the MCP server helps you during development:

### 1. **Starting a New Project**

```
You: "Create a Python script that extracts all images from a PDF"

AI:
- Uses search-docs to find "extract images"
- Uses get-docs to retrieve /working-with-images
- Generates complete working code with proper imports
- Includes error handling based on /error-handling docs
```

### 2. **Solving Specific Problems**

```
You: "How do I position text at the bottom of the page?"

AI:
- Searches docs for "positioning" or "coordinates"
- Retrieves /positioning guide
- Explains coordinate system with examples
- Provides code snippet
```

### 3. **Debugging Errors**

```
You: "I'm getting 'Invalid API key' error"

AI:
- Searches for "authentication" and "error"
- Retrieves /authentication and /error-handling
- Identifies the issue (missing/incorrect API key)
- Shows correct authentication pattern
```

### 4. **Exploring Capabilities**

```
You: "What can PDFDancer do with forms?"

AI:
- Uses help tool or searches for "forms"
- Retrieves /working-with-acroforms
- Explains AcroForm capabilities
- Shows code examples for your language
```

## Configuration

### Custom Documentation URL

If you're running a local or custom documentation service, set the environment variable:

```bash
export PDFDANCER_DOCS_BASE_URL=https://your-docs-server.com
```

Then add it to your MCP configuration:

```json
{
  "mcpServers": {
    "pdfdancer-mcp": {
      "command": "npx",
      "args": ["-y", "@pdfdancer/pdfdancer-mcp"],
      "env": {
        "PDFDANCER_DOCS_BASE_URL": "https://your-docs-server.com"
      }
    }
  }
}
```

## Troubleshooting

### MCP Server Not Appearing

**Problem**: Your AI assistant doesn't recognize PDFDancer commands.

**Solutions**:
1. Verify Node.js 18+ is installed: `node --version`
2. Check your config file exists at the correct path
3. Restart your AI assistant completely
4. Check the assistant's MCP server status/logs

### Connection Errors

**Problem**: "Failed to connect to MCP server" or timeout errors.

**Solutions**:
1. Ensure you have internet connectivity (npx needs to download the package)
2. Try running `npx -y @pdfdancer/pdfdancer-mcp` manually to test
3. Check firewall settings aren't blocking npx

### Outdated Documentation

**Problem**: AI is providing outdated examples or APIs.

**Solutions**:
1. Clear your AI assistant's cache/context
2. The MCP server always fetches the latest published docs
3. Verify you're using the latest version: `npm view @pdfdancer/pdfdancer-mcp version`

### Tool Not Working

**Problem**: AI says "I tried to use the tool but it failed."

**Solutions**:
1. Check MCP server logs in your AI client
2. Verify the package is installed: `npm list -g @pdfdancer/pdfdancer-mcp` or let npx download it
3. Restart the AI assistant
4. Try reinstalling by removing and re-adding the config

## Next Steps

Now that your AI assistant has access to PDFDancer documentation:

1. Try the example: **"Create a [Python/TypeScript/Java] script that generates a PDF invoice"**
2. Explore specific features: **"Show me how to work with fonts in PDFDancer"**
3. Build something real: **"Help me build a PDF report generator with custom headers"**

The MCP server works alongside the rest of this documentation—use it for quick exploration and code generation, and refer to the full guides for deeper understanding.

## More Information

- **GitHub Repository**: [github.com/MenschMachine/pdfdancer-mcp](https://github.com/MenschMachine/pdfdancer-mcp)
- **npm Package**: [@pdfdancer/pdfdancer-mcp](https://www.npmjs.com/package/@pdfdancer/pdfdancer-mcp)
- **MCP Protocol**: [Model Context Protocol](https://modelcontextprotocol.io/)

---

**Ready to build?** Just ask your AI assistant: _"Use PDFDancer to create a PDF with..."_ and watch it work!
