---
sidebar_position: 4
---

# AI-Assisted Development

The fastest way to build with PDFDancer is to let your AI coding assistant do it for you. Install the **PDFDancer MCP Server** once, then just describe what you want in plain English—your AI automatically searches the docs and implements the feature.

## How It Works

1. **Install the MCP server** (one-time setup, takes 3 seconds) – [Installation Instructions](https://github.com/MenschMachine/pdfdancer-mcp#installation)
2. **Ask your AI**: "Create a PDF invoice generator in Python, use pdfdancer"
3. **AI automatically**:
   - Searches PDFDancer docs for relevant APIs
   - Finds code examples in your preferred language
   - Writes working code with proper error handling
   - Debugs issues by consulting the docs again

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

[![Install in Cursor](https://img.shields.io/badge/Install%20in-Cursor-blue?style=for-the-badge&logo=cursor)](cursor://anysphere.cursor-deeplink/mcp/install?name=pdfdancer&config=eyJjb21tYW5kIjoibnB4IC15IEBwZGZkYW5jZXIvcGRmZGFuY2VyLW1jcCJ9)

### Manual Installation

For detailed installation instructions for all clients (Claude Code, VS Code, Windsurf, Zed, etc.), see the [Installation Guide](https://github.com/MenschMachine/pdfdancer-mcp#installation).

After installation, restart your AI assistant.

### Requirements

- Node.js 18 or higher
- MCP-compatible client (Claude Code, Cursor, VS Code with MCP extension, etc.)

## What You Can Build

Once installed, just ask your AI in natural language. Here are real examples:

### Document Processing
```
You: "Create a function which takes a PDF file as input, finds the date on the first page and changes it to today, use pdfdancer"

→ AI searches docs, writes complete code with date parsing and replacement
```

### Form Filling
```
You: "Build a script that fills out the invoice template PDF with data from a CSV file, use pdfdancer"

→ AI finds AcroForm documentation, implements CSV parsing and form field population
```

### Batch Processing
```
You: "Create a TypeScript function that adds a confidential watermark to all pages of multiple PDFs in a folder, use pdfdancer"

→ AI implements file system iteration, watermark positioning, and batch processing
```

### Text Extraction & Analysis
```
You: "Write a Python script that extracts all phone numbers from a PDF contract and saves them to a JSON file, use pdfdancer"

→ AI combines text extraction with regex pattern matching and JSON serialization
```

### Dynamic Report Generation
```
You: "Create a Java function that generates a monthly sales report PDF with charts, a summary table, and company branding, use pdfdancer"

→ AI implements layout design, table generation, image placement, and text formatting
```

### Document Modification
```
You: "Build a function that finds all instances of a company name in a PDF and replaces it with a new name, preserving formatting, use pdfdancer"

→ AI searches for text selection APIs, implements find-and-replace with style preservation
```

Behind the scenes, your AI automatically searches the PDFDancer documentation, finds relevant APIs, and implements solutions. You just focus on describing what you want.

## Troubleshooting

### AI Doesn't Seem to Know About PDFDancer

**Problem**: Your AI doesn't automatically search PDFDancer docs when you ask.

**Solutions**:
1. Verify Node.js 18+ is installed: `node --version`
2. Check your config file exists at the correct path (see [Installation Guide](https://github.com/MenschMachine/pdfdancer-mcp#installation))
3. Restart your AI assistant completely
4. Try explicitly mentioning: _"Create a PDF invoice, use pdfdancer"_

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
- _"Create a Python script that generates a PDF with 'Hello World', use pdfdancer"_
- _"Add a page number at the bottom, use pdfdancer"_

**Intermediate:**
- _"Build a TypeScript invoice generator with line items and totals, use pdfdancer"_
- _"Extract all text from a PDF and save to a file, use pdfdancer"_

**Advanced:**
- _"Create a Java application that merges multiple PDFs and adds a table of contents, use pdfdancer"_
- _"Build a report generator with charts, images, and multi-column layouts, use pdfdancer"_

Your AI handles everything—from project setup to implementation to debugging.

## More Information

- **PDFDancer Website**: [www.pdfdancer.com](https://www.pdfdancer.com)
- **Documentation**: [docs.pdfdancer.com](https://docs.pdfdancer.com)
- **MCP Server GitHub**: [github.com/MenschMachine/pdfdancer-mcp](https://github.com/MenschMachine/pdfdancer-mcp)
- **npm Package**: [@pdfdancer/pdfdancer-mcp](https://www.npmjs.com/package/@pdfdancer/pdfdancer-mcp)
- **MCP Protocol**: [Model Context Protocol](https://modelcontextprotocol.io/)

---

**Ready to build?** Just ask your AI: _"Create a PDF with..., use pdfdancer"_ and watch it implement the solution automatically.
