---
id: getting-started
slug: /
title: Getting Started
description: Choose a PDFDancer SDK and edit your first PDF with Python, TypeScript, or Java, from opening an input file through saving the edited document.
---

# Getting Started with PDFDancer

PDFDancer edits text, pages, images, vector graphics, and form fields in existing PDF files. The Python, TypeScript, and Java SDKs use the same workflow: open a PDF, make a change, inspect the operation result, and save the edited file.

## Choose your SDK

- [Python](./getting-started-python.md) — Python 3.10 or newer
- [TypeScript](./getting-started-typescript.md) — Node.js 20 or newer
- [Java](./getting-started-java.md) — Java 17 or newer

All page numbers passed to v3 SDK methods are **one-based**. PDF coordinates are measured in points, normally from the bottom-left corner of the page.

## How editing works

1. Open an existing PDF or create a new document.
2. Work with the whole document (`pdf`) or one page (`pdf.page(1)`).
3. Select an existing object, or identify the text to change.
4. Check the returned result, warnings, and errors.
5. Save to a file or retrieve the current PDF as bytes.

Start with the quickstart for your language. Each quickstart uses the same downloadable PDF and works without creating an account.

## Authentication

When no credential is supplied, the SDK requests a temporary anonymous token. Anonymous output is watermarked. For production, create an account and configure `PDFDANCER_API_TOKEN`. See [Authentication](./authentication.md).

## Where to go next

- [Find and edit text](./working-with-text.md)
- [Add or transform images](./working-with-images.md)
- [Create and reorder pages](./working-with-pages.md)
- [Work with PDF coordinates](./positioning.md)
- [Handle failures in production](./error-handling.md)

Upgrading an existing integration? See [Migrating from API v1](./migrating-from-v1.md). The complete v1 documentation remains available under [/v1/](/v1/).
