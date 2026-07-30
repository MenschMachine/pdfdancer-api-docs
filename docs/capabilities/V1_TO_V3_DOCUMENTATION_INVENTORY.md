# API v1 to API v3 Documentation Inventory — Draft

This internal inventory treats the existing API v1 documentation as an immutable source. It proposes which separate API v3 pages to create under `docs/` and how each v3 page should derive from its v1 counterpart. Nothing in this inventory authorizes edits to `versioned_docs/version-1/` or `versioned_sidebars/version-1-sidebars.json`.

API v1 remains published from the frozen versioned files. API v3 is authored independently in `docs/` and published under the v3 route.

```text
versioned_docs/version-1/<page>.md   frozen API v1 source; never edited
                  │
                  └── derive ──> docs/<page>.md   independent API v3 counterpart
```

Sources:

- API v1 sidebar: `versioned_sidebars/version-1-sidebars.json`
- API v1 content: `versioned_docs/version-1/`
- [Public-interface review summary](./generated/v3-interface-summary.md)
- [Detailed retained-symbol diff](./generated/v3-interface-diff.md)
- [Capability matrix draft](./V3_CAPABILITY_MATRIX.md)
- [Migration inventory draft](./V1_TO_V3_MIGRATION.md)

## Action Definitions

| Action | Meaning |
|---|---|
| **Derive with light changes** | Create a separate v3 page using the v1 page as its starting point. Preserve most prose, then change versions, imports, links, terminology, and affected examples only in the v3 copy. |
| **Derive and revise** | Create a separate v3 page that preserves the v1 goal and broad structure but revises multiple sections or examples. |
| **Create v3 replacement** | Create a separate v3 page for the same user goal or page ID, rebuilding most content around the v3 model. |
| **No v3 counterpart yet** | Leave the frozen v1 page available under `/v1`; do not create or publish its v3 counterpart until support or a replacement workflow is confirmed. |
| **Archive v1; optional v3 internal successor** | Leave the v1 planning artifact unchanged. Create a separate v3 internal artifact only if it remains useful. |

All actions are proposals until reviewed. Claims described as inferred require confirmation; interface changes identified from the generated diff are factual for the recorded revisions.

## Migration Principles

The selected strategy is **Option 3: selective restructuring**.

1. Never edit the frozen v1 documents or v1 sidebar.
2. Reuse a v1 page ID when its user goal has one clear v3 counterpart.
3. Split an oversized v1 page when v3 exposes distinct workflows that deserve independently navigable pages.
4. Merge v1 material when separate v1 pages cover the same v3 workflow.
5. Reorganize categories and ordering in the separate v3 sidebar when that improves the v3 workflow.
6. Keep unsupported or unconfirmed v1 capabilities available only in the v1 documentation.
7. Treat Python/TypeScript package-root promotions as import changes, not new capabilities.

## Changes Affecting Many Pages

These are cross-cutting tasks for the new v3 page copies, not edits to the versioned v1 files and not reasons to redesign the documentation:

- Replace paragraph/text-line selection and editing examples with the v3 selector/request text API where an equivalent workflow is confirmed.
- Replace removed types such as `Paragraph`, `ParagraphBuilder`, `TextLineBuilder`, `TextObjectRef`, `TextStatus`, Java paragraph/text-line references, and reflow presets.
- Update Java imports from obsolete package names to current `com.pdfdancer...` packages.
- Update Python and TypeScript package-root imports where v3 promotes existing object types.
- Use v3 page-number terminology consistently while retaining explicit warnings for any zero-based properties that remain.
- Update mutation-result explanations where v3 returns `CommandResult` or `TextEditResponse` instead of `boolean` or an edited object.
- Update exception hierarchies and retry configuration per SDK.
- Replace SDK versions and installation coordinates with the actual v3 release values before publication.

## Getting Started

