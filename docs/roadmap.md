# Product Roadmap

PDFDancer is actively developed with regular updates and new features. This roadmap provides visibility into what we're working on and what's planned for the future.

:::info
This roadmap is subject to change based on customer feedback and evolving requirements. Features may be reprioritized, added, or removed.
:::

## Currently In Development

- **Templating API** - Create and fill PDF templates programmatically with dynamic data

## Next Up

These features are at the top of our development queue and will be implemented in the coming weeks.

- **Batch Operations** - Efficiently process multiple edits in loops for drawing grids, tables, and repetitive content
- **cURL Documentation** - Raw HTTP API documentation and examples for language-agnostic integration
- **OCR (Optical Character Recognition)** - Extract text from scanned documents and images
- **Enhanced Text Extraction** - Better handling of complex layouts and multi-column documents
- **Type3 Font Support** - Extended font rendering for wider PDF compatibility
- **Document Template Store** - Cloud-based template storage with S3-compatible API
- **Intelligent Font Recommendations** - Automatic font matching and substitution
- **Text Reflow Support** - Automatically adjust text layout when editing content
- **Observability & Monitoring** - SDK-level metrics and tracing for production debugging

## Future Enhancements

### Forms & Interactive Documents
- **XFA Support** - Full support for XML Forms Architecture used in financial and government documents
- **Enhanced Acroform Editing** - Create and modify PDF form fields programmatically
- **Digital Signatures** - Sign and verify documents with certificate-based signatures
- **Document Encryption** - Enhanced encryption for securing sensitive PDFs

### Content & Layout
- **Advanced Bounding Box Operations** - Spatial queries with point containment, intersection detection, and nested element selection
- **Inline Image Support** - Improved image extraction and manipulation
- **Table Extraction** - Automatically detect and extract tabular data from PDFs
- **Enhanced Content Extraction API** - Improved access to text, images, form data, and vector graphics

### Developer Experience
- **GraphQL-Style Querying** - Flexible content selection with expressive query syntax
- **First-Class Template Support** - Enhanced SDK-level templating workflows
- **PHP SDK** - Native PHP support for broader language compatibility
- **.NET SDK** - Native C# support for .NET developers

### Platform & Scale
- **Workflow Automation** - Native n8n integration for no-code document processing

## Recently Shipped

- **MCP Server** - Model Context Protocol server for AI assistants, available on npm
- **SDK Example Repositories** - Real-world examples for TypeScript and Java with best practices
- **Cross-Platform Testing** - Verified compatibility across Windows, Linux, and macOS
- **Text Line Editing** - Edit, style, and delete text lines in existing PDFs
- **PathBuilder API** - Create vector paths and graphics programmatically
- **Visual Debugging** - Development helpers for troubleshooting PDF operations
- **Form Field Validation** - Type validation when setting form field values
- **Pattern Matching** - Select text lines using regex patterns
- **Page Deletion** - Remove pages from PDF documents
- **Single Element Selection** - Convenience methods like `selectTextLineAt()` and `selectPathAt()`
- **Automatic Retry** - Built-in retry logic with rate limit handling across all SDKs
- **Open Source Java SDK** - Java client library on GitHub and Maven Central
- **Font Database** - Comprehensive font matching and substitution system
