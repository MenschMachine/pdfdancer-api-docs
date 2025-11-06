---
id: available-fonts
title: Available Fonts
description: Complete list of pre-registered fonts available in PDFDancer.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import AvailableFonts from '@site/src/components/AvailableFonts';

PDFDancer provides pre-registered fonts that you can use directly without uploading font files. These fonts are available on the service and can be referenced by name in your code.

## Font List

The following fonts are currently available on the PDFDancer service:

<AvailableFonts />

## Using Available Fonts

You can use any of these fonts with the `font()` method. Here are examples for each SDK:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Use available service fonts directly by name
    pdf.new_paragraph() \
        .text("Text with Roboto font") \
        .font("Roboto-Regular", 14) \
        .at(page_index=0, x=100, y=500) \
        .add()

    pdf.new_paragraph() \
        .text("Code with JetBrains Mono") \
        .font("JetBrainsMono-Regular", 12) \
        .at(page_index=0, x=100, y=480) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Use available service fonts directly by name
await pdf.page(0).newParagraph()
  .text('Text with Roboto font')
  .font('Roboto-Regular', 14)
  .at(100, 500)
  .apply();

await pdf.page(0).newParagraph()
  .text('Code with JetBrains Mono')
  .font('JetBrainsMono-Regular', 12)
  .at(100, 480)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Use available service fonts directly by name
pdf.newParagraph()
    .text("Text with Roboto font")
    .font("Roboto-Regular", 14)
    .at(0, 100, 500)
    .add();

pdf.newParagraph()
    .text("Code with JetBrains Mono")
    .font("JetBrainsMono-Regular", 12)
    .at(0, 100, 480)
    .add();

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

## Standard and Embedded Fonts

In addition to pre-registered service fonts, PDFDancer supports two other font categories:

### Standard PDF Fonts

Standard PDF fonts (also known as Base 14 fonts) are built into PDF viewers and don't require font files:

- **Times-Roman** (and Times-Bold, Times-Italic, Times-BoldItalic)
- **Helvetica** (and Helvetica-Bold, Helvetica-Oblique, Helvetica-BoldOblique)
- **Courier** (and Courier-Bold, Courier-Oblique, Courier-BoldOblique)
- **Symbol**
- **ZapfDingbats**

These fonts are universally supported and ideal for basic text rendering without external dependencies.

For detailed information about using standard fonts with the StandardFonts enum and code examples, see [Standard PDF Fonts](working-with-fonts.md#standard-pdf-fonts) in the Working with Fonts guide.

### Embedded Fonts

Embedded fonts are fonts already present in the PDF document you're modifying. PDFDancer can detect and use these fonts automatically. When you call `find_fonts()`, it will search both service fonts and embedded fonts in the document.

To use embedded fonts, simply reference them by name or use `find_fonts()` to discover them:

:::info
For detailed information about embedded fonts, their limitations, and best practices when working with them, see [About Embedded Fonts](working-with-fonts.md#about-embedded-fonts) in the Working with Fonts guide.
:::

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Find fonts already embedded in the document
    embedded_fonts = pdf.find_fonts("Arial", 12)

    if embedded_fonts:
        font = embedded_fonts[0]
        pdf.new_paragraph() \
            .text("Using embedded font") \
            .font(font.name, font.size) \
            .at(page_index=0, x=100, y=400) \
            .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Use embedded fonts by name
await pdf.page(0).newParagraph()
  .text('Using embedded font')
  .font('Arial', 12)
  .at(100, 400)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import com.tfc.pdf.pdfdancer.api.common.model.*;
import java.util.List;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Find fonts already embedded in the document
List<Font> embeddedFonts = pdf.findFonts("Arial", 12);

if (!embeddedFonts.isEmpty()) {
    Font font = embeddedFonts.get(0);
    pdf.newParagraph()
        .text("Using embedded font")
        .font(font.getName(), font.getSize())
        .at(0, 100, 400)
        .add();
}

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

## Finding Fonts Programmatically

You can also search for fonts dynamically using the `find_fonts()` method:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Search for fonts available on the service
    fonts = pdf.find_fonts("Roboto", 14)

    if fonts:
        # Use the first match
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
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// TypeScript client uses font names directly
await pdf.page(0).newParagraph()
  .text('Text with service font')
  .font('Roboto-Regular', 14)
  .at(300, 500)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import com.tfc.pdf.pdfdancer.api.common.model.*;
import java.util.List;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Search for fonts available on the service
List<Font> fonts = pdf.findFonts("Roboto", 14);

if (!fonts.isEmpty()) {
    // Use the first match
    Font font = fonts.get(0);
    System.out.println("Using: " + font.getName() + " at " + font.getSize() + "pt");

    pdf.newParagraph()
        .text("Text with service font")
        .font(font.getName(), font.getSize())
        .at(0, 300, 500)
        .add();
}

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

## Notes

- These fonts are pre-registered on the PDFDancer service and ready to use
- No font file upload required when using these fonts
- For custom fonts not in this list, see [Working with Fonts](working-with-fonts.md#registering-custom-fonts)
- Font names are case-sensitive
- The font list is updated dynamically from the service
