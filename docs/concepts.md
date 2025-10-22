---
id: concepts
title: Core Concepts
description: Understand PDF fundamentals and PDFDancer's content model including Pages, Paragraphs, TextLines, Images, and more.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide explains the fundamental concepts you need to understand when working with PDFDancer, including both PDF-specific concepts and PDFDancer's content model.

---

## PDF Fundamentals

### PDF Coordinate System

PDF uses a **Cartesian coordinate system** with the origin at the **bottom-left corner** of the page:

- **X-axis**: Increases from left (0) to right
- **Y-axis**: Increases from bottom (0) to top
- **Units**: PDF points (1 point = 1/72 inch)

![PDF Coordinate System - Bottom-left origin with X increasing right, Y increasing up](/img/placeholders/coordinate-system-annotated.png)

:::info Visual Asset Needed
**Image:** `coordinate-system-annotated.png`
**Shows:** Real PDF page with annotated coordinate system - corners labeled with coordinates (0,0) at bottom-left and (612,792) at top-right, axes with arrows, and a sample element with its bounding box labeled.
**Details:** See `/static/img/placeholders/README.md` for full specifications.
:::

**Common Page Sizes**:
- **Letter (US)**: 612 × 792 points (8.5" × 11")
- **A4**: 595 × 842 points (210mm × 297mm)
- **Legal**: 612 × 1008 points (8.5" × 14")

### PDF Points

All measurements in PDF use **points** as the base unit:
- 1 point = 1/72 inch
- 72 points = 1 inch
- 1 inch margin = 72 points

### Bounding Rectangles

Every PDF element has a **bounding rectangle** that defines its position and size:

```python
{
    "x": 100,      # Left edge (from page left)
    "y": 500,      # Bottom edge (from page bottom)
    "width": 200,  # Width in points
    "height": 50   # Height in points
}
```

---

## PDFDancer Content Model

PDFDancer provides a structured way to interact with PDF content through several key object types.

### Pages

**Pages** are the fundamental containers in a PDF document. Each page has:
- A **page index** (zero-indexed: first page is page 0)
- **Dimensions** (width and height in points)
- A **bounding rectangle** defining its size
- **Content** (paragraphs, images, paths, form fields)

Pages are accessed using `pdf.page(index)`:

<Tabs>
  <TabItem value="python" label="Python">

```python
# Get first page
first_page = pdf.page(0)

# Get all pages
all_pages = pdf.pages()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// Get first page
const firstPage = pdf.page(0);

// Get all pages
const allPages = await pdf.pages();
```

  </TabItem>
</Tabs>

### Paragraphs

**Paragraphs** are PDFDancer's high-level text abstraction. A paragraph represents a logical block of text that may span multiple lines.

**Key Properties**:
- `text`: The complete text content
- `position`: Bounding rectangle and page location
- `internal_id`: Unique identifier within the PDF

**When to use Paragraphs**:
- Finding text blocks by content (e.g., "Invoice #12345")
- Editing multi-line text blocks
- Replacing entire sections of text
- Adding formatted text content

<Tabs>
  <TabItem value="python" label="Python">

```python
# Select all paragraphs
paragraphs = pdf.select_paragraphs()

# Select by text prefix
headers = pdf.select_paragraphs_starting_with("Chapter")

# Access paragraph properties
for para in paragraphs:
    print(f"Text: {para.text}")
    print(f"Position: {para.position.bounding_rect}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// Select all paragraphs
const paragraphs = await pdf.selectParagraphs();

// Select by text prefix
const headers = await pdf.selectParagraphsStartingWith('Chapter');

// Access paragraph properties
for (const para of paragraphs) {
  console.log(`Text: ${para.text}`);
  console.log(`Position: ${para.position.boundingRect}`);
}
```

  </TabItem>
</Tabs>

### TextLines

**TextLines** represent individual lines of text within a paragraph. They provide finer-grained control than paragraphs.

**Key Properties**:
- `text`: The text content of the line
- `position`: Bounding rectangle of the line
- `internal_id`: Unique identifier

**When to use TextLines**:
- Precise line-by-line text manipulation
- Finding single-line text elements
- Working with tabular data or structured text

