---
id: adding-content
title: Adding Content to PDFs
description: Learn how to add new paragraphs, images, and custom fonts to PDFs.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

PDFDancer provides fluent builders for adding new content to PDFs. You can insert paragraphs with custom fonts and colors, add images, and register custom fonts.

---

## Adding Paragraphs

### Basic Paragraph

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color

with PDFDancer.open("document.pdf") as pdf:
    # Add a new paragraph
    pdf.new_paragraph() \
        .text("This is a new paragraph") \
        .font("Helvetica", 12) \
        .color(Color(0, 0, 0)) \
        .at(page_index=0, x=100, y=500) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Add a new paragraph
await pdf.page(0).newParagraph()
  .text('This is a new paragraph')
  .font('Helvetica', 12)
  .color(new Color(0, 0, 0))
  .at(100, 500)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Multi-line Paragraph

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color

with PDFDancer.open("document.pdf") as pdf:
    # Add multi-line paragraph
    pdf.new_paragraph() \
        .text("Line 1\nLine 2\nLine 3") \
        .font("Helvetica", 12) \
        .color(Color(0, 0, 0)) \
        .line_spacing(1.4) \
        .at(page_index=0, x=100, y=400) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Add multi-line paragraph
await pdf.page(0).newParagraph()
  .text('Line 1\nLine 2\nLine 3')
  .font('Helvetica', 12)
  .color(new Color(0, 0, 0))
  .lineSpacing(1.4)
  .at(100, 400)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Styled Paragraph

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color

with PDFDancer.open("document.pdf") as pdf:
    # Add styled paragraph
    pdf.new_paragraph() \
        .text("Greetings from PDFDancer!") \
        .font("Helvetica-Bold", 14) \
        .color(Color(255, 64, 64)) \
        .line_spacing(1.1) \
        .at(page_index=0, x=220, y=480) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Add styled paragraph
await pdf.page(0).newParagraph()
  .text('Greetings from PDFDancer!')
  .font('Helvetica-Bold', 14)
  .color(new Color(255, 64, 64))
  .lineSpacing(1.1)
  .at(220, 480)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Adding Images

### From File Path

<Tabs>
  <TabItem value="python" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Add image from file
    pdf.new_image() \
        .from_file(Path("logo.png")) \
        .at(page=0, x=48, y=700) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Add image from file
await pdf.newImage()
  .fromFile('logo.png')
  .at(0, 48, 700)
  .add();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### From Bytes

<Tabs>
  <TabItem value="python" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Load image bytes
    image_bytes = Path("logo.png").read_bytes()

    # Add image from bytes
    pdf.new_image() \
        .from_bytes(image_bytes) \
        .at(page=0, x=100, y=600) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';
import { promises as fs } from 'node:fs';

const pdf = await PDFDancer.open(pdfBytes);

// Load image bytes
const imageBytes = await fs.readFile('logo.png');

// Add image from bytes
await pdf.newImage()
  .fromBytes(imageBytes)
  .at(0, 100, 600)
  .add();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Multiple Images

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Add logo at top
    pdf.new_image() \
        .from_file("logo.png") \
        .at(page=0, x=50, y=750) \
        .add()

    # Add signature at bottom
    pdf.new_image() \
        .from_file("signature.png") \
        .at(page=0, x=400, y=50) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Add logo at top
await pdf.newImage()
  .fromFile('logo.png')
  .at(0, 50, 750)
  .add();

// Add signature at bottom
await pdf.newImage()
  .fromFile('signature.png')
  .at(0, 400, 50)
  .add();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Working with Custom Fonts

### Finding Available Fonts

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Find fonts available on the service
    fonts = pdf.find_fonts("Roboto", 12)

    for font in fonts:
        print(f"Font: {font.name}, Size: {font.size}")

    # Use found font
    if fonts:
        pdf.new_paragraph() \
            .text("Using service font") \
            .font(fonts[0].name, fonts[0].size) \
            .at(page_index=0, x=100, y=500) \
            .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// TypeScript client handles fonts directly
// You can use standard font names or upload custom fonts

await pdf.page(0).newParagraph()
  .text('Using standard font')
  .font('Roboto-Regular', 12)
  .at(100, 500)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Registering Custom Fonts

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Register a custom TTF font
    pdf.register_font("/path/to/custom.ttf")

    # Now you can use it
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
const fontBytes = await fs.readFile('DancingScript-Regular.ttf');

// Use custom font when building paragraph
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

## Position and Coordinates

### Understanding Coordinates

PDF coordinates start from the bottom-left corner:
- **X-axis**: Left (0) to Right (increases)
- **Y-axis**: Bottom (0) to Top (increases)

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Position

with PDFDancer.open("document.pdf") as pdf:
    # Bottom-left corner
    pdf.new_paragraph() \
        .text("Bottom Left") \
        .font("Helvetica", 10) \
        .at(page_index=0, x=10, y=10) \
        .add()

    # Top-left corner (assuming 792pt height)
    pdf.new_paragraph() \
        .text("Top Left") \
        .font("Helvetica", 10) \
        .at(page_index=0, x=10, y=782) \
        .add()

    # Center (assuming 612x792pt page)
    pdf.new_paragraph() \
        .text("Center") \
        .font("Helvetica", 10) \
        .at(page_index=0, x=306, y=396) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);
const page = pdf.page(0);

// Bottom-left corner
await page.newParagraph()
  .text('Bottom Left')
  .font('Helvetica', 10)
  .at(10, 10)
  .apply();

// Top-left corner (assuming 792pt height)
await page.newParagraph()
  .text('Top Left')
  .font('Helvetica', 10)
  .at(10, 782)
  .apply();

// Center (assuming 612x792pt page)
await page.newParagraph()
  .text('Center')
  .font('Helvetica', 10)
  .at(306, 396)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Complete Example: Adding Header and Footer

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color
from pathlib import Path

with PDFDancer.open("document.pdf") as pdf:
    # Add header with logo and title
    pdf.new_image() \
        .from_file("company-logo.png") \
        .at(page=0, x=50, y=750) \
        .add()

    pdf.new_paragraph() \
        .text("Company Report 2024") \
        .font("Helvetica-Bold", 16) \
        .color(Color(0, 0, 128)) \
        .at(page_index=0, x=150, y=760) \
        .add()

    # Add footer with page number and date
    pdf.new_paragraph() \
        .text("Page 1 | Generated on 2024-01-15") \
        .font("Helvetica", 9) \
        .color(Color(128, 128, 128)) \
        .at(page_index=0, x=200, y=30) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);
const page = pdf.page(0);

// Add header with logo and title
await pdf.newImage()
  .fromFile('company-logo.png')
  .at(0, 50, 750)
  .add();

await page.newParagraph()
  .text('Company Report 2024')
  .font('Helvetica-Bold', 16)
  .color(new Color(0, 0, 128))
  .at(150, 760)
  .apply();

// Add footer with page number and date
await page.newParagraph()
  .text('Page 1 | Generated on 2024-01-15')
  .font('Helvetica', 9)
  .color(new Color(128, 128, 128))
  .at(200, 30)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Next Steps

- [**Error Handling**](error-handling.md) – Handle exceptions when adding content
- [**Advanced**](advanced.md) – Complex workflows and optimization techniques
- [**Examples**](cookbook.md) – See complete working examples
