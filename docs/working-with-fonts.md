---
id: working-with-fonts
title: Working with Fonts
description: Learn how to use standard fonts and register custom fonts in PDFDancer.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

PDFDancer supports both standard PDF fonts and custom TrueType fonts. You can use system fonts or upload your own font files.

---

## Standard PDF Fonts

PDF includes 14 standard fonts that are always available in all PDF readers without embedding:

### Times Family (Serif)
- `Times-Roman` - Standard serif font
- `Times-Bold` - Bold variant
- `Times-Italic` - Italic variant
- `Times-BoldItalic` - Bold italic variant

### Helvetica Family (Sans-serif)
- `Helvetica` - Standard sans-serif font
- `Helvetica-Bold` - Bold variant
- `Helvetica-Oblique` - Oblique (italic) variant
- `Helvetica-BoldOblique` - Bold oblique variant

### Courier Family (Monospace)
- `Courier` - Standard monospace font
- `Courier-Bold` - Bold variant
- `Courier-Oblique` - Oblique (italic) variant
- `Courier-BoldOblique` - Bold oblique variant

### Symbol Fonts
- `Symbol` - Mathematical and special characters
- `ZapfDingbats` - Decorative symbols

### Using Standard Fonts

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, StandardFonts, Color

with PDFDancer.open("document.pdf") as pdf:
    # Use standard fonts with enum (recommended)
    pdf.new_paragraph() \
        .text("Helvetica Bold text") \
        .font(StandardFonts.HELVETICA_BOLD.value, 16) \
        .color(Color(255, 0, 0)) \
        .at(page_number=1, x=100, y=500) \
        .add()

    pdf.new_paragraph() \
        .text("Times Roman text") \
        .font(StandardFonts.TIMES_ROMAN.value, 14) \
        .at(page_number=1, x=100, y=480) \
        .add()

    pdf.new_paragraph() \
        .text("Courier monospace code") \
        .font(StandardFonts.COURIER_BOLD.value, 12) \
        .at(page_number=1, x=100, y=460) \
        .add()

    # You can also use font names directly as strings
    pdf.new_paragraph() \
        .text("Direct font name") \
        .font("Helvetica", 12) \
        .at(page_number=1, x=100, y=440) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, StandardFonts, Color } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');

// Use standard fonts with enum (recommended)
await pdf.page(1).newParagraph()
  .text('Helvetica Bold text')
  .font(StandardFonts.HELVETICA_BOLD, 16)
  .color(new Color(255, 0, 0))
  .at(100, 500)
  .apply();

await pdf.page(1).newParagraph()
  .text('Times Roman text')
  .font(StandardFonts.TIMES_ROMAN, 14)
  .at(100, 480)
  .apply();

await pdf.page(1).newParagraph()
  .text('Courier monospace code')
  .font(StandardFonts.COURIER_BOLD, 12)
  .at(100, 460)
  .apply();

// You can also use font names directly as strings
await pdf.page(1).newParagraph()
  .text('Direct font name')
  .font('Helvetica', 12)
  .at(100, 440)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import com.tfc.pdf.pdfdancer.api.common.model.*;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Use standard fonts with enum (recommended)
pdf.newParagraph()
    .text("Helvetica Bold text")
    .font(StandardFonts.HELVETICA_BOLD.getValue(), 16)
    .color(new Color(255, 0, 0))
    .at(1, 100, 500)
    .add();

pdf.newParagraph()
    .text("Times Roman text")
    .font(StandardFonts.TIMES_ROMAN.getValue(), 14)
    .at(1, 100, 480)
    .add();

pdf.newParagraph()
    .text("Courier monospace code")
    .font(StandardFonts.COURIER_BOLD.getValue(), 12)
    .at(1, 100, 460)
    .add();

// You can also use font names directly as strings
pdf.newParagraph()
    .text("Direct font name")
    .font("Helvetica", 12)
    .at(1, 100, 440)
    .add();

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

---

## About Embedded Fonts

### What Are Embedded Fonts?

Embedded fonts are font files that are included directly in a PDF document. When you open a PDF with embedded fonts, you can view the document exactly as intended without needing the original font files installed on your system. This is different from the 14 standard PDF fonts, which are built into every PDF reader.

### PDF Font Types

PDF supports several font format types, each with different characteristics:

