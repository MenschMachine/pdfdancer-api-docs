---
id: cookbook
title: Cookbook
description: Complete working examples for common PDF manipulation tasks.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page provides complete, copy-paste ready examples for common PDF manipulation scenarios.

---

## Creating a New PDF

### Create PDF from Scratch

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color

def create_new_pdf(output_path: str) -> None:
    """Create a new PDF with multiple pages and content."""
    # Create a new blank PDF with Letter size pages (612 x 792 points)
    pdf = PDFDancer.new(page_size={"width": 612, "height": 792})

    # Add title on first page
    pdf.new_paragraph() \
        .text("Sample Document") \
        .font("Helvetica-Bold", 24) \
        .color(Color(0, 0, 128)) \
        .at(page_number=1, x=100, y=720) \
        .add()

    # Add body text
    pdf.new_paragraph() \
        .text("This is a new PDF document created from scratch.") \
        .font("Helvetica", 12) \
        .color(Color(0, 0, 0)) \
        .at(page_number=1, x=100, y=680) \
        .add()

    # Add a second page
    pdf.new_page().page_size({"width": 612, "height": 792}).add()

    # Add content to second page
    pdf.new_paragraph() \
        .text("Page 2 Content") \
        .font("Helvetica-Bold", 18) \
        .color(Color(0, 0, 0)) \
        .at(page_number=1, x=100, y=720) \
        .add()

    # Add footer on both pages
    for page_num in range(2):
        pdf.new_paragraph() \
            .text(f"Page {page_num + 1} of 2") \
            .font("Helvetica", 10) \
            .color(Color(128, 128, 128)) \
            .at(page_number=page_num, x=280, y=30) \
            .add()

    pdf.save(output_path)


