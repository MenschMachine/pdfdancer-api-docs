---
id: working-with-formxobjects
title: Working with Form XObjects
description: Select and manipulate reusable PDF Form XObject content.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Working with Form XObjects

A Form XObject is a reusable PDF content stream that can be painted one or more times. It is not an AcroForm field.

![AcroForm fields store interactive names and values, while Form XObjects are reusable painted content](/img/doc/forms-vs-form-xobjects.svg)

## Complete Form XObject workflow

Download [form-xobject.pdf](/files/v3/samples/form-xobject.pdf) as `input.pdf`. The program selects the first Form XObject, clears its clipping path, and saves `output.pdf`.

<Tabs>
<TabItem value="python-complete" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer

with PDFDancer.open(Path("input.pdf")) as pdf:
    forms = pdf.select_forms()
    if not forms:
        raise RuntimeError("The sample Form XObject was not found")
    if not forms[0].clear_clipping():
        raise RuntimeError("The clipping path was not cleared")
    pdf.save("output.pdf")
```

</TabItem>
<TabItem value="typescript-complete" label="TypeScript">

```typescript
import * as fs from 'node:fs';
import {PDFDancer} from 'pdfdancer-client-typescript';

const input = new Uint8Array(fs.readFileSync('input.pdf'));
const pdf = await PDFDancer.open(input);
const forms = await pdf.selectForms();
if (forms.length === 0) throw new Error('The sample Form XObject was not found');
if (!await forms[0].clearClipping()) throw new Error('The clipping path was not cleared');
await pdf.save('output.pdf');
```

</TabItem>
<TabItem value="java-complete" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;

public class ClearFormClipping {
    public static void main(String[] args) throws Exception {
        PDFDancer pdf = PDFDancer.createSession("input.pdf");
        var forms = pdf.selectForms();
        if (forms.isEmpty()) throw new IllegalStateException("The sample Form XObject was not found");
        if (!forms.get(0).clearClipping()) {
            throw new IllegalStateException("The clipping path was not cleared");
        }
        pdf.save("output.pdf");
    }
}
```

</TabItem>
</Tabs>

Open `output.pdf` and compare the Form XObject with `input.pdf`. The remaining examples assume an open `pdf` session.

## Select Form XObjects

Use document scope to find every instance in the PDF, page scope to restrict the result, or a page-scoped coordinate selector when position identifies the intended instance.

<Tabs>
<TabItem value="python-select" label="Python">

```python
all_forms = pdf.select_forms()
page_forms = pdf.page(1).select_forms()
near_point = pdf.page(1).select_forms_at(72, 640, tolerance=1.0)
one_form = pdf.page(1).select_form_at(72, 640, tolerance=1.0)
```

</TabItem>
<TabItem value="typescript-select" label="TypeScript">

```typescript
const allForms = await pdf.selectForms();
const pageForms = await pdf.page(1).selectForms();
const nearPoint = await pdf.page(1).selectFormsAt(72, 640, 1.0);
const oneForm = await pdf.page(1).selectFormAt(72, 640, 1.0);
```

</TabItem>
<TabItem value="java-select" label="Java">

```java
var allForms = pdf.selectForms();
var pageForms = pdf.page(1).selectForms();
var nearPoint = pdf.page(1).selectFormsAt(72, 640, 1.0);
var oneForm = pdf.page(1).selectFormAt(72, 640, 1.0);
```

</TabItem>
</Tabs>

Plural selectors return every match. The singular coordinate selector returns `None`, `null`, or `Optional.empty()` when no instance matches.

## Language-specific types

The three v3 SDKs do not use one identical public class name. Use the actual exported `FormObject`, `FormXObject`, or reference type documented by the selected language; do not treat those names as interchangeable imports.

## Select and edit a Form XObject

Selected Form XObjects support moving, deleting, and clearing clipping. Each method returns a boolean.

<Tabs>
<TabItem value="python-edit" label="Python">

```python
form = pdf.page(1).select_form_at(72, 640, tolerance=1.0)
if form is None:
    raise RuntimeError("Form XObject not found")
if not form.move_to(90, 620):
    raise RuntimeError("Move failed")

form = pdf.page(1).select_form_at(90, 620, tolerance=1.0)
if form is None or not form.clear_clipping():
    raise RuntimeError("Clipping could not be cleared")

# Delete only when removing this painted instance is intended.
form = pdf.page(1).select_form_at(90, 620, tolerance=1.0)
if form is None:
    raise RuntimeError("Moved Form XObject could not be selected again")
if not form.delete():
    raise RuntimeError("Deletion failed")
```

</TabItem>
<TabItem value="typescript-edit" label="TypeScript">

```typescript
const form = await pdf.page(1).selectFormAt(72, 640, 1.0);
if (form === null) throw new Error('Form XObject not found');
if (!await form.moveTo(90, 620)) throw new Error('Move failed');

const movedForm = await pdf.page(1).selectFormAt(90, 620, 1.0);
if (movedForm === null || !await movedForm.clearClipping()) {
  throw new Error('Clipping could not be cleared');
}

// Delete only when removing this painted instance is intended.
const formToDelete = await pdf.page(1).selectFormAt(90, 620, 1.0);
if (formToDelete === null || !await formToDelete.delete()) {
  throw new Error('Deletion failed');
}
```

</TabItem>
<TabItem value="java-edit" label="Java">

```java
var form = pdf.page(1).selectFormAt(72, 640, 1.0)
        .orElseThrow(() -> new IllegalStateException("Form XObject not found"));
if (!form.moveTo(90, 620)) throw new IllegalStateException("Move failed");

var movedForm = pdf.page(1).selectFormAt(90, 620, 1.0)
        .orElseThrow(() -> new IllegalStateException("Moved Form XObject not found"));
if (!movedForm.clearClipping()) {
    throw new IllegalStateException("Clipping could not be cleared");
}

// Delete only when removing this painted instance is intended.
var formToDelete = pdf.page(1).selectFormAt(90, 620, 1.0)
        .orElseThrow(() -> new IllegalStateException("Moved Form XObject not found"));
if (!formToDelete.delete()) throw new IllegalStateException("Deletion failed");
```

</TabItem>
</Tabs>

Clearing clipping removes the graphics-state boundary affecting the selected instance; it does not crop or resize the underlying content.

Moving or deleting a Form XObject reference can affect a reusable content instance in ways that differ from editing its underlying stream. Inspect the rendered output before applying the same change to multiple instances.

For named interactive fields, see [AcroForms](./working-with-acroforms).
