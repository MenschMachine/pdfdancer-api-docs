# Visual Assets Required

This directory contains placeholder references for visual assets that need to be created to improve documentation quality.

## Required Assets

### 1. Coordinate System Visuals

#### `coordinate-system-annotated.png`
**Used in:** `concepts.md`
**Purpose:** Replace ASCII art with actual PDF showing coordinate system
**Requirements:**
- Show a real PDF page (preferably Letter size: 612 × 792 pts)
- Annotate corners with coordinates: (0,0) bottom-left, (612,792) top-right
- Draw X and Y axes with arrows showing direction
- Add grid lines at 100pt intervals with labels
- Show a sample element (text or shape) with its bounding box and coordinates labeled
- Use red/orange highlighting for annotations to match PDFDancer branding

**Recommended size:** 800x1000px PNG

---

### 2. Working with Text - Before/After Examples

#### `text-edit-before.png`
**Used in:** `working-with-text.md`
**Purpose:** Show original PDF before text modification
**Requirements:**
- PDF with a clear paragraph that says "Executive Summary" or "Invoice #12345"
- Highlight the target text with a subtle box or arrow
- Show the text in its original position

**Recommended size:** 600x400px PNG

#### `text-edit-after.png`
**Used in:** `working-with-text.md`
**Purpose:** Show PDF after text has been edited
**Requirements:**
- Same PDF layout as `text-edit-before.png`
- Show the text changed to "Overview" or new invoice number
- Use same highlighting style to show what changed

**Recommended size:** 600x400px PNG (match `text-edit-before.png`)

#### `text-position-unchanged.png`
**Used in:** `working-with-text.md`
**Purpose:** Demonstrate that text position stays the same when editing
**Requirements:**
- Side-by-side or overlay comparison
- Show coordinate indicators (X, Y values) that remain constant
- Highlight that only text content changed, not position

**Recommended size:** 800x400px PNG

#### `text-move-comparison.png`
**Used in:** `working-with-text.md`
**Purpose:** Show paragraph being moved to new coordinates
**Requirements:**
- Show before/after with coordinate annotations
- Draw arrow from old position to new position
- Label old coordinates (e.g., "100, 500") and new coordinates (e.g., "300, 200")

**Recommended size:** 800x500px PNG

---

### 3. Working with Images Examples

#### `image-add-before.png`
**Used in:** `working-with-images.md`
**Purpose:** Show PDF before adding an image
**Requirements:**
- Clean PDF page with space where image will be added
- Optionally show coordinate indicator where image will be placed

**Recommended size:** 600x400px PNG

#### `image-add-after.png`
**Used in:** `working-with-images.md`
**Purpose:** Show PDF after adding an image
**Requirements:**
- Same PDF as `image-add-before.png` with logo/image added
- Show coordinate box around the added image
- Label the position (e.g., "Image at x:50, y:700")

**Recommended size:** 600x400px PNG

#### `image-operations-grid.png`
**Used in:** `working-with-images.md`
**Purpose:** Show multiple image operations in a grid
**Requirements:**
- 2x2 grid showing:
  - Top-left: Original image
  - Top-right: Image moved to new position
  - Bottom-left: Image resized
  - Bottom-right: Image deleted (empty space with outline)
- Label each operation clearly

**Recommended size:** 800x800px PNG

---

### 4. Positioning Guide

#### `positioning-visual-guide.png`
**Used in:** `positioning.md`
**Purpose:** Comprehensive visual guide to PDF positioning
**Requirements:**
- Show complete PDF page with grid overlay
- Annotate all four corners with coordinates
- Show common page sizes (Letter, A4) with dimensions
- Demonstrate bounding rectangles with labeled properties (x, y, width, height)
- Include a ruler or scale indicator
- Show examples of elements at different positions

**Recommended size:** 1000x1200px PNG

#### `bounding-rect-example.png`
**Used in:** `positioning.md`
**Purpose:** Detailed view of how bounding rectangles work
**Requirements:**
- Zoomed-in view of a text element or shape
- Show the bounding rectangle clearly
- Label all four properties: x (left edge), y (bottom edge), width, height
- Use different colors for each dimension
- Include the actual coordinate values as labels

