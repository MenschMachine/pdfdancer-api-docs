---
title: Install the Java SDK
sidebar_label: Installation
---

[See the SkyAPI Java SDK.](https://github.com/skyapi/skyapi-java)

Install via Maven by adding the dependency to your `pom.xml`:

```xml
<dependency>
  <groupId>com.skyapi</groupId>
  <artifactId>skyapi-java</artifactId>
  <version>1.0.0</version>
</dependency>
```

Gradle users can add to `build.gradle`:

```groovy
dependencies {
    implementation 'com.skyapi:skyapi-java:1.0.0'
}
```

After installation, import `com.skyapi.Client` to start making requests.
