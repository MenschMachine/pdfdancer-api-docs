---
id: redaction
title: Redaction
description: Learn how to permanently redact sensitive content from PDFs including text, images, paths, and form fields.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

PDFDancer provides secure redaction capabilities for permanently removing sensitive content from PDFs. Unlike simple overlays that can be removed, redaction actually replaces the underlying content with placeholder text or shapes.

---

## Redacting Text

### Paragraphs

Redact paragraphs to replace text content with a placeholder string.

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Find sensitive content
    paragraphs = pdf.page(1).select_paragraphs_starting_with("SSN:")

    if paragraphs:
        # Redact with default replacement "[REDACTED]"
        paragraphs[0].redact()

        # Or use custom replacement text
        paragraphs[0].redact(replacement="[CONFIDENTIAL]")

    pdf.save("redacted.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import {PDFDancer} from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');

// Find sensitive content
const para = await pdf.page(1).selectParagraphStartingWith('SSN:');

if (para) {
    // Redact with default replacement "[REDACTED]"
    await para.redact();

    // Or use custom replacement text
    await para.redact('[CONFIDENTIAL]');
}

await pdf.save('redacted.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.client.rest.TextParagraphReference;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Find sensitive content
List<TextParagraphReference> paragraphs = pdf.page(1)
    .selectParagraphsStartingWith("SSN:");

if (!paragraphs.isEmpty()) {
    // Redact with default replacement "[REDACTED]"
    paragraphs.get(0).redact().apply();

    // Or use custom replacement text
    paragraphs.get(0).redact()
        .withReplacement("[CONFIDENTIAL]")
        .apply();
}

pdf.save("redacted.pdf");
```

  </TabItem>
</Tabs>

### Text Lines

Individual text lines can also be redacted.

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Find text lines matching a pattern
    lines = pdf.page(1).select_text_lines_matching(r"\d{3}-\d{2}-\d{4}")

    for line in lines:
        line.redact(replacement="XXX-XX-XXXX")

    pdf.save("redacted.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open('document.pdf');

// Find text lines matching a pattern (uses regex string)
const lines = await pdf.page(1).selectTextLinesMatching('\\d{3}-\\d{2}-\\d{4}');

for (const line of lines) {
    await line.redact('XXX-XX-XXXX');
}

await pdf.save('redacted.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Find text lines matching a pattern
List<TextLineReference> lines = pdf.page(1)
    .selectTextLinesMatching("\\d{3}-\\d{2}-\\d{4}");

for (TextLineReference line : lines) {
    line.redact()
        .withReplacement("XXX-XX-XXXX")
        .apply();
}

pdf.save("redacted.pdf");
```

  </TabItem>
</Tabs>

---

## Redacting Images

When redacting images, the image is replaced with a solid color placeholder rectangle in the same position and size.

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import Color, PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    images = pdf.page(1).select_images()

    for image in images:
        # Redact image (replaced with black rectangle by default)
        image.redact()

    pdf.save("redacted.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import {Color, PDFDancer} from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');

const images = await pdf.page(1).selectImages();

for (const image of images) {
    // Redact image (replaced with black rectangle by default)
    await image.redact();

    // Or use custom placeholder color
    await image.redact({ color: new Color(128, 128, 128) });
}

await pdf.save('redacted.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.common.model.Color;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

List<ImageReference> images = pdf.page(1).selectImages();

for (ImageReference image : images) {
    // Redact with default black placeholder
    image.redact().apply();

    // Or use custom placeholder color
    image.redact()
        .withColor(new Color(128, 128, 128))
        .apply();
}

pdf.save("redacted.pdf");
```

  </TabItem>
</Tabs>

---

## Redacting Vector Paths

Vector graphics and paths can be redacted similarly to images.

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    paths = pdf.page(1).select_paths()

    for path in paths:
        path.redact()

    pdf.save("redacted.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open('document.pdf');

const paths = await pdf.page(1).selectPaths();

for (const path of paths) {
    await path.redact();
}

await pdf.save('redacted.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
PDFDancer pdf = PDFDancer.createSession("document.pdf");

List<PathReference> paths = pdf.page(1).selectPaths();

for (PathReference path : paths) {
    path.redact().apply();
}

pdf.save("redacted.pdf");
```

  </TabItem>
</Tabs>

---

## Redacting Form Fields

Form fields containing sensitive data can also be redacted.

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("form.pdf") as pdf:
    # Find form field by name
    fields = pdf.select_form_fields_by_name("social_security")

    if fields:
        fields[0].redact(replacement="[REMOVED]")

    pdf.save("redacted.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open('form.pdf');

// Find form field by name
const fields = await pdf.selectFieldsByName('social_security');

if (fields.length > 0) {
    await fields[0].redact('[REMOVED]');
}

await pdf.save('redacted.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
PDFDancer pdf = PDFDancer.createSession("form.pdf");

// Find form field by name
List<FormFieldReference> fields = pdf.selectFormFieldsByName("social_security");

if (!fields.isEmpty()) {
    fields.get(0).redact()
        .withReplacement("[REMOVED]")
        .apply();
}

pdf.save("redacted.pdf");
```

  </TabItem>
</Tabs>

---

## Batch Redaction

For redacting multiple objects at once, use the document-level `redact()` method. This is more efficient than redacting objects one by one.

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import Color, PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Collect objects to redact
    objects_to_redact = []

    # Add sensitive paragraphs
    ssn_paragraphs = pdf.select_paragraphs_matching(r"SSN.*\d{3}-\d{2}-\d{4}")
    objects_to_redact.extend(ssn_paragraphs)

    # Add sensitive images
    page_images = pdf.page(1).select_images()
    objects_to_redact.extend(page_images)

    # Batch redact all objects
    result = pdf.redact(
        objects_to_redact,
        replacement="[REDACTED]",
        placeholder_color=Color(0, 0, 0)  # Black for images/paths
    )

    print(f"Redacted {result.count} objects")
    print(f"Success: {result.success}")

    pdf.save("redacted.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import {Color, PDFDancer} from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');

let redactedCount = 0;

// Redact sensitive paragraphs
const ssnParagraphs = await pdf.selectParagraphsMatching('SSN.*\\d{3}-\\d{2}-\\d{4}');
for (const paragraph of ssnParagraphs) {
    await paragraph.redact('[REDACTED]');
    redactedCount++;
}

// Redact sensitive images with black placeholder
const pageImages = await pdf.page(1).selectImages();
for (const image of pageImages) {
    await image.redact({color: new Color(0, 0, 0)});
    redactedCount++;
}

console.log(`Redacted ${redactedCount} objects`);

await pdf.save('redacted.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.common.request.RedactRequest;
import com.pdfdancer.common.response.RedactResponse;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Build redaction request
RedactRequest.Builder builder = RedactRequest.builder()
    .defaultReplacement("[REDACTED]")
    .placeholderColor(Color.BLACK);

// Add sensitive paragraphs
List<TextParagraphReference> ssnParagraphs = pdf
    .selectParagraphsMatching("SSN.*\\d{3}-\\d{2}-\\d{4}");
for (TextParagraphReference para : ssnParagraphs) {
    builder.addTargetById(para.getInternalId());
}

// Add sensitive images
List<ImageReference> pageImages = pdf.page(1).selectImages();
for (ImageReference image : pageImages) {
    builder.addTargetById(image.getInternalId());
}

// Execute batch redaction
RedactResponse result = pdf.redact(builder.build());

System.out.println("Redacted " + result.count() + " objects");
System.out.println("Success: " + result.success());

pdf.save("redacted.pdf");
```

  </TabItem>
</Tabs>

---

## Redaction Response

The redaction methods return a response object with information about the operation:

| Property | Description |
|----------|-------------|
| `success` | Whether the redaction completed successfully |
| `count` | Number of objects that were redacted |
| `warnings` | Any warnings generated during redaction |

---

## Important Notes

- **Permanent removal**: Redaction permanently removes the original content from the PDF. Once the operation succeeds, the redacted data cannot be recovered. Always check `result.success` before assuming data was redacted:

```python
# Python
result = paragraph.redact()
if result:
    print("Content permanently redacted")
else:
    print("Redaction failed - original content preserved")
```

```typescript
// TypeScript
const result = await paragraph.redact();
if (result.success) {
    console.log("Content permanently redacted");
} else {
    console.log("Redaction failed - original content preserved");
}
```

```java
// Java
boolean success = paragraph.redact().apply();
if (success) {
    System.out.println("Content permanently redacted");
} else {
    System.out.println("Redaction failed - original content preserved");
}
```

- **Text replacement**: For text objects, the original text is replaced with the placeholder string.
- **Image/path replacement**: For non-text objects, a solid color rectangle replaces the original content.
- **Save required**: Remember to save the document after redacting to persist changes.
