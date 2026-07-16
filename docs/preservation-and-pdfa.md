---
id: preservation-and-pdfa
title: Preservation and PDF/A
description: Understand preservation boundaries when saving edited PDFs.
---

# Preservation and PDF/A

PDFDancer edits the existing PDF structure and aims to retain unrelated document data. Preservation is not a promise that every edit maintains every conformance profile.

Three different outcomes must not be conflated:

| Outcome | What it establishes |
|---|---|
| The SDK operation succeeds | The requested operation was accepted and applied to the active session. |
| The PDF saves and opens | PDF bytes were produced and a viewer can parse them. |
| An external validator passes | The final file meets the conformance profile checked by that validator. |

## Data to verify

For documents with regulatory or archival requirements, verify after editing:

- metadata and document identifiers;
- embedded color profiles and output intents;
- tagged-PDF structure and accessibility semantics;
- embedded fonts and glyph coverage;
- signatures and certification status;
- the required PDF/A conformance level.

An edit can invalidate a digital signature because the file bytes and document structure change. PDF/A conformance can also depend on the newly introduced font, color, image, transparency, and metadata resources.

## Digitally signed PDFs

A digital signature covers specific PDF bytes and revision state. Editing and saving the document changes that state. Treat an existing signature as invalidated unless the receiving signature validator explicitly confirms otherwise. If the business workflow requires a signed final document, perform PDFDancer edits before the final signing step.

## Fonts, colors, images, and transparency

- A replacement or inserted font must satisfy the target profile's embedding and glyph requirements.
- New colors and images can introduce color spaces or profiles that differ from the source document.
- Opacity and transparent image operations can violate restrictions imposed by older PDF/A profiles.
- Replacing an image can change resolution, encoding, metadata, and color-profile characteristics even when its placement is retained.

These are validation concerns, not SDK return-value fields. Inspect the saved PDF with the validator used by the receiving system.

## Recommended validation sequence

1. Retain the original input unchanged.
2. Apply all required edits to one session.
3. Reject any operation result that does not meet the application's expected counts or success criteria.
4. Save to a new output path.
5. Open or parse the saved file as a structural smoke check.
6. Run the required PDF/A, signature, accessibility, or organizational validator against the final bytes.
7. Publish the file only when every required check passes.

## Release acceptance

Treat a successful save as confirmation that PDFDancer produced a PDF, not as an independent conformance certificate. Run the organization’s normal validator on the final bytes and reject the output when validation fails.
