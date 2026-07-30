---
id: advanced
title: Advanced Usage
description: Apply production patterns for PDFDancer sessions, batching, retries, resource management, and safely handling partial PDF edit results.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Advanced Usage

This page covers orchestration around the SDK. It does not replace the result checks documented for each editing operation.

## Keep one session per document workflow

Apply related operations to one session and save once. Do not share a mutable PDFDancer session between unrelated concurrent jobs.

Session state accumulates successful operations in order. If a later required operation fails, discard that workflow and reopen the original input rather than treating the partially edited session as a completed document.

<Tabs>
<TabItem value="python" label="Python">

```python
from pathlib import Path
from pdfdancer import PDFDancer, TextReplaceRequest

def finalize(source: Path, destination: Path) -> None:
    with PDFDancer.open(source, max_attempts=3) as pdf:
        for old, new in [("Draft", "Final"), ("Acme Ltd", "Northwind GmbH")]:
            result = pdf.text().replace(
                TextReplaceRequest.literal(old, new).max_matches(1).build()
            )
            if result.changed != 1 or result.errors:
                raise RuntimeError(f"Required edit failed: {old}")
        pdf.save(destination)
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
async function finalize(pdf: PDFDancer): Promise<void> {
  for (const [oldText, newText] of [['Draft', 'Final'], ['Acme Ltd', 'Northwind GmbH']]) {
    const result = await pdf.text().replace(
      TextReplaceRequest.literal(oldText, newText).maxMatches(1).build()
    );
    if (result.changed !== 1 || result.errors?.length) {
      throw new Error(`Required edit failed: ${oldText}`);
    }
  }
  await pdf.save('output.pdf');
}
```

</TabItem>
<TabItem value="java" label="Java">

```java
for (var replacement : Map.of("Draft", "Final", "Acme Ltd", "Northwind GmbH").entrySet()) {
    var result = pdf.text().replace(
            TextReplaceRequest.literal(replacement.getKey(), replacement.getValue())
                    .maxMatches(1).build());
    if (result.changed() != 1 || (result.errors() != null && !result.errors().isEmpty())) {
        throw new IllegalStateException("Required edit failed: " + replacement.getKey());
    }
}
pdf.save("./output.pdf");
```

</TabItem>
</Tabs>

## Bound retry multiplication

The SDK defaults to three total attempts. If a queue or job runner also retries, calculate the maximum total requests and keep both layers bounded. Do not retry validation errors.

Use this upper-bound calculation for one SDK call:

```text
maximum attempts = SDK total attempts × complete-job attempts
```

For example, three SDK attempts and two complete-job attempts permit at most six attempts for that call. The real count can be smaller when an earlier attempt succeeds.

## Treat partial text results as failures when required

An HTTP success can contain text-operation errors or fewer changes than matches. Define expected counts for required edits and fail before saving when the result differs.

## Minimize round trips

- Use document scope when the same operation applies across pages.
- Use plural selectors when a workflow needs every object of one supported type.
- Reuse registered fonts within one session.
- Save once after the complete sequence of changes has been validated.

Do not combine unrelated input PDFs into one shared session merely to reduce calls. A session represents one mutable document workflow.

## Keep diagnostic context

For a rejected workflow, record application-level context without logging PDF contents or API keys:

- the application job identifier;
- the operation being attempted;
- the one-based page number or document scope;
- expected and actual match/change counts;
- exception type, result message, warnings, and errors;
- the SDK version used by the job.

Avoid logging raw document bytes, extracted customer content, or credentials.
