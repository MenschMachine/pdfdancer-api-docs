---
id: cookbook
title: Cookbook
description: Complete working examples for common PDF manipulation tasks.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page provides complete, copy-paste ready examples for common PDF manipulation scenarios.

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
            .at(page_index=0, x=180, y=400) \
            .add()

        # Add payment date
        from datetime import datetime
        pdf.new_paragraph() \
            .text(f"Paid: {datetime.now().strftime('%Y-%m-%d')}") \
            .font("Helvetica", 10) \
            .color(Color(0, 128, 0)) \
            .at(page_index=0, x=400, y=50) \
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
  const pdfBytes = await fs.readFile(inputPath);
  const pdf = await PDFDancer.open(pdfBytes);

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
  await pdf.page(0).newParagraph()
    .text('PAID')
    .font('Helvetica-Bold', 72)
    .color(new Color(0, 200, 0))
    .at(180, 400)
    .apply();

  // Add payment date
  const today = new Date().toISOString().split('T')[0];
  await pdf.page(0).newParagraph()
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
            .at(page=0, x=400, y=100) \
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
  const pdfBytes = await fs.readFile(templatePath);
  const pdf = await PDFDancer.open(pdfBytes);

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
    .at(0, 400, 100)
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
            .at(page_index=0, x=50, y=30) \
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

  const pdfBytes = await fs.readFile(inputPath);
  const pdf = await PDFDancer.open(pdfBytes);

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
  await pdf.page(0).newParagraph()
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
            .at(page_index=0, x=100, y=750) \
            .add()

        # Add summary stats
        y_position = 680
        for key, value in report_data['stats'].items():
            pdf.new_paragraph() \
                .text(f"{key}: {value}") \
                .font("Helvetica", 12) \
                .at(page_index=0, x=100, y=y_position) \
                .add()
            y_position -= 25

        # Add charts
        chart_y = 500
        for i, chart_path in enumerate(charts):
            pdf.new_image() \
                .from_file(chart_path) \
                .at(page=0, x=100, y=chart_y - (i * 150)) \
                .add()

        # Add footer
        pdf.new_paragraph() \
            .text(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}") \
            .font("Helvetica", 8) \
            .color(Color(128, 128, 128)) \
            .at(page_index=0, x=250, y=30) \
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
  const pdfBytes = await fs.readFile(templatePath);
  const pdf = await PDFDancer.open(pdfBytes);

  // Add report header
  await pdf.page(0).newParagraph()
    .text(`Monthly Report - ${reportData.month} ${reportData.year}`)
    .font('Helvetica-Bold', 20)
    .color(new Color(0, 0, 128))
    .at(100, 750)
    .apply();

  // Add summary stats
  let yPosition = 680;
  for (const [key, value] of Object.entries(reportData.stats)) {
    await pdf.page(0).newParagraph()
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
      .at(0, 100, chartY - (i * 150))
      .add();
  }

  // Add footer
  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
  await pdf.page(0).newParagraph()
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
                .at(page_index=i, x=150, y=400) \
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
  const pdfBytes = await fs.readFile(inputPath);
  const pdf = await PDFDancer.open(pdfBytes);

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

  </TabItem>
</Tabs>

---

## Next Steps

- [**Advanced**](advanced.md) – Learn advanced patterns and optimization
- [**Error Handling**](error-handling.md) – Handle exceptions properly
- [**Getting Started**](/) – Return to the beginning
