---
id: reflow-internals
title: How Reflow Works
description: Understanding PDFDancer's text reflow engine and strategies.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page explains how PDFDancer's text reflow feature works internally, including the available strategies and how they combine.

---

## What Reflow Is

Reflow is a feature that allows you to **replace existing text in a PDF** and have the engine automatically adjust layout so the new text fits.

Use reflow when:
- You want to replace text in-place (e.g., translations, corrections, template filling)
- The new text is longer or shorter than the original
- You want the engine to try reasonable layout adjustments instead of failing immediately

Reflow always operates **inside an existing text container**:
- A single text line
- A paragraph (multi-line text block)

It does *not* analyze whole pages or documents.

---

## What Reflow Is Not

Reflow does **not**:
- Reconstruct logical reading order
- Merge or split paragraphs automatically
- Detect columns or tables
- Perform OCR
- Re-layout the entire page

If you are looking for semantic document reflow or accessibility-style linearization, this feature is not that.

---

## Reflow Presets

PDFDancer exposes reflow through three presets that map to internal strategy chains:

| Preset | Behavior |
|--------|----------|
| `BEST_EFFORT` | Tries rewrapping, then font scaling, then vertical expansion. Almost always succeeds. |
| `FIT_OR_FAIL` | Tries rewrapping and font scaling only. Fails if text cannot fit in original bounds. |
| `NONE` | No reflow. Text is placed as-is and may overflow or be truncated. |

---

## Internal Strategies

Under the hood, reflow uses a **strategy chain**. Strategies are tried in order and are cumulative.

### Rewrap

- Redistributes words across multiple lines
- Uses all available height in the original bounds
- Attempts to minimize the *maximum* line width (optimal line breaking)
- Does **not** change font size

This is always tried first in `BEST_EFFORT` and `FIT_OR_FAIL` modes.

### Scale Font

- Reduces font size in discrete steps (0.5 point increments)
- Stops at a minimum font size threshold
- Keeps any rewrapping already enabled

This is tried after rewrapping fails to fit the text.

### Expand Vertically

- Allows the text block to grow taller than original bounds
- Still rewraps text optimally within the new height
- Almost always succeeds unless something is fundamentally broken

This is the last resort in `BEST_EFFORT` mode.

### Expand Horizontally

- Allows lines to become wider than original bounds
- Less commonly useful, mainly for labels or headings

---

## How the Presets Map to Strategies

```
BEST_EFFORT:
  1. rewrap()
  2. scaleFont(minSize)
  3. expandVertically()

FIT_OR_FAIL:
  1. rewrap()
  2. scaleFont(minSize)
  [fails if still doesn't fit]

NONE:
  [no strategies applied]
```

---

## Behavior by Text Element Type

### Paragraphs (Multi-line)

For paragraphs, all strategies apply:
1. First, words are redistributed across lines to find the optimal layout
2. If that fails, font size is reduced incrementally
3. If still too large, the paragraph may expand vertically (in `BEST_EFFORT` mode)

### Single Lines

