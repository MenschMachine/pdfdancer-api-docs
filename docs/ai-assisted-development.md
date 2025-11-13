---
sidebar_position: 4
---

# AI-Assisted Development

The fastest way to build with PDFDancer is to let your AI coding assistant do it for you. Install the **PDFDancer MCP Server** once, then just describe what you want in plain English—your AI automatically searches the docs and implements the feature.

## How It Works

1. **Install the MCP server** (one-time setup, takes 30 seconds)
2. **Ask your AI**: "Create a PDF invoice generator in Python"
3. **AI automatically**:
   - Searches PDFDancer docs for relevant APIs
   - Finds code examples in your preferred language
   - Writes working code with proper error handling
   - Debugs issues by consulting the docs again

**You never manually search documentation.** Just describe features and your AI builds them.

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

## What You Can Build

Once installed, just ask your AI in natural language. Here are real examples:

### Start a New Project
```
You: "Create a Python script that extracts all images from a PDF"

→ AI searches docs, writes complete code with imports and error handling
```

### Add Features
```
You: "Add watermarks to every page"

→ AI finds watermark documentation, updates your code
```

### Fix Positioning
```
You: "The text needs to be at the bottom of the page"

→ AI consults positioning guide, adjusts coordinates
```

### Debug Errors
```
You: "I'm getting 'Invalid API key' error"

→ AI searches authentication docs, shows correct setup
```

### Explore Capabilities
```
You: "Can PDFDancer fill out form fields?"

→ AI explains AcroForm support with code examples
```

### Handle Complex Layouts
```
You: "Create a two-column layout with images and text"

→ AI combines multiple APIs to build the layout
```

Behind the scenes, your AI automatically searches the PDFDancer documentation, finds relevant APIs, and implements solutions. You just focus on describing what you want.

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

### AI Doesn't Seem to Know About PDFDancer

**Problem**: Your AI doesn't automatically search PDFDancer docs when you ask.

**Solutions**:
1. Verify Node.js 18+ is installed: `node --version`
2. Check your config file exists at the correct path (see Installation section)
3. Restart your AI assistant completely
4. Try explicitly mentioning: _"Use PDFDancer to create..."_

### Connection or Timeout Errors

**Problem**: AI says it can't reach the documentation.

**Solutions**:
1. Ensure you have internet connectivity
2. Try running `npx -y @pdfdancer/pdfdancer-mcp` manually to test
3. Check firewall settings aren't blocking npx
4. Restart your AI assistant

### AI Provides Outdated Code

**Problem**: The code examples don't match current PDFDancer APIs.

**Solutions**:
1. The MCP server always fetches the latest docs—this is likely a different issue
2. Clear your AI assistant's cache/context and start a new session
3. Explicitly say: _"Use the latest PDFDancer SDK to..."_

## Try It Out

Start with simple requests and build up complexity:

**Beginner:**
- _"Create a Python script that generates a PDF with 'Hello World'"_
- _"Add a page number at the bottom"_

**Intermediate:**
- _"Build a TypeScript invoice generator with line items and totals"_
- _"Extract all text from a PDF and save to a file"_

**Advanced:**
- _"Create a Java application that merges multiple PDFs and adds a table of contents"_
- _"Build a report generator with charts, images, and multi-column layouts"_

Your AI handles everything—from project setup to implementation to debugging.

## More Information

- **GitHub Repository**: [github.com/MenschMachine/pdfdancer-mcp](https://github.com/MenschMachine/pdfdancer-mcp)
- **npm Package**: [@pdfdancer/pdfdancer-mcp](https://www.npmjs.com/package/@pdfdancer/pdfdancer-mcp)
- **MCP Protocol**: [Model Context Protocol](https://modelcontextprotocol.io/)

---

**Ready to build?** Just ask your AI: _"Create a PDF with..."_ and watch it implement the solution automatically.
