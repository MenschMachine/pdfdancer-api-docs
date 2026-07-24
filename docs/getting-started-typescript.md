---
id: getting-started-typescript
title: Getting Started with TypeScript
description: Install the TypeScript SDK and perform a verified API v3 text edit.
---

# Getting Started with TypeScript

This tutorial downloads a known PDF, replaces `Hello` with `Final` on page 1, and writes the edited file to `output.pdf`. No account or API token is required. Anonymous output is watermarked.

## 1. Create a project

```bash
mkdir pdfdancer-typescript-demo
cd pdfdancer-typescript-demo
npm init -y
npm install --save-dev typescript tsx @types/node
```

## 2. Install PDFDancer

```bash
npm install pdfdancer-client-typescript@3.0.0
```

Node.js 20 or newer is required.

```bash
curl -L https://docs.pdfdancer.com/files/v3/pdfdancer-v3-quickstart.pdf -o input.pdf
```

## 3. Create `edit-pdf.ts`

```typescript
import * as fs from 'node:fs';
import {PDFDancer, TextReplaceRequest} from 'pdfdancer-client-typescript';

async function main(): Promise<void> {
  const input = new Uint8Array(fs.readFileSync('input.pdf'));
  const pdf = await PDFDancer.open(input);
  const response = await pdf.page(1).text().replace(
    TextReplaceRequest.literal('Hello', 'Final').build()
  );

  if (response.matched === 0) throw new Error('The source text was not found');
  if (response.errors?.length) throw new Error(`The edit failed: ${JSON.stringify(response.errors)}`);
  await pdf.save('output.pdf');
}

void main();
```

`pdf.page(1).text()` restricts the edit to page 1. Use `pdf.text()` to search the whole document.

## 4. Run it

```bash
npx tsx edit-pdf.ts
```

The program exits without output when the edit succeeds. Open `output.pdf` and confirm that `Hello` became `Final`. If the script reports that the text was not found, see [When visible text does not match](./working-with-text#when-visible-text-does-not-match).

Next, learn about [text targeting and responses](./working-with-text) or [other content types](./concepts).
