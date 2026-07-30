---
id: glossary
title: Glossary
description: Find precise definitions for PDFDancer, PDF structure, document editing, text layout, object selection, and form terminology.
---

# Glossary

## A

**AcroForm** — The PDF mechanism for interactive fields such as text inputs, checkboxes, radio buttons, dropdowns, and buttons. An AcroForm field has a stored name and value. It is unrelated to a Form XObject. See [Working with AcroForms](./working-with-acroforms).

**Active session** — The server-side working copy represented by an open `PDFDancer` client. Successful operations change this copy. The source file is not overwritten unless the application explicitly saves to the same path.

**Anchor** — Existing literal or regular-expression text used to choose the insertion caret immediately before or after a match. An anchor insertion differs from coordinate insertion because its position is derived from existing text.

**Applied layout mode** — The layout behavior actually used for one text change. It is reported in `TextEditResponse.change`. With `reflowWhenSupported`, it may be source-anchored even when reflow was requested. See [Text Layout and Reflow](./text-layout).

## B

**Bounding rectangle** — An axis-aligned rectangle described by `x`, `y`, `width`, and `height` in PDF points. Selected objects may expose one through their position data. See [Positioning and Coordinates](./positioning).

**Builder** — A fluent object used to collect and validate the inputs for a new object or text edit. Calling methods on a builder does not by itself change the PDF. New-content builders finish with `add`; text-edit builders finish with `build`, after which the result is passed to `replace`, `insert`, `delete`, or `style`.

## C

**Caret** — A zero-width text position between characters. Anchor insertion chooses the caret immediately before or after matched text.

**Clipping path** — A PDF graphics-state boundary that limits which part of painted content is visible. Moving an image or Form XObject does not necessarily move or remove the clipping path affecting it. Clear clipping only when the clipped boundary is no longer intended.

**CommandResult** — The result returned by many image and path transformations. Its fields report whether the operation succeeded, a message, an optional warning, and the affected element identifier. Other operations can return booleans or specialized response types; check the method's documented return type.

**Coordinate insertion** — Text insertion at an explicit one-based page number and `(x, y)` position. Because there is no source text from which to inherit appearance, the edit must provide a font and positive font size.

## D

**Detected text unit** — The layout structure PDFDancer associates with selected characters, such as a paragraph, list item, heading, table cell, or fixed-layout line. Reflow recomposes this unit rather than treating the replacement as an isolated string.

**Diagnostic** — Structured information associated with a text change, warning, or error. Depending on the result, it can include the page, operation, source and result text, requested and applied layout, element identifiers, and reflow-unit identifiers.

**Document scope** — An operation started from `pdf`. Object selectors search all pages, and text edits can match throughout the document unless their definition limits eligible pages.

## E

**Element identifier** — An identifier returned in selected objects or operation diagnostics. It identifies PDFDancer's representation of an element in the active session. Do not treat it as a permanent business identifier across unrelated PDFs or sessions.

**Embedded font** — A font program or subset stored inside the PDF. Existing text can render with an embedded font even when that embedded data cannot encode newly introduced characters. See [Working with Fonts](./working-with-fonts).

## F

**Form XObject** — A reusable PDF content stream that can be painted on one or more pages. It can contain text, images, paths, or other graphics. It is not an interactive AcroForm field. See [Working with Form XObjects](./working-with-formxobjects).

## H

**Hyphenation override** — The optional `hyphenationEnabled` setting on a reflowing text edit. It controls generated discretionary hyphenation for that edit. It does not change hyphens already present in supplied text and is invalid with source-anchored layout.

## L

**Literal text target** — Exact text supplied to a text-edit builder. It can be refined with case sensitivity, whole-word matching, maximum matches, and page restrictions.

## O

**Object selector** — An SDK method that returns existing typed objects, such as `selectImages()` or `select_form_fields_by_name(...)`. A plural selector returns a collection; a singular selector returns one match or the language's empty value. See [Finding Existing Objects](./finding-content).

## P

**Page scope** — An operation started from `pdf.page(n)`, where `n` is a one-based page number. Selection, building, or text editing is restricted to that page.

