# Product Roadmap

PDFDancer is actively developed with regular updates and new features. This roadmap provides visibility into what we're working on and what's planned for the future.

:::info
This roadmap is subject to change based on customer feedback and evolving requirements. Features may be reprioritized, added, or removed.
:::

## What's Coming Next

- **Text-Fragment Editing** — Edit individual text fragments within a line (font, size, color)
- **Full Text-Metric Read/Write Access** — Complete control over text metrics
- **PDF Metadata Editing** — Read and update PDF metadata properties

## In Progress

- **MCP Server Improvements** — Enhanced Model Context Protocol integration

## Performance

- **Async Session Creation** — Faster session startup

## Backlog

- **Reflow with Collision Detection** — Expand text reflow until it hits other visible elements
- **Batched Edits** — Loop operations like drawing grids
- **Document Template Store API** — Cloud-based template storage
- **Table Extraction** — Automatically detect and extract tabular data from PDFs
- **XFA Form Support** — For financial and government forms
- **AcroForm Editing** — Create and modify PDF form fields programmatically
- **Extended Position Matching** — `contains()` and `intersects()` for bounding boxes
- **Enhanced Content Extraction** — Improved access to text, images, form data, vector graphics
- **Digital Signatures** — Sign and verify documents
- **Signed PDF Handling** — Graceful handling of digitally signed documents
- **Password Protected PDFs** — Support for encrypted documents
- **PHP SDK** — Native PHP support
- **.NET SDK** — Native C# support for .NET developers

## Shipped

- **Text Reflow (V2)** — New reflow engine with alignment detection (left, right, centered, justified)
- **Template Replacement API** — Replace placeholder text with dynamic content
- **Paragraph & Column Detection** — Three-column and multi-column layout support
- **Text Fragment Editing** — Change font, size, or color on specific parts of a text line
- **Vector Path Grouping** — Group and transform paths as a unit
- **Path Color Support** — Fill and stroke colors with alpha channel support
- **PDF/A Conformance Preservation** — ICC profiles, output intents, XMP metadata preserved
- **Clipping Region Removal** — Reveal hidden content
- **Kerning & Typography** — Character spacing, word spacing, horizontal scaling
- **Image Manipulation** — Scale, rotate, replace, crop, flip, opacity
- **Image Fill Region** — Fill rectangular regions with solid color
- **PDF Outline & Bookmark Support** — Table of contents preserved
- **Invisible Text Detection** — Extract text hidden in PDFs
- **Z-Order Element Control** — Control stacking order of elements
- **Custom Font Management** — Upload and manage fonts
- **Regex Text Selection** — Select text lines by pattern
- **Redaction API** — Permanently remove sensitive content
- **Form Field Selection & Editing** — Work with PDF form fields
- **Optional Content (PDF Layers)** — Support for OCGs and layer visibility
- **Font Swap with Kerning** — Replace fonts with positioning preserved
- **Template Placeholder Images** — Replace placeholders with images
- **Automatic Retries & Rate Limiting** — Built-in retry logic
- **OpenAPI Specification** — Full API documentation
- **MCP Server** — Model Context Protocol for AI assistants
- **SDKs for Java, Python, TypeScript** — Multi-language support