# Usage
create_new_pdf("output/new_document.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';

async function createNewPdf(outputPath: string): Promise<void> {
  /**
   * Create a new PDF with multiple pages and content.
   */
  // Create a new blank PDF with Letter size pages (612 x 792 points)
  const pdf = await PDFDancer.new({ pageSize: { width: 612, height: 792 } });

  // Add title on first page
  await pdf.page(1).newParagraph()
    .text('Sample Document')
    .font('Helvetica-Bold', 24)
    .color(new Color(0, 0, 128))
    .at(100, 720)
    .apply();

  // Add body text
  await pdf.page(1).newParagraph()
    .text('This is a new PDF document created from scratch.')
    .font('Helvetica', 12)
    .color(new Color(0, 0, 0))
    .at(100, 680)
    .apply();

  // Add a second page
  await pdf.newPage().customSize(612, 792).add();

  // Add content to second page
  await pdf.page(1).newParagraph()
    .text('Page 2 Content')
    .font('Helvetica-Bold', 18)
    .color(new Color(0, 0, 0))
    .at(100, 720)
    .apply();

  // Add footer on both pages
  for (let pageNum = 0; pageNum < 2; pageNum++) {
    await pdf.page(pageNum).newParagraph()
      .text(`Page ${pageNum + 1} of 2`)
      .font('Helvetica', 10)
      .color(new Color(128, 128, 128))
      .at(280, 30)
      .apply();
  }

  await pdf.save(outputPath);
}

// Usage
await createNewPdf('output/new_document.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.common.model.*;

// Create a new blank PDF with Letter size pages (612 x 792 points)
PDFDancer pdf = PDFDancer.createNew(PageSize.LETTER, Orientation.PORTRAIT, 1);

// Add title on first page
pdf.newParagraph()
    .text("Sample Document")
    .font("Helvetica-Bold", 24)
    .color(new Color(0, 0, 128))
    .at(1, 100, 720)
    .add();

// Add body text
pdf.newParagraph()
    .text("This is a new PDF document created from scratch.")
    .font("Helvetica", 12)
    .color(new Color(0, 0, 0))
    .at(1, 100, 680)
    .add();

// Add a second page
pdf.addPage();

// Add content to second page
pdf.newParagraph()
    .text("Page 2 Content")
    .font("Helvetica-Bold", 18)
    .color(new Color(0, 0, 0))
    .at(1, 100, 720)
    .add();

// Add footer on both pages
for (int pageNum = 0; pageNum < 2; pageNum++) {
    pdf.newParagraph()
        .text("Page " + (pageNum + 1) + " of 2")
        .font("Helvetica", 10)
        .color(new Color(128, 128, 128))
        .at(pageNum, 280, 30)
        .add();
}

pdf.save("output/new_document.pdf");
```

  </TabItem>
</Tabs>

---

## Invoice Processing

### Mark Invoice as Paid

<Tabs>
  <TabItem value="python" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer, Color

def mark_invoice_paid(input_path: str, output_path: str, invoice_number: str) -> None:
    """Mark an invoice as paid with a green stamp."""
    with PDFDancer.open(input_path) as pdf:
        # Find the invoice number paragraph
        invoice_paras = pdf.select_paragraphs_starting_with(f"Invoice #{invoice_number}")

        if invoice_paras:
            # Update status to PAID
            invoice_paras[0].edit() \
                .replace(f"Invoice #{invoice_number} - PAID") \
                .color(Color(0, 128, 0)) \
                .apply()

        # Add large PAID watermark
        pdf.new_paragraph() \
            .text("PAID") \
            .font("Helvetica-Bold", 72) \
            .color(Color(0, 200, 0, alpha=0.3)) \
            .at(page_number=1, x=180, y=400) \
            .add()

        # Add payment date
        from datetime import datetime
        pdf.new_paragraph() \
            .text(f"Paid: {datetime.now().strftime('%Y-%m-%d')}") \
            .font("Helvetica", 10) \
            .color(Color(0, 128, 0)) \
            .at(page_number=1, x=400, y=50) \
            .add()

        pdf.save(output_path)


# Usage
mark_invoice_paid(
    "invoices/INV-001.pdf",
    "invoices/paid/INV-001.pdf",
    "001"
)
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';
import { promises as fs } from 'node:fs';

async function markInvoicePaid(
  inputPath: string,
  outputPath: string,
  invoiceNumber: string
): Promise<void> {
  /**
   * Mark an invoice as paid with a green stamp.
   */
  const pdf = await PDFDancer.open('invoice.pdf');

  // Find the invoice number paragraph
  const invoiceParas = await pdf.selectParagraphsStartingWith(
    `Invoice #${invoiceNumber}`
  );

  if (invoiceParas.length > 0) {
    // Update status to PAID
    await invoiceParas[0].edit()
      .replace(`Invoice #${invoiceNumber} - PAID`)
      .color(new Color(0, 128, 0))
      .apply();
  }

  // Add large PAID watermark
  await pdf.page(1).newParagraph()
    .text('PAID')
    .font('Helvetica-Bold', 72)
    .color(new Color(0, 200, 0))
    .at(180, 400)
    .apply();

  // Add payment date
  const today = new Date().toISOString().split('T')[0];
  await pdf.page(1).newParagraph()
    .text(`Paid: ${today}`)
    .font('Helvetica', 10)
    .color(new Color(0, 128, 0))
    .at(400, 50)
    .apply();

  await pdf.save(outputPath);
}

// Usage
await markInvoicePaid(
  'invoices/INV-001.pdf',
  'invoices/paid/INV-001.pdf',
  '001'
);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.common.model.*;
import java.time.LocalDate;
import java.util.List;

PDFDancer pdf = PDFDancer.createSession("invoices/INV-001.pdf");

// Find the invoice number paragraph
List<TextParagraphReference> invoiceParas = pdf.selectParagraphsStartingWith("Invoice #001");

if (!invoiceParas.isEmpty()) {
    // Update status to PAID
    invoiceParas.get(0).edit()
        .replace("Invoice #001 - PAID")
        .color(new Color(0, 128, 0))
        .apply();
}

// Add large PAID watermark
pdf.newParagraph()
    .text("PAID")
    .font("Helvetica-Bold", 72)
    .color(new Color(0, 200, 0))
    .at(1, 180, 400)
    .add();

// Add payment date
LocalDate today = LocalDate.now();
pdf.newParagraph()
    .text("Paid: " + today)
    .font("Helvetica", 10)
    .color(new Color(0, 128, 0))
    .at(1, 400, 50)
    .add();

