---
id: getting-started-typescript
title: Getting Started with TypeScript
description: Complete beginner guide to editing PDFs with PDFDancer and TypeScript.
---

# Getting Started with TypeScript

This guide walks you through editing your first PDF with PDFDancer, from scratch.

## What You'll Build

By the end of this guide, you'll have a working TypeScript script that:
- Opens a PDF file
- Finds and replaces text
- Saves the modified PDF

## Prerequisites

You need **Node.js 20 or higher** installed on your computer.

Check your Node.js version:

```bash
node --version
```

If you see `v20.x.x` or higher, you're good to go.

**Don't have Node.js?** Download it from [nodejs.org](https://nodejs.org/).

## Step 1: Create a Project Folder

Open your terminal and create a new folder for your project:

```bash
mkdir my-pdf-project
cd my-pdf-project
```

## Step 2: Initialize the Project

Initialize a new Node.js project:

```bash
npm init -y
```

## Step 3: Install PDFDancer

Install the PDFDancer SDK:

```bash
npm install pdfdancer-client-typescript
```

## Step 4: Get a Sample PDF

You need a PDF file to work with. Either:
- Use any PDF you already have
- Create a simple one with Google Docs or Word

Place your PDF in the project folder and name it `input.pdf`.

## Step 5: Write Your First Script

Create a file called `edit-pdf.ts` with this code:

```typescript
import {PDFDancer} from 'pdfdancer-client-typescript';

async function main() {
    // Open the PDF (no API token needed for anonymous access)
    const pdf = await PDFDancer.open('input.pdf');

    // Find paragraphs matching a pattern
    const page = pdf.page(1);
    const paragraphs = await page.selectParagraphsMatching('Hello');

    // Replace the text if found
    if (paragraphs[0]) {
        await paragraphs[0].edit()
            .replace('Hello World!')
            .apply();
    }

    // Save the result
    await pdf.save('output.pdf');

    console.log('Done! Check output.pdf');
}

main().catch(console.error);
```

**What this does:**
1. Opens `input.pdf`
2. Looks for any paragraph matching "Hello" on page 1
3. Replaces that paragraph's text with "Hello World!"
4. Saves the result as `output.pdf`

## Step 6: Run It

Run your script with tsx:

```bash
npx tsx edit-pdf.ts
```

You should see `Done! Check output.pdf` and find a new file called `output.pdf` in your folder.

## What's Next?

Now that you have PDFDancer working:

- [**Concepts**](concepts.md) – Understand how PDFDancer approaches PDF editing
- [**Finding Content**](finding-content.md) – Learn all the ways to select text and elements
- [**Working with Text**](working-with-text.md) – Add, edit, move, and style paragraphs
- [**Cookbook**](cookbook.md) – Common patterns and recipes
