---
title: Python Quickstart
sidebar_label: Quickstart
---

This guide shows how to call PDFDancer SDK using the Python SDK.

## Initialize the Client

```python
import os
from skyapi import Client

client = Client(api_key=os.environ["SKYAPI_KEY"])
```

## Fetch a User

```python
user = client.get_user("123")
print(user.email)
```

## Handle Errors

```python
from skyapi.errors import SkyApiError

try:
    client.get_user("123")
except SkyApiError as err:
    print(f"Request failed: {err}")
```

Review the [authentication guide](../authentication.md) for key management best practices.
