---
id: working-with-text
title: Working with Text
description: Learn how to find, select, and manipulate text content in PDFs including paragraphs and text lines.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

PDFDancer provides powerful selectors to find text content within PDFs. You can search by page, coordinates, or text content.

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

    # Get all paragraphs on a specific page
    page_paragraphs = pdf.page(0).select_paragraphs()

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

// Get all paragraphs on a specific page
const pageParagraphs = await pdf.page(0).selectParagraphs();

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
    page_headers = pdf.page(0).select_paragraphs_starting_with("Total Amount:")

    if page_headers:
        print(f"Found: {page_headers[0].text}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Find paragraphs starting with specific text
const headers = await pdf.selectParagraphsStartingWith('Invoice #');

// On a specific page
const pageHeaders = await pdf.page(0).selectParagraphsStartingWith('Total Amount:');

if (pageHeaders.length > 0) {
  console.log(`Found: ${pageHeaders[0].text}`);
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
from pdfdancer import Position

with PDFDancer.open("document.pdf") as pdf:
    # Find paragraphs at specific coordinates
    paragraphs = pdf.page(0).select_paragraphs_at(x=150, y=320)

    # Using Position helper
    position = Position.at_page_coordinates(page=0, x=150, y=320)
    paragraphs = pdf.select_paragraphs_at(position)

    for para in paragraphs:
        print(f"Paragraph at position: {para.text}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Position } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Find paragraphs at specific coordinates
const paragraphs = await pdf.page(0).selectParagraphsAt(150, 320);

// Using Position helper
const position = Position.atPageCoordinates(0, 150, 320);
const paragraphsAtPos = await pdf.page(0).selectParagraphsAt(
  position.getX()!,
  position.getY()!
);

for (const para of paragraphs) {
  console.log(`Paragraph at position: ${para.text}`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Selecting Text Lines

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

## Working with Position Objects

Position objects help you work with coordinates and bounding rectangles.

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import Position, PositionMode

# Create position at specific coordinates
position = Position.at_page_coordinates(page=0, x=100, y=200)

# Create position with bounding rectangle
position = Position(
    page_number=1,
    bounding_rect={"x": 100, "y": 200, "width": 50, "height": 30},
    mode=PositionMode.INTERSECT
)

# Use position for selection
paragraphs = pdf.select_paragraphs_at(position)
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { Position, PositionMode } from 'pdfdancer-client-typescript';

// Create position at specific coordinates
const position = Position.atPageCoordinates(0, 100, 200);

// Access position properties
const x = position.getX();
const y = position.getY();
const page = position.getPageNumber();

// Use position for selection
const paragraphs = await pdf.page(0).selectParagraphsAt(x!, y!);
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Filtering and Combining Results

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Get all paragraphs
    all_paragraphs = pdf.select_paragraphs()

    # Filter by text content
    invoices = [p for p in all_paragraphs if "Invoice" in p.text]

    # Filter by position
    top_half = [p for p in all_paragraphs
                if p.position.bounding_rect.get("y", 0) > 400]

    # Combine selections from multiple pages
    page_0_paras = pdf.page(0).select_paragraphs()
    page_1_paras = pdf.page(1).select_paragraphs()
    combined = page_0_paras + page_1_paras
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Get all paragraphs
const allParagraphs = await pdf.selectParagraphs();

// Filter by text content
const invoices = allParagraphs.filter(p => p.text?.includes('Invoice'));

// Filter by position
const topHalf = allParagraphs.filter(
  p => (p.position.boundingRect?.y ?? 0) > 400
);

// Combine selections from multiple pages
const page0Paras = await pdf.page(0).selectParagraphs();
const page1Paras = await pdf.page(1).selectParagraphs();
const combined = [...page0Paras, ...page1Paras];
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Next Steps

- [**Editing Content**](editing-content.md) – Learn how to modify selected content
- [**Adding Content**](adding-content.md) – Add new paragraphs and images
- [**Examples**](cookbook.md) – See complete working examples
