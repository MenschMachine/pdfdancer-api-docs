---
id: working-with-pages
title: Working with Pages
description: Access, inspect, create, move, and delete PDF pages with API v3.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Working with Pages

Page numbers in API v3 are one-based. `pdf.page(1)` returns a page-scoped client; the SDK's plural pages operation returns page clients for the current document.

The **Create a blank PDF** examples below are complete programs. They create `blank.pdf` with two portrait A4 pages; no input file is required.

## List and access pages

<Tabs>
<TabItem value="python-list" label="Python">

```python
pages = pdf.pages()
print(f"Page count: {len(pages)}")
for page in pages:
    print(page.page_number, page.size, page.page_orientation)

first_page = pdf.page(1)
```

</TabItem>
<TabItem value="typescript-list" label="TypeScript">

```typescript
const pages = await pdf.pages();
console.log(`Page count: ${pages.length}`);
for (const page of pages) {
  console.log(page.position.pageNumber, page.pageSize, page.orientation);
}

const firstPage = pdf.page(1);
```

</TabItem>
<TabItem value="java-list" label="Java">

```java
var pages = pdf.pages();
System.out.println("Page count: " + pages.size());
for (var page : pages) {
    System.out.println("Page " + page.getPageNumber());
}

var firstPage = pdf.page(1);
```

</TabItem>
</Tabs>

Page clients provide page-scoped text, image, path, Form XObject, and AcroForm-field operations.

## Create a blank PDF

Specify the initial page size, orientation, and number of blank pages.

<Tabs>
<TabItem value="python-new" label="Python">

```python
from pdfdancer import Orientation, PDFDancer, PageSize

with PDFDancer.new(
    page_size=PageSize.A4,
    orientation=Orientation.PORTRAIT,
    initial_page_count=2,
) as pdf:
    pdf.save("blank.pdf")
```

</TabItem>
<TabItem value="typescript-new" label="TypeScript">

```typescript
import {Orientation, PDFDancer} from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.new({
  pageSize: 'A4',
  orientation: Orientation.PORTRAIT,
  initialPageCount: 2,
});
await pdf.save('blank.pdf');
```

</TabItem>
<TabItem value="java-new" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.common.model.Orientation;
import com.pdfdancer.common.model.PageSize;

public class CreateBlankPdf {
    public static void main(String[] args) throws Exception {
        var pdf = PDFDancer.createNew(PageSize.A4, Orientation.PORTRAIT, 2);
        pdf.save("blank.pdf");
    }
}
```

</TabItem>
</Tabs>

Open `blank.pdf` and confirm that it contains two 595 × 842 point pages. The remaining examples assume an open `pdf` session.

## Inspect

Page-scoped selectors, builders, and text operations automatically restrict work to that page.

<Tabs>
<TabItem value="python-scope" label="Python">

```python
page = pdf.page(2)
images = page.select_images()
paths = page.select_paths()
```

</TabItem>
<TabItem value="typescript-scope" label="TypeScript">

```typescript
const page = pdf.page(2);
const images = await page.selectImages();
const paths = await page.selectPaths();
```

</TabItem>
<TabItem value="java-scope" label="Java">

```java
var page = pdf.page(2);
var images = page.selectImages();
var paths = page.selectPaths();
```

</TabItem>
</Tabs>

## Create and add

Create a blank document with an explicit page size, orientation, and initial page count. Add subsequent pages through the SDK's page builder, using either a standard `PageSize` or finite positive custom dimensions.

<Tabs>
<TabItem value="python-add" label="Python">

```python
standard = pdf.new_page().a4().landscape().at_page(2).add()
custom = pdf.new_page().custom_size(400, 600).portrait().add()
print(standard.position.page_number, custom.page_size)
```

</TabItem>
<TabItem value="typescript-add" label="TypeScript">

```typescript
const standard = await pdf.newPage().a4().landscape().atPage(2).add();
const custom = await pdf.newPage().customSize(400, 600).portrait().add();
console.log(standard.position.pageNumber, custom.pageSize);
```

</TabItem>
<TabItem value="java-add" label="Java">

```java
var standard = pdf.newPage().a4().landscape().atPage(2).add();
var custom = pdf.newPage().customSize(400, 600).portrait().add();
System.out.println(standard.getPosition().getPageNumber());
System.out.println(custom.getPageSize());
```

</TabItem>
</Tabs>

`atPage(2)`/`at_page(2)` inserts at one-based page number 2; it is not a zero-based list index. When the position is omitted, the new page is appended. Custom width and height are PDF points and must be finite and positive.

## Move and delete

Moving or deleting pages changes later page numbers. When deleting several known page numbers, process them from highest to lowest unless the SDK operation accepts the complete set atomically.

After adding, deleting, or moving pages, reacquire page clients rather than assuming an older page value still denotes the same page number.

<Tabs>
<TabItem value="python-move-delete" label="Python">

```python
if not pdf.move_page(3, 1):
    raise RuntimeError("Page move failed")

# Reacquire after reordering. Delete high page numbers first.
if not pdf.page(len(pdf.pages())).delete():
    raise RuntimeError("Page deletion failed")
```

</TabItem>
<TabItem value="typescript-move-delete" label="TypeScript">

```typescript
if (!await pdf.movePage(3, 1)) throw new Error('Page move failed');

// Reacquire after reordering. Delete high page numbers first.
const pages = await pdf.pages();
if (!await pdf.page(pages.length).delete()) throw new Error('Page deletion failed');
```

</TabItem>
<TabItem value="java-move-delete" label="Java">

```java
if (!pdf.movePage(3, 1)) throw new IllegalStateException("Page move failed");

// Reacquire after reordering. Delete high page numbers first.
int lastPage = pdf.pages().size();
if (!pdf.page(lastPage).delete()) {
    throw new IllegalStateException("Page deletion failed");
}
```

</TabItem>
</Tabs>

## Save

Every successful page operation changes the active session. Save after the complete sequence has succeeded, or retrieve the current PDF bytes for downstream processing.

<Tabs>
<TabItem value="python-save" label="Python">

```python
pdf.save("output.pdf")
pdf_bytes = pdf.get_bytes()
```

</TabItem>
<TabItem value="typescript-save" label="TypeScript">

```typescript
await pdf.save('output.pdf');
const pdfBytes = await pdf.getBytes();
```

</TabItem>
<TabItem value="java-save" label="Java">

```java
pdf.save("output.pdf");
byte[] pdfBytes = pdf.getFileBytes();
```

</TabItem>
</Tabs>
