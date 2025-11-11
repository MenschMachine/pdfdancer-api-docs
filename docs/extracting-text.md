---
id: extracting-text
title: Extracting Text from Documents
description: Comprehensive guide to extracting text content from PDF documents and pages using PDFDancer SDK.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

PDFDancer provides powerful capabilities for extracting text from PDF documents. Whether you need to extract all text from a document, specific paragraphs, or text from particular areas, this guide covers all available options.

---

## Overview: Text Extraction Approaches

PDFDancer offers several approaches to text extraction:

1. **Document-level extraction**: Extract all text from the entire document
2. **Page-level extraction**: Extract text from specific pages
3. **Element-based extraction**: Extract text from individual paragraphs or text lines
4. **Position-based extraction**: Extract text from specific coordinates or regions
5. **Content-based extraction**: Extract text matching specific patterns or criteria

Each approach is useful for different use cases, from simple text extraction to complex data parsing.

---

## Extracting All Text

### From Entire Document

Extract all text content from every page in the document:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Get all paragraphs in the document
    all_paragraphs = pdf.select_paragraphs()

    # Extract text from each paragraph
    full_text = ""
    for paragraph in all_paragraphs:
        full_text += paragraph.text + "\n\n"

    print(full_text)

    # Or using a list comprehension
    text_list = [para.text for para in all_paragraphs]
    combined_text = "\n\n".join(text_list)
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');

// Get all paragraphs in the document
const allParagraphs = await pdf.selectParagraphs();

// Extract text from each paragraph
let fullText = '';
for (const paragraph of allParagraphs) {
  fullText += paragraph.text + '\n\n';
}

console.log(fullText);

// Or using map and join
const textList = allParagraphs.map(para => para.text);
const combinedText = textList.join('\n\n');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import com.tfc.pdf.pdfdancer.api.common.model.*;
import java.util.stream.Collectors;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Get all paragraphs in the document
List<Paragraph> allParagraphs = pdf.selectParagraphs();

// Extract text from each paragraph
StringBuilder fullText = new StringBuilder();
for (Paragraph paragraph : allParagraphs) {
    fullText.append(paragraph.getText()).append("\n\n");
}

System.out.println(fullText.toString());

// Or using streams
String combinedText = allParagraphs.stream()
    .map(Paragraph::getText)
    .collect(Collectors.joining("\n\n"));
```

  </TabItem>
</Tabs>

### From Specific Page

Extract all text from a single page:

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Extract text from first page
    page_paragraphs = pdf.page(0).select_paragraphs()
    page_text = "\n\n".join([para.text for para in page_paragraphs])
    print(f"Page 1 text:\n{page_text}")

    # Extract from multiple specific pages
    pages_to_extract = [0, 2, 4]  # Pages 1, 3, and 5
    for page_num in pages_to_extract:
        paragraphs = pdf.page(page_num).select_paragraphs()
        text = "\n\n".join([p.text for p in paragraphs])
        print(f"\n--- Page {page_num + 1} ---\n{text}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open('document.pdf');

// Extract text from first page
const pageParagraphs = await pdf.page(0).selectParagraphs();
const pageText = pageParagraphs.map(para => para.text).join('\n\n');
console.log(`Page 1 text:\n${pageText}`);

// Extract from multiple specific pages
const pagesToExtract = [0, 2, 4];  // Pages 1, 3, and 5
for (const pageNum of pagesToExtract) {
  const paragraphs = await pdf.page(pageNum).selectParagraphs();
  const text = paragraphs.map(p => p.text).join('\n\n');
  console.log(`\n--- Page ${pageNum + 1} ---\n${text}`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Extract text from first page
List<Paragraph> pageParagraphs = pdf.page(0).selectParagraphs();
String pageText = pageParagraphs.stream()
    .map(Paragraph::getText)
    .collect(Collectors.joining("\n\n"));
System.out.println("Page 1 text:\n" + pageText);

// Extract from multiple specific pages
int[] pagesToExtract = {0, 2, 4};  // Pages 1, 3, and 5
for (int pageNum : pagesToExtract) {
    List<Paragraph> paragraphs = pdf.page(pageNum).selectParagraphs();
    String text = paragraphs.stream()
        .map(Paragraph::getText)
        .collect(Collectors.joining("\n\n"));
    System.out.println("\n--- Page " + (pageNum + 1) + " ---\n" + text);
}
```

  </TabItem>
</Tabs>

### From Page Range

Extract text from a range of consecutive pages:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

def extract_page_range(pdf_path: str, start_page: int, end_page: int) -> str:
    """Extract text from a range of pages (inclusive, 0-indexed)."""
    with PDFDancer.open(pdf_path) as pdf:
        extracted_text = []

        for page_num in range(start_page, end_page + 1):
            paragraphs = pdf.page(page_num).select_paragraphs()
            page_text = "\n\n".join([p.text for p in paragraphs])
            extracted_text.append(f"--- Page {page_num + 1} ---\n{page_text}")

        return "\n\n\n".join(extracted_text)

# Extract pages 2-5 (0-indexed: pages 1-4)
text = extract_page_range("document.pdf", start_page=1, end_page=4)
print(text)
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

