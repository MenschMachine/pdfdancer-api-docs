---
id: working-with-text
title: Working with Text
description: Learn how to find, add, edit, move, and delete text content in PDFs including paragraphs and text lines.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

PDFDancer provides comprehensive tools for working with text in PDFs. You can select existing text, add new paragraphs, edit content, move text, and delete paragraphs.

---

## Selecting Paragraphs

### All Paragraphs

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Get all paragraphs across the entire document
    all_paragraphs = pdf.select_paragraphs()
    print(f"Total paragraphs: {len(all_paragraphs)}")

    # Get all paragraphs on a specific page
    page_paragraphs = pdf.page(0).select_paragraphs()
    print(f"Page 0 paragraphs: {len(page_paragraphs)}")

    for para in page_paragraphs:
        print(f"Paragraph: {para.text[:50]}...")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Get all paragraphs across the entire document
const allParagraphs = await pdf.selectParagraphs();
console.log(`Total paragraphs: ${allParagraphs.length}`);

// Get all paragraphs on a specific page
const pageParagraphs = await pdf.page(0).selectParagraphs();
console.log(`Page 0 paragraphs: ${pageParagraphs.length}`);

for (const para of pageParagraphs) {
  console.log(`Paragraph: ${para.text?.substring(0, 50)}...`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Paragraphs by Text Prefix

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("invoice.pdf") as pdf:
    # Find paragraphs starting with specific text
    headers = pdf.select_paragraphs_starting_with("Invoice #")

    # On a specific page
    page_headers = pdf.page(0).select_paragraphs_starting_with("The Complete")

    if page_headers:
        para = page_headers[0]
        print(f"Found: {para.text}")
        print(f"Position: ({para.position.x()}, {para.position.y()})")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Find paragraphs starting with specific text
const headers = await pdf.selectParagraphsStartingWith('Invoice #');

// On a specific page
const pageHeaders = await pdf.page(0).selectParagraphsStartingWith('The Complete');

if (pageHeaders.length > 0) {
  const para = pageHeaders[0];
  console.log(`Found: ${para.text}`);
  console.log(`Position: (${para.position.x}, ${para.position.y})`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Paragraphs at Coordinates

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Find paragraphs at specific coordinates
    paragraphs = pdf.page(0).select_paragraphs_at(x=150, y=320)

    for para in paragraphs:
        print(f"Paragraph at position: {para.text}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Find paragraphs at specific coordinates
const paragraphs = await pdf.page(0).selectParagraphsAt(150, 320);

for (const para of paragraphs) {
  console.log(`Paragraph at position: ${para.text}`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Text Properties

Once you've selected a paragraph or text line, you can access its properties including text content, font information, position, color, and status information.

### Accessing Text Properties

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    paragraphs = pdf.page(0).select_paragraphs()

    for para in paragraphs:
        # Access text content
        print(f"Text: {para.text}")

        # Access font information
        print(f"Font: {para.font_name} at {para.font_size}pt")

        # Access position
        print(f"Position: ({para.position.x()}, {para.position.y()})")

        # Access color (if available)
        if para.color:
            print(f"Color: RGB({para.color.r}, {para.color.g}, {para.color.b})")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);
const paragraphs = await pdf.page(0).selectParagraphs();

for (const para of paragraphs) {
  // Access text content
  console.log(`Text: ${para.text}`);

  // Access font information
  console.log(`Font: ${para.fontName} at ${para.fontSize}pt`);

  // Access position
  console.log(`Position: (${para.position.x}, ${para.position.y})`);

  // Access color (if available)
  if (para.color) {
    console.log(`Color: RGB(${para.color.r}, ${para.color.g}, ${para.color.b})`);
  }
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Working with Text Line Properties

Text lines also expose color and other properties:

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    lines = pdf.page(0).select_lines()

    for line in lines:
        print(f"Line text: {line.text}")
        if line.color:
            print(f"  Color: RGB({line.color.r}, {line.color.g}, {line.color.b})")
        if line.font_name:
            print(f"  Font: {line.font_name} {line.font_size}pt")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);
const lines = await pdf.page(0).selectLines();

for (const line of lines) {
  console.log(`Line text: ${line.text}`);
  if (line.color) {
    console.log(`  Color: RGB(${line.color.r}, ${line.color.g}, ${line.color.b})`);
  }
  if (line.fontName) {
    console.log(`  Font: ${line.fontName} ${line.fontSize}pt`);
  }
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Text Status Information

Text objects include status information that indicates whether they have been modified, whether the text is encodable with the current font, and font recommendations:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    paragraphs = pdf.page(0).select_paragraphs()

    for para in paragraphs:
        if para.status:
            # Check if text was modified
            print(f"Modified: {para.status.is_modified()}")

            # Check if text is encodable with current font
            print(f"Encodable: {para.status.is_encodable()}")

            # Get font type classification
            font_type = para.status.get_font_type()
            print(f"Font type: {font_type.value}")  # SYSTEM, STANDARD, or EMBEDDED

            # Get font recommendation with similarity score
            recommendation = para.status.get_font_recommendation()
            print(f"Recommended font: {recommendation.get_font_name()}")
            print(f"Similarity score: {recommendation.get_similarity_score()}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);
const paragraphs = await pdf.page(0).selectParagraphs();

for (const para of paragraphs) {
  if (para.status) {
    // Check if text was modified
    console.log(`Modified: ${para.status.isModified()}`);

    // Check if text is encodable with current font
    console.log(`Encodable: ${para.status.isEncodable()}`);

    // Get font type classification
    const fontType = para.status.getFontType();
    console.log(`Font type: ${fontType}`);  // SYSTEM, STANDARD, or EMBEDDED

    // Get font recommendation with similarity score
    const recommendation = para.status.getFontRecommendation();
    console.log(`Recommended font: ${recommendation.getFontName()}`);
    console.log(`Similarity score: ${recommendation.getSimilarityScore()}`);
  }
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

**Font Type Classifications:**
- `SYSTEM`: Font available from the operating system
- `STANDARD`: One of the 14 standard PDF fonts (Helvetica, Times-Roman, Courier, etc.)
- `EMBEDDED`: Font embedded in the PDF file

---

## Adding Paragraphs

### Basic Paragraph with Standard Font

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, StandardFonts, Color

with PDFDancer.open("document.pdf") as pdf:
    # Add a simple paragraph with standard font
    pdf.new_paragraph() \
        .text("Standard Font Test\nHelvetica Bold") \
        .font(StandardFonts.HELVETICA_BOLD.value, 16) \
        .line_spacing(1.2) \
        .color(Color(255, 0, 0)) \
        .at(0, 100, 100) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Add a simple paragraph with standard font
await pdf.page(0).newParagraph()
  .text('Standard Font Test\nHelvetica Bold')
  .font('Helvetica-Bold', 16)
  .lineSpacing(1.2)
  .color(new Color(255, 0, 0))
  .at(100, 100)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Adding to Specific Page

You can add paragraphs directly to a specific page using two syntaxes:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, StandardFonts

with PDFDancer.open("document.pdf") as pdf:
    # Method 1: Specify page index in at()
    pdf.new_paragraph() \
        .text("Times Roman Test") \
        .font(StandardFonts.TIMES_ROMAN.value, 14) \
        .at(0, 150, 150) \
        .add()

    # Method 2: Use page() to scope the builder
    pdf.page(0).new_paragraph() \
        .text("Awesomely\nObvious!") \
        .font("Roboto-Regular", 14) \
        .line_spacing(0.7) \
        .at(300.1, 500) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Add to specific page
await pdf.page(0).newParagraph()
  .text('Times Roman Test')
  .font('Times-Roman', 14)
  .at(150, 150)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Multi-line Paragraph with Courier

Monospace fonts like Courier are perfect for code examples:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, StandardFonts

with PDFDancer.open("document.pdf") as pdf:
    # Add multi-line code example with Courier
    pdf.new_paragraph() \
        .text("Courier Monospace\nCode Example") \
        .font(StandardFonts.COURIER_BOLD.value, 12) \
        .line_spacing(1.5) \
        .at(0, 200, 200) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Add multi-line code example with Courier
await pdf.page(0).newParagraph()
  .text('Courier Monospace\nCode Example')
  .font('Courier-Bold', 12)
  .lineSpacing(1.5)
  .at(200, 200)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Using Custom TTF Fonts

You can use custom TrueType fonts directly without pre-registration:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer, Color

with PDFDancer.open("document.pdf") as pdf:
    # Use custom font file directly
    ttf_path = Path("fonts/DancingScript-Regular.ttf")

    pdf.new_paragraph() \
        .text("Awesomely\nObvious!") \
        .font_file(ttf_path, 24) \
        .line_spacing(1.8) \
        .color(Color(0, 0, 255)) \
        .at(0, 300.1, 500) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';
import { promises as fs } from 'node:fs';

const pdf = await PDFDancer.open(pdfBytes);

// Use custom font file directly
const fontBytes = await fs.readFile('fonts/DancingScript-Regular.ttf');

await pdf.page(0).newParagraph()
  .text('Awesomely\nObvious!')
  .fontFile(fontBytes, 24)
  .lineSpacing(1.8)
  .color(new Color(0, 0, 255))
  .at(300.1, 500)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Using Service Fonts with find_fonts()

You can search for fonts available on the PDFDancer service:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Find fonts matching "Roboto" at size 14
    fonts = pdf.find_fonts("Roboto", 14)

    if fonts:
        # Use the first match (e.g., "Roboto-Regular")
        roboto = fonts[0]
        print(f"Using: {roboto.name} at {roboto.size}pt")

        pdf.new_paragraph() \
            .text("Awesomely\nObvious!") \
            .font(roboto.name, roboto.size) \
            .line_spacing(0.7) \
            .at(0, 300.1, 500) \
            .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// TypeScript uses font names directly
const pdf = await PDFDancer.open(pdfBytes);

await pdf.page(0).newParagraph()
  .text('Text with service font')
  .font('Roboto-Regular', 14)
  .lineSpacing(0.7)
  .at(300.1, 500)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Editing Paragraphs

### Basic Text Replacement

The simplest way to edit a paragraph is to replace its text content. Edit operations return a `CommandResult` object that provides detailed information about the operation:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Find a paragraph by text prefix
    paragraph = pdf.page(0).select_paragraphs_starting_with("The Complete")[0]

    # Replace just the text (keeps position, font, etc.)
    result = paragraph.edit().replace("Awesomely\nObvious!").apply()

    # Check the result
    print(f"Success: {result.success}")
    print(f"Command: {result.command_name}")
    if result.warning:
        print(f"Warning: {result.warning}")

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Find a paragraph by text prefix
const paragraphs = await pdf.page(0).selectParagraphsStartingWith('The Complete');

if (paragraphs.length > 0) {
  // Replace just the text (keeps position, font, etc.)
  const result = await paragraphs[0].edit()
    .replace('Awesomely\nObvious!')
    .apply();

  // Check the result
  console.log(`Success: ${result.success}`);
  console.log(`Command: ${result.commandName}`);
  if (result.warning) {
    console.log(`Warning: ${result.warning}`);
  }
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

**CommandResult Properties:**
- `success` (boolean): Whether the operation succeeded
- `commandName` (string): Name of the operation performed (e.g., "ModifyParagraph", "ModifyTextLine")
- `elementId` (string | null): ID of the modified element
- `message` (string | null): Optional informational message
- `warning` (string | null): Optional warning message (e.g., when modifying text with embedded fonts)

### Visual Example: Text Replacement

<table>
<tr>
<td width="50%">

**Before**

![Original PDF with "Executive Summary" heading](/img/placeholders/text-edit-before.png)

</td>
<td width="50%">

**After**

![Modified PDF with "Overview" heading](/img/placeholders/text-edit-after.png)

</td>
</tr>
</table>

:::info Visual Asset Needed
**Images:** `text-edit-before.png` and `text-edit-after.png`
**Shows:** Side-by-side comparison of a paragraph before and after text replacement, highlighting the changed content.
**Details:** See `/static/img/placeholders/README.md` for full specifications.
:::

:::tip Python Context Manager Pattern
Python supports using edit operations with context managers for automatic application:

```python
with PDFDancer.open("document.pdf") as pdf:
    paragraph = pdf.page(0).select_paragraphs_starting_with("The Complete")[0]

    # Context manager automatically calls apply() on success
    with paragraph.edit() as editor:
        editor.replace("Awesomely\nObvious!")
        editor.font("Helvetica", 12)

    pdf.save("output.pdf")
```

This pattern automatically applies changes when the context exits successfully, or discards them if an exception occurs.
:::

### Editing Text Without Changing Position

When you edit text without specifying a new position, the paragraph stays in its original location:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    paragraph = pdf.page(0).select_paragraphs_starting_with("The Complete")[0]
    original_x = paragraph.position.x()
    original_y = paragraph.position.y()

    # Edit text and font, keeping original position
    paragraph.edit() \
        .replace("Awesomely\nObvious!") \
        .font("Helvetica", 12) \
        .line_spacing(0.7) \
        .apply()

    # Verify position unchanged
    new_para = pdf.page(0).select_paragraphs_starting_with("Awesomely")[0]
    assert new_para.position.x() == original_x
    assert new_para.position.y() == original_y

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);
const paragraphs = await pdf.page(0).selectParagraphsStartingWith('The Complete');

if (paragraphs.length > 0) {
  const paragraph = paragraphs[0];
  const originalX = paragraph.position.x;
  const originalY = paragraph.position.y;

  // Edit text and font, keeping original position
  await paragraph.edit()
    .replace('Awesomely\nObvious!')
    .font('Helvetica', 12)
    .lineSpacing(0.7)
    .apply();

  const newPara = (await pdf.page(0).selectParagraphsStartingWith('Awesomely'))[0];
  console.log(`Position unchanged: ${newPara.position.x}, ${newPara.position.y}`);
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Visual Example: Position Stays the Same

When you edit text without specifying a new position, PDFDancer keeps the element in its original location:

![Comparison showing text changed but coordinates remain the same](/img/placeholders/text-position-unchanged.png)

:::info Visual Asset Needed
**Image:** `text-position-unchanged.png`
**Shows:** Side-by-side or overlay comparison demonstrating that when editing text content, the X,Y coordinates remain constant. Include coordinate indicators showing position is unchanged.
**Details:** See `/static/img/placeholders/README.md` for full specifications.
:::

### Chaining Multiple Edits

You can chain multiple edits together, including text, font, color, spacing, and position:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    paragraph = pdf.page(0).select_paragraphs_starting_with("The Complete")[0]

    # Chain multiple edits: text, font, spacing, AND position
    paragraph.edit() \
        .replace("Awesomely\nObvious!") \
        .font("Helvetica", 12) \
        .line_spacing(0.7) \
        .move_to(300.1, 500) \
        .apply()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);
const paragraphs = await pdf.page(0).selectParagraphsStartingWith('The Complete');

if (paragraphs.length > 0) {
  // Chain multiple edits: text, font, spacing, AND position
  await paragraphs[0].edit()
    .replace('Awesomely\nObvious!')
    .font('Helvetica', 12)
    .lineSpacing(0.7)
    .moveTo(300.1, 500)
    .apply();
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Changing Only Font

You can change just the font without modifying the text content:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    paragraph = pdf.page(0).select_paragraphs_starting_with("The Complete")[0]

    # Change only the font, keep everything else
    paragraph.edit() \
        .font("Helvetica", 28) \
        .apply()

    # Verify font changed
    line = pdf.page(0).select_text_lines_starting_with("The Complete")[0]
    assert line.object_ref().font_name == "Helvetica"
    assert line.object_ref().font_size == 28

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);
const paragraphs = await pdf.page(0).selectParagraphsStartingWith('The Complete');

if (paragraphs.length > 0) {
  // Change only the font, keep everything else
  await paragraphs[0].edit()
    .font('Helvetica', 28)
    .apply();
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Moving Paragraphs

### Move to New Coordinates

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    paragraph = pdf.page(0).select_paragraphs_starting_with("The Complete")[0]

    # Move to new coordinates
    paragraph.move_to(0.1, 300)

    # Verify new position
    moved = pdf.page(0).select_paragraphs_at(0.1, 300)[0]
    assert moved is not None

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);
const paragraphs = await pdf.page(0).selectParagraphsStartingWith('The Complete');

if (paragraphs.length > 0) {
  // Move to new coordinates
  await paragraphs[0].moveTo(0.1, 300);

  // Verify new position
  const moved = (await pdf.page(0).selectParagraphsAt(0.1, 300))[0];
  console.log(`Moved paragraph found: ${moved !== undefined}`);
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Move Only (Using Edit)

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    paragraph = pdf.page(0).select_paragraphs_starting_with("The Complete")[0]

    # Move using edit builder
    paragraph.edit() \
        .move_to(1, 1) \
        .apply()

    # Verify new position
    new_para = pdf.page(0).select_paragraphs_starting_with("The Complete")[0]
    assert new_para.position.x() == 1
    assert new_para.position.y() == 1

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);
const paragraphs = await pdf.page(0).selectParagraphsStartingWith('The Complete');

if (paragraphs.length > 0) {
  // Move using edit builder
  await paragraphs[0].edit()
    .moveTo(1, 1)
    .apply();
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Visual Example: Moving Paragraphs

See how a paragraph moves from one position to another with precise coordinate control:

![Before and after showing paragraph moved from original position to new coordinates](/img/placeholders/text-move-comparison.png)

:::info Visual Asset Needed
**Image:** `text-move-comparison.png`
**Shows:** Before/after comparison with coordinate annotations. Draw arrow from old position to new position, label old coordinates and new coordinates.
**Details:** See `/static/img/placeholders/README.md` for full specifications.
:::

---

## Deleting Paragraphs

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Find and delete a paragraph
    paragraph = pdf.page(0).select_paragraphs_starting_with("The Complete")[0]
    paragraph.delete()

    # Verify deletion
    remaining = pdf.page(0).select_paragraphs_starting_with("The Complete")
    assert remaining == []

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Find and delete a paragraph
const paragraphs = await pdf.page(0).selectParagraphsStartingWith('The Complete');

if (paragraphs.length > 0) {
  await paragraphs[0].delete();

  // Verify deletion
  const remaining = await pdf.page(0).selectParagraphsStartingWith('The Complete');
  console.log(`Remaining paragraphs: ${remaining.length}`);
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Selecting Text Lines

Text lines provide finer-grained control than paragraphs.

### All Text Lines

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Get all text lines across the document
    all_lines = pdf.select_lines()

    # Get all text lines on a specific page
    page_lines = pdf.page(0).select_lines()

    for line in page_lines:
        print(f"Line: {line.text}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Get all text lines across the document
const allLines = await pdf.selectLines();

// Get all text lines on a specific page
const pageLines = await pdf.page(0).selectLines();

for (const line of pageLines) {
  console.log(`Line: ${line.text}`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Text Lines by Prefix

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Find text lines starting with specific text
    lines = pdf.page(0).select_text_lines_starting_with("Date:")

    if lines:
        print(f"Found date line: {lines[0].text}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Find text lines starting with specific text
const lines = await pdf.page(0).selectTextLinesStartingWith('Date:');

if (lines.length > 0) {
  console.log(`Found date line: ${lines[0].text}`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Next Steps

- [**Working with Fonts**](working-with-fonts.md) – Learn about standard and custom fonts
- [**Positioning**](positioning.md) – Understand PDF coordinate systems
- [**Cookbook**](cookbook.md) – See complete working examples
