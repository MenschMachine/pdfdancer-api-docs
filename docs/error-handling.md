---
id: error-handling
title: Error Handling
description: Learn how to handle exceptions and errors in PDFDancer SDK.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

PDFDancer provides detailed exception handling to help you identify and resolve issues quickly. All exceptions include descriptive error messages and context.

---

## Exception Hierarchy

<Tabs>
  <TabItem value="python" label="Python">

All exceptions inherit from `PdfDancerException`:

- **`PdfDancerException`** - Base exception for all PDFDancer errors
  - **`ValidationException`** - Client-side validation errors (missing token, invalid coordinates, etc.)
  - **`FontNotFoundException`** - Font not found on the service
  - **`HttpClientException`** - HTTP transport or server errors
  - **`SessionException`** - Session creation or management failures

```python
from pdfdancer.exceptions import (
    PdfDancerException,
    ValidationException,
    FontNotFoundException,
    HttpClientException,
    SessionException
)
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

All exceptions inherit from `PdfDancerException`:

- **`PdfDancerException`** - Base exception for all PDFDancer errors
  - **`ValidationException`** - Client-side validation errors
  - **`FontNotFoundException`** - Font not found on the service
  - **`HttpClientException`** - HTTP transport or server errors
  - **`SessionException`** - Session creation or management failures

```typescript
import {
  PdfDancerException,
  ValidationException,
  FontNotFoundException,
  HttpClientException,
  SessionException
} from 'pdfdancer-client-typescript';
```

  </TabItem>
  <TabItem value="java" label="Java">

All exceptions inherit from `PdfDancerException`:

- **`PdfDancerException`** - Base exception for all PDFDancer errors
  - **`ValidationException`** - Client-side validation errors
  - **`FontNotFoundException`** - Font not found on the service
  - **`HttpClientException`** - HTTP transport or server errors
  - **`SessionException`** - Session creation or management failures

```java
import com.tfc.pdf.pdfdancer.exceptions.*;
```

  </TabItem>
</Tabs>

---

## Handling Validation Errors

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer
from pdfdancer.exceptions import ValidationException

try:
    # Missing required token
    with PDFDancer.open("document.pdf") as pdf:
        pass
except ValidationException as e:
    print(f"Validation error: {e}")
    # Output: "Validation error: API token is required"

try:
    # Invalid coordinates
    with PDFDancer.open("document.pdf", token="valid-token") as pdf:
        pdf.new_paragraph() \
            .text("Test") \
            .font("Helvetica", 12) \
            .at(page_number=-1, x=100, y=500) \
            .add()
except ValidationException as e:
    print(f"Validation error: {e}")
    # Output: "Validation error: Page number must be positive"
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer } from 'pdfdancer-client-typescript';
import { ValidationException } from 'pdfdancer-client-typescript';

try {
  // Invalid input
  const pdf = await PDFDancer.open(null as any);
} catch (error) {
  if (error instanceof ValidationException) {
    console.error('Validation error:', error.message);
  }
}

try {
  const pdf = await PDFDancer.open('document.pdf');

  // Invalid coordinates
  await pdf.page(1).newParagraph()
    .text('Test')
    .font('Helvetica', 12)
    .at(-100, 500)  // Invalid negative coordinate
    .apply();
} catch (error) {
  if (error instanceof ValidationException) {
    console.error('Validation error:', error.message);
  }
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.PDFDancer;
import com.tfc.pdf.pdfdancer.exceptions.ValidationException;

try {
    // Invalid coordinates
    try (PDFDancer pdf = PDFDancer.createSession("document.pdf")) {
        pdf.page(1).newParagraph()
            .text("Test")
            .font("Helvetica", 12)
            .at(-100, 500)  // Invalid negative coordinate
            .apply();
    }
} catch (ValidationException e) {
    System.err.println("Validation error: " + e.getMessage());
}
```

  </TabItem>
</Tabs>

---

## Handling Font Errors

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer
from pdfdancer.exceptions import FontNotFoundException

try:
    with PDFDancer.open("document.pdf") as pdf:
        pdf.new_paragraph() \
            .text("Hello") \
            .font("NonExistentFont", 12) \
            .at(page_number=1, x=100, y=500) \
            .add()
except FontNotFoundException as e:
    print(f"Font not found: {e}")
    # Fallback to default font
    with PDFDancer.open("document.pdf") as pdf:
        pdf.new_paragraph() \
            .text("Hello") \
            .font("Helvetica", 12) \
            .at(page_number=1, x=100, y=500) \
            .add()
        pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, FontNotFoundException } from 'pdfdancer-client-typescript';

