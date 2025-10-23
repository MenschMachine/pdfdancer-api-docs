---
id: sdk-versions
title: SDK Versions
description: Current SDK versions used in this documentation
---

# SDK Versions

This documentation is based on the following SDK versions:

## Python SDK

- **Repository**: [pdfdancer-client-python](https://github.com/MenschMachine/pdfdancer-client-python)
- **Version**: 0.2.16
- **Commit**: `77632a466b092b961eb34e5b0ac0da8f5606a579`
- **Date**: October 2025
- **Commit Message**: fix: update base URL in test_env_vars to use HTTPS
- **Key Changes Since Last Version**:
  - **License updated** from MIT to Apache License 2.0
  - **New HTTP client configuration** via environment variables:
    - `PDFDANCER_POOL_CONNECTIONS` - Configure connection pool size
    - `PDFDANCER_POOL_MAXSIZE` - Configure maximum pool size
    - `PDFDANCER_RETRY_TOTAL` - Configure retry attempts
    - `PDFDANCER_TRUST_ENV` - Honor system proxy settings (set to `true`)
  - **Python 3.10+ required** (Python 3.9 has SSL issues with large file uploads)
  - Enhanced development setup documentation with detailed instructions
  - Improved CI workflow and test coverage

## TypeScript SDK

- **Repository**: [pdfdancer-client-typescript](https://github.com/MenschMachine/pdfdancer-client-typescript)
- **Version**: 1.0.13
- **Commit**: `8238181b7d0280a1d0efc7756aed6f30a64a3525`
- **Date**: October 2025
- **Commit Message**: 1.0.13
- **Key Changes Since Last Version**:
  - **License updated** from MIT to Apache License 2.0
  - **Node.js 20+ required** (updated from Node.js 18+)
  - Added `discuss` command for enhanced API interactions
  - Improved error handling and messaging for token validation
  - Base URL normalization and validation in constructor
  - Enhanced end-to-end tests with token from environment variables

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
