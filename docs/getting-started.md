---
id: getting-started
slug: /
title: Getting Started with PDFDancer SDK
description: Learn how to install the PDFDancer SDK SDKs and make your first request.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

PDFDancer SDK makes it simple to connect to our platform from your favorite programming language.  
This guide walks you through the basics of setting up a client and making your first request.

---

## Installation

<Tabs>
  <TabItem value="java" label="Java">

Add the following dependency to your Maven `pom.xml`:

```xml
<dependency>
  <groupId>com.skyapi</groupId>
  <artifactId>skyapi-java</artifactId>
  <version>1.0.0</version>
</dependency>
```

  </TabItem>
  <TabItem value="python" label="Python">


Install from PyPI:

```bash
pip install skyapi
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">


Install from npm:

```bash
npm install skyapi
```

  </TabItem>
</Tabs>



---

## Initialize the Client

<Tabs>
  <TabItem value="java" label="Java">


```java
import com.skyapi.Client;

public class Main {
    public static void main(String[] args) {
        Client client = new Client("API_KEY");
        System.out.println(client.getUser("123"));
    }
}
```

  </TabItem>
  <TabItem value="python" label="Python">


```python
from skyapi import Client

client = Client("API_KEY")
print(client.get_user("123"))
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">


```ts
import { Client } from "skyapi";

const client = new Client("API_KEY");
console.log(await client.getUser("123"));
```

  </TabItem>
</Tabs>



---

## Next Steps

- Authentication – learn how to securely manage API keys
- Java Quickstart
- Python Quickstart
- TypeScript Quickstart
