---
id: working-with-pages
title: Working with Pages
description: Learn how to access, iterate, inspect, and manipulate PDF pages.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

PDFDancer provides a straightforward API for working with PDF pages. You can access individual pages, iterate through all pages, get page information, and delete pages.

---

## Accessing Pages

### Get a Specific Page

Pages are zero-indexed, so the first page is page 0.

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Get the first page (0-indexed)
    first_page = pdf.page(0)

    # Get the second page
    second_page = pdf.page(1)

    # Get the last page (if you know the total count)
    last_page = pdf.page(4)  # For a 5-page document
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Get the first page (0-indexed)
const firstPage = pdf.page(0);

// Get the second page
const secondPage = pdf.page(1);

// Get the last page (if you know the total count)
const lastPage = pdf.page(4);  // For a 5-page document
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Get All Pages

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Get all pages
    all_pages = pdf.pages()

    # Iterate through pages
    for i, page in enumerate(all_pages):
        print(f"Page {i}: {page.internal_id}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Get all pages
const allPages = await pdf.pages();

// Iterate through pages
for (const [i, page] of allPages.entries()) {
  const pageData = await page.get();
  console.log(`Page ${i}: ${pageData.internalId}`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Page Information

### Getting Page Properties

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    page = pdf.page(0)

    print(f"Page ID: {page.internal_id}")
    print(f"Position: {page.position.bounding_rect}")
    print(f"Type: {page.object_type}")

    # Get bounding box dimensions
    bbox = page.position.bounding_rect
    print(f"Width: {bbox.get('width')}")
    print(f"Height: {bbox.get('height')}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);
const page = await pdf.page(0).get();

console.log(`Page ID: ${page.internalId}`);
console.log(`Position: ${JSON.stringify(page.position.boundingRect)}`);
console.log(`Type: ${page.objectType}`);

// Get bounding box dimensions
const bbox = page.position.boundingRect;
console.log(`Width: ${bbox?.width}`);
console.log(`Height: ${bbox?.height}`);
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Deleting Pages

### Delete a Single Page

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Delete the third page (index 2)
    pdf.page(2).delete()

    # Save the modified PDF
    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Delete the third page (index 2)
await pdf.page(2).delete();

// Save the modified PDF
const modifiedBytes = await pdf.getPdfFile();
await fs.writeFile('output.pdf', modifiedBytes);
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Delete Multiple Pages

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Delete pages 2, 3, and 5 (0-indexed)
    # Delete in reverse order to avoid index shifting
    for page_index in reversed([2, 3, 5]):
        pdf.page(page_index).delete()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Delete pages 2, 3, and 5 (0-indexed)
// Delete in reverse order to avoid index shifting
for (const pageIndex of [5, 3, 2]) {
  await pdf.page(pageIndex).delete();
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Working with Page Content

Once you have a page reference, you can select and manipulate content on that page.

### Selecting Content on a Page

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    page = pdf.page(0)

    # Select paragraphs on this page
    paragraphs = page.select_paragraphs()

    # Select images on this page
    images = page.select_images()

    # Select form fields on this page
    fields = page.select_form_fields()

    # Select text lines on this page
    lines = page.select_lines()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);
const page = pdf.page(0);

// Select paragraphs on this page
const paragraphs = await page.selectParagraphs();

// Select images on this page
const images = await page.selectImages();

// Select form fields on this page
const fields = await page.selectFormFields();

// Select text lines on this page
const lines = await page.selectLines();
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Adding Content to a Page

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color

with PDFDancer.open("document.pdf") as pdf:
    # Add a paragraph to a specific page
    pdf.new_paragraph() \
        .text("New paragraph on page 1") \
        .font("Helvetica", 12) \
        .at(page_index=0, x=100, y=500) \
        .add()

    # Or use page reference
    page = pdf.page(0)
    page.new_paragraph() \
        .text("Another paragraph") \
        .at(x=100, y=400) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Add a paragraph to a specific page
await pdf.page(0).newParagraph()
  .text('New paragraph on page 1')
  .font('Helvetica', 12)
  .at(100, 500)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Iterating Through Pages

### Process All Pages

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    all_pages = pdf.pages()

    for i, page in enumerate(all_pages):
        print(f"Processing page {i}")

        # Get page information
        print(f"  Internal ID: {page.internal_id}")

        # Select content on this page
        paragraphs = page.select_paragraphs()
        print(f"  Paragraphs: {len(paragraphs)}")

        images = page.select_images()
        print(f"  Images: {len(images)}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);
const allPages = await pdf.pages();

for (const [i, page] of allPages.entries()) {
  console.log(`Processing page ${i}`);

  // Get page information
  const pageData = await page.get();
  console.log(`  Internal ID: ${pageData.internalId}`);

  // Select content on this page
  const paragraphs = await page.selectParagraphs();
  console.log(`  Paragraphs: ${paragraphs.length}`);

  const images = await page.selectImages();
  console.log(`  Images: ${images.length}`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Next Steps

- [**Working with Text**](working-with-text.md) – Select and manipulate text content
- [**Working with Images**](working-with-images.md) – Add and modify images
- [**Working with AcroForms**](working-with-acroforms.md) – Fill and edit form fields
- [**Examples**](cookbook.md) – See complete working examples
