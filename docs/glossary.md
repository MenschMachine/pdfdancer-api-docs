---
id: glossary
title: Glossary
description: Definitions of key PDF and PDFDancer terminology.
---

A reference guide to PDF and PDFDancer terminology.

---

## A

### AcroForm

The standard PDF form technology for interactive form fields. AcroForms support text fields, checkboxes, radio buttons, dropdowns, and buttons. PDFDancer can select, fill, and modify AcroForm fields programmatically.

**See also:** [Working with AcroForms](working-with-acroforms.md)

---

## B

### Bounding Rectangle (Bounding Rect)

A rectangle that defines the position and size of a PDF element. Contains four values: `x` (left edge), `y` (bottom edge), `width`, and `height`, all measured in points from the page origin.

### Builder Pattern

A design pattern used throughout PDFDancer for creating and editing content. Builders allow chaining method calls for readable, declarative code (e.g., `pdf.new_paragraph().text("Hello").font("Helvetica", 12).add()`).

**See also:** [Fluent Builders](concepts.md#fluent-builders)

---

## C

### Coordinate System

PDF uses a Cartesian coordinate system with the origin (0, 0) at the **bottom-left corner** of the page. The X-axis increases from left to right, and the Y-axis increases from bottom to top. All measurements are in points.

**See also:** [PDF Coordinate System](concepts.md#pdf-coordinate-system)

---

## E

### Embedded Font

A font file that is included within the PDF document itself, ensuring consistent text rendering across all PDF viewers regardless of which fonts are installed on the viewing system. PDFDancer supports embedding TrueType (.ttf) fonts.

---

## F

### Fluent API

A programming interface design that allows method chaining, where each method returns an object that can receive further method calls. PDFDancer uses fluent APIs for building paragraphs, images, and edits.

### FormXObject

A reusable content stream in PDF that can be referenced multiple times throughout a document. Commonly used for logos, headers, footers, and watermarks. FormXObjects reduce file size by storing content once and referencing it multiple times.

**See also:** [Working with FormXObjects](working-with-formxobjects.md)

---

## G

### Glyph

The visual representation of a character in a font. Each character (like "A" or "!") has a corresponding glyph that defines how it appears when rendered.

---

## I

### Image

A raster graphic (PNG, JPEG, etc.) embedded in a PDF. PDFDancer can select, add, replace, and delete images at specific coordinates.

**See also:** [Working with Images](working-with-images.md)

---

## P

### Page

The fundamental container in a PDF document. Each page has dimensions (width and height in points), a page number, and contains content such as paragraphs, images, paths, and form fields.

**See also:** [Working with Pages](working-with-pages.md)

### Paragraph

PDFDancer's high-level text abstraction representing a logical block of text that may span multiple lines. Paragraphs are the primary way to work with text content in PDFDancer.

**See also:** [Paragraphs](concepts.md#paragraphs)

### Path

A vector graphics element consisting of lines, curves, and shapes. Paths can have strokes (outlines) and fills (interior colors). Used for drawings, borders, decorative elements, and diagrams.

**See also:** [Working with Vector Graphics](working-with-vector-graphics.md)

### PDF Point

The base unit of measurement in PDF documents. One point equals 1/72 of an inch. Common conversions:
- 72 points = 1 inch
- 1 inch margin = 72 points
- A4 page = 595 × 842 points

### Position

An object that encapsulates coordinate information for element placement and selection. Positions include page number, coordinates (x, y), and optionally a bounding rectangle and selection mode.

### Position Mode

Determines how elements are matched when selecting by position:
- **INTERSECT**: Select elements that overlap with the position area
- **CONTAIN**: Select elements fully contained within the position area
- **EXACT**: Select elements at exact coordinates

---

## R

### Redaction

The process of permanently removing sensitive content from a PDF. Unlike simply covering content with a black box, true redaction removes the underlying data from the document.

**See also:** [Redaction](redaction.md)

### RGB Color

The color model used in PDFDancer, where colors are specified by red, green, and blue components, each ranging from 0 to 255 (e.g., `Color(255, 0, 0)` for red).

---

## S

### Session

A PDFDancer session represents an active connection for working with a PDF document. Sessions maintain state and must be used from a single thread. Create a new session for each PDF you want to process.

### Snapshot

A saved state of a PDF document that can be restored later. Useful for implementing undo functionality or trying different modifications.

**See also:** [Working with Snapshots](working-with-snapshots.md)

### Standard Fonts

The 14 fonts guaranteed to be available in all PDF readers without embedding:
- **Serif:** Times-Roman, Times-Bold, Times-Italic, Times-BoldItalic
- **Sans-serif:** Helvetica, Helvetica-Bold, Helvetica-Oblique, Helvetica-BoldOblique
- **Monospace:** Courier, Courier-Bold, Courier-Oblique, Courier-BoldOblique
- **Symbol:** Symbol, ZapfDingbats

**See also:** [Standard PDF Fonts](concepts.md#standard-pdf-fonts), [Available Fonts](available-fonts.md)

### Stroke

The outline of a path or shape, defined by color and line width. Compare with **Fill**, which is the interior color.

---

## T

### TextLine

An individual line of text within a paragraph. TextLines provide finer-grained control than paragraphs for line-by-line text manipulation.

**See also:** [TextLines](concepts.md#textlines)

### TrueType Font (TTF)

A font format that can be embedded in PDF documents. PDFDancer supports embedding custom TrueType fonts for precise typography control.

---

## V

### Vector Graphics

Graphics defined by mathematical equations (points, lines, curves) rather than pixels. Vector graphics scale without loss of quality. In PDF, vector graphics are represented as paths.

**See also:** [Working with Vector Graphics](working-with-vector-graphics.md)

---

## X

### XObject

See **FormXObject**.
