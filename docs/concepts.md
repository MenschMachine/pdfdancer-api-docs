---
id: concepts
title: Core Concepts
description: Understand sessions, scope, content selection, editing operations, results, and coordinates in API v3.
---

# Core Concepts

## Sessions and scope

An open `PDFDancer` value represents mutable server-side session state. Applied operations accumulate until you save or retrieve the PDF. Close Python sessions with a context manager; do not share a mutable session between unrelated concurrent workflows.

Document scope searches or edits the whole document. Page scope—`pdf.page(1)`—restricts selectors, builders, and text operations to one one-based page number.

## Existing objects and new content

Selectors return typed existing objects or references, such as images, paths, Form XObjects, and form fields. The selected values provide the changes supported for that object type, such as moving, deleting, setting a form value, or clearing clipping.

Builders create content. API v3 has dedicated image, path, line, Bézier, and rectangle builders. A builder does not change the document until its terminal `add` operation succeeds.

## Editing text

You can replace, insert, delete, or style text. For each edit, specify what to target—such as literal text, a regular expression, an existing style, an anchor, or page coordinates—and then apply the operation. The SDK represents these edit definitions with classes such as `TextReplaceRequest` and `TextInsertRequest`. Paragraphs and text lines are not editable objects in v3.

Every text operation returns `TextEditResponse`. Distinguish:

- `matched`: eligible targets found.
- `changed`: changes actually applied.
- `pagesChanged`: affected one-based page numbers.
- `warnings`: nonfatal fallbacks or fidelity concerns.
- `errors`: requested work that was not applied.
- per-change diagnostics: requested and applied layout plus affected element identifiers.

## Geometry

PDF distances are measured in points: 72 points equal one inch. Coordinates normally start at the page's bottom-left. A position or transform is not a CSS pixel coordinate. See [Positioning](./positioning).

## Results are operation-specific

Object changes generally return `CommandResult`; some object methods return a boolean. Text edits return `TextEditResponse`. Inspect the documented fields for that operation: receiving a result object does not by itself mean that the PDF changed.
