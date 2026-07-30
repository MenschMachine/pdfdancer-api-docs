---
id: sdk-versions
title: SDK Versions
description: Review the SDK versions, package releases, supported runtimes, and installation requirements used by the documentation examples.
---

# SDK Versions

<!-- sdk-pins
{
  "python": {"version": "3.0.1", "commit": "af2a1171a1b9"},
  "typescript": {"version": "3.0.0", "commit": "7bd49ac104cc"},
  "java": {
    "version": "3.0.0",
    "commit": "9c04036fe114",
    "groupId": "com.pdfdancer.client",
    "artifactId": "pdfdancer-client-java"
  }
}
-->

Python SDK 3.0.1 is the latest stable Python API v3 release; the TypeScript and Java SDKs remain at 3.0.0. This documentation covers these releases:

| SDK | Package | Version | Runtime |
|---|---|---:|---|
| Python | `pdfdancer-client-python` | `3.0.1` | Python 3.10+ |
| TypeScript | `pdfdancer-client-typescript` | `3.0.0` | Node.js 20+ |
| Java | `com.pdfdancer.client:pdfdancer-client-java` | `3.0.0` | Java 17+ |

## Install or upgrade

```bash
# Python
python -m pip install --upgrade pdfdancer-client-python==3.0.1

# TypeScript
npm install pdfdancer-client-typescript@3.0.0
```

```xml
<!-- Java / Maven -->
<dependency>
  <groupId>com.pdfdancer.client</groupId>
  <artifactId>pdfdancer-client-java</artifactId>
  <version>3.0.0</version>
</dependency>
```

API v1 documentation remains available under [/v1/](/v1/). See [Migrating from v1](./migrating-from-v1) before upgrading an existing application.
