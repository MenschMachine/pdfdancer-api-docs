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

Choose your preferred method:

**Option 1: AI-Assisted Development** – Let your AI coding assistant handle everything (recommended for fastest setup)
- See [AI-Assisted Development](ai-assisted-development.md) to install the MCP server, then just ask: _"Create a PDF with PDFDancer"_

**Option 2: Manual Install** – Traditional package manager installation

**Requirements:** Python 3.10+, Node.js 20+ or Java 11+.

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

Add to your Maven `pom.xml`:

```xml
<dependency>
  <groupId>com.pdfdancer.client</groupId>
  <artifactId>pdfdancer-client-java</artifactId>
  <version>0.2.3</version>
</dependency>
```

Or add to your Gradle `build.gradle.kts`:

```kotlin
dependencies {
    implementation("com.pdfdancer.client:pdfdancer-client-java:0.2.3")
}
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
    heading = pdf.page(1).select_paragraphs_starting_with("Executive Summary")[0]
    heading.edit().replace("Overview").apply()

    # Add a new paragraph using the fluent builder
    pdf.new_paragraph() \
        .text("Generated with PDFDancer") \
        .font("Helvetica", 12) \
        .color(Color(70, 70, 70)) \
        .line_spacing(1.4) \
        .at(page_number=1, x=72, y=520) \
        .add()

    # Persist the modified document
    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import {PDFDancer, Color} from 'pdfdancer-client-typescript';

async function run() {
    // No token needed! SDK automatically gets an anonymous token
    const pdf = await PDFDancer.open('input.pdf');

    const page0 = pdf.page(1);

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

    await pdf.save('output.pdf');
}

run().catch(console.error);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.client.rest.TextParagraphReference;
import com.pdfdancer.common.model.Color;
import com.pdfdancer.common.util.StandardFonts;

import java.io.File;

public class Example {
    public static void main(String[] args) throws Exception {
        // No token needed! SDK automatically gets an anonymous token
        PDFDancer pdf = PDFDancer.createSession(new File("input.pdf"));

        // Locate and edit existing content
        TextParagraphReference heading = pdf.page(1)
                .selectParagraphsStartingWith("Executive Summary")
                .get(0);

        heading.edit()
                .replace("Overview")
                .apply();

        // Add a new paragraph using the fluent builder
        pdf.newParagraph()
                .text("Generated with PDFDancer")
                .font(StandardFonts.HELVETICA.getFontName(), 12)
                .color(new Color(70, 70, 70))
                .lineSpacing(1.4)
                .at(1, 72, 520)
                .add();

        // Persist the modified document
        pdf.save("output.pdf");
    }
}
```

  </TabItem>
</Tabs>

## What's Next?

- [**AI-Assisted Development**](ai-assisted-development.md) – Let your AI assistant build PDF applications for you
- [**Authentication**](authentication.md) – Learn how to securely manage API tokens for production
- [**Concepts & Core Features**](concepts.md) – Understand PDFDancer's approach to PDF editing
- [**Working with Text**](working-with-text.md) – Select, add, edit, move, and delete paragraphs
- [**Cookbook**](cookbook.md) – Common patterns and recipes