**PDF point** — The unit used for PDF user-space coordinates and dimensions. One inch equals 72 points. A point is not a CSS pixel.

**Position tolerance** — The distance in points allowed by a coordinate selector. Point selectors default to `0.01` point. Increasing tolerance can find objects near rounded coordinates but can also produce multiple matches.

**Primary reading stream** — The logical sequence reported by reading-unit analysis. Stream membership states whether a unit participates, and its order gives the unit's one-based position among participating units. Excluded units can still appear in the analysis result.

## R

**Reading unit** — A semantically classified text block returned by reading-unit analysis. A unit contains text, reading-stream membership, source provenance, bounds, and relationships. It is analysis output, not an accessibility tag or an editable text selector. See [Structured Text and Reading Units](./reading-units).

**Reading-unit provenance** — The source information associated with a reading unit: its one-based page number, source-element identifiers, and page-space bounds. Provenance connects analysis output to the corresponding PDF content but does not create a permanent business identifier.

**Reading-unit role** — The semantic classification assigned to a reading unit, such as heading, paragraph, list, caption, page header, or footnote. An `UNKNOWN` value allows clients to handle classifications introduced by a newer service.

**Reflow** — Recomposition of a detected text unit after replacement, insertion, deletion, or styling. Depending on the selected profile, following text can move horizontally or wrap onto recalculated lines.

**Reflow profile** — The composition strategy used when a layout mode attempts reflow:

- `DEFAULT` chooses a strategy from the detected layout type.
- `BODY_TEXT` composes every selected unit as prose and can recalculate line breaks.
- `NO_REFLOW` moves following text horizontally while preserving existing line boundaries.

**Regular-expression text target** — A regular expression used to identify text for an edit. It is an editing target, not a general text-extraction result.

## S

**Singular selector** — A convenience method returning the first matching object. No match is represented by `None` in Python, `null` in TypeScript, and `Optional.empty()` in Java. Use a plural selector when multiple objects could satisfy the criteria.

**Source-anchored layout** — Text placement that keeps every unaffected glyph at its original coordinates. Replacement or inserted text starts at the selected source position, so longer inline text can overlap what follows.

**Style run** — A contiguous range of text with shared appearance properties. A style operation can target runs by attributes such as font, size, color, or spacing.

## T

**Text client** — The value returned by `pdf.text()` or `pdf.page(n).text()`. It exposes the four v3 text operations: `replace`, `insert`, `delete`, and `style`.

**TextEditResponse** — The result of a v3 text operation. `matched` reports eligible targets, `changed` reports applied changes, `pagesChanged` reports affected one-based pages, `change` contains per-change details, and `warnings` and `errors` report nonfatal fallbacks and unapplied work.

**Text operation** — One call to `replace`, `insert`, `delete`, or `style`. The accompanying class—such as `TextReplaceRequest`—describes the target, desired change, scope, and layout behavior. In this documentation, “operation” refers to this SDK action; “HTTP request” is used explicitly when discussing transport behavior.

## W

**Whole-word matching** — A literal-target option requiring word boundaries around the supplied text. It prevents a target such as `cat` from matching the same characters inside a longer word such as `catalog`.

## Language naming

The three SDKs expose the same concepts with language-appropriate naming:

| Concept | Python | TypeScript | Java |
|---|---|---|---|
| Page scope | `pdf.page(1)` | `pdf.page(1)` | `pdf.page(1)` |
| Select images | `select_images()` | `selectImages()` | `selectImages()` |
| Move an object | `move_to(x, y)` | `moveTo(x, y)` | `moveTo(x, y)` |
| Reflow if available | `reflow_when_supported(...)` | `reflowWhenSupported(...)` | `reflowWhenSupported(...)` |
| Require reflow | `require_reflow(...)` | `requireReflow(...)` | `requireReflow(...)` |
| Analyze reading units | `analyze_reading_units()` | `analyzeReadingUnits()` | `analyzeReadingUnits()` |
| No singular match | `None` | `null` | `Optional.empty()` |
