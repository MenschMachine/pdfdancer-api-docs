---
id: working-with-images
title: Working with Images
description: Select, add, transform, replace, and delete images in PDF documents using document-scoped and page-scoped image operations.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Working with Images

Select images at document or page scope, by collection or coordinates. Singular selectors return the language's empty-result type; plural selectors return a collection.

## Complete image-replacement workflow

Download [images.pdf](/files/v3/samples/images.pdf) as `input.pdf` and [replacement-logo.png](/files/v3/samples/replacement-logo.png) into the same directory. The program replaces the first image and saves `output.pdf`.

<Tabs>
<TabItem value="python-complete" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer

with PDFDancer.open(Path("input.pdf")) as pdf:
    images = pdf.select_images()
    if not images:
        raise RuntimeError("The sample image was not found")
    result = images[0].replace_from_file(Path("replacement-logo.png"))
    if not result.success:
        raise RuntimeError(result.message)
    pdf.save("output.pdf")
```

</TabItem>
<TabItem value="typescript-complete" label="TypeScript">

```typescript
import * as fs from 'node:fs';
import {PDFDancer} from 'pdfdancer-client-typescript';

const input = new Uint8Array(fs.readFileSync('input.pdf'));
const pdf = await PDFDancer.open(input);
const images = await pdf.selectImages();
if (images.length === 0) throw new Error('The sample image was not found');
const result = await images[0].replaceFromFile('replacement-logo.png');
if (!result.success) throw new Error(result.message ?? 'Image replacement failed');
await pdf.save('output.pdf');
```

</TabItem>
<TabItem value="java-complete" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import java.io.File;

public class ReplaceImage {
    public static void main(String[] args) throws Exception {
        PDFDancer pdf = PDFDancer.createSession("input.pdf");
        var images = pdf.selectImages();
        if (images.isEmpty()) throw new IllegalStateException("The sample image was not found");
        var result = images.get(0).replace(new File("replacement-logo.png"));
        if (!result.success()) throw new IllegalStateException(result.message());
        pdf.save("output.pdf");
    }
}
```

</TabItem>
</Tabs>

Open `output.pdf` and confirm that the original image was replaced. The remaining examples assume an open `pdf` session.

## Select and inspect images

<Tabs>
<TabItem value="python-select" label="Python">

```python
all_images = pdf.select_images()
page_images = pdf.page(1).select_images()
near_point = pdf.page(1).select_images_at(72, 700, tolerance=1.0)
image = pdf.page(1).select_image_at(72, 700, tolerance=1.0)
if image is not None:
    print(image.width, image.height, image.aspect_ratio, image.page_number)
```

</TabItem>
<TabItem value="typescript-select" label="TypeScript">

```typescript
const allImages = await pdf.selectImages();
const pageImages = await pdf.page(1).selectImages();
const nearPoint = await pdf.page(1).selectImagesAt(72, 700, 1.0);
const image = await pdf.page(1).selectImageAt(72, 700, 1.0);
if (image) console.log(image.width, image.height, image.aspectRatio, image.position.pageNumber);
```

</TabItem>
<TabItem value="java-select" label="Java">

```java
var allImages = pdf.selectImages();
var pageImages = pdf.page(1).selectImages();
var nearPoint = pdf.page(1).selectImagesAt(72, 700, 1.0);
var image = pdf.page(1).selectImageAt(72, 700, 1.0);
image.ifPresent(value -> System.out.println(
        value.getWidth() + " × " + value.getHeight()
                + ", ratio=" + value.getAspectRatio()));
```

</TabItem>
</Tabs>

## Add images

Use the image builder at document scope with an explicit one-based page, or use a page-scoped builder. Supply an image file and PDF coordinates before calling the terminal add operation.

<Tabs>
<TabItem value="python-add" label="Python">

```python
from pathlib import Path

if not pdf.new_image().from_file(Path("logo.png")).at(1, 72, 700).add():
    raise RuntimeError("Document-scoped image add failed")
if not pdf.page(2).new_image().from_file(Path("seal.png")).at(72, 80).add():
    raise RuntimeError("Page-scoped image add failed")
```

</TabItem>
<TabItem value="typescript-add" label="TypeScript">

```typescript
if (!await pdf.newImage().fromFile('logo.png').at(1, 72, 700).add()) {
  throw new Error('Document-scoped image add failed');
}
if (!await pdf.page(2).newImage().fromFile('seal.png').at(72, 80).add()) {
  throw new Error('Page-scoped image add failed');
}
```

</TabItem>
<TabItem value="java-add" label="Java">

```java
import java.io.File;

if (!pdf.newImage().fromFile(new File("logo.png")).at(1, 72, 700).add()) {
    throw new IllegalStateException("Document-scoped image add failed");
}
if (!pdf.page(2).newImage().fromFile(new File("seal.png")).at(72, 80).add()) {
    throw new IllegalStateException("Page-scoped image add failed");
}
```

</TabItem>
</Tabs>

Transformation methods return `CommandResult`; check `success`, `message`, `warning`, and the affected element identifier. Positive image rotation angles are clockwise.

## Replace an image

Replacement keeps the selected image object's placement while changing its image data.

<Tabs>
<TabItem value="python-replace" label="Python">

```python
from pathlib import Path

image = pdf.page(1).select_image_at(72, 700, tolerance=1.0)
if image is None:
    raise RuntimeError("Image not found")
result = image.replace_from_file(Path("new-logo.png"))
if not result.success:
    raise RuntimeError(result.message)
```

