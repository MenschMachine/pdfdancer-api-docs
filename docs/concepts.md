---
id: concepts
title: Core Concepts
description: Understand how PDFDancer represents PDF content, scopes operations to documents or pages, and reports changes from editing requests.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Core Concepts

PDFDancer works with a PDF as a structured, positioned document. A page that looks like one visual composition may contain text glyphs, images, vector paths, reusable Form XObjects, and interactive AcroForm fields. These content types have different selectors and editing operations.

![PDFDancer mental model: a session contains pages, pages contain different content types, and selectors or builders apply operations that return results](/img/doc/core-concepts-overview.svg)

The most useful mental model is:

1. Open a PDFDancer session, which represents the working copy of a PDF.
2. Choose document scope or a one-based page scope.
3. Select existing content or describe new content with a builder.
4. Apply an operation.
5. Inspect the operation result.
6. Save the working copy when the result is acceptable.

## A session is a working copy

An open `PDFDancer` value represents the mutable working copy for one PDF. Successful operations accumulate in that session; they do not overwrite the source file until you explicitly save to a path or retrieve the PDF bytes.

Keep one session associated with one workflow. In Python, close it with a context manager. Do not share a mutable session between unrelated concurrent workflows.

## A page contains different kinds of content

The same visible page can contain several different content types:

| Content type | What it represents | Typical API v3 operation |
|---|---|---|
| Text glyphs and style runs | Characters painted at positions with appearance properties such as font, size, and color | Replace, insert, delete, or style through the text client |
| Image | Raster content painted on a page | Select, move, replace, scale, rotate, or delete |
| Path | Lines, curves, fills, and strokes used for vector graphics | Select, create, edit, or delete |
| Form XObject | Reusable content that can contain text, images, paths, or other graphics | Select, move, edit, clear clipping, or delete |
| AcroForm field | An interactive field with a stored name and value, such as a text input or checkbox | Select by name or position, set its value, or delete it |

Form XObjects and AcroForm fields are different PDF concepts. A Form XObject is reusable painted content. An AcroForm field is interactive form data. A visible form-like box may contain either one or both, so select the type that matches the operation you intend to perform.

## A visible thing is not always one editable object

PDFs describe how content is painted, not only the visual objects a person perceives. A logo may be an image, a collection of paths, or a Form XObject. A word may be split into separately positioned glyphs. Text may also have been converted to outlines, in which case it is no longer text for text-editing purposes.

Clipping, reuse, and overlapping painted content can also affect what is visible and what a selector returns. If a visible item does not match the expected selector, identify how it is represented before treating the result as an SDK failure. [Finding Existing Objects](./finding-content) shows how to inspect objects by type, page, and coordinate.

## Existing content and new content use different APIs

Use a selector when the content already exists in the PDF. The selector returns a typed object or reference with the operations supported for that content type.

Use a builder when you want to add new content. Builder methods collect and validate the inputs; the document changes only when the builder's terminal `add` operation succeeds. Text edit requests are built with `build()` and then passed to `replace`, `insert`, `delete`, or `style`.

## Scope determines where an operation applies

Document scope starts from `pdf` and searches or edits the whole document. Page scope starts from `pdf.page(n)` and restricts the operation to one one-based page number. Use page scope when the page is known, especially for coordinate-based selection.

<Tabs>
<TabItem value="python-scope" label="Python">

```python
all_images = pdf.select_images()
page_one_images = pdf.page(1).select_images()
```

</TabItem>
<TabItem value="typescript-scope" label="TypeScript">

```typescript
const allImages = await pdf.selectImages();
const pageOneImages = await pdf.page(1).selectImages();
```

</TabItem>
<TabItem value="java-scope" label="Java">

```java
var allImages = pdf.selectImages();
var pageOneImages = pdf.page(1).selectImages();
```

</TabItem>
</Tabs>

The two calls express the same selection at different scopes. See [Positioning and Coordinates](./positioning) for PDF points, page geometry, and coordinate origins.

## Text is a special case

Text is painted from positioned glyphs rather than stored as guaranteed editable paragraphs or lines. PDFDancer therefore targets text through an operation request: a literal string, regular expression, existing style, anchor, or coordinate.

Text edits can change the amount of content. A source-anchored edit keeps unaffected glyphs at their original coordinates; a reflowing edit may move text or recompute line breaks for a detected text unit. These choices are operation-specific. See [Working with Text](./working-with-text) and [Text Layout and Reflow](./text-layout).

## Results describe what happened

A result object is not, by itself, proof that the PDF changed. Inspect the return type documented for the operation:

| Operation family | Typical result | What to check |
|---|---|---|
| Image, path, Form XObject, and field operations | `CommandResult`, a boolean, or a language-specific empty value | Whether the operation succeeded or found an object |
| Text replacement, insertion, deletion, and styling | `TextEditResponse` | `matched`, `changed`, `warnings`, and `errors` |

For text, `matched` is the number of eligible targets and `changed` is the number actually applied. A warning may describe a permitted fallback or fidelity concern. An error means requested work was not applied. Inspect these fields before saving, especially when an edit is required to change a specific number of occurrences.

## Where to go next

- [Finding Existing Objects](./finding-content) — select images, paths, Form XObjects, and AcroForm fields.
- [Positioning and Coordinates](./positioning) — work with points, rectangles, origins, and transforms.
- [Working with Text](./working-with-text) — target and edit text.
- [Working with AcroForms](./working-with-acroforms) — inspect and change interactive fields.
- [Working with Form XObjects](./working-with-formxobjects) — inspect and edit reusable painted content.
