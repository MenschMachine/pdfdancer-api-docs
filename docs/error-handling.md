---
id: error-handling
title: Error Handling
description: Handle API v2 exceptions, command results, text diagnostics, retries, and partial outcomes.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Error Handling

Handle failures at three levels: request construction, transport/session execution, and operation result.

## Exceptions

The public v2 hierarchy includes validation, HTTP client, session, session-not-found, font-not-found, and rate-limit failures. Java classes use `com.pdfdancer...` packages. Catch the most specific useful type before the common PDFDancer exception.

| Failure | Typical meaning | Retry automatically? |
|---|---|---|
| Validation | A request is incomplete, contradictory, or outside an accepted range. | No; correct the request. |
| Font not found | The requested service or registered font name is unavailable. | No; choose or register a valid font. |
| Session not found | The active server-side PDF session no longer exists. | No in place; open a new session and replay the complete workflow. |
| Rate limit | The service is temporarily refusing additional requests for the caller. | Yes, within a bounded policy and after the supplied delay when present. |
| HTTP client or connection | Transport, timeout, or configured retry-status failure. | Only when the specific failure is transient. |
| General session failure | The service could not complete a session operation. | Only when the operation and surrounding workflow are safe to replay. |

## Retries

The default policy makes three total attempts. Retrying is appropriate for configured transient statuses, connection failures, and timeouts. Validation failures are not transient. A rate-limit exception may carry a parsed retry delay.

Bound retries at one layer. Combining SDK retries with an unbounded job retry can multiply requests unexpectedly.

If the SDK makes up to three attempts and the surrounding worker runs the complete job up to four times, one logical job can make up to twelve attempts for the same SDK call. Set both limits deliberately.

## Operation results

- Check `CommandResult.success` plus its message and warning for object transformations.
- Do not assume every object-editing method returns `CommandResult`; some return booleans.
- For text, compare `matched` and `changed`, then inspect warnings, errors, and per-change layout diagnostics.

| Result shape | Required check |
|---|---|
| Boolean object operation | Require `true` when the change is mandatory. |
| `CommandResult` | Require `success`; retain `message`, `warning`, and the affected identifier for diagnostics. |
| `TextEditResponse` | Check expected `matched` and `changed` counts, then warnings, errors, and change diagnostics. |
| Singular selector | Handle `None`, `null`, or `Optional.empty()` as an ordinary no-result outcome. |
| Plural selector | Handle an empty collection as an ordinary no-result outcome. |

A no-match text response is not necessarily an HTTP or API failure. It means the request executed but found no eligible target. Decide at the application level whether that is acceptable.

## Save policy

Do not save merely because no exception was thrown. First confirm that every required change produced its expected result and that no unacceptable fallback occurred.

When several edits are required, validate all of them before saving. Save to a new path so a rejected workflow does not overwrite the original input.

## Complete handling pattern

<Tabs>
<TabItem value="python" label="Python">

```python
from pdfdancer import PdfDancerException, RateLimitException, TextReplaceRequest

try:
    result = pdf.text().replace(TextReplaceRequest.literal("Draft", "Final").build())
    if result.matched == 0:
        raise RuntimeError("Required text was not found")
    if result.changed != result.matched or result.errors:
        raise RuntimeError(f"Edit was only partially applied: {result.errors}")
    pdf.save("output.pdf")
except RateLimitException as exc:
    print(f"Rate limited: {exc}")
except PdfDancerException as exc:
    print(f"PDFDancer request failed: {exc}")
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
try {
  const result = await pdf.text().replace(
    TextReplaceRequest.literal('Draft', 'Final').build()
  );
  if (result.matched === 0) throw new Error('Required text was not found');
  if (result.changed !== result.matched || result.errors?.length) {
    throw new Error(`Edit was only partially applied: ${JSON.stringify(result.errors)}`);
  }
  await pdf.save('output.pdf');
} catch (error) {
  if (error instanceof RateLimitException) console.error('Rate limited', error.retryAfter);
  else throw error;
}
```

</TabItem>
<TabItem value="java" label="Java">

```java
try {
    var result = pdf.text().replace(
            TextReplaceRequest.literal("Draft", "Final").build());
    if (result.matched() == 0) throw new IllegalStateException("Required text was not found");
    if (!result.changed().equals(result.matched())
            || (result.errors() != null && !result.errors().isEmpty())) {
        throw new IllegalStateException("Edit was only partially applied");
    }
    pdf.save("output.pdf");
} catch (RateLimitException exception) {
    System.err.println("Rate limited: " + exception.getMessage());
} catch (PdfDancerException exception) {
    System.err.println("PDFDancer request failed: " + exception.getMessage());
}
```

</TabItem>
</Tabs>
