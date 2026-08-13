---
id: working-with-acroforms
title: Working with AcroForms
description: Find, inspect, fill, and delete interactive PDF form fields while preserving the distinction between AcroForms and reusable Form XObjects.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Working with AcroForms

AcroForm fields are interactive PDF form controls. They are distinct from Form XObjects, which are reusable content streams.

![AcroForm fields store interactive names and values, while Form XObjects are reusable painted content](/img/doc/forms-vs-form-xobjects.svg)

## Complete form-filling workflow

Download [acroform.pdf](pathname:///files/v3/samples/acroform.pdf) as `input.pdf`. The program sets the field named `firstName` to `Ada` and saves `output.pdf`.

<Tabs>
<TabItem value="python-complete" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer

with PDFDancer.open(Path("input.pdf")) as pdf:
    field = pdf.select_form_field_by_name("firstName")
    if field is None:
        raise RuntimeError("The firstName field was not found")
    if not field.set_value("Ada"):
        raise RuntimeError("The firstName field was not updated")
    pdf.save("output.pdf")
```

</TabItem>
<TabItem value="typescript-complete" label="TypeScript">

```typescript
import * as fs from 'node:fs';
import {PDFDancer} from 'pdfdancer-client-typescript';

const input = new Uint8Array(fs.readFileSync('input.pdf'));
const pdf = await PDFDancer.open(input);
const field = await pdf.selectFormFieldByName('firstName');
if (!field) throw new Error('The firstName field was not found');
if (!await field.setValue('Ada')) throw new Error('The firstName field was not updated');
await pdf.save('output.pdf');
```

</TabItem>
<TabItem value="java-complete" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;

public class FillForm {
    public static void main(String[] args) throws Exception {
        PDFDancer pdf = PDFDancer.createSession("input.pdf");
        var field = pdf.selectFormFieldByName("firstName")
                .orElseThrow(() -> new IllegalStateException("The firstName field was not found"));
        if (!field.setValue("Ada")) {
            throw new IllegalStateException("The firstName field was not updated");
        }
        pdf.save("./output.pdf");
    }
}
```

</TabItem>
</Tabs>

Open `output.pdf` in a PDF viewer that displays interactive form fields and confirm that `firstName` contains `Ada`. The remaining examples assume an open `pdf` session.

## List and inspect fields

Use document scope to inspect every field, or page scope when only one page is relevant. Each selected field exposes its stored name, current value, object type, position, and internal identifier.

<Tabs>
<TabItem value="python-list" label="Python">

```python
for field in pdf.select_form_fields():
    print(field.name, field.value, field.object_type, field.page_number)

page_one_fields = pdf.page(1).select_form_fields()
```

</TabItem>
<TabItem value="typescript-list" label="TypeScript">

```typescript
for (const field of await pdf.selectFormFields()) {
  console.log(field.name, field.value, field.type, field.position.pageNumber);
}

const pageOneFields = await pdf.page(1).selectFormFields();
```

</TabItem>
<TabItem value="java-list" label="Java">

```java
for (var field : pdf.selectFormFields()) {
    System.out.println(field.getName() + " = " + field.getValue());
    System.out.println("type=" + field.type()
            + " page=" + field.getPosition().getPageNumber());
}

var pageOneFields = pdf.page(1).selectFormFields();
```

</TabItem>
</Tabs>

An empty collection means the chosen scope contains no AcroForm fields. Field names come from the PDF; inspect them before relying on a name supplied by another document template.

## Fill a named field

<Tabs>
<TabItem value="python" label="Python">

```python
field = pdf.select_form_field_by_name("signature")
if field is None:
    raise RuntimeError("The signature field does not exist")
if not field.set_value("Signed by Jane Doe"):
    raise RuntimeError("The signature field was not updated")
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const field = await pdf.selectFormFieldByName('signature');
if (!field) throw new Error('The signature field does not exist');
if (!(await field.setValue('Signed by Jane Doe'))) {
  throw new Error('The signature field was not updated');
}
```

</TabItem>
<TabItem value="java" label="Java">

```java
var field = pdf.selectFormFieldByName("signature")
        .orElseThrow(() -> new IllegalStateException("Missing signature field"));
if (!field.setValue("Signed by Jane Doe")) {
    throw new IllegalStateException("The signature field was not updated");
}
```

</TabItem>
</Tabs>

Field names come from the PDF. Inspect the values returned by `selectFormFields()` when you do not know them in advance.

## Select by name or coordinates

Names are not guaranteed to be unique. Use the plural name selector when duplicates are possible. Coordinate selectors are page-scoped and accept an optional tolerance in PDF points.

<Tabs>
<TabItem value="python-select" label="Python">

```python
named = pdf.select_form_fields_by_name("customer_name")
at_point = pdf.page(1).select_form_fields_at(72, 540, tolerance=1.0)
first_at_point = pdf.page(1).select_form_field_at(72, 540, tolerance=1.0)
```

</TabItem>
<TabItem value="typescript-select" label="TypeScript">

```typescript
const named = await pdf.selectFormFieldsByName('customer_name');
const atPoint = await pdf.page(1).selectFormFieldsAt(72, 540, 1.0);
const firstAtPoint = await pdf.page(1).selectFormFieldAt(72, 540, 1.0);
```

</TabItem>
<TabItem value="java-select" label="Java">

```java
var named = pdf.selectFormFieldsByName("customer_name");
var atPoint = pdf.page(1).selectFormFieldsAt(72, 540, 1.0);
var firstAtPoint = pdf.page(1).selectFormFieldAt(72, 540, 1.0);
```

</TabItem>
</Tabs>

Plural selectors return collections. A singular selector returns `None` in Python, `null` in TypeScript, or `Optional.empty()` in Java when no field matches.

## Set values

`setValue`/`set_value` returns a boolean. Check it before saving. Re-select the field when a later step must confirm the value reported by the active session.

## Delete fields

Deletion removes the selected form-field object. It is not redaction and must not be described as removal of all visually or semantically related content.

<Tabs>
<TabItem value="python-delete" label="Python">

```python
field = pdf.select_form_field_by_name("obsolete_field")
if field is not None and not field.delete():
    raise RuntimeError("Field deletion failed")
```

</TabItem>
<TabItem value="typescript-delete" label="TypeScript">

```typescript
const field = await pdf.selectFormFieldByName('obsolete_field');
if (field !== null && !await field.delete()) {
  throw new Error('Field deletion failed');
}
```

</TabItem>
<TabItem value="java-delete" label="Java">

```java
var field = pdf.selectFormFieldByName("obsolete_field");
if (field.isPresent() && !field.get().delete()) {
    throw new IllegalStateException("Field deletion failed");
}
```

</TabItem>
</Tabs>

After form changes, save and verify both appearance and interactive behavior in a PDF viewer.