async function extractPageRange(
  pdfBytes: Uint8Array,
  startPage: number,
  endPage: number
): Promise<string> {
  /**
   * Extract text from a range of pages (inclusive, 0-indexed).
   */
  const pdf = await PDFDancer.open('document.pdf');
  const extractedText: string[] = [];

  for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
    const paragraphs = await pdf.page(pageNum).selectParagraphs();
    const pageText = paragraphs.map(p => p.text).join('\n\n');
    extractedText.push(`--- Page ${pageNum + 1} ---\n${pageText}`);
  }

  return extractedText.join('\n\n\n');
}

// Extract pages 2-5 (0-indexed: pages 1-4)
const text = await extractPageRange('document.pdf', 1, 4);
console.log(text);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class TextExtractor {
    /**
     * Extract text from a range of pages (inclusive, 0-indexed).
     */
    public static String extractPageRange(String pdfPath, int startPage, int endPage) {
        try (PDFDancer pdf = PDFDancer.createSession(pdfPath)) {
            List<String> extractedText = new ArrayList<>();

            for (int pageNum = startPage; pageNum <= endPage; pageNum++) {
                List<Paragraph> paragraphs = pdf.page(pageNum).selectParagraphs();
                String pageText = paragraphs.stream()
                    .map(Paragraph::getText)
                    .collect(Collectors.joining("\n\n"));
                extractedText.add("--- Page " + (pageNum + 1) + " ---\n" + pageText);
            }

            return String.join("\n\n\n", extractedText);
        }
    }

    // Extract pages 2-5 (0-indexed: pages 1-4)
    public static void main(String[] args) {
        String text = extractPageRange("document.pdf", 1, 4);
        System.out.println(text);
    }
}
```

  </TabItem>
</Tabs>

---

## Line-by-Line Text Extraction

For finer control, extract text line by line instead of by paragraph:

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Extract all text lines from the document
    all_lines = pdf.select_text_lines()

    # Print each line with its position
    for line in all_lines:
        print(f"[{line.position.x():.1f}, {line.position.y():.1f}] {line.text}")

    # Extract lines from a specific page
    page_lines = pdf.page(0).select_text_lines()
    page_text = "\n".join([line.text for line in page_lines])

    print(f"\nPage text (line by line):\n{page_text}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open('document.pdf');

// Extract all text lines from the document
const allLines = await pdf.selectTextLines();

// Print each line with its position
for (const line of allLines) {
  console.log(`[${line.position.x?.toFixed(1)}, ${line.position.y?.toFixed(1)}] ${line.text}`);
}

// Extract lines from a specific page
const pageLines = await pdf.page(0).selectTextLines();
const pageText = pageLines.map(line => line.text).join('\n');

console.log(`\nPage text (line by line):\n${pageText}`);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Extract all text lines from the document
List<TextLine> allLines = pdf.selectTextLines();

// Print each line with its position
for (TextLine line : allLines) {
    System.out.printf("[%.1f, %.1f] %s%n",
        line.getPosition().getX(),
        line.getPosition().getY(),
        line.getText());
}

// Extract lines from a specific page
List<TextLine> pageLines = pdf.page(0).selectTextLines();
String pageText = pageLines.stream()
    .map(TextLine::getText)
    .collect(Collectors.joining("\n"));

System.out.println("\nPage text (line by line):\n" + pageText);
```

  </TabItem>
</Tabs>

---

## Position-Based Text Extraction

### Extract Text at Specific Coordinates

