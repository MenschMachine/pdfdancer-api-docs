---
title: Python Advanced Guides
sidebar_label: Advanced
---

These patterns help you build production-ready integrations with the Python SDK.

## Custom Session

```python
import os
import requests
from skyapi import Client

session = requests.Session()
session.headers.update({"User-Agent": "skyapi-integrator/1.0"})

client = Client(api_key=os.environ["SKYAPI_KEY"], session=session)
```

## Retries

```python
client = Client(api_key=os.environ["SKYAPI_KEY"], max_retries=3)
```

## Async Support

```python
import os
from skyapi.aio import AsyncClient

async with AsyncClient(api_key=os.environ["SKYAPI_KEY"]) as client:
    user = await client.get_user("123")
```

Consult the SDK reference for pagination helpers and webhook signature verification.
