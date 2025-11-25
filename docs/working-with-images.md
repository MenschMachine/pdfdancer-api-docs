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

## Next Steps

- [**Working with Acroforms**](working-with-acroforms.md) – Learn how to work with PDF forms
- [**Working with Fonts**](working-with-fonts.md) – Use custom fonts in your PDFs
- [**Cookbook**](cookbook.md) – See complete working examples
