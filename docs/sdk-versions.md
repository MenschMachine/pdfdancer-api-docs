---
id: sdk-versions
title: SDK Versions
description: Review the SDK versions, package releases, supported runtimes, and installation requirements used by the documentation examples.
---

# SDK Versions

<!-- sdk-pins
{
  "python": {"version": "3.0.3", "commit": "45e6a10d3374"},
  "typescript": {"version": "3.0.3", "commit": "d2d29e4487f0"},
  "java": {
    "version": "3.0.3",
    "commit": "035d811184f3",
    "groupId": "com.pdfdancer.client",
    "artifactId": "pdfdancer-client-java"
  }
}
-->

This documentation covers the following API v3 SDK releases:

| SDK | Package | Version | Runtime |
|---|---|---:|---|
| Python | `pdfdancer-client-python` | `3.0.3` | Python 3.10+ |
| TypeScript | `pdfdancer-client-typescript` | `3.0.3` | Node.js 20+ |
| Java | `com.pdfdancer.client:pdfdancer-client-java` | `3.0.3` | Java 17+ |

The alignment examples in [Text Layout and Reflow](./text-layout.md#align-replacement-text) require SDK version 3.0.3 or a later compatible release.

## Install or upgrade

```bash
# Python
python -m pip install --upgrade pdfdancer-client-python==3.0.3

# TypeScript
npm install pdfdancer-client-typescript@3.0.3
```

```xml
<!-- Java / Maven -->
<dependency>
  <groupId>com.pdfdancer.client</groupId>
  <artifactId>pdfdancer-client-java</artifactId>
  <version>3.0.3</version>
</dependency>
```

API v1 is retired. See [Migrating from v1](./migrating-from-v1.md) when updating an existing application to the supported API v3 SDKs.
