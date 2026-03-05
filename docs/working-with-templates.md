---
id: working-with-templates
title: Working with Templates
description: Fill placeholders in PDF templates with dynamic content.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Fill placeholder text in PDF templates with dynamic content. This is useful for mail merge operations, invoice generation, certificate creation, and generating personalized documents at scale.

:::info How text matching works
PDFDancer does exact string matching — it finds the text you specify in the PDF and replaces it. There is no special placeholder syntax required. Any text that exists in the PDF can be matched and replaced. Conventions like `{PLACEHOLDER}` or `%PLACEHOLDER%` are just a way to make placeholders easy to find — the braces and percent signs have no special meaning to the API.
:::

---

## Font Registration

Most PDFs embed **subsetted fonts** — only the characters actually used in the document are included. When you replace text with new characters that weren't in the original PDF, those characters may not render correctly because they're missing from the subsetted font.

The solution is to register a full font file and specify it on each replacement:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Font

with PDFDancer.open("template.pdf") as pdf:
    # Register fonts before using them in replacements
    regular = pdf.register_font("fonts/MyFont-Regular.ttf")
    bold = pdf.register_font("fonts/MyFont-Bold.ttf")

    pdf.apply_replacements({
        "{NAME}": {
            "text": "John Doe",
            "font": Font(regular, 12),
        },
    })

    pdf.save("filled.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Font } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('template.pdf');

// Register fonts before using them in replacements
const regular = await pdf.registerFont('fonts/MyFont-Regular.ttf');
const bold = await pdf.registerFont('fonts/MyFont-Bold.ttf');

await pdf.replace('{NAME}', { text: 'John Doe', font: new Font(regular, 12) })
    .apply();

await pdf.save('filled.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.common.model.Font;

PDFDancer pdf = PDFDancer.createSession("template.pdf");

// Register fonts before using them in replacements
String regular = pdf.registerFont("fonts/MyFont-Regular.ttf");
String bold = pdf.registerFont("fonts/MyFont-Bold.ttf");

pdf.replace("{NAME}", new Font(regular, 12), "John Doe")
    .apply();

pdf.save("filled.pdf");
```

  </TabItem>
</Tabs>

See [Working with Fonts](working-with-fonts.md) for the full list of standard fonts and custom font registration details.

---

## Basic Usage

Fill placeholders throughout an entire document. You should always specify a font on each replacement to avoid issues with subsetted fonts (see above).

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Font

with PDFDancer.open("template.pdf") as pdf:
    font_name = pdf.register_font("fonts/MyFont-Regular.ttf")

    pdf.apply_replacements({
        "{NAME}": {
            "text": "John Doe",
            "font": Font(font_name, 12),
        },
        "{DATE}": {
            "text": "January 12, 2026",
            "font": Font(font_name, 12),
        },
        "{COMPANY}": {
            "text": "Acme Corp",
            "font": Font(font_name, 12),
        },
    })

    pdf.save("filled.pdf")
```

Plain string values are also supported (`"{NAME}": "John Doe"`), but the text will render using the original embedded font — which may have missing characters if the font is subsetted.

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Font } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('template.pdf');
const fontName = await pdf.registerFont('fonts/MyFont-Regular.ttf');

const font = new Font(fontName, 12);

await pdf.replace('{NAME}', { text: 'John Doe', font })
    .and('{DATE}', { text: 'January 12, 2026', font })
    .and('{COMPANY}', { text: 'Acme Corp', font })
    .apply();

await pdf.save('filled.pdf');
```

Plain string values are also supported (`'{NAME}', 'John Doe'`), but the text will render using the original embedded font — which may have missing characters if the font is subsetted.

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.common.model.Font;

PDFDancer pdf = PDFDancer.createSession("template.pdf");
String fontName = pdf.registerFont("fonts/MyFont-Regular.ttf");

Font font = new Font(fontName, 12);

pdf.replace("{NAME}", font, "John Doe")
    .replace("{DATE}", font, "January 12, 2026")
    .replace("{COMPANY}", font, "Acme Corp")
    .apply();

pdf.save("filled.pdf");
```

Plain string values are also supported (`"{NAME}", "John Doe"`), but the text will render using the original embedded font — which may have missing characters if the font is subsetted.

  </TabItem>
</Tabs>

---

## Matching Surrounding Text

You can match a placeholder along with its surrounding text to replace an entire phrase. This gives you control over line breaks and positioning:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Font

with PDFDancer.open("template.pdf") as pdf:
    font_name = pdf.register_font("fonts/MyFont-Regular.ttf")

    pdf.apply_replacements({
        # Match the placeholder AND surrounding text to replace the full phrase
        "{EMPLOYEES} switch to the Auto Insurance Program": {
            "text": "500 employees switch to the\nAuto Insurance Program",
            "font": Font(font_name, 16),
        },
    })

    pdf.save("filled.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Font } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('template.pdf');
const fontName = await pdf.registerFont('fonts/MyFont-Regular.ttf');

// Match the placeholder AND surrounding text to replace the full phrase
await pdf.replace(
    '{EMPLOYEES} switch to the Auto Insurance Program',
    { text: '500 employees switch to the\nAuto Insurance Program', font: new Font(fontName, 16) }
).apply();

await pdf.save('filled.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.common.model.Font;

PDFDancer pdf = PDFDancer.createSession("template.pdf");
String fontName = pdf.registerFont("fonts/MyFont-Regular.ttf");

// Match the placeholder AND surrounding text to replace the full phrase
pdf.replace(
    "{EMPLOYEES} switch to the Auto Insurance Program",
    new Font(fontName, 16),
    "500 employees switch to the\nAuto Insurance Program"
).apply();

pdf.save("filled.pdf");
```

  </TabItem>
</Tabs>

Using `\n` in the replacement text creates a line break, splitting the text across multiple lines. This is useful when replacement text is longer than the original and you need to control where lines wrap.

---

## Page-Level Filling

Fill placeholders on a specific page only:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Font

with PDFDancer.open("template.pdf") as pdf:
    font_name = pdf.register_font("fonts/MyFont-Regular.ttf")
    font = Font(font_name, 14)

    # Fill only on page 1
    pdf.page(1).apply_replacements({
        "{HEADER}": {"text": "Welcome", "font": font},
    })

    # Fill only on page 2
    pdf.page(2).apply_replacements({
        "{HEADER}": {"text": "Details", "font": font},
    })

    pdf.save("filled.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Font } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('template.pdf');
const fontName = await pdf.registerFont('fonts/MyFont-Regular.ttf');
const font = new Font(fontName, 14);

// Fill only on page 1
await pdf.replace('{HEADER}', { text: 'Welcome', font })
    .onPage(1)
    .apply();

// Fill only on page 2
await pdf.replace('{HEADER}', { text: 'Details', font })
    .onPage(2)
    .apply();

await pdf.save('filled.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.common.model.Font;

PDFDancer pdf = PDFDancer.createSession("template.pdf");
String fontName = pdf.registerFont("fonts/MyFont-Regular.ttf");
Font font = new Font(fontName, 14);

// Fill only on page 1
pdf.page(1).replace("{HEADER}", font, "Welcome").apply();

// Fill only on page 2
pdf.page(2).replace("{HEADER}", font, "Details").apply();

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
| `NONE` | No reflow; text may overflow or be truncated. Use when you want full control over layout. |

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Font, ReflowPreset

with PDFDancer.open("template.pdf") as pdf:
    font_name = pdf.register_font("fonts/MyFont-Regular.ttf")

    pdf.apply_replacements(
        {
            "{DESCRIPTION}": {
                "text": "This is a much longer replacement text",
                "font": Font(font_name, 12),
            },
        },
        reflow_preset=ReflowPreset.BEST_EFFORT
    )

    pdf.save("filled.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Font } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('template.pdf');
const fontName = await pdf.registerFont('fonts/MyFont-Regular.ttf');

await pdf.replace('{DESCRIPTION}', {
    text: 'This is a much longer replacement text',
    font: new Font(fontName, 12),
}).bestEffort().apply();

await pdf.save('filled.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.common.model.Font;
import com.pdfdancer.common.model.ReflowPreset;

PDFDancer pdf = PDFDancer.createSession("template.pdf");
String fontName = pdf.registerFont("fonts/MyFont-Regular.ttf");

pdf.replace("{DESCRIPTION}", new Font(fontName, 12), "This is a much longer replacement text")
    .withReflow(ReflowPreset.BEST_EFFORT)
    .apply();

pdf.save("filled.pdf");
```

  </TabItem>
</Tabs>

---

## Custom Formatting

You can specify font size and color for replacement text. Since you should always specify a font for correctness with subsetted fonts (see [Font Registration](#font-registration)), the main additional option here is color:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Font, Color

with PDFDancer.open("template.pdf") as pdf:
    font_name = pdf.register_font("fonts/MyFont-Bold.ttf")

    pdf.apply_replacements({
        "{HIGHLIGHT}": {
            "text": "Important Text",
            "font": Font(font_name, 14),
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
const fontName = await pdf.registerFont('fonts/MyFont-Bold.ttf');

await pdf.replace('{HIGHLIGHT}', {
    text: 'Important Text',
    font: new Font(fontName, 14),
    color: new Color(255, 0, 0),  // Red
}).apply();

await pdf.save('filled.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.common.model.Font;
import com.pdfdancer.common.model.Color;

PDFDancer pdf = PDFDancer.createSession("template.pdf");
String fontName = pdf.registerFont("fonts/MyFont-Bold.ttf");

pdf.replace("{HIGHLIGHT}", new Font(fontName, 14), "Important Text")
    .withColor(255, 0, 0)  // Red
    .apply();

pdf.save("filled.pdf");
```

  </TabItem>
</Tabs>

---

## Replacing with Images

Replace placeholder text with an image. The image is placed at the placeholder's position. You can specify `width`, `height`, or both — if only one dimension is given, the image scales proportionally. If neither is specified, the image's natural size is used.

<Tabs>
  <TabItem value="python" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer

with PDFDancer.open("template.pdf") as pdf:
    # Replace placeholder with image, scaled to width of 150px
    pdf.apply_replacements({
        "{LOGO}": {"image": Path("logo.png"), "width": 150},
    })

    # Replace with explicit width and height
    pdf.apply_replacements({
        "{SIGNATURE}": {"image": Path("signature.png"), "width": 150, "height": 50},
    })

    pdf.save("filled.pdf")
```

You can mix text and image replacements in a single call:

```python
from pathlib import Path
from pdfdancer import PDFDancer, Font

with PDFDancer.open("template.pdf") as pdf:
    font_name = pdf.register_font("fonts/MyFont-Regular.ttf")

    pdf.apply_replacements({
        "{NAME}": {
            "text": "John Doe",
            "font": Font(font_name, 12),
        },
        "{LOGO}": {"image": Path("logo.png"), "width": 150},
        "{DATE}": {
            "text": "January 15, 2026",
            "font": Font(font_name, 12),
        },
    })
    pdf.save("filled.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('template.pdf');

// Replace placeholder with image, scaled to width of 150px
await pdf.replace()
    .replaceWithImage('{LOGO}', 'logo.png', 150)
    .apply();

// Replace with explicit width and height
await pdf.replace()
    .replaceWithImage('{SIGNATURE}', 'signature.png', 150, 50)
    .apply();

await pdf.save('filled.pdf');
```

You can mix text and image replacements using the fluent API:

```typescript
import { PDFDancer, Font } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('template.pdf');
const fontName = await pdf.registerFont('fonts/MyFont-Regular.ttf');
const font = new Font(fontName, 12);

await pdf.replace('{NAME}', { text: 'John Doe', font })
    .andImage('{LOGO}', 'logo.png', 150)
    .and('{DATE}', { text: 'January 15, 2026', font })
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
    .replaceWithImage('{LOGO}', imageData, 100, 50)
    .apply();

await pdf.save('filled.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import java.io.File;

PDFDancer pdf = PDFDancer.createSession("template.pdf");

// Replace placeholder with image, scaled to width of 150px
pdf.replaceWithImage("{LOGO}", new File("logo.png"), 150).apply();

// Replace with explicit width and height
pdf.replaceWithImage("{SIGNATURE}", new File("signature.png"), 150, 50).apply();

pdf.save("filled.pdf");
```

You can mix text and image replacements using the fluent API:

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.common.model.Font;
import java.io.File;

PDFDancer pdf = PDFDancer.createSession("template.pdf");
String fontName = pdf.registerFont("fonts/MyFont-Regular.ttf");
Font font = new Font(fontName, 12);

pdf.replace("{NAME}", font, "John Doe")
    .replaceWithImage("{LOGO}", new File("logo.png"), 150)
    .replace("{DATE}", font, "January 15, 2026")
    .apply();

pdf.save("filled.pdf");
```

Page-level image replacement is also supported:

```java
import com.pdfdancer.client.rest.PDFDancer;
import java.io.File;

PDFDancer pdf = PDFDancer.createSession("template.pdf");

// Replace only on page 1
pdf.page(1).replaceWithImage("{LOGO}", new File("logo.png"), 150).apply();

pdf.save("filled.pdf");
```

  </TabItem>
</Tabs>

---

## Use Cases

### Mail Merge

Generate personalized documents from a template:

```python
from pdfdancer import PDFDancer, Font

recipients = [
    {"name": "Alice Johnson", "account": "ACC-001"},
    {"name": "Bob Smith", "account": "ACC-002"},
]

for recipient in recipients:
    with PDFDancer.open("letter_template.pdf") as pdf:
        font_name = pdf.register_font("fonts/MyFont-Regular.ttf")
        font = Font(font_name, 12)

        pdf.apply_replacements({
            "{RECIPIENT_NAME}": {"text": recipient["name"], "font": font},
            "{ACCOUNT_NUMBER}": {"text": recipient["account"], "font": font},
        })
        pdf.save(f"letter_{recipient['account']}.pdf")
```

### Invoice Generation

Fill invoice templates with order data:

```python
from pdfdancer import PDFDancer, Font

with PDFDancer.open("invoice_template.pdf") as pdf:
    font_name = pdf.register_font("fonts/MyFont-Regular.ttf")
    font = Font(font_name, 12)

    pdf.apply_replacements({
        "{INVOICE_NUMBER}": {"text": "INV-2026-0001", "font": font},
        "{CUSTOMER_NAME}": {"text": "Acme Corporation", "font": font},
        "{TOTAL_AMOUNT}": {"text": "$1,234.56", "font": font},
        "{DUE_DATE}": {"text": "February 12, 2026", "font": font},
    })
    pdf.save("invoice.pdf")
```

### Certificate Generation

Create personalized certificates:

```python
from pdfdancer import PDFDancer, Font, ReflowPreset

with PDFDancer.open("certificate_template.pdf") as pdf:
    font_name = pdf.register_font("fonts/MyFont-Regular.ttf")
    font = Font(font_name, 14)

    pdf.apply_replacements(
        {
            "{RECIPIENT}": {"text": "Dr. Jane Smith", "font": font},
            "{ACHIEVEMENT}": {"text": "Excellence in Research", "font": font},
            "{DATE}": {"text": "January 12, 2026", "font": font},
        },
        reflow_preset=ReflowPreset.BEST_EFFORT
    )
    pdf.save("certificate.pdf")
```

---

## Best Practices

1. **Always register and specify fonts**: PDFs typically embed subsetted fonts. Register a full font file and specify it on every replacement to avoid missing characters.

2. **Test with edge cases**: Test with both shorter and longer replacement text to ensure proper rendering.

3. **Use BEST_EFFORT reflow**: For most use cases, `BEST_EFFORT` reflow provides the best results when replacement text varies in length. Use `NONE` when you want full control over layout.

4. **Match surrounding text for line break control**: When you need to control where text wraps, match the placeholder along with its surrounding text and use `\n` to insert line breaks.

5. **Validate replacements**: Ensure all placeholders in your template have corresponding replacements to avoid leaving placeholder text in the output.

---

## Next Steps

- [**Working with Fonts**](working-with-fonts.md) – Standard fonts and custom font registration
- [**Working with Text**](working-with-text.md) – Learn about text selection and editing
- [**Redaction**](redaction.md) – Remove sensitive content from PDFs
- [**Cookbook**](cookbook.md) – More examples and patterns