| Frozen v1 source page | Proposed separate v3 counterpart | Source material to reuse | Changes in the v3 counterpart | Confidence / blocker |
|---|---|---|---|---|
| `introduction.md` | **Derive and revise** | Product positioning, supported-language overview, helpful links | Replace paragraph/text-line and “paragraph-aware” claims with the v3 selector/request editing model. Review claims about adding text and preservation. | Interface change confirmed; revised product wording requires editorial review. |
| `getting-started.md` | **Derive with light changes** | Language chooser and links to SDK-specific guides | Label the content as API v3 and point to rewritten v3 quickstarts. | High confidence. |
| `getting-started-python.md` | **Create v3 replacement** | Beginner structure, project setup, sample PDF, run/save flow | Replace `select_paragraphs_matching(...).edit().replace(...)` with `PDFDancer.text()` plus a v3 replacement request/builder. Update installation/version instructions. | v1 API removal and v3 entry point confirmed. |
| `getting-started-typescript.md` | **Create v3 replacement** | Beginner structure, TypeScript project setup, sample PDF, save flow | Replace `selectParagraphsMatching(...).edit()` with `PDFDancer.text()` and `TextReplaceRequestBuilder`. Update package version and compilation setup. | v1 API removal and v3 entry point confirmed. |
| `getting-started-java.md` | **Create v3 replacement** | Beginner structure, build setup, sample PDF, save flow | Replace `TextParagraphReference` editing with `PDFDancer.text()` and `TextReplaceRequest.Builder`. Replace obsolete Java packages and artifact version. | v1 API removal and v3 entry point confirmed. |
| `getting-started-ai.md` | **Derive and revise** | MCP installation and AI-assisted workflow explanation | Ensure prompts and claimed workflows correspond to available v3 pages. Replace paragraph/text-extraction examples that no longer have a confirmed v3 workflow. Verify MCP/version claims independently. | SDK interface inventory cannot verify MCP behavior. |
| `authentication.md` | **Derive and revise** | Token storage, explicit token, environment variables, endpoint, timeout, security guidance | Update factory signatures and add language-specific retry configuration where appropriate. Reconfirm anonymous-token and dashboard behavior as product facts. | SDK signatures confirmed; service/account claims require product review. |

## Core Concepts

| Frozen v1 source page | Proposed separate v3 counterpart | Source material to reuse | Changes in the v3 counterpart | Confidence / blocker |
|---|---|---|---|---|
| `concepts.md` | **Create v3 replacement** | PDF fundamentals, points, page sizes, coordinates, images, paths, form-field/FormXObject distinction, fonts, colors, builders, thread-safety section | Remove paragraphs and text lines as the primary public content model. Introduce v3 text selectors, request/builders, `TextEditResponse`, object/reference types, and page/document scoping. Retain only thread-safety claims confirmed for v3. | Content-model change confirmed; behavior descriptions need editorial/source review. |
| `finding-content.md` | **Create v3 replacement** | Document-versus-page scope, position/content grouping, method-summary format | Replace paragraph/text-line selectors with v3 text selectors for editing. Retain and update image, path, form, form-field, snapshot, and generic element selection. Distinguish “select for mutation” from reading-unit analysis. | v1 text selectors removed; v3 selection and reading-unit models confirmed. |
| `positioning.md` | **Derive and revise** | Coordinate-system explanation, PDF points, positions, bounding rectangles, common patterns | Update type names and examples. Audit every `pageIndex`/`pageNumber` statement and selection-tolerance example. | Core topic remains; indexing consistency requires careful edit. |
| `deleting-content.md` | **Derive and revise** | Page deletion, image deletion, reverse-order page deletion rationale | Rewrite paragraph/text-line deletion as `TextDeleteRequest`. Update object types and return values. Keep “deletion versus redaction” only after v3 redaction status is resolved. | Text deletion API confirmed; redaction comparison blocked. |

## Working with Content

| Frozen v1 source page | Proposed separate v3 counterpart | Source material to reuse | Changes in the v3 counterpart | Confidence / blocker |
|---|---|---|---|---|
| `extracting-text.md` | **Derive and revise as `reading-units.md`** | User goal, extraction patterns, performance considerations | Replace removed paragraph/text-line inspection models with document- and page-scoped reading-unit analysis. Document semantic roles, reading order, provenance, bounds, relationships, and limitations. Do not present text-edit selectors as extraction. | Public reading-unit interfaces are present in Python 3.0.2, TypeScript 3.0.1, and Java 3.0.1. |
| `working-with-text.md` | **Create v3 replacement** | Page ID, broad user goal, language-tab format, links to fonts/positioning | Replace paragraph/text-line CRUD sections with select, replace, insert, delete, style, layout, image replacement, responses, and diagnostics. Decide whether the 1,800-line page should be split only after the rewrite outline is reviewed. | v3 text API confirmed. Exact workflow details come from SDK examples/tests. |
| `working-with-images.md` | **Derive and revise** | Select/add/move/delete/transform organization | Update promoted object imports, page/document entry points, transformation methods, result types, and image-builder signatures. Keep clipping coverage and link to the internal clipping evidence where useful. | Capability retained and expanded. |
| `working-with-pages.md` | **Derive and revise** | Access, iteration, delete, move, add, create-new organization | Update page clients/builders, snapshot signatures, insertion methods, page-number terminology, Java packages, and return types. | Capability retained; API details changed. |
| `working-with-fonts.md` | **Derive and revise** | Standard, custom, embedded font concepts and troubleshooting | Replace paragraph-builder examples with v3 insertion/style/replacement requests. Update registration/finding signatures and font-error handling. | Font APIs retained; text examples obsolete. |
| `working-with-templates.md` | **Create v3 replacement** | Template-filling user goal, font registration, page scope, replacement images, best practices | Replace removed template/reflow APIs with selector-based replacement only where equivalence is confirmed. Mark unmatched template behavior unsupported rather than implying parity. | Template request types removed; replacement mapping is inferred. |

