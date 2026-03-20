---
id: preservation-and-pdfa
title: Preservation and PDF/A
description: How PDFDancer preserves metadata, color profiles, tagged PDF information, and PDF/A conformance during edits.
---

PDFDancer edits the PDF structure directly. That means document fidelity matters just as much as the visible page content.

When you modify an existing PDF, PDFDancer now preserves more of the original document-level information automatically, especially for archival PDFs and color-managed files.

---

## What PDFDancer Preserves

For existing PDFs, PDFDancer preserves these document-level structures when possible:

- Document information metadata such as title, author, subject, keywords, producer, and creator
- Existing XMP metadata streams
- Output intents used for color-managed and print-ready PDFs
- Embedded ICC color profiles on images during image replacement workflows
- Tagged-PDF mark information stored in the document catalog
- PDF/A conformance level and compatible save format when the source file is already PDF/A

This behavior applies across the Python, TypeScript, and Java SDKs. You do not need a separate "preserve metadata" call.

---

## PDF/A Behavior

If the source file is a PDF/A document, PDFDancer keeps the detected PDF/A level as the target for the output document.

That includes:

- Keeping PDF/A-appropriate metadata instead of overwriting producer and creator fields with generic PDFDancer values
- Preserving the source XMP packet and updating modification timestamps in the XMP metadata
- Preserving output intents and tagged-PDF mark info that are often required for compliant archival files
- Saving with a PDF version compatible with the source PDF/A level

For PDF/A-1 files, PDFDancer also saves with PDF/A-1-compatible serialization constraints.

:::info
PDFDancer preserves PDF/A-related structures from the source document, but your edits still need to be valid for that conformance level.
:::

---

## When Saves Can Fail

Some edits can make a PDF/A file non-compliant. A common example is adding or replacing text with fonts that are not acceptable for the source document's PDF/A requirements.

When PDF/A conformance enforcement is enabled by the processing pipeline, PDFDancer validates those cases before writing the output. If the edit would break PDF/A conformance, the save can fail instead of silently producing a damaged archival file.

In practice, this matters most when you:

- Add new text to an existing PDF/A document
- Replace text in a PDF/A document using a different font
- Modify a print-ready or color-managed file where ICC and output-intent data must remain intact

If you hit a save-time validation error on a PDF/A file, start by checking the fonts used in your edit. The guidance in [Working with Fonts](working-with-fonts.md) is the right place to begin.

---

## Image Replacement and Color Fidelity

Replacing an image no longer strips ICC-based color information from the source image when that profile can be carried forward safely.

That means PDFDancer now preserves color-managed images more reliably in workflows like:

- Replacing logos in print PDFs
- Updating product images in catalogs
- Editing images inside archived PDF/A documents

If the replacement image data is incompatible with the original ICC profile, PDFDancer avoids writing a mismatched profile instead of embedding incorrect color metadata.

See [Working with Images](working-with-images.md) for the editing APIs themselves.

---

## Metadata Provenance

PDFDancer preserves the original document metadata instead of replacing it wholesale.

At the same time, the processing pipeline still records that PDFDancer touched the file by adding its own provenance metadata field. This keeps the output traceable without destroying the source document's original metadata identity.

---

## What This Means in Practice

For most workflows, nothing changes in your code. You keep using the same editing APIs:

- Open a PDF
- Make text, image, page, or form edits
- Save the result

The difference is that edited files now retain substantially more of the original archival, accessibility, metadata, and color-management information by default.
