---
id: reading-units
title: Structured Text and Reading Units
description: Analyze a PDF as semantic reading units with roles, reading order, source provenance, page-space bounds, and relationships.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Structured Text and Reading Units

Reading-unit analysis extracts text from the current PDF session as semantically classified blocks. A unit can represent a heading, paragraph, list, caption, page header, page footer, footnote, watermark, or another supported role.

Use document scope to analyze every page in document order. Use page scope when your application needs only one one-based page. Each call makes a fresh request and reflects the current session state, including changes made since the PDF was opened.

## Analyze a document or page

<Tabs>
<TabItem value="python" label="Python">

```python
document_analysis = pdf.analyze_reading_units()
page_analysis = pdf.page(1).analyze_reading_units()

for page in document_analysis.pages:
    for unit in page.units:
        print(unit.role, unit.text)
```

</TabItem>
<TabItem value="typescript" label="TypeScript">

```typescript
const documentAnalysis = await pdf.analyzeReadingUnits();
const pageAnalysis = await pdf.page(1).analyzeReadingUnits();

for (const page of documentAnalysis.pages) {
  for (const unit of page.units) {
    console.log(unit.role, unit.text);
  }
}
```

</TabItem>
<TabItem value="java" label="Java">

```java
ReadingUnitDocumentAnalysis documentAnalysis = pdf.analyzeReadingUnits();
ReadingUnitPageAnalysis pageAnalysis = pdf.page(1).analyzeReadingUnits();

documentAnalysis.pages().forEach(pageAnalysisResult ->
        pageAnalysisResult.units().forEach(unit ->
                System.out.println(unit.role() + ": " + unit.text())));
```

</TabItem>
</Tabs>

The page-scoped call rejects page numbers below 1. The document result contains one page analysis per page and reports the document page count.

## Read the result

Each reading unit contains:

- an opaque unit ID that is unique within the page analysis;
- a semantic role;
- text with source line breaks preserved;
- membership and one-based order in the primary reading stream;
- provenance containing the one-based page number, source-element IDs, and page-space bounds; and
- directed relationships to other units in the same page analysis.

The primary reading stream distinguishes units included in the document's logical reading order from units that remain available but are excluded from that stream. For example, a page number or watermark can remain in the response without participating in the main reading sequence.

Known relationship types include captions associated with other units and headings that act as parents. Treat unit and element IDs as analysis data, not as permanent business identifiers.

## Handle evolving classifications

The SDKs map unknown role, relationship, or mode values to an `UNKNOWN` enum member. Where the language SDK exposes a corresponding raw-value field, retain that field when logging or forwarding the result so a newer service classification is not silently discarded.

## Scope and limitations

Reading-unit analysis is structured text extraction, not text editing. Use the [text-editing APIs](./working-with-text) when you need to replace, insert, delete, or style text.

A unit classified as `TABLE` identifies a semantic text block; it does not provide a guaranteed row-and-column table model. Reading-unit analysis also does not itself perform OCR. Image-only documents require text recognition before text can participate in this analysis.

Use representative PDFs to verify that the returned units and reading order meet the requirements of your search, indexing, transformation, or downstream document workflow.

## API reference

- [Python `ReadingUnit` API reference](https://docs.pdfdancer.com/v3/reference/python/reading-unit)
- [TypeScript `ReadingUnit` API reference](https://docs.pdfdancer.com/v3/reference/typescript/reading-unit)
- [Java `ReadingUnit` API reference](https://docs.pdfdancer.com/v3/reference/java/com-pdfdancer-common-response-reading-unit)
