---
id: sdk-versions
title: SDK Versions
description: Review the SDK versions, package releases, supported runtimes, and installation requirements used by the documentation examples.
---

# SDK Versions

<!-- sdk-pins
{
  "python": {"version": "3.0.2", "commit": "c76a79f72e69"},
  "typescript": {"version": "3.0.1", "commit": "f7b7f2d7c269"},
  "java": {
    "version": "3.0.1",
    "commit": "20639941174b",
    "groupId": "com.pdfdancer.client",
    "artifactId": "pdfdancer-client-java"
  }
}
-->

Python SDK 3.0.2, TypeScript SDK 3.0.1, and Java SDK 3.0.1 are the latest stable API v3 releases. This documentation covers these releases:

| SDK | Package | Version | Runtime |
|---|---|---:|---|
| Python | `pdfdancer-client-python` | `3.0.2` | Python 3.10+ |
| TypeScript | `pdfdancer-client-typescript` | `3.0.1` | Node.js 20+ |
| Java | `com.pdfdancer.client:pdfdancer-client-java` | `3.0.1` | Java 17+ |

## Install or upgrade

```bash
# Python
python -m pip install --upgrade pdfdancer-client-python==3.0.2

# TypeScript
npm install pdfdancer-client-typescript@3.0.1
```

```xml
<!-- Java / Maven -->
<dependency>
  <groupId>com.pdfdancer.client</groupId>
  <artifactId>pdfdancer-client-java</artifactId>
  <version>3.0.1</version>
</dependency>
```

API v1 documentation remains available under [/v1/](/v1/). See [Migrating from v1](./migrating-from-v1) before upgrading an existing application.
