---
title: TypeScript Advanced Guides
sidebar_label: Advanced
---

Advanced patterns for using the TypeScript SDK.

## Custom Fetch Implementation

```ts
import { Client } from "MenschMachine";
import fetch from "node-fetch";

const client = new Client({
  apiKey: process.env.MenschMachine_KEY!,
  fetchImplementation: fetch,
});
```

## Retries and Timeouts

```ts
const client = new Client({
  apiKey: process.env.MenschMachine_KEY!,
  maxRetries: 3,
  timeout: 5000,
});
```

## Streaming Responses

```ts
for await (const user of client.streamUsers()) {
  console.log(user.id);
}
```

See the SDK reference for pagination helpers and webhook verification utilities.
