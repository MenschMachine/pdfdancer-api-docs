---
id: editing-content
title: Editing PDF Content
description: Learn how to edit paragraphs, text lines, and form fields in PDFs.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

PDFDancer provides fluent editors for modifying existing PDF content. You can edit text, change fonts and colors, move elements, and update form fields.

---

## Editing Paragraphs

### Basic Text Replacement

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Find a paragraph
    paragraphs = pdf.page(0).select_paragraphs_starting_with("Disclaimer")

    if paragraphs:
        # Replace the text
        paragraphs[0].edit().replace("Updated disclaimer text").apply()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Find a paragraph
const paragraphs = await pdf.page(0).selectParagraphsStartingWith('Disclaimer');

if (paragraphs.length > 0) {
  // Replace the text
  await paragraphs[0].edit()
    .replace('Updated disclaimer text')
    .apply();
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Chaining Multiple Edits

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color

with PDFDancer.open("document.pdf") as pdf:
    paragraph = pdf.page(0).select_paragraphs_starting_with("Invoice #")[0]

    # Chain multiple edits
    paragraph.edit() \
        .replace("Invoice #12345") \
        .font("Roboto-Regular", 11) \
        .color(Color(120, 0, 0)) \
        .line_spacing(1.1) \
        .move_to(72, 140) \
        .apply()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);
const paragraphs = await pdf.page(0).selectParagraphsStartingWith('Invoice #');

if (paragraphs.length > 0) {
  // Chain multiple edits
  await paragraphs[0].edit()
    .replace('Invoice #12345')
    .font('Roboto-Regular', 11)
    .color(new Color(120, 0, 0))
    .moveTo(72, 140)
    .apply();
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Using Context Manager (Python)

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color

with PDFDancer.open("document.pdf") as pdf:
    paragraph = pdf.page(0).select_paragraphs()[0]

    # Use context manager to auto-apply on success
    with paragraph.edit() as edit:
        edit.replace("Context-managed update")
        edit.color(Color(120, 0, 0))
        edit.font("Helvetica", 12)
    # Automatically applied when context exits

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

TypeScript doesn't have context managers, but you can use the fluent API:

```typescript
const pdf = await PDFDancer.open(pdfBytes);
const paragraphs = await pdf.page(0).selectParagraphs();

if (paragraphs.length > 0) {
  await paragraphs[0].edit()
    .replace('Updated text')
    .color(new Color(120, 0, 0))
    .font('Helvetica', 12)
    .apply();
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Editing Font and Style

### Changing Font

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Font

with PDFDancer.open("document.pdf") as pdf:
    paragraph = pdf.page(0).select_paragraphs()[0]

    # Change font using Font object
    paragraph.edit() \
        .font("Helvetica-Bold", 14) \
        .apply()

    # Or using Font constructor
    from pdfdancer import Font
    paragraph.edit() \
        .font(Font("Times-Roman", 12).name, Font("Times-Roman", 12).size) \
        .apply()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);
const paragraphs = await pdf.page(0).selectParagraphs();

if (paragraphs.length > 0) {
  // Change font
  await paragraphs[0].edit()
    .font('Helvetica-Bold', 14)
    .apply();
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Changing Color

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color

with PDFDancer.open("document.pdf") as pdf:
    paragraph = pdf.page(0).select_paragraphs()[0]

    # Set color using RGB values
    paragraph.edit() \
        .color(Color(255, 0, 0)) \
        .apply()

    # Black text
    paragraph.edit() \
        .color(Color(0, 0, 0)) \
        .apply()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);
const paragraphs = await pdf.page(0).selectParagraphs();

if (paragraphs.length > 0) {
  // Set color using RGB values
  await paragraphs[0].edit()
    .color(new Color(255, 0, 0))  // Red
    .apply();

  // Black text
  await paragraphs[0].edit()
    .color(new Color(0, 0, 0))
    .apply();
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Line Spacing

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    paragraph = pdf.page(0).select_paragraphs()[0]

    # Set line spacing (1.0 = single, 1.5 = 1.5x, etc.)
    paragraph.edit() \
        .line_spacing(1.5) \
        .apply()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);
const paragraphs = await pdf.page(0).selectParagraphs();

if (paragraphs.length > 0) {
  // Set line spacing (1.0 = single, 1.5 = 1.5x, etc.)
  await paragraphs[0].edit()
    .lineSpacing(1.5)
    .apply();
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Moving Content

### Moving Paragraphs

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    paragraph = pdf.page(0).select_paragraphs()[0]

    # Move to new coordinates
    paragraph.edit().move_to(x=100, y=500).apply()

    # Or use the move method directly on the object
    paragraph.move_to(x=150, y=600)

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);
const paragraphs = await pdf.page(0).selectParagraphs();

if (paragraphs.length > 0) {
  // Move to new coordinates
  await paragraphs[0].edit()
    .moveTo(100, 500)
    .apply();

  // Or use the move method directly on the object
  await paragraphs[0].moveTo(150, 600);
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Moving Images

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    images = pdf.page(0).select_images()

    if images:
        # Move image to new position
        images[0].move_to(x=200, y=350)

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);
const images = await pdf.page(0).selectImages();

if (images.length > 0) {
  // Move image to new position
  await images[0].moveTo(200, 350);
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Deleting Content

### Delete Paragraphs

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Find and delete paragraphs
    disclaimers = pdf.select_paragraphs_starting_with("Disclaimer")

    for disclaimer in disclaimers:
        disclaimer.delete()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Find and delete paragraphs
const disclaimers = await pdf.selectParagraphsStartingWith('Disclaimer');

for (const disclaimer of disclaimers) {
  await disclaimer.delete();
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Delete Images

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    images = pdf.page(0).select_images()

    # Delete all images on page 0
    for image in images:
        image.delete()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);
const images = await pdf.page(0).selectImages();

// Delete all images on page 0
for (const image of images) {
  await image.delete();
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Editing Form Fields

### Updating Field Values

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("form.pdf") as pdf:
    # Find form field by name
    fields = pdf.page(1).select_form_fields_by_name("signature")

    if fields:
        # Update the field value
        fields[0].edit().value("Signed by Jane Doe").apply()

    pdf.save("filled_form.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Find form field by name
const fields = await pdf.selectFieldsByName('signature');

if (fields.length > 0) {
  // Update the field value using fill method
  await fields[0].fill('Signed by Jane Doe');
}

await pdf.save('filled_form.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Bulk Form Filling

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("form.pdf") as pdf:
    # Define form data
    form_data = {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "555-1234"
    }

    # Fill all fields
    for field_name, value in form_data.items():
        fields = pdf.select_form_fields_by_name(field_name)
        if fields:
            fields[0].edit().value(value).apply()

    pdf.save("filled_form.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Define form data
const formData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '555-1234'
};

// Fill all fields
for (const [fieldName, value] of Object.entries(formData)) {
  const fields = await pdf.selectFieldsByName(fieldName);
  if (fields.length > 0) {
    await fields[0].fill(value);
  }
}

await pdf.save('filled_form.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

### Deleting Form Fields

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("form.pdf") as pdf:
    # Delete specific form fields
    zip_fields = pdf.select_form_fields_by_name("zip")

    for field in zip_fields:
        field.delete()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Delete specific form fields
const zipFields = await pdf.selectFieldsByName('zip');

for (const field of zipFields) {
  await field.delete();
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Next Steps

- [**Adding Content**](adding-content.md) – Learn how to add new paragraphs and images
- [**Advanced**](advanced.md) – Custom fonts, complex workflows, and optimization
- [**Examples**](cookbook.md) – See complete working examples
