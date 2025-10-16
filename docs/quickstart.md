---
id: quickstart
title: Quickstart Guide
description: Learn the basics of pixel-perfect PDF editing with PDFDancer.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide introduces the core concepts for working with PDFDancer. You'll learn how to open any PDF, locate elements precisely, edit content at exact positions, and save your modifications.

---

## Opening a PDF Document

<Tabs>
  <TabItem value="python" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer

# From a file path
with PDFDancer.open(pdf_data=Path("document.pdf")) as pdf:
    # Your operations here
    pass

# From bytes
pdf_bytes = Path("document.pdf").read_bytes()
with PDFDancer.open(pdf_data=pdf_bytes) as pdf:
    pass

# Without context manager
pdf = PDFDancer.open(pdf_data="document.pdf")
# ... operations ...
pdf.close()  # Remember to close!
```

The context manager automatically handles session cleanup and is the recommended approach.

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';
import { promises as fs } from 'node:fs';

// From a file
const pdfBytes = await fs.readFile('document.pdf');
const pdf = await PDFDancer.open(pdfBytes);

// From a Uint8Array
const buffer = new Uint8Array(await file.arrayBuffer());
const pdf = await PDFDancer.open(buffer);

// In browsers from a File input
const file = document.querySelector('input[type="file"]').files[0];
const arrayBuffer = await file.arrayBuffer();
const pdf = await PDFDancer.open(new Uint8Array(arrayBuffer));
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Working with Pages

### Accessing Pages

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Get a specific page (0-indexed)
    page = pdf.page(0)

    # Get all pages
    all_pages = pdf.pages()

    # Iterate through pages
    for i, page in enumerate(all_pages):
        print(f"Page {i}: {page.get().internal_id}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Get a specific page (0-indexed)
const page = pdf.page(0);

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

### Getting Page Information

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    page = pdf.page(0).get()

    print(f"Page ID: {page.internal_id}")
    print(f"Position: {page.position.bounding_rect}")
    print(f"Type: {page.object_type}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);
const page = await pdf.page(0).get();

console.log(`Page ID: ${page.internalId}`);
console.log(`Position: ${JSON.stringify(page.position.boundingRect)}`);
console.log(`Type: ${page.objectType}`);
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Deleting Pages

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Delete a specific page
    pdf.page(2).delete()

    # Save the modified PDF
    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Delete a specific page
await pdf.page(2).delete();

// Save the modified PDF
const modifiedBytes = await pdf.getPdfFile();
await fs.writeFile('output.pdf', modifiedBytes);
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Saving PDFs

### Save to File

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("input.pdf") as pdf:
    # Perform operations...

    # Save to file
    pdf.save("output.pdf")

    # Save creates parent directories if needed
    pdf.save("reports/2024/january/output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Perform operations...

// Save to file (Node.js helper)
await pdf.save('output.pdf');

// The save method is a convenience wrapper around:
const bytes = await pdf.getPdfFile();
await fs.writeFile('output.pdf', bytes);
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Get PDF as Bytes

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("input.pdf") as pdf:
    # Perform operations...

    # Get as bytes for further processing
    pdf_bytes = pdf.get_pdf_file()

    # Upload to S3
    s3_client.put_object(Bucket='my-bucket', Key='output.pdf', Body=pdf_bytes)

    # Return in HTTP response
    return Response(pdf_bytes, mimetype='application/pdf')
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Perform operations...

// Get as bytes for further processing
const pdfBytes = await pdf.getPdfFile();

// Upload to S3
await s3Client.putObject({
  Bucket: 'my-bucket',
  Key: 'output.pdf',
  Body: pdfBytes
});

// Return in HTTP response
return new Response(pdfBytes, {
  headers: { 'Content-Type': 'application/pdf' }
});
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Editing Existing Content

### Find and Modify Paragraphs

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color

with PDFDancer.open("invoice.pdf") as pdf:
    # Find all paragraphs on page 0
    paragraphs = pdf.page(0).select_paragraphs()

    # Find paragraphs starting with specific text
    headers = pdf.page(0).select_paragraphs_starting_with("Invoice #")

    if headers:
        # Edit the first header
        headers[0].edit() \
            .replace("Invoice #12345") \
            .font("Helvetica-Bold", 14) \
            .color(Color(255, 0, 0)) \
            .apply()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Find all paragraphs on page 0
const paragraphs = await pdf.page(0).selectParagraphs();

// Find paragraphs starting with specific text
const headers = await pdf.page(0).selectParagraphsStartingWith('Invoice #');

if (headers.length > 0) {
  // Edit the first header
  await headers[0].edit()
    .replace('Invoice #12345')
    .font('Helvetica-Bold', 14)
    .color(new Color(255, 0, 0))
    .apply();
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Add New Content

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
        .line_spacing(1.5) \
        .at(page_index=0, x=100, y=500) \
        .add()

    # Add an image
    pdf.new_image() \
        .from_file("logo.png") \
        .at(page=0, x=50, y=700) \
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
  .lineSpacing(1.5)
  .at(100, 500)
  .apply();

// Add an image
await pdf.newImage()
  .fromFile('logo.png')
  .at(0, 50, 700)
  .add();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Fill Form Fields

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("form.pdf") as pdf:
    # Find form fields by name
    name_fields = pdf.page(0).select_form_fields_by_name("firstName")

    if name_fields:
        # Fill the field
        name_fields[0].edit().value("John Doe").apply()

    # Find all form fields on a page
    all_fields = pdf.page(0).select_form_fields()
    for field in all_fields:
        print(f"Field: {field.name}")

    pdf.save("filled_form.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Find form fields by name
const nameFields = await pdf.selectFieldsByName('firstName');

if (nameFields.length > 0) {
  // Fill the field
  await nameFields[0].fill('John Doe');
}

// Find all form fields
const allFields = await pdf.selectFormFields();
for (const field of allFields) {
  console.log(`Field: ${field.name}`);
}

await pdf.save('filled_form.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Next Steps

- [**Selecting Content**](selecting-content.md) – Learn all the ways to find content in PDFs
- [**Editing Content**](editing-content.md) – Master text and paragraph editing
- [**Adding Content**](adding-content.md) – Add paragraphs, images, and more
- [**Error Handling**](error-handling.md) – Handle exceptions properly
- [**Examples**](examples.md) – See complete working examples
