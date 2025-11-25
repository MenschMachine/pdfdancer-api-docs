---
id: advanced
title: Advanced Usage
description: Advanced patterns and techniques for PDFDancer SDK.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Learn advanced patterns for working with PDFDancer, including custom fonts, batch processing, complex workflows, and performance optimization.

---

## Context Managers and Resource Management

### Python Context Manager Pattern

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

# Recommended: Use context manager for automatic cleanup
with PDFDancer.open("document.pdf") as pdf:
    # Perform operations
    pdf.page(1).select_paragraphs()[0].delete()
    pdf.save("output.pdf")
# Session automatically closed

# Manual management (not recommended)
pdf = PDFDancer.open("document.pdf")
try:
    pdf.page(1).select_paragraphs()[0].delete()
    pdf.save("output.pdf")
finally:
    pdf.close()  # Must manually close
```

Using the context manager ensures sessions are properly cleaned up even if exceptions occur.

:::danger Thread Safety Warning
**PDFDancer sessions are not thread-safe.** Each session instance must be accessed from only one thread at a time. Never share session objects across threads or use them in concurrent operations.

For parallel processing, create a separate session instance for each thread. See the [Thread Safety section](concepts.md#thread-safety) for detailed examples.
:::

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

// TypeScript doesn't have context managers
// Ensure you handle cleanup in try/finally blocks

const pdf = await PDFDancer.open('document.pdf');

try {
  const paragraphs = await pdf.page(1).selectParagraphs();
  if (paragraphs.length > 0) {
    await paragraphs[0].delete();
  }
  await pdf.save('output.pdf');
} finally {
  // Perform any necessary cleanup
  // The session is managed by the API
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.PDFDancer;
import com.tfc.pdf.pdfdancer.api.common.model.*;

import java.util.List;

// Java uses try-with-resources for automatic cleanup
try (PDFDancer pdf = PDFDancer.createSession("document.pdf")) {
    // Perform operations
    List<ParagraphRef> paragraphs = pdf.page(1).selectParagraphs();
    if (!paragraphs.isEmpty()) {
        paragraphs.get(0).delete();
    }
    pdf.save("output.pdf");
} // Session automatically closed
```

  </TabItem>
</Tabs>

---

## Custom Font Management

### Finding and Using Service Fonts

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Search for available fonts on the service
    roboto_fonts = pdf.find_fonts("Roboto", 12)

    if roboto_fonts:
        # Use the first match
        font = roboto_fonts[0]
        print(f"Using: {font.name} at {font.size}pt")

        pdf.new_paragraph() \
            .text("Text with service font") \
            .font(font.name, font.size) \
            .at(page_number=1, x=100, y=500) \
            .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// TypeScript client uses standard font names directly
const pdf = await PDFDancer.open('document.pdf');

await pdf.page(1).newParagraph()
  .text('Text with standard font')
  .font('Roboto-Regular', 12)
  .at(100, 500)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
// Java client uses standard font names directly
try (PDFDancer pdf = PDFDancer.createSession("document.pdf")) {
    pdf.page(1).newParagraph()
        .text("Text with standard font")
        .font("Roboto-Regular", 12)
        .at(100, 500)
        .apply();

    pdf.save("output.pdf");
}
```

  </TabItem>
</Tabs>

### Uploading Custom Fonts

<Tabs>
  <TabItem value="python" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Register custom TTF font
    custom_font_path = Path("fonts/CustomFont.ttf")
    pdf.register_font(str(custom_font_path))

    # Now use the custom font
    pdf.new_paragraph() \
        .text("Text with custom font") \
        .font("CustomFont", 14) \
        .at(page_number=1, x=100, y=500) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';
import { promises as fs } from 'node:fs';

const pdf = await PDFDancer.open('document.pdf');

// Load custom font file
const fontBytes = await fs.readFile('fonts/CustomFont.ttf');

// Use the custom font directly with fontFile()
await pdf.page(1).newParagraph()
  .text('Text with custom font')
  .fontFile(fontBytes, 14)
  .at(100, 500)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import java.nio.file.Files;
import java.nio.file.Path;

try (PDFDancer pdf = PDFDancer.createSession("document.pdf")) {
    // Load custom font file
    byte[] fontBytes = Files.readAllBytes(Path.of("fonts/CustomFont.ttf"));

    // Use the custom font directly with fontFile()
    pdf.page(1).newParagraph()
        .text("Text with custom font")
        .fontFile(fontBytes, 14)
        .at(100, 500)
        .apply();

    pdf.save("output.pdf");
}
```

  </TabItem>
