#!/bin/bash

# Script to update docs/sdk-versions.md with current submodule commit information

OUTPUT_FILE="docs/sdk-versions.md"

# Get Python SDK info
cd external/pdfdancer-client-python
PYTHON_COMMIT=$(git log -1 --format="%H")
PYTHON_DATE=$(git log -1 --format="%B %Y" | head -1)
PYTHON_MESSAGE=$(git log -1 --format="%s")
PYTHON_TAG=$(git describe --tags --exact-match 2>/dev/null || echo "")
cd ../..

# Get TypeScript SDK info
cd external/pdfdancer-client-typescript
TS_COMMIT=$(git log -1 --format="%H")
TS_DATE=$(git log -1 --format="%B %Y" | head -1)
TS_MESSAGE=$(git log -1 --format="%s")
TS_TAG=$(git describe --tags --exact-match 2>/dev/null || echo "")
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
- **Commit**: \`$PYTHON_COMMIT\`
- **Date**: $PYTHON_DATE
EOF

if [ -n "$PYTHON_TAG" ]; then
    echo "- **Version**: $PYTHON_TAG" >> "$OUTPUT_FILE"
else
    echo "- **Version**: $PYTHON_MESSAGE" >> "$OUTPUT_FILE"
fi

cat >> "$OUTPUT_FILE" << EOF

## TypeScript SDK

- **Repository**: [pdfdancer-client-typescript](https://github.com/MenschMachine/pdfdancer-client-typescript)
- **Commit**: \`$TS_COMMIT\`
- **Date**: $TS_DATE
EOF

if [ -n "$TS_TAG" ]; then
    echo "- **Version**: $TS_TAG" >> "$OUTPUT_FILE"
else
    echo "- **Version**: $TS_MESSAGE" >> "$OUTPUT_FILE"
fi

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
