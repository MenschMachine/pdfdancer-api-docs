---
id: finding-content
title: Finding Existing Objects
description: Select images, paths, Form XObjects, and AcroForm fields by page, coordinates, or field name.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Finding Existing Objects

Before moving, deleting, or restyling an existing object, select it from the open PDF. Use document scope when the object may occur on any page, and page scope when you know its one-based page number.

```text
document scope: pdf.select…()
page scope:     pdf.page(1).select…()
```

Page scope reduces ambiguity and is required for coordinate selection.

## Choose a selector

| What you know | Selector form | Result |
|---|---|---|
| Object type only | `selectImages()`, `selectPaths()`, `selectForms()`, or `selectFormFields()` | Every matching object in the chosen scope |
| Object type and page | Call the plural selector on `pdf.page(n)` | Every matching object on that page |
| Object type and coordinates | Page-scoped `select…At(x, y)` | Objects matching that point |
| Stable AcroForm field name | `selectFormFieldsByName(name)` | Every field with that name |
| You need only the first match | Singular `selectImage`, `selectPath`, `selectForm`, or supported `selectFormField…` method | One object or the language's empty value |
| You need a heterogeneous object list | `selectElements()` | Read-only object references rather than type-specific editing objects |

Use a type-specific selector when you intend to edit the result. It returns an image, path, Form XObject, or form-field object with the operations supported for that type.

## Select by page and type

This example lists images throughout the document, then restricts the search to paths on page 1.

<Tabs>
<TabItem value="python" label="Python">

```python
images = pdf.select_images()
page_one_paths = pdf.page(1).select_paths()

print(f"Images in document: {len(images)}")
print(f"Paths on page 1: {len(page_one_paths)}")
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const images = await pdf.selectImages();
const pageOnePaths = await pdf.page(1).selectPaths();

console.log(`Images in document: ${images.length}`);
console.log(`Paths on page 1: ${pageOnePaths.length}`);
```

</TabItem>
<TabItem value="java" label="Java">

```java
var images = pdf.selectImages();
var pageOnePaths = pdf.page(1).selectPaths();

System.out.println("Images in document: " + images.size());
System.out.println("Paths on page 1: " + pageOnePaths.size());
```

</TabItem>
</Tabs>

Plural selectors always return a collection. An empty collection means that no object matched; it is not an error.

## Select one object at a point

Coordinate selectors are page-scoped and use PDF points. The default matching tolerance is `0.01` point. Pass a larger tolerance when the coordinates are approximate; remember that a larger search area can match more than one object.

The plural form returns every match. The singular form returns the first match, so use it only when the point identifies one object unambiguously.

| Language | No result from a singular selector |
|---|---|
| Python | `None` |
| TypeScript | `null` |
| Java | `Optional.empty()` |

The following complete example finds an image near `(72, 680)` on page 1, moves it to `(90, 650)`, and saves the PDF.

<Tabs>
<TabItem value="python-point" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer

with PDFDancer.open(Path("input.pdf")) as pdf:
    image = pdf.page(1).select_image_at(72, 680, tolerance=1.0)
    if image is None:
        raise RuntimeError("No image found near (72, 680) on page 1")
    if not image.move_to(90, 650):
        raise RuntimeError("The image could not be moved")
    pdf.save("output.pdf")
```

</TabItem>
<TabItem value="typescript-point" label="TypeScript">

```typescript
import * as fs from 'node:fs';
import {PDFDancer} from 'pdfdancer-client-typescript';

async function main(): Promise<void> {
  const input = new Uint8Array(fs.readFileSync('input.pdf'));
  const pdf = await PDFDancer.open(input);
  const image = await pdf.page(1).selectImageAt(72, 680, 1.0);
  if (image === null) throw new Error('No image found near (72, 680) on page 1');
  if (!await image.moveTo(90, 650)) throw new Error('The image could not be moved');
  await pdf.save('output.pdf');
}

void main();
```

</TabItem>
<TabItem value="java-point" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;

public class MoveImage {
    public static void main(String[] args) throws Exception {
        var pdf = PDFDancer.createSession("input.pdf");
        var image = pdf.page(1).selectImageAt(72, 680, 1.0)
                .orElseThrow(() -> new IllegalStateException(
                        "No image found near (72, 680) on page 1"));
        if (!image.moveTo(90, 650)) {
            throw new IllegalStateException("The image could not be moved");
        }
        pdf.save("output.pdf");
    }
}
```

</TabItem>
</Tabs>

After moving an object, its old coordinates no longer identify its current location. Keep the selected object while completing immediate edits, or select it again at its new coordinates when a later step needs current position data.

## Select AcroForm fields by name

Field names are stored in the PDF and are not necessarily unique. Use the plural method unless your application has verified that the document contains exactly one field with that name.

<Tabs>
<TabItem value="python-field" label="Python">

```python
fields = pdf.select_form_fields_by_name("customer_name")
if len(fields) != 1:
    raise RuntimeError(f"Expected one customer_name field, found {len(fields)}")
```

</TabItem>
<TabItem value="typescript-field" label="TypeScript">

```typescript
const fields = await pdf.selectFormFieldsByName('customer_name');
if (fields.length !== 1) {
  throw new Error(`Expected one customer_name field, found ${fields.length}`);
}
```

</TabItem>
<TabItem value="java-field" label="Java">

```java
var fields = pdf.selectFormFieldsByName("customer_name");
if (fields.size() != 1) {
    throw new IllegalStateException(
            "Expected one customer_name field, found " + fields.size());
}
```

</TabItem>
</Tabs>

See [Working with AcroForms](./working-with-acroforms) for reading and changing field values.

## Finding text is different

The object selectors on this page do not return editable paragraphs or text lines. To replace, insert, delete, or style text, specify the target as part of the text operation and inspect `TextEditResponse.matched` and `TextEditResponse.changed`. See [Working with Text](./working-with-text).

## When a selector finds nothing

Check these inputs before treating an empty result as an SDK failure:

1. Confirm the one-based page number.
2. Confirm that coordinates use PDF points and a bottom-left origin for an unrotated page.
3. Use the plural selector to see whether several objects occupy the same point.
4. Increase coordinate tolerance deliberately when the source coordinates are rounded.
5. Confirm the object type. A visible item may be a Form XObject or vector path rather than an image.
6. For fields, inspect all form fields and compare their stored names before using a name selector.