</Tabs>

---

## Batch Processing Multiple PDFs

<Tabs>
  <TabItem value="python" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer, Color

def process_invoice(input_path: Path, output_dir: Path) -> None:
    """Process a single invoice PDF."""
    with PDFDancer.open(input_path) as pdf:
        # Add PAID watermark
        pdf.new_paragraph() \
            .text("PAID") \
            .font("Helvetica-Bold", 72) \
            .color(Color(0, 200, 0)) \
            .at(page_number=1, x=200, y=400) \
            .add()

        # Save to output directory
        output_path = output_dir / input_path.name
        pdf.save(str(output_path))


def batch_process_invoices(input_dir: Path, output_dir: Path) -> None:
    """Process all PDFs in a directory."""
    output_dir.mkdir(parents=True, exist_ok=True)

    # Find all PDF files
    pdf_files = list(input_dir.glob("*.pdf"))

    print(f"Processing {len(pdf_files)} invoices...")

    for i, pdf_file in enumerate(pdf_files, 1):
        try:
            print(f"[{i}/{len(pdf_files)}] Processing {pdf_file.name}...")
            process_invoice(pdf_file, output_dir)
            print(f"  ✓ Saved to {output_dir / pdf_file.name}")
        except Exception as e:
            print(f"  ✗ Error: {e}")

    print("Batch processing complete!")


# Usage
batch_process_invoices(
    input_dir=Path("invoices/pending"),
    output_dir=Path("invoices/processed")
)
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';
import { promises as fs } from 'node:fs';
import path from 'node:path';

async function processInvoice(
  inputPath: string,
  outputDir: string
): Promise<void> {
  /**
   * Process a single invoice PDF.
   */
  const pdf = await PDFDancer.open(inputPath);

  // Add PAID watermark
  await pdf.page(1).newParagraph()
    .text('PAID')
    .font('Helvetica-Bold', 72)
    .color(new Color(0, 200, 0))
    .at(200, 400)
    .apply();

  // Save to output directory
  const outputPath = path.join(outputDir, path.basename(inputPath));
  await pdf.save(outputPath);
}

async function batchProcessInvoices(
  inputDir: string,
  outputDir: string
): Promise<void> {
  /**
   * Process all PDFs in a directory.
   */
  await fs.mkdir(outputDir, { recursive: true });

  // Find all PDF files
  const files = await fs.readdir(inputDir);
  const pdfFiles = files.filter(f => f.endsWith('.pdf'));

  console.log(`Processing ${pdfFiles.length} invoices...`);

  for (const [i, filename] of pdfFiles.entries()) {
    try {
      console.log(`[${i + 1}/${pdfFiles.length}] Processing ${filename}...`);
      await processInvoice(path.join(inputDir, filename), outputDir);
      console.log(`  ✓ Saved to ${path.join(outputDir, filename)}`);
    } catch (error) {
      console.error(`  ✗ Error: ${error}`);
    }
  }

  console.log('Batch processing complete!');
}

