# Product Roadmap

PDFDancer is actively developed with regular updates and new features. This roadmap provides visibility into what we're working on and what's planned for the future.

:::info
This roadmap is subject to change based on customer feedback and evolving requirements. Features may be reprioritized, added, or removed.
:::

## Currently In Development

- **PII Detection & Redaction** - Automatically detect and redact personally identifiable information using machine learning

## Next Up

These features are at the top of our development queue.

- **Smart Text Reflow** - Text reflow with automatic expansion until collision with other visible elements
- **Batch Operations** - Efficiently process multiple edits in loops for drawing grids, tables, and repetitive content

## Prioritized

- **OCR (Optical Character Recognition)** - Extract text from scanned documents and images
- **Intelligent Font Recommendations** - Automatic font matching and substitution for better rendering

## Future Enhancements

### Forms & Interactive Documents
- **XFA Support** - Full support for XML Forms Architecture used in financial and government documents
- **Enhanced Acroform Editing** - Create and modify PDF form fields programmatically
- **Digital Signatures** - Sign and verify documents with certificate-based signatures
- **Password Protected PDFs** - Support for encrypted and password-protected documents
- **Signed PDF Handling** - Graceful handling of digitally signed documents

### Content & Layout
- **Advanced Bounding Box Operations** - Spatial queries with point containment, intersection detection, and nested element selection
- **Table Extraction** - Automatically detect and extract tabular data from PDFs
- **Enhanced Content Extraction API** - Improved access to text, images, form data, and vector graphics
- **Improved Paragraph Detection** - Better handling of complex layouts and multi-column documents

### Developer Experience
- **cURL Documentation** - Raw HTTP API documentation and examples for language-agnostic integration
- **GraphQL-Style Querying** - Flexible content selection with expressive query syntax
- **PHP SDK** - Native PHP support for broader language compatibility
- **.NET SDK** - Native C# support for .NET developers
- **Document Template Store** - Cloud-based template storage with S3-compatible API

### Integrations
- **n8n Integration** - Native integration for no-code document processing workflows

## Recently Shipped

- **CID Font Support** - Extended support for CID-keyed Type 0 composite fonts
- **Templating API** - Create and fill PDF templates programmatically with dynamic data
- **Text Reflow** - Replace text and automatically reflow to fit original bounds
- **Redaction** - Permanently remove sensitive content from PDFs
- **Image Editing** - Replace, scale, rotate, crop, and adjust opacity of images
- **Find and Replace** - Search and replace text with visual or true replacement modes
- **PDF Layers** - Support for Optional Content Groups (OCGs) and layer visibility
- **Type3 Font Support** - Extended font rendering for wider PDF compatibility
- **MCP Server** - Model Context Protocol server for AI assistants, available on npm
- **SDK Example Repositories** - Real-world examples for TypeScript and Java with best practices
- **Cross-Platform Testing** - Verified compatibility across Windows, Linux, and macOS
- **Text Line Editing** - Edit, style, and delete text lines in existing PDFs
- **PathBuilder API** - Create vector paths and graphics programmatically
- **Pattern Matching** - Select text lines using regex patterns
- **Single Element Selection** - Convenience methods like `selectTextLineAt()` and `selectPathAt()`
- **Automatic Retry** - Built-in retry logic with rate limit handling across all SDKs
- **Open Source Java SDK** - Java client library on GitHub and Maven Central
- **Font Database** - Comprehensive font matching and substitution system
- **Metadata Preservation** - All PDF metadata is preserved during processing
