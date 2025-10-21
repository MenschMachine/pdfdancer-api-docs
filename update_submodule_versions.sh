#!/bin/bash

# Script to update docs/sdk-versions.md with current submodule commit information

OUTPUT_FILE="docs/sdk-versions.md"

# Get Python SDK info
cd external/pdfdancer-client-python
PYTHON_COMMIT=$(git log -1 --format="%H")
PYTHON_SHORT_COMMIT=$(git log -1 --format="%h")
PYTHON_DATE=$(git log -1 --format="%cd" --date=format:"%B %Y")
PYTHON_MESSAGE=$(git log -1 --format="%s")
PYTHON_TAG=$(git describe --tags --exact-match 2>/dev/null || echo "")
PYTHON_VERSION=$(grep '^version = ' pyproject.toml | sed 's/version = "\(.*\)"/\1/')
cd ../..

# Get TypeScript SDK info
cd external/pdfdancer-client-typescript
TS_COMMIT=$(git log -1 --format="%H")
TS_SHORT_COMMIT=$(git log -1 --format="%h")
TS_DATE=$(git log -1 --format="%cd" --date=format:"%B %Y")
TS_MESSAGE=$(git log -1 --format="%s")
TS_TAG=$(git describe --tags --exact-match 2>/dev/null || echo "")
TS_VERSION=$(grep '"version"' package.json | head -1 | sed 's/.*"version": "\(.*\)".*/\1/')
cd ../..

# Generate the markdown file
cat > "$OUTPUT_FILE" << EOF
---
id: sdk-versions
title: SDK Versions
description: Current SDK versions used in this documentation
---

# SDK Versions

This documentation is based on the following SDK versions:

## Python SDK

- **Repository**: [pdfdancer-client-python](https://github.com/MenschMachine/pdfdancer-client-python)
- **Version**: $PYTHON_VERSION
- **Commit**: \`$PYTHON_COMMIT\`
- **Date**: $PYTHON_DATE
EOF

if [ -n "$PYTHON_TAG" ]; then
    echo "- **Git Tag**: $PYTHON_TAG" >> "$OUTPUT_FILE"
fi
echo "- **Commit Message**: $PYTHON_MESSAGE" >> "$OUTPUT_FILE"

cat >> "$OUTPUT_FILE" << EOF

## TypeScript SDK

- **Repository**: [pdfdancer-client-typescript](https://github.com/MenschMachine/pdfdancer-client-typescript)
- **Version**: $TS_VERSION
- **Commit**: \`$TS_COMMIT\`
- **Date**: $TS_DATE
EOF

if [ -n "$TS_TAG" ]; then
    echo "- **Git Tag**: $TS_TAG" >> "$OUTPUT_FILE"
fi
echo "- **Commit Message**: $TS_MESSAGE" >> "$OUTPUT_FILE"

cat >> "$OUTPUT_FILE" << 'EOF'

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
EOF

echo "Updated $OUTPUT_FILE with current submodule versions"
