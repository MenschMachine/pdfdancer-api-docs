---
id: quickstart
title: Essential Operations
description: Learn the essential operations you'll use in every PDFDancer workflow—opening, saving, editing, and adding content.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide covers the essential operations you'll use in every PDFDancer workflow. Examples progress from simple to complex, introducing new patterns step by step.

---

## Opening a PDF Document

The simplest way to open a PDF:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Your operations here
    pass
```

The `with` statement automatically closes the connection when done.

**Opening from bytes:**

```python
from pathlib import Path

pdf_bytes = Path("document.pdf").read_bytes()
with PDFDancer.open(pdf_data=pdf_bytes) as pdf:
    pass
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');
// Your operations here
```

Always `await` the `open()` call—PDFDancer establishes a session with the service.

**Opening from bytes:**

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';
import { promises as fs } from 'node:fs';

const pdfBytes = await fs.readFile('document.pdf');
const pdf = await PDFDancer.open(pdfBytes);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
PDFDancer pdf = PDFDancer.createSession("document.pdf");
// Your operations here
```

  </TabItem>
</Tabs>

---

## Working with Pages

**Access a specific page (0-indexed):**

<Tabs>
  <TabItem value="python" label="Python">

```python
page = pdf.page(0)
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const page = pdf.page(0);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
Page page = pdf.page(0);
```

  </TabItem>
</Tabs>

**Iterate through all pages:**

<Tabs>
  <TabItem value="python" label="Python">

```python
for page in pdf.pages():
    print(f"Page ID: {page.internal_id}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const allPages = await pdf.pages();
for (const [i, page] of allPages.entries()) {
  console.log(`Page ${i}: ${page.internalId}`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
List<PageRef> allPages = pdf.getPages();
for (PageRef page : allPages) {
    System.out.println("Page ID: " + page.getInternalId());
}
```

  </TabItem>
</Tabs>

**Delete a page:**

<Tabs>
  <TabItem value="python" label="Python">

```python
pdf.page(2).delete()
pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
await pdf.page(2).delete();
await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
pdf.page(2).delete();
pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

---

## Saving PDFs

**Save to a file:**

<Tabs>
  <TabItem value="python" label="Python">

```python
pdf.save("output.pdf")
```

Automatically creates parent directories if needed.

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

**Get PDF as bytes (for streaming, S3 upload, etc.):**

<Tabs>
  <TabItem value="python" label="Python">

```python
pdf_bytes = pdf.get_bytes()
s3_client.put_object(Bucket='my-bucket', Key='output.pdf', Body=pdf_bytes)
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
byte[] pdfBytes = pdf.getFileBytes();
// For S3 upload or streaming:
// s3Client.putObject("my-bucket", "output.pdf", pdfBytes);
```

  </TabItem>
</Tabs>

---

## Editing Existing Content

**Find all paragraphs on a page:**

<Tabs>
  <TabItem value="python" label="Python">

```python
paragraphs = pdf.page(0).select_paragraphs()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const paragraphs = await pdf.page(0).selectParagraphs();
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
List<TextParagraphReference> paragraphs = pdf.page(0).selectParagraphs();
```

  </TabItem>
</Tabs>

**Find paragraphs by text prefix:**

<Tabs>
  <TabItem value="python" label="Python">

```python
headers = pdf.page(0).select_paragraphs_starting_with("Invoice #")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const headers = await pdf.page(0).selectParagraphsStartingWith('Invoice #');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
List<TextParagraphReference> headers = pdf.page(0).selectParagraphsStartingWith("Invoice #");
```

  </TabItem>
</Tabs>

**Replace text (simplest edit):**

<Tabs>
  <TabItem value="python" label="Python">

```python
if headers:
    headers[0].edit().replace("Invoice #12345").apply()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
