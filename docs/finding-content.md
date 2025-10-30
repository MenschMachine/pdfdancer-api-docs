---
id: finding-content
title: Finding Content
description: Learn how to locate and select content in PDFs using all available selection methods.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

PDFDancer provides powerful selection methods to find content in your PDF documents. You can select all elements of a type, find elements at specific positions, or search by text content. All selection methods work at both document and page level.

---

## Document-Level vs Page-Level Selection

Every selection method can search across the entire document or limit to a specific page:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Document-level: searches ALL pages
    all_paragraphs = pdf.select_paragraphs()

    # Page-level: searches only page 0
    page_paragraphs = pdf.page(0).select_paragraphs()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Document-level: searches ALL pages
const allParagraphs = await pdf.selectParagraphs();

// Page-level: searches only page 0
const pageParagraphs = await pdf.page(0).selectParagraphs();
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## 1. Select All Elements

Get all elements of a specific type from the document or page.

### Available Content Types

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Text content
    all_paragraphs = pdf.select_paragraphs()
    all_lines = pdf.select_text_lines()  # or select_lines()

    # Visual content
    all_images = pdf.select_images()
    all_paths = pdf.select_paths()  # vector graphics
    all_forms = pdf.select_forms()  # form XObjects (templates, watermarks)

    # Interactive content
    all_fields = pdf.select_form_fields()  # AcroForm fields

    # Page-scoped selections
    page_paragraphs = pdf.page(0).select_paragraphs()
    page_images = pdf.page(1).select_images()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Text content
const allParagraphs = await pdf.selectParagraphs();
const allLines = await pdf.selectTextLines();  // or selectLines()

// Visual content
const allImages = await pdf.selectImages();
const allPaths = await pdf.selectPaths();  // vector graphics
const allForms = await pdf.selectForms();  // form XObjects (templates, watermarks)

// Interactive content
const allFields = await pdf.selectFormFields();  // AcroForm fields

// Page-scoped selections
const pageParagraphs = await pdf.page(0).selectParagraphs();
const pageImages = await pdf.page(1).selectImages();
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Select All Elements (Convenience Method)

Use `select_elements()` to get all content types at once:

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Get all elements in the entire document
    # Returns paragraphs, text lines, images, paths, forms, and form fields
    all_elements = pdf.select_elements()

    # Get all elements on a specific page
    page_elements = pdf.page(0).select_elements()

    # Process all elements
    for element in page_elements:
        print(f"Type: {element.object_type}, Position: ({element.position.x}, {element.position.y})")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Get all elements in the entire document
// Returns paragraphs, text lines, images, paths, forms, and form fields
const allElements = await pdf.selectElements();

// Get all elements on a specific page
const pageElements = await pdf.page(0).selectElements();

