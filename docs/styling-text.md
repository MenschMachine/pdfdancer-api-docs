---
id: styling-text
title: Styling Text
description: Change PDF text fonts, sizes, colors, and spacing with text styling operations while preserving the rest of the document content.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Styling Text

`TextStyleRequest` changes the appearance of existing text without replacing its characters. Omitted style fields remain unchanged.

## Style a literal phrase

<Tabs>
<TabItem value="python" label="Python">

```python
from pdfdancer import PdfColorRequest, TextStyleRequest

response = pdf.text().style(
    TextStyleRequest.literal("Payment overdue")
    .font("Helvetica-Bold")
    .size(12)
    .fill_color(PdfColorRequest.rgb(0.85, 0.1, 0.1))
    .build()
)
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import {PdfColorRequest, TextStyleRequest} from 'pdfdancer-client-typescript';

const response = await pdf.text().style(
  TextStyleRequest.literal('Payment overdue')
    .font('Helvetica-Bold')
    .size(12)
    .fillColor(PdfColorRequest.rgb(0.85, 0.1, 0.1))
    .build()
);
```

</TabItem>
<TabItem value="java" label="Java">

```java
import com.pdfdancer.common.request.PdfColorRequest;
import com.pdfdancer.common.request.TextStyleRequest;

var response = pdf.text().style(
        TextStyleRequest.literal("Payment overdue")
                .font("Helvetica-Bold")
                .size(12)
                .fillColor(PdfColorRequest.rgb(0.85, 0.1, 0.1))
                .build());
```

</TabItem>
</Tabs>

Bold and italic are part of the font name; there are no separate bold or italic switches.

## Select runs by their current appearance

Style-run filters let you find text by its current appearance and then change that text's font, size, color, spacing, or other supported style properties. They can target one phrase, all text using a font, headings identified by size, or combinations such as bold 12-point text containing `Total`. At least one `where` filter is required.

<Tabs>
<TabItem value="python" label="Python">

```python
response = pdf.text().style(
    TextStyleRequest.runs_where()
    .where_font("Helvetica-Bold")
    .where_size(12, tolerance=0.25)
    .where_text_contains("Total")
    .font("Helvetica")
    .fill_color(PdfColorRequest.rgb(0, 0, 0))
    .build()
)
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const response = await pdf.text().style(
  TextStyleRequest.runsWhere()
    .whereFont('Helvetica-Bold')
    .whereSize(12, 0.25)
    .whereTextContains('Total')
    .font('Helvetica')
    .fillColor(PdfColorRequest.rgb(0, 0, 0))
    .build()
);
```

</TabItem>
<TabItem value="java" label="Java">

```java
var response = pdf.text().style(
        TextStyleRequest.runsWhere()
                .whereFont("Helvetica-Bold")
                .whereSize(12, 0.25)
                .whereTextContains("Total")
                .font("Helvetica")
                .fillColor(PdfColorRequest.rgb(0, 0, 0))
                .build());
```

</TabItem>
</Tabs>

The supplied `where` calls are combined into one filter: a text segment must satisfy every condition. Here, the segment must use `Helvetica-Bold`, be approximately 12 points, and contain `Total`. Start with a narrow page scope and inspect `matched` before applying document-wide changes.

## Where edited text gets its appearance

Text operations need a starting appearance. Some operations can copy the appearance of existing text; coordinate insertion cannot, because it has no source text to copy.

| Operation | Starting appearance |
|---|---|
| Style existing text | Existing selected text |
| Replace with text | Replaced source text |
| Insert at anchor | Text at the anchor caret |
| Insert at coordinates | None; font and size are required |

## Reset spacing overrides

Use the spacing-reset option when selected text has unusual character or word spacing and you want it to use the font's normal spacing. It removes existing spacing overrides; it cannot be combined with explicit spacing values in the same request.

<Tabs>
<TabItem value="python-spacing" label="Python">

```python
from pdfdancer import TextStyleRequest

response = pdf.text().style(
    TextStyleRequest.literal("Total")
    .reset_spacing_overrides()
    .build()
)
```

</TabItem>
<TabItem value="typescript-spacing" label="TypeScript">

```typescript
import {TextStyleRequest} from 'pdfdancer-client-typescript';

const response = await pdf.text().style(
  TextStyleRequest.literal('Total')
    .resetSpacingOverrides()
    .build()
);
```

</TabItem>
<TabItem value="java-spacing" label="Java">

```java
import com.pdfdancer.common.request.TextStyleRequest;

var response = pdf.text().style(
        TextStyleRequest.literal("Total")
                .resetSpacingOverrides(true)
                .build());
```

</TabItem>
</Tabs>

## Custom fonts and characters the font cannot display

Register a TTF and use the returned font name. Registration only makes the font available; it does not guarantee that the font contains every character in the selected text. If `matched` is positive but `changed` is zero, inspect font-related errors before saving. See [Working with Fonts](./working-with-fonts.md).
