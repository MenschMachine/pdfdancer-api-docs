---
id: text-layout
title: Text Layout and Reflow
description: Control whether surrounding PDF text stays fixed, moves horizontally, or is recomposed into new lines.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Text Layout and Reflow

Changing the length of text creates a layout decision. If `Q1` becomes `First quarter`, PDFDancer must either leave all unaffected text at its existing coordinates or recompose the text around the change.

Layout has two independent settings:

- The **layout mode** decides whether PDFDancer attempts reflow and whether it may fall back when reflow is unavailable.
- The **reflow profile** decides how PDFDancer composes a detected text unit when the selected mode attempts reflow.

A text unit is the detected layout structure that owns the selected characters, such as a paragraph, list item, heading, table cell, or fixed-layout line.

## Compare the results

The diagram shows the same replacement under the three composition behaviors.

![Source-anchored, no-reflow, and body-text results after replacing Q1 with First quarter](/img/doc/text-layout-results.svg)

| Behavior | What moves | Can line breaks change? | Main risk |
|---|---|---:|---|
| Source anchored | Only the inserted or replacement text; unaffected glyphs stay at their original coordinates | No | Longer text can overlap unchanged glyphs |
| Reflow with `NO_REFLOW` | Following text on each existing line | No | The line can extend beyond its original width |
| Reflow with `BODY_TEXT` | Text in the detected unit | Yes | A non-prose unit can be composed like a paragraph |

## Choose a layout mode

### `sourceAnchored()`

The new text begins at the selected source position. Every unaffected glyph remains at its original coordinates. If the replacement is longer, it can overlap the glyphs that follow because those glyphs do not move.

Use it for same-length or shorter substitutions, isolated labels with sufficient empty space, and coordinate insertion. Do not use it for a longer inline replacement when following text must move.

### `reflowWhenSupported(profile)`

PDFDancer attempts to recompose the detected text unit with the selected profile. If that unit cannot be reflowed, PDFDancer applies the edit source-anchored and adds a warning to `TextEditResponse`.

Choose this only when the source-anchored fallback is acceptable. A successful change count does not prove that reflow occurred; inspect the applied layout reported for each change.

### `requireReflow(profile)`

PDFDancer attempts the same reflow operation but does not permit a source-anchored fallback. If a selected unit cannot be reflowed, that target is left unchanged and the response contains a `text-reflow` error.

Choose this when overlap or fixed-position fallback would make the output unacceptable.

![Fallback behavior for source anchored, reflow when supported, and require reflow](/img/doc/text-layout-fallback.svg)

## Configure each mode

These examples show the three choices for the same replacement. Execute only the choice required by your workflow.

<Tabs>
<TabItem value="python-modes" label="Python">

```python
from pdfdancer import TextLayoutProfile, TextReplaceRequest

source_anchored = TextReplaceRequest.literal("Q1", "First quarter") \
    .source_anchored() \
    .build()

fallback_allowed = TextReplaceRequest.literal("Q1", "First quarter") \
    .reflow_when_supported(TextLayoutProfile.BODY_TEXT) \
    .build()

reflow_required = TextReplaceRequest.literal("Q1", "First quarter") \
    .require_reflow(TextLayoutProfile.BODY_TEXT) \
    .build()

response = pdf.text().replace(reflow_required)
```

</TabItem>
<TabItem value="typescript-modes" label="TypeScript">

```typescript
import {TextLayoutProfile, TextReplaceRequest} from 'pdfdancer-client-typescript';

const sourceAnchored = TextReplaceRequest.literal('Q1', 'First quarter')
  .sourceAnchored()
  .build();

const fallbackAllowed = TextReplaceRequest.literal('Q1', 'First quarter')
  .reflowWhenSupported(TextLayoutProfile.BODY_TEXT)
  .build();

const reflowRequired = TextReplaceRequest.literal('Q1', 'First quarter')
  .requireReflow(TextLayoutProfile.BODY_TEXT)
  .build();

const response = await pdf.text().replace(reflowRequired);
```

</TabItem>
<TabItem value="java-modes" label="Java">

