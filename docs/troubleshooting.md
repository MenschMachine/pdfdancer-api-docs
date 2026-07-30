---
id: troubleshooting
title: Troubleshooting
description: Diagnose common PDFDancer setup, selection, text, geometry, font, session, and rate-limit failures using symptom-focused troubleshooting steps.
---

# Troubleshooting

Start with the symptom shown by your program. Preserve the original input PDF while investigating, and save diagnostic output to a different path.

## Authentication fails before a session opens

- Remove an empty or stale `PDFDANCER_API_TOKEN` value to test anonymous access.
- For account-backed access, copy the key again from the dashboard overview and store it without surrounding whitespace.
- Confirm that server-side TypeScript code—not browser-delivered JavaScript—is making the request.
- Do not disable TLS verification to work around an authentication error.

See [Authentication](./authentication) for the supported credential sources.

## Visible text is not found

PDF text may be split into multiple encoded runs even when it appears continuous in a viewer.

1. Restrict the operation to the known page with `pdf.page(n).text()`.
2. Verify that the page number is one-based.
3. Start with a literal selector containing the shortest distinctive text.
4. Check `matched`, warnings, and errors before changing layout settings.
5. If a literal selector still finds nothing, try a regular expression that tolerates the observed whitespace.

See [When visible text does not match](./working-with-text#when-visible-text-does-not-match).

## A text operation returns matches but makes no change

`matched` reports eligible targets; `changed` reports applied changes. Inspect `errors` and the per-change diagnostics whenever `changed` is smaller than `matched`. Do not save when your application requires every match to change.

See [Read the response](./working-with-text#read-the-response) and [Text Layout and Reflow](./text-layout).

## An object selector returns no result

- Use a plural selector first to confirm that the page contains the expected object type.
- Confirm page scope and the one-based page number.
- For coordinate selection, convert top-left coordinates to PDF coordinates and increase tolerance only enough to account for measurement error.
- Distinguish AcroForm fields from Form XObjects; they use different selectors.

See [Finding Existing Objects](./finding-content) and [Positioning and Coordinates](./positioning).

## Added or moved content appears in the wrong place

PDF coordinates normally start at the bottom-left corner. Confirm the page height, rotation, and the meaning of `(x, y)` for the specific operation. A selection point, insertion caret, object destination, and path point are not interchangeable concepts.

See [Troubleshooting misplaced content](./positioning#troubleshooting-misplaced-content).

## Replacement text contains missing glyphs

The selected font must contain every character being introduced. Use a service-hosted font with the required glyph coverage or register a suitable TTF font. Treat an embedded-font warning as a reason to inspect the saved output.

See [Working with Fonts](./working-with-fonts).

## The session expired or cannot be found

Open a new session from the original input and replay the workflow. Do not continue from a partially reconstructed client object, and do not share one mutable session between unrelated concurrent jobs.

## The service returns a rate-limit failure

Honor the retry delay exposed by the SDK when present. Keep SDK retries and surrounding job retries bounded; validation failures and deterministic no-match results should not be retried as transient failures.

See [Error Handling](./error-handling) and [Advanced Usage](./advanced).

## The saved PDF opens but fails an archival or signature check

A successful save confirms that a PDF was produced; it does not certify PDF/A conformance or preserve an existing digital signature. Validate the final bytes with the same conformance and signature tools used by the receiving workflow.

See [Preservation and PDF/A](./preservation-and-pdfa).
