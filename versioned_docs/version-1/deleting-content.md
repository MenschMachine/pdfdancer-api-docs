---
id: deleting-content
title: Deleting Content
description: Learn how to delete pages, text, and images from PDFs.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

PDFDancer provides consistent deletion methods across all content types. This guide covers how to remove pages, paragraphs, text lines, and images from your PDFs.

---

## Deleting Pages

### Delete a Single Page

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Delete the third page (page number 3)
    pdf.page(3).delete()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');

// Delete the third page (page number 3)
await pdf.page(3).delete();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Delete the third page (page number 3)
pdf.page(3).delete();

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

### Delete Multiple Pages

When deleting multiple pages, delete in reverse order to avoid page number shifting.

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Delete pages 2, 3, and 5
    # Delete in reverse order to avoid page number shifting
    for page_number in reversed([2, 3, 5]):
        pdf.page(page_number).delete()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');

// Delete pages 2, 3, and 5
// Delete in reverse order to avoid page number shifting
for (const pageNumber of [5, 3, 2]) {
  await pdf.page(pageNumber).delete();
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import java.util.Arrays;
import java.util.Collections;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Delete pages 2, 3, and 5
// Delete in reverse order to avoid page number shifting
Integer[] pageNumbers = {5, 3, 2};
Arrays.sort(pageNumbers, Collections.reverseOrder());

for (int pageNumber : pageNumbers) {
    pdf.page(pageNumber).delete();
}

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

:::tip Why Delete in Reverse Order?
When you delete page 2 from a 5-page document, page 3 becomes page 2, page 4 becomes page 3, and so on. Deleting in reverse order (highest page numbers first) ensures that earlier page numbers remain valid throughout the deletion process.
:::

---

## Deleting Text

### Delete a Paragraph

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Find and delete a paragraph
    paragraph = pdf.page(1).select_paragraphs_starting_with("The Complete")[0]
    paragraph.delete()

    # Verify deletion
    remaining = pdf.page(1).select_paragraphs_starting_with("The Complete")
    assert remaining == []

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');

// Find and delete a paragraph
const paragraphs = await pdf.page(1).selectParagraphsStartingWith('The Complete');

if (paragraphs.length > 0) {
    await paragraphs[0].delete();

    // Verify deletion
    const remaining = await pdf.page(1).selectParagraphsStartingWith('The Complete');
    console.log(`Remaining paragraphs: ${remaining.length}`);
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Find and delete a paragraph
List<Paragraph> paragraphs = pdf.page(1).selectParagraphsStartingWith("The Complete");
if (!paragraphs.isEmpty()) {
    paragraphs.get(0).delete();

    // Verify deletion
    List<Paragraph> remaining = pdf.page(1).selectParagraphsStartingWith("The Complete");
    System.out.println("Remaining paragraphs: " + remaining.size());
}

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

### Delete a Text Line

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Find and delete a text line
    text_line = pdf.page(1).select_text_lines_starting_with("Footer")[0]
    text_line.delete()

    # Verify deletion
    remaining = pdf.page(1).select_text_lines_starting_with("Footer")
    assert remaining == []

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');

// Find and delete a text line
const textLines = await pdf.page(1).selectTextLinesStartingWith('Footer');

if (textLines.length > 0) {
    await textLines[0].delete();

    // Verify deletion
    const remaining = await pdf.page(1).selectTextLinesStartingWith('Footer');
    console.log(`Remaining text lines: ${remaining.length}`);
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Find and delete a text line
List<TextLine> textLines = pdf.page(1).selectTextLinesStartingWith("Footer");
if (!textLines.isEmpty()) {
    textLines.get(0).delete();

    // Verify deletion
    List<TextLine> remaining = pdf.page(1).selectTextLinesStartingWith("Footer");
    System.out.println("Remaining text lines: " + remaining.size());
}

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

### Delete All Matching Text

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Delete all paragraphs containing "DRAFT"
    drafts = pdf.select_paragraphs_containing("DRAFT")
    for paragraph in drafts:
        paragraph.delete()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');

// Delete all paragraphs containing "DRAFT"
const drafts = await pdf.selectParagraphsContaining('DRAFT');
for (const paragraph of drafts) {
    await paragraph.delete();
}

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Delete all paragraphs containing "DRAFT"
List<Paragraph> drafts = pdf.selectParagraphsContaining("DRAFT");
for (Paragraph paragraph : drafts) {
    paragraph.delete();
}

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

---

## Deleting Images

### Delete a Single Image

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    images = pdf.page(1).select_images()

    if images:
        # Delete the first image
        images[0].delete()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');
const images = await pdf.page(1).selectImages();

if (images.length > 0) {
    // Delete the first image
    await images[0].delete();
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
    // Delete the first image
    images.get(0).delete();
}

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

### Delete All Images on a Page

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    images = pdf.page(1).select_images()

    # Delete all images on page 1
    for image in images:
        image.delete()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');
const images = await pdf.page(1).selectImages();

// Delete all images on page 1
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

// Delete all images on page 1
for (Image image : images) {
    image.delete();
}

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

### Delete Images at Specific Location

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Find and delete images at specific coordinates
    images = pdf.page(1).select_images_at(x=100, y=200)

    for image in images:
        image.delete()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');

// Find and delete images at specific coordinates
const images = await pdf.page(1).selectImagesAt(100, 200);

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

// Find and delete images at specific coordinates
List<Image> images = pdf.page(1).selectImagesAt(100, 200);

for (Image image : images) {
    image.delete();
}

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

---

## Deleting vs Redaction

Deletion removes content from the document entirely. If you need to permanently remove sensitive information while leaving a visual indicator (black box), use [redaction](redaction.md) instead.

| Use Case | Approach |
|----------|----------|
| Remove obsolete pages | Deletion |
| Remove draft watermarks | Deletion |
| Remove sensitive data (SSN, etc.) | Redaction |
| Clean up layout | Deletion |
| Compliance requirements | Redaction |

---

## Next Steps

- [**Redaction**](redaction.md) - Permanently remove sensitive information
- [**Working with Text**](working-with-text.md) - Full text manipulation guide
- [**Working with Images**](working-with-images.md) - Complete image operations
- [**Working with Pages**](working-with-pages.md) - Page manipulation guide
