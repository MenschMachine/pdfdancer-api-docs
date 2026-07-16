# API v2 Documentation Plan

Plan API v2 documentation from the v2 contract and user workflows, rather than mechanically rewriting every API v1 page.

## 1. Build a Capability Inventory

For each public v2 operation, record its availability, stability, and documentation priority for every SDK.

| Capability | Python | TypeScript | Java | Stable? | Documentation priority |
|---|---:|---:|---:|---:|---:|
| Open or create a document | — | — | — | — | P0 |
| Select text | — | — | — | — | P0 |
| Edit text | — | — | — | — | P0 |
| Save or export | — | — | — | — | P0 |
| Images, pages, forms, and other capabilities | — | — | — | — | P1/P2 |

Derive this inventory from the actual public SDK interfaces and tests. Do not infer cross-language parity from similar class or method names.

## 2. Define the Launch Journeys

The API v2 launch documentation should let a new user complete these tasks:

1. Install one SDK.
2. Open or create a PDF.
3. Inspect and select content.
4. Modify content using the v2 editing model.
5. Save the result.
6. Handle authentication and common failures.
7. Understand the important differences from API v1.

These journeys determine the P0 documentation. Less common capabilities can follow later.

## 3. Initial Information Architecture

```text
API v2 Preview
├── Introduction
├── What's New in API v2
├── Migrating from API v1
├── Getting Started
│   ├── Python
│   ├── TypeScript
│   └── Java
├── Core Concepts
│   ├── Document lifecycle
│   ├── Pages and coordinates
│   ├── Content selection
│   ├── References and collections
│   └── Editing and applying changes
├── Working with Content
│   ├── Extracting text
│   ├── Editing text
│   ├── Working with images
│   ├── Working with pages
│   └── Working with fonts
├── Advanced Workflows
│   ├── Templates and reflow
│   ├── Forms
│   ├── Vector graphics
│   ├── Redaction
│   └── Preservation and PDF/A
├── Cookbook
├── Error Handling
├── SDK Capability Matrix
└── SDK Versions
```

Only create a published page when its corresponding v2 capability is sufficiently stable. Keep unavailable sections in this internal plan rather than publishing empty pages.

## 4. Page Brief Template

Define the following before writing each page:

- Target reader and prerequisite knowledge.
- Concrete outcome the reader will achieve.
- Exact v2 types and methods covered.
- Python, TypeScript, and Java support status.
- Smallest complete executable example.
- Expected output.
- Important failure conditions.
- Relevant API v1 migration notes.
- Tests needed to prove the examples.

This prevents pages from becoming disconnected API method lists.

## 5. Release Waves

### Wave 1

- Introduction.
- API v1 migration overview.
- Python, TypeScript, and Java quickstarts.
- Authentication.
- Document lifecycle.
- Content selection.
- Text editing.
- Saving.
- Error handling.

### Wave 2

- Images.
- Pages.
- Fonts.
- Content extraction.
- Cookbook.
- Detailed migration mappings.

### Wave 3

- Templates.
- Reflow.
- Forms.
- Vector graphics.
- Redaction.
- PDF/A and preservation.
- Other advanced capabilities.

### Release Readiness

Remove the preview warning only when all P0 journeys work in all three SDKs or are explicitly documented as unsupported.

## 6. API v1 Migration Documentation

Treat migration as a first-class section. For each changed concept, provide an exact mapping:

| API v1 | API v2 | Behavioral difference |
|---|---|---|
| Old type or method | New type or method | Lifecycle, return type, indexing, mutation, or error changes |

Do not describe methods as renamed when their semantics also changed.

## Next Step

Extract the public v2 interfaces from the Python, TypeScript, and Java SDK branches into the capability inventory. That inventory will establish which proposed pages are factual and which remain prospective.
