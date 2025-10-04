---
title: Python Advanced Guides
sidebar_label: Advanced
---

These patterns help you build production-ready integrations with the Python SDK.

## Custom Session

```python
import os
import requests
from MenschMachine import Client

session = requests.Session()
session.headers.update({"User-Agent": "MenschMachine-integrator/1.0"})

client = Client(api_key=os.environ["MenschMachine_KEY"], session=session)
```

## Retries

```python
client = Client(api_key=os.environ["MenschMachine_KEY"], max_retries=3)
```

## Async Support

```python
import os
from MenschMachine.aio import AsyncClient

async with AsyncClient(api_key=os.environ["MenschMachine_KEY"]) as client:
    user = await client.get_user("123")
```

Consult the SDK reference for pagination helpers and webhook signature verification.
