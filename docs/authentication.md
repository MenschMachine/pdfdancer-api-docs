---
id: authentication
title: Authentication
description: Manage API credentials and configure your SkyAPI clients securely.
---

SkyAPI uses API keys to authenticate requests. Each key is tied to a workspace and can be scoped to specific permissions.

## Create an API Key

1. Sign into the SkyAPI Console.
2. Navigate to **Settings → API Keys**.
3. Click **Generate Key**, provide a descriptive name, and copy the generated secret.

Store keys in a secrets manager such as AWS Secrets Manager, HashiCorp Vault, or your CI provider's encrypted variables. Never commit keys to source control.

## Using Environment Variables

We recommend setting the key in an environment variable, then reading it from your application:

```bash
export SKYAPI_KEY="sk_live_123"
```

## Key Rotation

- Rotate keys at least every 90 days.
- Update deployed applications before deactivating old keys.
- Immediately revoke compromised keys from the console.

Refer to language-specific quickstarts for code samples that load keys from the environment.
