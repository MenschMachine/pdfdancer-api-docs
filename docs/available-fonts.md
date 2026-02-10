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
        .at(page_number=1, x=100, y=500) \
        .add()

    pdf.new_paragraph() \
        .text("Code with JetBrains Mono") \
        .font("JetBrainsMono-Regular", 12) \
        .at(page_number=1, x=100, y=480) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');

// Use available service fonts directly by name
await pdf.page(1).newParagraph()
  .text('Text with Roboto font')
  .font('Roboto-Regular', 14)
  .at(100, 500)
  .apply();

await pdf.page(1).newParagraph()
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
    .at(1, 100, 500)
    .add();

pdf.newParagraph()
    .text("Code with JetBrains Mono")
    .font("JetBrainsMono-Regular", 12)
    .at(1, 100, 480)
    .add();

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

## Other Font Options

Beyond the pre-registered service fonts listed above, PDFDancer supports several other ways to work with fonts. See the [Working with Fonts](working-with-fonts.md) guide for full details and code examples:

- [**Standard PDF Fonts**](working-with-fonts.md#standard-pdf-fonts) — The 14 built-in PDF fonts (Helvetica, Times, Courier, etc.) available in all PDF readers without embedding.
- [**Custom Fonts**](working-with-fonts.md#custom-fonts) — Upload your own TrueType (.ttf) font files using `font_file()`, or register them for reuse.
- [**Embedded Fonts**](working-with-fonts.md#embedded-fonts) — Work with fonts already present in an existing PDF, including subset limitations and font recommendations.
- [**Finding Fonts Programmatically**](working-with-fonts.md#using-service-hosted-fonts) — Use `find_fonts()` to search for available fonts by name at runtime.

## Notes

- Font names are case-sensitive — use the exact name as shown in the list above
- The font list is updated dynamically from the service
- No font file upload is required when using pre-registered service fonts
