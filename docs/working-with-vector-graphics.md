---
id: working-with-vector-graphics
title: Working with Vector Graphics
description: Select, create, and edit paths, lines, rectangles, and Bézier curves in PDF documents using typed vector editing operations.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Working with Vector Graphics

PDF vector graphics are represented as paths. API v3 provides typed selected paths plus dedicated path, line, rectangle, and Bézier builders.

## Complete path-editing workflow

Download [paths.pdf](/files/v3/samples/paths.pdf) as `input.pdf`. The program changes the first path's stroke color and saves `output.pdf`.

<Tabs>
<TabItem value="python-complete" label="Python">

```python
from pathlib import Path
from pdfdancer import Color, PDFDancer

with PDFDancer.open(Path("input.pdf")) as pdf:
    paths = pdf.page(1).select_paths()
    if not paths:
        raise RuntimeError("The sample path was not found")
    result = paths[0].edit().stroke_color(Color(220, 30, 30)).apply()
    if not result.success:
        raise RuntimeError(result.message)
    pdf.save("output.pdf")
```

</TabItem>
<TabItem value="typescript-complete" label="TypeScript">

```typescript
import * as fs from 'node:fs';
import {Color, PDFDancer} from 'pdfdancer-client-typescript';

const input = new Uint8Array(fs.readFileSync('input.pdf'));
const pdf = await PDFDancer.open(input);
const paths = await pdf.page(1).selectPaths();
if (paths.length === 0) throw new Error('The sample path was not found');
const result = await paths[0].edit().strokeColor(new Color(220, 30, 30)).apply();
if (!result.success) throw new Error(result.message ?? 'Path edit failed');
await pdf.save('output.pdf');
```

</TabItem>
<TabItem value="java-complete" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.common.model.Color;

public class EditPath {
    public static void main(String[] args) throws Exception {
        PDFDancer pdf = PDFDancer.createSession("input.pdf");
        var paths = pdf.page(1).selectPaths();
        if (paths.isEmpty()) throw new IllegalStateException("The sample path was not found");
        var result = paths.get(0).edit().strokeColor(new Color(220, 30, 30)).apply();
        if (!result.success()) throw new IllegalStateException(result.message());
        pdf.save("./output.pdf");
    }
}
```

</TabItem>
</Tabs>

Open `output.pdf` and confirm that the first path has a red stroke. The remaining examples assume an open `pdf` session.

## Draw a filled rectangle

<Tabs>
<TabItem value="python" label="Python">

```python
from pdfdancer import Color

pdf.page(1).new_rectangle() \
    .at_coordinates(72, 500) \
    .with_size(220, 80) \
    .stroke_color(Color(0, 0, 0)) \
    .fill_color(Color(255, 245, 190)) \
    .stroke_width(1.5) \
    .add()
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
import {Color} from 'pdfdancer-client-typescript';

await pdf.page(1).newRectangle()
  .at(72, 500)
  .size(220, 80)
  .strokeColor(Color.BLACK)
  .fillColor(new Color(255, 245, 190))
  .strokeWidth(1.5)
  .add();
```

</TabItem>
<TabItem value="java" label="Java">

```java
import com.pdfdancer.common.model.Color;

pdf.page(1).newRectangle()
        .at(72, 500)
        .size(220, 80)
        .color(Color.BLACK)
        .fillColor(new Color(255, 245, 190))
        .lineWidth(1.5)
        .add();
```

</TabItem>
</Tabs>

## Edit an existing path

Select a path, open its edit session, set the desired appearance, and apply once. The edit-session method names follow each language's normal casing. Check the returned `CommandResult` before saving.

<Tabs>
<TabItem value="python-edit" label="Python">

```python
from pdfdancer import Color

path = pdf.page(1).select_path_at(72, 500, tolerance=1.0)
if path is None:
    raise RuntimeError("Path not found")
result = path.edit().stroke_color(Color(220, 30, 30)).fill_color(Color(255, 230, 230)).apply()
if not result.success:
    raise RuntimeError(result.message)