#### **Type 1 Fonts (PostScript)**
- Traditional PostScript fonts used in professional publishing
- Compact and efficient
- Limited to 256 glyphs per font
- Can be embedded as complete font or subset

#### **Type 3 Fonts (User-Defined)**
- Custom bitmap or vector fonts defined in PDF
- Most flexible but least efficient
- Can contain any graphical content
- Often used for decorative or custom glyphs
- **Not searchable or extractable** - characters are stored as graphics, not text
- No hinting information for screen display

#### **TrueType Fonts**
- Common font format from Microsoft and Apple
- Excellent screen rendering
- Can contain large character sets (Unicode support)
- Usually embedded as subsets to reduce file size

#### **OpenType/CFF Fonts**
- Modern font format combining TrueType and PostScript features
- Superior typography features
- Cross-platform compatibility
- Large character set support

### Why Embedded Fonts Have Limitations

When you edit text in a PDF that uses embedded fonts, you may encounter several limitations:

**1. Subset Restrictions**
- Most PDFs embed only the characters actually used (font subsetting)
- If you try to add new characters not in the original text, they won't be available
- Example: Original PDF has "Hello" - trying to change it to "Help!" might fail because "p" and "!" weren't in the subset

**2. Type 3 Font Issues**
- Type 3 fonts are rendered as graphics, not text
- Modifying Type 3 font text often requires converting to a different font type
- Search and copy operations may not work properly

**3. Licensing and Encoding**
- Some embedded fonts include usage restrictions
- Character encoding may be custom or non-standard
- Font metrics might not support all glyph variations

**4. No Font File Access**
- The embedded data is just enough to render existing characters
- You can't add new glyphs or extend the character set
- Font hinting and kerning data may be limited

### Working with Embedded Fonts in PDFDancer

When you modify text that uses embedded fonts, PDFDancer will:

1. **Check character availability** - Verify if the new text can be encoded with the embedded font
2. **Return warnings** - The `CommandResult` will include a `warning` if there are encoding issues
3. **Provide font recommendations** - The `TextStatus` includes font recommendations with similarity scores
4. **Indicate font type** - Check `FontType` to see if the font is EMBEDDED, STANDARD, or SYSTEM

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    paragraphs = pdf.page(1).select_paragraphs()

    for para in paragraphs:
        if para.status:
            # Check font type
            if para.status.get_font_type().value == "EMBEDDED":
                print(f"⚠️  Embedded font: {para.font_name}")

                # Check if text is encodable
                if not para.status.is_encodable():
                    print("Cannot encode new characters with this font")

                # Get font recommendation
                rec = para.status.get_font_recommendation()
                print(f"Recommended: {rec.get_font_name()} (similarity: {rec.get_similarity_score():.2f})")

    # Attempt to modify embedded font text
    para = paragraphs[0]
    result = para.edit().replace("New text").apply()

    if result.warning:
        print(f"Warning: {result.warning}")
        # Consider using a standard font instead
        result = para.edit().replace("New text").font("Helvetica", 12).apply()
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, FontType } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');
const paragraphs = await pdf.page(1).selectParagraphs();

for (const para of paragraphs) {
  if (para.objectRef().status) {
    // Check font type
    if (para.objectRef().status.getFontType() === FontType.EMBEDDED) {
      console.log(`⚠️  Embedded font: ${para.getFontName()}`);

      // Check if text is encodable
      if (!para.objectRef().status.isEncodable()) {
        console.log('Cannot encode new characters with this font');
      }

      // Get font recommendation
      const fontInfo = para.objectRef().status.getFontRecommendation();
      console.log(`Recommended: ${fontInfo.getDocumentFontName()}`);
    }
  }
}

// Attempt to modify embedded font text
const para = paragraphs[0];
const result = await para.edit().replace('New text').apply();

