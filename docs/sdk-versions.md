---
id: sdk-versions
title: SDK Versions
description: Current SDK versions used in this documentation
---

# SDK Versions

This documentation is based on the following SDK versions:

## Python SDK

- **Repository**: [pdfdancer-client-python](https://github.com/MenschMachine/pdfdancer-client-python)
- **Version**: 0.2.12+
- **Commit**: `603a0dfcbb51c59044e9e62ee6200b54f40bd910`
- **Date**: October 2025
- **Commit Message**: docs: Update README.md and pyproject.toml for PDFDancer Python client
- **Key Changes Since Last Version**:
  - Added `CommandResult` model returned by modify operations (instead of boolean)
  - Added `TextStatus`, `FontRecommendation`, and `FontType` models for text modification tracking
  - Text objects now include status information about modifications and font encoding

## TypeScript SDK

- **Repository**: [pdfdancer-client-typescript](https://github.com/MenschMachine/pdfdancer-client-typescript)
- **Version**: 1.0.11
- **Commit**: `4c08afd5d2f2ef9f9382f010dfa8dcdbdfe4b2fb`
- **Date**: October 2025
- **Commit Message**: 1.0.11
- **Key Changes Since Last Version**:
  - Added `CommandResult` class returned by modify operations (instead of boolean)
  - Added `TextStatus`, `FontRecommendation`, and `FontType` for text modification tracking
  - Text objects now include status information about modifications and font encoding

---

## Checking Your Installed Version

To verify which version of the SDK you have installed:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="python" label="Python">

```bash
pip show pdfdancer-client-python
```

Or in Python code:

```python
import pdfdancer
print(pdfdancer.__version__)
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```bash
npm list pdfdancer-client-typescript
```

Or check your `package.json`:

```bash
cat package.json | grep pdfdancer-client-typescript
```

  </TabItem>
</Tabs>

---

## Updating to Latest Version

<Tabs>
  <TabItem value="python" label="Python">

```bash
pip install --upgrade pdfdancer-client-python
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```bash
npm update pdfdancer-client-typescript
```

Or with pnpm:

```bash
pnpm update pdfdancer-client-typescript
```

Or with Yarn:

```bash
yarn upgrade pdfdancer-client-typescript
```

  </TabItem>
</Tabs>
