# API v1 to API v2 Documentation Inventory — Draft

This internal inventory treats the existing API v1 documentation as an immutable source. It proposes which separate API v2 pages to create under `docs/` and how each v2 page should derive from its v1 counterpart. Nothing in this inventory authorizes edits to `versioned_docs/version-1/` or `versioned_sidebars/version-1-sidebars.json`.

API v1 remains published from the frozen versioned files. API v2 is authored independently in `docs/` and published under the v2 route.

```text
versioned_docs/version-1/<page>.md   frozen API v1 source; never edited
                  │
                  └── derive ──> docs/<page>.md   independent API v2 counterpart
```

Sources:

- API v1 sidebar: `versioned_sidebars/version-1-sidebars.json`
- API v1 content: `versioned_docs/version-1/`
- [Public-interface review summary](./generated/v2-interface-summary.md)
- [Detailed retained-symbol diff](./generated/v2-interface-diff.md)
- [Capability matrix draft](./V2_CAPABILITY_MATRIX.md)
- [Migration inventory draft](./V1_TO_V2_MIGRATION.md)

## Action Definitions

| Action | Meaning |
|---|---|
| **Derive with light changes** | Create a separate v2 page using the v1 page as its starting point. Preserve most prose, then change versions, imports, links, terminology, and affected examples only in the v2 copy. |
| **Derive and revise** | Create a separate v2 page that preserves the v1 goal and broad structure but revises multiple sections or examples. |
| **Create v2 replacement** | Create a separate v2 page for the same user goal or page ID, rebuilding most content around the v2 model. |
| **No v2 counterpart yet** | Leave the frozen v1 page available under `/v1`; do not create or publish its v2 counterpart until support or a replacement workflow is confirmed. |
| **Archive v1; optional v2 internal successor** | Leave the v1 planning artifact unchanged. Create a separate v2 internal artifact only if it remains useful. |

All actions are proposals until reviewed. Claims described as inferred require confirmation; interface changes identified from the generated diff are factual for the recorded revisions.

## Migration Principles

The selected strategy is **Option 3: selective restructuring**.

1. Never edit the frozen v1 documents or v1 sidebar.
2. Reuse a v1 page ID when its user goal has one clear v2 counterpart.
3. Split an oversized v1 page when v2 exposes distinct workflows that deserve independently navigable pages.
4. Merge v1 material when separate v1 pages cover the same v2 workflow.
5. Reorganize categories and ordering in the separate v2 sidebar when that improves the v2 workflow.
6. Keep unsupported or unconfirmed v1 capabilities available only in the v1 documentation.
7. Treat Python/TypeScript package-root promotions as import changes, not new capabilities.

## Changes Affecting Many Pages

These are cross-cutting tasks for the new v2 page copies, not edits to the versioned v1 files and not reasons to redesign the documentation:

- Replace paragraph/text-line selection and editing examples with the v2 selector/request text API where an equivalent workflow is confirmed.
- Replace removed types such as `Paragraph`, `ParagraphBuilder`, `TextLineBuilder`, `TextObjectRef`, `TextStatus`, Java paragraph/text-line references, and reflow presets.
- Update Java imports from obsolete package names to current `com.pdfdancer...` packages.
- Update Python and TypeScript package-root imports where v2 promotes existing object types.
- Use v2 page-number terminology consistently while retaining explicit warnings for any zero-based properties that remain.
- Update mutation-result explanations where v2 returns `CommandResult` or `TextEditResponse` instead of `boolean` or an edited object.
- Update exception hierarchies and retry configuration per SDK.
- Replace SDK versions and installation coordinates with the actual v2 release values before publication.

## Getting Started

