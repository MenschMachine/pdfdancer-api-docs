---
id: positioning
title: Positioning and Coordinates
description: Work precisely with PDF coordinates, sizes, rectangles, and transforms.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Positioning and Coordinates

PDF coordinates differ from the top-left coordinate system used by browsers and many image tools. Before placing or selecting content, establish the page number, page dimensions, coordinate origin, and units.

![PDF page coordinates start at the bottom-left and increase rightward and upward](/img/doc/pdf-coordinate-system.svg)

## PDF points and page numbers

PDFDancer measures page coordinates and dimensions in points.

| Distance | Points |
|---|---:|
| 1 inch | 72 |
| 1/2 inch | 36 |
| 1 millimetre | approximately 2.835 |
| 1 centimetre | approximately 28.346 |

Page numbers passed to API v3 methods are one-based: page `1` is the first page.

On an unrotated page, `(0, 0)` is normally at the bottom-left. `x` increases to the right and `y` increases upward. The diagram above shows the same convention with a page and a rectangle whose lower-left corner is `(x, y)`.

The page's crop box and rotation can affect how these coordinates correspond to what a PDF viewer displays. Do not assume that every PDF has an origin at the visible sheet's bottom-left corner; verify geometry-sensitive workflows with representative source files.

## Convert top-left coordinates

If another system measures `y` downward from the top of an unrotated page, convert a point with:

```text
pdfX = sourceX
pdfY = pageHeight - sourceY
```

For a rectangle whose source coordinates describe its top-left corner:

```text
pdfX = sourceX
pdfY = pageHeight - sourceY - rectangleHeight
```

For example, US Letter is commonly 612 × 792 points. A point 72 points from the left and 72 points from the top converts to `(72, 720)`. A 36-point-high rectangle at the same top-left position starts at `(72, 684)` in bottom-left coordinates.

These formulas assume an unrotated page and coordinate systems referring to the same visible page box.

## How coordinates are used

| Operation | Meaning of `(x, y)` |
|---|---|
| `selectImageAt`, `selectPathAt`, `selectFormAt`, or `selectFormFieldAt` | A point used to find existing objects on one page |
| `TextInsertRequest.at` | The insertion position for new text |
| Image builder `.at(...)` | The placement position for the new image |
| Path builder `moveTo(...)` | The first or next point in the path being constructed |
| Selected object's `moveTo(...)` | The object's new position on its current page |

The same method name can have different meaning on a builder and on an existing object. For example, `newPath().moveTo(...)` begins a path segment; `selectedImage.moveTo(...)` relocates an image.

## Select near a coordinate

Coordinate selection is available through a page client because `(x, y)` alone does not identify a page.

```text
pdf.page(1).select…At(x, y, tolerance)
```

The default tolerance is `0.01` point. Use a larger value when input coordinates are rounded or approximate. Prefer a plural selector such as `selectImagesAt` while diagnosing a match: more than one object can occupy the same point. See [Finding Existing Objects](./finding-content) for complete examples and empty-result handling.

## Inspect an existing object's bounds

Selected objects include position data. When available, the bounding rectangle provides `x`, `y`, `width`, and `height`. Its coordinates describe the object in PDF user space; they are not CSS pixels.

<Tabs>
<TabItem value="python-bounds" label="Python">

```python
image = pdf.page(1).select_image()
if image is not None and image.position.bounding_rect is not None:
    bounds = image.position.bounding_rect
    print(bounds.x, bounds.y, bounds.width, bounds.height)
```

</TabItem>
<TabItem value="typescript-bounds" label="TypeScript">

```typescript
const image = await pdf.page(1).selectImage();
const bounds = image?.position.boundingRect;
if (bounds) {
  console.log(bounds.x, bounds.y, bounds.width, bounds.height);
}
```

</TabItem>
<TabItem value="java-bounds" label="Java">

```java
var image = pdf.page(1).selectImage();
if (image.isPresent()) {
    var bounds = image.get().getPosition().getBoundingRect();
    if (bounds != null) {
        System.out.println(bounds.getX() + ", " + bounds.getY());
        System.out.println(bounds.getWidth() + " × " + bounds.getHeight());
    }
}
```

</TabItem>
</Tabs>

Position data describes the object when it was selected. After moving, scaling, rotating, or replacing the object, select it again if later calculations require current bounds.

## Place text at a known coordinate

The following inserts a label one inch from the left edge and ten inches from the bottom of page 1. Coordinate insertion requires an explicit font and positive font size because there is no existing text from which to inherit those values.

