# Product Roadmap

PDFDancer is actively developed with regular updates and new features. This roadmap provides visibility into what we're working on and what's planned for the future.

:::info
This roadmap is subject to change based on customer feedback and evolving requirements. Features may be reprioritized, added, or removed.
:::

## Currently In Development

- **SDK Example Repositories** - TypeScript and Java examples with real-world scenarios and best practices
- **Cross-Platform Testing** - Ensuring consistent behavior across Windows and Linux
- **MCP Server** - Model Context Protocol server for enhanced documentation and PDF inspection

## Next Up

These features are at the top of our development queue and will be implemented in the coming weeks.

- **OCR (Optical Character Recognition)** - Extract text from scanned documents and images
- **Enhanced Text Extraction** - Better handling of complex layouts and multi-column documents
- **Type3 Font Support** - Extended font rendering for wider PDF compatibility
- **Document Template Store** - Cloud-based template storage with S3-compatible API
- **Intelligent Font Recommendations** - Automatic font matching and substitution
- **Observability & Monitoring** - Comprehensive metrics, logging, and tracing

## Future Enhancements

### Forms & Interactive Documents
- **XFA Support** - Full support for XML Forms Architecture used in financial and government documents
- **Enhanced Acroform Editing** - Create and modify PDF form fields programmatically
- **Digital Signatures** - Sign and verify documents with certificate-based signatures
- **Document Encryption** - Enhanced encryption for securing sensitive PDFs

### Content & Layout
- **Advanced Bounding Box Operations** - Spatial queries with point containment, intersection detection, and nested element selection
- **Inline Image Support** - Improved image extraction and manipulation

### Developer Experience
- **GraphQL-Style Querying** - Flexible content selection with expressive query syntax
- **Batch Operations** - Performance optimization through batched edit operations
- **First-Class Template Support** - Enhanced SDK-level templating workflows
- **PHP SDK** - Native PHP support for broader language compatibility

### Platform & Scale
- **Workflow Automation** - Native n8n integration for no-code document processing
- **Global Performance** - Multi-region deployment (US, EU, APAC) for lower latency worldwide

## Recently Shipped

- **Enhanced SDK Convenience Methods** - Singular select methods (e.g., `select_paragraph_at()`) for easier element access in Java and TypeScript SDKs
- **SDK Retry Functionality** - Built-in retry logic for resilient API interactions across all SDKs (Python, Java, TypeScript)
- **API Key Management** - Improved security with viewable API keys
- **Open Source Java SDK** - Java client library available on GitHub and Maven Central
- **Font Database** - Comprehensive font matching and substitution system
