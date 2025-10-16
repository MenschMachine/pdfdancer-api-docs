---
id: selecting-content
title: Selecting PDF Content
description: Learn how to find and select paragraphs, images, text lines, forms, and paths in PDFs.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

PDFDancer provides powerful selectors to find content within PDFs. You can search by page, coordinates, text content, or field names.

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

## Selecting Images

### All Images

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Get all images across the document
    all_images = pdf.select_images()

    # Get all images on a specific page
    page_images = pdf.page(0).select_images()

    for img in page_images:
        print(f"Image ID: {img.internal_id}")
        print(f"Position: {img.position.bounding_rect}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Get all images across the document
const allImages = await pdf.selectImages();

// Get all images on a specific page
const pageImages = await pdf.page(0).selectImages();

for (const img of pageImages) {
  console.log(`Image ID: ${img.internalId}`);
  console.log(`Position: ${JSON.stringify(img.position.boundingRect)}`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Images at Coordinates

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Find images at specific coordinates
    images = pdf.page(2).select_images_at(x=120, y=300)

    for img in images:
        print(f"Found image at position: {img.position}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Find images at specific coordinates
const images = await pdf.page(2).selectImagesAt(120, 300);

for (const img of images) {
  console.log(`Found image at position: ${img.position}`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Selecting Form Fields

### All Form Fields

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("form.pdf") as pdf:
    # Get all form fields across the document
    all_fields = pdf.select_form_fields()

    # Get all form fields on a specific page
    page_fields = pdf.page(1).select_form_fields()

    for field in page_fields:
        print(f"Field: {field.name}, Type: {field.object_type}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Get all form fields across the document
const allFields = await pdf.selectFormFields();

// Get all form fields on a specific page
const pageFields = await pdf.page(1).selectFormFields();

for (const field of pageFields) {
  console.log(`Field: ${field.name}, Type: ${field.objectType}`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Form Fields by Name

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("form.pdf") as pdf:
    # Find form fields by name
    first_name_fields = pdf.select_form_fields_by_name("firstName")

    # On a specific page
    page_fields = pdf.page(0).select_form_fields_by_name("signature")

    if first_name_fields:
        print(f"Found field: {first_name_fields[0].name}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Find form fields by name
const firstNameFields = await pdf.selectFieldsByName('firstName');

if (firstNameFields.length > 0) {
  console.log(`Found field: ${firstNameFields[0].name}`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Selecting Paths

Paths are vector graphics elements in PDFs (lines, shapes, drawings).

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Get all paths on a specific page
    paths = pdf.page(3).select_paths()

    # Get paths at specific coordinates
    paths_at_point = pdf.page(3).select_paths_at(x=150, y=320)

    for path in paths:
        print(f"Path ID: {path.internal_id}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Get all paths on a specific page
const paths = await pdf.page(3).selectPaths();

// Get paths at specific coordinates
const pathsAtPoint = await pdf.page(3).selectPathsAt(150, 320);

for (const path of paths) {
  console.log(`Path ID: ${path.internalId}`);
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
- [**Examples**](examples.md) – See complete working examples
