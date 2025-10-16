---
id: working-with-formxobjects
title: Working with FormXObjects
description: Learn how to work with PDF FormXObjects for reusable content blocks.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

FormXObjects in PDFs are reusable content streams that can be referenced multiple times throughout a document. They're commonly used for templates, headers, footers, and watermarks.

---

## Understanding FormXObjects

FormXObjects (also called XObjects) are self-contained graphical elements that can be:
- Reused across multiple pages
- Transformed (scaled, rotated, positioned)
- Referenced multiple times without duplicating content

Common use cases:
- Company logos and branding
- Page headers and footers
- Watermarks
- Template overlays

---

## Working with FormXObjects

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

# Content for working with FormXObjects will be added here
# as the API evolves
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

// Content for working with FormXObjects will be added here
// as the API evolves
```

  </TabItem>
  <TabItem value="java" label="Java">

  </TabItem>
</Tabs>

---

## Next Steps

- [**Working with Vector Graphics**](working-with-vector-graphics.md) – Learn about vector paths
- [**Working with Fonts**](working-with-fonts.md) – Use custom fonts
- [**Cookbook**](cookbook.md) – See complete working examples
