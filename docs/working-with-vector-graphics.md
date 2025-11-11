---
id: working-with-vector-graphics
title: Working with Vector Graphics
description: Learn how to select, create, and manipulate vector paths and shapes in PDFs.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

PDFDancer allows you to work with vector graphics elements (paths) in PDFs. You can both select existing paths and create new ones - draw lines, shapes, bezier curves, and complex vector graphics.

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

const pdf = await PDFDancer.open('document.pdf');

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

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import com.tfc.pdf.pdfdancer.api.common.model.*;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Get all paths on a specific page
List<Path> paths = pdf.page(3).selectPaths();

// Get paths at specific coordinates
List<Path> pathsAtPoint = pdf.page(3).selectPathsAt(150, 320);

for (Path path : paths) {
    System.out.println("Path ID: " + path.getInternalId());
}
```

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
const pdf = await PDFDancer.open('document.pdf');

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

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Select paths on a page
List<Path> paths = pdf.page(0).selectPaths();

System.out.println("Found " + paths.size() + " paths on page 0");

// You can iterate through paths
for (int i = 0; i < paths.size(); i++) {
    Path path = paths.get(i);
    System.out.println("Path " + i + ": " + path.getInternalId());
}
```

  </TabItem>
</Tabs>

---

## Drawing Lines

Create straight lines on a page:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color

with PDFDancer.open("document.pdf") as pdf:
    page = pdf.page(0)

    # Draw a simple line
    page.new_line() \
        .from_point(100, 100) \
        .to_point(400, 100) \
        .stroke_color(Color(0, 0, 0)) \
        .stroke_width(2) \
        .add()

    # Draw a dashed line
    page.new_line() \
        .from_point(100, 150) \
        .to_point(400, 150) \
        .stroke_color(Color(255, 0, 0)) \
        .stroke_width(1) \
        .dash_pattern([5, 3]) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');
const page = pdf.page(0);

// Draw a simple line
await page.newLine()
  .fromPoint(100, 100)
  .toPoint(400, 100)
  .strokeColor(new Color(0, 0, 0))
  .strokeWidth(2)
  .apply();

// Draw a dashed line
await page.newLine()
  .fromPoint(100, 150)
  .toPoint(400, 150)
  .strokeColor(new Color(255, 0, 0))
  .strokeWidth(1)
  .dashPattern([5, 3])
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import com.tfc.pdf.pdfdancer.api.common.model.*;

PDFDancer pdf = PDFDancer.createSession("document.pdf");
Page page = pdf.page(0);

// Draw a simple line
page.newLine()
    .fromPoint(100, 100)
    .toPoint(400, 100)
    .strokeColor(new Color(0, 0, 0))
    .strokeWidth(2)
    .add();

// Draw a dashed line
page.newLine()
    .fromPoint(100, 150)
    .toPoint(400, 150)
    .strokeColor(new Color(255, 0, 0))
    .strokeWidth(1)
    .dashPattern(new int[]{5, 3})
    .add();

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

---

## Drawing Rectangles

Create rectangles with stroke and fill:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color

with PDFDancer.open("document.pdf") as pdf:
    page = pdf.page(0)

    # Draw a stroked rectangle
    page.new_rectangle() \
        .at(100, 200) \
        .size(200, 100) \
        .stroke_color(Color(0, 0, 255)) \
        .stroke_width(3) \
        .add()

    # Draw a filled rectangle
    page.new_rectangle() \
        .at(350, 200) \
        .size(200, 100) \
        .fill_color(Color(255, 200, 0)) \
        .add()

    # Draw a rectangle with both stroke and fill
    page.new_rectangle() \
        .at(100, 350) \
        .size(200, 100) \
        .stroke_color(Color(0, 0, 0)) \
        .stroke_width(2) \
        .fill_color(Color(200, 200, 255)) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');
const page = pdf.page(0);

// Draw a stroked rectangle
await page.newRectangle()
  .at(100, 200)
  .size(200, 100)
  .strokeColor(new Color(0, 0, 255))
  .strokeWidth(3)
  .apply();

// Draw a filled rectangle
await page.newRectangle()
  .at(350, 200)
  .size(200, 100)
  .fillColor(new Color(255, 200, 0))
  .apply();

// Draw a rectangle with both stroke and fill
await page.newRectangle()
  .at(100, 350)
  .size(200, 100)
  .strokeColor(new Color(0, 0, 0))
  .strokeWidth(2)
  .fillColor(new Color(200, 200, 255))
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import com.tfc.pdf.pdfdancer.api.common.model.*;

PDFDancer pdf = PDFDancer.createSession("document.pdf");
Page page = pdf.page(0);

// Draw a stroked rectangle
page.newRectangle()
    .at(100, 200)
    .size(200, 100)
    .strokeColor(new Color(0, 0, 255))
    .strokeWidth(3)
    .add();

// Draw a filled rectangle
page.newRectangle()
    .at(350, 200)
    .size(200, 100)
    .fillColor(new Color(255, 200, 0))
    .add();