<Tabs>
<TabItem value="python" label="Python">

```python
request = TextInsertRequest.at(1, 72, 720, "Reviewed") \
    .font("Helvetica-Bold").size(12).build()
response = pdf.text().insert(request)
if response.changed != 1 or response.errors:
    raise RuntimeError(f"Could not insert label: {response}")
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const request = TextInsertRequest.at(1, 72, 720, 'Reviewed')
  .font('Helvetica-Bold').size(12).build();
const response = await pdf.text().insert(request);
if (response.changed !== 1 || response.errors?.length) {
  throw new Error(`Could not insert label: ${JSON.stringify(response)}`);
}
```

</TabItem>
<TabItem value="java" label="Java">

```java
var request = TextInsertRequest.at(1, 72, 720, "Reviewed")
        .font("Helvetica-Bold").size(12).build();
var response = pdf.text().insert(request);
if (response.changed() != 1 || (response.errors() != null && !response.errors().isEmpty())) {
    throw new IllegalStateException("Could not insert label: " + response);
}
```

</TabItem>
</Tabs>

Use `pdf.page(1).text()` for page scope when inserting relative to an existing text anchor. Coordinate insertion already includes the page number in `TextInsertRequest.at(...)` and therefore uses `pdf.text()`.

## Move an existing object

Select the object first, then pass its new PDF coordinates to `moveTo` or `move_to`. The move keeps the object on its current page.

<Tabs>
<TabItem value="python-move" label="Python">

```python
image = pdf.page(1).select_image_at(72, 680, tolerance=1.0)
if image is None or not image.move_to(144, 680):
    raise RuntimeError("Image move failed")
```

</TabItem>
<TabItem value="typescript-move" label="TypeScript">

```typescript
const image = await pdf.page(1).selectImageAt(72, 680, 1.0);
if (image === null || !await image.moveTo(144, 680)) {
  throw new Error('Image move failed');
}
```

</TabItem>
<TabItem value="java-move" label="Java">

```java
var image = pdf.page(1).selectImageAt(72, 680, 1.0);
if (image.isEmpty() || !image.get().moveTo(144, 680)) {
    throw new IllegalStateException("Image move failed");
}
```

</TabItem>
</Tabs>

Moving an object to another page is not the same operation as changing its coordinates. Page objects have their own `moveTo(targetPageNumber)` operation for reordering pages.

## Transform points with a matrix

A transform is a reusable rule for moving, scaling, or rotating PDF content. For example, the same translation can move every point in an image or text range by the same amount.

PDF stores this rule as six numbers: `[a, b, c, d, e, f]`. The first four numbers control the linear part of the transformation; `e` and `f` add an offset. Together they map an input point `(x, y)` to an output point `(x', y')`:

```text
x' = a*x + c*y + e
y' = b*x + d*y + f
```

For example, this matrix translates a point 72 points right and 36 points up without changing its size or rotation:

```text
[1, 0, 0, 1, 72, 36]

x' = 1*10 + 0*20 + 72 = 82
y' = 0*10 + 1*20 + 36 = 56

(10, 20) becomes (82, 56)
```

The same representation can scale, rotate, or combine those operations. Common matrices include:

| Effect | Matrix |
|---|---|
| Translate by `(tx, ty)` | `[1, 0, 0, 1, tx, ty]` |
| Scale by `(sx, sy)` | `[sx, 0, 0, sy, 0, 0]` |
| Rotate by angle `θ` | `[cos θ, sin θ, -sin θ, cos θ, 0, 0]` |

For a 2× scale, `[2, 0, 0, 2, 0, 0]` maps `(10, 20)` to `(20, 40)`. A 90-degree counterclockwise rotation uses `[0, 1, -1, 0, 0, 0]`; it maps `(10, 20)` to `(-20, 10)`.

You do not need to calculate a page's current transformation matrix for ordinary placement. When text-to-image replacement accepts a transform, that transform is relative to the matched range's visually leftmost boundary caret, not the page's current transformation matrix.

## Troubleshooting misplaced content

1. Confirm that the page number is one-based.
2. Confirm that both axes are expressed in points rather than pixels.
3. Check whether the source coordinates use a top-left origin.
4. Check the page's crop box and rotation.
5. Inspect the selected object's bounding rectangle before calculating offsets.
6. Select the object again after a geometric change when current bounds matter.
7. Save to a separate output file and inspect the rendered result.
