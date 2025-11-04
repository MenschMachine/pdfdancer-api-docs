---
id: working-with-snapshots
title: Working with Snapshots
description: Learn how to use snapshots for efficient bulk operations and document inspection.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Snapshots provide an efficient way to retrieve all elements from a PDF document or page in a single API call. This is particularly useful for bulk operations, filtering elements by type, and inspecting document structure.

---

## What are Snapshots?

A **snapshot** is a complete view of a PDF document or page that includes:
- All elements (paragraphs, text lines, images, paths, form fields)
- Page metadata (size, orientation)
- Font information (for document snapshots)

Snapshots are cached internally for performance, making repeated selections much faster.

---

## Document Snapshots

Get a complete snapshot of the entire PDF document:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Get snapshot of entire document
    snapshot = pdf.get_document_snapshot()
    
    # Access document information
    print(f"Total pages: {snapshot.page_count}")
    print(f"Fonts used: {len(snapshot.fonts)}")
    
    # Iterate through all pages
    for page_snapshot in snapshot.pages:
        page_index = page_snapshot.page_ref.position.page_index
        element_count = len(page_snapshot.elements)
        print(f"Page {page_index}: {element_count} elements")
    
    # Get all elements across all pages
    all_elements = []
    for page_snap in snapshot.pages:
        all_elements.extend(page_snap.elements)
    
    print(f"Total elements in document: {len(all_elements)}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Get snapshot of entire document
const snapshot = await pdf.getDocumentSnapshot();

// Access document information
console.log(`Total pages: ${snapshot.pageCount}`);
console.log(`Fonts used: ${snapshot.fonts.length}`);

// Iterate through all pages
for (const pageSnapshot of snapshot.pages) {
  const pageIndex = pageSnapshot.pageRef.position.pageIndex;
  const elementCount = pageSnapshot.elements.length;
  console.log(`Page ${pageIndex}: ${elementCount} elements`);
}

// Get all elements across all pages
const allElements = snapshot.pages.flatMap(page => page.elements);
console.log(`Total elements in document: ${allElements.length}`);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import com.tfc.pdf.pdfdancer.api.common.model.*;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Get snapshot of entire document
DocumentSnapshot snapshot = pdf.getDocumentSnapshot();

// Access document information
System.out.println("Total pages: " + snapshot.getPageCount());
System.out.println("Fonts used: " + snapshot.getFonts().size());

// Iterate through all pages
for (PageSnapshot pageSnapshot : snapshot.getPages()) {
    int pageIndex = pageSnapshot.getPageRef().getPosition().getPageIndex();
    int elementCount = pageSnapshot.getElements().size();
    System.out.println("Page " + pageIndex + ": " + elementCount + " elements");
}

// Get all elements across all pages
List<Element> allElements = new ArrayList<>();
for (PageSnapshot pageSnap : snapshot.getPages()) {
    allElements.addAll(pageSnap.getElements());
}

System.out.println("Total elements in document: " + allElements.size());
```

  </TabItem>
</Tabs>

---

## Page Snapshots

Get a snapshot of a specific page:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Get snapshot of page 0
    page_snapshot = pdf.get_page_snapshot(0)
    
    # Access page information
    page_ref = page_snapshot.page_ref
    print(f"Page size: {page_ref.page_size}")
    print(f"Orientation: {page_ref.orientation}")
    
    # Get all elements on this page
    elements = page_snapshot.elements
    print(f"Elements on page: {len(elements)}")
    
    # Iterate through elements
    for element in elements:
        print(f"  {element.object_type}: {element.internal_id}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Get snapshot of page 0
const pageSnapshot = await pdf.getPageSnapshot(0);

// Access page information
const pageRef = pageSnapshot.pageRef;
console.log(`Page size: ${JSON.stringify(pageRef.pageSize)}`);
console.log(`Orientation: ${pageRef.orientation}`);

// Get all elements on this page
const elements = pageSnapshot.elements;
console.log(`Elements on page: ${elements.length}`);

// Iterate through elements
for (const element of elements) {
  console.log(`  ${element.type}: ${element.internalId}`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import com.tfc.pdf.pdfdancer.api.common.model.*;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Get snapshot of page 0
PageSnapshot pageSnapshot = pdf.getPageSnapshot(0);

// Access page information
PageRef pageRef = pageSnapshot.getPageRef();
System.out.println("Page size: " + pageRef.getPageSize());
System.out.println("Orientation: " + pageRef.getOrientation());

// Get all elements on this page
List<Element> elements = pageSnapshot.getElements();
System.out.println("Elements on page: " + elements.size());

// Iterate through elements
for (Element element : elements) {
    System.out.println("  " + element.getType() + ": " + element.getInternalId());
}
```

  </TabItem>
</Tabs>

### Using Page Object

You can also get a snapshot from a page object:

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    page = pdf.page(0)
    
    # Get snapshot from page object
    snapshot = page.get_snapshot()
    
    print(f"Elements: {len(snapshot.elements)}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);
const page = pdf.page(0);

// Get snapshot from page object
const snapshot = await page.getSnapshot();

console.log(`Elements: ${snapshot.elements.length}`);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
PDFDancer pdf = PDFDancer.createSession("document.pdf");
Page page = pdf.page(0);

// Get snapshot from page object
PageSnapshot snapshot = page.getSnapshot();

System.out.println("Elements: " + snapshot.getElements().size());
```

  </TabItem>
</Tabs>

---

## Filtering by Object Type

Snapshots can be filtered to only include specific types of elements:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, ObjectType

with PDFDancer.open("document.pdf") as pdf:
    # Get only paragraphs and images
    snapshot = pdf.get_document_snapshot(types="PARAGRAPH,IMAGE")
    
    # Count elements by type
    paragraph_count = 0
    image_count = 0
    
    for page_snap in snapshot.pages:
        for element in page_snap.elements:
            if element.object_type == "PARAGRAPH":
                paragraph_count += 1
            elif element.object_type == "IMAGE":
                image_count += 1
    
    print(f"Paragraphs: {paragraph_count}")
    print(f"Images: {image_count}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, ObjectType } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Get only paragraphs and images
const snapshot = await pdf.getDocumentSnapshot([
  ObjectType.PARAGRAPH,
  ObjectType.IMAGE
]);

// Count elements by type
let paragraphCount = 0;
let imageCount = 0;

for (const pageSnap of snapshot.pages) {
  for (const element of pageSnap.elements) {
    if (element.type === ObjectType.PARAGRAPH) {
      paragraphCount++;
    } else if (element.type === ObjectType.IMAGE) {
      imageCount++;
    }
  }
}

console.log(`Paragraphs: ${paragraphCount}`);
console.log(`Images: ${imageCount}`);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import com.tfc.pdf.pdfdancer.api.common.model.*;
import com.tfc.pdf.pdfdancer.api.common.model.ObjectType;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Get only paragraphs and images
DocumentSnapshot snapshot = pdf.getDocumentSnapshot("PARAGRAPH,IMAGE");

// Count elements by type
int paragraphCount = 0;
int imageCount = 0;

for (PageSnapshot pageSnap : snapshot.getPages()) {
    for (Element element : pageSnap.getElements()) {
        if (element.getType().equals("PARAGRAPH")) {
            paragraphCount++;
        } else if (element.getType().equals("IMAGE")) {
            imageCount++;
        }
    }
}

System.out.println("Paragraphs: " + paragraphCount);
System.out.println("Images: " + imageCount);
```

  </TabItem>
</Tabs>

**Available Object Types:**
- `PARAGRAPH` - Text paragraphs
- `TEXT_LINE` - Individual text lines
- `IMAGE` - Images
- `PATH` - Vector graphics (lines, shapes)
- `FORM_X_OBJECT` - Form XObjects (templates, watermarks)
- `FORM_FIELD` - AcroForm fields
- `PAGE` - Page references

---

## Use Cases

### 1. Bulk Text Extraction

Extract all text from a document efficiently:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Get snapshot with only text elements
    snapshot = pdf.get_document_snapshot(types="PARAGRAPH,TEXT_LINE")
    
    all_text = []
    for page_snap in snapshot.pages:
        for element in page_snap.elements:
            if hasattr(element, 'text') and element.text:
                all_text.append(element.text)
    
    full_text = "\n".join(all_text)
    print(full_text)
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Get snapshot with only text elements
const snapshot = await pdf.getDocumentSnapshot([
  ObjectType.PARAGRAPH,
  ObjectType.TEXT_LINE
]);

const allText: string[] = [];
for (const pageSnap of snapshot.pages) {
  for (const element of pageSnap.elements) {
    if ('text' in element && element.text) {
      allText.push(element.text);
    }
  }
}

const fullText = allText.join('\n');
console.log(fullText);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Get snapshot with only text elements
DocumentSnapshot snapshot = pdf.getDocumentSnapshot("PARAGRAPH,TEXT_LINE");

List<String> allText = new ArrayList<>();
for (PageSnapshot pageSnap : snapshot.getPages()) {
    for (Element element : pageSnap.getElements()) {
        if (element instanceof Paragraph) {
            Paragraph para = (Paragraph) element;
            if (para.getText() != null) {
                allText.add(para.getText());
            }
        } else if (element instanceof TextLine) {
            TextLine line = (TextLine) element;
            if (line.getText() != null) {
                allText.add(line.getText());
            }
        }
    }
}

String fullText = String.join("\n", allText);
System.out.println(fullText);
```

  </TabItem>
</Tabs>

### 2. Document Analysis

Analyze document structure and content distribution:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    snapshot = pdf.get_document_snapshot()
    
    # Analyze each page
    for i, page_snap in enumerate(snapshot.pages):
        elements_by_type = {}
        
        for element in page_snap.elements:
            obj_type = element.object_type
            elements_by_type[obj_type] = elements_by_type.get(obj_type, 0) + 1
        
        print(f"\nPage {i}:")
        for obj_type, count in elements_by_type.items():
            print(f"  {obj_type}: {count}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);
const snapshot = await pdf.getDocumentSnapshot();

// Analyze each page
for (const [i, pageSnap] of snapshot.pages.entries()) {
  const elementsByType = new Map<string, number>();
  
  for (const element of pageSnap.elements) {
    const count = elementsByType.get(element.type) || 0;
    elementsByType.set(element.type, count + 1);
  }
  
  console.log(`\nPage ${i}:`);
  for (const [objType, count] of elementsByType) {
    console.log(`  ${objType}: ${count}`);
  }
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import com.tfc.pdf.pdfdancer.api.common.model.*;
import java.util.HashMap;
import java.util.Map;

PDFDancer pdf = PDFDancer.createSession("document.pdf");
DocumentSnapshot snapshot = pdf.getDocumentSnapshot();

// Analyze each page
for (int i = 0; i < snapshot.getPages().size(); i++) {
    PageSnapshot pageSnap = snapshot.getPages().get(i);
    Map<String, Integer> elementsByType = new HashMap<>();

    for (Element element : pageSnap.getElements()) {
        String objType = element.getType();
        elementsByType.put(objType, elementsByType.getOrDefault(objType, 0) + 1);
    }

    System.out.println("\nPage " + i + ":");
    for (Map.Entry<String, Integer> entry : elementsByType.entrySet()) {
        System.out.println("  " + entry.getKey() + ": " + entry.getValue());
    }
}
```

  </TabItem>
</Tabs>

---

## Performance Benefits

Snapshots provide significant performance improvements:

1. **Single API Call**: Get all elements in one request instead of multiple selection calls
2. **Internal Caching**: Snapshots are cached automatically, making subsequent selections faster
3. **Efficient Filtering**: Filter by object type on the server side
4. **Bulk Operations**: Process multiple elements without repeated API calls

:::tip When to Use Snapshots
Use snapshots when you need to:
- Inspect or analyze the entire document structure
- Perform bulk operations on multiple elements
- Filter elements by type across multiple pages
- Extract all content of a specific type

For simple, targeted selections (e.g., finding one paragraph), use the regular `select_*` methods instead.
:::

---

## Next Steps

- [**Finding Content**](finding-content.md) – Learn about all selection methods
- [**Working with Text**](working-with-text.md) – Edit paragraphs and text lines
- [**Working with Images**](working-with-images.md) – Manipulate images in PDFs

