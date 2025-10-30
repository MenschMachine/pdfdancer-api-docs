---
id: working-with-acroforms
title: Working with Acroforms
description: Learn how to fill, update, and manipulate PDF form fields (AcroForms).
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

PDFDancer provides powerful tools for working with PDF forms (AcroForms). You can select, fill, update, and delete form fields programmatically.

---

## Selecting Form Fields

### All Form Fields

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

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
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Get all form fields across the document
const allFields = await pdf.selectFormFields();

// Get all form fields on a specific page
const pageFields = await pdf.page(1).selectFormFields();

for (const field of pageFields) {
  console.log(`Field: ${field.name}, Type: ${field.type}`);
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

// Find form fields by name (document-level)
const firstNameFields = await pdf.selectFieldsByName('firstName');

// On a specific page
const pageFields = await pdf.page(0).selectFormFieldsByName('signature');

if (firstNameFields.length > 0) {
  console.log(`Found field: ${firstNameFields[0].name}`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Filling Form Fields

### Fill Single Field

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

---

## Deleting Form Fields

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

- [**Working with FormXObjects**](working-with-formxobjects.md) – Learn about FormXObjects
- [**Working with Fonts**](working-with-fonts.md) – Use custom fonts
- [**Cookbook**](cookbook.md) – See complete working examples
