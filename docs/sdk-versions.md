---
id: sdk-versions
title: SDK Versions
description: Current SDK versions used in this documentation
---

# SDK Versions

**Documentation Version**: 8.2 (January 12, 2026)

This documentation is based on the following SDK versions:

## Python SDK

- **Repository**: [pdfdancer-client-python](https://github.com/MenschMachine/pdfdancer-client-python)
- **Version**: 0.3.6
- **Commit**: `7f80f0938413391bc17f2d9fd1f28f58149501fe`
- **Commit Date**: January 12, 2026
- **Commit Message**: Merge pull request #15 from MenschMachine/refact/template-api
- **Documentation Coverage**:
  - ✅ Anonymous token support (automatic fallback authentication)
  - ✅ Snapshot API (`get_document_snapshot()`, `get_page_snapshot()`, `page.get_snapshot()`)
  - ✅ Vector graphics drawing (`new_path()`, `new_line()`, `new_bezier()`, `new_rectangle()`)
  - ✅ Text line editing (`textline.edit().replace()`, font, color, move)
  - ✅ Document-level text selection methods (`select_paragraphs_starting_with`, `select_paragraphs_matching`, `select_text_lines_starting_with`, `select_text_lines_matching`)
  - ✅ Page moving and reordering (`move_page()`, `page.move_to()`)
  - ✅ Adding new pages to existing documents (`new_page()`)
  - ✅ Select all elements helper (`select_elements()`)
  - ✅ Page size and orientation properties (`page.page_size`, `page.orientation`)
  - ✅ Context manager pattern for text editing (recommended approach)
  - ✅ Standard page numbering (`page_number` instead of `page_index`)
  - ✅ **Redaction API** (`object.redact()`, `pdf.redact()` for batch redaction)
  - ✅ **Image Transformation API** (`scale()`, `scale_to()`, `rotate()`, `crop()`, `set_opacity()`, `flip()`, `replace()`)
  - ✅ **Template API** (`apply_replacements()` for filling templates with dict syntax)
  - ✅ **PDFDANCER_API_TOKEN** environment variable (preferred, with PDFDANCER_TOKEN fallback)
- **Key Changes Since Last Version** (0.3.5 → 0.3.6):
  - **Simplified Template API**: Dict-based syntax for replacements
    - `pdf.apply_replacements({"{{NAME}}": "John Doe"})` - Simple replacement
    - `pdf.apply_replacements({"{{NAME}}": {"text": "John", "font": Font(...), "color": Color(...)}})` - With formatting
  - **Font and Color Support**: Custom font and color now available for replacement text

## TypeScript SDK

- **Repository**: [pdfdancer-client-typescript](https://github.com/MenschMachine/pdfdancer-client-typescript)
- **Version**: 2.0.6
- **Commit**: `a448032c4705e321b2c008f1f00df5759b6f5553`
- **Commit Date**: January 12, 2026
- **Commit Message**: 2.0.6
- **Documentation Coverage**:
  - ✅ Anonymous token support (automatic fallback authentication)
  - ✅ Snapshot API (`getDocumentSnapshot()`, `getPageSnapshot()`, `page.getSnapshot()`)
  - ✅ Vector graphics drawing (`newPath()`, `newLine()`, `newBezier()`, `newRectangle()`)
  - ✅ Text line editing (`textline.edit().replace()`, font, color, move)
  - ✅ Document-level text selection methods (`selectParagraphsStartingWith`, `selectParagraphsMatching`, `selectTextLinesStartingWith`, `selectTextLinesMatching`)
  - ✅ Page moving and reordering (`movePage()`, `page.moveTo()`)
  - ✅ Select all elements helper (`selectElements()`)
  - ✅ Page size and orientation properties (`page.pageSize`, `page.orientation`)
  - ✅ Form field selection naming clarified (document-level: `selectFieldsByName()`, page-level: `selectFormFieldsByName()`)
  - ✅ Corrected method name: `getBytes()` (not `getPdfFile()`)
  - ✅ Standard page numbering (`pageNumber` instead of `pageIndex`)
  - ✅ Flexible PDF input types (File, ArrayBuffer, filepath string, Uint8Array)
  - ✅ Automatic dotenv loading
  - ✅ **Redaction API** (`object.redact()`, `pdf.redact()` for batch redaction)
  - ✅ **Image Transformation API** (`scale()`, `scaleTo()`, `rotate()`, `crop()`, `setOpacity()`, `flip()`, `replace()`)
  - ✅ **Template API** (`replace()` fluent API for filling templates)
  - ✅ **PDFDANCER_API_TOKEN** environment variable (preferred, with PDFDANCER_TOKEN fallback)
- **Key Changes Since Last Version** (2.0.5 → 2.0.6):
  - **Fluent Template Replacement API**: New chainable API for template replacements
    - `pdf.replace('{{NAME}}', 'John').and('{{DATE}}', '2026').apply()` - Chain multiple replacements
    - `.font('Helvetica', 14)` - Set custom font
    - `.color(new Color(255, 0, 0))` - Set custom color
    - `.onPage(1)` - Limit to specific page
    - `.bestEffort()` / `.fitOrFail()` / `.noReflow()` - Reflow presets

## Java SDK

- **Repository**: [pdfdancer-client-java](https://github.com/MenschMachine/pdfdancer-client-java)
- **Version**: 0.2.5
- **Commit**: `42e496514d7dd40936794a948b1d293dbec23d4c`
- **Commit Date**: January 12, 2026
- **Commit Message**: bump: update version to 0.2.5
- **Documentation Coverage**:
  - ✅ Core PDF manipulation (open, create, save)
  - ✅ Text operations (paragraphs, text lines)
  - ✅ Text line editing (`textLine.edit().replace()`, font, color, move)
  - ✅ Text line selection (`selectTextLinesMatching()`, `selectTextLineMatching()`)
  - ✅ Image operations (add, select, manipulate)
  - ✅ Form field operations (AcroForms)
  - ✅ Vector graphics (paths, lines, rectangles, Bezier curves)
  - ✅ Page operations (add, delete, move, reorder)
  - ✅ Snapshot API (document and page snapshots, caching)
  - ✅ Session management (SessionService)
  - ✅ Standard PDF fonts constants (StandardFonts enum)
  - ✅ Page size constants (PageSize class with standard sizes)
  - ✅ Position and coordinate system support
  - ✅ Color model support
  - ✅ Maven Central publishing support (automated and manual bundle upload)
  - ✅ OpenAPI specification for REST API integration
  - ✅ Standard page numbering (`pageNumber` instead of `pageIndex`)
  - ✅ **Redaction API** (`object.redact().apply()`, `pdf.redact(objects)` for batch redaction)
  - ✅ **selectFormFieldByName** at document and page level
  - ✅ **Image Transformation API** (`scale()`, `scaleTo()`, `rotate()`, `crop()`, `opacity()`, `flip()`, `replace()`)
  - ✅ **Template API** (`replace()` fluent API for filling templates)
  - ✅ **PDFDANCER_API_TOKEN** environment variable (preferred, with PDFDANCER_TOKEN fallback)
- **Requirements**:
  - **Java 11+** required (tested with Java 11, 17, 21, 23, 25)
  - Uses Gradle for build management
  - Jackson for JSON serialization
  - SLF4J for logging
- **Key Features**:
  - **Package**: `com.pdfdancer.client.rest`
  - **Type-safe API**: Strong typing with Java generics
  - **Builder pattern**: Fluent API for constructing PDF elements
  - **Standard constants**: PageSize and StandardFonts enums for common values
  - **Clean API design**: Mirrors Python and TypeScript SDKs with Java conventions
  - **Default API endpoint**: Now uses `https://api.pdfdancer.com`
  - **Maven Central distribution**: Published artifacts available for easy dependency management
- **Key Changes Since Last Version** (0.2.4 → 0.2.5):
  - **Fluent Template Replacement API**: New chainable API for template replacements
    - `pdf.replace("{{NAME}}", "John").replace("{{DATE}}", "2026").apply()` - Chain multiple replacements
    - `.withFont("Helvetica", 14)` - Set custom font
    - `.withColor(255, 0, 0)` - Set custom color
    - `.onPage(1)` - Limit to specific page
    - `.withReflow(ReflowPreset.BEST_EFFORT)` - Reflow preset
  - **Page-Level Replace**: `pdf.page(1).replace("{{HEADER}}", "Title").apply()`

---

## Checking Your Installed Version

To verify which version of the SDK you have installed:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="python" label="Python">

```bash
pip show pdfdancer-client-python
```

Or in Python code:

```python
import pdfdancer
print(pdfdancer.__version__)
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```bash
npm list pdfdancer-client-typescript
```

Or check your `package.json`:

```bash
cat package.json | grep pdfdancer-client-typescript
```

  </TabItem>
  <TabItem value="java" label="Java">

Check your `build.gradle.kts` or `pom.xml`:

**Gradle:**

```bash
cat build.gradle.kts | grep pdfdancer
```

**Maven:**

```bash
cat pom.xml | grep pdfdancer
```

  </TabItem>
</Tabs>

---

## Updating to Latest Version

<Tabs>
  <TabItem value="python" label="Python">

```bash
pip install --upgrade pdfdancer-client-python
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```bash
npm update pdfdancer-client-typescript
```

Or with pnpm:

```bash
pnpm update pdfdancer-client-typescript
```

Or with Yarn:

```bash
yarn upgrade pdfdancer-client-typescript
```

  </TabItem>
  <TabItem value="java" label="Java">

**Gradle:**

Update the version in your `build.gradle.kts`:

```kotlin
dependencies {
    implementation("com.pdfdancer.client:pdfdancer-client-java:0.2.5")
}
```

Then run:

```bash
./gradlew build --refresh-dependencies
```

**Maven:**

Update the version in your `pom.xml`:

```xml
<dependency>
    <groupId>com.pdfdancer.client</groupId>
    <artifactId>pdfdancer-client-java</artifactId>
    <version>0.2.5</version>
</dependency>
```

Then run:

```bash
mvn clean install -U
```

  </TabItem>
</Tabs>

---

## Documentation Update History

### Version 8.2 - January 12, 2026

**Fluent Template API & Dict-Based Replacements**

All SDKs now feature improved template replacement APIs with cleaner, more intuitive syntax.

**SDK Version Updates:**
- Python SDK: 0.3.5 → 0.3.6 (commit `7f80f09`)
- TypeScript SDK: 2.0.5 → 2.0.6 (commit `a448032`)
- Java SDK: 0.2.4 → 0.2.5 (commit `42e4965`)

**Changes:**

1. **Python SDK: Dict-Based Template API**
   - `apply_replacements()` now accepts dict instead of list
   - Simple: `pdf.apply_replacements({"{{NAME}}": "John"})`
   - With formatting: `{"{{NAME}}": {"text": "John", "font": Font(...), "color": Color(...)}}`
   - Font and color support now available for replacement text

2. **TypeScript SDK: Fluent Template API**
   - New `pdf.replace()` method with fluent chaining
   - `pdf.replace('{{NAME}}', 'John').and('{{DATE}}', '2026').apply()`
   - `.font()`, `.color()`, `.onPage()`, `.bestEffort()` methods

3. **Java SDK: Fluent Template API**
   - New `pdf.replace()` method with fluent chaining
   - `pdf.replace("{{NAME}}", "John").replace("{{DATE}}", "2026").apply()`
   - `.withFont()`, `.withColor()`, `.onPage()`, `.withReflow()` methods
   - Page-level: `pdf.page(1).replace("{{HEADER}}", "Title").apply()`

**Documentation Updated:**
- `docs/working-with-templates.md` - Complete rewrite with new API examples
- `docs/sdk-versions.md` - Updated version information and changelog

---

### Version 8.1 - January 7, 2026

**Java SDK API Consistency Update**

Updated Java SDK documentation to reflect the renamed `applyReplacements()` method (previously `replaceTemplates()`), aligning with Python and TypeScript SDK naming conventions.

**SDK Version Updates:**
- TypeScript SDK: 2.0.4 → 2.0.5 (commit `0de186f`) - version bump only
- Java SDK: 0.2.3 → 0.2.4 unreleased (commit `86c7867`) - API rename

**Changes:**

1. **Java SDK API Rename**
   - `pdf.replaceTemplates()` renamed to `pdf.applyReplacements()`
   - All Java code samples updated in `docs/working-with-templates.md`
   - Now consistent with Python (`apply_replacements()`) and TypeScript (`applyReplacements()`)

**Documentation Updated:**
- `docs/working-with-templates.md` - Updated all Java code samples
- `docs/sdk-versions.md` - Updated version information and changelog

---

### Version 8.0 - January 7, 2026

**Template API & Updated Environment Variables**

Added documentation for the new Template API (Working with Templates) and updated authentication environment variables:

**SDK Version Updates:**
- Python SDK: 0.3.3 → 0.3.5 (commit `b061e2e`)
- TypeScript SDK: 2.0.3 → 2.0.4 (commit `c137948`)
- Java SDK: 0.2.3 (commit `1d91d6d`)

**New Features:**

1. **Template API** (All SDKs)
   - Fill placeholder text in PDFs with dynamic content
   - Document-level and page-level replacement support
   - Text reflow options: `BEST_EFFORT`, `FIT_OR_FAIL`, `NONE`
   - Custom font and color support (TypeScript and Java)
   - Ideal for mail merge, invoice generation, and certificate creation

2. **Updated Environment Variable**
   - `PDFDANCER_API_TOKEN` is now the preferred environment variable
   - `PDFDANCER_TOKEN` remains supported as a legacy fallback
   - All SDKs check `PDFDANCER_API_TOKEN` first, then fall back to `PDFDANCER_TOKEN`

**Documentation Updated:**
- `docs/working-with-templates.md` - NEW FILE (complete template API documentation)
- `docs/authentication.md` - Updated environment variable documentation
- `docs/glossary.md` - Added terms: Templates, Reflow Preset
- `docs/sdk-versions.md` - Updated version information and changelog
- `sidebars.ts` - Added working-with-templates page to Working with Content category

---

### Version 7.0 - December 18, 2025

**Image Transformation API**

Added comprehensive documentation for the new Image Transformation API available in all SDKs:

**SDK Version Updates:**
- Python SDK: 0.3.3 (commit `01de216`)
- TypeScript SDK: 2.0.2 → 2.0.3 (commit `4714827`)
- Java SDK: 0.2.2 → 0.2.3 (commit `c3ba197`)

**New Features:**

1. **Image Transformation API** (All SDKs)
   - **Scale**: Resize images by factor or to target dimensions with optional aspect ratio preservation
   - **Rotate**: Rotate images by angle in degrees
   - **Crop**: Trim pixels from image edges
   - **Opacity**: Adjust image transparency (0.0 to 1.0)
   - **Flip**: Mirror images horizontally, vertically, or both
   - **Replace**: Swap image content while preserving position

2. **Java SDK Additions**
   - `Position.getCenter()` method for getting center point of bounding rectangle
   - Convenience methods `flipHorizontal()` and `flipVertical()`

**Documentation Updated:**
- `docs/working-with-images.md` - Added 7 new sections covering all image transformation operations
- `docs/glossary.md` - Added terms: Aspect Ratio, Image Transformation, Opacity
- `docs/sdk-versions.md` - Updated version information and changelog

---

### Version 6.2 - December 16, 2025

**SDK Version Updates**

Updated documentation to reflect latest SDK commits:

**SDK Versions:**
- Python SDK: 0.3.2 → 0.3.3
- TypeScript SDK: 2.0.2 (unchanged)
- Java SDK: 0.2.2 (unchanged, but updated commit reference)

**Changes:**
- No API changes in any SDK
- Python SDK: Version bump and test improvements
- Java SDK: Test refactoring to use regex patterns for text line assertions

**Files Modified:**
- `docs/sdk-versions.md` - Updated version information and commit references

---

### Version 6.1 - December 8, 2025

**Java Redaction API Simplification & TypeScript Version Update**

Updated documentation to reflect simplified Java redaction API in v0.2.2 and TypeScript SDK version bump to 2.0.3:

**SDK Version Updates:**
- TypeScript SDK: 2.0.2 → 2.0.3 (version bump only, no functional changes)
- Java SDK: No version change, but documented unreleased API improvements from commit `886ff0b`

**API Changes (Java SDK):**

1. **Simplified Single-Object Redaction**
   - Old API (fluent builder): `object.redact().withReplacement("[TEXT]").apply()`
   - New API (direct call): `object.redact("[TEXT]")`
   - Also available: `object.redact()`, `object.redact(color)`, `object.redact(replacement, color)`
   - No longer requires calling `.apply()` - returns `boolean` directly

**Documentation Updated:**
- `docs/redaction.md` - Updated all Java code examples for single-object redaction
- `docs/sdk-versions.md` - Updated Java SDK changelog and TypeScript version info

**Files Modified:**
- All Java redaction examples now use simplified API: `object.redact()` instead of `object.redact().apply()`

---

### Version 6.0 - December 8, 2025

**Simplified Batch Redaction API & Document-Level Text Line Matching**

Updated documentation to cover new features in Python SDK v0.3.2, TypeScript SDK v2.0.2, and Java SDK v0.2.2:

**API Improvements:**

1. **Unified Batch Redaction API** (All SDKs)
   - All SDKs now support `pdf.redact(objects)` for batch redaction with consistent API
   - TypeScript: `pdf.redact(objects, options)` now public (was internal)
   - Java: Simplified from `RedactRequest.builder()` pattern to direct `pdf.redact(objects, replacement, color)` calls
   - Updated batch redaction examples in `docs/redaction.md`

2. **Python: Document-Level Text Line Pattern Matching**
   - New `pdf.select_text_lines_matching(pattern)` method at document level
   - New `pdf.select_text_line_matching(pattern)` singular method at document level
   - Previously only available at page level

**Documentation Updated:**
- `docs/redaction.md` - Updated batch redaction examples for TypeScript and Java
- `docs/finding-content.md` - Added `select_text_lines_at` singular method to table
- `docs/sdk-versions.md` - Updated version information and changelog

**SDK Versions:**
- Python SDK: 0.3.1 → 0.3.2
- TypeScript SDK: 2.0.1 → 2.0.2
- Java SDK: 0.2.1 → 0.2.2

---

### Version 5.0 - December 2, 2025

**Redaction Support: Permanently Remove Sensitive Content**

Updated documentation to cover redaction features available in Python SDK v0.3.1, TypeScript SDK v2.0.1, and Java SDK v0.2.1:

**New Documentation Added:**

1. **Redaction Page** (`docs/redaction.md` - NEW FILE)
   - Complete documentation for redaction functionality
   - Single-object redaction: `paragraph.redact()`, `textline.redact()`, `image.redact()`, `path.redact()`, `formfield.redact()`
   - Batch redaction: `pdf.redact(objects, replacement, placeholder_color)`
   - Custom replacement text for text content
   - Custom placeholder colors for images and paths
   - Code examples in Python, TypeScript, and Java

**SDK Updates:**

- Python SDK: 0.3.0 → 0.3.1
- TypeScript SDK: 2.0.0 → 2.0.1
- Java SDK: 0.2.0 → 0.2.1

**Internal Improvements (not user-facing):**

- All SDKs now send X-PDFDancer-Client header with version information
- Java SDK: Increased default HTTP timeout to 60 seconds
- Java SDK: Added `selectFormFieldByName()` at document and page level

**Files Modified:**
- `docs/redaction.md` - NEW FILE (complete redaction API documentation)
- `docs/sdk-versions.md` - Version information and changelog updated
- `sidebars.ts` - Added redaction page to Forms & Advanced category

---

### Version 4.0 - November 25, 2025

**API V1 Migration: Breaking Changes for Page Indexing**

Updated documentation to reflect major breaking changes in all SDKs:

**Breaking Changes:**

1. **Standard Page Numbering** (All SDKs)
   - Page numbers now use standard numbering (page 1 is the first page)
   - `page(0)` → `page(1)` for the first page
   - All documentation examples updated

2. **Renamed Properties and Methods**
   - Python: `page_index` → `page_number`, `position.page_index` → `position.page_number`
   - TypeScript: `pageIndex` → `pageNumber`, `position.pageIndex` → `position.pageNumber`
   - Java: `getPageIndex()` → `getPageNumber()`, `pageIndex` → `pageNumber`

3. **Removed Features**
   - Python: Removed `line_spacing()` method from `TextLineEdit` (only supported on paragraphs)

**New Features:**

1. **TypeScript: Flexible PDF Input Types**
   - `PDFDancer.open()` now accepts `File`, `ArrayBuffer`, filepath strings, and `Uint8Array`

2. **TypeScript: Automatic dotenv Support**
   - Environment variables automatically loaded from `.env` files

**Files Modified:**
- All documentation files updated for Standard page numbering
- `docs/sdk-versions.md` - Version information updated
- Code samples across all 20+ documentation files updated

---

### Version 3.0 - October 30, 2025

**Major SDK Update: New Features Documentation**

Updated documentation to cover all features available in Python SDK v0.2.21 and TypeScript SDK v1.0.15:

**New Documentation Added:**

1. **Anonymous Token Support** (`docs/getting-started.md`)
   - Documented automatic anonymous token fallback
   - Positioned as the easiest way for beginners to get started
   - Authentication priority: direct token → PDFDANCER_TOKEN env var → automatic anonymous token
   - Updated "Quick Start" section to show no-token-required examples
   - Added "Using API Tokens (Production)" section for production use cases

2. **Snapshot API** (`docs/working-with-snapshots.md` - NEW FILE)
   - Complete documentation for snapshot functionality
   - Document snapshots: `get_document_snapshot()` / `getDocumentSnapshot()`
   - Page snapshots: `get_page_snapshot()` / `getPageSnapshot()`, `page.get_snapshot()` / `page.getSnapshot()`
   - Filtering by object type
   - Use cases: bulk text extraction, document analysis
   - Performance benefits and caching behavior

3. **Vector Graphics Drawing** (`docs/working-with-vector-graphics.md`)
   - Major expansion from selection-only to full drawing capabilities
   - Drawing lines: `new_line()` / `newLine()` with stroke color, width, dash patterns
   - Drawing rectangles: `new_rectangle()` / `newRectangle()` with stroke and fill
   - Drawing Bezier curves: `new_bezier()` / `newBezier()` for smooth curves
   - Drawing complex paths: `new_path()` / `newPath()` with move_to, line_to, curve_to, close_path
   - Complete styling options documentation (stroke, fill, dash patterns)

4. **Text Line Editing** (`docs/working-with-text.md`)
   - New section: "Editing Text Lines"
   - Text line replacement: `textline.edit().replace()`
   - Font and style changes for text lines
   - Moving text lines to new positions
   - Context manager pattern for text lines (Python)
   - Comparison of text lines vs paragraphs

**Files Modified:**
- `docs/getting-started.md` - Anonymous token support, updated quick start
- `docs/working-with-snapshots.md` - NEW FILE (complete snapshot API documentation)
- `docs/working-with-vector-graphics.md` - Added 4 major sections for drawing capabilities
- `docs/working-with-text.md` - Added text line editing section
- `docs/sdk-versions.md` - Updated to Python 0.2.21 and TypeScript 1.0.15

---

### Version 2.0 - October 30, 2025

**Comprehensive SDK Feature Documentation Update**

Updated documentation to cover all features available in Python SDK v0.2.16 and TypeScript SDK v1.0.13:

**New Documentation Added:**

1. **Document-Level Text Selection** (`docs/finding-content.md`)
   - Clarified that text selection methods work at both document and page levels
   - Added examples showing document-level vs page-scoped searches
   - Methods: `select_paragraphs_starting_with()`, `select_paragraphs_matching()`, `select_text_lines_starting_with()`, `select_text_lines_matching()`

2. **Select All Elements Helper** (`docs/finding-content.md`)
   - New section documenting `select_elements()` convenience method
   - Returns all content types at once (paragraphs, text lines, images, paths, forms, form fields)
   - Available at both document and page levels

3. **Page Moving and Reordering** (`docs/working-with-pages.md`)
   - New section: "Moving and Reordering Pages"
   - Python: `pdf.move_page(from_index, to_index)` and `page.move_to(target_index)`
   - TypeScript: `pdf.movePage(pageIndex, targetPageIndex)` and `page.moveTo(targetPageIndex)`

4. **Adding Pages to Existing Documents** (`docs/working-with-pages.md`)
   - New section: "Adding Pages to Existing Documents"
   - Python: `pdf.new_page()` method
   - TypeScript: `pdf.newPage()` method

5. **Page Size and Orientation Properties** (`docs/working-with-pages.md`)
   - Enhanced "Getting Page Properties" section
   - Python: `page.page_size` (or `page.size`), `page.orientation` (or `page.page_orientation`)
   - TypeScript: `page.pageSize`, `page.orientation`

6. **Python Context Manager Pattern** (`docs/working-with-text.md`)
   - Promoted from tip box to main example
   - Recommended approach for text editing operations
   - Automatic application of changes with error safety

**Bug Fixes:**

1. **TypeScript Method Name Correction** (`docs/working-with-pages.md`)
   - Fixed: `getPdfFile()` → `getBytes()`

2. **Form Field Selection Naming** (`docs/working-with-acroforms.md`)
   - Clarified naming difference between document-level and page-level methods
   - Document-level: `selectFieldsByName()`
   - Page-level: `selectFormFieldsByName()`

**Files Modified:**
- `docs/finding-content.md` - 3 sections updated
- `docs/working-with-pages.md` - 2 new sections, 1 section enhanced, 1 bug fix
- `docs/working-with-acroforms.md` - 1 section enhanced
- `docs/working-with-text.md` - 2 sections enhanced