```

</TabItem>
<TabItem value="typescript-edit" label="TypeScript">

```typescript
import {Color} from 'pdfdancer-client-typescript';

const path = await pdf.page(1).selectPathAt(72, 500, 1.0);
if (!path) throw new Error('Path not found');
const result = await path.edit()
  .strokeColor(new Color(220, 30, 30))
  .fillColor(new Color(255, 230, 230))
  .apply();
if (!result.success) throw new Error(result.message ?? 'Path edit failed');
```

</TabItem>
<TabItem value="java-edit" label="Java">

```java
import com.pdfdancer.common.model.Color;

var path = pdf.page(1).selectPathAt(72, 500, 1.0)
        .orElseThrow(() -> new IllegalStateException("Path not found"));
var result = path.edit()
        .strokeColor(new Color(220, 30, 30))
        .fillColor(new Color(255, 230, 230))
        .apply();
if (!result.success()) throw new IllegalStateException(result.message());
```

</TabItem>
</Tabs>

## Create paths

- A line builder configures two endpoints, stroke, and width.
- A rectangle builder configures origin, dimensions, stroke, and optional fill.
- A Bézier builder configures endpoints and two control points.
- A path builder supports cursor operations, multiple segments, closing, rectangles, circles, dash patterns, and solid fills.

A circle is a path-builder convenience, not a separate public builder type.

### Draw lines and Bézier curves

<Tabs>
<TabItem value="python-curves" label="Python">

```python
from pdfdancer import Color

line_added = pdf.page(1).new_line() \
    .from_point(20, 40).to_point(120, 40) \
    .stroke_color(Color(0, 0, 0)).stroke_width(2) \
    .dash_pattern([4, 2]).add()

curve_added = pdf.page(1).new_bezier() \
    .from_point(20, 100) \
    .control_point_1(50, 140) \
    .control_point_2(90, 60) \
    .to_point(120, 100) \
    .stroke_color(Color(30, 90, 220)).add()

if not line_added or not curve_added:
    raise RuntimeError("Vector object could not be added")
```

</TabItem>
<TabItem value="typescript-curves" label="TypeScript">

```typescript
import {Color} from 'pdfdancer-client-typescript';

const lineAdded = await pdf.page(1).newLine()
  .from(20, 40).to(120, 40)
  .strokeColor(Color.BLACK).strokeWidth(2)
  .dashPattern([4, 2]).add();

const curveAdded = await pdf.page(1).newBezier()
  .from(20, 100)
  .control1(50, 140)
  .control2(90, 60)
  .to(120, 100)
  .strokeColor(new Color(30, 90, 220)).add();

if (!lineAdded || !curveAdded) throw new Error('Vector object could not be added');
```

</TabItem>
<TabItem value="java-curves" label="Java">

```java
import com.pdfdancer.common.model.Color;

boolean lineAdded = pdf.page(1).newLine()
        .from(20, 40).to(120, 40)
        .color(Color.BLACK).lineWidth(2)
        .dash(4, 2).add();

boolean curveAdded = pdf.page(1).newBezier()
        .from(20, 100)
        .control1(50, 140)
        .control2(90, 60)
        .to(120, 100)
        .color(new Color(30, 90, 220)).add();

if (!lineAdded || !curveAdded) {
    throw new IllegalStateException("Vector object could not be added");
}
```

</TabItem>
</Tabs>

### Build a multi-segment path

`closePath` connects the current point to the subpath's starting point. It does not fill the path; set a fill color separately. `dashPattern` controls the stroke. `solid` removes a previously configured dash pattern.

<Tabs>
<TabItem value="python-path" label="Python">

```python
added = pdf.page(1).new_path() \
    .move_to(100, 100) \
    .line_to(200, 100) \
    .bezier_to(230, 100, 230, 180, 200, 180) \
    .line_to(100, 180) \
    .close_path() \
    .stroke_color(Color(220, 30, 30)) \
    .fill_color(Color(255, 230, 230)) \
    .stroke_width(2) \
    .dash_pattern([5, 2]) \
    .add()
