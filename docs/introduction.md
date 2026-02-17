---
id: introduction
title: Introduction to PDFDancer
description: Pixel-perfect programmatic control over any PDF. Edit text in real-world PDFs you didn't create with surgical precision.
---

## PDF used to be read-only. We fixed that.

PDFDancer gives you pixel-perfect programmatic control over any PDF document from Python, TypeScript, or Java. Edit text in real-world PDFs you didn't create - locate any element by coordinates or text, modify it precisely, add new content at exact positions, and manipulate forms with surgical precision.

## Highlights

- **Locate anything** inside any PDF—paragraphs, text lines, images, vector paths, pages, AcroForm fields—by page, coordinates, or text prefixes
- **Edit existing content** with pixel-perfect precision using fluent editors and coordinate-based positioning
- **Programmatic control** over PDFs you didn't create - modify invoices, contracts, forms, reports from any source
- **Add content at exact positions** with paragraph/image builders, custom fonts (including embedded font support), and coordinate-based placement
- **Smart text handling** with paragraph-aware text editing, preserving layout and formatting
- **Full vector graphics control** for lines, curves, shapes, and complex drawings
- **Very fast** performance optimized for high-throughput document processing
- **Download results** as bytes for downstream processing or save directly to disk

## What Makes PDFDancer Different

- **Edit text in real-world PDFs** - Not just ones you created. Modify third-party invoices, government forms, client contracts
- **Pixel-perfect positioning** - Place content at exact X,Y coordinates, move elements precisely
- **Surgical text replacement** - Find and replace specific paragraphs while preserving layout
- **Embedded font support** - Add text with embedded fonts for consistent rendering across all PDF viewers
- **Paragraph-aware editing** - Work with logical text blocks, not just individual characters or lines
- **Form manipulation** - Fill, update, or delete AcroForm fields programmatically
- **Coordinate-based selection** - Select elements by position, not just content
- **Real PDF editing** - Modify the actual PDF structure, not just overlay content

### Smart Font Matching

When working with PDFs that use embedded fonts, PDFDancer automatically handles font compatibility:
- **Visual analysis** - Analyzes the appearance of glyphs in embedded fonts
- **Automatic matching** - When embedded fonts can't be modified directly, matches them with visually similar fonts from our database
- **Preserves appearance** - Text edits maintain the original visual style, even when the exact font isn't available

## Supported Languages

- **Python** 3.10+
- **TypeScript** with Node.js 20+
- **Java** 11+

## What's Next?

Ready to get started? Head to [Getting Started](getting-started.md) to install the SDK and create your first PDF manipulation in 3 minutes.

## Helpful links

- [Product overview](https://www.pdfdancer.com?utm_source=github&utm_medium=readme&utm_campaign=pdfdancer-api-docs)
- [SDK documentation](https://docs.pdfdancer.com?utm_source=github&utm_medium=readme&utm_campaign=pdfdancer-api-docs)
- [Changelog](https://www.pdfdancer.com/changelog/?utm_source=github&utm_medium=readme&utm_campaign=pdfdancer-api-docs)
