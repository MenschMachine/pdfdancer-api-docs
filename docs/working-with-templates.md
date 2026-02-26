---
id: working-with-templates
title: Working with Templates
description: Fill placeholders in PDF templates with dynamic content.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Fill placeholder text in PDF templates with dynamic content. This is useful for mail merge operations, invoice generation, certificate creation, and generating personalized documents at scale.

---

## Basic Usage

Fill placeholders throughout an entire document:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("template.pdf") as pdf:
    # Fill placeholders in the entire document
    pdf.apply_replacements({
        "{{NAME}}": "John Doe",
        "{{DATE}}": "January 12, 2026",
        "{{COMPANY}}": "Acme Corp",
    })

    pdf.save("filled.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('template.pdf');

// Fill placeholders using fluent API
await pdf.replace('{{NAME}}', 'John Doe')
    .and('{{DATE}}', 'January 12, 2026')
    .and('{{COMPANY}}', 'Acme Corp')
    .apply();

await pdf.save('filled.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;

PDFDancer pdf = PDFDancer.createSession("template.pdf");

// Fill placeholders using fluent API
pdf.replace("{{NAME}}", "John Doe")
    .replace("{{DATE}}", "January 12, 2026")
    .replace("{{COMPANY}}", "Acme Corp")
    .apply();

pdf.save("filled.pdf");
```

  </TabItem>
</Tabs>

---

## Page-Level Filling

Fill placeholders on a specific page only:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("template.pdf") as pdf:
    # Fill only on page 1
    pdf.page(1).apply_replacements({
        "{{HEADER}}": "Welcome",
    })

    # Fill only on page 2
    pdf.page(2).apply_replacements({
        "{{HEADER}}": "Details",
    })

    pdf.save("filled.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('template.pdf');

// Fill only on page 1
await pdf.replace('{{HEADER}}', 'Welcome')
    .onPage(1)
    .apply();

// Fill only on page 2
await pdf.replace('{{HEADER}}', 'Details')
    .onPage(2)
    .apply();

await pdf.save('filled.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;

PDFDancer pdf = PDFDancer.createSession("template.pdf");

// Fill only on page 1
pdf.page(1).replace("{{HEADER}}", "Welcome").apply();

// Fill only on page 2
pdf.page(2).replace("{{HEADER}}", "Details").apply();

pdf.save("filled.pdf");
```

  </TabItem>
</Tabs>

---

## Text Reflow

When replacement text is longer or shorter than the placeholder, PDFDancer can automatically reflow the text to fit. Use the reflow preset to control this behavior:

| Preset | Description |
|--------|-------------|
| `BEST_EFFORT` | Automatically adjusts text to fit available space (recommended) |
| `FIT_OR_FAIL` | Fails if text doesn't fit in the available space |
| `NONE` | No reflow; text may overflow or be truncated |

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, ReflowPreset

with PDFDancer.open("template.pdf") as pdf:
    # Use BEST_EFFORT reflow for longer replacement text
    pdf.apply_replacements(
        {"{{SHORT}}": "This is a much longer replacement text"},
        reflow_preset=ReflowPreset.BEST_EFFORT
    )

    pdf.save("filled.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('template.pdf');

// Use BEST_EFFORT reflow for longer replacement text
await pdf.replace('{{SHORT}}', 'This is a much longer replacement text')
    .bestEffort()
    .apply();

await pdf.save('filled.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.common.model.ReflowPreset;

PDFDancer pdf = PDFDancer.createSession("template.pdf");

// Use BEST_EFFORT reflow for longer replacement text
pdf.replace("{{SHORT}}", "This is a much longer replacement text")
    .withReflow(ReflowPreset.BEST_EFFORT)
    .apply();

pdf.save("filled.pdf");
```

  </TabItem>
</Tabs>

---

## Custom Formatting

You can optionally specify font and color for replacement text:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Font, Color

with PDFDancer.open("template.pdf") as pdf:
    # Fill with custom font and color
    pdf.apply_replacements({
        "{{HIGHLIGHT}}": {
            "text": "Important Text",
            "font": Font("Helvetica-Bold", 14),
            "color": Color(255, 0, 0),  # Red
        },
    })
    pdf.save("filled.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Font, Color } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('template.pdf');

// Fill with custom font and color
await pdf.replace('{{HIGHLIGHT}}', 'Important Text')
    .font('Helvetica-Bold', 14)
    .color(new Color(255, 0, 0))  // Red
    .apply();

await pdf.save('filled.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;

PDFDancer pdf = PDFDancer.createSession("template.pdf");

// Fill with custom font and color
pdf.replace("{{HIGHLIGHT}}", "Important Text")
    .withFont("Helvetica-Bold", 14)
    .withColor(255, 0, 0)  // Red
    .apply();

pdf.save("filled.pdf");
```

  </TabItem>
</Tabs>

---

## Replacing with Images

Replace placeholder text with an image instead of text. The image is placed at the placeholder's position. You can optionally specify width and height; if omitted, the image's natural size is used.

<Tabs>
  <TabItem value="python" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer

with PDFDancer.open("template.pdf") as pdf:
    # Replace placeholder with image (natural size)
    pdf.apply_replacements({
        "{{LOGO}}": {"image": Path("logo.png")},
    })

    # Replace with explicit size
    pdf.apply_replacements({
        "{{SIGNATURE}}": {"image": Path("signature.png"), "width": 150, "height": 50},
    })

    pdf.save("filled.pdf")
```

You can mix text and image replacements in a single call:

```python
from pathlib import Path
from pdfdancer import PDFDancer

with PDFDancer.open("template.pdf") as pdf:
    pdf.apply_replacements({
        "{{NAME}}": "John Doe",
        "{{LOGO}}": {"image": Path("logo.png")},
        "{{DATE}}": "January 15, 2026",
    })
    pdf.save("filled.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('template.pdf');

// Replace placeholder with image (natural size)
await pdf.replace()
    .replaceWithImage('{{LOGO}}', 'logo.png')
    .apply();

// Replace with explicit size
await pdf.replace()
    .replaceWithImage('{{SIGNATURE}}', 'signature.png', 150, 50)
    .apply();

await pdf.save('filled.pdf');
```

You can mix text and image replacements using the fluent API:

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('template.pdf');

await pdf.replace('{{NAME}}', 'John Doe')
    .andImage('{{LOGO}}', 'logo.png')
    .and('{{DATE}}', 'January 15, 2026')
    .apply();

await pdf.save('filled.pdf');
```

You can also pass raw image data as a `Uint8Array`:

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';
import * as fs from 'fs';

const pdf = await PDFDancer.open('template.pdf');
const imageData = new Uint8Array(fs.readFileSync('logo.png'));

await pdf.replace()
    .replaceWithImage('{{LOGO}}', imageData, 100, 50)
    .apply();

await pdf.save('filled.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import java.io.File;

PDFDancer pdf = PDFDancer.createSession("template.pdf");

// Replace placeholder with image (natural size)
pdf.replaceWithImage("{{LOGO}}", new File("logo.png")).apply();

// Replace with explicit size
pdf.replaceWithImage("{{SIGNATURE}}", new File("signature.png"), 150, 50).apply();

pdf.save("filled.pdf");
```

You can mix text and image replacements using the fluent API:

```java
import com.pdfdancer.client.rest.PDFDancer;
import java.io.File;

PDFDancer pdf = PDFDancer.createSession("template.pdf");

pdf.replace("{{NAME}}", "John Doe")
    .replaceWithImage("{{LOGO}}", new File("logo.png"))
    .replace("{{DATE}}", "January 15, 2026")
    .apply();

pdf.save("filled.pdf");
```

Page-level image replacement is also supported:

```java
import com.pdfdancer.client.rest.PDFDancer;
import java.io.File;

PDFDancer pdf = PDFDancer.createSession("template.pdf");

// Replace only on page 1
pdf.page(1).replaceWithImage("{{LOGO}}", new File("logo.png")).apply();

pdf.save("filled.pdf");
```

  </TabItem>
</Tabs>

---

## Use Cases

### Mail Merge

Generate personalized documents from a template:

```python
from pdfdancer import PDFDancer

recipients = [
    {"name": "Alice Johnson", "account": "ACC-001"},
    {"name": "Bob Smith", "account": "ACC-002"},
]

for recipient in recipients:
    with PDFDancer.open("letter_template.pdf") as pdf:
        pdf.apply_replacements({
            "{{RECIPIENT_NAME}}": recipient["name"],
            "{{ACCOUNT_NUMBER}}": recipient["account"],
        })
        pdf.save(f"letter_{recipient['account']}.pdf")
```

### Invoice Generation

Fill invoice templates with order data:

```python
from pdfdancer import PDFDancer

with PDFDancer.open("invoice_template.pdf") as pdf:
    pdf.apply_replacements({
        "{{INVOICE_NUMBER}}": "INV-2026-0001",
        "{{CUSTOMER_NAME}}": "Acme Corporation",
        "{{TOTAL_AMOUNT}}": "$1,234.56",
        "{{DUE_DATE}}": "February 12, 2026",
    })
    pdf.save("invoice.pdf")
```

### Certificate Generation

Create personalized certificates:

```python
from pdfdancer import PDFDancer, ReflowPreset

with PDFDancer.open("certificate_template.pdf") as pdf:
    pdf.apply_replacements(
        {
            "{{RECIPIENT}}": "Dr. Jane Smith",
            "{{ACHIEVEMENT}}": "Excellence in Research",
            "{{DATE}}": "January 12, 2026",
        },
        reflow_preset=ReflowPreset.BEST_EFFORT
    )
    pdf.save("certificate.pdf")
```

---

## Best Practices

1. **Use consistent placeholder syntax**: Choose a format like `{{PLACEHOLDER}}` or `%PLACEHOLDER%` and use it consistently throughout your templates.

2. **Test with edge cases**: Test with both shorter and longer replacement text to ensure proper rendering.

3. **Use BEST_EFFORT reflow**: For most use cases, `BEST_EFFORT` reflow provides the best results when replacement text varies in length.

4. **Validate replacements**: Ensure all placeholders in your template have corresponding replacements to avoid leaving placeholder text in the output.

---

## Next Steps

- [**Working with Text**](working-with-text.md) – Learn about text selection and editing
- [**Redaction**](redaction.md) – Remove sensitive content from PDFs
- [**Cookbook**](cookbook.md) – More examples and patterns