## Forms & Advanced

| Frozen v1 source page | Proposed separate v3 counterpart | Source material to reuse | Changes in the v3 counterpart | Confidence / blocker |
|---|---|---|---|---|
| `working-with-acroforms.md` | **Derive and revise** | Select, fill/update, delete workflow | Update `FormFieldObject`/`FormFieldReference` names, root imports, selection methods, missing-result behavior, and mutation returns. | Capability retained; object types changed/promoted. |
| `working-with-formxobjects.md` | **Derive and revise** | Explanation of Form XObjects and selection/manipulation workflow | Use `FormObject`, `FormXObject`, or `FormXObjectReference` precisely per SDK. Update selectors and mutations. | Capability retained; cross-language names differ. |
| `working-with-vector-graphics.md` | **Derive and revise** | Vector/path fundamentals, select/create/edit, grouping, clipping, styling, lines/rectangles/Béziers, complex paths | Remove v1 snapshot/type callouts; update path objects/references, edit sessions, result types, dedicated builders, page numbering, and Java packages. Preserve one guide rather than creating pages for each convenience builder. | Capability retained and expanded. |
| `working-with-snapshots.md` | **Derive and revise** | Document/page distinction, filtering, bulk inspection, performance use cases | Update snapshot types, filtering parameters, return objects, page-number terminology, and remove v1-version selector examples. | Capability retained; signatures changed. |
| `preservation-and-pdfa.md` | **Derive with light changes** | Preservation, PDF/A, ICC, metadata, save-failure explanations | Update links and any editing examples. Reconfirm backend/product preservation claims for the v3 release; these are not established by SDK symbols. | Minimal SDK impact; backend claims need release confirmation. |
| `redaction.md` | **No v3 counterpart yet** | Security explanation and distinction from overlays | Redaction request/response types and reference-level redaction methods are removed in the selected comparison. Publish no v3 page until a replacement or explicit unsupported status is confirmed. | Interface removal confirmed; replacement open. |
| `reflow-internals.md` | **Create v3 replacement** | Conceptual explanation of fitting, layout, style preservation, failure handling, limitations | Replace `ReflowPreset` with verified `TextLayoutRequest`, mode, profile, and hyphenation behavior. Rename the page only if “reflow” is no longer the public product term. | v1 preset removed; v3 layout types confirmed; semantic mapping needs review. |
| `advanced.md` | **Create v3 replacement** | Context/resource-management, batch processing, performance structure | Replace paragraph-based batch, redaction, template, and editing workflows. Retain font and session patterns only where v3 behavior remains true. Consider moving valid recipes to the cookbook rather than preserving duplicate examples. | Most examples use removed APIs. |

## Reference

| Frozen v1 source page | Proposed separate v3 counterpart | Source material to reuse | Changes in the v3 counterpart | Confidence / blocker |
|---|---|---|---|---|
| `available-fonts.md` | **Derive with light changes** | Generated font list and conceptual explanation | Update usage examples and links. Reconfirm the service-hosted list and case-sensitivity claim at release time. | Low SDK impact; service data may change. |
| `cookbook.md` | **Create v3 replacement** | Recipe-oriented format and useful user scenarios | Audit each recipe independently. Rewrite text replacement, font replacement, report generation, and template recipes; hold redaction recipes; update forms, watermarking, page, path, and image recipes. Remove duplicates of canonical guides. | Mixed: some capabilities retained, others removed or unconfirmed. |
| `error-handling.md` | **Create v3 replacement** | Exception-taxonomy structure, failure-scenario organization, complete handling patterns | Update exception hierarchies, Java packages, rate-limit/session-not-found handling, retry configuration, `CommandResult`, `TextEditResponse`, and obsolete paragraph-builder examples. | Exception surfaces and result types changed. |
| `glossary.md` | **Derive and revise** | General PDF terminology | Remove or label v1-only paragraph/text-line/reflow terms. Add selector, text-edit request, style set/patch, layout mode/profile, diagnostic, and promoted-root terminology only if used publicly. | Terminology follows rewritten guides. |
| `sdk-versions.md` | **Create v3 replacement** | Per-language version table and update commands | Replace all v1 versions with the actual v3 release coordinates and versions. Explain that the documentation covers v3 while `/v1` remains available. | Blocked until release versions are chosen. |

## Notes

| Frozen v1 source page | Proposed separate v3 counterpart | Source material to reuse | Changes in the v3 counterpart | Confidence / blocker |
|---|---|---|---|---|
| `notes/embedded-font-warning.md` | **Derive and revise** | Warning meaning, visual verification, switching fonts, troubleshooting rationale | Update links and examples to v3 text style/replacement APIs. Confirm whether the warning text and suppression mechanism are unchanged. | Concept likely retained; emitted diagnostics need confirmation. |

