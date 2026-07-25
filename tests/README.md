# Documentation Example Testing

Automated tests that verify code examples in the getting-started guides compile correctly.

## Running Tests

```bash
# Supported API v1 examples
npm run test:docs
npm run test:docs:v1

# Individual languages; set PDFDANCER_DOCS_DIR when testing a versioned tree
npm run test:docs:ts      # TypeScript
npm run test:docs:python  # Python
npm run test:docs:java    # Java
```

The scripts read documentation from `PDFDANCER_DOCS_DIR`, defaulting to `docs/`. CI sets it to `versioned_docs/version-1` for v1.

## How It Works

### TypeScript (`scripts/test-ts-docs.js`)

Recursively extracts authored v3 `typescript` code blocks, or the v1 getting-started page, and compiles them together with `tsc --noEmit` against the exact npm package version declared in the selected tree's `sdk-pins` metadata. This catches invalid calls such as `pdf.getPage(2)` when the API exposes `pdf.page(2)`.

### Python (`tests/test_python_docs.py`)

For v3, recursively extracts authored `python` code blocks while excluding generated API reference pages. For v1, it validates the getting-started Python page. The tests use the exact PyPI package version declared in the selected tree's `sdk-pins` metadata and perform syntax, import, undefined-name, and type-aware SDK method validation. Requires:

```bash
npm run test:docs:python
```

The npm command creates or reuses an isolated virtual environment under `node_modules/.cache/`, installs the version pinned by the selected documentation tree, and runs pytest through that environment.

### Java (`scripts/test-java-docs.js`)

For v3, recursively extracts authored `java` code blocks, excluding generated API reference pages. For v1, it validates the published getting-started Java page only. Examples compile with `javac` against the version-pinned Java artifact and transitive dependencies resolved from Maven Central. The Java coordinates come from the selected tree's `sdk-versions.md` metadata block.

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