</TabItem>
<TabItem value="typescript-replace" label="TypeScript">

```typescript
const image = await pdf.page(1).selectImageAt(72, 700, 1.0);
if (!image) throw new Error('Image not found');
const result = await image.replaceFromFile('new-logo.png');
if (!result.success) throw new Error(result.message ?? 'Replacement failed');
```

</TabItem>
<TabItem value="java-replace" label="Java">

```java
import java.io.File;

var image = pdf.page(1).selectImageAt(72, 700, 1.0)
        .orElseThrow(() -> new IllegalStateException("Image not found"));
var result = image.replace(new File("new-logo.png"));
if (!result.success()) throw new IllegalStateException(result.message());
```

</TabItem>
</Tabs>

## Scale, rotate, and move

Choose one transformation, check its result, then select the image again before calculations that depend on current bounds.

<Tabs>
<TabItem value="python-geometry" label="Python">

```python
# Scale by a factor.
result = image.scale(0.5)

# Or scale to a box in PDF points.
result = image.scale_to(180, 60, preserve_aspect_ratio=True)

# Or rotate clockwise and move to new PDF coordinates.
result = image.rotate(90)
moved = image.move_to(144, 650)

if not result.success or not moved:
    raise RuntimeError(result.message)
```

</TabItem>
<TabItem value="typescript-geometry" label="TypeScript">

```typescript
// Scale by a factor.
let result = await image.scale(0.5);

// Or scale to a box in PDF points.
result = await image.scaleTo(180, 60, true);

// Or rotate clockwise and move to new PDF coordinates.
result = await image.rotate(90);
const moved = await image.moveTo(144, 650);

if (!result.success || !moved) throw new Error(result.message ?? 'Transform failed');
```

</TabItem>
<TabItem value="java-geometry" label="Java">

```java
// Scale by a factor.
var result = image.scale(0.5);

// Or scale to a box in PDF points.
result = image.scaleTo(180, 60, true);

// Or rotate clockwise and move to new PDF coordinates.
result = image.rotate(90);
boolean moved = image.moveTo(144, 650);

if (!result.success() || !moved) {
    throw new IllegalStateException(result.message());
}
```

</TabItem>
</Tabs>

The alternatives above illustrate individual methods; do not apply all of them in sequence unless that combined transformation is intended.

## Crop, opacity, flipping, and pixel-region fill

Crop and fill-region dimensions are image pixels, not PDF page points. Opacity ranges from `0.0` (transparent) to `1.0` (opaque).

<Tabs>
<TabItem value="python-pixels" label="Python">

```python
from pdfdancer import Color

crop_result = image.crop(left=10, top=5, right=10, bottom=5)
opacity_result = image.set_opacity(0.75)
flip_result = image.flip_horizontal()
fill_result = image.fill_region(0, 0, 40, 20, Color(255, 255, 255))

for result in (crop_result, opacity_result, flip_result, fill_result):
    if not result.success:
        raise RuntimeError(result.message)
```

</TabItem>
<TabItem value="typescript-pixels" label="TypeScript">

```typescript
import {Color} from 'pdfdancer-client-typescript';

const cropResult = await image.crop(10, 5, 10, 5);
const opacityResult = await image.setOpacity(0.75);
const flipResult = await image.flipHorizontal();
const fillResult = await image.fillRegion(0, 0, 40, 20, new Color(255, 255, 255));

for (const result of [cropResult, opacityResult, flipResult, fillResult]) {
  if (!result.success) throw new Error(result.message ?? 'Image transform failed');
}
```

</TabItem>
<TabItem value="java-pixels" label="Java">

```java
import com.pdfdancer.common.model.Color;

var cropResult = image.crop(10, 5, 10, 5);
var opacityResult = image.opacity(0.75);
var flipResult = image.flipHorizontal();
var fillResult = image.fillRegion(0, 0, 40, 20, new Color(255, 255, 255));

for (var result : java.util.List.of(
        cropResult, opacityResult, flipResult, fillResult)) {
    if (!result.success()) throw new IllegalStateException(result.message());
}
```

</TabItem>
</Tabs>

These calls are shown together to document their parameters. For production edits, select the image again between transformations when current dimensions or coordinates influence the next operation.

## Clipping

An image can remain visually clipped after moving because its clipping path is an independent PDF graphics-state constraint. Use `clearClipping` only when removing that constraint is intended, then inspect the rendered output.

<Tabs>
<TabItem value="python-clipping" label="Python">

```python
if not image.clear_clipping():
    raise RuntimeError("Image clipping could not be cleared")
```

</TabItem>
<TabItem value="typescript-clipping" label="TypeScript">

```typescript
if (!await image.clearClipping()) throw new Error('Image clipping could not be cleared');
```

</TabItem>
<TabItem value="java-clipping" label="Java">

```java
if (!image.clearClipping()) {
    throw new IllegalStateException("Image clipping could not be cleared");
}
```

</TabItem>
</Tabs>

## Deletion

Delete the selected typed image rather than relying on its previous coordinates after other transformations. Re-run the selector if the workflow may have changed its identity or position.

<Tabs>
<TabItem value="python-delete" label="Python">

```python
if not image.delete():
    raise RuntimeError("Image deletion failed")
```

</TabItem>
<TabItem value="typescript-delete" label="TypeScript">

```typescript
if (!await image.delete()) throw new Error('Image deletion failed');
```

</TabItem>
<TabItem value="java-delete" label="Java">

```java
if (!image.delete()) throw new IllegalStateException("Image deletion failed");
```

</TabItem>
</Tabs>
