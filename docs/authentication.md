---
id: authentication
title: Authentication
description: Configure PDFDancer API credentials, endpoints, timeouts, and retries.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Authentication

Use anonymous access for evaluation and an account-backed API key for production. `PDFDANCER_API_TOKEN` is the preferred environment variable; `PDFDANCER_TOKEN` remains a compatibility alias.

Never commit tokens to source control or place them in browser-delivered code. The TypeScript SDK is a Node.js client, not a browser client.

## Anonymous access

If neither an explicit token nor an environment token is available, the SDK requests a temporary anonymous token automatically. You do not need to change the quickstart code. Anonymous output is watermarked and is intended for evaluation.

## Create an account API key

1. [Create a free PDFDancer account](https://www.pdfdancer.com/sign-up/?plan=free).
2. After signing in, copy the API key shown on the dashboard overview.
3. Store it as `PDFDANCER_API_TOKEN` in your local environment or deployment secret manager.

```bash
export PDFDANCER_API_TOKEN="your-api-key"
```

## Pass a token explicitly

Environment variables are preferable in deployed applications, but every SDK also accepts an explicit token.

<Tabs>
<TabItem value="python" label="Python">

```python
pdf = PDFDancer.open(
    "input.pdf",
    token="your-api-token",
    base_url="https://api.pdfdancer.com",
    timeout=30,
    max_attempts=3,
)
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const pdf = await PDFDancer.open(
  inputBytes,
  'your-api-token',
  'https://api.pdfdancer.com',
  30_000
);
```

</TabItem>
<TabItem value="java" label="Java">

```java
PDFDancer pdf = PDFDancer.createSession("your-api-token", new File("input.pdf"));
```

</TabItem>
</Tabs>

## Configuration by SDK

| Setting | Python | TypeScript | Java |
|---|---|---|---|
| Explicit token | `token=` | second `open` argument | configured client or environment |
| Base URL | `base_url=` or `PDFDANCER_BASE_URL` | third `open` argument or environment | `PdfDancerHttpClient` or environment |
| Default timeout | 30 seconds | 30,000 ms | 30 seconds in the default client |
| Default attempts | 3 total | 3 total | 3 total |

The initial request counts as one attempt. HTTP 408, 429, 500, 502, 503, 504, and 520 are retryable by default, along with configured connection and timeout failures. `Retry-After` is honored for HTTP 429.

## Production checklist

- Store the account token in your deployment platform's secret manager.
- Set an explicit base URL only for a trusted environment.
- Bound timeouts and total attempts for the surrounding job.
- Handle rate-limit and session exceptions separately from validation failures.
- Do not disable TLS verification outside controlled local testing.

See [Error Handling](./error-handling) for the language-specific exception model.
