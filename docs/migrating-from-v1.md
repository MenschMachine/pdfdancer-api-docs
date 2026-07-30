---
id: migrating-from-v1
title: Migrating from API v1
description: Upgrade an existing PDFDancer integration with guidance for text editing, object selection, and result handling.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Migrate from API v1 to API v3

API v3 gives text editing a more precise and capable model. You can target literal text, regular expressions, anchors, styles, or coordinates; replace, insert, delete, and style text with dedicated requests; and choose how surrounding content responds when text changes length.

The main migration is straightforward: v1 selects a `Paragraph` or `TextLine` and opens an edit builder, while v3 puts the target and desired change into a request. The surrounding workflow remains familiar: open a PDF, make changes, inspect the result, and save the output. Keep the [v1 documentation](/v1/) open while you locate the code that needs to change.

:::tip
The v3 request model separates what to target from what to do. That lets you reuse the same targeting rules for replacement, insertion, deletion, and styling while choosing the layout behavior for each edit.
:::

## 1. Move to request-based text editing

Find the v1 pattern in the first column and use the v3 capability in the second column.

| API v1 pattern | API v3 capability | Learn more |
|---|---|---|
| `select_paragraphs_*`, `select_text_lines_*`, or paragraph/text-line edit builders | Replace the selection-and-edit sequence with a request that targets the text as part of the operation. | [Rewrite text edits](#2-rewrite-text-edits) |
| Text replacement or deletion | Use a dedicated `TextReplaceRequest` or `TextDeleteRequest`. | [Convert each text operation](#convert-each-text-operation) |
| Text styling | Use a `TextStyleRequest` to change appearance without replacing characters. | [Styling Text](./styling-text) |
| `ReflowPreset` | Choose whether text stays fixed, moves along the line, or is recomposed into new lines. | [Choose layout behavior](#choose-the-layout-behavior-your-output-needs) |
| Images, paths, pages, forms, or fonts | Keep the same application task and adopt the v3 selectors, classes, methods, and result checks. | [Update other operations](#3-update-other-operations) |
| Snapshots | Use the v3 snapshot classes and filter arguments. | See the language-specific examples in this documentation. |
| Text extraction | Use the v3 REST API now; SDK support is coming in the next SDK releases. | [Text extraction](#text-extraction) |
| Redaction | Keep the v1 workflow until a v3 SDK replacement is available. | [Plan remaining workflows](#6-plan-for-remaining-v1-workflows) |
| Template request objects | Compose the workflow from individual v3 text requests and compare the output with your v1 result. | [Plan remaining workflows](#6-plan-for-remaining-v1-workflows) |

## 2. Rewrite text edits

### Replace text with a targeted request

In v1, your code selects a paragraph before changing it:

| API v1 | API v3 | Learn more |
|---|---|---|
| Select a `Paragraph` or `TextLine` | Target text with a literal, regular-expression, style, anchor, or coordinate selector. | [Working with Text](./working-with-text) |
| Call `.edit()` on the selected object | Build a `TextReplaceRequest`, `TextInsertRequest`, `TextDeleteRequest`, or `TextStyleRequest`. | [Editing Text](./editing-text) |
| Paragraph or text-line object is what you edit | Specify the text to change as part of the v3 operation. Paragraphs and text lines are not editable objects in v3. | [Core Concepts](./concepts) |
| `ReflowPreset` | A v3 layout mode and profile: `TextLayoutProfile` in Python/TypeScript or `TextLayoutRequest.Profile` in Java. | [Text Layout](./text-layout) |
| Boolean or edited-object result | `TextEditResponse`, including match/change counts and diagnostics. | [Working with Text](./working-with-text) |
| Result from changing an existing object | Usually `CommandResult`; some operations return booleans. | [Error Handling](./error-handling) |

In v1, that workflow looks like this. This comparison-only snippet is intentionally not validated against the v3 SDK:

<!-- docs-test: ignore -->
```python
with PDFDancer.open("input.pdf") as pdf:
    paragraphs = pdf.page(1).select_paragraphs_matching("Hello")

    if paragraphs:
        paragraphs[0].edit().replace("Final").apply()

    pdf.save("output.pdf")
```

In v3, put the text target and replacement in a request:

The snippets below assume that `pdf` is an open v3 session. The language-specific quickstarts show complete project setup and imports:

<Tabs>
<TabItem value="python" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer, TextReplaceRequest

with PDFDancer.open(pdf_data=Path("input.pdf")) as pdf:
    response = pdf.page(1).text().replace(
        TextReplaceRequest.literal("Hello", "Final").build()
    )

    if response.matched == 0:
        raise RuntimeError("The source text was not found")
    if response.changed != response.matched or response.errors:
        raise RuntimeError(f"The edit failed: {response.errors}")

    pdf.save("output.pdf")
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const response = await pdf.page(1).text().replace(
  TextReplaceRequest.literal('Hello', 'Final').build()
);

if (response.matched === 0) throw new Error('The source text was not found');
if (response.changed !== response.matched || response.errors?.length) {
  throw new Error(`The edit failed: ${JSON.stringify(response.errors)}`);
}
```

</TabItem>
<TabItem value="java" label="Java">

```java
TextEditResponse response = pdf.page(1).text().replace(
        TextReplaceRequest.literal("Hello", "Final").build());

if (response.matched() == 0) {
    throw new IllegalStateException("The source text was not found");
}
if (!response.changed().equals(response.matched())
        || (response.errors() != null && !response.errors().isEmpty())) {
    throw new IllegalStateException("The edit failed: " + response.errors());
}
```

</TabItem>
</Tabs>

Make these changes in your application:

1. Target the text through the request instead of selecting a paragraph with `select_paragraphs_matching()`.
2. `pdf.page(1).text()` scopes the operation to page 1. Use `pdf.text()` for document scope.
3. `TextReplaceRequest.literal()` defines both the target and replacement.
4. `TextEditResponse.matched` reports matching text; `changed` reports applied changes.
5. `matched` can be greater than `changed`. Check both values, warnings, and errors before saving when every replacement is required.

Use a regular expression when a literal target is not sufficient. These selectors find text to edit; they do not extract text from the PDF. For extraction, use the REST API until SDK support is available.

### Text extraction

Text extraction remains available through the v3 REST API. SDK support is coming in the next SDK releases. Use the REST API until the SDK version you use exposes the extraction operation.

### Convert each text operation

| Your v1 task | Build this v3 request | Then call | Learn more |
|---|---|---|---|
| Replace text | `TextReplaceRequest` | `replace()` | [Editing Text](./editing-text) |
| Insert text near existing text | `TextInsertRequest` | `insert()` | [Editing Text](./editing-text) |
| Delete text | `TextDeleteRequest` | `delete()` | [Editing Text](./editing-text) |
| Change text appearance | `TextStyleRequest` | `style()` | [Styling Text](./styling-text) |
| Control wrapping and text movement | A request with a layout mode and profile | `replace()`, `insert()`, `delete()`, or `style()` | [Text Layout](./text-layout) |

### Choose the layout behavior your output needs

In v3, layout behavior is explicit. Choose the option that produces the output your application needs. In Python and TypeScript, use `TextLayoutProfile`; in Java, use `TextLayoutRequest.Profile`. See [Text Layout](./text-layout) before choosing a mode.

| Your output must… | Use this v3 choice |
|---|---|
| Keep unaffected glyphs fixed | `sourceAnchored()` |
| Move following text without changing line breaks | `reflowWhenSupported(NO_REFLOW)` |
| Allow paragraphs to wrap after replacement | `reflowWhenSupported(BODY_TEXT)` or `DEFAULT` |
| Reject edits when reflow cannot be performed | `requireReflow(...)` |

If you use `reflowWhenSupported`, inspect the applied layout and warnings. `changed > 0` does not prove that reflow occurred.

## 3. Update other operations

For these workflows, keep your application goal and update the v3 calls and result handling.

| Your application task | What to change |
|---|---|
| Work with pages | Update the page methods and return-value handling that changed. See [Working with Pages](./working-with-pages). |
| Select or replace images | Update selectors and replacement methods. Check `CommandResult.success`. See [Working with Images](./working-with-images). |
| Create or edit vector graphics | Update returned object classes and use the v3 builder methods that finish with `add()` or edit-session methods that finish with `apply()`. See [Working with Vector Graphics](./working-with-vector-graphics). |
| Register or apply fonts | Update registration and text-style calls. Verify glyph coverage and response diagnostics. See [Working with Fonts](./working-with-fonts). |
| Fill forms or edit Form XObjects | Update form-field and Form XObject classes and selectors. See [Working with AcroForms](./working-with-acroforms) and [Working with Form XObjects](./working-with-formxobjects). |
| Inspect snapshots | Update snapshot classes and filter arguments using the language-specific examples in this documentation. |
| Authenticate or configure the client | Update client construction and SDK-specific configuration. See [Authentication](./authentication). |

## 4. Update your language integration

### Python

- Import v3 request and model types from the package root when the v3 guide shows them there.
- Use the v3 `PDFDancer.open(pdf_data=...)` form shown in the [Python quickstart](./getting-started-python).
- Close mutable sessions with a context manager.
- Use snake_case method names.

### TypeScript

- Import v3 public types from `pdfdancer-client-typescript`.
- Await asynchronous session, edit, and save operations.
- Use the camelCase method names shown in the [TypeScript quickstart](./getting-started-typescript).

### Java

- Use public packages under `com.pdfdancer...`.
- Construct requests with the v3 request builders.
- Use accessor methods such as `matched()` and `changed()` on response objects.
- Check the dependency coordinates and Java version in the [Java quickstart](./getting-started-java).

The three SDKs expose the same v3 concepts with language-appropriate naming.

## 5. Validate every edit

For each required text edit, fail the operation when fewer matches changed than expected, `errors` is non-empty, or a warning is unacceptable.

For text operations, inspect:

- `matched`: matching text found;
- `changed`: targets actually changed;
- `pagesChanged`: pages affected by the edit;
- `warnings`: nonfatal fallbacks or fidelity concerns;
- `errors`: requested work that was not applied; and
- per-change diagnostics, including the requested and applied layout.

For image and path transformations, inspect `CommandResult.success`, its message and warning fields, and the identifier of the changed object. Some other object operations return booleans. See [Error Handling](./error-handling).

## 6. Plan for remaining v1 workflows

Most editing workflows can move to v3. Plan separately for text extraction, redaction, and template or reflow workflows:

- [Text extraction](#text-extraction) is available through the REST API now; SDK support is coming in the next SDK releases.
- [Redaction](/v1/redaction)

Keep redaction on v1 or choose another solution until a v3 SDK replacement is available. Text deletion cannot replace redaction.

For templates and reflow, compare v3 output with representative v1 output. An individual text replacement or v3 layout request may be suitable, but it is not necessarily equivalent to every v1 template or reflow behavior.

## 7. Run your migration checklist

- [ ] Install the v3 SDK for the selected language.
- [ ] Replace v1 paragraph and text-line selectors.
- [ ] Convert edits to v3 request objects.
- [ ] Replace v1 edit-builder application calls with v3 text operations.
- [ ] Check `matched`, `changed`, warnings, and errors.
- [ ] Update imports and Java package names.
- [ ] Re-test fonts and layout-sensitive PDFs.
- [ ] Use the REST API for text extraction until SDK support is available.
- [ ] Keep redaction on v1, or replace it with another solution until v3 SDK support is available.
- [ ] Compare template and reflow output with representative v1 output.
- [ ] Compare generated PDFs against v1 output using representative fixtures.

## Find the v3 guide for each v1 page

| API v1 page | API v3 destination |
|---|---|
| Introduction + Getting Started | [Getting Started](/v3/) |
| Working with Text | [Working with Text](./working-with-text), [Editing Text](./editing-text), and [Styling Text](./styling-text) |
| Deleting Content | The relevant text, page, image, path, or form guide |
| How Reflow Works | [Text Layout](./text-layout) |
| Embedded Font Warning | [Working with Fonts](./working-with-fonts) |
| Extracting Text | Use the v3 REST API; SDK support is coming in the next SDK releases |
| Redaction | No v3 SDK replacement; keep the v1 workflow or choose another solution |