pdf.save("invoices/paid/INV-001.pdf");
```

  </TabItem>
</Tabs>

---

## Form Filling

### Complete Contract Form

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer
from dataclasses import dataclass
from typing import Dict

@dataclass
class ContractData:
    client_name: str
    client_email: str
    client_address: str
    start_date: str
    end_date: str
    total_amount: str


def fill_contract_form(
    template_path: str,
    output_path: str,
    contract_data: ContractData
) -> None:
    """Fill a contract template with client data."""
    with PDFDancer.open(template_path) as pdf:
        # Define field mappings
        field_mapping = {
            "clientName": contract_data.client_name,
            "clientEmail": contract_data.client_email,
            "clientAddress": contract_data.client_address,
            "startDate": contract_data.start_date,
            "endDate": contract_data.end_date,
            "totalAmount": contract_data.total_amount
        }

        # Fill all fields
        for field_name, value in field_mapping.items():
            fields = pdf.select_form_fields_by_name(field_name)
            if fields:
                fields[0].edit().value(value).apply()
                print(f"Filled {field_name}: {value}")

        # Add signature image
        pdf.new_image() \
            .from_file("signatures/company_signature.png") \
            .at(page=1, x=400, y=100) \
            .add()

        pdf.save(output_path)


# Usage
contract = ContractData(
    client_name="Acme Corporation",
    client_email="contact@acme.com",
    client_address="123 Business St, City, State 12345",
    start_date="2024-01-01",
    end_date="2024-12-31",
    total_amount="$50,000"
)

fill_contract_form(
    "templates/contract_template.pdf",
    "contracts/acme_contract.pdf",
    contract
)
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';
import { promises as fs } from 'node:fs';

interface ContractData {
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  startDate: string;
  endDate: string;
  totalAmount: string;
}

async function fillContractForm(
  templatePath: string,
  outputPath: string,
  contractData: ContractData
): Promise<void> {
  /**
   * Fill a contract template with client data.
   */
  const pdf = await PDFDancer.open('template.pdf');

  // Define field mappings
  const fieldMapping: Record<string, string> = {
    clientName: contractData.clientName,
    clientEmail: contractData.clientEmail,
    clientAddress: contractData.clientAddress,
    startDate: contractData.startDate,
    endDate: contractData.endDate,
    totalAmount: contractData.totalAmount
  };

  // Fill all fields
  for (const [fieldName, value] of Object.entries(fieldMapping)) {
    const fields = await pdf.selectFieldsByName(fieldName);
    if (fields.length > 0) {
      await fields[0].fill(value);
      console.log(`Filled ${fieldName}: ${value}`);
    }
  }

  // Add signature image
  await pdf.newImage()
    .fromFile('signatures/company_signature.png')
    .at(1, 400, 100)
    .add();

  await pdf.save(outputPath);
}

// Usage
const contract: ContractData = {
  clientName: 'Acme Corporation',
  clientEmail: 'contact@acme.com',
  clientAddress: '123 Business St, City, State 12345',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  totalAmount: '$50,000'
};

await fillContractForm(
  'templates/contract_template.pdf',
  'contracts/acme_contract.pdf',
  contract
);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.common.model.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

PDFDancer pdf = PDFDancer.createSession("templates/contract_template.pdf");

// Define field mappings
Map<String, String> fieldMapping = new HashMap<>();
fieldMapping.put("clientName", "Acme Corporation");
fieldMapping.put("clientEmail", "contact@acme.com");
fieldMapping.put("clientAddress", "123 Business St, City, State 12345");
fieldMapping.put("startDate", "2024-01-01");
fieldMapping.put("endDate", "2024-12-31");
fieldMapping.put("totalAmount", "$50,000");

// Fill all fields
for (Map.Entry<String, String> entry : fieldMapping.entrySet()) {
    List<FormFieldReference> fields = pdf.selectFormFieldsByName(entry.getKey());
    if (!fields.isEmpty()) {
        fields.get(0).edit().value(entry.getValue()).apply();
        System.out.println("Filled " + entry.getKey() + ": " + entry.getValue());
    }
}

// Add signature image
pdf.newImage()
    .fromFile("signatures/company_signature.png")
    .at(1, 400, 100)
    .add();

pdf.save("contracts/acme_contract.pdf");
```

  </TabItem>