<Tabs>
  <TabItem value="python" label="Python">

```python
# Select all text lines
lines = pdf.page(0).select_lines()

# Select lines by prefix
date_lines = pdf.select_text_lines_starting_with("Date:")

for line in lines:
    print(f"Line text: {line.text}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// Select all text lines
const lines = await pdf.page(0).selectLines();

// Select lines by prefix
const dateLines = await pdf.selectTextLinesStartingWith('Date:');

for (const line of lines) {
  console.log(`Line text: ${line.text}`);
}
```

  </TabItem>
</Tabs>

**Paragraph vs TextLine**:
- Use **Paragraphs** for semantic text blocks (headings, body text, captions)
- Use **TextLines** for precise line-level control or single-line elements

### Images

**Images** represent raster graphics (PNG, JPEG, etc.) embedded in the PDF.

**Key Properties**:
- `internal_id`: Unique identifier
- `position`: Bounding rectangle and location
- Image data (for export/manipulation)

**Common Operations**:
- Selecting images by position
- Adding new images at specific coordinates
- Deleting existing images
- Replacing images

<Tabs>
  <TabItem value="python" label="Python">

```python
# Select all images on a page
images = pdf.page(0).select_images()

# Select images at coordinates
images_at_point = pdf.page(0).select_images_at(x=100, y=500)

# Add a new image
pdf.new_image() \
    .from_file("logo.png") \
    .at(page=0, x=50, y=700) \
    .add()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// Select all images on a page
const images = await pdf.page(0).selectImages();

// Select images at coordinates
const imagesAtPoint = await pdf.page(0).selectImagesAt(100, 500);

// Add a new image
await pdf.newImage()
  .fromFile('logo.png')
  .at(0, 50, 700)
  .add();
```

  </TabItem>
</Tabs>

### Paths (Vector Graphics)

**Paths** are vector graphics elements that can represent lines, curves, shapes, and complex drawings.

**What Paths Represent**:
- Lines and curves (straight lines, Bézier curves)
- Shapes (rectangles, circles, polygons)
- Borders and decorative elements
- Technical drawings and diagrams

**Key Concepts**:
- **Bézier curves**: Mathematical curves defined by control points
- **Stroke**: The outline of a path (color, width)
- **Fill**: The interior color of closed paths

<Tabs>
  <TabItem value="python" label="Python">

```python
# Select all paths on a page
paths = pdf.page(0).select_paths()

# Select paths at specific coordinates
paths_at_point = pdf.page(0).select_paths_at(x=150, y=320)

for path in paths:
    print(f"Path ID: {path.internal_id}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// Select all paths on a page
const paths = await pdf.page(0).selectPaths();

// Select paths at specific coordinates
const pathsAtPoint = await pdf.page(0).selectPathsAt(150, 320);

for (const path of paths) {
  console.log(`Path ID: ${path.internalId}`);
}
```

  </TabItem>
</Tabs>

### Form Fields (AcroForms)

**Form Fields** are interactive elements in PDF forms (AcroForms) that can be filled programmatically.

**Common Field Types**:
- **Text fields**: Single-line or multi-line text input
- **Checkboxes**: Boolean on/off values
- **Radio buttons**: Single choice from multiple options
- **Dropdowns**: Selection from a list

**Key Properties**:
- `name`: Field identifier (e.g., "firstName", "email")
- `object_type`: Type of field
- `position`: Location on the page

<Tabs>
  <TabItem value="python" label="Python">

```python
# Select all form fields
fields = pdf.select_form_fields()

# Select by name
name_fields = pdf.select_form_fields_by_name("firstName")

# Fill a field
if name_fields:
    name_fields[0].edit().value("John Doe").apply()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// Select all form fields
const fields = await pdf.selectFormFields();

// Select by name
const nameFields = await pdf.selectFieldsByName('firstName');

// Fill a field
if (nameFields.length > 0) {
  await nameFields[0].fill('John Doe');
}
```

  </TabItem>
</Tabs>

### FormXObjects

**FormXObjects** (also called XObjects) are reusable content streams that can be referenced multiple times throughout a document.