For single-line text, rewrapping is meaningless (there's only one line). Only font scaling or expansion applies:
1. Font size is reduced until the text fits
2. If configured, the line may expand horizontally

---

## Failure Handling

Reflow is **strict by design**. There is no silent fallback.

- If reflow succeeds, the original text elements are replaced with new ones
- If it fails, an error is thrown with details about why (calculated width, height, font size)

This is intentional: PDFDancer prefers **failing loudly** over producing visually broken PDFs.

---

## Practical Examples

### Example 1: Replacement That Fits Naturally

When replacement text is similar in length, rewrapping alone handles it:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, ReflowPreset

with PDFDancer.open("document.pdf") as pdf:
    pdf.apply_replacements(
        {"{{NAME}}": "John Smith"},
        reflow_preset=ReflowPreset.BEST_EFFORT
    )
    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');

await pdf.replace('{{NAME}}', 'John Smith')
    .bestEffort()
    .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.common.model.ReflowPreset;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

pdf.replace("{{NAME}}", "John Smith")
    .withReflow(ReflowPreset.BEST_EFFORT)
    .apply();

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

### Example 2: Longer Replacement Text

When replacement text is significantly longer, the strategy chain kicks in:

1. Rewrap redistributes words across available lines
2. If still too long, font size shrinks (e.g., from 12pt to 11.5pt, then 11pt, etc.)
3. Finally, the text block may grow taller if needed

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, ReflowPreset

with PDFDancer.open("template.pdf") as pdf:
    # Long replacement text - reflow handles it automatically
    pdf.apply_replacements(
        {"{{DESCRIPTION}}": "This is a much longer description that would not fit in the original placeholder space without reflow adjustments."},
        reflow_preset=ReflowPreset.BEST_EFFORT
    )
    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open('template.pdf');

// Long replacement text - reflow handles it automatically
await pdf.replace('{{DESCRIPTION}}',
    'This is a much longer description that would not fit in the original placeholder space without reflow adjustments.')
    .bestEffort()
    .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
PDFDancer pdf = PDFDancer.createSession("template.pdf");

// Long replacement text - reflow handles it automatically
pdf.replace("{{DESCRIPTION}}",
    "This is a much longer description that would not fit in the original placeholder space without reflow adjustments.")
    .withReflow(ReflowPreset.BEST_EFFORT)
    .apply();

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

### Example 3: Strict Fitting

Use `FIT_OR_FAIL` when you need the text to stay within original bounds:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, ReflowPreset

with PDFDancer.open("form.pdf") as pdf:
    try:
        pdf.apply_replacements(
            {"{{FIELD}}": "Value"},
            reflow_preset=ReflowPreset.FIT_OR_FAIL
        )
        pdf.save("output.pdf")
    except Exception as e:
        print(f"Text does not fit: {e}")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open('form.pdf');

try {
    await pdf.replace('{{FIELD}}', 'Value')
        .fitOrFail()
        .apply();
    await pdf.save('output.pdf');
} catch (error) {
    console.error('Text does not fit:', error);
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
PDFDancer pdf = PDFDancer.createSession("form.pdf");

try {
    pdf.replace("{{FIELD}}", "Value")
        .withReflow(ReflowPreset.FIT_OR_FAIL)
        .apply();
    pdf.save("output.pdf");
} catch (Exception e) {
    System.err.println("Text does not fit: " + e.getMessage());
}
```

  </TabItem>
</Tabs>

---

## Known Limitations

- **Word splitting is whitespace-based only** — no hyphenation support
- **No language-aware line breaking** — treats all text the same
- **No widow/orphan control** — may leave single words on lines
- **Font scaling uses fixed 0.5pt steps** — not infinitely smooth
- **Paragraph boundaries cannot change** — reflow stays within the original container
- **Alignment is not preserved** — reflowed text uses left alignment
- **Line spacing is derived from existing content** — may not match exactly

---

## When to Use Each Preset

| Use Case | Recommended Preset |
|----------|-------------------|
| Template filling with variable-length data | `BEST_EFFORT` |
| Form fields with strict size constraints | `FIT_OR_FAIL` |
| Direct text replacement (no fitting needed) | `NONE` |
| Translations (often longer than original) | `BEST_EFFORT` |
| Labels or headings with exact positioning | `FIT_OR_FAIL` |

---

## Design Philosophy

Reflow is intentionally:
- **Deterministic** — same input always produces same output
- **Strict** — fails explicitly rather than producing broken output
- **Predictable** — strategies are applied in a defined order

This makes it reliable for automated document processing where visual correctness matters.

---

## Next Steps

- [**Working with Templates**](working-with-templates.md) – Use reflow with template replacement
- [**Working with Text**](working-with-text.md) – Learn about text selection and editing
- [**Error Handling**](error-handling.md) – Handle reflow failures gracefully