</Tabs>

---

## Document Redaction

### Redact Sensitive Information

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color
import re

def redact_document(input_path: str, output_path: str) -> None:
    """Redact sensitive information from a document."""
    # Patterns to redact
    patterns = {
        "SSN": r"\d{3}-\d{2}-\d{4}",
        "Email": r"[\w\.-]+@[\w\.-]+\.\w+",
        "Phone": r"\(\d{3}\)\s*\d{3}-\d{4}",
        "Credit Card": r"\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}"
    }

    with PDFDancer.open(input_path) as pdf:
        all_paragraphs = pdf.select_paragraphs()
        redaction_count = 0

        for paragraph in all_paragraphs:
            text = paragraph.text
            redacted = False

            # Check each pattern
            for pattern_name, pattern in patterns.items():
                if re.search(pattern, text):
                    # Replace entire paragraph with [REDACTED]
                    paragraph.edit() \
                        .replace("[REDACTED]") \
                        .color(Color(0, 0, 0)) \
                        .font("Helvetica-Bold", 12) \
                        .apply()

                    redaction_count += 1
                    print(f"Redacted {pattern_name} in paragraph")
                    redacted = True
                    break

        # Add redaction notice
        pdf.new_paragraph() \
            .text(f"This document contains {redaction_count} redaction(s)") \
            .font("Helvetica", 8) \
            .color(Color(128, 128, 128)) \
            .at(page_number=1, x=50, y=30) \
            .add()

        pdf.save(output_path)


# Usage
redact_document(
    "documents/confidential.pdf",
    "documents/redacted/confidential_redacted.pdf"
)
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';
import { promises as fs } from 'node:fs';

async function redactDocument(
  inputPath: string,
  outputPath: string
): Promise<void> {
  /**
   * Redact sensitive information from a document.
   */
  // Patterns to redact
  const patterns: Record<string, RegExp> = {
    SSN: /\d{3}-\d{2}-\d{4}/,
    Email: /[\w\.-]+@[\w\.-]+\.\w+/,
    Phone: /\(\d{3}\)\s*\d{3}-\d{4}/,
    'Credit Card': /\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/
  };

  const pdf = await PDFDancer.open('document.pdf');

  const allParagraphs = await pdf.selectParagraphs();
  let redactionCount = 0;

  for (const paragraph of allParagraphs) {
    const text = paragraph.text || '';
    let redacted = false;

    // Check each pattern
    for (const [patternName, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        // Replace entire paragraph with [REDACTED]
        await paragraph.edit()
          .replace('[REDACTED]')
          .color(new Color(0, 0, 0))
          .font('Helvetica-Bold', 12)
          .apply();

        redactionCount++;
        console.log(`Redacted ${patternName} in paragraph`);
        redacted = true;
        break;
      }
    }
  }

  // Add redaction notice
  await pdf.page(1).newParagraph()
    .text(`This document contains ${redactionCount} redaction(s)`)
    .font('Helvetica', 8)
    .color(new Color(128, 128, 128))
    .at(50, 30)
    .apply();

  await pdf.save(outputPath);
}

// Usage
await redactDocument(
  'documents/confidential.pdf',
  'documents/redacted/confidential_redacted.pdf'
);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.common.model.*;
import java.util.List;
import java.util.regex.Pattern;

PDFDancer pdf = PDFDancer.createSession("documents/confidential.pdf");

Pattern ssnPattern = Pattern.compile("\\d{3}-\\d{2}-\\d{4}");
Pattern emailPattern = Pattern.compile("[\\w\\.-]+@[\\w\\.-]+\\.\\w+");
Pattern phonePattern = Pattern.compile("\\(\\d{3}\\)\\s*\\d{3}-\\d{4}");
Pattern creditCardPattern = Pattern.compile("\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}");

List<TextParagraphReference> allParagraphs = pdf.selectParagraphs();
int redactionCount = 0;

