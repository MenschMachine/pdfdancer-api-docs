---
id: getting-started-python
title: Getting Started with Python
description: Complete beginner guide to editing PDFs with PDFDancer and Python.
---

# Getting Started with Python

This guide walks you through editing your first PDF with PDFDancer, from scratch.

## What You'll Build

By the end of this guide, you'll have a working Python script that:
- Opens a PDF file
- Finds and replaces text
- Saves the modified PDF

## Prerequisites

You need **Python 3.10 or higher** installed on your computer.

Check your Python version:

```bash
python --version
```

If you see `Python 3.10.x` or higher, you're good to go.

**Don't have Python?** Download it from [python.org](https://www.python.org/downloads/).

## Step 1: Create a Project Folder

Open your terminal and create a new folder for your project:

```bash
mkdir my-pdf-project
cd my-pdf-project
```

## Step 2: Install PDFDancer

Install the PDFDancer SDK:

```bash
pip install pdfdancer-client-python
```

## Step 3: Get a Sample PDF

You need a PDF file to work with. Either:
- Use any PDF you already have
- Create a simple one with Google Docs or Word

Place your PDF in the project folder and name it `input.pdf`.

## Step 4: Write Your First Script

Create a file called `edit_pdf.py` with this code:

```python
from pathlib import Path
from pdfdancer import PDFDancer

# Open the PDF (no API token needed for anonymous access)
with PDFDancer.open(pdf_data=Path("input.pdf")) as pdf:
    # Find paragraphs matching a pattern
    page = pdf.page(1)
    paragraphs = page.select_paragraphs_matching("Hello")

    # Replace the text if found
    if paragraphs:
        paragraphs[0].edit().replace("Hello World!").apply()

    # Save the result
    pdf.save("output.pdf")

print("Done! Check output.pdf")
```

**What this does:**
1. Opens `input.pdf`
2. Looks for any paragraph matching "Hello" on page 1
3. Replaces that paragraph's text with "Hello World!"
4. Saves the result as `output.pdf`

## Step 5: Run It

Run your script:

```bash
python edit_pdf.py
```

You should see `Done! Check output.pdf` and find a new file called `output.pdf` in your folder.

## What's Next?

Now that you have PDFDancer working:

- [**Concepts**](concepts.md) – Understand how PDFDancer approaches PDF editing
- [**Finding Content**](finding-content.md) – Learn all the ways to select text and elements
- [**Working with Text**](working-with-text.md) – Add, edit, move, and style paragraphs
- [**Cookbook**](cookbook.md) – Common patterns and recipes