**Recommended size:** 600x400px PNG

---

### 5. Quickstart Visual Example

#### `quickstart-complete-example.png`
**Used in:** `quickstart.md`
**Purpose:** Show a simple, complete before/after for the first example
**Requirements:**
- Side-by-side comparison
- Left: Original PDF with "Executive Summary" heading
- Right: Modified PDF with "Overview" heading and new paragraph added
- Highlight the changes with subtle boxes or arrows
- Keep it simple and clean - this is the first visual users see

**Recommended size:** 1000x500px PNG

---

### 6. Finding Content Examples

#### `finding-content-by-text.png`
**Used in:** `finding-content.md`
**Purpose:** Show how text search locates content
**Requirements:**
- PDF page with multiple paragraphs
- Highlight the found paragraph (e.g., one starting with "Invoice #")
- Show search indicator or magnifying glass icon
- Optionally show the bounding box of the found element

**Recommended size:** 600x600px PNG

#### `finding-content-by-coordinates.png`
**Used in:** `finding-content.md`
**Purpose:** Show how coordinate-based selection works
**Requirements:**
- PDF with multiple elements (text, images)
- Show a coordinate point (e.g., crosshair at x:150, y:320)
- Highlight all elements that intersect with that point
- Include coordinate labels and selection indicators

**Recommended size:** 600x600px PNG

#### `finding-content-methods-comparison.png`
**Used in:** `finding-content.md`
**Purpose:** Compare different selection methods side-by-side
**Requirements:**
- Three columns showing:
  1. Select by text prefix
  2. Select by coordinates
  3. Select all on page
- Same PDF page used in each column with different selection results highlighted
- Clear labels for each method

**Recommended size:** 1200x400px PNG

---

## Asset Creation Guidelines

### Color Palette
Use PDFDancer brand colors:
- **Primary Orange:** `#FF6B35` (from logo)
- **Dark Gray:** `#2D3748` (for text)
- **Light Gray:** `#E2E8F0` (for backgrounds)
- **Accent Red:** `#FF0000` (for highlights)
- **Accent Blue:** `#4299E1` (for coordinate annotations)

### Typography
- Use clean, readable fonts (Helvetica, Arial, or Open Sans)
- Make annotations 14-16pt for readability
- Use bold for labels and coordinates

### Annotation Style
- Use thin arrows (2-3px) for pointing
- Use semi-transparent boxes for highlights (opacity: 0.2-0.3)
- Keep annotations minimal and uncluttered
- Use consistent line weights and colors across all images

### File Format
- Save as PNG with transparency where appropriate
- Optimize file size (use tools like TinyPNG)
- Target file size: < 200KB per image

### PDF Source
- Use realistic-looking business documents (invoices, contracts, reports)
- Avoid using actual client data or sensitive information
- Keep content generic but professional

---

## Creating Placeholder Images

Until real assets are created, you can use placeholder services:

```markdown
![Alt text](https://via.placeholder.com/800x600/FF6B35/FFFFFF?text=Placeholder+Name)
```

Or create simple placeholder images with the required dimensions and text describing what should be shown.

---

## Checklist

- [ ] `coordinate-system-annotated.png`
- [ ] `text-edit-before.png`
- [ ] `text-edit-after.png`
- [ ] `text-position-unchanged.png`
- [ ] `text-move-comparison.png`
- [ ] `image-add-before.png`
- [ ] `image-add-after.png`
- [ ] `image-operations-grid.png`
- [ ] `positioning-visual-guide.png`
- [ ] `bounding-rect-example.png`
- [ ] `quickstart-complete-example.png`
- [ ] `finding-content-by-text.png`
- [ ] `finding-content-by-coordinates.png`
- [ ] `finding-content-methods-comparison.png`

---

## Questions?

If you need clarification on any asset requirements, refer to the documentation files where they're used or check the context in which they appear.
