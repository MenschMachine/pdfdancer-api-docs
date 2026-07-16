---
id: reflow-internals
title: How Reflow Works
description: Understanding PDFDancer's current text reflow behavior for paragraph replacement, fitting presets, alignment, and layout results.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page explains how reflow behaves in the SDKs when replacement text needs to fit the original paragraph area.

---

## What Reflow Is

Reflow in PDFDancer is a **paragraph replacement and layout recomputation step**. After replacement text is chosen, PDFDancer recalculates the paragraph layout so the result fits as well as possible within the selected preset.

In practice, reflow combines:

1. Replacing the paragraph's text content
2. Measuring the replacement text with the paragraph's style information
3. Choosing a layout based on the selected reflow preset
4. Writing the updated paragraph layout back to the page

Reflow stays anchored to the original paragraph area. Depending on the preset, it can rewrap text, scale fonts, and allow the paragraph to grow vertically.

---

## What Reflow Is Not

Reflow does **not**:

- Move downstream paragraphs
- Flow content across pages
- Hyphenate words automatically
- Provide detailed substitution metadata in the result

It is a paragraph-local layout operation, not a page-wide layout feature.

---

## Reflow Presets

The SDKs expose reflow through three presets:

| Preset | Behavior |
|--------|----------|
| `BEST_EFFORT` | Rewraps text, scales font when needed, and can expand the paragraph vertically as a last resort. |
| `FIT_OR_FAIL` | Keeps the paragraph inside its original bounds. If it still cannot fit, the operation fails. |
| `NONE` | Preserves the original line structure instead of redistributing text across different lines. |

---

## Layout Behavior

### Line Breaking

Reflow can redistribute paragraph text across lines when the selected preset allows it.

Explicit `\n` line breaks are preserved. Automatic hyphenation is not supported.

### Width Measurement

Text is measured using the paragraph's current styling so PDFDancer can decide whether it fits, needs rewrapping, or needs font scaling.

### Alignment

PDFDancer preserves the paragraph's detected alignment when possible:

- `LEFT`
- `RIGHT`
- `CENTERED`
- `JUSTIFIED`

Alignment affects:

- The starting x-position for each line
- Whether inter-word spacing is stretched on justified lines

Reflowed output is not universally left-aligned. Right-aligned, centered, and justified paragraphs are preserved when detected.

### Justification

For justified paragraphs, non-final lines distribute extra width across spaces. The final line keeps natural spacing.

### Line Spacing

Line spacing is derived from the source paragraph so the replacement stays visually close to the original layout.

### Explicit Newlines

Explicit `\n` characters in replacement text are preserved as line breaks.

---

## Style Preservation

Reflow preserves the paragraph's visual styling, including:

- Font
- Font size
- Colors
- Character spacing
- Rendering mode
- Horizontal scaling
- Stroke line width

Mixed font sizes are preserved rather than being flattened into a single average size.

---

## Failure Handling

Reflow is strict by design. There is no silent fallback.

- If reflow succeeds, the fitting adjustments are applied to the replacement output
- If it fails, the SDK surfaces an error

Typical failure reasons include:

- Width or height constraints are still violated
- Minimum font size was reached without fitting
- A single unbreakable word is wider than the available width
- The available preset behavior could not produce a valid layout

Use `FIT_OR_FAIL` when you need to detect and handle cases where text cannot remain inside the original bounds.

---

## Practical Examples

### Example 1: Replacement That Fits Naturally

When replacement text is similar in length, rewrapping alone is often enough:

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

When replacement text is significantly longer, the preset behavior becomes visible:

1. Rewrap redistributes text across the available width
2. If that is still not enough, font scaling searches for the largest size that fits
3. In `BEST_EFFORT`, the paragraph can grow taller as a final fallback

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

Use `FIT_OR_FAIL` when the replacement must stay inside the original bounds:

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

- Word splitting is whitespace-based only
- No language-aware line breaking
- No widow/orphan control
- Paragraphs stay anchored to their original page context
- Line spacing is derived from existing content and may not be exact in every case
- Detailed substitution metadata is not currently exposed in SDK results

---

## Practical Recommendations

- Start with `BEST_EFFORT` for template filling with variable-length content
- Use `FIT_OR_FAIL` when visual bounds are strict
- Use `NONE` when you want to preserve the original line structure
- Use explicit `\n` when you need fixed line breaks
- Handle reflow failures explicitly when bounds matter

---

## Design Philosophy

Reflow is intentionally:

- Deterministic
- Strict
- Predictable

This makes it suitable for automated document generation where layout behavior needs to be consistent across runs.

---

## Helpful Links

- [**Working with Templates**](working-with-templates.md) — Use reflow with template replacement
- [**Working with Text**](working-with-text.md) — Learn about text selection and editing
- [**Error Handling**](error-handling.md) — Handle reflow failures gracefully
