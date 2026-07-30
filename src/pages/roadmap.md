---
title: Product Roadmap
description: Review PDFDancer’s current product priorities, recently shipped capabilities, and planned improvements for PDF editing and SDK workflows.
---

# Product Roadmap

PDFDancer is actively developed with regular updates and new features. This roadmap provides visibility into what we're working on and what's planned for the future.

:::info
This roadmap is subject to change based on customer feedback and evolving requirements. Features may be reprioritized, added, or removed.
:::

## What's Coming Next

- **Full Text-Metric Read/Write Access** — Complete control over text metrics
- **PDF Metadata Editing** — Read and update PDF metadata properties

## Performance

- **Async Session Creation** — Faster session startup

## Backlog

- **Reflow with Collision Detection** — Expand text reflow until it hits other visible elements
- **Batched Edits** — Loop operations like drawing grids
- **Document Template Store API** — Cloud-based template storage
- **Table Extraction** — Automatically detect and extract tabular data from PDFs
- **XFA Form Support** — For financial and government forms
- **Extended Position Matching** — `contains()` and `intersects()` for bounding boxes
- **Digital Signatures** — Sign and verify documents
- **Signed PDF Handling** — Graceful handling of digitally signed documents
- **Password Protected PDFs** — Support for encrypted documents
- **PHP SDK** — Native PHP support
- **.NET SDK** — Native C# support for .NET developers

## Shipped

- **Structured Text Extraction** — Analyze documents or individual pages as semantic reading units with roles, reading order, source provenance, bounds, and relationships
- **API v3 SDKs** — Updated Java, Python, and TypeScript SDKs with a request-based workflow for replacing, inserting, deleting, and styling text
- **Text Reflow** — Reflow edited text while respecting alignment, columns, lists, whitespace, hyphenation, and justified layouts
- **Template Replacement** — Replace text and image placeholders with dynamic content, with optional reflow
- **Text Fragment Editing** — Change the font, size, or color of specific parts of a text line
- **Text Selection and Detection** — Select text by pattern or position, detect invisible text, and preserve stable text references across sessions
- **Paragraph and Column Detection** — Detect paragraphs and complex multi-column layouts
- **Page Operations** — Delete individual pages or page ranges while preserving page dimensions and rotation
- **Vector Graphics** — Create, group, transform, and recolor vector paths, including transparent fills and strokes
- **Image Manipulation** — Scale, rotate, replace, crop, flip, adjust opacity, and fill regions in images
- **PDF/A Preservation** — Preserve PDF/A conformance information when processing compliant documents
- **Clipping Region Removal** — Reveal content hidden by clipping regions
- **Typography and Font Management** — Control kerning and text spacing, swap fonts while preserving positioning, and manage custom fonts
- **PDF Structure Support** — Preserve outlines and bookmarks, control element stacking order, and work with PDF layers
- **Redaction** — Permanently remove sensitive text, images, paths, and form fields
- **Form Fields and Annotations** — Select and edit form fields while preserving supported appearances and annotations
- **MCP Server** — Upload, inspect, edit, and export PDFs through Model Context Protocol clients
- **Reliability Improvements** — Automatic retries and graceful rate-limit handling across the SDKs
- **OpenAPI Specification** — Public API reference for integrating with PDFDancer
- **SDKs for Java, Python, and TypeScript** — Supported SDKs for the three languages
