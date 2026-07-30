---
id: editing-text
title: Replace, Insert, and Delete Text
description: Replace, insert, and delete PDF text, then inspect edit responses and diagnostics before saving the resulting document.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Replace, Insert, and Delete Text

The examples assume an open `pdf` session. Every operation returns `TextEditResponse`; inspect it before saving.

## Replace text

This replaces at most five whole-word occurrences and lets PDFDancer recompose supported text units.

<Tabs>
<TabItem value="python" label="Python">

```python
from pdfdancer import TextLayoutProfile, TextReplaceRequest

response = pdf.text().replace(
    TextReplaceRequest.literal("Old product", "New product")
    .whole_words(True)
    .max_matches(5)
    .reflow_when_supported(TextLayoutProfile.DEFAULT)
    .build()
)
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import {TextLayoutProfile, TextReplaceRequest} from 'pdfdancer-client-typescript';

const response = await pdf.text().replace(
  TextReplaceRequest.literal('Old product', 'New product')
    .wholeWords(true)
    .maxMatches(5)
    .reflowWhenSupported(TextLayoutProfile.DEFAULT)
    .build()
);
```

</TabItem>
<TabItem value="java" label="Java">

```java
import com.pdfdancer.common.request.TextLayoutRequest;
import com.pdfdancer.common.request.TextReplaceRequest;

var response = pdf.text().replace(
        TextReplaceRequest.literal("Old product", "New product")
                .wholeWords(true)
                .maxMatches(5)
                .reflowWhenSupported(TextLayoutRequest.Profile.DEFAULT)
                .build());
```

</TabItem>
</Tabs>

Replacement text inherits the source appearance. Add font, size, color, or spacing overrides only when the replacement should look different.

## Insert relative to existing text

Anchor insertion inherits appearance from the text at the insertion caret.

<Tabs>
<TabItem value="python" label="Python">

```python
from pdfdancer import TextInsertRequest, TextLayoutProfile

response = pdf.text().insert(
    TextInsertRequest.after("Invoice total", " (including tax)")
    .reflow_when_supported(TextLayoutProfile.BODY_TEXT)
    .build()
)
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const response = await pdf.text().insert(
  TextInsertRequest.after('Invoice total', ' (including tax)')
    .reflowWhenSupported(TextLayoutProfile.BODY_TEXT)
    .build()
);
```

</TabItem>
<TabItem value="java" label="Java">

```java
var response = pdf.text().insert(
        TextInsertRequest.after("Invoice total", " (including tax)")
                .reflowWhenSupported(TextLayoutRequest.Profile.BODY_TEXT)
                .build());
```

</TabItem>
</Tabs>

Use `before`, `after`, `beforeRegex`, or `afterRegex` to choose the anchor caret.

## Insert at coordinates

Coordinate insertion has no source appearance to inherit, so font and size are required.

<Tabs>
<TabItem value="python" label="Python">

```python
response = pdf.text().insert(
    TextInsertRequest.at(1, 72, 720, "Reviewed")
    .font("Helvetica-Bold")
    .size(12)
    .build()
)
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const response = await pdf.text().insert(
  TextInsertRequest.at(1, 72, 720, 'Reviewed')
    .font('Helvetica-Bold')
    .size(12)
    .build()
);
```

</TabItem>
<TabItem value="java" label="Java">

```java
var response = pdf.text().insert(
        TextInsertRequest.at(1, 72, 720, "Reviewed")
                .font("Helvetica-Bold")
                .size(12)
                .build());
```

</TabItem>
</Tabs>

## Delete text

<Tabs>
<TabItem value="python" label="Python">

```python
from pdfdancer import TextDeleteRequest

response = pdf.page(2).text().delete(
    TextDeleteRequest.regex(r"Confidential\s+draft")
    .case_sensitive(False)
    .build()
)
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const response = await pdf.page(2).text().delete(
  TextDeleteRequest.regex('Confidential\\s+draft')
    .caseSensitive(false)
    .build()
);
```

</TabItem>
<TabItem value="java" label="Java">

```java
var response = pdf.page(2).text().delete(
        TextDeleteRequest.regex("Confidential\\s+draft")
                .caseSensitive(false)
                .build());
```

</TabItem>
</Tabs>

Deletion is not redaction. It removes selected text but does not define the security guarantees of a redaction workflow.

## Accept or reject the result

For an edit that must be applied, accept the result only when the expected number of matches changed, `errors` is empty, and any warnings are acceptable. See [Text Layout](./text-layout) when the replacement changes the amount of text and surrounding content may need to move.
