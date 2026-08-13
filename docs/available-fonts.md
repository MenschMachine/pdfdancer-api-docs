---
id: available-fonts
title: Available Fonts
description: Browse service-hosted fonts available for PDFDancer text operations and choose exact font names for consistent document rendering.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import AvailableFonts from '@site/src/components/AvailableFontsMdx';

# Available Fonts

The service-hosted font catalog can change independently of SDK interfaces. Use the exact font name shown below, and still verify glyph coverage for the text being introduced.

<AvailableFonts />

## Use a service font

<Tabs>
<TabItem value="python" label="Python">

```python
response = pdf.text().style(
    TextStyleRequest.literal("Heading").font("Roboto-Bold").build()
)
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const response = await pdf.text().style(
  TextStyleRequest.literal('Heading').font('Roboto-Bold').build()
);
```

</TabItem>
<TabItem value="java" label="Java">

```java
var response = pdf.text().style(
        TextStyleRequest.literal("Heading").font("Roboto-Bold").build());
```

</TabItem>
</Tabs>

For custom TTF registration, embedded-font warnings, and using fonts in text edits, see [Working with Fonts](./working-with-fonts.md).