```java
import com.pdfdancer.common.request.TextLayoutRequest;
import com.pdfdancer.common.request.TextReplaceRequest;

var sourceAnchored = TextReplaceRequest.literal("Q1", "First quarter")
        .sourceAnchored()
        .build();

var fallbackAllowed = TextReplaceRequest.literal("Q1", "First quarter")
        .reflowWhenSupported(TextLayoutRequest.Profile.BODY_TEXT)
        .build();

var reflowRequired = TextReplaceRequest.literal("Q1", "First quarter")
        .requireReflow(TextLayoutRequest.Profile.BODY_TEXT)
        .build();

var response = pdf.text().replace(reflowRequired);
```

</TabItem>
</Tabs>

## Choose a reflow profile

A profile is required by `reflowWhenSupported` and `requireReflow`. It is not valid with `sourceAnchored`.

There is no implicit reflow profile. Choose `DEFAULT` when the selected content can have different detected layout types, `BODY_TEXT` when the target is paragraph-like prose, or `NO_REFLOW` when line boundaries must stay fixed.

### `DEFAULT`

`DEFAULT` chooses a meaningful composition strategy from the detected layout type. It is the profile to use when the same request may match different kinds of content:

- paragraphs use paragraph composition;
- list items use composition appropriate to their detected alignment;
- table rows and cells use a table-aware composition;
- headings, labels, and other supported structured units use a strategy appropriate to that unit.

`DEFAULT` is the broad choice: it attempts to reflow each supported unit using its detected model rather than treating every unit as a paragraph.

Use `DEFAULT` when one operation can match different kinds of content and PDFDancer should choose the appropriate model for each unit.

### `BODY_TEXT`

`BODY_TEXT` reflows paragraph text. It recalculates paragraph line breaks and can adjust tracking and word spacing within the profile's constraints while preserving a readable paragraph measure.

Use it when the target is paragraph-like prose. Do not use it for headings, table cells, lists, code, or preformatted text when their structure should be preserved; use `DEFAULT` when one operation must handle those different unit types.

### `NO_REFLOW`

`NO_REFLOW` recomposes each existing line horizontally while preserving every original line boundary. Following text moves to make room for a longer replacement, but it never wraps to another line. The resulting line can extend beyond its original width. This is the default when no layout mode is specified.

This differs from `sourceAnchored`: `NO_REFLOW` moves following text; `sourceAnchored` leaves it fixed.

## Profile examples

<Tabs>
<TabItem value="python-profiles" label="Python">

```python
mixed_content = TextReplaceRequest.literal("Draft", "Final") \
    .reflow_when_supported(TextLayoutProfile.DEFAULT) \
    .build()

known_prose = TextReplaceRequest.literal("Q1", "First quarter") \
    .require_reflow(TextLayoutProfile.BODY_TEXT) \
    .build()

fixed_lines = TextReplaceRequest.literal("Q1", "First quarter") \
    .reflow_when_supported(TextLayoutProfile.NO_REFLOW) \
    .build()
```

</TabItem>
<TabItem value="typescript-profiles" label="TypeScript">

```typescript
const mixedContent = TextReplaceRequest.literal('Draft', 'Final')
  .reflowWhenSupported(TextLayoutProfile.DEFAULT).build();

const knownProse = TextReplaceRequest.literal('Q1', 'First quarter')
  .requireReflow(TextLayoutProfile.BODY_TEXT).build();

const fixedLines = TextReplaceRequest.literal('Q1', 'First quarter')
  .reflowWhenSupported(TextLayoutProfile.NO_REFLOW).build();
```

</TabItem>
<TabItem value="java-profiles" label="Java">

```java
var mixedContent = TextReplaceRequest.literal("Draft", "Final")
        .reflowWhenSupported(TextLayoutRequest.Profile.DEFAULT).build();

var knownProse = TextReplaceRequest.literal("Q1", "First quarter")
        .requireReflow(TextLayoutRequest.Profile.BODY_TEXT).build();

var fixedLines = TextReplaceRequest.literal("Q1", "First quarter")
        .reflowWhenSupported(TextLayoutRequest.Profile.NO_REFLOW).build();
```

</TabItem>
</Tabs>

## Control generated hyphenation

