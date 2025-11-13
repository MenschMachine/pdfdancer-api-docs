---
id: introduction
title: Introduction to PDFDancer
description: Pixel-perfect programmatic control over any PDF. Edit PDFs you didn't create with surgical precision.
---

PDFDancer gives you pixel-perfect programmatic control over any PDF document from Python, TypeScript, or Java. Unlike other tools, you can edit existing PDFs you didn't create - locate any element by coordinates or text, modify it precisely, add new content at exact positions, and manipulate forms with surgical precision.

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

- **Edit any PDF** - Not just ones you created. Modify third-party invoices, government forms, client contracts
- **Pixel-perfect positioning** - Place content at exact X,Y coordinates, move elements precisely
- **Surgical text replacement** - Find and replace specific paragraphs while preserving layout
- **Embedded font support** - Add text with embedded fonts for consistent rendering across all PDF viewers
- **Paragraph-aware editing** - Work with logical text blocks, not just individual characters or lines
- **Form manipulation** - Fill, update, or delete AcroForm fields programmatically
- **Coordinate-based selection** - Select elements by position, not just content
- **Real PDF editing** - Modify the actual PDF structure, not just overlay content

### Smart Font Matching

When working with PDFs that use embedded fonts, PDFDancer uses a sophisticated ML-powered approach:
- **Glyph analysis** - Our ML model analyzes the visual appearance of glyphs in embedded fonts
- **Intelligent replacement** - When embedded fonts can't be modified directly, we automatically match them with visually similar fonts from our database
- **Preserves appearance** - Text edits maintain the original visual style, even when the exact font isn't available

## Supported Languages

- **Python** 3.10+
- **TypeScript** with Node.js 20+
- **Java** 11+

## What's Next?

Ready to get started? Head to [Getting Started](getting-started.md) to install the SDK and create your first PDF manipulation in 3 minutes.
