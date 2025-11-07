# Product Roadmap

PDFDancer is actively developed with regular updates and new features. This roadmap provides visibility into what we're working on and what's planned for the future.

:::info
This roadmap is subject to change based on customer feedback and evolving requirements. Features may be reprioritized, added, or removed.
:::

## Currently In Development

### Enhanced SDK Convenience Methods
We're adding singular convenience methods to complement the existing batch selection methods, making it easier to work with individual elements when you need them.

**Status:** In Progress
**Availability:** Java SDK, TypeScript SDK

## Coming Soon

### Cross-Platform Testing & Examples
Comprehensive testing across Windows and Linux platforms, along with example repositories to help you get started quickly with best practices.

- Platform compatibility validation
- TypeScript example repository with common use cases
- Java example repository with common use cases

## Planned Features

### Forms & Interactive Documents

#### XFA (XML Forms Architecture) Support
Full support for XFA forms commonly used in financial services and government documents, enabling automated form filling and data extraction.

#### Enhanced Acroform Editing
Expanded capabilities for creating and modifying PDF form fields programmatically.

### Content Selection & Positioning

#### Advanced Bounding Box Operations
New spatial query methods for precise element selection:
- Point containment testing
- Element intersection detection
- Nested element queries

This enables more sophisticated layout analysis and content extraction workflows.

### Security Features

#### Digital Signatures
Complete support for signing and verifying PDF documents, including:
- Certificate-based signing
- Signature validation
- Multiple signature support

#### Document Encryption
Enhanced encryption capabilities for securing sensitive PDF documents.

### Text Recognition & Fonts

#### Optical Character Recognition (OCR)
Built-in OCR support for extracting text from scanned documents and images within PDFs.

#### Extended Font Support
- Type3 font rendering
- Improved font substitution and matching
- Automatic font issue resolution

### Developer Experience

#### Enhanced API Querying
More flexible content selection with a GraphQL-inspired query syntax for complex document queries.

#### Batch Operations
Optimize performance by batching multiple edit operations into single API calls.

#### Template Management
Store and reuse document templates with S3-compatible API access.

### Platform & Integrations

#### Workflow Automation
Native integration with popular automation platforms like n8n for building document processing workflows.

#### Global Performance
Multi-region deployment for lower latency worldwide with intelligent load balancing.

## Recently Shipped

- **API Key Management** - Improved security with viewable API keys
- **Open Source Java SDK** - Java client library available on GitHub and Maven Central
- **Font Database** - Comprehensive font matching and substitution system
