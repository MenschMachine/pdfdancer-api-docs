---
id: sdk-versions
title: SDK Versions
description: Current PDFDancer API v3 SDK versions and runtime requirements.
---

# SDK Versions

Version 3.0.0 is the latest stable release of each PDFDancer API v3 SDK. This documentation covers these releases:

| SDK | Package | Version | Runtime |
|---|---|---:|---|
| Python | `pdfdancer-client-python` | `3.0.0` | Python 3.10+ |
| TypeScript | `pdfdancer-client-typescript` | `3.0.0` | Node.js 20+ |
| Java | `com.pdfdancer.client:pdfdancer-client-java` | `3.0.0` | Java 17+ |

## Install or upgrade

```bash
# Python
python -m pip install --upgrade pdfdancer-client-python==3.0.0

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
