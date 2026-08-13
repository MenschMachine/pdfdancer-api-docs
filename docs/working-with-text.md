---
id: working-with-text
title: Working with Text
description: Find and edit PDF text, inspect returned operation results, diagnose mismatches, and save the document safely after successful changes.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Working with Text

To edit text, describe what PDFDancer should target and choose an operation: replace, insert, delete, or style. The operation returns a `TextEditResponse` describing what PDFDancer found and changed.

Download the [quickstart PDF](pathname:///files/v3/pdfdancer-v3-quickstart.pdf) as `input.pdf`. It contains `Hello` on page 1. The complete example below writes `output.pdf` with `Hello` replaced by `Final`.

## The basic workflow

<Tabs>
<TabItem value="python" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer, TextReplaceRequest

with PDFDancer.open(Path("input.pdf")) as pdf:
    response = pdf.text().replace(
        TextReplaceRequest.literal("Hello", "Final")
        .whole_words(True)
        .build()
    )

    if response.matched == 0:
        raise RuntimeError("Hello was not found")
    if response.errors:
        raise RuntimeError(f"Replacement failed: {response.errors}")

    pdf.save("output.pdf")
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import * as fs from 'node:fs';
import {PDFDancer, TextReplaceRequest} from 'pdfdancer-client-typescript';

const input = new Uint8Array(fs.readFileSync('input.pdf'));
const pdf = await PDFDancer.open(input);
const response = await pdf.text().replace(
  TextReplaceRequest.literal('Hello', 'Final')
    .wholeWords(true)
    .build()
);

if (response.matched === 0) throw new Error('Hello was not found');
if (response.errors?.length) throw new Error(JSON.stringify(response.errors));
await pdf.save('output.pdf');
```

</TabItem>
<TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.common.request.TextReplaceRequest;
import com.pdfdancer.common.response.TextEditResponse;

PDFDancer pdf = PDFDancer.createSession("input.pdf");
TextEditResponse response = pdf.text().replace(
        TextReplaceRequest.literal("Hello", "Final")
                .wholeWords(true)
                .build());

if (response.matched() == 0) {
    throw new IllegalStateException("Hello was not found");
}
if (response.errors() != null && !response.errors().isEmpty()) {
    throw new IllegalStateException(response.errors().toString());
}
pdf.save("./output.pdf");
```

</TabItem>
</Tabs>

## Document scope and page scope

`pdf.text()` searches the document. `pdf.page(2).text()` limits the operation to page 2. Page numbers are one-based.

You can also limit a document-wide edit to a set of page numbers. Prefer `pdf.page(n).text()` when one page is the natural boundary; configure page numbers on the edit definition when the same change should run on several known pages.

<Tabs>
<TabItem value="python-scope" label="Python">

```python
page_two = pdf.page(2).text().replace(
    TextReplaceRequest.literal("Draft", "Final").build()
)
selected_pages = pdf.text().replace(
    TextReplaceRequest.literal("Draft", "Final").pages(2, 4).build()
)
```

</TabItem>
<TabItem value="typescript-scope" label="TypeScript">

```typescript
const pageTwo = await pdf.page(2).text().replace(
  TextReplaceRequest.literal('Draft', 'Final').build()
);
const selectedPages = await pdf.text().replace(
  TextReplaceRequest.literal('Draft', 'Final').pages(2, 4).build()
);
```

</TabItem>
<TabItem value="java-scope" label="Java">

```java
var pageTwo = pdf.page(2).text().replace(
        TextReplaceRequest.literal("Draft", "Final").build());
var selectedPages = pdf.text().replace(
        TextReplaceRequest.literal("Draft", "Final").pages(2, 4).build());
```

</TabItem>
</Tabs>

## Choose how to match text

Literal matching is the clearest choice when the text is known. Use a regular expression when part of the text varies, such as an invoice number. Keep the pattern narrow and add `maxMatches` when only a bounded number of edits is expected.

<Tabs>
<TabItem value="python" label="Python">

```python
literal = TextReplaceRequest.literal("Acme Ltd", "Northwind GmbH").build()
invoice = (
    TextReplaceRequest.regex(r"Invoice\s+#\d+", "Invoice")
    .case_sensitive(False)
    .max_matches(1)
    .build()
)
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const literal = TextReplaceRequest.literal('Acme Ltd', 'Northwind GmbH').build();
const invoice = TextReplaceRequest.regex('Invoice\\s+#\\d+', 'Invoice')
  .caseSensitive(false)
  .maxMatches(1)
  .build();
```

</TabItem>
<TabItem value="java" label="Java">

```java
TextReplaceRequest literal = TextReplaceRequest
        .literal("Acme Ltd", "Northwind GmbH").build();
TextReplaceRequest invoice = TextReplaceRequest
        .regex("Invoice\\s+#\\d+", "Invoice")
        .caseSensitive(false)
        .maxMatches(1)
        .build();
```

</TabItem>
</Tabs>

`wholeWords` applies to literal selectors. `maxMatches` limits the number of eligible matches, which protects against changing more occurrences than intended.

PDF text is stored as positioned glyphs, not as a guaranteed plain-text paragraph. PDFDancer matches the text representation it can associate with those glyphs; unusual encoding, separated characters, or text converted to outlines can affect whether a literal or regular-expression target matches. Start with a small representative edit, inspect `matched`, and verify the rendered output before applying it in bulk.

## Replace, insert, delete, and style

Each operation has a dedicated builder. These examples show one minimal edit of each kind.

<Tabs>
<TabItem value="python-operations" label="Python">

```python
from pdfdancer import (
    PdfColorRequest,
    TextDeleteRequest,
    TextInsertRequest,
    TextReplaceRequest,
    TextStyleRequest,
)

replaced = pdf.text().replace(
    TextReplaceRequest.literal("Draft", "Final").build()
)
inserted = pdf.text().insert(
    TextInsertRequest.after("Invoice total", " including tax").build()
)
deleted = pdf.page(2).text().delete(
    TextDeleteRequest.literal("Internal only").build()
)
styled = pdf.text().style(
    TextStyleRequest.literal("Overdue")
    .fill_color(PdfColorRequest.rgb(0.85, 0.1, 0.1))
    .build()
)
```

</TabItem>
<TabItem value="typescript-operations" label="TypeScript">

```typescript
import {
  PdfColorRequest,
  TextDeleteRequest,
  TextInsertRequest,
  TextReplaceRequest,
  TextStyleRequest,
} from 'pdfdancer-client-typescript';

const replaced = await pdf.text().replace(
  TextReplaceRequest.literal('Draft', 'Final').build()
);
const inserted = await pdf.text().insert(
  TextInsertRequest.after('Invoice total', ' including tax').build()
);
const deleted = await pdf.page(2).text().delete(
  TextDeleteRequest.literal('Internal only').build()
);
const styled = await pdf.text().style(
  TextStyleRequest.literal('Overdue')
    .fillColor(PdfColorRequest.rgb(0.85, 0.1, 0.1))
    .build()
);
```

</TabItem>
<TabItem value="java-operations" label="Java">

```java
import com.pdfdancer.common.request.PdfColorRequest;
import com.pdfdancer.common.request.TextDeleteRequest;
import com.pdfdancer.common.request.TextInsertRequest;
import com.pdfdancer.common.request.TextReplaceRequest;
import com.pdfdancer.common.request.TextStyleRequest;

var replaced = pdf.text().replace(
        TextReplaceRequest.literal("Draft", "Final").build());
var inserted = pdf.text().insert(
        TextInsertRequest.after("Invoice total", " including tax").build());
var deleted = pdf.page(2).text().delete(
        TextDeleteRequest.literal("Internal only").build());
var styled = pdf.text().style(
        TextStyleRequest.literal("Overdue")
                .fillColor(PdfColorRequest.rgb(0.85, 0.1, 0.1))
                .build());
```

</TabItem>
</Tabs>

Replacement and anchor insertion inherit appearance from existing text. Coordinate insertion requires an explicit font and size. Styling changes appearance without changing characters. Deletion removes selected text; it is not a security redaction operation.

## Read the response

| Field | Meaning |
|---|---|
| `matched` | Number of selector matches or insertion targets |
| `changed` | Number of changes actually applied |
| `pagesChanged` | One-based page numbers changed |
| `change` | Per-change details, including requested and applied layout |
| `warnings` | Nonfatal conditions, including permitted layout fallback |
| `errors` | Requested changes that were not applied |

`matched > 0` is not sufficient for success. If `changed < matched`, inspect warnings and errors before saving.

<Tabs>
<TabItem value="python-response" label="Python">

```python
if response.matched == 0:
    raise RuntimeError("Required text was not found")
if response.errors or response.changed != response.matched:
    raise RuntimeError(f"Not every match changed: {response.errors}")
for warning in response.warnings or ():
    print(warning.code, warning.page, warning.message)
```

</TabItem>
<TabItem value="typescript-response" label="TypeScript">

```typescript
if (response.matched === 0) throw new Error('Required text was not found');
if (response.errors?.length || response.changed !== response.matched) {
  throw new Error(`Not every match changed: ${JSON.stringify(response.errors)}`);
}
for (const warning of response.warnings ?? []) {
  console.warn(warning.code, warning.page, warning.message);
}
```

</TabItem>
<TabItem value="java-response" label="Java">

```java
if (response.matched() == 0) {
    throw new IllegalStateException("Required text was not found");
}
if (response.errors() != null && !response.errors().isEmpty()
        || !response.matched().equals(response.changed())) {
    throw new IllegalStateException("Not every match changed: " + response.errors());
}
if (response.warnings() != null) {
    response.warnings().forEach(warning -> System.err.println(
            warning.code() + " on page " + warning.page() + ": " + warning.message()));
}
```

</TabItem>
</Tabs>

## When visible text does not match

PDF text is stored as positioned glyphs and runs. A phrase that looks continuous in a viewer may be split internally. If a literal selector finds nothing:

1. Confirm the page scope and capitalization.
2. Try a smaller, unique literal.
3. Inspect `matched`, `changed`, warnings, and errors from a small representative edit.
4. Use a regular-expression pattern that matches only the intended text, and set `maxMatches` when you expect a limited number of matches.

If the result still does not match the rendered text, the PDF may represent the visible content as separated glyphs, outlines, or another structure that is not editable text. In that case, inspect the rendered output and the source PDF as an optional diagnostic step rather than assuming that the visible phrase is one text target.

Continue with [Replace, Insert, and Delete](./editing-text.md), [Styling Text](./styling-text.md), or [Text Layout](./text-layout.md).
