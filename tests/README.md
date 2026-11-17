# Documentation Example Testing

Automated tests that verify code examples in the getting-started guides compile correctly.

## Running Tests

```bash
# API v3 examples
npm run test:docs
npm run test:docs:v3

# Individual languages
npm run test:docs:ts      # TypeScript
npm run test:docs:python  # Python
npm run test:docs:java    # Java
```

The scripts read documentation from `PDFDANCER_DOCS_DIR`, defaulting to `docs/`. CI validates the current API v3 documentation.

## How It Works

### TypeScript (`scripts/test-ts-docs.js`)

Recursively extracts authored `typescript` code blocks and compiles them together with `tsc --noEmit` against the exact npm package version declared in `sdk-pins` metadata. This catches invalid calls such as `pdf.getPage(2)` when the API exposes `pdf.page(2)`.

### Python (`tests/test_python_docs.py`)

Recursively extracts authored `python` code blocks while excluding generated API reference pages. The tests use the exact PyPI package version declared in `sdk-pins` metadata and perform syntax, import, undefined-name, and type-aware SDK method validation. Requires:

```bash
npm run test:docs:python
```

The npm command creates or reuses an isolated virtual environment under `node_modules/.cache/`, installs the version pinned by the selected documentation tree, and runs pytest through that environment.

### Java (`scripts/test-java-docs.js`)

Recursively extracts authored `java` code blocks, excluding generated API reference pages. Examples compile with `javac` against the version-pinned Java artifact and transitive dependencies resolved from Maven Central. The Java coordinates come from `docs/sdk-versions.md`.

## CI Integration

Tests run automatically in `.github/workflows/deploy.yml` before build. Python and TypeScript validation install their pinned package releases in isolated test environments; Java continues using Maven Central with version-pinned coordinates.

## Adding New Docs

To add a new file to testing:

**TypeScript**: Edit `scripts/test-ts-docs.js`:
```javascript
const FILES_TO_TEST = ['getting-started-typescript.md', 'your-new-file.md'];
```

**Python**: Create a new test file or add to `tests/test_python_docs.py`.

**Java**: Edit `scripts/test-java-docs.js`:
```javascript
const FILES_TO_TEST = ['getting-started-java.md', 'your-new-file.md'];
```

## Test Fixtures

`tests/fixtures/input.pdf` - Sample PDF containing "Hello" text, used by example code.