// Usage
await batchProcessInvoices('invoices/pending', 'invoices/processed');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.common.model.Color;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class BatchProcessor {
    public static void processInvoice(Path inputPath, Path outputDir) throws IOException {
        // Process a single invoice PDF
        try (PDFDancer pdf = PDFDancer.createSession(inputPath.toString())) {
            // Add PAID watermark
            pdf.page(1).newParagraph()
                .text("PAID")
                .font("Helvetica-Bold", 72)
                .color(new Color(0, 200, 0))
                .at(200, 400)
                .apply();

            // Save to output directory
            Path outputPath = outputDir.resolve(inputPath.getFileName());
            pdf.save(outputPath.toString());
        }
    }

    public static void batchProcessInvoices(Path inputDir, Path outputDir) throws IOException {
        // Process all PDFs in a directory
        Files.createDirectories(outputDir);

        // Find all PDF files
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(inputDir, "*.pdf")) {
            int count = 0;
            for (Path pdfFile : stream) {
                count++;
                try {
                    System.out.printf("[%d] Processing %s...%n", count, pdfFile.getFileName());
                    processInvoice(pdfFile, outputDir);
                    System.out.printf("  ✓ Saved to %s%n", outputDir.resolve(pdfFile.getFileName()));
                } catch (Exception e) {
                    System.err.printf("  ✗ Error: %s%n", e.getMessage());
                }
            }
            System.out.println("Batch processing complete!");
        }
    }

    // Usage
    public static void main(String[] args) throws IOException {
        batchProcessInvoices(
            Paths.get("invoices/pending"),
            Paths.get("invoices/processed")
        );
    }
}
```

  </TabItem>
</Tabs>

---

## Complex Editing Workflows

### Conditional Content Replacement

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color

def redact_sensitive_info(pdf_path: str, output_path: str) -> None:
    """Find and redact sensitive information in a PDF."""
    sensitive_keywords = ["SSN:", "Credit Card:", "Password:"]

    with PDFDancer.open(pdf_path) as pdf:
        # Search all paragraphs for sensitive keywords
        all_paragraphs = pdf.select_paragraphs()

        for paragraph in all_paragraphs:
            for keyword in sensitive_keywords:
                if keyword in paragraph.text:
                    # Replace with REDACTED
                    paragraph.edit() \
                        .replace("[REDACTED]") \
                        .color(Color(0, 0, 0)) \
                        .apply()
                    print(f"Redacted: {keyword} in paragraph")
                    break

        pdf.save(output_path)


redact_sensitive_info("document.pdf", "redacted.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';

async function redactSensitiveInfo(
  pdfPath: string,
  outputPath: string
): Promise<void> {
  /**
   * Find and redact sensitive information in a PDF.
   */
  const sensitiveKeywords = ['SSN:', 'Credit Card:', 'Password:'];

  const pdf = await PDFDancer.open(pdfPath);

  // Search all paragraphs for sensitive keywords
  const allParagraphs = await pdf.selectParagraphs();

  for (const paragraph of allParagraphs) {
    for (const keyword of sensitiveKeywords) {
      if (paragraph.text?.includes(keyword)) {
        // Replace with REDACTED
        await paragraph.edit()
          .replace('[REDACTED]')
          .color(new Color(0, 0, 0))
          .apply();

        console.log(`Redacted: ${keyword} in paragraph`);
        break;
      }
    }
  }

  await pdf.save(outputPath);
}

await redactSensitiveInfo('document.pdf', 'redacted.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import java.util.List;

public class DocumentRedactor {
    public static void redactSensitiveInfo(String pdfPath, String outputPath) throws IOException {
        // Find and redact sensitive information in a PDF
        String[] sensitiveKeywords = {"SSN:", "Credit Card:", "Password:"};

        try (PDFDancer pdf = PDFDancer.createSession(pdfPath)) {
            // Search all paragraphs for sensitive keywords
            List<ParagraphRef> allParagraphs = pdf.selectParagraphs();

            for (ParagraphRef paragraph : allParagraphs) {
                for (String keyword : sensitiveKeywords) {
                    if (paragraph.getText().contains(keyword)) {
                        // Replace with REDACTED
                        paragraph.edit()
                            .replace("[REDACTED]")
                            .color(new Color(0, 0, 0))
                            .apply();
                        System.out.printf("Redacted: %s in paragraph%n", keyword);
                        break;
                    }
                }
            }

            pdf.save(outputPath);
        }
    }

    public static void main(String[] args) throws IOException {
        redactSensitiveInfo("document.pdf", "redacted.pdf");
    }
}
```

  </TabItem>
</Tabs>

### Template-Based Document Generation

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color
from datetime import datetime

