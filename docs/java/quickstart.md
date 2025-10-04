---
title: Java Quickstart
sidebar_label: Quickstart
---

Follow these steps to issue your first PDFDancer SDK request using the Java SDK.

## Initialize the Client

```java
import com.skyapi.Client;

Client client = new Client(System.getenv("SKYAPI_KEY"));
```

## Fetch a User

```java
var user = client.getUser("123");
System.out.println(user.getEmail());
```

## Handle Errors

```java
try {
    client.getUser("123");
} catch (SkyApiException ex) {
    System.err.println(ex.getMessage());
}
```

See the [authentication guide](../authentication.md) for managing credentials.