**Use Cases**:
- Company logos appearing on every page
- Page headers and footers
- Watermarks
- Template overlays

**Benefits**:
- **Efficiency**: Content is stored once, referenced many times
- **Consistency**: Ensures identical appearance across pages
- **Smaller file size**: No content duplication

FormXObjects can be transformed (scaled, rotated, positioned) each time they're used without modifying the original content.

---

## Fonts

PDF supports both standard and custom fonts.

### Standard PDF Fonts

These 14 fonts are always available in PDFs:
- **Serif**: Times-Roman, Times-Bold, Times-Italic, Times-BoldItalic
- **Sans-serif**: Helvetica, Helvetica-Bold, Helvetica-Oblique, Helvetica-BoldOblique
- **Monospace**: Courier, Courier-Bold, Courier-Oblique, Courier-BoldOblique
- **Decorative**: Symbol, ZapfDingbats

### Custom Fonts

PDFDancer supports embedding custom TrueType fonts (.ttf) for precise typography.

<Tabs>
  <TabItem value="python" label="Python">

```python
# Use standard font
pdf.new_paragraph() \
    .text("Hello World") \
    .font("Helvetica", 12) \
    .add()

# Use custom font
pdf.new_paragraph() \
    .text("Custom Typography") \
    .font_from_file("custom-font.ttf", 14) \
    .add()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// Use standard font
await pdf.page(0).newParagraph()
  .text('Hello World')
  .font('Helvetica', 12)
  .apply();

// Use custom font
await pdf.page(0).newParagraph()
  .text('Custom Typography')
  .fontFromFile('custom-font.ttf', 14)
  .apply();
```

  </TabItem>
</Tabs>

---

## Position Objects

**Position** objects encapsulate coordinate information for precise element placement and selection.

### Creating Positions

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import Position, PositionMode

# Create position at point
position = Position.at_page_coordinates(page=0, x=100, y=200)

# Create position with bounding rect
position = Position(
    page_number=0,
    bounding_rect={"x": 100, "y": 200, "width": 50, "height": 30},
    mode=PositionMode.INTERSECT
)

# Use for selection
paragraphs = pdf.select_paragraphs_at(position)
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { Position, PositionMode } from 'pdfdancer-client-typescript';

// Create position at point
const position = Position.atPageCoordinates(0, 100, 200);

// Access position properties
const x = position.getX();
const y = position.getY();
const page = position.getPageNumber();

// Use for selection
const paragraphs = await pdf.page(0).selectParagraphsAt(x!, y!);
```

  </TabItem>
</Tabs>

### Position Modes

- **INTERSECT**: Select elements that overlap with the position area
- **CONTAIN**: Select elements fully contained within the position area
- **EXACT**: Select elements at exact coordinates

---

## Color

PDFDancer uses RGB color values for text and graphics.

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import Color

# Create colors
black = Color(0, 0, 0)
red = Color(255, 0, 0)
gray = Color(128, 128, 128)
custom = Color(70, 130, 180)  # Steel blue

# Apply to text
pdf.new_paragraph() \
    .text("Colored text") \
    .color(red) \
    .add()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { Color } from 'pdfdancer-client-typescript';

// Create colors
const black = new Color(0, 0, 0);
const red = new Color(255, 0, 0);
const gray = new Color(128, 128, 128);
const custom = new Color(70, 130, 180);  // Steel blue

// Apply to text
await pdf.page(0).newParagraph()
  .text('Colored text')
  .color(red)
  .apply();
```

  </TabItem>
</Tabs>

---

## Selection vs Creation

PDFDancer provides two primary workflows:

### Selection (Read/Modify)

Use `select_*` methods to find existing content:

```python
# Find existing content
paragraphs = pdf.select_paragraphs()
images = pdf.page(0).select_images()
fields = pdf.select_form_fields_by_name("email")

# Modify it
paragraphs[0].edit().replace("New text").apply()
```

### Creation (Add)

Use `new_*` methods to add new content:

```python
# Add new content
pdf.new_paragraph() \
    .text("New content") \
    .at(page_index=0, x=100, y=500) \
    .add()

pdf.new_image() \
    .from_file("logo.png") \
    .at(page=0, x=50, y=700) \
    .add()
```

