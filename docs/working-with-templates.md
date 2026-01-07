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
from pdfdancer import PDFDancer, TemplateReplacement

with PDFDancer.open("template.pdf") as pdf:
    # Fill placeholders in the entire document
    pdf.apply_replacements([
        TemplateReplacement("{{NAME}}", "John Doe"),
        TemplateReplacement("{{DATE}}", "January 7, 2026"),
        TemplateReplacement("{{COMPANY}}", "Acme Corp"),
    ])

    pdf.save("filled.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, TemplateReplacement, TemplateReplaceRequest } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('template.pdf');

// Fill placeholders in the entire document
await pdf.applyReplacements(new TemplateReplaceRequest([
    new TemplateReplacement('{{NAME}}', 'John Doe'),
    new TemplateReplacement('{{DATE}}', 'January 7, 2026'),
    new TemplateReplacement('{{COMPANY}}', 'Acme Corp'),
]));

await pdf.save('filled.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.common.request.TemplateReplacement;
import com.pdfdancer.common.request.TemplateReplaceRequest;

PDFDancer pdf = PDFDancer.createSession("template.pdf");

// Fill placeholders in the entire document
pdf.applyReplacements(TemplateReplaceRequest.builder()
    .addReplacement("{{NAME}}", "John Doe")
    .addReplacement("{{DATE}}", "January 7, 2026")
    .addReplacement("{{COMPANY}}", "Acme Corp")
    .build());

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
from pdfdancer import PDFDancer, TemplateReplacement

with PDFDancer.open("template.pdf") as pdf:
    # Fill only on page 1
    pdf.page(1).apply_replacements([
        TemplateReplacement("{{HEADER}}", "Welcome"),
    ])

    # Fill only on page 2
    pdf.page(2).apply_replacements([
        TemplateReplacement("{{HEADER}}", "Details"),
    ])

    pdf.save("filled.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, TemplateReplacement, TemplateReplaceRequest } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('template.pdf');

// Fill only on page 1 (pageIndex is 0-based internally)
await pdf.applyReplacements(new TemplateReplaceRequest(
    [new TemplateReplacement('{{HEADER}}', 'Welcome')],
    0  // Page index
));

// Fill only on page 2
await pdf.applyReplacements(new TemplateReplaceRequest(
    [new TemplateReplacement('{{HEADER}}', 'Details')],
    1  // Page index
));

await pdf.save('filled.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.common.request.TemplateReplaceRequest;

PDFDancer pdf = PDFDancer.createSession("template.pdf");

// Fill only on page 1 (pageIndex is 0-based)
pdf.applyReplacements(TemplateReplaceRequest.builder()
    .addReplacement("{{HEADER}}", "Welcome")
    .pageIndex(0)
    .build());

// Fill only on page 2
pdf.applyReplacements(TemplateReplaceRequest.builder()
    .addReplacement("{{HEADER}}", "Details")
    .pageIndex(1)
    .build());

pdf.save("filled.pdf");
```

  </TabItem>
</Tabs>

---

## Text Reflow

When replacement text is longer or shorter than the placeholder, PDFDancer can automatically reflow the text to fit. Use the `reflow_preset` parameter to control this behavior:

| Preset | Description |
|--------|-------------|
| `BEST_EFFORT` | Automatically adjusts text to fit available space (recommended) |
| `FIT_OR_FAIL` | Fails if text doesn't fit in the available space |
| `NONE` | No reflow; text may overflow or be truncated |

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, TemplateReplacement, ReflowPreset

with PDFDancer.open("template.pdf") as pdf:
    # Use BEST_EFFORT reflow for longer replacement text
    pdf.apply_replacements(
        [TemplateReplacement("{{SHORT}}", "This is a much longer replacement text")],
        reflow_preset=ReflowPreset.BEST_EFFORT
    )

    pdf.save("filled.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, TemplateReplacement, TemplateReplaceRequest, ReflowPreset } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('template.pdf');

// Use BEST_EFFORT reflow for longer replacement text
await pdf.applyReplacements(new TemplateReplaceRequest(
    [new TemplateReplacement('{{SHORT}}', 'This is a much longer replacement text')],
    undefined,  // No specific page
    ReflowPreset.BEST_EFFORT
));

await pdf.save('filled.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.common.request.TemplateReplaceRequest;
import com.pdfdancer.common.model.ReflowPreset;

PDFDancer pdf = PDFDancer.createSession("template.pdf");

// Use BEST_EFFORT reflow for longer replacement text
pdf.applyReplacements(TemplateReplaceRequest.builder()
    .addReplacement("{{SHORT}}", "This is a much longer replacement text")
    .reflowPreset(ReflowPreset.BEST_EFFORT)
    .build());

pdf.save("filled.pdf");
```

  </TabItem>
</Tabs>

---

## Custom Formatting

You can optionally specify font and color for replacement text (TypeScript and Java only):

<Tabs>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, TemplateReplacement, TemplateReplaceRequest, Font, Color } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('template.pdf');

// Fill with custom font and color
await pdf.applyReplacements(new TemplateReplaceRequest([
    new TemplateReplacement(
        '{{HIGHLIGHT}}',
        'Important Text',
        new Font('Helvetica-Bold', 14),
        new Color(255, 0, 0)  // Red
    ),
]));

await pdf.save('filled.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.common.request.TemplateReplacement;
import com.pdfdancer.common.request.TemplateReplaceRequest;
import com.pdfdancer.common.model.Font;
import com.pdfdancer.common.model.Color;

PDFDancer pdf = PDFDancer.createSession("template.pdf");

// Fill with custom font and color
pdf.applyReplacements(TemplateReplaceRequest.builder()
    .addReplacement(TemplateReplacement.withFormatting(
        "{{HIGHLIGHT}}",
        "Important Text",
        new Font("Helvetica-Bold", 14),
        new Color(255, 0, 0)  // Red
    ))
    .build());

pdf.save("filled.pdf");
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
# Python SDK currently supports placeholder and text only
# Font and color overrides are not yet available
from pdfdancer import PDFDancer, TemplateReplacement

with PDFDancer.open("template.pdf") as pdf:
    pdf.apply_replacements([
        TemplateReplacement("{{HIGHLIGHT}}", "Important Text"),
    ])
    pdf.save("filled.pdf")
```

  </TabItem>
</Tabs>

---

## Use Cases

### Mail Merge

Generate personalized documents from a template:

```python
from pdfdancer import PDFDancer, TemplateReplacement

recipients = [
    {"name": "Alice Johnson", "account": "ACC-001"},
    {"name": "Bob Smith", "account": "ACC-002"},
]

for recipient in recipients:
    with PDFDancer.open("letter_template.pdf") as pdf:
        pdf.apply_replacements([
            TemplateReplacement("{{RECIPIENT_NAME}}", recipient["name"]),
            TemplateReplacement("{{ACCOUNT_NUMBER}}", recipient["account"]),
        ])
        pdf.save(f"letter_{recipient['account']}.pdf")
```

### Invoice Generation

Fill invoice templates with order data:

```python
from pdfdancer import PDFDancer, TemplateReplacement

with PDFDancer.open("invoice_template.pdf") as pdf:
    pdf.apply_replacements([
        TemplateReplacement("{{INVOICE_NUMBER}}", "INV-2026-0001"),
        TemplateReplacement("{{CUSTOMER_NAME}}", "Acme Corporation"),
        TemplateReplacement("{{TOTAL_AMOUNT}}", "$1,234.56"),
        TemplateReplacement("{{DUE_DATE}}", "February 7, 2026"),
    ])
    pdf.save("invoice.pdf")
```

### Certificate Generation

Create personalized certificates:

```python
from pdfdancer import PDFDancer, TemplateReplacement, ReflowPreset

with PDFDancer.open("certificate_template.pdf") as pdf:
    pdf.apply_replacements(
        [
            TemplateReplacement("{{RECIPIENT}}", "Dr. Jane Smith"),
            TemplateReplacement("{{ACHIEVEMENT}}", "Excellence in Research"),
            TemplateReplacement("{{DATE}}", "January 7, 2026"),
        ],
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