| Frozen v1 source page | Proposed separate v2 counterpart | Source material to reuse | Changes in the v2 counterpart | Confidence / blocker |
|---|---|---|---|---|
| `introduction.md` | **Derive and revise** | Product positioning, supported-language overview, helpful links | Replace paragraph/text-line and “paragraph-aware” claims with the v2 selector/request editing model. Review claims about adding text and preservation. | Interface change confirmed; revised product wording requires editorial review. |
| `getting-started.md` | **Derive with light changes** | Language chooser and links to SDK-specific guides | Label the content as API v2 and point to rewritten v2 quickstarts. | High confidence. |
| `getting-started-python.md` | **Create v2 replacement** | Beginner structure, project setup, sample PDF, run/save flow | Replace `select_paragraphs_matching(...).edit().replace(...)` with `PDFDancer.text()` plus a v2 replacement request/builder. Update installation/version instructions. | v1 API removal and v2 entry point confirmed. |
| `getting-started-typescript.md` | **Create v2 replacement** | Beginner structure, TypeScript project setup, sample PDF, save flow | Replace `selectParagraphsMatching(...).edit()` with `PDFDancer.text()` and `TextReplaceRequestBuilder`. Update package version and compilation setup. | v1 API removal and v2 entry point confirmed. |
| `getting-started-java.md` | **Create v2 replacement** | Beginner structure, build setup, sample PDF, save flow | Replace `TextParagraphReference` editing with `PDFDancer.text()` and `TextReplaceRequest.Builder`. Replace obsolete Java packages and artifact version. | v1 API removal and v2 entry point confirmed. |
| `getting-started-ai.md` | **Derive and revise** | MCP installation and AI-assisted workflow explanation | Ensure prompts and claimed workflows correspond to available v2 pages. Replace paragraph/text-extraction examples that no longer have a confirmed v2 workflow. Verify MCP/version claims independently. | SDK interface inventory cannot verify MCP behavior. |
| `authentication.md` | **Derive and revise** | Token storage, explicit token, environment variables, endpoint, timeout, security guidance | Update factory signatures and add language-specific retry configuration where appropriate. Reconfirm anonymous-token and dashboard behavior as product facts. | SDK signatures confirmed; service/account claims require product review. |

## Core Concepts

| Frozen v1 source page | Proposed separate v2 counterpart | Source material to reuse | Changes in the v2 counterpart | Confidence / blocker |
|---|---|---|---|---|
| `concepts.md` | **Create v2 replacement** | PDF fundamentals, points, page sizes, coordinates, images, paths, form-field/FormXObject distinction, fonts, colors, builders, thread-safety section | Remove paragraphs and text lines as the primary public content model. Introduce v2 text selectors, request/builders, `TextEditResponse`, object/reference types, and page/document scoping. Retain only thread-safety claims confirmed for v2. | Content-model change confirmed; behavior descriptions need editorial/source review. |
| `finding-content.md` | **Create v2 replacement** | Document-versus-page scope, position/content grouping, method-summary format | Replace paragraph/text-line selectors with v2 text selectors for editing. Retain and update image, path, form, form-field, snapshot, and generic element selection. Distinguish “select for mutation” from “inspect/extract.” | v1 text selectors removed; v2 selection models confirmed. Text inspection workflow remains open. |
| `positioning.md` | **Derive and revise** | Coordinate-system explanation, PDF points, positions, bounding rectangles, common patterns | Update type names and examples. Audit every `pageIndex`/`pageNumber` statement and selection-tolerance example. | Core topic remains; indexing consistency requires careful edit. |
| `deleting-content.md` | **Derive and revise** | Page deletion, image deletion, reverse-order page deletion rationale | Rewrite paragraph/text-line deletion as `TextDeleteRequest`. Update object types and return values. Keep “deletion versus redaction” only after v2 redaction status is resolved. | Text deletion API confirmed; redaction comparison blocked. |

## Working with Content

| Frozen v1 source page | Proposed separate v2 counterpart | Source material to reuse | Changes in the v2 counterpart | Confidence / blocker |
|---|---|---|---|---|
| `extracting-text.md` | **No v2 counterpart yet** | User goal, extraction patterns, performance considerations | The page is built around removed paragraph/text-line inspection models. Publish only after a supported v2 text-extraction/inspection workflow is identified. Do not present text-edit selectors as extraction without evidence. | No replacement established from public interfaces. |
| `working-with-text.md` | **Create v2 replacement** | Page ID, broad user goal, language-tab format, links to fonts/positioning | Replace paragraph/text-line CRUD sections with select, replace, insert, delete, style, layout, image replacement, responses, and diagnostics. Decide whether the 1,800-line page should be split only after the rewrite outline is reviewed. | v2 text API confirmed. Exact workflow details come from SDK examples/tests. |
| `working-with-images.md` | **Derive and revise** | Select/add/move/delete/transform organization | Update promoted object imports, page/document entry points, transformation methods, result types, and image-builder signatures. Keep clipping coverage and link to the internal clipping evidence where useful. | Capability retained and expanded. |
| `working-with-pages.md` | **Derive and revise** | Access, iteration, delete, move, add, create-new organization | Update page clients/builders, snapshot signatures, insertion methods, page-number terminology, Java packages, and return types. | Capability retained; API details changed. |
| `working-with-fonts.md` | **Derive and revise** | Standard, custom, embedded font concepts and troubleshooting | Replace paragraph-builder examples with v2 insertion/style/replacement requests. Update registration/finding signatures and font-error handling. | Font APIs retained; text examples obsolete. |
| `working-with-templates.md` | **Create v2 replacement** | Template-filling user goal, font registration, page scope, replacement images, best practices | Replace removed template/reflow APIs with selector-based replacement only where equivalence is confirmed. Mark unmatched template behavior unsupported rather than implying parity. | Template request types removed; replacement mapping is inferred. |

