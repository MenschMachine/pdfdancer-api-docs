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
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.client.rest.PathReference;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Get all paths on a specific page
List<PathReference> paths = pdf.page(3).selectPaths();

// Get paths at specific coordinates
List<PathReference> pathsAtPoint = pdf.page(3).selectPathsAt(150, 320);

for (PathReference path : paths) {
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
    paths = pdf.page(1).select_paths()

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
const paths = await pdf.page(1).selectPaths();

console.log(`Found ${paths.length} paths on page 0`);

// You can iterate through paths
for (const [i, path] of paths.entries()) {
  console.log(`Path ${i}: ${path.internalId}`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.client.rest.PathReference;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Select paths on a page
List<PathReference> paths = pdf.page(1).selectPaths();

System.out.println("Found " + paths.size() + " paths on page 0");

// You can iterate through paths
for (int i = 0; i < paths.size(); i++) {
    PathReference path = paths.get(i);
    System.out.println("Path " + i + ": " + path.getInternalId());
}
```

  </TabItem>
</Tabs>

---

## Modifying Path Colors

Modify the stroke and fill colors of existing paths. Use the `edit()` method on a path reference to obtain a `PathEdit` builder, then chain color methods and call `apply()` to persist changes.

:::info API Version
Path color modification is available via API v1. The v1 API uses 1-based page indexing.
:::

:::note Finalize Method: `apply()` vs `add()`
The new path color modification API (v1) uses `.apply()` to finalize builder operations, while the existing drawing API (v0) uses `.add()`. This is an intentional API version difference.
:::

### Basic Color Modification

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color

with PDFDancer.open("document.pdf") as pdf:
    # Select a path to modify
    paths = pdf.page(1).select_paths()
    path = paths[0]

    # Modify stroke color (RGB + alpha transparency)
    path.edit().stroke_color(Color(255, 0, 0, 255)).apply()

    # Modify fill color
    path.edit().fill_color(Color(0, 255, 0, 200)).apply()

    # Set both at once
    path.edit() \
        .stroke_color(Color(0, 0, 255)) \
        .fill_color(Color(255, 255, 0)) \
        .apply()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');

// Select a path to modify
const paths = await pdf.page(1).selectPaths();
const path = paths[0];

// Modify stroke color (RGB + alpha transparency)
await path.edit().strokeColor(new Color(255, 0, 0, 255)).apply();

// Modify fill color
await path.edit().fillColor(new Color(0, 255, 0, 200)).apply();

// Set both at once
await path.edit()
  .strokeColor(new Color(0, 0, 255))
  .fillColor(new Color(255, 255, 0))
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.client.common.model.Color;
import com.pdfdancer.client.rest.PathReference;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Select a path to modify
List<PathReference> paths = pdf.page(1).selectPaths();
PathReference path = paths.get(0);

// Modify stroke color (RGB + alpha transparency)
path.edit().strokeColor(new Color(255, 0, 0, 255)).apply();

// Modify fill color
path.edit().fillColor(new Color(0, 255, 0, 200)).apply();

// Set both at once
path.edit()
    .strokeColor(new Color(0, 0, 255))
    .fillColor(new Color(255, 255, 0))
    .apply();

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

### Color Transparency

The alpha component (0-255) controls transparency. Alpha defaults to 255 (fully opaque) when not specified.

<Tabs>
  <TabItem value="python" label="Python">

```python
# Semi-transparent red stroke (alpha = 128)
path.edit().stroke_color(Color(255, 0, 0, 128)).apply()

# Fully opaque (alpha = 255, default)
path.edit().stroke_color(Color(255, 0, 0)).apply()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// Semi-transparent red stroke (alpha = 128)
await path.edit().strokeColor(new Color(255, 0, 0, 128)).apply();

// Fully opaque (alpha = 255, default)
await path.edit().strokeColor(new Color(255, 0, 0)).apply();
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
// Semi-transparent red stroke (alpha = 128)
path.edit().strokeColor(new Color(255, 0, 0, 128)).apply();

// Fully opaque (alpha = 255, default)
path.edit().strokeColor(new Color(255, 0, 0)).apply();
```

  </TabItem>
</Tabs>

### Partial Updates

Omit a color to leave it unchanged. Setting a color to `null` is not supported.

<Tabs>
  <TabItem value="python" label="Python">

```python
# Only change stroke, leave fill unchanged
path.edit().stroke_color(Color(0, 0, 255)).apply()

# Only change fill, leave stroke unchanged
path.edit().fill_color(Color(255, 0, 0)).apply()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// Only change stroke, leave fill unchanged
await path.edit().strokeColor(new Color(0, 0, 255)).apply();

// Only change fill, leave stroke unchanged
await path.edit().fillColor(new Color(255, 0, 0)).apply();
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.common.model.Color;

// Only change stroke, leave fill unchanged
path.edit().strokeColor(new Color(0, 0, 255)).apply();

// Only change fill, leave stroke unchanged
path.edit().fillColor(new Color(255, 0, 0)).apply();
```

  </TabItem>
</Tabs>

:::caution Clearing Colors
Clearing stroke or fill colors is intentionally not supported. Passing `null` or omitting a color means "don't change". To remove a color from a path, consider recreating the path without that color property.
:::

### Error Handling

Handle errors that may occur when modifying path colors, such as invalid path references or color values.

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color
from pdfdancer.exceptions import PathNotFoundException, InvalidColorException

with PDFDancer.open("document.pdf") as pdf:
    try:
        paths = pdf.page(1).select_paths()
        path = paths[0]

        # Modify stroke color
        path.edit().stroke_color(Color(255, 0, 0)).apply()
        print("Color modified successfully")

    except PathNotFoundException:
        print("Error: Path does not exist")
    except InvalidColorException:
        print("Error: Invalid color value")
    except Exception as e:
        print(f"Error modifying path color: {e}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');

try {
  const paths = await pdf.page(1).selectPaths();
  const path = paths[0];

  // Modify stroke color
  await path.edit().strokeColor(new Color(255, 0, 0)).apply();
  console.log('Color modified successfully');

} catch (error) {
  if (error.code === 'PATH_NOT_FOUND') {
    console.error('Error: Path does not exist');
  } else if (error.code === 'INVALID_COLOR') {
    console.error('Error: Invalid color value');
  } else {
    console.error(`Error modifying path color: ${error.message}`);
  }
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.client.common.model.Color;
import com.pdfdancer.client.common.exception.PathNotFoundException;
import com.pdfdancer.client.common.exception.InvalidColorException;
import com.pdfdancer.client.rest.PathReference;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

try {
    List<PathReference> paths = pdf.page(1).selectPaths();
    PathReference path = paths.get(0);

    // Modify stroke color
    path.edit().strokeColor(new Color(255, 0, 0)).apply();
    System.out.println("Color modified successfully");

} catch (PathNotFoundException e) {
    System.err.println("Error: Path does not exist");
} catch (InvalidColorException e) {
    System.err.println("Error: Invalid color value");
} catch (Exception e) {
    System.err.println("Error modifying path color: " + e.getMessage());
}
```

  </TabItem>
</Tabs>

### Reading Path Colors

After modifying a path, retrieve the updated color information using the v1 API snapshot which includes path styling data.

:::info PathReference vs PathObjectRefV1
`selectPaths()` returns lightweight `PathReference` objects that support editing operations. To read styling properties like colors, use `getSnapshotV1()` which returns `PathObjectRefV1` objects containing full path metadata including stroke/fill colors and dash patterns.
:::

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Get v1 snapshot to see path colors
    snapshot = pdf.page(1).get_snapshot(api_version=1)

    for element in snapshot.elements:
        if element.type == "PATH":
            path_obj = element
            print(f"Path {path_obj.internal_id}:")
            print(f"  Stroke: {path_obj.stroke_color}")
            print(f"  Fill: {path_obj.fill_color}")
            print(f"  Stroke width: {path_obj.stroke_width}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open('document.pdf');

// Get v1 snapshot to see path colors
const snapshot = await pdf.page(1).getSnapshot({ apiVersion: 1 });

for (const element of snapshot.elements) {
  if (element.type === 'PATH') {
    const pathRef = element as PathObjectRefV1;
    console.log(`Path ${pathRef.internalId}:`);
    console.log(`  Stroke: ${pathRef.strokeColor}`);
    console.log(`  Fill: ${pathRef.fillColor}`);
    console.log(`  Stroke width: ${pathRef.strokeWidth}`);
  }
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.client.common.model.PathObjectRefV1;
import com.pdfdancer.client.common.model.ObjectRefV1;
import com.pdfdancer.client.common.response.PageSnapshotV1;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Get v1 snapshot to see path colors
PageSnapshotV1 snapshot = pdf.page(1).getSnapshotV1();

for (ObjectRefV1 element : snapshot.elements()) {
    if (element instanceof PathObjectRefV1 pathRef) {
        System.out.println("Path " + pathRef.getInternalId() + ":");
        System.out.println("  Stroke: " + pathRef.getStrokeColor());
        System.out.println("  Fill: " + pathRef.getFillColor());
        System.out.println("  Stroke width: " + pathRef.getStrokeWidth());
    }
}
```

  </TabItem>
</Tabs>

### PathObjectRefV1 Properties

When using the v1 API, paths are returned as `PathObjectRefV1` objects containing styling information:

| Property | Type | Description |
|----------|------|-------------|
| `internal_id` / `internalId` / `getInternalId()` | String | Unique identifier for the path |
| `type` | String | Object type, always `"PATH"` |
| `position` | Position | Page and coordinates (v1 uses 1-based page numbers) |
| `stroke_color` / `strokeColor` / `getStrokeColor()` | Color | Stroke outline color (may be null) |
| `fill_color` / `fillColor` / `getFillColor()` | Color | Fill color (may be null) |
| `stroke_width` / `strokeWidth` / `getStrokeWidth()` | Double | Stroke width in points (may be null) |
| `dash_array` / `dashArray` / `getDashArray()` | double[] | Dash pattern for dashed strokes |
| `dash_phase` / `dashPhase` / `getDashPhase()` | Double | Dash pattern offset |

---

## Path Grouping

Group multiple vector paths together and manipulate them as a unit. Path groups support moving, scaling, rotating, resizing, and removing all grouped paths at once.

### Creating Path Groups

You can create path groups by specifying explicit path IDs or by selecting all paths within a bounding region.

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, BoundingRect

with PDFDancer.open("document.pdf") as pdf:
    page = pdf.page(1)

    # Select paths to group
    paths = page.select_paths()
    path_ids = [paths[0].internal_id, paths[1].internal_id]

    # Group by explicit path IDs
    group = page.group_paths(path_ids)

    # Or group all paths within a bounding region
    region = BoundingRect(x=70, y=710, width=100, height=100)
    group = page.group_paths_in_region(region)

    print(f"Group contains {group.path_count} paths")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, BoundingRect } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');
const page = pdf.page(1);

// Select paths to group
const paths = await page.selectPaths();
const pathIds = [paths[0].internalId, paths[1].internalId];

// Group by explicit path IDs
const group = await page.groupPaths(pathIds);

// Or group all paths within a bounding region
const region = new BoundingRect(70, 710, 100, 100);
const regionGroup = await page.groupPathsInRegion(region);

console.log(`Group contains ${group.pathCount} paths`);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.client.rest.PathGroupReference;
import com.pdfdancer.common.model.BoundingRect;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Select paths to group
List<PathReference> paths = pdf.page(1).selectPaths();
List<String> pathIds = List.of(paths.get(0).getInternalId(), paths.get(1).getInternalId());

// Group by explicit path IDs
PathGroupReference group = pdf.page(1).groupPaths(pathIds);

// Or group all paths within a bounding region
BoundingRect region = new BoundingRect(70, 710, 100, 100);
PathGroupReference regionGroup = pdf.page(1).groupPathsInRegion(region);

System.out.println("Group contains " + group.getPathCount() + " paths");
```

  </TabItem>
</Tabs>

### Listing Path Groups

<Tabs>
  <TabItem value="python" label="Python">

```python
groups = pdf.page(1).get_path_groups()

for group in groups:
    print(f"Group {group.group_id}: {group.path_count} paths at ({group.x}, {group.y})")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const groups = await pdf.page(1).getPathGroups();

for (const group of groups) {
  console.log(`Group ${group.pathCount} paths at (${group.x}, ${group.y})`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
List<PathGroupReference> groups = pdf.page(1).getPathGroups();

for (PathGroupReference group : groups) {
    System.out.println("Group " + group.getGroupId() + ": " + group.getPathCount() + " paths");
}
```

  </TabItem>
</Tabs>

### Manipulating Path Groups

Once grouped, paths can be moved, scaled, rotated, resized, or removed as a unit.

<Tabs>
  <TabItem value="python" label="Python">

```python
# Move the group to a new position
group.move_to(200.0, 300.0)

# Scale the group by a factor
group.scale(2.0)

# Rotate the group by degrees
group.rotate(90.0)

# Resize the group to specific dimensions
group.resize(50.0, 50.0)

# Remove the group and all its paths
group.remove()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// Move the group to a new position
await group.moveTo(200.0, 300.0);

// Scale the group by a factor
await group.scale(2.0);

// Rotate the group by degrees
await group.rotate(90.0);

// Resize the group to specific dimensions
await group.resize(50.0, 50.0);

// Remove the group and all its paths
await group.remove();
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
// Move the group to a new position
group.moveTo(200.0, 300.0);

// Scale the group by a factor
group.scale(2.0);

// Rotate the group by degrees
group.rotate(90.0);

// Resize the group to specific dimensions
group.resize(50.0, 50.0);

// Remove the group and all its paths
group.remove();
```

  </TabItem>
</Tabs>

### Clearing Path Clipping

Some PDFs use clipping paths to hide vector artwork. If a path or grouped logo is still present in the document model but no longer visible after you move it, clear the inherited clipping before saving.

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    page = pdf.page(1)
    path = page.select_paths()[0]

    # Detach clipping from a single path
    path.clear_clipping()

    # Detach clipping from a grouped set of paths
    group = page.group_paths([path.internal_id])
    group.clear_clipping()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open('document.pdf');
const page = pdf.page(1);
const path = (await page.selectPaths())[0];

// Detach clipping from a single path
await path.clearClipping();

// Detach clipping from a grouped set of paths
const group = await page.groupPaths([path.internalId]);
await group.clearClipping();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.client.rest.PathGroupReference;
import com.pdfdancer.client.rest.PathReference;

PDFDancer pdf = PDFDancer.createSession("document.pdf");
PathReference path = pdf.page(1).selectPaths().get(0);

// Detach clipping from a single path
path.clearClipping();

// Detach clipping from a grouped set of paths
PathGroupReference group = pdf.page(1).groupPaths(java.util.List.of(path.getInternalId()));
group.clearClipping();

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

### Path Group Properties

| Property | Python | TypeScript | Java |
|----------|--------|------------|------|
| Group ID | `group.group_id` | `group.groupId` | `group.getGroupId()` |
| Path count | `group.path_count` | `group.pathCount` | `group.getPathCount()` |
| Bounding box | `group.bounding_box` | `group.boundingBox` | `group.getBoundingBox()` |
| X position | `group.x` | `group.x` | `group.getX()` |
| Y position | `group.y` | `group.y` | `group.getY()` |

---

## Drawing Lines

Create straight lines on a page:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color

with PDFDancer.open("document.pdf") as pdf:
    page = pdf.page(1)

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
const page = pdf.page(1);

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
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.client.common.model.Color;

PDFDancer pdf = PDFDancer.createSession("document.pdf");
Page page = pdf.page(1);

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
    .dashPattern(new double[]{5, 3})
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
    page = pdf.page(1)

    # Draw a stroked rectangle
    page.new_rectangle() \
        .at_coordinates(100, 200) \
        .with_size(200, 100) \
        .stroke_color(Color(0, 0, 255)) \
        .stroke_width(3) \
        .add()

    # Draw a filled rectangle
    page.new_rectangle() \
        .at_coordinates(350, 200) \
        .with_size(200, 100) \
        .fill_color(Color(255, 200, 0)) \
        .add()

    # Draw a rectangle with both stroke and fill
    page.new_rectangle() \
        .at_coordinates(100, 350) \
        .with_size(200, 100) \
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
const page = pdf.page(1);

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
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.client.common.model.Color;

PDFDancer pdf = PDFDancer.createSession("document.pdf");
Page page = pdf.page(1);

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
    page = pdf.page(1)

    # Draw a bezier curve
    page.new_bezier() \
        .from_point(100, 100) \
        .control_point_1(200, 200) \
        .control_point_2(300, 200) \
        .to_point(400, 100) \
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
const page = pdf.page(1);

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
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.client.common.model.Color;

PDFDancer pdf = PDFDancer.createSession("document.pdf");
Page page = pdf.page(1);

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

## PathBuilder: Programmatic Path Creation

The `newPath()` method returns a builder that lets you create complex vector paths programmatically. This builder pattern allows you to chain commands to construct shapes, curves, and complex drawings.

:::info TypeScript PathBuilder Class
In TypeScript SDK v1.0.22+, `newPath()` returns a `PathBuilder` instance that provides a fluent API for constructing vector paths. You can also import and use the `PathBuilder` class directly:

```typescript
import { PathBuilder } from 'pdfdancer-client-typescript';
```
:::

### Builder Pattern Basics

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color

with PDFDancer.open("document.pdf") as pdf:
    # new_path() returns a builder - chain commands and call add()
    pdf.page(1).new_path() \
        .add_line(Point(100, 100), Point(200, 200)) \
        .stroke_color(Color(0, 0, 0)) \
        .stroke_width(2) \
        .add()  # Finalizes and adds the path to the page
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');

// newPath() returns a PathBuilder - chain commands and call apply()
await pdf.page(1).newPath()
  .moveTo(100, 100)
  .lineTo(200, 200)
  .strokeColor(new Color(0, 0, 0))
  .strokeWidth(2)
  .apply();  // Finalizes and adds the path to the page
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.*;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// newPath() returns a builder - chain commands and call add()
pdf.page(1).newPath()
    .moveTo(100, 100)
    .lineTo(200, 200)
    .strokeColor(new Color(0, 0, 0))
    .strokeWidth(2)
    .add();  // Finalizes and adds the path to the page
```

  </TabItem>
</Tabs>

### Advanced Fill Rules

For complex shapes with overlapping regions, you can control the fill behavior:

<Tabs>
  <TabItem value="typescript" label="TypeScript">

```typescript
// Even-odd fill rule for complex shapes
await pdf.page(1).newPath()
  .moveTo(100, 100)
  .lineTo(200, 100)
  .lineTo(200, 200)
  .lineTo(100, 200)
  .closePath()
  .fillColor(new Color(255, 0, 0))
  .evenOddFill(true)  // Use even-odd winding rule
  .apply();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
# Even-odd fill rule supported in Python SDK
# (Check API documentation for current implementation status)
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
// Even-odd fill rule supported in Java SDK
// (Check API documentation for current implementation status)
```

  </TabItem>
</Tabs>

:::tip Even-Odd Fill Rule
The even-odd rule determines whether a point is inside a path by drawing a line from that point to infinity and counting how many times it crosses the path. If the count is odd, the point is inside; if even, it's outside. This is useful for creating shapes with holes or complex overlapping regions.
:::

### PathBuilder API Reference

Complete list of PathBuilder methods:

**Drawing Commands:**
- `moveTo(x, y)` - Move to a point without drawing (sets the current point)
- `lineTo(x, y)` - Draw a line from current point to (x, y)
- `bezierTo(cp1x, cp1y, cp2x, cp2y, x, y)` - Draw a cubic Bezier curve
- `closePath()` - Draw a line back to the starting point

**Styling:**
- `strokeColor(Color)` - Set the outline color
- `fillColor(Color)` - Set the fill color
- `strokeWidth(number)` - Set outline width in points
- `dashPattern([on, off, ...])` - Set dash pattern for strokes

**Advanced:**
- `dashPhase(number)` - Set the offset for dash patterns
- `evenOddFill(boolean)` - Use even-odd fill rule (TypeScript)

**Finalize:**
- `at(pageNumber, x, y)` / `at(x, y)` - Set position and optionally page index
- `add()` / `apply()` - Add the path to the document

:::note Python Method Names
Python uses snake_case: `move_to()`, `line_to()`, `stroke_color()`, etc.
:::

---

## Drawing Complex Paths

Create complex vector graphics using path commands:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color, Point

with PDFDancer.open("document.pdf") as pdf:
    page = pdf.page(1)

    # Draw a complex path (triangle)
    page.new_path() \
        .add_line(Point(250, 100), Point(350, 250)) \
        .add_line(Point(350, 250), Point(150, 250)) \
        .add_line(Point(150, 250), Point(250, 100)) \
        .stroke_color(Color(128, 0, 128)) \
        .stroke_width(3) \
        .fill_color(Color(255, 200, 255)) \
        .add()

    # Draw a path with curves
    page.new_path() \
        .add_line(Point(100, 400), Point(200, 400)) \
        .add_bezier(Point(200, 400), Point(250, 450), Point(300, 450), Point(350, 400)) \
        .add_line(Point(350, 400), Point(450, 400)) \
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
const page = pdf.page(1);

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
  .bezierTo(250, 450, 300, 450, 350, 400)
  .lineTo(450, 400)
  .strokeColor(new Color(255, 100, 0))
  .strokeWidth(2)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.client.common.model.Color;

PDFDancer pdf = PDFDancer.createSession("document.pdf");
Page page = pdf.page(1);

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
- **`add_bezier(...)`** / **`bezierTo(cp1x, cp1y, cp2x, cp2y, x, y)`** / **`curveTo(...)`** - Draw a cubic Bezier curve
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
