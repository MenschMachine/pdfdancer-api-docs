---
title: Java Advanced Guides
sidebar_label: Advanced
---

Explore advanced usage patterns for the Java SDK.

## Custom HTTP Client

```java
HttpClient httpClient = HttpClient.newBuilder()
    .connectTimeout(Duration.ofSeconds(5))
    .build();

Client client = Client.builder()
    .apiKey(System.getenv("SKYAPI_KEY"))
    .httpClient(httpClient)
    .build();
```

## Retry Strategy

```java
client = Client.builder()
    .apiKey(System.getenv("SKYAPI_KEY"))
    .maxRetries(3)
    .build();
```

## Streaming Responses

Refer to the SDK reference for streaming helpers such as `client.streamUsers()` when handling large datasets.
