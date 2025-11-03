---
id: getting-started
slug: /
title: Getting Started
description: Install PDFDancer and create your first PDF example in 3 minutes.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Get up and running with PDFDancer in just 3 minutes. This guide covers installation and a simple working example.

## Installation

**Requirements:** Python 3.10+, Node.js 20+ or Java 21+. 

*No API token needed* to get started—the SDK uses anonymous access automatically.

<Tabs>
  <TabItem value="python" label="Python">

Install from PyPI:

```bash
pip install pdfdancer-client-python
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

Install from npm:

```bash
npm install pdfdancer-client-typescript
```

Or with pnpm:

```bash
pnpm add pdfdancer-client-typescript
```

Or with Yarn:

```bash
yarn add pdfdancer-client-typescript
```

  </TabItem>
  <TabItem value="java" label="Java">

Install from Maven:

```bash
Coming soon
```

  </TabItem>
</Tabs>

## Your First PDF Edit

Here's a simple example that opens a PDF, finds and replaces text, adds a new paragraph, and saves it:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pathlib import Path
from pdfdancer import Color, PDFDancer

# No token needed! SDK automatically gets an anonymous token
with PDFDancer.open(pdf_data=Path("input.pdf")) as pdf:
    # Locate existing content
    heading = pdf.page(0).select_paragraphs_starting_with("Executive Summary")[0]
    heading.edit().replace("Overview").apply()

    # Add a new paragraph using the fluent builder
    pdf.new_paragraph() \
        .text("Generated with PDFDancer") \
        .font("Helvetica", 12) \
        .color(Color(70, 70, 70)) \
        .line_spacing(1.4) \
        .at(page_index=0, x=72, y=520) \
        .add()

    # Persist the modified document
    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import {PDFDancer, Color} from 'pdfdancer-client-typescript';
import {promises as fs} from 'node:fs';

async function run() {
    const pdfBytes = await fs.readFile('input.pdf');

    // No token needed! SDK automatically gets an anonymous token
    const pdf = await PDFDancer.open(pdfBytes);

    const page0 = pdf.page(0); // Page indexes are zero-based

    // Locate and edit existing content
    const headings = await page0.selectParagraphsStartingWith('Executive Summary');
    if (headings[0]) {
        await headings[0].edit()
            .replace('Overview')
            .apply();
    }

    // Add a new paragraph
    await page0.newParagraph()
        .text('Generated with PDFDancer')
        .font('Helvetica', 12)
        .color(new Color(70, 70, 70))
        .lineSpacing(1.4)
        .at(72, 520)
        .apply();

    const updated = await pdf.getPdfFile();
    await fs.writeFile('output.pdf', updated);
}

run().catch(console.error);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.common.model.*;
import java.util.List;

// No token needed! SDK automatically gets an anonymous token
PDFDancer pdf = PDFDancer.createSession("input.pdf");

// Locate and edit existing content
List<TextParagraphReference> headings = pdf.selectParagraphsStartingWith("Executive Summary");
if (!headings.isEmpty()) {
    headings.get(0).edit().replace("Overview").apply();
}

// Add a new paragraph using the fluent builder
pdf.newParagraph()
    .text("Generated with PDFDancer")
    .font("Helvetica", 12)
    .color(new Color(70, 70, 70))
    .lineSpacing(1.4)
    .at(0, 72, 520)
    .add();

// Persist the modified document
pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

## What's Next?

- [**Authentication**](authentication.md) – Learn how to securely manage API tokens for production
- [**Concepts & Core Features**](concepts.md) – Understand PDFDancer's approach to PDF editing
- [**Working with Text**](working-with-text.md) – Select, add, edit, move, and delete paragraphs
- [**Cookbook**](cookbook.md) – Common patterns and recipes