if (result.warning) {
  console.warn('Warning:', result.warning);
  // Consider using a standard font instead
  await para.edit().replace('New text').font('Helvetica', 12).apply();
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import com.tfc.pdf.pdfdancer.api.common.model.*;

PDFDancer pdf = PDFDancer.createSession("document.pdf");
List<Paragraph> paragraphs = pdf.page(1).selectParagraphs();

for (Paragraph para : paragraphs) {
    if (para.getStatus() != null) {
        // Check font type
        if (para.getStatus().getFontType().getValue().equals("EMBEDDED")) {
            System.out.println("Embedded font: " + para.getFontName());

            // Check if text is encodable
            if (!para.getStatus().isEncodable()) {
                System.out.println("Cannot encode new characters with this font");
            }

            // Get font recommendation
            FontRecommendation rec = para.getStatus().getFontRecommendation();
            System.out.println("Recommended: " + rec.getFontName() +
                " (similarity: " + rec.getSimilarityScore() + ")");
        }
    }
}

// Attempt to modify embedded font text
Paragraph para = paragraphs.get(0);
CommandResult result = para.edit().replace("New text").apply();

if (result.getWarning() != null) {
    System.out.println("Warning: " + result.getWarning());
    // Consider using a standard font instead
    result = para.edit().replace("New text").font("Helvetica", 12).apply();
}
```

  </TabItem>
</Tabs>

### Best Practices for Embedded Fonts

1. **Check `TextStatus` before editing** - Know what you're working with
2. **Use standard fonts when possible** - They have no character limitations
3. **Handle warnings gracefully** - Check `CommandResult.warning` after modifications
4. **Consider font substitution** - If editing fails, switch to a similar standard font
5. **Test with actual content** - Verify that your new text renders correctly

---

## Registering Custom Fonts

You can upload and use your own TrueType (.ttf) fonts in three ways:

### Method 1: Using font_file() directly (recommended)

<Tabs>
  <TabItem value="python" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer, Color

with PDFDancer.open("document.pdf") as pdf:
    # Use custom font directly without registration
    ttf_path = Path("fonts/DancingScript-Regular.ttf")

    pdf.new_paragraph() \
        .text("Beautiful custom font\nwith multiple lines") \
        .font_file(ttf_path, 24) \
        .line_spacing(1.8) \
        .color(Color(0, 0, 255)) \
        .at(page_number=1, x=300, y=500) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';
import { promises as fs } from 'node:fs';

const pdf = await PDFDancer.open('document.pdf');

// Load custom font file
const fontBytes = await fs.readFile('fonts/DancingScript-Regular.ttf');

// Use the custom font directly with fontFile()
await pdf.page(1).newParagraph()
  .text('Beautiful custom font\nwith multiple lines')
  .fontFile(fontBytes, 24)
  .lineSpacing(1.8)
  .color(new Color(0, 0, 255))
  .at(300, 500)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import com.tfc.pdf.pdfdancer.api.common.model.*;
import java.nio.file.Path;
import java.nio.file.Paths;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Use custom font file directly
Path ttfPath = Paths.get("fonts/DancingScript-Regular.ttf");

pdf.newParagraph()
    .text("Beautiful custom font\nwith multiple lines")
    .fontFile(ttfPath, 24)
    .lineSpacing(1.8)
    .color(new Color(0, 0, 255))
    .at(1, 300, 500)
    .add();

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

### Method 2: Find and use fonts available on the service

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Search for fonts available on the service
    fonts = pdf.find_fonts("Roboto", 14)

    if fonts:
        # Use the first match (e.g., "Roboto-Regular")
        font = fonts[0]
        print(f"Using: {font.name} at {font.size}pt")

        pdf.new_paragraph() \
            .text("Text with service font") \
            .font(font.name, font.size) \
            .at(page_number=1, x=300, y=500) \
            .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// TypeScript client uses font names directly
const pdf = await PDFDancer.open('document.pdf');

await pdf.page(1).newParagraph()
  .text('Text with service font')
  .font('Roboto-Regular', 14)
  .at(300, 500)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Search for fonts available on the service
List<Font> fonts = pdf.findFonts("Roboto", 14);

if (!fonts.isEmpty()) {
    // Use the first match (e.g., "Roboto-Regular")
    Font font = fonts.get(0);
    System.out.println("Using: " + font.getName() + " at " + font.getSize() + "pt");

    pdf.newParagraph()
        .text("Text with service font")
        .font(font.getName(), font.getSize())
        .at(1, 300, 500)
        .add();
}

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

### Method 3: Register custom fonts for reuse

<Tabs>
  <TabItem value="python" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer

with PDFDancer.open("document.pdf") as pdf:
    # Register custom TTF font
    custom_font_path = Path("fonts/CustomFont.ttf")
    pdf.register_font(str(custom_font_path))

    # Now use the registered font by name
    pdf.new_paragraph() \
        .text("Text with registered font") \
        .font("CustomFont", 14) \
        .at(page_number=1, x=100, y=500) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// TypeScript doesn't have explicit font registration
// Use fontFile() method instead
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import java.nio.file.Paths;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Register custom TTF font
pdf.registerFont(Paths.get("fonts/CustomFont.ttf").toString());

// Now use the registered font by name
pdf.newParagraph()
    .text("Text with registered font")
    .font("CustomFont", 14)
    .at(1, 100, 500)
    .add();

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

---

## Font Sizes and Styling

You can combine standard fonts with different sizes, colors, and line spacing for rich typography:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, StandardFonts, Color

with PDFDancer.open("document.pdf") as pdf:
    # Large heading with bold Helvetica
    pdf.new_paragraph() \
        .text("Large heading") \
        .font(StandardFonts.HELVETICA_BOLD.value, 24) \
        .color(Color(0, 0, 0)) \
        .at(page_number=1, x=100, y=700) \
        .add()

    # Normal body text with Times Roman
    pdf.new_paragraph() \
        .text("Normal body text in Times Roman") \
        .font(StandardFonts.TIMES_ROMAN.value, 12) \
        .at(page_number=1, x=100, y=660) \
        .add()

    # Monospace code example with Courier
    pdf.new_paragraph() \
        .text("def hello():\n    print('Hello')") \
        .font(StandardFonts.COURIER_BOLD.value, 11) \
        .line_spacing(1.5) \
        .color(Color(40, 40, 40)) \
        .at(page_number=1, x=100, y=620) \
        .add()

    # Small footnote
    pdf.new_paragraph() \
        .text("Small footnote") \
        .font(StandardFonts.HELVETICA.value, 8) \
        .color(Color(128, 128, 128)) \
        .at(page_number=1, x=100, y=580) \
        .add()

    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, StandardFonts, Color } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open('document.pdf');

// Large heading with bold Helvetica
await pdf.page(1).newParagraph()
  .text('Large heading')
  .font(StandardFonts.HELVETICA_BOLD, 24)
  .color(new Color(0, 0, 0))
  .at(100, 700)
  .apply();

// Normal body text with Times Roman
await pdf.page(1).newParagraph()
  .text('Normal body text in Times Roman')
  .font(StandardFonts.TIMES_ROMAN, 12)
  .at(100, 660)
  .apply();

// Monospace code example with Courier
await pdf.page(1).newParagraph()
  .text('def hello():\n    print(\'Hello\')')
  .font(StandardFonts.COURIER_BOLD, 11)
  .lineSpacing(1.5)
  .color(new Color(40, 40, 40))
  .at(100, 620)
  .apply();

// Small footnote
await pdf.page(1).newParagraph()
  .text('Small footnote')
  .font(StandardFonts.HELVETICA, 8)
  .color(new Color(128, 128, 128))
  .at(100, 580)
  .apply();

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.PDFDancer;
import com.tfc.pdf.pdfdancer.api.common.model.*;

PDFDancer pdf = PDFDancer.createSession("document.pdf");

// Large heading with bold Helvetica
pdf.newParagraph()
    .text("Large heading")
    .font(StandardFonts.HELVETICA_BOLD.getValue(), 24)
    .color(new Color(0, 0, 0))
    .at(1, 100, 700)
    .add();

// Normal body text with Times Roman
pdf.newParagraph()
    .text("Normal body text in Times Roman")
    .font(StandardFonts.TIMES_ROMAN.getValue(), 12)
    .at(1, 100, 660)
    .add();

// Monospace code example with Courier
pdf.newParagraph()
    .text("def hello():\n    print('Hello')")
    .font(StandardFonts.COURIER_BOLD.getValue(), 11)
    .lineSpacing(1.5)
    .color(new Color(40, 40, 40))
    .at(1, 100, 620)
    .add();

// Small footnote
pdf.newParagraph()
    .text("Small footnote")
    .font(StandardFonts.HELVETICA.getValue(), 8)
    .color(new Color(128, 128, 128))
    .at(1, 100, 580)
    .add();

pdf.save("output.pdf");
```

  </TabItem>
</Tabs>

---

## Next Steps

- [**Working with Text**](working-with-text.md) – Learn about text modification and status information
- [**Details about Positioning**](positioning.md) – Understand PDF coordinate systems
- [**Cookbook**](cookbook.md) – See complete working examples with fonts
- [**Error Handling**](error-handling.md) – Handle font not found errors
