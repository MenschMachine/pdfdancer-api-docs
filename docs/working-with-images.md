---
id: working-with-images
title: Working with Images
description: Learn how to add, select, and manipulate images in PDFs.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

PDFDancer allows you to work with images in PDFs - add new images, select existing ones, move them, and delete them.

---

## Selecting Images

### All Images

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Get all images across the document
    all_images = pdf.select_images()

    # Get all images on a specific page
    page_images = pdf.page(1).select_images()

    for img in page_images:
        print(f"Image ID: {img.internal_id}")
        print(f"Position: {img.position.bounding_rect}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');

// Get all images across the document
const allImages = await pdf.selectImages();

// Get all images on a specific page
const pageImages = await pdf.page(1).selectImages();

for (const img of pageImages) {
  console.log(`Image ID: ${img.internalId}`);
  console.log(`Position: ${JSON.stringify(img.position.boundingRect)}`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import com.tfc.pdf.pdfdancer.api.common.model.*;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Get all images across the document
List<Image> allImages = pdf.selectImages();

// Get all images on a specific page
List<Image> pageImages = pdf.page(1).selectImages();

for (Image img : pageImages) {
    System.out.println("Image ID: " + img.getInternalId());
    System.out.println("Position: " + img.getPosition().getBoundingRect());
}
```

  </TabItem>
</Tabs>

### Images at Coordinates

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Find images at specific coordinates
    images = pdf.page(2).select_images_at(x=120, y=300)

    for img in images:
        print(f"Found image at position: {img.position}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open('document.pdf');

// Find images at specific coordinates
const images = await pdf.page(2).selectImagesAt(120, 300);

for (const img of images) {
  console.log(`Found image at position: ${img.position}`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Find images at specific coordinates
List<Image> images = pdf.page(2).selectImagesAt(120, 300);

for (Image img : images) {
    System.out.println("Found image at position: " + img.getPosition());
}
```

  </TabItem>
</Tabs>

---

## Adding Images

### From File Path

<Tabs>
  <TabItem value="python" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Add image from file
    pdf.new_image() \
        .from_file(Path("logo.png")) \
        .at(page=1, x=48, y=700) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');

// Add image from file
await pdf.newImage()
  .fromFile('logo.png')
  .at(1, 48, 700)
  .add();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import java.nio.file.Paths;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Add image from file
pdf.newImage()
    .fromFile(Paths.get("logo.png"))
    .at(1, 48, 700)
    .add();

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

### From Bytes

<Tabs>
  <TabItem value="python" label="Python">

:::info
The Python SDK does not have a `from_bytes()` method. If you have image bytes, write them to a temporary file first, then use `from_file()`.
:::

```python
import tempfile
from pathlib import Path
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Load image bytes
    image_bytes = Path("logo.png").read_bytes()

    # Write bytes to temporary file
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_file:
        temp_path = Path(temp_file.name)
        temp_path.write_bytes(image_bytes)

    try:
        # Add image from temporary file
        pdf.new_image() \
            .from_file(temp_path) \
            .at(page=1, x=100, y=600) \
            .add()

        pdf.save("output.pdf")
    finally:
        # Clean up temporary file
        temp_path.unlink()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';
import { promises as fs } from 'node:fs';

const pdf = await PDFDancer.open('document.pdf');

// Load image bytes
const imageBytes = await fs.readFile('logo.png');

// Add image from bytes
await pdf.newImage()
  .fromBytes(imageBytes)
  .at(1, 100, 600)
  .add();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import java.nio.file.Files;
import java.nio.file.Paths;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Load image bytes
byte[] imageBytes = Files.readAllBytes(Paths.get("logo.png"));

// Add image from bytes
pdf.newImage()
    .fromBytes(imageBytes)
    .at(1, 100, 600)
    .add();

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

---

## Moving Images

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    images = pdf.page(1).select_images()

    if images:
        # Move image to new position
        images[0].move_to(x=200, y=350)

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open('document.pdf');
const images = await pdf.page(1).selectImages();

if (images.length > 0) {
  // Move image to new position
  await images[0].moveTo(200, 350);
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import com.tfc.pdf.pdfdancer.api.common.model.*;

PDFDancer pdf = PDFDancer.createSession("document.pdf");
List<Image> images = pdf.page(1).selectImages();

if (!images.isEmpty()) {
    // Move image to new position
    images.get(0).moveTo(200, 350);
}

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

---

## Deleting Images

:::info
For a comprehensive guide on deletion operations across all content types, see [Deleting Content](deleting-content.md).
:::

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    images = pdf.page(1).select_images()

    # Delete all images on page 0
    for image in images:
        image.delete()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open('document.pdf');
const images = await pdf.page(1).selectImages();

// Delete all images on page 0
for (const image of images) {
  await image.delete();
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import com.tfc.pdf.pdfdancer.api.common.model.*;

PDFDancer pdf = PDFDancer.createSession("document.pdf");
List<Image> images = pdf.page(1).selectImages();

// Delete all images on page 0
for (Image image : images) {
    image.delete();
}

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

---

## Transforming Images

PDFDancer provides powerful image transformation capabilities to modify existing images in-place.

### Scaling Images

Scale an image by a factor or to a specific size.

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    images = pdf.page(1).select_images()

    if images:
        # Scale to half size
        images[0].scale(0.5)

        # Scale to double size
        images[1].scale(2.0)

        # Scale to specific dimensions (preserving aspect ratio)
        images[2].scale_to(width=200, height=150, preserve_aspect_ratio=True)

        # Scale to exact dimensions (ignoring aspect ratio)
        images[0].scale_to(width=100, height=100, preserve_aspect_ratio=False)

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');
const images = await pdf.page(1).selectImages();

if (images.length > 0) {
  // Scale to half size
  await images[0].scale(0.5);

  // Scale to double size
  await images[1].scale(2.0);

  // Scale to specific dimensions (preserving aspect ratio)
  await images[2].scaleTo(200, 150, true);

  // Scale to exact dimensions (ignoring aspect ratio)
  await images[0].scaleTo(100, 100, false);
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.client.rest.ImageReference;
import com.pdfdancer.common.model.Size;
import java.util.List;

PDFDancer pdf = PDFDancer.open("document.pdf");
List<ImageReference> images = pdf.page(1).selectImages();

if (!images.isEmpty()) {
    // Scale to half size
    images.get(0).scale(0.5);

    // Scale to double size
    images.get(1).scale(2.0);

    // Scale to specific dimensions (preserving aspect ratio)
    images.get(2).scaleTo(new Size(200, 150), true);

    // Scale to exact dimensions (ignoring aspect ratio)
    images.get(0).scaleTo(100, 100, false);
}

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

### Rotating Images

Rotate images by a specified angle in degrees.

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    images = pdf.page(1).select_images()

    if images:
        # Rotate 90 degrees clockwise
        images[0].rotate(90)

        # Rotate 180 degrees
        images[1].rotate(180)

        # Rotate 45 degrees
        images[2].rotate(45)

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');
const images = await pdf.page(1).selectImages();

if (images.length > 0) {
  // Rotate 90 degrees clockwise
  await images[0].rotate(90);

  // Rotate 180 degrees
  await images[1].rotate(180);

  // Rotate 45 degrees
  await images[2].rotate(45);
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.client.rest.ImageReference;
import java.util.List;

PDFDancer pdf = PDFDancer.open("document.pdf");
List<ImageReference> images = pdf.page(1).selectImages();

if (!images.isEmpty()) {
    // Rotate 90 degrees clockwise
    images.get(0).rotate(90);

    // Rotate 180 degrees
    images.get(1).rotate(180);

    // Rotate 45 degrees
    images.get(2).rotate(45);
}

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

### Cropping Images

Crop images by trimming pixels from each edge.

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    images = pdf.page(1).select_images()

    if images:
        # Crop 10 pixels from each edge
        images[0].crop(left=10, top=10, right=10, bottom=10)

        # Crop only from the left side
        images[1].crop(left=50, top=0, right=0, bottom=0)

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');
const images = await pdf.page(1).selectImages();

if (images.length > 0) {
  // Crop 10 pixels from each edge
  await images[0].crop(10, 10, 10, 10);

  // Crop only from the left side
  await images[1].crop(50, 0, 0, 0);
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.client.rest.ImageReference;
import java.util.List;

PDFDancer pdf = PDFDancer.open("document.pdf");
List<ImageReference> images = pdf.page(1).selectImages();

if (!images.isEmpty()) {
    // Crop 10 pixels from each edge
    images.get(0).crop(10, 10, 10, 10);

    // Crop only from the left side
    images.get(1).crop(50, 0, 0, 0);
}

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

### Setting Image Opacity

Adjust the transparency of an image.

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    images = pdf.page(1).select_images()

    if images:
        # Set to 50% opacity (semi-transparent)
        images[0].set_opacity(0.5)

        # Set to 25% opacity (mostly transparent)
        images[1].set_opacity(0.25)

        # Set to fully opaque
        images[2].set_opacity(1.0)

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');
const images = await pdf.page(1).selectImages();

if (images.length > 0) {
  // Set to 50% opacity (semi-transparent)
  await images[0].setOpacity(0.5);

  // Set to 25% opacity (mostly transparent)
  await images[1].setOpacity(0.25);

  // Set to fully opaque
  await images[2].setOpacity(1.0);
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.client.rest.ImageReference;
import java.util.List;

PDFDancer pdf = PDFDancer.open("document.pdf");
List<ImageReference> images = pdf.page(1).selectImages();

if (!images.isEmpty()) {
    // Set to 50% opacity (semi-transparent)
    images.get(0).opacity(0.5);

    // Set to 25% opacity (mostly transparent)
    images.get(1).opacity(0.25);

    // Set to fully opaque
    images.get(2).opacity(1.0);
}

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

### Flipping Images

Flip images horizontally, vertically, or both.

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, ImageFlipDirection

with PDFDancer.open("document.pdf") as pdf:
    images = pdf.page(1).select_images()

    if images:
        # Flip horizontally (mirror left-right)
        images[0].flip(ImageFlipDirection.HORIZONTAL)

        # Flip vertically (mirror top-bottom)
        images[1].flip(ImageFlipDirection.VERTICAL)

        # Flip both horizontally and vertically
        images[2].flip(ImageFlipDirection.BOTH)

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, FlipDirection } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');
const images = await pdf.page(1).selectImages();

if (images.length > 0) {
  // Flip horizontally (mirror left-right)
  await images[0].flip(FlipDirection.HORIZONTAL);

  // Flip vertically (mirror top-bottom)
  await images[1].flip(FlipDirection.VERTICAL);

  // Flip both horizontally and vertically
  await images[2].flip(FlipDirection.BOTH);
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.client.rest.ImageReference;
import com.pdfdancer.common.request.ImageTransformRequest.FlipDirection;
import java.util.List;

PDFDancer pdf = PDFDancer.open("document.pdf");
List<ImageReference> images = pdf.page(1).selectImages();

if (!images.isEmpty()) {
    // Flip horizontally (mirror left-right)
    images.get(0).flip(FlipDirection.HORIZONTAL);
    // Or use the convenience method:
    // images.get(0).flipHorizontal();

    // Flip vertically (mirror top-bottom)
    images.get(1).flip(FlipDirection.VERTICAL);
    // Or use the convenience method:
    // images.get(1).flipVertical();

    // Flip both horizontally and vertically
    images.get(2).flip(FlipDirection.BOTH);
}

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

### Replacing Images

Replace an existing image with a new one while keeping the same position.

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Image

with PDFDancer.open("document.pdf") as pdf:
    images = pdf.page(1).select_images()

    if images:
        # Create a new image from file data
        with open("new-logo.png", "rb") as f:
            image_data = f.read()

        new_image = Image(
            format="PNG",
            width=100,
            height=100,
            data=image_data
        )

        # Replace the first image
        images[0].replace(new_image)

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Image } from 'pdfdancer-client-typescript';
import * as fs from 'fs';

const pdf = await PDFDancer.open('document.pdf');
const images = await pdf.page(1).selectImages();

if (images.length > 0) {
  // Create a new image from file data
  const imageData = fs.readFileSync('new-logo.png');

  const newImage = new Image(
    undefined,  // no existing position
    'PNG',
    100,
    100,
    new Uint8Array(imageData)
  );

  // Replace the first image
  await images[0].replace(newImage);
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.client.rest.ImageReference;
import com.pdfdancer.common.model.Image;
import java.io.File;
import java.util.List;

PDFDancer pdf = PDFDancer.open("document.pdf");
List<ImageReference> images = pdf.page(1).selectImages();

if (!images.isEmpty()) {
    // Replace image from file
    images.get(0).replace(new File("new-logo.png"));

    // Or create an Image object manually
    Image newImage = Image.fromFile(new File("another-image.png"));
    images.get(1).replace(newImage);
}

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

---

## Next Steps

- [**Working with Acroforms**](working-with-acroforms.md) – Learn how to work with PDF forms
- [**Working with Fonts**](working-with-fonts.md) – Use custom fonts in your PDFs
- [**Cookbook**](cookbook.md) – See complete working examples
