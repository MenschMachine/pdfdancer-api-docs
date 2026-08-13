---
id: working-with-fonts
title: Working with Fonts
description: Use service fonts, custom TTF files, and embedded PDF fonts safely when creating or editing text in PDF documents.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Working with Fonts

PDFDancer can use service-hosted fonts and fonts registered from TTF data for the current workflow. Use the exact returned font name when replacing, inserting, or styling text.

## Complete font-change workflow

Download the [quickstart PDF](/files/v3/pdfdancer-v3-quickstart.pdf) as `input.pdf`. The program changes `Hello` to `Helvetica-Bold` and saves `output.pdf`.

<Tabs>
<TabItem value="python-complete" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer, TextStyleRequest

with PDFDancer.open(Path("input.pdf")) as pdf:
    response = pdf.text().style(
        TextStyleRequest.literal("Hello").font("Helvetica-Bold").build()
    )
    if response.changed != 1 or response.errors:
        raise RuntimeError(f"Font change failed: {response.errors}")
    pdf.save("output.pdf")
```

</TabItem>
<TabItem value="typescript-complete" label="TypeScript">

```typescript
import * as fs from 'node:fs';
import {PDFDancer, TextStyleRequest} from 'pdfdancer-client-typescript';

const input = new Uint8Array(fs.readFileSync('input.pdf'));
const pdf = await PDFDancer.open(input);
const response = await pdf.text().style(
  TextStyleRequest.literal('Hello').font('Helvetica-Bold').build()
);
if (response.changed !== 1 || response.errors?.length) {
  throw new Error(`Font change failed: ${JSON.stringify(response.errors)}`);
}
await pdf.save('output.pdf');
```

</TabItem>
<TabItem value="java-complete" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.common.request.TextStyleRequest;

public class ChangeFont {
    public static void main(String[] args) throws Exception {
        PDFDancer pdf = PDFDancer.createSession("input.pdf");
        var response = pdf.text().style(
                TextStyleRequest.literal("Hello").font("Helvetica-Bold").build());
        if (response.changed() != 1
                || (response.errors() != null && !response.errors().isEmpty())) {
            throw new IllegalStateException("Font change failed: " + response.errors());
        }
        pdf.save("./output.pdf");
    }
}
```

</TabItem>
</Tabs>

Open `output.pdf` and confirm that `Hello` is bold. The remaining examples assume an open `pdf` session.

## Use a service-hosted font

Set the complete font name, including its weight or style variant. For example, `Helvetica-Bold` selects the bold face; there is no separate `bold=true` setting.

<Tabs>
<TabItem value="python-hosted" label="Python">

```python
from pdfdancer import TextStyleRequest

response = pdf.text().style(
    TextStyleRequest.literal("Quarterly report")
    .font("Helvetica-Bold")
    .size(18)
    .build()
)
```

</TabItem>
<TabItem value="typescript-hosted" label="TypeScript">

```typescript
import {TextStyleRequest} from 'pdfdancer-client-typescript';

const response = await pdf.text().style(
  TextStyleRequest.literal('Quarterly report')
    .font('Helvetica-Bold')
    .size(18)
    .build()
);
```

</TabItem>
<TabItem value="java-hosted" label="Java">

```java
import com.pdfdancer.common.request.TextStyleRequest;

var response = pdf.text().style(
        TextStyleRequest.literal("Quarterly report")
                .font("Helvetica-Bold")
                .size(18)
                .build());
```

</TabItem>
</Tabs>

See [Available Fonts](./available-fonts.md) for service-hosted names.

## Register and use a TTF font

<Tabs>
<TabItem value="python" label="Python">

```python
from pathlib import Path
from pdfdancer import TextStyleRequest

font_name = pdf.register_font(Path("Inter-Regular.ttf"))
response = pdf.text().style(
    TextStyleRequest.literal("Quarterly report")
    .font(font_name)
    .build()
)
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const fontName = await pdf.registerFont('Inter-Regular.ttf');
const response = await pdf.text().style(
  TextStyleRequest.literal('Quarterly report')
    .font(fontName)
    .build()
);
```

</TabItem>
<TabItem value="java" label="Java">

```java
import java.io.File;

String fontName = pdf.registerFont(new File("Inter-Regular.ttf"));
var response = pdf.text().style(
        TextStyleRequest.literal("Quarterly report")
                .font(fontName)
                .build());
```

</TabItem>
</Tabs>

Register once per session and reuse the returned name. Do not assume it equals the filename.

Check the style operation before saving:

<Tabs>
<TabItem value="python-check" label="Python">

```python
if response.changed != 1 or response.errors:
    raise RuntimeError(f"Font change failed: {response.errors}")
```

</TabItem>
<TabItem value="typescript-check" label="TypeScript">

```typescript
if (response.changed !== 1 || response.errors?.length) {
  throw new Error(`Font change failed: ${JSON.stringify(response.errors)}`);
}
```

</TabItem>
<TabItem value="java-check" label="Java">

```java
if (response.changed() != 1
        || response.errors() != null && !response.errors().isEmpty()) {
    throw new IllegalStateException("Font change failed: " + response.errors());
}
```

</TabItem>
</Tabs>

## Font selection

Font names encode weight and style; the text editing API does not expose separate bold and italic switches.

## Insert text with an explicit font

Coordinate insertion requires a font and positive size because there is no existing text from which to inherit appearance.

<Tabs>
<TabItem value="python-insert" label="Python">

```python
from pdfdancer import TextInsertRequest

response = pdf.text().insert(
    TextInsertRequest.at(1, 72, 720, "Reviewed")
    .font("Helvetica-Bold")
    .size(12)
    .build()
)
```

</TabItem>
<TabItem value="typescript-insert" label="TypeScript">

```typescript
import {TextInsertRequest} from 'pdfdancer-client-typescript';

const response = await pdf.text().insert(
  TextInsertRequest.at(1, 72, 720, 'Reviewed')
    .font('Helvetica-Bold')
    .size(12)
    .build()
);
```

</TabItem>
<TabItem value="java-insert" label="Java">

```java
import com.pdfdancer.common.request.TextInsertRequest;

var response = pdf.text().insert(
        TextInsertRequest.at(1, 72, 720, "Reviewed")
                .font("Helvetica-Bold")
                .size(12)
                .build());
```

</TabItem>
</Tabs>

## Custom fonts

Register the font before using it. Registration success confirms that the service accepted the file, not that the font contains every glyph required by the new text.

Check `TextEditResponse`: a selector can match while the change count remains zero because the chosen font cannot encode the replacement. Treat font-related errors as failed edits.

<Tabs>
<TabItem value="python-errors" label="Python">

```python
if response.matched and response.changed == 0:
    for error in response.errors or ():
        print(error.code, error.message)
    raise RuntimeError("Text matched, but the chosen font could not apply the edit")
```

</TabItem>
<TabItem value="typescript-errors" label="TypeScript">

```typescript
if ((response.matched ?? 0) > 0 && response.changed === 0) {
  for (const error of response.errors ?? []) console.error(error.code, error.message);
  throw new Error('Text matched, but the chosen font could not apply the edit');
}
```

</TabItem>
<TabItem value="java-errors" label="Java">

```java
if (response.matched() != null && response.matched() > 0
        && response.changed() != null && response.changed() == 0) {
    if (response.errors() != null) {
        response.errors().forEach(error ->
                System.err.println(error.code() + ": " + error.message()));
    }
    throw new IllegalStateException(
            "Text matched, but the chosen font could not apply the edit");
}
```

</TabItem>
</Tabs>

## Embedded-font warning

An embedded font can report glyph support while still lacking usable embedded glyph data for newly introduced characters. When PDFDancer returns an embedded-font warning:

1. Inspect the warnings and applied changes.
2. Render the affected pages and verify the new characters.
3. If output is incorrect, register and select a known TTF font with the required glyph coverage.

Do not suppress or ignore the warning solely because the operation returned matches.

<Tabs>
<TabItem value="python-warnings" label="Python">

```python
for warning in response.warnings or ():
    print(warning.code, warning.page, warning.message)
if response.errors or response.changed != response.matched:
    raise RuntimeError("The font-dependent edit was not fully applied")
```

</TabItem>
<TabItem value="typescript-warnings" label="TypeScript">

```typescript
for (const warning of response.warnings ?? []) {
  console.warn(warning.code, warning.page, warning.message);
}
if (response.errors?.length || response.changed !== response.matched) {
  throw new Error('The font-dependent edit was not fully applied');
}
```

</TabItem>
<TabItem value="java-warnings" label="Java">

```java
if (response.warnings() != null) {
    response.warnings().forEach(warning -> System.err.println(
            warning.code() + " on page " + warning.page() + ": " + warning.message()));
}
if (response.errors() != null && !response.errors().isEmpty()
        || !response.matched().equals(response.changed())) {
    throw new IllegalStateException("The font-dependent edit was not fully applied");
}
```

</TabItem>
</Tabs>