def generate_certificate(
    template_path: str,
    output_path: str,
    student_name: str,
    course_name: str,
    completion_date: str
) -> None:
    """Generate a certificate from an existing template by replacing placeholders."""
    with PDFDancer.open(template_path) as pdf:
        # Replace placeholder fields
        placeholders = {
            "{{STUDENT_NAME}}": student_name,
            "{{COURSE_NAME}}": course_name,
            "{{DATE}}": completion_date
        }

        for placeholder, value in placeholders.items():
            # Find paragraphs with placeholders
            matches = pdf.select_paragraphs_starting_with(placeholder)

            for match in matches:
                match.edit().replace(value).apply()

        # Add signature image
        pdf.new_image() \
            .from_file("signature.png") \
            .at(page=1, x=400, y=100) \
            .add()

        pdf.save(output_path)


# Generate certificates for multiple students
students = [
    ("Alice Johnson", "Python Programming", "2024-01-15"),
    ("Bob Smith", "Python Programming", "2024-01-15"),
    ("Carol Davis", "Python Programming", "2024-01-15")
]

for name, course, date in students:
    output = f"certificates/{name.replace(' ', '_')}.pdf"
    generate_certificate("template.pdf", output, name, course, date)
    print(f"Generated certificate for {name}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

async function generateCertificate(
  templatePath: string,
  outputPath: string,
  studentName: string,
  courseName: string,
  completionDate: string
): Promise<void> {
  /**
   * Generate a certificate from a template.
   */
  const pdf = await PDFDancer.open(templatePath);

  // Replace placeholder fields
  const placeholders: Record<string, string> = {
    '{{STUDENT_NAME}}': studentName,
    '{{COURSE_NAME}}': courseName,
    '{{DATE}}': completionDate
  };

  for (const [placeholder, value] of Object.entries(placeholders)) {
    // Find paragraphs with placeholders
    const matches = await pdf.selectParagraphsStartingWith(placeholder);

    for (const match of matches) {
      await match.edit().replace(value).apply();
    }
  }

  // Add signature image
  await pdf.newImage()
    .fromFile('signature.png')
    .at(1, 400, 100)
    .add();

  await pdf.save(outputPath);
}

// Generate certificates for multiple students
const students = [
  ['Alice Johnson', 'Python Programming', '2024-01-15'],
  ['Bob Smith', 'Python Programming', '2024-01-15'],
  ['Carol Davis', 'Python Programming', '2024-01-15']
];

for (const [name, course, date] of students) {
  const output = `certificates/${name.replace(/ /g, '_')}.pdf`;
  await generateCertificate('template.pdf', output, name, course, date);
  console.log(`Generated certificate for ${name}`);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import java.util.Map;

public class CertificateGenerator {
    public static void generateCertificate(
        String templatePath,
        String outputPath,
        String studentName,
        String courseName,
        String completionDate
    ) throws IOException {
        // Generate a certificate from an existing template
        try (PDFDancer pdf = PDFDancer.createSession(templatePath)) {
            // Replace placeholder fields
            Map<String, String> placeholders = Map.of(
                "{{STUDENT_NAME}}", studentName,
                "{{COURSE_NAME}}", courseName,
                "{{DATE}}", completionDate
            );

            for (Map.Entry<String, String> entry : placeholders.entrySet()) {
                // Find paragraphs with placeholders
                List<ParagraphRef> matches = pdf.selectParagraphsStartingWith(entry.getKey());

                for (ParagraphRef match : matches) {
                    match.edit().replace(entry.getValue()).apply();
                }
            }

            // Add signature image
            pdf.newImage()
                .fromFile("signature.png")
                .at(1, 400, 100)
                .add();

            pdf.save(outputPath);
        }
    }

    // Generate certificates for multiple students
    public static void main(String[] args) throws IOException {
        String[][] students = {
            {"Alice Johnson", "Python Programming", "2024-01-15"},
            {"Bob Smith", "Python Programming", "2024-01-15"},
            {"Carol Davis", "Python Programming", "2024-01-15"}
        };

        for (String[] student : students) {
            String name = student[0];
            String course = student[1];
            String date = student[2];
            String output = String.format("certificates/%s.pdf", name.replace(" ", "_"));
            generateCertificate("template.pdf", output, name, course, date);
            System.out.printf("Generated certificate for %s%n", name);
        }
    }
}
```

  </TabItem>
</Tabs>

---

## Performance Optimization

### Minimizing API Calls

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color

# Less efficient: Multiple API calls
with PDFDancer.open("document.pdf") as pdf:
    for i in range(10):
        para = pdf.page(1).select_paragraphs()[i]
        para.delete()  # 10 separate API calls

# More efficient: Batch operations
with PDFDancer.open("document.pdf") as pdf:
    paragraphs = pdf.page(1).select_paragraphs()[:10]  # Single fetch
    for para in paragraphs:
        para.delete()  # Batch deletions
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// Less efficient: Multiple API calls
const pdf = await PDFDancer.open('document.pdf');
for (let i = 0; i < 10; i++) {
  const paragraphs = await pdf.page(1).selectParagraphs();
  await paragraphs[i].delete();  // Multiple fetches
}

// More efficient: Batch operations
const pdf2 = await PDFDancer.open('document.pdf');
const paragraphs = await pdf2.page(1).selectParagraphs();  // Single fetch
for (const para of paragraphs.slice(0, 10)) {
  await para.delete();  // Batch deletions
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
// Less efficient: Multiple API calls
try (PDFDancer pdf = PDFDancer.createSession("document.pdf")) {
    for (int i = 0; i < 10; i++) {
        List<ParagraphRef> paragraphs = pdf.page(1).selectParagraphs();
        paragraphs.get(i).delete();  // Multiple separate API calls
    }
}

// More efficient: Batch operations
try (PDFDancer pdf = PDFDancer.createSession("document.pdf")) {
    List<ParagraphRef> paragraphs = pdf.page(1).selectParagraphs();  // Single fetch
    for (int i = 0; i < 10 && i < paragraphs.size(); i++) {
        paragraphs.get(i).delete();  // Batch deletions
    }
}
```

  </TabItem>
</Tabs>

### Reusing Sessions

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

# Process multiple operations in a single session
with PDFDancer.open("document.pdf") as pdf:
    # Operation 1: Edit text
    paragraphs = pdf.select_paragraphs_starting_with("Invoice")
    if paragraphs:
        paragraphs[0].edit().replace("PAID").apply()

    # Operation 2: Add watermark
    pdf.new_paragraph() \
        .text("CONFIDENTIAL") \
        .at(page_number=1, x=200, y=400) \
        .add()

    # Operation 3: Add image
    pdf.new_image() \
        .from_file("logo.png") \
        .at(page=1, x=50, y=750) \
        .add()

    # Single save operation
    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// Process multiple operations in a single session
const pdf = await PDFDancer.open('document.pdf');

// Operation 1: Edit text
const paragraphs = await pdf.selectParagraphsStartingWith('Invoice');
if (paragraphs.length > 0) {
  await paragraphs[0].edit().replace('PAID').apply();
}

// Operation 2: Add watermark
await pdf.page(1).newParagraph()
  .text('CONFIDENTIAL')
  .at(200, 400)
  .apply();

// Operation 3: Add image
await pdf.newImage()
  .fromFile('logo.png')
  .at(1, 50, 750)
  .add();

// Single save operation
await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
// Process multiple operations in a single session
try (PDFDancer pdf = PDFDancer.createSession("document.pdf")) {
    // Operation 1: Edit text
    List<ParagraphRef> paragraphs = pdf.selectParagraphsStartingWith("Invoice");
    if (!paragraphs.isEmpty()) {
        paragraphs.get(0).edit().replace("PAID").apply();
    }

    // Operation 2: Add watermark
    pdf.page(1).newParagraph()
        .text("CONFIDENTIAL")
        .at(200, 400)
        .apply();

    // Operation 3: Add image
    pdf.newImage()
        .fromFile("logo.png")
        .at(1, 50, 750)
        .add();

    // Single save operation
    pdf.save("output.pdf");
}
```

  </TabItem>
</Tabs>

---

## Next Steps

- [**Examples**](cookbook.md) – See complete cookbook-style examples
- [**Error Handling**](error-handling.md) – Review error handling best practices