// Draw a rectangle with both stroke and fill
page.newRectangle()
    .at(100, 350)
    .size(200, 100)
    .strokeColor(new Color(0, 0, 0))
    .strokeWidth(2)
    .fillColor(new Color(200, 200, 255))
    .add();

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

---

## Drawing Bezier Curves

Create smooth curves using cubic Bezier curves:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color

with PDFDancer.open("document.pdf") as pdf:
    page = pdf.page(0)

    # Draw a bezier curve
    page.new_bezier() \
        .start_point(100, 100) \
        .control_point_1(200, 200) \
        .control_point_2(300, 200) \
        .end_point(400, 100) \
        .stroke_color(Color(0, 128, 0)) \
        .stroke_width(2) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');
const page = pdf.page(0);

// Draw a bezier curve
await page.newBezier()
  .startPoint(100, 100)
  .controlPoint1(200, 200)
  .controlPoint2(300, 200)
  .endPoint(400, 100)
  .strokeColor(new Color(0, 128, 0))
  .strokeWidth(2)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import com.tfc.pdf.pdfdancer.api.common.model.*;

PDFDancer pdf = PDFDancer.createSession("document.pdf");
Page page = pdf.page(0);

// Draw a bezier curve
page.newBezier()
    .startPoint(100, 100)
    .controlPoint1(200, 200)
    .controlPoint2(300, 200)
    .endPoint(400, 100)
    .strokeColor(new Color(0, 128, 0))
    .strokeWidth(2)
    .add();

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

---

## Drawing Complex Paths

Create complex vector graphics using path commands:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color

with PDFDancer.open("document.pdf") as pdf:
    page = pdf.page(0)

    # Draw a complex path (triangle)
    page.new_path() \
        .move_to(250, 100) \
        .line_to(350, 250) \
        .line_to(150, 250) \
        .close_path() \
        .stroke_color(Color(128, 0, 128)) \
        .stroke_width(3) \
        .fill_color(Color(255, 200, 255)) \
        .add()

    # Draw a path with curves
    page.new_path() \
        .move_to(100, 400) \
        .line_to(200, 400) \
        .curve_to(250, 450, 300, 450, 350, 400) \
        .line_to(450, 400) \
        .stroke_color(Color(255, 100, 0)) \
        .stroke_width(2) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');
const page = pdf.page(0);

// Draw a complex path (triangle)
await page.newPath()
  .moveTo(250, 100)
  .lineTo(350, 250)
  .lineTo(150, 250)
  .closePath()
  .strokeColor(new Color(128, 0, 128))
  .strokeWidth(3)
  .fillColor(new Color(255, 200, 255))
  .apply();

// Draw a path with curves
await page.newPath()
  .moveTo(100, 400)
  .lineTo(200, 400)
  .curveTo(250, 450, 300, 450, 350, 400)
  .lineTo(450, 400)
  .strokeColor(new Color(255, 100, 0))
  .strokeWidth(2)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import com.tfc.pdf.pdfdancer.api.common.model.*;

PDFDancer pdf = PDFDancer.createSession("document.pdf");
Page page = pdf.page(0);

// Draw a complex path (triangle)
page.newPath()
    .moveTo(250, 100)
    .lineTo(350, 250)
    .lineTo(150, 250)
    .closePath()
    .strokeColor(new Color(128, 0, 128))
    .strokeWidth(3)
    .fillColor(new Color(255, 200, 255))
    .add();

// Draw a path with curves
page.newPath()
    .moveTo(100, 400)
    .lineTo(200, 400)
    .curveTo(250, 450, 300, 450, 350, 400)
    .lineTo(450, 400)
    .strokeColor(new Color(255, 100, 0))
    .strokeWidth(2)
    .add();

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

### Path Commands

Available path commands:

- **`move_to(x, y)`** / **`moveTo(x, y)`** - Move to a point without drawing
- **`line_to(x, y)`** / **`lineTo(x, y)`** - Draw a straight line to a point
- **`curve_to(cp1x, cp1y, cp2x, cp2y, x, y)`** / **`curveTo(...)`** - Draw a cubic Bezier curve
- **`close_path()`** / **`closePath()`** - Close the current path by drawing a line to the start point

---

## Styling Options

All vector graphics support these styling options:

### Stroke (Outline)

- **`stroke_color(Color)`** / **`strokeColor(Color)`** - Set the outline color
- **`stroke_width(number)`** / **`strokeWidth(number)`** - Set the outline width in points
- **`dash_pattern([on, off, ...])`** / **`dashPattern([on, off, ...])`** - Create dashed lines

### Fill

- **`fill_color(Color)`** / **`fillColor(Color)`** - Set the fill color for closed shapes

:::tip Stroke vs Fill
- Use **stroke** for outlines and lines
- Use **fill** for solid shapes
- Use **both** for outlined shapes with a fill color
- Omit both to create invisible paths (useful for clipping regions)
:::

---

## Next Steps

- [**Working with Fonts**](working-with-fonts.md) – Use custom fonts in your PDFs
- [**Details about Positioning**](positioning.md) – Understand PDF coordinate systems
- [**Cookbook**](cookbook.md) – See complete working examples