Extract text located at known positions on a page:

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("invoice.pdf") as pdf:
    # Extract invoice number at known position
    invoice_num = pdf.page(0).select_paragraphs_at(x=450, y=750)
    if invoice_num:
        print(f"Invoice: {invoice_num[0].text}")

    # Extract total amount at bottom right
    total = pdf.page(0).select_paragraphs_at(x=450, y=100)
    if total:
        print(f"Total: {total[0].text}")

    # Extract multiple fields at different positions
    fields = {
        "date": (100, 750),
        "customer": (100, 700),
        "amount": (450, 100)
    }

    extracted_data = {}
    for field_name, (x, y) in fields.items():
        elements = pdf.page(0).select_paragraphs_at(x=x, y=y)
        if elements:
            extracted_data[field_name] = elements[0].text

    print(f"Extracted data: {extracted_data}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open('document.pdf');

// Extract invoice number at known position
const invoiceNum = await pdf.page(0).selectParagraphsAt(450, 750);
if (invoiceNum.length > 0) {
  console.log(`Invoice: ${invoiceNum[0].text}`);
}

// Extract total amount at bottom right
const total = await pdf.page(0).selectParagraphsAt(450, 100);
if (total.length > 0) {
  console.log(`Total: ${total[0].text}`);
}

// Extract multiple fields at different positions
const fields: Record<string, [number, number]> = {
  date: [100, 750],
  customer: [100, 700],
  amount: [450, 100]
};

const extractedData: Record<string, string> = {};
for (const [fieldName, [x, y]] of Object.entries(fields)) {
  const elements = await pdf.page(0).selectParagraphsAt(x, y);
  if (elements.length > 0) {
    extractedData[fieldName] = elements[0].text || '';
  }
}

console.log('Extracted data:', extractedData);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import java.util.HashMap;
import java.util.Map;

PDFDancer pdf = PDFDancer.createSession("invoice.pdf");

// Extract invoice number at known position
List<Paragraph> invoiceNum = pdf.page(0).selectParagraphsAt(450, 750);
if (!invoiceNum.isEmpty()) {
    System.out.println("Invoice: " + invoiceNum.get(0).getText());
}

// Extract total amount at bottom right
List<Paragraph> total = pdf.page(0).selectParagraphsAt(450, 100);
if (!total.isEmpty()) {
    System.out.println("Total: " + total.get(0).getText());
}

// Extract multiple fields at different positions
Map<String, int[]> fields = new HashMap<>();
fields.put("date", new int[]{100, 750});
fields.put("customer", new int[]{100, 700});
fields.put("amount", new int[]{450, 100});

Map<String, String> extractedData = new HashMap<>();
for (Map.Entry<String, int[]> entry : fields.entrySet()) {
    int[] coords = entry.getValue();
    List<Paragraph> elements = pdf.page(0).selectParagraphsAt(coords[0], coords[1]);
    if (!elements.isEmpty()) {
        extractedData.put(entry.getKey(), elements.get(0).getText());
    }
}

System.out.println("Extracted data: " + extractedData);
```

  </TabItem>
</Tabs>

### Extract Text from Regions

Extract all text within a specific area or bounding box:

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Get all paragraphs on the page
    all_paragraphs = pdf.page(0).select_paragraphs()

    # Define region of interest (x, y, width, height)
    region_x, region_y = 100, 400
    region_width, region_height = 300, 200

    # Extract paragraphs within the region
    region_paragraphs = []
    for para in all_paragraphs:
        x = para.position.x()
        y = para.position.y()

        # Check if paragraph is within region
        if (region_x <= x <= region_x + region_width and
            region_y <= y <= region_y + region_height):
            region_paragraphs.append(para)

    # Extract text from the region
    region_text = "\n\n".join([p.text for p in region_paragraphs])
    print(f"Text in region:\n{region_text}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open('document.pdf');

// Get all paragraphs on the page
const allParagraphs = await pdf.page(0).selectParagraphs();

// Define region of interest (x, y, width, height)
const regionX = 100, regionY = 400;
const regionWidth = 300, regionHeight = 200;

// Extract paragraphs within the region
const regionParagraphs = allParagraphs.filter(para => {
  const x = para.position.x;
  const y = para.position.y;

  // Check if paragraph is within region
  return (
    x !== undefined && y !== undefined &&
    regionX <= x && x <= regionX + regionWidth &&
    regionY <= y && y <= regionY + regionHeight
  );
});

// Extract text from the region
const regionText = regionParagraphs.map(p => p.text).join('\n\n');
console.log(`Text in region:\n${regionText}`);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Get all paragraphs on the page
List<Paragraph> allParagraphs = pdf.page(0).selectParagraphs();

// Define region of interest (x, y, width, height)
double regionX = 100, regionY = 400;
double regionWidth = 300, regionHeight = 200;

// Extract paragraphs within the region
List<Paragraph> regionParagraphs = new ArrayList<>();
for (Paragraph para : allParagraphs) {
    double x = para.getPosition().getX();
    double y = para.getPosition().getY();

    // Check if paragraph is within region
    if (regionX <= x && x <= regionX + regionWidth &&
        regionY <= y && y <= regionY + regionHeight) {
        regionParagraphs.add(para);
    }
}

// Extract text from the region
String regionText = regionParagraphs.stream()
    .map(Paragraph::getText)
    .collect(Collectors.joining("\n\n"));
System.out.println("Text in region:\n" + regionText);
```

  </TabItem>
</Tabs>

---

## Content-Based Text Extraction

### Extract Text by Prefix

Extract text elements that start with specific text:

<Tabs>
  <TabItem value="python" label="Python">

```python
with PDFDancer.open("document.pdf") as pdf:
    # Extract all invoice numbers
    invoices = pdf.select_paragraphs_starting_with("Invoice #")
    for inv in invoices:
        print(f"Found: {inv.text}")

    # Extract all dates
    dates = pdf.select_paragraphs_starting_with("Date:")

    # Extract specific section headers
    headers = pdf.select_paragraphs_starting_with("Chapter")

    # Extract from specific page
    page_totals = pdf.page(0).select_paragraphs_starting_with("Total:")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open('document.pdf');

// Extract all invoice numbers
const invoices = await pdf.selectParagraphsStartingWith('Invoice #');
for (const inv of invoices) {
  console.log(`Found: ${inv.text}`);
}

// Extract all dates
const dates = await pdf.selectParagraphsStartingWith('Date:');

// Extract specific section headers
const headers = await pdf.selectParagraphsStartingWith('Chapter');

// Extract from specific page
const pageTotals = await pdf.page(0).selectParagraphsStartingWith('Total:');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Extract all invoice numbers
List<Paragraph> invoices = pdf.selectParagraphsStartingWith("Invoice #");
for (Paragraph inv : invoices) {
    System.out.println("Found: " + inv.getText());
}

// Extract all dates
List<Paragraph> dates = pdf.selectParagraphsStartingWith("Date:");

// Extract specific section headers
List<Paragraph> headers = pdf.selectParagraphsStartingWith("Chapter");

// Extract from specific page
List<Paragraph> pageTotals = pdf.page(0).selectParagraphsStartingWith("Total:");
```

  </TabItem>
</Tabs>

### Extract Text by Pattern (Regex)

Use regular expressions to extract text matching specific patterns:

<Tabs>
  <TabItem value="python" label="Python">

```python
import re
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Extract email addresses
    emails = pdf.select_paragraphs_matching(r"[\w\.-]+@[\w\.-]+\.\w+")
    for email in emails:
        print(f"Email: {email.text}")

    # Extract phone numbers
    phones = pdf.select_paragraphs_matching(r"\(\d{3}\) \d{3}-\d{4}")

    # Extract dates (YYYY-MM-DD format)
    dates = pdf.select_paragraphs_matching(r"\d{4}-\d{2}-\d{2}")

    # Extract dollar amounts
    amounts = pdf.select_paragraphs_matching(r"\$[\d,]+\.\d{2}")
    for amount in amounts:
        print(f"Amount: {amount.text}")

    # Extract invoice numbers with custom pattern
    invoice_pattern = r"INV-\d{6}"
    invoices = pdf.select_paragraphs_matching(invoice_pattern)

    # Extract ZIP codes
    zip_codes = pdf.select_text_lines_matching(r"\d{5}(-\d{4})?")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open('document.pdf');

// Extract email addresses
const emails = await pdf.selectParagraphsMatching('[\\w\\.-]+@[\\w\\.-]+\\.\\w+');
for (const email of emails) {
  console.log(`Email: ${email.text}`);
}

// Extract phone numbers
const phones = await pdf.selectParagraphsMatching('\\(\\d{3}\\) \\d{3}-\\d{4}');

// Extract dates (YYYY-MM-DD format)
const dates = await pdf.selectParagraphsMatching('\\d{4}-\\d{2}-\\d{2}');

// Extract dollar amounts
const amounts = await pdf.selectParagraphsMatching('\\$[\\d,]+\\.\\d{2}');
for (const amount of amounts) {
  console.log(`Amount: ${amount.text}`);
}

// Extract invoice numbers with custom pattern
const invoicePattern = 'INV-\\d{6}';
const invoices = await pdf.selectParagraphsMatching(invoicePattern);

// Extract ZIP codes
const zipCodes = await pdf.selectTextLinesMatching('\\d{5}(-\\d{4})?');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Extract email addresses
List<Paragraph> emails = pdf.selectParagraphsMatching("[\\w\\.-]+@[\\w\\.-]+\\.\\w+");
for (Paragraph email : emails) {
    System.out.println("Email: " + email.getText());
}

// Extract phone numbers
List<Paragraph> phones = pdf.selectParagraphsMatching("\\(\\d{3}\\) \\d{3}-\\d{4}");

// Extract dates (YYYY-MM-DD format)
List<Paragraph> dates = pdf.selectParagraphsMatching("\\d{4}-\\d{2}-\\d{2}");

// Extract dollar amounts
List<Paragraph> amounts = pdf.selectParagraphsMatching("\\$[\\d,]+\\.\\d{2}");
for (Paragraph amount : amounts) {
    System.out.println("Amount: " + amount.getText());
}

// Extract invoice numbers with custom pattern
String invoicePattern = "INV-\\d{6}";
List<Paragraph> invoices = pdf.selectParagraphsMatching(invoicePattern);

// Extract ZIP codes
List<TextLine> zipCodes = pdf.selectTextLinesMatching("\\d{5}(-\\d{4})?");
```

  </TabItem>
</Tabs>

---

## Advanced Text Extraction Patterns

### Extract Structured Data from Tables

Extract tabular data by analyzing text positions:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer
from collections import defaultdict

def extract_table_data(pdf_path: str, page_num: int,
                       table_x: float, table_y: float,
                       table_width: float, table_height: float) -> list:
    """
    Extract table-like data from a specific region.
    Returns list of rows, where each row is a list of cell texts.
    """
    with PDFDancer.open(pdf_path) as pdf:
        # Get all text lines in the table region
        all_lines = pdf.page(page_num).select_text_lines()

        # Filter lines within table bounds
        table_lines = []
        for line in all_lines:
            x = line.position.x()
            y = line.position.y()
            if (table_x <= x <= table_x + table_width and
                table_y <= y <= table_y + table_height):
                table_lines.append(line)

        # Group lines by Y coordinate (rows)
        rows_dict = defaultdict(list)
        for line in table_lines:
            # Round Y to group nearby lines
            y_rounded = round(line.position.y())
            rows_dict[y_rounded].append(line)

        # Sort rows by Y coordinate (top to bottom)
        rows = []
        for y in sorted(rows_dict.keys(), reverse=True):
            # Sort cells in row by X coordinate (left to right)
            row_cells = sorted(rows_dict[y], key=lambda l: l.position.x())
            row_texts = [cell.text for cell in row_cells]
            rows.append(row_texts)

        return rows

# Extract table data
table_data = extract_table_data(
    "invoice.pdf",
    page_num=0,
    table_x=50,
    table_y=300,
    table_width=500,
    table_height=200
)

# Print extracted table
for row in table_data:
    print(" | ".join(row))
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

async function extractTableData(
  pdfBytes: Uint8Array,
  pageNum: number,
  tableX: number,
  tableY: number,
  tableWidth: number,
  tableHeight: number
): Promise<string[][]> {
  /**
   * Extract table-like data from a specific region.
   * Returns list of rows, where each row is a list of cell texts.
   */
  const pdf = await PDFDancer.open('document.pdf');

  // Get all text lines in the table region
  const allLines = await pdf.page(pageNum).selectTextLines();

  // Filter lines within table bounds
  const tableLines = allLines.filter(line => {
    const x = line.position.x;
    const y = line.position.y;
    return (
      x !== undefined && y !== undefined &&
      tableX <= x && x <= tableX + tableWidth &&
      tableY <= y && y <= tableY + tableHeight
    );
  });

  // Group lines by Y coordinate (rows)
  const rowsDict: Map<number, typeof tableLines> = new Map();
  for (const line of tableLines) {
    const yRounded = Math.round(line.position.y!);
    if (!rowsDict.has(yRounded)) {
      rowsDict.set(yRounded, []);
    }
    rowsDict.get(yRounded)!.push(line);
  }

  // Sort rows by Y coordinate (top to bottom)
  const rows: string[][] = [];
  const sortedYs = Array.from(rowsDict.keys()).sort((a, b) => b - a);
  for (const y of sortedYs) {
    // Sort cells in row by X coordinate (left to right)
    const rowCells = rowsDict.get(y)!.sort((a, b) =>
      (a.position.x || 0) - (b.position.x || 0)
    );
    const rowTexts = rowCells.map(cell => cell.text || '');
    rows.push(rowTexts);
  }

  return rows;
}

// Extract table data
const tableData = await extractTableData(
  'invoice.pdf',
  0,  // page number
  50, 300, 500, 200  // x, y, width, height
);

// Print extracted table
for (const row of tableData) {
  console.log(row.join(' | '));
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import java.util.*;
import java.util.stream.Collectors;

public class TableExtractor {
    /**
     * Extract table-like data from a specific region.
     * Returns list of rows, where each row is a list of cell texts.
     */
    public static List<List<String>> extractTableData(
        String pdfPath,
        int pageNum,
        double tableX,
        double tableY,
        double tableWidth,
        double tableHeight
    ) {
        try (PDFDancer pdf = PDFDancer.createSession(pdfPath)) {
            // Get all text lines in the table region
            List<TextLine> allLines = pdf.page(pageNum).selectTextLines();

            // Filter lines within table bounds
            List<TextLine> tableLines = allLines.stream()
                .filter(line -> {
                    double x = line.getPosition().getX();
                    double y = line.getPosition().getY();
                    return tableX <= x && x <= tableX + tableWidth &&
                           tableY <= y && y <= tableY + tableHeight;
                })
                .collect(Collectors.toList());

            // Group lines by Y coordinate (rows)
            Map<Integer, List<TextLine>> rowsDict = new HashMap<>();
            for (TextLine line : tableLines) {
                int yRounded = (int) Math.round(line.getPosition().getY());
                rowsDict.computeIfAbsent(yRounded, k -> new ArrayList<>()).add(line);
            }

            // Sort rows by Y coordinate (top to bottom)
            List<List<String>> rows = new ArrayList<>();
            List<Integer> sortedYs = rowsDict.keySet().stream()
                .sorted(Comparator.reverseOrder())
                .collect(Collectors.toList());

            for (Integer y : sortedYs) {
                // Sort cells in row by X coordinate (left to right)
                List<TextLine> rowCells = rowsDict.get(y).stream()
                    .sorted(Comparator.comparingDouble(l -> l.getPosition().getX()))
                    .collect(Collectors.toList());
                List<String> rowTexts = rowCells.stream()
                    .map(TextLine::getText)
                    .collect(Collectors.toList());
                rows.add(rowTexts);
            }

            return rows;
        }
    }

    public static void main(String[] args) {
        // Extract table data
        List<List<String>> tableData = extractTableData(
            "invoice.pdf",
            0,      // page number
            50, 300, 500, 200  // x, y, width, height
        );

        // Print extracted table
        for (List<String> row : tableData) {
            System.out.println(String.join(" | ", row));
        }
    }
}
```

  </TabItem>
</Tabs>

### Extract with Metadata

Extract text along with formatting and position metadata:

<Tabs>
  <TabItem value="python" label="Python">

```python
from dataclasses import dataclass
from typing import List

@dataclass
class TextElement:
    text: str
    page: int
    x: float
    y: float
    font_name: str
    font_size: float
    color: tuple

def extract_with_metadata(pdf_path: str) -> List[TextElement]:
    """Extract text with complete metadata."""
    elements = []

    with PDFDancer.open(pdf_path) as pdf:
        pages = pdf.pages()

        for page_num, page in enumerate(pages):
            paragraphs = page.select_paragraphs()

            for para in paragraphs:
                element = TextElement(
                    text=para.text,
                    page=page_num,
                    x=para.position.x(),
                    y=para.position.y(),
                    font_name=para.font_name or "Unknown",
                    font_size=para.font_size or 0,
                    color=(
                        para.color.r if para.color else 0,
                        para.color.g if para.color else 0,
                        para.color.b if para.color else 0
                    )
                )
                elements.append(element)

    return elements

# Extract with metadata
elements = extract_with_metadata("document.pdf")

# Print elements with metadata
for elem in elements:
    print(f"Page {elem.page + 1}: [{elem.x:.1f}, {elem.y:.1f}] "
          f"{elem.font_name} {elem.font_size}pt - {elem.text[:50]}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open('document.pdf');
const pages = await pdf.pages();

for (let pageNum = 0; pageNum < pages.length; pageNum++) {
  const paragraphs = await pdf.page(pageNum).selectParagraphs();

  for (const para of paragraphs) {
    console.log(
      `Page ${pageNum + 1}: [${para.position.x.toFixed(1)}, ${para.position.y.toFixed(1)}] ` +
      `${para.fontName} ${para.fontSize}pt - ${para.text.substring(0, 50)}`
    );
  }
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
public class TextElement {
    public String text;
    public int page;
    public double x;
    public double y;
    public String fontName;
    public double fontSize;
    public Color color;

    public TextElement(String text, int page, double x, double y,
                      String fontName, double fontSize, Color color) {
        this.text = text;
        this.page = page;
        this.x = x;
        this.y = y;
        this.fontName = fontName;
        this.fontSize = fontSize;
        this.color = color;
    }
}

public class MetadataExtractor {
    /**
     * Extract text with complete metadata.
     */
    public static List<TextElement> extractWithMetadata(String pdfPath) {
        List<TextElement> elements = new ArrayList<>();

        try (PDFDancer pdf = PDFDancer.createSession(pdfPath)) {
            List<PageRef> pages = pdf.getPages();

            for (int pageNum = 0; pageNum < pages.size(); pageNum++) {
                List<Paragraph> paragraphs = pdf.page(pageNum).selectParagraphs();

                for (Paragraph para : paragraphs) {
                    TextElement element = new TextElement(
                        para.getText(),
                        pageNum,
                        para.getPosition().getX(),
                        para.getPosition().getY(),
                        para.getFontName() != null ? para.getFontName() : "Unknown",
                        para.getFontSize() != null ? para.getFontSize() : 0,
                        para.getColor() != null ? para.getColor() : new Color(0, 0, 0)
                    );
                    elements.add(element);
                }
            }
        }

        return elements;
    }

    public static void main(String[] args) {
        // Extract with metadata
        List<TextElement> elements = extractWithMetadata("document.pdf");

        // Print elements with metadata
        for (TextElement elem : elements) {
            System.out.printf("Page %d: [%.1f, %.1f] %s %.0fpt - %s%n",
                elem.page + 1, elem.x, elem.y, elem.fontName, elem.fontSize,
                elem.text.substring(0, Math.min(50, elem.text.length())));
        }
    }
}
```

  </TabItem>
</Tabs>

---

## Use Cases and Examples

### Invoice Data Extraction

Complete example of extracting structured data from invoices:

<Tabs>
  <TabItem value="python" label="Python">

```python
from dataclasses import dataclass
from pdfdancer import PDFDancer

@dataclass
class InvoiceData:
    invoice_number: str = ""
    date: str = ""
    customer_name: str = ""
    total_amount: str = ""
    line_items: list = None

def extract_invoice_data(pdf_path: str) -> InvoiceData:
    """Extract structured data from an invoice PDF."""
    invoice = InvoiceData(line_items=[])

    with PDFDancer.open(pdf_path) as pdf:
        # Extract invoice number
        inv_nums = pdf.select_paragraphs_starting_with("Invoice #")
        if inv_nums:
            invoice.invoice_number = inv_nums[0].text

        # Extract date
        dates = pdf.select_paragraphs_starting_with("Date:")
        if dates:
            invoice.date = dates[0].text.replace("Date:", "").strip()

        # Extract customer name
        customers = pdf.select_paragraphs_starting_with("Bill To:")
        if customers:
            invoice.customer_name = customers[0].text.replace("Bill To:", "").strip()

        # Extract total amount
        totals = pdf.select_paragraphs_starting_with("Total:")
        if totals:
            invoice.total_amount = totals[0].text.replace("Total:", "").strip()

        # Extract line items (items between "Description" and "Total")
        all_lines = pdf.page(0).select_text_lines()
        in_items_section = False

        for line in all_lines:
            if "Description" in line.text:
                in_items_section = True
                continue
            if "Total" in line.text:
                in_items_section = False
                break
            if in_items_section and line.text.strip():
                invoice.line_items.append(line.text.strip())

    return invoice

# Extract invoice data
invoice = extract_invoice_data("invoice.pdf")
print(f"Invoice: {invoice.invoice_number}")
print(f"Date: {invoice.date}")
print(f"Customer: {invoice.customer_name}")
print(f"Total: {invoice.total_amount}")
print(f"Line items: {len(invoice.line_items)}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open('invoice.pdf');

// Extract invoice number
const invNums = await pdf.selectParagraphsStartingWith('Invoice #');
if (invNums.length > 0) {
  console.log(`Invoice: ${invNums[0].text}`);
}

// Extract date
const dates = await pdf.selectParagraphsStartingWith('Date:');
if (dates.length > 0) {
  console.log(`Date: ${dates[0].text.replace('Date:', '').trim()}`);
}

// Extract customer name
const customers = await pdf.selectParagraphsStartingWith('Bill To:');
if (customers.length > 0) {
  console.log(`Customer: ${customers[0].text.replace('Bill To:', '').trim()}`);
}

// Extract total amount
const totals = await pdf.selectParagraphsStartingWith('Total:');
if (totals.length > 0) {
  console.log(`Total: ${totals[0].text.replace('Total:', '').trim()}`);
}

// Extract line items
const allLines = await pdf.page(0).selectTextLines();
let inItemsSection = false;
const lineItems = [];

for (const line of allLines) {
  const text = line.text || '';
  if (text.includes('Description')) {
    inItemsSection = true;
    continue;
  }
  if (text.includes('Total')) {
    break;
  }
  if (inItemsSection && text.trim()) {
    lineItems.push(text.trim());
  }
}

console.log(`Line items: ${lineItems.length}`);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
public class InvoiceData {
    public String invoiceNumber = "";
    public String date = "";
    public String customerName = "";
    public String totalAmount = "";
    public List<String> lineItems = new ArrayList<>();
}

public class InvoiceExtractor {
    /**
     * Extract structured data from an invoice PDF.
     */
    public static InvoiceData extractInvoiceData(String pdfPath) {
        InvoiceData invoice = new InvoiceData();

        try (PDFDancer pdf = PDFDancer.createSession(pdfPath)) {
            // Extract invoice number
            List<Paragraph> invNums = pdf.selectParagraphsStartingWith("Invoice #");
            if (!invNums.isEmpty()) {
                invoice.invoiceNumber = invNums.get(0).getText();
            }

            // Extract date
            List<Paragraph> dates = pdf.selectParagraphsStartingWith("Date:");
            if (!dates.isEmpty()) {
                invoice.date = dates.get(0).getText().replace("Date:", "").trim();
            }

            // Extract customer name
            List<Paragraph> customers = pdf.selectParagraphsStartingWith("Bill To:");
            if (!customers.isEmpty()) {
                invoice.customerName = customers.get(0).getText().replace("Bill To:", "").trim();
            }

            // Extract total amount
            List<Paragraph> totals = pdf.selectParagraphsStartingWith("Total:");
            if (!totals.isEmpty()) {
                invoice.totalAmount = totals.get(0).getText().replace("Total:", "").trim();
            }

            // Extract line items
            List<TextLine> allLines = pdf.page(0).selectTextLines();
            boolean inItemsSection = false;

            for (TextLine line : allLines) {
                String text = line.getText();
                if (text.contains("Description")) {
                    inItemsSection = true;
                    continue;
                }
                if (text.contains("Total")) {
                    inItemsSection = false;
                    break;
                }
                if (inItemsSection && !text.trim().isEmpty()) {
                    invoice.lineItems.add(text.trim());
                }
            }
        }

        return invoice;
    }

    public static void main(String[] args) {
        // Extract invoice data
        InvoiceData invoice = extractInvoiceData("invoice.pdf");
        System.out.println("Invoice: " + invoice.invoiceNumber);
        System.out.println("Date: " + invoice.date);
        System.out.println("Customer: " + invoice.customerName);
        System.out.println("Total: " + invoice.totalAmount);
        System.out.println("Line items: " + invoice.lineItems.size());
    }
}
```

  </TabItem>
</Tabs>

### Export to JSON

Export extracted text data to JSON format:

<Tabs>
  <TabItem value="python" label="Python">

```python
import json
from pdfdancer import PDFDancer

def extract_to_json(pdf_path: str, output_path: str):
    """Extract all text and metadata to JSON."""
    document_data = {
        "pages": []
    }

    with PDFDancer.open(pdf_path) as pdf:
        pages = pdf.pages()

        for page_num, page in enumerate(pages):
            page_data = {
                "page_number": page_num + 1,
                "paragraphs": []
            }

            paragraphs = page.select_paragraphs()
            for para in paragraphs:
                para_data = {
                    "text": para.text,
                    "position": {
                        "x": para.position.x(),
                        "y": para.position.y()
                    },
                    "font": {
                        "name": para.font_name,
                        "size": para.font_size
                    }
                }
                if para.color:
                    para_data["color"] = {
                        "r": para.color.r,
                        "g": para.color.g,
                        "b": para.color.b
                    }
                page_data["paragraphs"].append(para_data)

            document_data["pages"].append(page_data)

    # Write to JSON file
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(document_data, f, indent=2, ensure_ascii=False)

    print(f"Exported to {output_path}")

# Extract to JSON
extract_to_json("document.pdf", "extracted_text.json")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { promises as fs } from 'node:fs';

const documentData: any = {
  pages: []
};

const pdf = await PDFDancer.open('document.pdf');
const pages = await pdf.pages();

for (let pageNum = 0; pageNum < pages.length; pageNum++) {
  const pageData: any = {
    page_number: pageNum + 1,
    paragraphs: []
  };

  const paragraphs = await pdf.page(pageNum).selectParagraphs();
  for (const para of paragraphs) {
    const paraData: any = {
      text: para.text,
      position: {
        x: para.position.x,
        y: para.position.y
      },
      font: {
        name: para.fontName,
        size: para.fontSize
      }
    };
    if (para.color) {
      paraData.color = {
        r: para.color.r,
        g: para.color.g,
        b: para.color.b
      };
    }
    pageData.paragraphs.push(paraData);
  }

  documentData.pages.push(pageData);
}

// Write to JSON file
await fs.writeFile('extracted_text.json', JSON.stringify(documentData, null, 2), 'utf-8');
console.log('Exported to extracted_text.json');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.FileWriter;
import java.util.*;

public class JsonExporter {
    /**
     * Extract all text and metadata to JSON.
     */
    public static void extractToJson(String pdfPath, String outputPath) throws Exception {
        Map<String, Object> documentData = new HashMap<>();
        List<Map<String, Object>> pages = new ArrayList<>();

        try (PDFDancer pdf = PDFDancer.createSession(pdfPath)) {
            List<PageRef> pageRefs = pdf.getPages();

            for (int pageNum = 0; pageNum < pageRefs.size(); pageNum++) {
                Map<String, Object> pageData = new HashMap<>();
                pageData.put("page_number", pageNum + 1);

                List<Map<String, Object>> paragraphs = new ArrayList<>();
                List<Paragraph> paraList = pdf.page(pageNum).selectParagraphs();

                for (Paragraph para : paraList) {
                    Map<String, Object> paraData = new HashMap<>();
                    paraData.put("text", para.getText());

                    Map<String, Double> position = new HashMap<>();
                    position.put("x", para.getPosition().getX());
                    position.put("y", para.getPosition().getY());
                    paraData.put("position", position);

                    Map<String, Object> font = new HashMap<>();
                    font.put("name", para.getFontName());
                    font.put("size", para.getFontSize());
                    paraData.put("font", font);

                    if (para.getColor() != null) {
                        Map<String, Integer> color = new HashMap<>();
                        color.put("r", para.getColor().getR());
                        color.put("g", para.getColor().getG());
                        color.put("b", para.getColor().getB());
                        paraData.put("color", color);
                    }

                    paragraphs.add(paraData);
                }

                pageData.put("paragraphs", paragraphs);
                pages.add(pageData);
            }
        }

        documentData.put("pages", pages);

        // Write to JSON file
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        try (FileWriter writer = new FileWriter(outputPath)) {
            gson.toJson(documentData, writer);
        }

        System.out.println("Exported to " + outputPath);
    }

    public static void main(String[] args) throws Exception {
        // Extract to JSON
        extractToJson("document.pdf", "extracted_text.json");
    }
}
```

  </TabItem>
</Tabs>

---

## Performance Tips

### Optimize for Large Documents

When working with large PDFs:

1. **Process pages in batches**: Don't load all pages at once
2. **Use page-level selection**: Limit searches to specific pages when possible
3. **Filter early**: Apply position/pattern filters to reduce data
4. **Stream results**: Process results as you extract them instead of accumulating

<Tabs>
  <TabItem value="python" label="Python">

```python
def extract_large_document(pdf_path: str, start_page: int = 0, batch_size: int = 10):
    """Extract text from large document in batches."""
    with PDFDancer.open(pdf_path) as pdf:
        total_pages = len(pdf.pages())

        for batch_start in range(start_page, total_pages, batch_size):
            batch_end = min(batch_start + batch_size, total_pages)

            print(f"Processing pages {batch_start + 1} to {batch_end}...")

            for page_num in range(batch_start, batch_end):
                # Process one page at a time
                paragraphs = pdf.page(page_num).select_paragraphs()

                # Process and output immediately
                for para in paragraphs:
                    # Process paragraph (save to file, database, etc.)
                    yield (page_num, para.text)

# Process large document
for page_num, text in extract_large_document("large.pdf", batch_size=5):
    print(f"Page {page_num + 1}: {text[:100]}...")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
async function* extractLargeDocument(
  pdfPath: string,
  startPage: number = 0,
  batchSize: number = 10
): AsyncGenerator<[number, string]> {
  /**
   * Extract text from large document in batches.
   */
  const pdf = await PDFDancer.open(pdfPath);
  const pages = await pdf.pages();
  const totalPages = pages.length;

  for (let batchStart = startPage; batchStart < totalPages; batchStart += batchSize) {
    const batchEnd = Math.min(batchStart + batchSize, totalPages);

    console.log(`Processing pages ${batchStart + 1} to ${batchEnd}...`);

    for (let pageNum = batchStart; pageNum < batchEnd; pageNum++) {
      // Process one page at a time
      const paragraphs = await pdf.page(pageNum).selectParagraphs();

      // Process and output immediately
      for (const para of paragraphs) {
        yield [pageNum, para.text || ''];
      }
    }
  }
}

// Process large document
for await (const [pageNum, text] of extractLargeDocument('large.pdf', 0, 5)) {
  console.log(`Page ${pageNum + 1}: ${text.substring(0, 100)}...`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
public class LargeDocumentExtractor {
    /**
     * Extract text from large document in batches.
     */
    public static void extractLargeDocument(
        String pdfPath,
        int startPage,
        int batchSize,
        BiConsumer<Integer, String> processor
    ) {
        try (PDFDancer pdf = PDFDancer.createSession(pdfPath)) {
            List<PageRef> pages = pdf.getPages();
            int totalPages = pages.size();

            for (int batchStart = startPage; batchStart < totalPages; batchStart += batchSize) {
                int batchEnd = Math.min(batchStart + batchSize, totalPages);

                System.out.println("Processing pages " + (batchStart + 1) + " to " + batchEnd + "...");

                for (int pageNum = batchStart; pageNum < batchEnd; pageNum++) {
                    // Process one page at a time
                    List<Paragraph> paragraphs = pdf.page(pageNum).selectParagraphs();

                    // Process and output immediately
                    for (Paragraph para : paragraphs) {
                        processor.accept(pageNum, para.getText());
                    }
                }
            }
        }
    }

    public static void main(String[] args) {
        // Process large document
        extractLargeDocument("large.pdf", 0, 5, (pageNum, text) -> {
            String preview = text.length() > 100 ? text.substring(0, 100) + "..." : text;
            System.out.println("Page " + (pageNum + 1) + ": " + preview);
        });
    }
}
```

  </TabItem>
</Tabs>

---

## Comparison: Paragraphs vs Text Lines

**When to use Paragraphs:**
- Extracting semantic blocks of text (articles, sections, headings)
- Working with formatted multi-line content
- When logical text grouping matters

**When to use Text Lines:**
- Extracting tabular data
- Processing forms with field labels
- When precise line-level positioning is needed
- Extracting structured data where line breaks are significant

---

## Next Steps

- [**Working with Text**](working-with-text.md) – Learn how to add and edit text
- [**Finding Content**](finding-content.md) – Master content selection methods
- [**Working with Pages**](working-with-pages.md) – Access and manipulate pages
- [**Cookbook**](cookbook.md) – See complete working examples
