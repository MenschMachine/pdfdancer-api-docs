---
id: authentication
title: Authentication
description: Manage API credentials and configure your PDFDancer clients securely.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

PDFDancer uses API tokens to authenticate requests. You can get started immediately with anonymous tokens, or create an account for higher limits and advanced features.

---

## Anonymous Tokens (Quick Start)

No API token needed to get started—the SDK automatically obtains an anonymous token when you don't provide one:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

# No token needed! SDK automatically gets an anonymous token
with PDFDancer.open("input.pdf") as pdf:
    # Your PDF operations here
    pass
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

// No token needed! SDK automatically gets an anonymous token
const pdf = await PDFDancer.open(pdfBytes);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
// No token needed! SDK automatically gets an anonymous token
PDFDancer pdf = PDFDancer.createSession("input.pdf");
// Your PDF operations here
```

  </TabItem>
</Tabs>

Anonymous tokens are perfect for prototyping and small projects. For production use, higher rate limits, and access to premium features, create an account and use authenticated API tokens.

---

## Obtaining an API Token

1. Sign into the [PDFDancer Dashboard](https://www.pdfdancer.com/dashboard).
2. Navigate to **Settings → API Tokens**.
3. Click **Generate Token**, provide a descriptive name, and copy the generated token.

Store tokens in a secrets manager such as AWS Secrets Manager, HashiCorp Vault, or your CI provider's encrypted variables. Never commit tokens to source control.

---

## Authentication Methods

### Environment Variables (Recommended)

Set the token in an environment variable to avoid hardcoding credentials:

```bash
export PDFDANCER_TOKEN="your-api-token"
```

The SDK will automatically read this environment variable when initializing.

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

# Token is automatically read from PDFDANCER_TOKEN environment variable
with PDFDancer.open("input.pdf") as pdf:
    # Your PDF operations here
    pass
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

// Token is automatically read from PDFDANCER_TOKEN environment variable
const pdf = await PDFDancer.open(pdfBytes);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
// Token is automatically read from PDFDANCER_TOKEN environment variable
PDFDancer pdf = PDFDancer.createSession("input.pdf");
// Your PDF operations here
```

  </TabItem>
</Tabs>

### Explicit Token Parameter

You can also pass the token explicitly when creating the client:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open(
    pdf_data="input.pdf",
    token="your-api-token"
) as pdf:
    # Your PDF operations here
    pass
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(pdfBytes, 'your-api-token');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
// Token can be passed through system properties or environment variables
// Set via: -DPDFDANCER_TOKEN="your-api-token" or environment variable
PDFDancer pdf = PDFDancer.createSession("input.pdf");
// Your PDF operations here
```

  </TabItem>
</Tabs>

---

## Configuration Options

### Custom API Endpoint

This configuration is for self-hosted enterprise plans. If you're using a self-hosted instance of PDFDancer, you can override the default API endpoint by setting the `PDFDANCER_BASE_URL` environment variable or passing the `base_url` parameter:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

# Using environment variable
# export PDFDANCER_BASE_URL="https://sandbox.pdfdancer.com"

# Or passing explicitly
with PDFDancer.open(
    pdf_data="input.pdf",
    token="your-api-token",
    base_url="https://sandbox.pdfdancer.com"
) as pdf:
    pass
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

// Using environment variable
// export PDFDANCER_BASE_URL="https://sandbox.pdfdancer.com"

// Or passing explicitly
const pdf = await PDFDancer.open(
  pdfBytes,
  'your-api-token',
  'https://sandbox.pdfdancer.com'
);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
// Set via system properties or environment variable
// export PDFDANCER_BASE_URL="https://sandbox.pdfdancer.com"
// or -DPDFDANCER_BASE_URL="https://sandbox.pdfdancer.com"

PDFDancer pdf = PDFDancer.createSession("input.pdf");
```

  </TabItem>
</Tabs>

### Request Timeout

Configure request timeout for long-running operations:

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer

with PDFDancer.open(
    pdf_data="input.pdf",
    token="your-api-token",
    timeout=60  # 60 seconds
) as pdf:
    pass
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';

const pdf = await PDFDancer.open(
  pdfBytes,
  'your-api-token',
  'https://api.pdfdancer.com',
  60000  // 60 seconds in milliseconds
);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
// Configure timeout via system properties
// Set via: -DPDFDANCER_TIMEOUT="60000" (milliseconds)
// or environment variable: PDFDANCER_TIMEOUT

PDFDancer pdf = PDFDancer.createSession("input.pdf");
```

  </TabItem>
</Tabs>

---

## Security Best Practices

### Token Storage

- **Never commit tokens to version control** - Use `.gitignore` to exclude token files
- **Use secrets managers** - Store tokens in AWS Secrets Manager, HashiCorp Vault, or similar
- **Environment-specific tokens** - Use different tokens for development, staging, and production
- **Rotate regularly** - Generate new tokens periodically and deactivate old ones

### Token Rotation

1. Generate a new token in the [PDFDancer Dashboard](https://www.pdfdancer.com/dashboard)
2. Update your environment variables or secrets manager
3. Deploy the changes to all environments
4. Deactivate the old token after verifying the new one works

### Compromised Tokens

If a token is compromised:

1. Immediately deactivate it in the [PDFDancer Dashboard](https://www.pdfdancer.com/dashboard)
2. Generate a new token
3. Update all applications using the old token
4. Review audit logs for suspicious activity

---

## Next Steps

- [**Quickstart**](quickstart.md) – Make your first API calls
- [**Selecting Content**](working-with-text.md) – Learn how to find content in PDFs
- [**Examples**](cookbook.md) – See complete working examples
