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

Extracts `typescript` code blocks from markdown and runs `tsc --noEmit`. CI builds the exact v1 SDK revision and exposes it through `PDFDANCER_TYPESCRIPT_SDK_DIR`, so module and method errors fail validation.

### Python (`tests/test_python_docs.py`)

Uses `mktestdocs` + `pytest` to extract and syntax-check `python` code blocks. Requires:

```bash
pip install mktestdocs pytest ./external/pdfdancer-client-python
```

### Java (`scripts/test-java-docs.js`)

Extracts `java` code blocks and compiles them with `javac` against the JAR built from the exact v1 SDK revision under `external/pdfdancer-client-java`. Java 11 is required by that SDK's Gradle toolchain.

## CI Integration

Tests run automatically in `.github/workflows/deploy.yml` before build. The workflow reads all three SDK commit IDs from `versioned_docs/version-1/sdk-versions.md`, checks out those exact revisions, and fails deployment on validation errors.

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