## Forms & Advanced

| Frozen v1 source page | Proposed separate v2 counterpart | Source material to reuse | Changes in the v2 counterpart | Confidence / blocker |
|---|---|---|---|---|
| `working-with-acroforms.md` | **Derive and revise** | Select, fill/update, delete workflow | Update `FormFieldObject`/`FormFieldReference` names, root imports, selection methods, missing-result behavior, and mutation returns. | Capability retained; object types changed/promoted. |
| `working-with-formxobjects.md` | **Derive and revise** | Explanation of Form XObjects and selection/manipulation workflow | Use `FormObject`, `FormXObject`, or `FormXObjectReference` precisely per SDK. Update selectors and mutations. | Capability retained; cross-language names differ. |
| `working-with-vector-graphics.md` | **Derive and revise** | Vector/path fundamentals, select/create/edit, grouping, clipping, styling, lines/rectangles/Béziers, complex paths | Remove v1 snapshot/type callouts; update path objects/references, edit sessions, result types, dedicated builders, page numbering, and Java packages. Preserve one guide rather than creating pages for each convenience builder. | Capability retained and expanded. |
| `working-with-snapshots.md` | **Derive and revise** | Document/page distinction, filtering, bulk inspection, performance use cases | Update snapshot types, filtering parameters, return objects, page-number terminology, and remove v1-version selector examples. | Capability retained; signatures changed. |
| `preservation-and-pdfa.md` | **Derive with light changes** | Preservation, PDF/A, ICC, metadata, save-failure explanations | Update links and any editing examples. Reconfirm backend/product preservation claims for the v2 release; these are not established by SDK symbols. | Minimal SDK impact; backend claims need release confirmation. |
| `redaction.md` | **No v2 counterpart yet** | Security explanation and distinction from overlays | Redaction request/response types and reference-level redaction methods are removed in the selected comparison. Publish no v2 page until a replacement or explicit unsupported status is confirmed. | Interface removal confirmed; replacement open. |
| `reflow-internals.md` | **Create v2 replacement** | Conceptual explanation of fitting, layout, style preservation, failure handling, limitations | Replace `ReflowPreset` with verified `TextLayoutRequest`, mode, profile, and hyphenation behavior. Rename the page only if “reflow” is no longer the public product term. | v1 preset removed; v2 layout types confirmed; semantic mapping needs review. |
| `advanced.md` | **Create v2 replacement** | Context/resource-management, batch processing, performance structure | Replace paragraph-based batch, redaction, template, and editing workflows. Retain font and session patterns only where v2 behavior remains true. Consider moving valid recipes to the cookbook rather than preserving duplicate examples. | Most examples use removed APIs. |

## Reference

| Frozen v1 source page | Proposed separate v2 counterpart | Source material to reuse | Changes in the v2 counterpart | Confidence / blocker |
|---|---|---|---|---|
| `available-fonts.md` | **Derive with light changes** | Generated font list and conceptual explanation | Update usage examples and links. Reconfirm the service-hosted list and case-sensitivity claim at release time. | Low SDK impact; service data may change. |
| `cookbook.md` | **Create v2 replacement** | Recipe-oriented format and useful user scenarios | Audit each recipe independently. Rewrite text replacement, font replacement, report generation, and template recipes; hold redaction recipes; update forms, watermarking, page, path, and image recipes. Remove duplicates of canonical guides. | Mixed: some capabilities retained, others removed or unconfirmed. |
| `error-handling.md` | **Create v2 replacement** | Exception-taxonomy structure, failure-scenario organization, complete handling patterns | Update exception hierarchies, Java packages, rate-limit/session-not-found handling, retry configuration, `CommandResult`, `TextEditResponse`, and obsolete paragraph-builder examples. | Exception surfaces and result types changed. |
| `glossary.md` | **Derive and revise** | General PDF terminology | Remove or label v1-only paragraph/text-line/reflow terms. Add selector, text-edit request, style set/patch, layout mode/profile, diagnostic, and promoted-root terminology only if used publicly. | Terminology follows rewritten guides. |
| `sdk-versions.md` | **Create v2 replacement** | Per-language version table and update commands | Replace all v1 versions with the actual v2 release coordinates and versions. Explain that the documentation covers v2 while `/v1` remains available. | Blocked until release versions are chosen. |

