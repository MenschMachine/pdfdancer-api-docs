---
id: getting-started
slug: /
title: Getting Started with PDFDancer
description: Pixel-perfect programmatic control over any PDF. Edit PDFs you didn't create with surgical precision.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

PDFDancer gives you pixel-perfect programmatic control over any PDF document from Python, TypeScript, or Java. Unlike
other tools, you can edit existing PDFs you didn't create - locate any element by coordinates or text, modify it
precisely, add new content at exact positions, and manipulate forms with surgical precision.

---

## Highlights

- **Locate anything** inside any PDF—paragraphs, text lines, images, vector paths, pages, AcroForm fields—by page,
  coordinates, or text prefixes
- **Edit existing content** with pixel-perfect precision using fluent editors and coordinate-based positioning
- **Programmatic control** over PDFs you didn't create - modify invoices, contracts, forms, reports from any source
- **Add content at exact positions** with paragraph/image builders, custom fonts, and coordinate-based placement
- **Download results** as bytes for downstream processing or save directly to disk

## What Makes PDFDancer Different

- **Edit any PDF** - Not just ones you created. Modify third-party invoices, government forms, client contracts
- **Pixel-perfect positioning** - Place content at exact X,Y coordinates, move elements precisely
- **Surgical text replacement** - Find and replace specific paragraphs while preserving layout
- **Form manipulation** - Fill, update, or delete AcroForm fields programmatically
- **Coordinate-based selection** - Select elements by position, not just content
- **Real PDF editing** - Modify the actual PDF structure, not just overlay content

---

## Requirements

<Tabs>
  <TabItem value="python" label="Python">

**Minimum:** Python 3.10 or newer (Python 3.9 has SSL issues with large file uploads) and network access to a PDFDancer service (defaults to `https://api.pdfdancer.com`).

**Authentication:** Optional! The SDK automatically obtains an anonymous token if you don't provide one. For production use, get an API token and set `PDFDANCER_TOKEN` environment variable or pass `token=...`.

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

**Minimum:** Node.js 20 or newer and network access to a PDFDancer service (defaults to `https://api.pdfdancer.com`).

**Authentication:** Optional! The SDK automatically obtains an anonymous token if you don't provide one. For production use, get an API token and set `PDFDANCER_TOKEN` environment variable or pass as argument.

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Installation

<Tabs>
  <TabItem value="python" label="Python">

Install from PyPI:

```bash
pip install pdfdancer-client-python

# Editable install for local development
pip install -e .
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

  </TabItem>
</Tabs>

---

## Quick Start (No API Token Required!)

The easiest way to get started is without any authentication - the SDK automatically handles it for you:

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

  </TabItem>
</Tabs>

---

## Using API Tokens (Production)

For production use, you should use an API token instead of anonymous access:

<Tabs>
  <TabItem value="python" label="Python">

**Option 1: Environment Variable (Recommended)**

```bash
export PDFDANCER_TOKEN="your-api-token"
```

```python
from pdfdancer import PDFDancer

# Token automatically loaded from PDFDANCER_TOKEN
with PDFDancer.open("input.pdf") as pdf:
    # ... your code
    pdf.save("output.pdf")
```

**Option 2: Pass Token Directly**

```python
from pdfdancer import PDFDancer

with PDFDancer.open(
    pdf_data="input.pdf",
    token="your-api-token"
) as pdf:
    # ... your code
    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

**Option 1: Environment Variable (Recommended)**

```bash
export PDFDANCER_TOKEN="your-api-token"
```

```typescript
import {PDFDancer} from 'pdfdancer-client-typescript';

// Token automatically loaded from PDFDANCER_TOKEN
const pdf = await PDFDancer.open(pdfBytes);
// ... your code
```

**Option 2: Pass Token Directly**

```typescript
import {PDFDancer} from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes, 'your-api-token');
// ... your code
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

:::tip Authentication Fallback
The SDK uses this priority order:
1. Token passed directly to `open()` or `new()`
2. `PDFDANCER_TOKEN` environment variable
3. **Automatic anonymous token** (for quick testing)

For production, always use options 1 or 2!
:::

---

## Next Steps

- [**Authentication**](authentication.md) – Learn how to securely manage API tokens
- [**Quickstart**](quickstart.md) – Dive deeper into basic PDF operations
- [**Working with Text**](working-with-text.md) – Select, add, edit, move, and delete paragraphs
- [**Working with Fonts**](working-with-fonts.md) – Standard fonts and custom TTF fonts