for (TextParagraphReference paragraph : allParagraphs) {
    String text = paragraph.getText();

    if (ssnPattern.matcher(text).find() ||
        emailPattern.matcher(text).find() ||
        phonePattern.matcher(text).find() ||
        creditCardPattern.matcher(text).find()) {

        paragraph.edit()
            .replace("[REDACTED]")
            .color(new Color(0, 0, 0))
            .font("Helvetica-Bold", 12)
            .apply();

        redactionCount++;
        System.out.println("Redacted sensitive information in paragraph");
    }
}

// Add redaction notice
pdf.newParagraph()
    .text("This document contains " + redactionCount + " redaction(s)")
    .font("Helvetica", 8)
    .color(new Color(128, 128, 128))
    .at(1, 50, 30)
    .add();

pdf.save("documents/redacted/confidential_redacted.pdf");
```

  </TabItem>
</Tabs>

---

## Report Generation

### Generate Monthly Report

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color
from datetime import datetime
from typing import List, Dict

def generate_monthly_report(
    template_path: str,
    output_path: str,
    report_data: Dict,
    charts: List[str]
) -> None:
    """Generate a monthly report from template."""
    with PDFDancer.open(template_path) as pdf:
        # Add report header
        pdf.new_paragraph() \
            .text(f"Monthly Report - {report_data['month']} {report_data['year']}") \
            .font("Helvetica-Bold", 20) \
            .color(Color(0, 0, 128)) \
            .at(page_number=1, x=100, y=750) \
            .add()

        # Add summary stats
        y_position = 680
        for key, value in report_data['stats'].items():
            pdf.new_paragraph() \
                .text(f"{key}: {value}") \
                .font("Helvetica", 12) \
                .at(page_number=1, x=100, y=y_position) \
                .add()
            y_position -= 25

        # Add charts
        chart_y = 500
        for i, chart_path in enumerate(charts):
            pdf.new_image() \
                .from_file(chart_path) \
                .at(page=1, x=100, y=chart_y - (i * 150)) \
                .add()

        # Add footer
        pdf.new_paragraph() \
            .text(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}") \
            .font("Helvetica", 8) \
            .color(Color(128, 128, 128)) \
            .at(page_number=1, x=250, y=30) \
            .add()

        pdf.save(output_path)


# Usage
report_data = {
    'month': 'January',
    'year': 2024,
    'stats': {
        'Total Sales': '$125,000',
        'New Customers': '47',
        'Revenue Growth': '+15%'
    }
}

generate_monthly_report(
    'templates/report_template.pdf',
    'reports/2024-01.pdf',
    report_data,
    ['charts/sales.png', 'charts/customers.png']
)
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';
import { promises as fs } from 'node:fs';

interface ReportData {
  month: string;
  year: number;
  stats: Record<string, string>;
}

async function generateMonthlyReport(
  templatePath: string,
  outputPath: string,
  reportData: ReportData,
  charts: string[]
): Promise<void> {
  /**
   * Generate a monthly report from template.
   */
  const pdf = await PDFDancer.open('template.pdf');

  // Add report header
  await pdf.page(1).newParagraph()
    .text(`Monthly Report - ${reportData.month} ${reportData.year}`)
    .font('Helvetica-Bold', 20)
    .color(new Color(0, 0, 128))
    .at(100, 750)
    .apply();

  // Add summary stats
  let yPosition = 680;
  for (const [key, value] of Object.entries(reportData.stats)) {
    await pdf.page(1).newParagraph()
      .text(`${key}: ${value}`)
      .font('Helvetica', 12)
      .at(100, yPosition)
      .apply();
    yPosition -= 25;
  }

  // Add charts
  const chartY = 500;
  for (const [i, chartPath] of charts.entries()) {
    await pdf.newImage()
      .fromFile(chartPath)
      .at(1, 100, chartY - (i * 150))
      .add();
  }

  // Add footer
  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
  await pdf.page(1).newParagraph()
    .text(`Generated: ${now}`)
    .font('Helvetica', 8)
    .color(new Color(128, 128, 128))
    .at(250, 30)
    .apply();

  await pdf.save(outputPath);
}

// Usage
const reportData: ReportData = {
  month: 'January',
  year: 2024,
  stats: {
    'Total Sales': '$125,000',
    'New Customers': '47',
    'Revenue Growth': '+15%'
  }
};

await generateMonthlyReport(
  'templates/report_template.pdf',
  'reports/2024-01.pdf',
  reportData,
  ['charts/sales.png', 'charts/customers.png']
);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.common.model.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

PDFDancer pdf = PDFDancer.createSession("templates/report_template.pdf");

// Add report header
pdf.newParagraph()
    .text("Monthly Report - January 2024")
    .font("Helvetica-Bold", 20)
    .color(new Color(0, 0, 128))
    .at(1, 100, 750)
    .add();

// Add summary stats
double yPosition = 680;
Map<String, String> stats = new HashMap<>();
stats.put("Total Sales", "$125,000");
stats.put("New Customers", "47");
stats.put("Revenue Growth", "+15%");

for (Map.Entry<String, String> stat : stats.entrySet()) {
    pdf.newParagraph()
        .text(stat.getKey() + ": " + stat.getValue())
        .font("Helvetica", 12)
        .at(1, 100, yPosition)
        .add();
    yPosition -= 25;
}

// Add charts
double chartY = 500;
String[] charts = {"charts/sales.png", "charts/customers.png"};
for (int i = 0; i < charts.length; i++) {
    pdf.newImage()
        .fromFile(charts[i])
        .at(1, 100, chartY - (i * 150))
        .add();
}

// Add footer
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
String timestamp = LocalDateTime.now().format(formatter);
pdf.newParagraph()
    .text("Generated: " + timestamp)
    .font("Helvetica", 8)
    .color(new Color(128, 128, 128))
    .at(1, 250, 30)
    .add();

pdf.save("reports/2024-01.pdf");
```

  </TabItem>
