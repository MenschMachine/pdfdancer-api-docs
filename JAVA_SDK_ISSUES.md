# Java SDK Documentation Issues

**Status**: CRITICAL - Requires comprehensive review and update
**Date**: November 13, 2025
**Scope**: ALL Java code examples in documentation

## Overview

A comprehensive audit of the documentation revealed that **100% of Java code examples** contain errors that prevent them from compiling or running correctly. These issues span across all documentation files and fall into several categories.

## Critical Issues Affecting All Files

### 1. Incorrect Package Imports (ALL FILES)

**Current (WRONG)**:
```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import com.tfc.pdf.pdfdancer.api.common.model.*;
```

**Correct**:
```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.common.model.*;
```

**Files affected**: ALL documentation files with Java examples

---

### 2. Wrong Return Types for Selection Methods (ALL FILES)

**Current (WRONG)**:
```java
List<Paragraph> paragraphs = pdf.selectParagraphs();
List<TextLine> lines = pdf.selectTextLines();
List<Image> images = pdf.selectImages();
List<Path> paths = pdf.selectPaths();
List<FormField> fields = pdf.selectFormFields();
```

**Correct**:
```java
List<TextParagraphReference> paragraphs = pdf.selectParagraphs();
List<TextLineReference> lines = pdf.selectTextLines();
List<ImageReference> images = pdf.selectImages();
List<PathReference> paths = pdf.selectPaths();
List<FormFieldReference> fields = pdf.selectFormFields();
```

**Note**: The selection methods return `Reference` types, not the model types directly.

---

### 3. PageClient vs Page Type Confusion

**Current (WRONG)**:
```java
Page page = pdf.page(0);
```

**Correct**:
```java
PDFDancer.PageClient page = pdf.page(0);
// OR
var page = pdf.page(0);
```

**Explanation**: `pdf.page(index)` returns `PDFDancer.PageClient`, not a `Page` object.

---

## Specific API Differences

### StandardFonts Enum

**Wrong**: `StandardFonts.HELVETICA_BOLD.getValue()`
**Correct**: `StandardFonts.HELVETICA_BOLD.getFontName()`

### TextLineReference Edit API

**Current docs show (WRONG)**:
```java
textLines.get(0).edit()
    .replace("New text")
    .font("Helvetica-Bold", 14)
    .color(new Color(255, 0, 0))
    .apply();
```

**Actual SDK API**:
```java
// The edit() method only supports replace() which returns boolean directly
boolean success = textLines.get(0).edit().replace("New text");
// No .font(), .color(), or .apply() methods exist
```

### LineBuilder/RectangleBuilder/BezierBuilder Methods

**Current docs (WRONG)**:
```java
page.newLine()
    .fromPoint(100, 100)
    .toPoint(400, 100)
    .strokeColor(new Color(0, 0, 0))
    .strokeWidth(2)
    .dashPattern(new int[]{5, 3})
```

**Correct**:
```java
page.newLine()
    .from(100, 100)      // not fromPoint
    .to(400, 100)         // not toPoint
    .color(new Color(0, 0, 0))  // not strokeColor
    .lineWidth(2)         // not strokeWidth
    .dash(5, 3)           // not dashPattern, takes double...
```

### ImageBuilder.fromFile()

**Wrong**: `fromFile(Paths.get("logo.png"))`
**Correct**: `fromFile(new File("logo.png"))`
**Note**: Takes `File`, not `Path`

### No pdf.pages() Method

**Wrong**: `List<Page> pages = pdf.pages();`
**Correct**: `List<PageRef> pages = pdf.getPages();`

### FormFieldReference Methods

**Issue**: Documentation shows `.getName()` but actual method is `.name()`
**Issue**: `.fill()` method accessibility is unclear

---

## Files Requiring Comprehensive Updates

The following files have Java code examples that need complete rewrites:

1. `docs/quickstart.md`
2. `docs/working-with-text.md`
3. `docs/working-with-pages.md`
4. `docs/working-with-images.md`
5. `docs/working-with-vector-graphics.md`
6. `docs/working-with-fonts.md`
7. `docs/working-with-acroforms.md`
8. `docs/working-with-snapshots.md`
9. `docs/finding-content.md`
10. `docs/concepts.md`
11. `docs/cookbook.md`
12. `docs/advanced.md`

---

## Recommended Action Plan

### Phase 1: Immediate (Create Java examples note)
- Add a note at the top of the documentation warning that Java examples are under review
- Link to this issues document

### Phase 2: Systematic Fixes
1. Start with quickstart.md and getting-started.md (most critical for new users)
2. Fix core documentation files (working-with-text.md, working-with-pages.md)
3. Fix specialized features (vector-graphics, images, fonts, forms)
4. Fix advanced topics (snapshots, concepts, cookbook)

### Phase 3: Verification
1. Create test Java project with all examples
2. Verify all examples compile
3. Run examples against test PDFs to ensure correctness

---

## Quick Reference: Common Fixes

| Wrong | Correct |
|-------|---------|
| `com.tfc.pdf.pdfdancer.api.*` | `com.pdfdancer.client.rest.*` |
| `List<Paragraph>` | `List<TextParagraphReference>` |
| `List<TextLine>` | `List<TextLineReference>` |
| `List<Image>` | `List<ImageReference>` |
| `List<Path>` | `List<PathReference>` |
| `List<FormField>` | `List<FormFieldReference>` |
| `Page page =` | `var page =` or `PDFDancer.PageClient page =` |
| `.getValue()` | `.getFontName()` |
| `.fromPoint()` | `.from()` |
| `.toPoint()` | `.to()` |
| `.strokeColor()` | `.color()` |
| `.strokeWidth()` | `.lineWidth()` |
| `.dashPattern(int[])` | `.dash(double...)` |
| `fromFile(Path)` | `fromFile(File)` |
| `pdf.pages()` | `pdf.getPages()` |
| `.getName()` | `.name()` |
| `PDFDancer.create()` | `PDFDancer.createNew()` |

---

## Contact

For questions or to contribute fixes, please review the actual Java SDK source code in:
`/home/user/pdfdancer-api-docs/external/pdfdancer-client-java/src/`
