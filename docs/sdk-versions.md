---
id: sdk-versions
title: SDK Versions
description: Current SDK versions used in this documentation
---

# SDK Versions

**Documentation Version**: 3.3 (November 20, 2025)

This documentation is based on the following SDK versions:

## Python SDK

- **Repository**: [pdfdancer-client-python](https://github.com/MenschMachine/pdfdancer-client-python)
- **Version**: 0.2.28
- **Commit**: `720afd2a3e24cc88fb8c3e596cd35ee4208a932b`
- **Commit Date**: November 20, 2025
- **Commit Message**: Merge branch 'claude/debug-pdf-font-spacing-0191CUHcEE1oFRj3sKt93N3n'
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
- **Key Changes Since Last Version** (0.2.24 → 0.2.28):
  - **Full TextLineEdit functionality**: Complete implementation of text line editing with font and color changes
  - **Explicit text/font preservation**: Text lines now explicitly preserve text content and font when modified
  - **Line spacing validation**: Added hard failure for unsupported line spacing modifications to prevent unexpected behavior
  - **Improved text line editing**: Enhanced TextLineBuilder with proper text and font handling
  - **Test improvements**: Updated e2e tests to accommodate baseline vs bounding box differences
  - **OpenAPI specification updates**: Updated to reflect latest API changes

## TypeScript SDK

- **Repository**: [pdfdancer-client-typescript](https://github.com/MenschMachine/pdfdancer-client-typescript)
- **Version**: 1.0.22 (tagged: v1.0.22)
- **Commit**: `13a7d1671eb1c970f26ca739a81bfcbf13f78bfa`
- **Commit Date**: November 20, 2025
- **Commit Message**: 1.0.22
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
- **Key Changes Since Last Version** (1.0.17 → 1.0.22):
  - **PathBuilder implementation**: New `PathBuilder` class for creating complex vector paths programmatically
  - **Test drawing helpers**: Added comprehensive visual debugging utilities for test development
  - **Memory exhaustion fixes**: Resolved memory issues in test drawing helpers
  - **Position error fixes**: Corrected path segment position handling and inheritance from page snapshots
  - **localStorage compatibility**: Added function check for `localStorage.getItem` in Node.js environments
  - **OpenAPI definition updates**: Updated specifications to reflect latest API changes
  - **CI improvements**: Set max-parallel to reduce resource contention, added test report uploads on failure
  - **Test reliability**: Relaxed bounding box assertions and element count expectations for more stable tests

## Java SDK

- **Repository**: [pdfdancer-client-java](https://github.com/MenschMachine/pdfdancer-client-java)
- **Version**: 0.1.7
- **Commit**: `ac3bd98e662495ecc5fd8a2fe1aa82cc656ba9ab`
- **Commit Date**: November 20, 2025
- **Commit Message**: Merge pull request #8 from MenschMachine/claude/add-java-matrix-ci-01QNFFTZzfdTZeUzi6N3BCVa
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
- **Key Changes Since Last Version** (0.1.3 → 0.1.7):
  - **Text line modification support**: Full implementation of `TextLineEdit` with fluent builder pattern for rich text line editing
  - **Text line selection methods**: Added `selectTextLinesMatching()` and `selectTextLineMatching()` for regex-based text line searches
  - **Enhanced TextLineReference**: Added missing Font and Position imports, improved API consistency
  - **OpenAPI specification**: Added complete OpenAPI specification in `docs/openapi.yml`
  - **Java 25 support**: Extended CI matrix to include Java 25 testing
  - **Base URL refactoring**: Extracted base URL from DEFAULT_BASE_URI to `getBaseUrl()` method for better configurability
  - **Test improvements**: Relaxed exact element count assertions and updated position value assertions to use ranges
  - **Build version bumps**: Progressive version updates through 0.1.4, 0.1.5, 0.1.6, and 0.1.7

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
    implementation("com.pdfdancer.client:pdfdancer-client-java:0.1.7")
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
    <version>0.1.7</version>
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