---

## Fluent Builders

PDFDancer uses **fluent builder patterns** for creating and editing content. Builders allow you to chain method calls for readable, declarative code:

<Tabs>
  <TabItem value="python" label="Python">

```python
# Paragraph builder
pdf.new_paragraph() \
    .text("Hello World") \
    .font("Helvetica", 12) \
    .color(Color(0, 0, 0)) \
    .line_spacing(1.5) \
    .at(page_index=0, x=100, y=500) \
    .add()

# Edit builder
paragraph.edit() \
    .replace("New text") \
    .font("Helvetica-Bold", 14) \
    .color(Color(255, 0, 0)) \
    .apply()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// Paragraph builder
await pdf.page(0).newParagraph()
  .text('Hello World')
  .font('Helvetica', 12)
  .color(new Color(0, 0, 0))
  .lineSpacing(1.5)
  .at(100, 500)
  .apply();

// Edit builder
await paragraph.edit()
  .replace('New text')
  .font('Helvetica-Bold', 14)
  .color(new Color(255, 0, 0))
  .apply();
```

  </TabItem>
</Tabs>

---

## Thread Safety

:::danger Important
**PDFDancer sessions are not thread-safe and must not be used concurrently.**

Each session instance should only be accessed from a single thread at a time. Do not share session objects across threads or use them in concurrent operations.
:::

**Why This Matters:**

When you call `PDFDancer.open()`, you create a session that maintains state on both the client and server. Concurrent access from multiple threads can lead to:
- Race conditions and unpredictable behavior
- Corrupted PDF state
- API errors and failed operations

**Safe Patterns:**

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer
from concurrent.futures import ThreadPoolExecutor

# ✓ SAFE: Each thread creates its own session
def process_pdf(file_path: str) -> None:
    with PDFDancer.open(file_path) as pdf:
        # Operations on this session
        paragraphs = pdf.select_paragraphs()
        pdf.save(f"output_{file_path}")

# Process multiple PDFs in parallel - each gets its own session
with ThreadPoolExecutor() as executor:
    executor.map(process_pdf, ["doc1.pdf", "doc2.pdf", "doc3.pdf"])


# ✗ UNSAFE: Sharing a session across threads
pdf = PDFDancer.open("document.pdf")
def unsafe_operation():
    # DON'T DO THIS - multiple threads using the same session
    pdf.select_paragraphs()  # Not thread-safe!

with ThreadPoolExecutor() as executor:
    executor.submit(unsafe_operation)
    executor.submit(unsafe_operation)
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

// ✓ SAFE: Each async operation creates its own session
async function processPdf(filePath: string): Promise<void> {
  const pdfBytes = await fs.readFile(filePath);
  const pdf = await PDFDancer.open(pdfBytes);

  const paragraphs = await pdf.selectParagraphs();
  await pdf.save(`output_${filePath}`);
}

// Process multiple PDFs - each gets its own session
await Promise.all([
  processPdf('doc1.pdf'),
  processPdf('doc2.pdf'),
  processPdf('doc3.pdf')
]);


// ✗ UNSAFE: Sharing a session across concurrent operations
const pdf = await PDFDancer.open(pdfBytes);

// DON'T DO THIS - concurrent operations on the same session
await Promise.all([
  pdf.selectParagraphs(),  // Not safe!
  pdf.selectImages()       // Not safe!
]);
```

  </TabItem>
</Tabs>

**Best Practice:** Always create a new session instance for each thread or concurrent operation. Sessions are lightweight to create and are designed for single-threaded access.

---

## Next Steps

Now that you understand the core concepts, explore how to use them:

- [**Working with Pages**](working-with-pages.md) – Access and manipulate pages
- [**Working with Text**](working-with-text.md) – Select and edit paragraphs and text lines
- [**Working with Images**](working-with-images.md) – Add and manipulate images
- [**Details about Positioning**](positioning.md) – Master the PDF coordinate system
- [**Working with AcroForms**](working-with-acroforms.md) – Fill and manipulate form fields
- [**Working with Vector Graphics**](working-with-vector-graphics.md) – Work with paths and shapes
