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

    # Page size and orientation
    print(f"Page size: {page.page_size}")  # or page.size
    print(f"Orientation: {page.orientation}")  # or page.page_orientation

    # Get dimensions from page size
    if page.page_size:
        print(f"Width: {page.page_size.width}")
        print(f"Height: {page.page_size.height}")

    # Get bounding box dimensions (alternative method)
    bbox = page.position.bounding_rect
    print(f"Width: {bbox.get('width')}")
    print(f"Height: {bbox.get('height')}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);
const page = pdf.page(0);

console.log(`Page ID: ${page.internalId}`);
console.log(`Position: ${JSON.stringify(page.position.boundingRect)}`);
console.log(`Type: ${page.type}`);

// Page size and orientation
console.log(`Page size: ${JSON.stringify(page.pageSize)}`);
console.log(`Orientation: ${page.orientation}`);

// Get dimensions from page size
if (page.pageSize) {
  console.log(`Width: ${page.pageSize.width}`);
  console.log(`Height: ${page.pageSize.height}`);
}

// Get bounding box dimensions (alternative method)
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
const modifiedBytes = await pdf.getBytes();
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

## Moving and Reordering Pages

You can move pages to different positions within the document to reorder them.

### Move a Page to a New Position

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Move page 3 to position 0 (make it the first page)
    pdf.move_page(from_page_index=3, to_page_index=0)

    # Alternative: use the page object's move_to method
    page = pdf.page(3)
    page.move_to(0)

    # Move the last page to position 1
    last_page_index = len(pdf.pages()) - 1
    pdf.move_page(last_page_index, 1)

    pdf.save("reordered.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Move page 3 to position 0 (make it the first page)
await pdf.movePage(3, 0);

// Alternative: use the page object's moveTo method
const page = pdf.page(3);
await page.moveTo(0);

// Move the last page to position 1
const pages = await pdf.pages();
const lastPageIndex = pages.length - 1;
await pdf.movePage(lastPageIndex, 1);

await pdf.save('reordered.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

:::tip Page Index Shifting
When you move a page, the indices of other pages shift automatically. If you're moving multiple pages, consider the order of operations to avoid unexpected results.
:::

---

## Adding Pages to Existing Documents

You can add new blank pages to an existing PDF document.

### Add a New Blank Page

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Add a new blank page (appended to the end)
    new_page_ref = pdf.new_page()

    # The new page is now available
    print(f"New page added at index: {new_page_ref.position.page_index}")

    # You can now add content to the new page
    new_page = pdf.page(new_page_ref.position.page_index)
    new_page.new_paragraph() \
        .text("This is content on the new page") \
        .at(100, 700) \
        .create()

    pdf.save("with_new_page.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Add a new blank page (appended to the end)
const newPageRef = await pdf.newPage();

// The new page is now available
console.log(`New page added at index: ${newPageRef.position.pageIndex}`);

// You can now add content to the new page
const newPage = pdf.page(newPageRef.position.pageIndex);
await newPage.newParagraph()
  .text('This is content on the new page')
  .at(100, 700)
  .create();

await pdf.save('with_new_page.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

:::info
The `new_page()` method adds a blank page with default dimensions. To create a new PDF with custom page sizes, see [Creating New PDFs](#creating-new-pdfs).
:::

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

## Creating New PDFs

### Create with Standard Page Sizes

You can create new PDF documents with standard page sizes and orientations.

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

# Create with default A4 portrait
with PDFDancer.create() as pdf:
    pdf.new_paragraph() \
        .text("Hello World") \
        .at(page_index=0, x=72, y=720) \
        .add()
    pdf.save("output.pdf")

# Create with specific page size
with PDFDancer.create(page_size="LETTER", orientation="PORTRAIT", initial_page_count=3) as pdf:
    pdf.save("letter_size.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Orientation } from 'pdfdancer-client-typescript';

// Create with default A4 portrait
const pdf = await PDFDancer.create();
await pdf.page(0).newParagraph()
  .text('Hello World')
  .at(72, 720)
  .apply();
await pdf.save('output.pdf');

// Create with specific page size and orientation
const letterPdf = await PDFDancer.create('LETTER', Orientation.PORTRAIT, 3);
await letterPdf.save('letter_size.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Supported Standard Page Sizes

The following standard page sizes are supported:

- **A4**: 595 x 842 points (default)
- **LETTER**: 612 x 792 points
- **LEGAL**: 612 x 1008 points
- **TABLOID**: 792 x 1224 points
- **A3**: 842 x 1191 points
- **A5**: 420 x 595 points

### Create with Custom Page Sizes

You can also create PDFs with custom page dimensions.

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

# Custom page size with explicit dimensions (in points)
with PDFDancer.create(
    page_size={"width": 600, "height": 800},
    orientation="PORTRAIT"
) as pdf:
    pdf.save("custom_size.pdf")

# Custom named size
with PDFDancer.create(
    page_size={"name": "CUSTOM", "width": 500, "height": 700}
) as pdf:
    pdf.save("named_custom.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Orientation } from 'pdfdancer-client-typescript';

// Custom page size with explicit dimensions (in points)
const pdf = await PDFDancer.create(
  { width: 600, height: 800 },
  Orientation.PORTRAIT
);
await pdf.save('custom_size.pdf');

// Custom named size
const namedPdf = await PDFDancer.create({
  name: 'CUSTOM',
  width: 500,
  height: 700
});
await namedPdf.save('named_custom.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Landscape Orientation

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

# Create A4 landscape
with PDFDancer.create(page_size="A4", orientation="LANDSCAPE") as pdf:
    pdf.save("landscape.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Orientation } from 'pdfdancer-client-typescript';

// Create A4 landscape
const pdf = await PDFDancer.create('A4', Orientation.LANDSCAPE);
await pdf.save('landscape.pdf');
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