if (headers.length > 0) {
  await headers[0].edit().replace('Invoice #12345').apply();
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
if (!headers.isEmpty()) {
    headers.get(0).edit().replace("Invoice #12345").apply();
}
```

  </TabItem>
</Tabs>

**Add styling while editing:**

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import Color

headers[0].edit() \
    .replace("Invoice #12345") \
    .font("Helvetica-Bold", 14) \
    .color(Color(255, 0, 0)) \
    .apply()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { Color } from 'pdfdancer-client-typescript';

await headers[0].edit()
  .replace('Invoice #12345')
  .font('Helvetica-Bold', 14)
  .color(new Color(255, 0, 0))
  .apply();
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
if (!headers.isEmpty()) {
    headers.get(0).edit()
        .replace("Invoice #12345")
        .font("Helvetica-Bold", 14)
        .color(new Color(255, 0, 0))
        .apply();
}
```

  </TabItem>
</Tabs>

---

## Adding New Content

**Add a simple paragraph:**

<Tabs>
  <TabItem value="python" label="Python">

```python
pdf.new_paragraph() \
    .text("Hello World") \
    .at(page_index=0, x=100, y=500) \
    .add()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
await pdf.page(0).newParagraph()
  .text('Hello World')
  .at(100, 500)
  .apply();
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
pdf.newParagraph()
    .text("Hello World")
    .at(0, 100, 500)
    .add();
```

  </TabItem>
</Tabs>

**Add a paragraph with styling:**

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import Color

pdf.new_paragraph() \
    .text("Hello World") \
    .font("Helvetica", 12) \
    .color(Color(0, 0, 0)) \
    .line_spacing(1.5) \
    .at(page_index=0, x=100, y=500) \
    .add()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { Color } from 'pdfdancer-client-typescript';

await pdf.page(0).newParagraph()
  .text('Hello World')
  .font('Helvetica', 12)
  .color(new Color(0, 0, 0))
  .lineSpacing(1.5)
  .at(100, 500)
  .apply();
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
pdf.newParagraph()
    .text("Hello World")
    .font("Helvetica", 12)
    .color(new Color(0, 0, 0))
    .lineSpacing(1.5)
    .at(0, 100, 500)
    .add();
```

  </TabItem>
</Tabs>

**Add an image:**

<Tabs>
  <TabItem value="python" label="Python">

```python
pdf.new_image() \
    .from_file("logo.png") \
    .at(page=0, x=50, y=700) \
    .add()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
await pdf.newImage()
  .fromFile('logo.png')
  .at(0, 50, 700)
  .add();
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
pdf.newImage()
    .fromFile("logo.png")
    .at(0, 50, 700)
    .add();
```

  </TabItem>
</Tabs>

---

## Working with Forms

**Find all form fields on a page:**

<Tabs>
  <TabItem value="python" label="Python">

```python
fields = pdf.page(0).select_form_fields()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const fields = await pdf.selectFormFields();
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
List<FormFieldReference> fields = pdf.selectFormFields();
```

  </TabItem>
</Tabs>

**Find form fields by name:**

<Tabs>
  <TabItem value="python" label="Python">

```python
name_fields = pdf.page(0).select_form_fields_by_name("firstName")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const nameFields = await pdf.selectFieldsByName('firstName');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
List<FormFieldReference> nameFields = pdf.selectFormFieldsByName("firstName");
```

  </TabItem>
</Tabs>

**Fill a form field:**

<Tabs>
  <TabItem value="python" label="Python">

```python
if name_fields:
    name_fields[0].edit().value("John Doe").apply()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
if (nameFields.length > 0) {
  await nameFields[0].fill('John Doe');
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
if (!nameFields.isEmpty()) {
    nameFields.get(0).edit().value("John Doe").apply();
}
```

  </TabItem>
</Tabs>

---

## Next Steps

- [**Working with Text**](working-with-text.md) – Advanced text selection and manipulation
- [**Working with Fonts**](working-with-fonts.md) – Standard fonts and custom TTF fonts
- [**Concepts**](concepts.md) – Deeper understanding of PDFDancer's model
- [**Cookbook**](cookbook.md) – Complete working examples