try {
  const pdf = await PDFDancer.open('document.pdf');

  await pdf.page(1).newParagraph()
    .text('Hello')
    .font('NonExistentFont', 12)
    .at(100, 500)
    .apply();
} catch (error) {
  if (error instanceof FontNotFoundException) {
    console.error('Font not found:', error.message);

    // Fallback to default font
    const pdf = await PDFDancer.open('document.pdf');
    await pdf.page(1).newParagraph()
      .text('Hello')
      .font('Helvetica', 12)
      .at(100, 500)
      .apply();

    await pdf.save('output.pdf');
  }
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.exceptions.FontNotFoundException;

try {
    try (PDFDancer pdf = PDFDancer.createSession("document.pdf")) {
        pdf.page(1).newParagraph()
            .text("Hello")
            .font("NonExistentFont", 12)
            .at(100, 500)
            .apply();
    }
} catch (FontNotFoundException e) {
    System.err.println("Font not found: " + e.getMessage());

    // Fallback to default font
    try (PDFDancer pdf = PDFDancer.createSession("document.pdf")) {
        pdf.page(1).newParagraph()
            .text("Hello")
            .font("Helvetica", 12)
            .at(100, 500)
            .apply();

        pdf.save("output.pdf");
    }
}
```

  </TabItem>
</Tabs>

---

## Handling HTTP and Session Errors

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer
from pdfdancer.exceptions import (
    HttpClientException,
    SessionException,
    PdfDancerException
)

try:
    with PDFDancer.open(
        "document.pdf",
        token="invalid-token",
        base_url="https://api.pdfdancer.com"
    ) as pdf:
        pdf.save("output.pdf")

except SessionException as e:
    print(f"Session error: {e}")
    # Session creation failed, possibly due to invalid token

except HttpClientException as e:
    print(f"HTTP error: {e}")
    # Network or server error

except PdfDancerException as e:
    print(f"Unexpected error: {e}")
    # Catch-all for other PDFDancer errors
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import {
  PDFDancer,
  HttpClientException,
  SessionException,
  PdfDancerException
} from 'pdfdancer-client-typescript';

try {
  const pdf = await PDFDancer.open(
    'document.pdf',
    'invalid-token',
    'https://api.pdfdancer.com'
  );

  await pdf.save('output.pdf');

} catch (error) {
  if (error instanceof SessionException) {
    console.error('Session error:', error.message);
    // Session creation failed, possibly due to invalid token

  } else if (error instanceof HttpClientException) {
    console.error('HTTP error:', error.message);
    // Network or server error

  } else if (error instanceof PdfDancerException) {
    console.error('Unexpected error:', error.message);
    // Catch-all for other PDFDancer errors
  }
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.exceptions.*;

try {
    try (PDFDancer pdf = PDFDancer.createSession(
        "document.pdf",
        "invalid-token",
        "https://api.pdfdancer.com"
    )) {
        pdf.save("output.pdf");
    }
} catch (SessionException e) {
    System.err.println("Session error: " + e.getMessage());
    // Session creation failed, possibly due to invalid token

} catch (HttpClientException e) {
    System.err.println("HTTP error: " + e.getMessage());
    // Network or server error

} catch (PdfDancerException e) {
    System.err.println("Unexpected error: " + e.getMessage());
    // Catch-all for other PDFDancer errors
}
```

  </TabItem>
</Tabs>

---

## Complete Error Handling Pattern

<Tabs>
  <TabItem value="python" label="Python">

```python
from pdfdancer import PDFDancer, Color
from pdfdancer.exceptions import (
    ValidationException,
    FontNotFoundException,
    HttpClientException,
    SessionException,
    PdfDancerException
)

def process_pdf(input_path: str, output_path: str) -> bool:
    """
    Process a PDF with comprehensive error handling.

    Returns True on success, False on failure.
    """
    try:
        with PDFDancer.open(input_path) as pdf:
            # Find and edit paragraphs
            paragraphs = pdf.page(1).select_paragraphs_starting_with("Invoice")

            if paragraphs:
                paragraphs[0].edit() \
                    .replace("PAID") \
                    .color(Color(0, 128, 0)) \
                    .apply()

            # Add watermark
            pdf.new_paragraph() \
                .text("CONFIDENTIAL") \
                .font("Helvetica-Bold", 48) \
                .color(Color(200, 200, 200)) \
                .at(page_number=1, x=150, y=400) \
                .add()

            pdf.save(output_path)
            return True

    except ValidationException as e:
        print(f"Validation failed: {e}")
        print("Check your input parameters and try again.")
        return False

    except FontNotFoundException as e:
        print(f"Font error: {e}")
        print("Using fallback font...")
        # Retry with fallback font
        try:
            with PDFDancer.open(input_path) as pdf:
                pdf.new_paragraph() \
                    .text("CONFIDENTIAL") \
                    .font("Helvetica", 48) \
                    .color(Color(200, 200, 200)) \
                    .at(page_number=1, x=150, y=400) \
                    .add()
                pdf.save(output_path)
                return True
        except Exception as retry_error:
            print(f"Retry failed: {retry_error}")
            return False

    except SessionException as e:
        print(f"Session error: {e}")
        print("Check your API token and network connection.")
        return False

    except HttpClientException as e:
        print(f"HTTP error: {e}")
        print("The API server may be unavailable. Try again later.")
        return False

    except PdfDancerException as e:
        print(f"PDFDancer error: {e}")
        return False

    except Exception as e:
        print(f"Unexpected error: {e}")
        return False


# Usage
success = process_pdf("invoice.pdf", "processed_invoice.pdf")
if success:
    print("PDF processed successfully!")
else:
    print("PDF processing failed.")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
import { PDFDancer, Color } from 'pdfdancer-client-typescript';
import {
  ValidationException,
  FontNotFoundException,
  HttpClientException,
  SessionException,
  PdfDancerException
} from 'pdfdancer-client-typescript';

try {
  const pdf = await PDFDancer.open('input.pdf');

  // Find and edit paragraphs
  const paragraphs = await pdf.page(1).selectParagraphsStartingWith('Invoice');

  if (paragraphs.length > 0) {
    await paragraphs[0].edit()
      .replace('PAID')
      .color(new Color(0, 128, 0))
      .apply();
  }

  // Add watermark
  await pdf.page(1).newParagraph()
    .text('CONFIDENTIAL')
    .font('Helvetica-Bold', 48)
    .color(new Color(200, 200, 200))
    .at(150, 400)
    .apply();

  await pdf.save('output.pdf');

} catch (error) {
  if (error instanceof ValidationException) {
    console.error('Validation failed:', error.message);
    console.error('Check your input parameters and try again.');

  } else if (error instanceof FontNotFoundException) {
    console.error('Font error:', error.message);
    console.error('Using fallback font...');

    // Retry with fallback font
    try {
      const pdf = await PDFDancer.open('input.pdf');

      await pdf.page(1).newParagraph()
        .text('CONFIDENTIAL')
        .font('Helvetica', 48)
        .color(new Color(200, 200, 200))
        .at(150, 400)
        .apply();

      await pdf.save('output.pdf');
    } catch (retryError) {
      console.error('Retry failed:', retryError);
    }

  } else if (error instanceof SessionException) {
    console.error('Session error:', error.message);
    console.error('Check your API token and network connection.');

    } else if (error instanceof HttpClientException) {
      console.error('HTTP error:', error.message);
      console.error('The API server may be unavailable. Try again later.');
      return false;

    } else if (error instanceof PdfDancerException) {
      console.error('PDFDancer error:', error.message);
      return false;

    } else {
      console.error('Unexpected error:', error);
      return false;
    }
  }
}

// Usage
const success = await processPdf('invoice.pdf', 'processed_invoice.pdf');
if (success) {
  console.log('PDF processed successfully!');
} else {
  console.log('PDF processing failed.');
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import com.tfc.pdf.pdfdancer.api.common.model.Color;
import java.io.IOException;
import java.util.List;

public class PdfProcessor {
    /**
     * Process a PDF with comprehensive error handling.
     *
     * @return true on success, false on failure
     */
    public static boolean processPdf(String inputPath, String outputPath) {
        try (PDFDancer pdf = PDFDancer.createSession(inputPath)) {
            // Find and edit paragraphs
            List<ParagraphRef> paragraphs = pdf.page(1)
                .selectParagraphsStartingWith("Invoice");

            if (!paragraphs.isEmpty()) {
                paragraphs.get(0).edit()
                    .replace("PAID")
                    .color(new Color(0, 128, 0))
                    .apply();
            }

            // Add watermark
            pdf.page(1).newParagraph()
                .text("CONFIDENTIAL")
                .font("Helvetica-Bold", 48)
                .color(new Color(200, 200, 200))
                .at(150, 400)
                .apply();

            pdf.save(outputPath);
            return true;

        } catch (ValidationException e) {
            System.err.println("Validation failed: " + e.getMessage());
            System.err.println("Check your input parameters and try again.");
            return false;

        } catch (FontNotFoundException e) {
            System.err.println("Font error: " + e.getMessage());
            System.err.println("Using fallback font...");

            // Retry with fallback font
            try (PDFDancer pdf = PDFDancer.createSession(inputPath)) {
                pdf.page(1).newParagraph()
                    .text("CONFIDENTIAL")
                    .font("Helvetica", 48)
                    .color(new Color(200, 200, 200))
                    .at(150, 400)
                    .apply();
                pdf.save(outputPath);
                return true;
            } catch (Exception retryError) {
                System.err.println("Retry failed: " + retryError.getMessage());
                return false;
            }

        } catch (SessionException e) {
            System.err.println("Session error: " + e.getMessage());
            System.err.println("Check your API token and network connection.");
            return false;

        } catch (HttpClientException e) {
            System.err.println("HTTP error: " + e.getMessage());
            System.err.println("The API server may be unavailable. Try again later.");
            return false;

        } catch (PdfDancerException e) {
            System.err.println("PDFDancer error: " + e.getMessage());
            return false;

        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            return false;
        }
    }

    // Usage
    public static void main(String[] args) {
        boolean success = processPdf("invoice.pdf", "processed_invoice.pdf");
        if (success) {
            System.out.println("PDF processed successfully!");
        } else {
            System.out.println("PDF processing failed.");
        }
    }
}
```

  </TabItem>
</Tabs>

---

## Common Error Scenarios

### Missing API Token

<Tabs>
  <TabItem value="python" label="Python">

```python
# Error: ValidationException - API token is required
# Solution: Set PDFDANCER_API_TOKEN environment variable or pass token explicitly

import os
os.environ['PDFDANCER_API_TOKEN'] = 'your-token'

# Or pass explicitly
with PDFDancer.open("doc.pdf", token="your-token") as pdf:
    pass
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// Error: ValidationException - API token is required
// Solution: Set PDFDANCER_API_TOKEN environment variable or pass token explicitly

process.env.PDFDANCER_API_TOKEN = 'your-token';

// Or pass explicitly
const pdf = await PDFDancer.open('document.pdf', 'your-token');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
// Error: ValidationException - API token is required
// Solution: Set PDFDANCER_API_TOKEN environment variable or pass token explicitly

System.setProperty("PDFDANCER_API_TOKEN", "your-token");

// Or pass explicitly
try (PDFDancer pdf = PDFDancer.createSession("doc.pdf", "your-token")) {
    // Process PDF
}
```

  </TabItem>
</Tabs>

### File Not Found

<Tabs>
  <TabItem value="python" label="Python">

```python
from pathlib import Path

pdf_path = Path("document.pdf")

if not pdf_path.exists():
    print(f"Error: File {pdf_path} not found")
else:
    with PDFDancer.open(pdf_path) as pdf:
        pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript

try {
  const pdf = await PDFDancer.open('document.pdf');
  await pdf.save('output.pdf');
} catch (error) {
  if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
    console.error('Error: File not found');
  } else {
    throw error;
  }
}
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
import java.nio.file.Files;
import java.nio.file.Path;

Path pdfPath = Path.of("document.pdf");

if (!Files.exists(pdfPath)) {
    System.err.println("Error: File " + pdfPath + " not found");
} else {
    try (PDFDancer pdf = PDFDancer.createSession(pdfPath.toString())) {
        pdf.save("output.pdf");
    }
}
```

  </TabItem>
</Tabs>

### Network Timeout

<Tabs>
  <TabItem value="python" label="Python">

```python
# Increase timeout for large PDFs or slow connections
with PDFDancer.open(
    "large-document.pdf",
    timeout=120  # 120 seconds
) as pdf:
    pdf.save("output.pdf")
```

  </TabItem>
  <TabItem value="typescript" label="TypeScript">

```typescript
// Increase timeout for large PDFs or slow connections
const pdf = await PDFDancer.open(
  'large-document.pdf',
  'your-token',
  'https://api.pdfdancer.com',
  120000  // 120 seconds in milliseconds
);

await pdf.save('output.pdf');
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
// Increase timeout for large PDFs or slow connections
try (PDFDancer pdf = PDFDancer.createSession(
    "large-document.pdf",
    null,  // Use default token
    null,  // Use default base URL
    120000  // 120 seconds in milliseconds
)) {
    pdf.save("output.pdf");
}
```

  </TabItem>
</Tabs>

---

## Next Steps

- [**Advanced**](advanced.md) – Learn advanced patterns and optimization techniques
- [**Examples**](cookbook.md) – See complete working examples with error handling
