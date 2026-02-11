# Embedded Font Warning

When you modify text that uses an embedded font, PDFDancer may emit this warning:

:::warning

You are using an embedded font and modified the text. Even though the font reports to be able to render the new text, this is not guaranteed.

:::

This page explains what the warning means and how to deal with it.

## What This Warning Means

PDFDancer checks the font's internal encoding tables before applying your text change. The encoding check passed — the font *claims* it can render your new text. However, with embedded fonts, that claim is not reliable enough to guarantee correct output.

The warning is informational. Your edit has been applied. But you should verify the result.

## Why It Happens

Embedded fonts in PDFs are often **subsetted**: only the glyphs needed for the original document text are included. Even when the font is fully embedded, its internal tables may not tell the whole story:

- **Incomplete glyph outlines** — the font declares a character as supported but the actual glyph data is missing or placeholder-only.
- **Wrong metrics** — character widths, kerning pairs, or hinting data may be absent for characters that weren't in the original text.
- **Custom encoding** — some embedded fonts use non-standard encoding schemes. The font says it maps a code point, but the mapping may not produce the glyph you expect.

In short: the font's encoding table is a necessary but not sufficient check. Passing it does not guarantee the output will look right.

## What Can Go Wrong

If the embedded font cannot actually render your new text correctly, you may see:

- **Garbled or substituted characters** — wrong glyphs appear in place of the expected ones.
- **Missing glyphs** — characters render as blank rectangles (`.notdef` boxes) or disappear entirely.
- **Incorrect spacing** — letters overlap or have uneven gaps because kerning/width data is missing for the new characters.

## How to Deal With It

### 1. Verify visually

Open the output PDF and check that the modified text looks correct. If it does, the warning is harmless and you can ignore it.

### 2. Switch to a known font

If the output has rendering problems, switch to a font you can trust:

- Use one of the [standard PDF fonts](/working-with-fonts#standard-pdf-fonts) — these are built into every PDF reader and always have complete glyph coverage for their character set.
- [Upload a custom font](/working-with-fonts#custom-fonts) — use a full TrueType or OpenType font file instead of relying on the embedded subset.

PDFDancer provides font recommendations with similarity scores to help you pick a replacement. See [Working with Embedded Fonts](/working-with-fonts#working-with-embedded-fonts-in-pdfdancer) for code examples.

### 3. Suppress the warning

If you have verified the output and it renders correctly, you can safely ignore this warning in subsequent runs. The warning will appear every time you modify text using an embedded font — this is by design, as each edit may introduce different characters.

## Further Reading

- [Working with Fonts — Embedded Fonts](/working-with-fonts#embedded-fonts) — full background on embedded fonts, their types, and limitations.
