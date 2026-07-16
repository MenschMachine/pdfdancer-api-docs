---
id: styling-text
title: Styling Text
description: Change PDF text fonts, size, colors, and spacing with API v2.
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

Style-run filters are useful for document-wide font replacement or normalizing inconsistent text. At least one `where` filter is required.

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

Supplied filters describe one filter object. A candidate run must satisfy the combined filter. Start with a narrow page scope and inspect `matched` before applying document-wide changes.

## Appearance inheritance

| Operation | Starting appearance |
|---|---|
| Style existing text | Existing selected text |
| Replace with text | Replaced source text |
| Insert at anchor | Text at the anchor caret |
| Insert at coordinates | None; font and size are required |

## Reset spacing overrides

Use the spacing-reset option to remove character- and word-spacing overrides. It cannot be combined with explicit spacing values in the same request.

## Custom fonts and missing glyphs

Register a TTF and use the returned font name. Registration does not prove glyph coverage. If `matched` is positive but `changed` is zero, inspect font-related errors before saving. See [Working with Fonts](./working-with-fonts).
