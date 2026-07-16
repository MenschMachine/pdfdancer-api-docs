---
id: migrating-from-v1
title: Migrating from API v1
description: Map PDFDancer API v1 concepts and workflows to API v2.
---

# Migrating from API v1

API v2 keeps page, image, path, form, font, and snapshot workflows, but changes how you edit text. Instead of selecting an editable paragraph or text line, you specify the text to target as part of a replace, insert, delete, or style operation.

## Text migration

| API v1 | API v2 |
|---|---|
| Select a `Paragraph` or `TextLine`, then open an edit builder | Construct `TextReplaceRequest`, `TextInsertRequest`, `TextDeleteRequest`, or `TextStyleRequest` |
| `ParagraphBuilder`, `TextLineBuilder`, or Java text references | `pdf.text()` or `pdf.page(n).text()` |
| `ReflowPreset` | `TextLayoutRequest` mode and profile |
| Boolean or edited-object result | `TextEditResponse` with match/change counts and diagnostics |
| Template request objects | Individual text replacements where the workflow is equivalent |

Literal and regular-expression selectors identify text to edit. They are not a replacement for the v1 text-extraction interface.

## Documentation map

| API v1 page | API v2 destination |
|---|---|
| Introduction + Getting Started | [Getting Started](/v2/) |
| Working with Text | [Working with Text](./working-with-text), [Editing Text](./editing-text), and [Styling Text](./styling-text) |
| Deleting Content | The relevant text, page, image, path, or form guide |
| How Reflow Works | [Text Layout](./text-layout) |
| Embedded Font Warning | [Working with Fonts](./working-with-fonts) |
| Extracting Text | No public v2 SDK counterpart is currently documented |
| Redaction | No public v2 SDK counterpart is currently documented |

Python and TypeScript promote several existing object types to their package root. Treat these as import-path changes, not new capabilities. Java v2 public packages use `com.pdfdancer...` names.

Do not mix v1 examples with v2 sessions. The complete v1 documentation remains available under [/v1/](/v1/).
