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

PDF includes 14 standard fonts that are always available in all PDF readers without embedding:

### Times Family (Serif)
- `Times-Roman` - Standard serif font
- `Times-Bold` - Bold variant
- `Times-Italic` - Italic variant
- `Times-BoldItalic` - Bold italic variant

### Helvetica Family (Sans-serif)
- `Helvetica` - Standard sans-serif font
- `Helvetica-Bold` - Bold variant
- `Helvetica-Oblique` - Oblique (italic) variant
- `Helvetica-BoldOblique` - Bold oblique variant

### Courier Family (Monospace)
- `Courier` - Standard monospace font
- `Courier-Bold` - Bold variant
- `Courier-Oblique` - Oblique (italic) variant
- `Courier-BoldOblique` - Bold oblique variant

### Symbol Fonts
- `Symbol` - Mathematical and special characters
- `ZapfDingbats` - Decorative symbols

### Using Standard Fonts

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, StandardFonts, Color

with PDFDancer.open("document.pdf") as pdf:
    # Use standard fonts with enum (recommended)
    pdf.new_paragraph() \
        .text("Helvetica Bold text") \
        .font(StandardFonts.HELVETICA_BOLD.value, 16) \
        .color(Color(255, 0, 0)) \
        .at(page_index=0, x=100, y=500) \
        .add()

    pdf.new_paragraph() \
        .text("Times Roman text") \
        .font(StandardFonts.TIMES_ROMAN.value, 14) \
        .at(page_index=0, x=100, y=480) \
        .add()

    pdf.new_paragraph() \
        .text("Courier monospace code") \
        .font(StandardFonts.COURIER_BOLD.value, 12) \
        .at(page_index=0, x=100, y=460) \
        .add()

    # You can also use font names directly as strings
    pdf.new_paragraph() \
        .text("Direct font name") \
        .font("Helvetica", 12) \
        .at(page_index=0, x=100, y=440) \
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

## Registering Custom Fonts

You can upload and use your own TrueType (.ttf) fonts in three ways:

### Method 1: Using font_file() directly (recommended)

<Tabs>
  <TabItem value="python" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer, Color

with PDFDancer.open("document.pdf") as pdf:
    # Use custom font directly without registration
    ttf_path = Path("fonts/DancingScript-Regular.ttf")

    pdf.new_paragraph() \
        .text("Beautiful custom font\nwith multiple lines") \
        .font_file(ttf_path, 24) \
        .line_spacing(1.8) \
        .color(Color(0, 0, 255)) \
        .at(page_index=0, x=300, y=500) \
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
const fontBytes = await fs.readFile('fonts/DancingScript-Regular.ttf');

// Use the custom font directly with fontFile()
await pdf.page(0).newParagraph()
  .text('Beautiful custom font\nwith multiple lines')
  .fontFile(fontBytes, 24)
  .lineSpacing(1.8)
  .color(new Color(0, 0, 255))
  .at(300, 500)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Method 2: Find and use fonts available on the service

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Search for fonts available on the service
    fonts = pdf.find_fonts("Roboto", 14)

    if fonts:
        # Use the first match (e.g., "Roboto-Regular")
        font = fonts[0]
        print(f"Using: {font.name} at {font.size}pt")

        pdf.new_paragraph() \
            .text("Text with service font") \
            .font(font.name, font.size) \
            .at(page_index=0, x=300, y=500) \
            .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// TypeScript client uses font names directly
const pdf = await PDFDancer.open(pdfBytes);

await pdf.page(0).newParagraph()
  .text('Text with service font')
  .font('Roboto-Regular', 14)
  .at(300, 500)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Method 3: Register custom fonts for reuse

<Tabs>
  <TabItem value="python" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Register custom TTF font
    custom_font_path = Path("fonts/CustomFont.ttf")
    pdf.register_font(str(custom_font_path))

    # Now use the registered font by name
    pdf.new_paragraph() \
        .text("Text with registered font") \
        .font("CustomFont", 14) \
        .at(page_index=0, x=100, y=500) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// TypeScript doesn't have explicit font registration
// Use fontFile() method instead
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Font Sizes and Styling

You can combine standard fonts with different sizes, colors, and line spacing for rich typography:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, StandardFonts, Color

with PDFDancer.open("document.pdf") as pdf:
    # Large heading with bold Helvetica
    pdf.new_paragraph() \
        .text("Large heading") \
        .font(StandardFonts.HELVETICA_BOLD.value, 24) \
        .color(Color(0, 0, 0)) \
        .at(page_index=0, x=100, y=700) \
        .add()

    # Normal body text with Times Roman
    pdf.new_paragraph() \
        .text("Normal body text in Times Roman") \
        .font(StandardFonts.TIMES_ROMAN.value, 12) \
        .at(page_index=0, x=100, y=660) \
        .add()

    # Monospace code example with Courier
    pdf.new_paragraph() \
        .text("def hello():\n    print('Hello')") \
        .font(StandardFonts.COURIER_BOLD.value, 11) \
        .line_spacing(1.5) \
        .color(Color(40, 40, 40)) \
        .at(page_index=0, x=100, y=620) \
        .add()

    # Small footnote
    pdf.new_paragraph() \
        .text("Small footnote") \
        .font(StandardFonts.HELVETICA.value, 8) \
        .color(Color(128, 128, 128)) \
        .at(page_index=0, x=100, y=580) \
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
