---
id: getting-started-python
title: Getting Started with Python
description: Install the Python SDK and complete a verified PDF text-editing workflow, including opening a document, changing text, and saving the result.
---

# Getting Started with Python

This tutorial downloads a known PDF, replaces `Hello` with `Final` on page 1, and writes the edited file to `output.pdf`. No account or API token is required. Anonymous output is watermarked.

## 1. Create a project

```bash
mkdir pdfdancer-python-demo
cd pdfdancer-python-demo
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
```

## 2. Install PDFDancer

```bash
python -m pip install pdfdancer-client-python==3.0.2
```

Python 3.10 or newer is required.

```bash
curl -L https://docs.pdfdancer.com/files/v3/pdfdancer-v3-quickstart.pdf -o input.pdf
```

## 3. Create `edit_pdf.py`

```python
from pathlib import Path
from pdfdancer import PDFDancer, TextReplaceRequest

with PDFDancer.open(pdf_data=Path("input.pdf")) as pdf:
    response = pdf.page(1).text().replace(
        TextReplaceRequest.literal("Hello", "Final").build()
    )

    if response.matched == 0:
        raise RuntimeError("The source text was not found")
    if response.errors:
        raise RuntimeError(f"The edit failed: {response.errors}")

    pdf.save("output.pdf")
```

`pdf.page(1).text()` restricts the edit to page 1. Use `pdf.text()` to search the whole document, optionally limiting the edit to specified page numbers.

## 4. Run it

```bash
python edit_pdf.py
```

The program exits without output when the edit succeeds. Open `output.pdf` and confirm that `Hello` became `Final`. If the script reports that the text was not found, see [When visible text does not match](./working-with-text#when-visible-text-does-not-match).

Next, learn about [text targeting and responses](./working-with-text) or [other content types](./concepts).