## Notes

| Frozen v1 source page | Proposed separate v2 counterpart | Source material to reuse | Changes in the v2 counterpart | Confidence / blocker |
|---|---|---|---|---|
| `notes/embedded-font-warning.md` | **Derive and revise** | Warning meaning, visual verification, switching fonts, troubleshooting rationale | Update links and examples to v2 text style/replacement APIs. Confirm whether the warning text and suppression mechanism are unchanged. | Concept likely retained; emitted diagnostics need confirmation. |

## Non-Sidebar and Internal Artifacts

| Frozen v1 artifact | Proposed separate v2 action | Notes |
|---|---|---|
| `capabilities/CLEAR_CLIPPING.md` | **Archive v1; optional v2 internal successor** | Leave the v1 artifact unchanged as implementation evidence. If a separate v2 successor is created, remove obsolete text-line references and use v2 page-number terminology and object types there. Do not add either artifact directly to the public sidebar. |
| `capabilities/.gitkeep` | **No content action** | Directory placeholder only. |

## Required and Candidate New v2 Content

One new page is required by the version transition itself:

| Proposed page | Reason it cannot be handled solely by a v1 page |
|---|---|
| `migrating-from-v1.md` | Users need an explicit mapping for removed paragraph/text-line APIs, request-based text editing, package-root promotions, result-type changes, and unavailable capabilities. |

Selective restructuring also permits the following candidate pages or splits:

- A separate text-selector concepts page if the rewritten `working-with-text.md` becomes too large.
- A separate text-layout page if `reflow-internals.md` cannot serve that role without a misleading title.
- A diagnostics/reference page if `TextEditResponse` requires more detail than the text guide can carry.

Their final IDs and source-page mappings are not yet approved.

## Selected Sidebar Strategy

The v2 sidebar will be selectively restructured rather than mirroring the v1 sidebar. The constraints are:

- Reuse existing IDs for pages that retain a one-to-one purpose.
- Record the source v1 sections for every split or merged v2 page.
- Add `migrating-from-v1` after the language quickstarts.
- Do not create v2 sidebar entries for pages classified **No v2 counterpart yet** (`extracting-text` and `redaction`) until support is confirmed.
- Keep their v1 versions accessible under `/v1`.
- Keep internal `capabilities/` material excluded.

The exact v2 categories, order, splits, merges, and new IDs still require a target-sidebar proposal.

## Suggested Execution Order

1. Draft and approve the target v2 sidebar, including every reused ID, new ID, split, merge, and omitted page.
2. Add a source map from each target v2 page to the exact v1 pages or sections it derives from.
3. Copy source material only into independent files under `docs/`; never edit `versioned_docs/version-1/`.
4. Create the v2 Python, TypeScript, and Java quickstarts using the same user outcome as their v1 sources.
5. Create the approved v2 text pages, then derive their dependent concepts, deletion, fonts, templates, layout, cookbook, advanced, and error-handling content.
6. Derive the approved non-text v2 pages: authentication, positioning, images, pages, forms, vector graphics, snapshots, preservation, fonts list, glossary, and embedded-font note.
7. Draft `migrating-from-v1.md` from the reviewed migration inventory.
8. Resolve pages with no v2 counterpart before adding corresponding entries to the v2 sidebar.
9. Create the v2 `sdk-versions.md` replacement only after final release versions are known.

## Reviewer Decisions

- [x] Select **Option 3: selective restructuring**.
- [ ] Approve the target v2 sidebar and page IDs.
- [ ] Approve the split/merge source map for each restructured page.
- [ ] Confirm that no v2 counterpart for `extracting-text.md` should be created until a v2 inspection API is identified.
- [ ] Confirm that no v2 counterpart for `redaction.md` should be created unless a v2 replacement exists.
- [ ] Decide how `working-with-text.md` is split across v2 workflows.
- [ ] Decide whether `reflow-internals.md` keeps its existing page ID/title or becomes a text-layout page.