`hyphenationEnabled(true|false)` overrides dictionary-generated discretionary hyphenation for one edit. If omitted, the selected profile determines the effective setting.

The override does not remove or add lexical hyphens present in the supplied text. It is valid only with `reflowWhenSupported` or `requireReflow`; it cannot be combined with `sourceAnchored`.

<Tabs>
<TabItem value="python-hyphenation" label="Python">

```python
edit = TextReplaceRequest.literal("Q1", "First quarter") \
    .require_reflow(TextLayoutProfile.BODY_TEXT) \
    .hyphenation_enabled(False) \
    .build()
```

</TabItem>
<TabItem value="typescript-hyphenation" label="TypeScript">

```typescript
const edit = TextReplaceRequest.literal('Q1', 'First quarter')
  .requireReflow(TextLayoutProfile.BODY_TEXT)
  .hyphenationEnabled(false)
  .build();
```

</TabItem>
<TabItem value="java-hyphenation" label="Java">

```java
var edit = TextReplaceRequest.literal("Q1", "First quarter")
        .requireReflow(TextLayoutRequest.Profile.BODY_TEXT)
        .hyphenationEnabled(false)
        .build();
```

</TabItem>
</Tabs>

## Verify the applied layout

`TextEditResponse` distinguishes the selected target, the applied change, and the layout actually used:

| Field | Meaning |
|---|---|
| `matched` | Number of eligible targets found |
| `changed` | Number of changes applied |
| `change` | Per-change details, including requested mode, requested profile, applied mode, and effective hyphenation |
| `warnings` | Nonfatal diagnostics, including permitted source-anchored fallback |
| `errors` | Work that was not applied, including failed required reflow |

For `reflowWhenSupported`, reject an applied mode of `sourceAnchored` when your application cannot accept fallback. For `requireReflow`, reject errors and any difference between `matched` and `changed`.

<Tabs>
<TabItem value="python-verify" label="Python">

```python
if response.errors or response.matched != response.changed:
    raise RuntimeError(f"Text edit was incomplete: {response.errors}")

for change in response.change or ():
    print(
        change.page,
        change.requested_layout_mode,
        change.requested_layout_profile,
        change.applied_layout_mode,
        change.effective_hyphenation_enabled,
    )
```

</TabItem>
<TabItem value="typescript-verify" label="TypeScript">

```typescript
if (response.errors?.length || response.matched !== response.changed) {
  throw new Error(`Text edit was incomplete: ${JSON.stringify(response.errors)}`);
}

for (const change of response.change ?? []) {
  console.log({
    page: change.page,
    requestedMode: change.requestedLayoutMode,
    requestedProfile: change.requestedLayoutProfile,
    appliedMode: change.appliedLayoutMode,
    hyphenation: change.effectiveHyphenationEnabled,
  });
}
```

</TabItem>
<TabItem value="java-verify" label="Java">

```java
if (response.errors() != null && !response.errors().isEmpty()
        || !response.matched().equals(response.changed())) {
    throw new IllegalStateException("Text edit was incomplete: " + response.errors());
}

if (response.change() != null) {
    for (var change : response.change()) {
        System.out.printf("page=%s requested=%s profile=%s applied=%s hyphenation=%s%n",
                change.page(),
                change.requestedLayoutMode(),
                change.requestedLayoutProfile(),
                change.appliedLayoutMode(),
                change.effectiveHyphenationEnabled());
    }
}
```

</TabItem>
</Tabs>

## Decision table

| Required output                                                                                               | Configuration                       |
|---------------------------------------------------------------------------------------------------------------|-------------------------------------|
| Unaffected glyphs must remain at their exact coordinates                                                      | `sourceAnchored()`                  |
| The request may match paragraphs, list items, tables, or other supported units | `reflowWhenSupported(DEFAULT)` |
| The target is paragraph-like prose and should be reflowed as paragraphs | `reflowWhenSupported(BODY_TEXT)` |
| Paragraph reflow is required; otherwise reject the edit | `requireReflow(BODY_TEXT)` |
| Following text should move, but existing line breaks must remain                                              | A reflow mode with `NO_REFLOW`      |

Always save geometry-sensitive edits to a separate output file and inspect the rendered PDF before applying the same operation in bulk.
