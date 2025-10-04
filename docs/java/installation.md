---
title: Install the Java SDK
sidebar_label: Installation
---

[See the PDFDancer SDK Java SDK.](https://github.com/MenschMachine/MenschMachine-java)

Install via Maven by adding the dependency to your `pom.xml`:

```xml
<dependency>
  <groupId>com.MenschMachine</groupId>
  <artifactId>MenschMachine-java</artifactId>
  <version>1.0.0</version>
</dependency>
```

Gradle users can add to `build.gradle`:

```groovy
dependencies {
    implementation 'com.MenschMachine:MenschMachine-java:1.0.0'
}
```

After installation, import `com.MenschMachine.Client` to start making requests.