```

</TabItem>
<TabItem value="typescript-path" label="TypeScript">

```typescript
const added = await pdf.page(1).newPath()
  .moveTo(100, 100)
  .lineTo(200, 100)
  .bezierTo(230, 100, 230, 180, 200, 180)
  .lineTo(100, 180)
  .closePath()
  .strokeColor(new Color(220, 30, 30))
  .fillColor(new Color(255, 230, 230))
  .strokeWidth(2)
  .dashPattern([5, 2])
  .add();
```

</TabItem>
<TabItem value="java-path" label="Java">

```java
boolean added = pdf.page(1).newPath()
        .moveTo(100, 100)
        .lineTo(200, 100)
        .bezierTo(230, 100, 230, 180, 200, 180)
        .lineTo(100, 180)
        .closePath()
        .color(new Color(220, 30, 30))
        .fillColor(new Color(255, 230, 230))
        .lineWidth(2)
        .dash(5, 2)
        .add();
```

</TabItem>
</Tabs>

The path builder also provides `rectangle(...)` and `circle(...)` conveniences:

<Tabs>
<TabItem value="python-shapes" label="Python">

```python
rectangle = pdf.page(1).new_path().rectangle(72, 300, 120, 60).add()
circle = pdf.page(1).new_path().circle(260, 330, 30).even_odd_fill().add()
```

</TabItem>
<TabItem value="typescript-shapes" label="TypeScript">

```typescript
const rectangle = await pdf.page(1).newPath().rectangle(72, 300, 120, 60).add();
const circle = await pdf.page(1).newPath().circle(260, 330, 30).evenOddFill(true).add();
```

</TabItem>
<TabItem value="java-shapes" label="Java">

```java
boolean rectangle = pdf.page(1).newPath().rect(72, 300, 120, 60).add();
boolean circle = pdf.page(1).newPath().circle(260, 330, 30).evenOddFill(true).add();
```

</TabItem>
</Tabs>

## Select and edit

Select paths at document or page scope, including coordinate-based selection. A path edit session batches stroke and fill color changes before applying them. Selected paths also support movement, deletion, and clearing clipping.

<Tabs>
<TabItem value="python-select" label="Python">

```python
all_paths = pdf.select_paths()
page_paths = pdf.page(1).select_paths()
paths_at_point = pdf.page(1).select_paths_at(80, 720, tolerance=1.0)
path = pdf.page(1).select_path_at(80, 720, tolerance=1.0)

if path is not None:
    moved = path.move_to(100, 700)
    unclipped = path.clear_clipping()
    deleted = path.delete()
```

</TabItem>
<TabItem value="typescript-select" label="TypeScript">

```typescript
const allPaths = await pdf.selectPaths();
const pagePaths = await pdf.page(1).selectPaths();
const pathsAtPoint = await pdf.page(1).selectPathsAt(80, 720, 1.0);
const path = await pdf.page(1).selectPathAt(80, 720, 1.0);

if (path) {
  const moved = await path.moveTo(100, 700);
  const unclipped = await path.clearClipping();
  const deleted = await path.delete();
}
```

</TabItem>
<TabItem value="java-select" label="Java">

```java
var allPaths = pdf.selectPaths();
var pagePaths = pdf.page(1).selectPaths();
var pathsAtPoint = pdf.page(1).selectPathsAt(80, 720, 1.0);
var path = pdf.page(1).selectPathAt(80, 720, 1.0);

if (path.isPresent()) {
    boolean moved = path.get().moveTo(100, 700);
    boolean unclipped = path.get().clearClipping();
    boolean deleted = path.get().delete();
}
```

</TabItem>
</Tabs>

The three operations in the final example are alternatives. Re-select the path after moving it before applying an operation that depends on its current position.

## Geometry and appearance

Keep coordinates in PDF points. Stroke width, dash pattern, stroke color, fill color, and winding behavior affect rendering independently. Closing a path and filling it are separate decisions.

After clearing clipping or changing complex geometry, save and visually inspect the PDF; a successful command result does not by itself establish that the new shape matches the intended design.