// Process all elements
for (const element of pageElements) {
  console.log(`Type: ${element.type}, Position: (${element.position.x}, ${element.position.y})`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Working with Selected Elements

All selection methods return lists/arrays of typed objects with methods and properties:

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Select and inspect
    paragraphs = pdf.page(0).select_paragraphs()
    for para in paragraphs:
        print(f"Text: {para.text}")
        print(f"Font: {para.font_name} at {para.font_size}pt")
        print(f"Position: ({para.position.x()}, {para.position.y()})")

    # Select and manipulate
    images = pdf.select_images()
    for img in images:
        print(f"Image at ({img.position.x()}, {img.position.y()})")
        # Objects have .delete(), .move_to(), etc.

    # Select and check form fields
    fields = pdf.select_form_fields()
    for field in fields:
        print(f"{field.field_name}: {field.value}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Select and inspect
const paragraphs = await pdf.page(0).selectParagraphs();
for (const para of paragraphs) {
  console.log(`Text: ${para.text}`);
  console.log(`Font: ${para.fontName} at ${para.fontSize}pt`);
  console.log(`Position: (${para.position.x}, ${para.position.y})`);
}

// Select and manipulate
const images = await pdf.selectImages();
for (const img of images) {
  console.log(`Image at (${img.position.x}, ${img.position.y})`);
  // Objects have .delete(), .moveTo(), etc.
}

// Select and check form fields
const fields = await pdf.selectFormFields();
for (const field of fields) {
  console.log(`${field.fieldName}: ${field.value}`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Visual Example: Selecting All Elements

![PDF showing multiple paragraphs, images, and form fields being selected](/img/placeholders/finding-content-select-all.png)

:::info Visual Asset Needed
**Image:** `finding-content-select-all.png` (optional - not in original README, but useful)
**Shows:** PDF page with multiple elements highlighted/outlined, demonstrating how `select_paragraphs()` or `select_images()` finds all elements of a type on a page.
**Details:** Create if time permits. Shows the scope of selection methods.
:::

---

## 2. Select by Position

Find elements at specific x, y coordinates on a page. Useful when you know the layout structure.

### Selecting at Coordinates

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Find paragraphs at specific coordinates
    header = pdf.page(0).select_paragraphs_at(x=72, y=750)

    # Find images at logo position
    logo = pdf.page(0).select_images_at(x=50, y=750)

    # Find form fields at signature area
    signature = pdf.page(2).select_form_fields_at(x=150, y=100)

    # Find paths (vector graphics) at specific position
    lines = pdf.page(0).select_paths_at(x=200, y=400)

    # Find form XObjects at watermark position
    watermark = pdf.page(0).select_forms_at(x=300, y=400)

    # Find text lines at specific coordinates
    date_line = pdf.page(0).select_text_lines_at(x=500, y=750)
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Find paragraphs at specific coordinates
const header = await pdf.page(0).selectParagraphsAt(72, 750);

// Find images at logo position
const logo = await pdf.page(0).selectImagesAt(50, 750);

// Find form fields at signature area
const signature = await pdf.page(2).selectFormFieldsAt(150, 100);

// Find paths (vector graphics) at specific position
const lines = await pdf.page(0).selectPathsAt(200, 400);

// Find form XObjects at watermark position
const watermark = await pdf.page(0).selectFormsAt(300, 400);

// Find text lines at specific coordinates
const dateLine = await pdf.page(0).selectTextLinesAt(500, 750);
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Practical Example: Fixed Layout Documents

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("invoice.pdf") as pdf:
    # Invoice header is always at (72, 750)
    header = pdf.page(0).select_paragraphs_at(72, 750)
    if header:
        print(f"Invoice: {header[0].text}")

    # Total amount always at (450, 150)
    total = pdf.page(0).select_paragraphs_at(450, 150)
    if total:
        print(f"Total: {total[0].text}")

    # Company logo always at (50, 750)
    logo = pdf.page(0).select_images_at(50, 750)
    if logo:
        print(f"Found logo at expected position")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Invoice header is always at (72, 750)
const header = await pdf.page(0).selectParagraphsAt(72, 750);
if (header.length > 0) {
  console.log(`Invoice: ${header[0].text}`);
}

// Total amount always at (450, 150)
const total = await pdf.page(0).selectParagraphsAt(450, 150);
if (total.length > 0) {
  console.log(`Total: ${total[0].text}`);
}

// Company logo always at (50, 750)
const logo = await pdf.page(0).selectImagesAt(50, 750);
if (logo.length > 0) {
  console.log('Found logo at expected position');
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Visual Example: Coordinate-Based Selection

See how PDFDancer finds elements at specific X,Y coordinates:

![PDF with coordinate point (crosshair) and highlighted elements that intersect](/img/placeholders/finding-content-by-coordinates.png)

:::info Visual Asset Needed
**Image:** `finding-content-by-coordinates.png`
**Shows:** PDF with multiple elements (text, images). Show a coordinate point (e.g., crosshair at x:150, y:320). Highlight all elements that intersect with that point. Include coordinate labels and selection indicators.
**Details:** See `/static/img/placeholders/README.md` for full specifications.
:::

---

## 3. Select by Content

Search for text elements by their content using text matching or regular expressions.

### Select by Text Prefix

Find paragraphs or text lines that start with specific text. You can search across the entire document or limit the search to a specific page.

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("invoice.pdf") as pdf:
    # Document-level search (searches all pages)
    invoices = pdf.select_paragraphs_starting_with("Invoice #")
    totals = pdf.select_paragraphs_starting_with("Total:")
    disclaimers = pdf.select_paragraphs_starting_with("Note:")

    # Find text lines by prefix across all pages
    date_lines = pdf.select_text_lines_starting_with("Date:")
    amount_lines = pdf.select_text_lines_starting_with("Amount:")

    # Page-scoped prefix search (only searches specific page)
    page_headers = pdf.page(0).select_paragraphs_starting_with("Executive Summary")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Document-level search (searches all pages)
const invoices = await pdf.selectParagraphsStartingWith('Invoice #');
const totals = await pdf.selectParagraphsStartingWith('Total:');
const disclaimers = await pdf.selectParagraphsStartingWith('Note:');

// Find text lines by prefix across all pages
const dateLines = await pdf.selectTextLinesStartingWith('Date:');
const amountLines = await pdf.selectTextLinesStartingWith('Amount:');

// Page-scoped prefix search (only searches specific page)
const pageHeaders = await pdf.page(0).selectParagraphsStartingWith('Executive Summary');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Visual Example: Text-Based Selection

Finding content by text prefix is one of the most common selection methods:

![PDF showing paragraph starting with "Invoice #" being located and highlighted](/img/placeholders/finding-content-by-text.png)

:::info Visual Asset Needed
**Image:** `finding-content-by-text.png`
**Shows:** PDF page with multiple paragraphs. Highlight the found paragraph (e.g., one starting with "Invoice #"). Show search indicator or magnifying glass icon. Optionally show the bounding box of the found element.
**Details:** See `/static/img/placeholders/README.md` for full specifications.
:::

### Select by Pattern (Regex)

Use regular expressions to find text matching complex patterns. Pattern matching works at both document and page levels.

<Tabs>
  <TabItem value="python" label="Python">

```python
import re

with PDFDancer.open("document.pdf") as pdf:
    # Document-level pattern matching (searches all pages)
    # Find dates in format YYYY-MM-DD
    dates = pdf.select_paragraphs_matching(r"\d{4}-\d{2}-\d{2}")

    # Find email addresses
    emails = pdf.select_paragraphs_matching(r"[\w\.-]+@[\w\.-]+\.\w+")

    # Find dollar amounts
    prices = pdf.select_paragraphs_matching(r"\$\d+\.\d{2}")

    # Find phone numbers
    phones = pdf.select_text_lines_matching(r"\(\d{3}\) \d{3}-\d{4}")

    # Find ZIP codes
    zips = pdf.select_text_lines_matching(r"\d{5}(-\d{4})?")

    # Find invoice numbers (custom pattern)
    invoice_nums = pdf.select_paragraphs_matching(r"INV-\d{6}")

    # Page-scoped pattern matching (only searches specific page)
    page_dates = pdf.page(0).select_paragraphs_matching(r"\d{4}-\d{2}-\d{2}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Document-level pattern matching (searches all pages)
// Find dates in format YYYY-MM-DD
const dates = await pdf.selectParagraphsMatching('\\d{4}-\\d{2}-\\d{2}');

// Find email addresses
const emails = await pdf.selectParagraphsMatching('[\\w\\.-]+@[\\w\\.-]+\\.\\w+');

// Find dollar amounts
const prices = await pdf.selectParagraphsMatching('\\$\\d+\\.\\d{2}');

// Find phone numbers
const phones = await pdf.selectTextLinesMatching('\\(\\d{3}\\) \\d{3}-\\d{4}');

// Find ZIP codes
const zips = await pdf.selectTextLinesMatching('\\d{5}(-\\d{4})?');

// Find invoice numbers (custom pattern)
const invoiceNums = await pdf.selectParagraphsMatching('INV-\\d{6}');

// Page-scoped pattern matching (only searches specific page)
const pageDates = await pdf.page(0).selectParagraphsMatching('\\d{4}-\\d{2}-\\d{2}');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Select by Field Name

For form fields, you can select by the field's name:

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("form.pdf") as pdf:
    # Find specific form fields by name
    signature_fields = pdf.select_form_fields_by_name("signature")
    name_fields = pdf.select_form_fields_by_name("applicant_name")
    date_fields = pdf.select_form_fields_by_name("application_date")

    # Check and modify field values
    if signature_fields:
        sig = signature_fields[0]
        print(f"Signature value: {sig.value}")
        sig.edit().value("John Doe").apply()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Find specific form fields by name
const signatureFields = await pdf.selectFormFieldsByName('signature');
const nameFields = await pdf.selectFormFieldsByName('applicant_name');
const dateFields = await pdf.selectFormFieldsByName('application_date');

// Check and modify field values
if (signatureFields.length > 0) {
  const sig = signatureFields[0];
  console.log(`Signature value: ${sig.value}`);
  await sig.fill('John Doe');
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Combining Selection Methods

You can chain and combine selection methods to create powerful queries:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("invoice.pdf") as pdf:
    # Find all invoices on first page
    invoices = pdf.page(0).select_paragraphs_starting_with("Invoice #")

    # Find all dollar amounts
    prices = pdf.select_paragraphs_matching(r"\$\d+\.\d{2}")

    # Find signature field and check if signed
    sig_fields = pdf.select_form_fields_by_name("signature")
    if sig_fields and sig_fields[0].value:
        print("Document is signed")

    # Delete all images on page 2
    for img in pdf.page(2).select_images():
        img.delete()

    pdf.save("processed.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Find all invoices on first page
const invoices = await pdf.page(0).selectParagraphsStartingWith('Invoice #');

// Find all dollar amounts
const prices = await pdf.selectParagraphsMatching('\\$\\d+\\.\\d{2}');

// Find signature field and check if signed
const sigFields = await pdf.selectFormFieldsByName('signature');
if (sigFields.length > 0 && sigFields[0].value) {
  console.log('Document is signed');
}

// Delete all images on page 2
const images = await pdf.page(2).selectImages();
for (const img of images) {
  await img.delete();
}

await pdf.save('processed.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Visual Comparison: Selection Methods

Here's how the three main selection approaches work on the same PDF:

![Three-column comparison showing: text prefix selection, coordinate selection, and select all](/img/placeholders/finding-content-methods-comparison.png)

:::info Visual Asset Needed
**Image:** `finding-content-methods-comparison.png`
**Shows:** Three columns with the same PDF page: (1) Select by text prefix (highlighted paragraph), (2) Select by coordinates (crosshair + highlighted element), (3) Select all on page (all elements outlined). Clear labels for each method.
**Details:** See `/static/img/placeholders/README.md` for full specifications.
:::

---

## Selection Method Summary

### By Content Type

| Content Type | All | By Text/Name | By Pattern | At Coordinates |
|-------------|-----|--------------|------------|----------------|
| **Paragraphs** | `select_paragraphs()` | `select_paragraphs_starting_with()` | `select_paragraphs_matching()` | `select_paragraphs_at()` |
| **Text Lines** | `select_text_lines()` | `select_text_lines_starting_with()` | `select_text_lines_matching()` | `select_text_lines_at()` |
| **Images** | `select_images()` | — | — | `select_images_at()` |
| **Form Fields** | `select_form_fields()` | `select_form_fields_by_name()` | — | `select_form_fields_at()` |
| **Form XObjects** | `select_forms()` | — | — | `select_forms_at()` |
| **Paths** | `select_paths()` | — | — | `select_paths_at()` |

### Scope

All selection methods work at two levels:
- **Document-level**: `pdf.select_*()` - searches across all pages
- **Page-level**: `pdf.page(index).select_*()` - searches only on specified page

---

## Next Steps

- [**Working with Text**](working-with-text.md) – Edit and manipulate selected text
- [**Working with Images**](working-with-images.md) – Manipulate selected images
- [**Working with AcroForms**](working-with-acroforms.md) – Fill and update form fields
- [**Working with Vector Graphics**](working-with-vector-graphics.md) – Work with paths
- [**Positioning**](positioning.md) – Understand coordinate systems for selection