## Non-Sidebar and Internal Artifacts

| Frozen v1 artifact | Proposed separate v3 action | Notes |
|---|---|---|
| `capabilities/CLEAR_CLIPPING.md` | **Archive v1; optional v3 internal successor** | Leave the v1 artifact unchanged as implementation evidence. If a separate v3 successor is created, remove obsolete text-line references and use v3 page-number terminology and object types there. Do not add either artifact directly to the public sidebar. |
| `capabilities/.gitkeep` | **No content action** | Directory placeholder only. |

## Approved API v3 Information Architecture

The target sidebar is approved and implemented as a task-first structure with 29 routes. All routes contain release documentation; the earlier coming-soon placeholders for AI, Advanced Usage, Cookbook, and Glossary were replaced before release review.

The approved text split is:

| API v3 page | Source material |
|---|---|
| `working-with-text.md` | Java v3 text tutorial request lifecycle, selectors, response verification, saving, and PDF text-structure guidance |
| `editing-text.md` | Java v3 tutorial replace, insert, and delete sections plus corresponding Python and TypeScript v3 interfaces |
| `styling-text.md` | Java v3 tutorial styling and appearance-inheritance sections plus corresponding Python and TypeScript v3 interfaces |
| `text-layout.md` | Java v3 tutorial layout section and audited concepts from v1 `reflow-internals.md` |

Approved merges and omissions:

- `introduction.md` is merged into v3 `getting-started.md`.
- `deleting-content.md` is distributed across the relevant content guides.
- `reflow-internals.md` maps to v3 `text-layout.md`.
- `notes/embedded-font-warning.md` is merged into v3 `working-with-fonts.md`.
- `extracting-text.md` maps to the v3 `reading-units.md` guide.
- `redaction.md` has no v3 counterpart until a corresponding public v3 SDK interface exists.

## Required and Candidate New v3 Content

One new page is required by the version transition itself:

| Proposed page | Reason it cannot be handled solely by a v1 page |
|---|---|
| `migrating-from-v1.md` | Users need an explicit mapping for removed paragraph/text-line APIs, request-based text editing, package-root promotions, result-type changes, and unavailable capabilities. |

The three approved additional text routes are `editing-text.md`, `styling-text.md`, and `text-layout.md`. Targeting and response diagnostics remain in `working-with-text.md` rather than becoming standalone pages. Structured text extraction is documented separately in `reading-units.md`.

## Selected Sidebar Strategy

The v3 sidebar will be selectively restructured rather than mirroring the v1 sidebar. The constraints are:

- Reuse existing IDs for pages that retain a one-to-one purpose.
- Record the source v1 sections for every split or merged v3 page.
- Add `migrating-from-v1` after the language quickstarts.
- Add `reading-units` under PDF Fundamentals as the v3 extraction counterpart.
- Do not create a v3 sidebar entry for `redaction` until support is confirmed.
- Keep the v1 extraction and redaction pages accessible under `/v1`.
- Keep internal `capabilities/` material excluded.

The exact categories, ordering, merges, and page IDs are implemented in `sidebars.ts`.

## Suggested Execution Order

1. Draft and approve the target v3 sidebar, including every reused ID, new ID, split, merge, and omitted page.
2. Add a source map from each target v3 page to the exact v1 pages or sections it derives from.
3. Copy source material only into independent files under `docs/`; never edit `versioned_docs/version-1/`.
4. Create the v3 Python, TypeScript, and Java quickstarts using the same user outcome as their v1 sources.
5. Create the approved v3 text pages, then derive their dependent concepts, deletion, fonts, templates, layout, cookbook, advanced, and error-handling content.
6. Derive the approved non-text v3 pages: authentication, positioning, images, pages, forms, vector graphics, snapshots, preservation, fonts list, glossary, and embedded-font note.
7. Draft `migrating-from-v1.md` from the reviewed migration inventory.
8. Add the confirmed reading-unit extraction counterpart; resolve remaining pages with no v3 counterpart before adding their sidebar entries.
9. Create the v3 `sdk-versions.md` replacement only after final release versions are known.

## Reviewer Decisions

- [x] Select **Option 3: selective restructuring**.
- [x] Approve the target v3 sidebar and page IDs.
- [x] Approve the split/merge source map for each restructured page.
- [x] Replace `extracting-text.md` with `reading-units.md` after public v3 reading-unit interfaces were identified.
- [x] Confirm no v3 counterpart for `redaction.md` until a public v3 replacement exists.
- [x] Split text into four broader guides derived from the Java v3 tutorial.
- [x] Replace the v1 reflow page with `text-layout.md`.
