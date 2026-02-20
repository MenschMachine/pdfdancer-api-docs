---
id: reflow-internals
title: How Reflow Works
description: Understanding PDFDancer's text reflow engine — a text-fitting calculation that computes how replacement text can fit within original bounds.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page explains how PDFDancer's reflow engine works internally, including the strategies it uses to fit text into existing bounds.

---

## What Reflow Is

Reflow is a **text-fitting calculation**. Given new text, the original bounding box, and a strategy chain, it computes what font size and line distribution would make the text fit.

Reflow does **not** replace text. Replacement and fitting are separate steps. When you call `replace()` with a reflow preset through the SDK, two things happen in sequence:

1. The text content in the target element is replaced
2. The reflow calculation runs against the original bounds and applies the result (scaling, repositioning)

Reflow operates within the bounds of:
- A single text line
- A paragraph (multi-line text block)

---

## What Reflow Is Not

Reflow does **not**:
- Reconstruct logical reading order
- Merge or split paragraphs
- Detect columns or tables
- Re-layout the page
- Perform OCR

If you are looking for semantic document reflow or accessibility-style linearization, this feature is not that.

---

## Reflow Presets

The SDKs expose reflow through three presets that map to internal strategy chains:

| Preset | Strategies Applied | Behavior |
|--------|-------------------|----------|
| `BEST_EFFORT` | rewrap → scaleFont → expandVertically | Tries all fitting strategies in order. Almost always succeeds. |
| `FIT_OR_FAIL` | rewrap → scaleFont | Tries fitting within original bounds only. Fails if text cannot fit. |
| `NONE` | *(none)* | No fitting. Text is placed as-is and may overflow or be truncated. |

---

## Internal Strategies

Strategies are tried in order and are cumulative — each builds on what the previous ones enabled.

### Rewrap

- Redistributes words across multiple lines within the original bounds
- Tries different line counts and picks the one that **minimizes the maximum line width**
- Uses all available height to determine optimal line count
- Does **not** change font size
- Respects explicit line breaks (`\n` in replacement text)

This is always tried first in `BEST_EFFORT` and `FIT_OR_FAIL` modes.

### Scale Font

- Reduces font size in **0.5-unit steps** from the original size down to a minimum
- If rewrap was enabled earlier in the chain, scaling continues to use balanced line distribution
- Fails if text still does not fit at the minimum font size

This is tried after rewrapping fails to fit the text.

### Expand Vertically

- Allows the text block to grow **taller** than the original bounds
- Adds lines iteratively until all lines fit within the original width
- Fails if any single word is wider than the available width (no amount of extra lines helps)

This is the last resort in `BEST_EFFORT` mode.

### Expand Horizontally

- Allows lines to become **wider** than the original bounds
- Reduces line count iteratively until height fits within the original bounds
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
1. Words are redistributed across lines to find the optimal layout
2. If that fails, font size is reduced in 0.5-unit steps
3. If still too large, the paragraph may expand vertically (in `BEST_EFFORT` mode)

### Single Lines

Rewrapping has no effect on single lines. Only font scaling or expansion applies:
1. Font size is reduced until the text fits
2. If configured, the line may expand horizontally

---

## Failure Handling

Reflow is **strict by design**. There is no silent fallback.

- If reflow succeeds, the fitting adjustments are applied to the text elements
- If it fails, the SDK throws an error

Internally, the engine tracks detailed failure information (required vs. available dimensions, minimum font size reached, failure reason). The SDK surfaces this as an exception — use `FIT_OR_FAIL` when you need to detect and handle cases where text cannot fit.

Failure reasons at the engine level include:
- Width or height constraints violated
- Minimum font size reached without fitting
- Unbreakable content (a single word wider than available width)
- Strategy chain exhausted with no successful fit

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
2. If still too long, font size shrinks in 0.5-unit steps (e.g., 12 → 11.5 → 11 → ...)
3. Finally, the text block may grow taller if needed

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, ReflowPreset

with PDFDancer.open("template.pdf") as pdf:
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

pdf.replace("{{DESCRIPTION}}",
    "This is a much longer description that would not fit in the original placeholder space without reflow adjustments.")
    .withReflow(ReflowPreset.BEST_EFFORT)
    .apply();

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

### Example 3: Replacement with Line Breaks

Reflow respects explicit `\n` line breaks in your replacement text:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, ReflowPreset

with PDFDancer.open("template.pdf") as pdf:
    pdf.apply_replacements(
        {"{{ADDRESS}}": "123 Main Street\nApt 4B\nNew York, NY 10001"},
        reflow_preset=ReflowPreset.BEST_EFFORT
    )
    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open('template.pdf');

await pdf.replace('{{ADDRESS}}',
    '123 Main Street\nApt 4B\nNew York, NY 10001')
    .bestEffort()
    .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
PDFDancer pdf = PDFDancer.createSession("template.pdf");

pdf.replace("{{ADDRESS}}",
    "123 Main Street\nApt 4B\nNew York, NY 10001")
    .withReflow(ReflowPreset.BEST_EFFORT)
    .apply();

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

### Example 4: Strict Fitting

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
- **Font scaling uses fixed 0.5-unit steps** — not infinitely smooth
- **Paragraph boundaries cannot change** — reflow stays within the original container
- **Alignment is not preserved** — reflowed text uses left alignment from the original top-left position
- **Line spacing is derived from existing content** — may not match exactly
- **Mixed font sizes are averaged** — if the original paragraph contains multiple font sizes, they are averaged into a single reference size for the calculation

---

## Not Implemented

- Hyphenation
- Per-line alignment preservation
- Mixed font sizes inside a reflowed paragraph
- Adaptive line spacing

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

## Practical Recommendations

- Start with `BEST_EFFORT` — it covers most cases
- Use `FIT_OR_FAIL` when visual bounds are strict (forms, labels, certificates)
- Use `NONE` only when you know the replacement text is the same length or you don't care about overflow
- Use explicit `\n` in replacement text when you need specific line breaks
- Handle reflow failures — the error tells you why fitting failed

---

## Design Philosophy

Reflow is intentionally:
- **Deterministic** — same input always produces same output
- **Strict** — fails explicitly rather than producing broken output
- **Predictable** — strategies are applied in a defined order

This makes it reliable for automated document processing where visual correctness matters.

---

## Helpful Links

- [**Working with Templates**](working-with-templates.md) — Use reflow with template replacement
- [**Working with Text**](working-with-text.md) — Learn about text selection and editing
- [**Error Handling**](error-handling.md) — Handle reflow failures gracefully
