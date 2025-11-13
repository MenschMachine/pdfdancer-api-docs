---
id: sdk-versions
title: SDK Versions
description: Current SDK versions used in this documentation
---

# SDK Versions

**Documentation Version**: 3.1 (November 13, 2025)

This documentation is based on the following SDK versions:

## Python SDK

- **Repository**: [pdfdancer-client-python](https://github.com/MenschMachine/pdfdancer-client-python)
- **Version**: 0.2.22
- **Commit**: `7d1495de80355b4ad7333489a59ed8ef7205350a`
- **Commit Date**: November 13, 2025
- **Commit Message**: test: remove unused test_rate_limit_retry_with_exponential_backoff and test_rate_limit_retry_uses_retry_after_header tests
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
- **Key Changes Since Last Version**:
  - **Graceful 429 rate limit handling** with Retry-After header support
  - **Automatic retry functionality** for transient network errors
  - **Singular selection convenience methods** added for selecting single elements at coordinates
  - **Configurable retry backoff** via `PDFDANCER_RETRY_BACKOFF_FACTOR` environment variable
  - **Code quality improvements**: Configured linters and formatters (black, flake8, mypy, isort)
  - **Enhanced CI/CD**: Added daily test runs, linter checks, and improved test coverage
  - **Python 3.12 support** added to CI workflow with full matrix testing

## TypeScript SDK

- **Repository**: [pdfdancer-client-typescript](https://github.com/MenschMachine/pdfdancer-client-typescript)
- **Version**: 1.0.17 (tagged: v1.0.17)
- **Commit**: `30deeb5fb75a6883bf977219c89ffad9552ef0f0`
- **Commit Date**: November 13, 2025
- **Commit Message**: 1.0.17
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
- **Key Changes Since Last Version**:
  - **Retry-After header support** for graceful 429 rate limit handling
  - **Configurable retry mechanism** for REST API calls with customizable backoff
  - **Singular convenience select methods** for selecting single elements at coordinates
  - **String filepath support** added to `_processPdfData` for easier file handling
  - **Enhanced CI/CD**: Added daily test runs and improved test coverage
  - **Code quality improvements**: ESLint configuration updates and linter fixes

## Java SDK

- **Repository**: [pdfdancer-client-java](https://github.com/MenschMachine/pdfdancer-client-java)
- **Version**: 0.1.2
- **Commit**: `baa5aaa05579dcb3e4a43c7946f7e4d81b6b9160`
- **Commit Date**: November 13, 2025
- **Commit Message**: Merge branch 'claude/handle-429-retry-after-011CV1Qtz5VXrKeF86SX4tQR'
- **Documentation Coverage**:
  - ✅ Core PDF manipulation (open, create, save)
  - ✅ Text operations (paragraphs, text lines)
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
- **Requirements**:
  - **Java 11+** required (tested with Java 11, 17, 21, 23)
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
- **Key Changes Since Last Version**:
  - **Graceful 429 Retry-After handling** with increased retry delays (1 second default)
  - **Configurable retry mechanism** for REST HTTP calls with customizable retry policies
  - **Singular select methods** for convenience when selecting single elements at coordinates
  - **Default retry configuration**: Uses sensible defaults when retry config not explicitly specified
  - **Enhanced CI/CD**: Added daily test runs and improved GitHub Actions workflows with multi-platform testing
  - **Windows support**: CI now tests on Windows and multiple Java versions (11, 17, 21, 23)

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
    implementation("com.pdfdancer.client:pdfdancer-client-java:0.1.2")
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
    <version>0.1.2</version>
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
