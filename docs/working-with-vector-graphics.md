---
id: working-with-vector-graphics
title: Working with Vector Graphics
description: Learn how to select and manipulate vector paths and shapes in PDFs.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

PDFDancer allows you to work with vector graphics elements (paths) in PDFs. Paths are used to draw lines, shapes, and complex vector graphics.

---

## Selecting Paths

Paths are vector graphics elements in PDFs (lines, shapes, drawings).

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Get all paths on a specific page
    paths = pdf.page(3).select_paths()

    # Get paths at specific coordinates
    paths_at_point = pdf.page(3).select_paths_at(x=150, y=320)

    for path in paths:
        print(f"Path ID: {path.internal_id}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes);

// Get all paths on a specific page
const paths = await pdf.page(3).selectPaths();

// Get paths at specific coordinates
const pathsAtPoint = await pdf.page(3).selectPathsAt(150, 320);

for (const path of paths) {
  console.log(`Path ID: ${path.internalId}`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Understanding Vector Paths

Vector paths in PDFs can represent:
- Lines and curves
- Shapes (rectangles, circles, polygons)
- Complex drawings and diagrams
- Borders and decorative elements

---

## Working with Paths

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Select paths on a page
    paths = pdf.page(0).select_paths()

    print(f"Found {len(paths)} paths on page 0")

    # You can iterate through paths
    for i, path in enumerate(paths):
        print(f"Path {i}: {path.internal_id}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(pdfBytes);

// Select paths on a page
const paths = await pdf.page(0).selectPaths();

console.log(`Found ${paths.length} paths on page 0`);

// You can iterate through paths
for (const [i, path] of paths.entries()) {
  console.log(`Path ${i}: ${path.internalId}`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Next Steps

- [**Working with Fonts**](working-with-fonts.md) – Use custom fonts in your PDFs
- [**Details about Positioning**](positioning.md) – Understand PDF coordinate systems
- [**Cookbook**](cookbook.md) – See complete working examples
