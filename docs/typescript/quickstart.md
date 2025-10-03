---
title: TypeScript Quickstart
sidebar_label: Quickstart
---

Use the TypeScript SDK to call SkyAPI from Node.js or browser environments.

## Initialize the Client

```ts
import { Client } from "skyapi";

const client = new Client({ apiKey: process.env.SKYAPI_KEY! });
```

## Fetch a User

```ts
const user = await client.getUser("123");
console.log(user.email);
```

## Handle Errors

```ts
try {
  await client.getUser("123");
} catch (error) {
  if (error instanceof SkyApiError) {
    console.error(error.message);
  }
}
```

Reference the [authentication guide](../authentication.md) for storing API keys securely.
