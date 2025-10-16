---
id: working-with-fonts
title: Working with Fonts
description: Learn how to use standard fonts and register custom fonts in PDFDancer.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

PDFDancer supports both standard PDF fonts and custom TrueType fonts. You can use system fonts or upload your own font files.

---

## Standard PDF Fonts

PDF includes 14 standard fonts that are always available:

- **Helvetica** (and Helvetica-Bold, Helvetica-Oblique, Helvetica-BoldOblique)
- **Times-Roman** (and Times-Bold, Times-Italic, Times-BoldItalic)
- **Courier** (and Courier-Bold, Courier-Oblique, Courier-BoldOblique)
- **Symbol**
- **ZapfDingbats**

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color

with PDFDancer.open("document.pdf") as pdf:
    # Use standard fonts
    pdf.new_paragraph() \
        .text("Helvetica text") \
        .font("Helvetica", 12) \
        .at(page_index=0, x=100, y=500) \
        .add()

    pdf.new_paragraph() \
        .text("Times Roman text") \
        .font("Times-Roman", 12) \
        .at(page_index=0, x=100, y=480) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Use standard fonts
await pdf.page(0).newParagraph()
  .text('Helvetica text')
  .font('Helvetica', 12)
  .at(100, 500)
  .apply();

await pdf.page(0).newParagraph()
  .text('Times Roman text')
  .font('Times-Roman', 12)
  .at(100, 480)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Finding Service Fonts

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Search for available fonts on the service
    roboto_fonts = pdf.find_fonts("Roboto", 12)

    if roboto_fonts:
        # Use the first match
        font = roboto_fonts[0]
        print(f"Using: {font.name} at {font.size}pt")

        pdf.new_paragraph() \
            .text("Text with service font") \
            .font(font.name, font.size) \
            .at(page_index=0, x=100, y=500) \
            .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// TypeScript client uses standard font names directly
const pdf = await PDFDancer.open(pdfBytes);

await pdf.page(0).newParagraph()
  .text('Text with standard font')
  .font('Roboto-Regular', 12)
  .at(100, 500)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Registering Custom Fonts

You can upload and use your own TrueType (.ttf) fonts.

<Tabs>
  <TabItem value="python" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Register custom TTF font
    custom_font_path = Path("fonts/CustomFont.ttf")
    pdf.register_font(str(custom_font_path))

    # Now use the custom font
    pdf.new_paragraph() \
        .text("Text with custom font") \
        .font("CustomFont", 14) \
        .at(page_index=0, x=100, y=500) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';
import { promises as fs } from 'node:fs';

const pdf = await PDFDancer.open(pdfBytes);

// Load custom font file
const fontBytes = await fs.readFile('fonts/CustomFont.ttf');

// Use the custom font directly with fontFile()
await pdf.page(0).newParagraph()
  .text('Text with custom font')
  .fontFile(fontBytes, 14)
  .at(100, 500)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Font Sizes and Styling

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color

with PDFDancer.open("document.pdf") as pdf:
    # Different font sizes
    pdf.new_paragraph() \
        .text("Large heading") \
        .font("Helvetica-Bold", 24) \
        .color(Color(0, 0, 0)) \
        .at(page_index=0, x=100, y=700) \
        .add()

    pdf.new_paragraph() \
        .text("Normal body text") \
        .font("Helvetica", 12) \
        .at(page_index=0, x=100, y=660) \
        .add()

    pdf.new_paragraph() \
        .text("Small footnote") \
        .font("Helvetica", 8) \
        .color(Color(128, 128, 128)) \
        .at(page_index=0, x=100, y=640) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Different font sizes
await pdf.page(0).newParagraph()
  .text('Large heading')
  .font('Helvetica-Bold', 24)
  .color(new Color(0, 0, 0))
  .at(100, 700)
  .apply();

await pdf.page(0).newParagraph()
  .text('Normal body text')
  .font('Helvetica', 12)
  .at(100, 660)
  .apply();

await pdf.page(0).newParagraph()
  .text('Small footnote')
  .font('Helvetica', 8)
  .color(new Color(128, 128, 128))
  .at(100, 640)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Next Steps

- [**Details about Positioning**](positioning.md) – Understand PDF coordinate systems
- [**Cookbook**](cookbook.md) – See complete working examples with fonts
- [**Error Handling**](error-handling.md) – Handle font not found errors