</Tabs>

---

## Watermarking

### Add Confidential Watermark

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color

def add_watermark(input_path: str, output_path: str, watermark_text: str) -> None:
    """Add a diagonal watermark to all pages."""
    with PDFDancer.open(input_path) as pdf:
        pages = pdf.pages()

        for i, page in enumerate(pages):
            # Add semi-transparent watermark text
            pdf.new_paragraph() \
                .text(watermark_text) \
                .font("Helvetica-Bold", 60) \
                .color(Color(200, 200, 200)) \
                .at(page_number=i, x=150, y=400) \
                .add()

        pdf.save(output_path)


# Usage
add_watermark(
    "documents/report.pdf",
    "documents/watermarked/report.pdf",
    "CONFIDENTIAL"
)
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';
import { promises as fs } from 'node:fs';

async function addWatermark(
  inputPath: string,
  outputPath: string,
  watermarkText: string
): Promise<void> {
  /**
   * Add a diagonal watermark to all pages.
   */
  const pdf = await PDFDancer.open('document.pdf');

  const pages = await pdf.pages();

  for (const [i] of pages.entries()) {
    // Add semi-transparent watermark text
    await pdf.page(i).newParagraph()
      .text(watermarkText)
      .font('Helvetica-Bold', 60)
      .color(new Color(200, 200, 200))
      .at(150, 400)
      .apply();
  }

  await pdf.save(outputPath);
}

// Usage
await addWatermark(
  'documents/report.pdf',
  'documents/watermarked/report.pdf',
  'CONFIDENTIAL'
);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.common.model.*;
import java.util.List;

PDFDancer pdf = PDFDancer.createSession("documents/report.pdf");

List<PageRef> pages = pdf.getPages();

for (int i = 0; i < pages.size(); i++) {
    // Add semi-transparent watermark text
    pdf.newParagraph()
        .text("CONFIDENTIAL")
        .font("Helvetica-Bold", 60)
        .color(new Color(200, 200, 200))
        .at(i, 150, 400)
        .add();
}

pdf.save("documents/watermarked/report.pdf");
```

  </TabItem>
</Tabs>

---

## Next Steps

- [**Advanced**](advanced.md) – Learn advanced patterns and optimization
- [**Error Handling**](error-handling.md) – Handle exceptions properly
- [**Getting Started**](/) – Return to the beginning
