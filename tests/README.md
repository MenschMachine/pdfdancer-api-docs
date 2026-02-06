# Documentation Example Testing

Automated tests that verify code examples in the getting-started guides compile correctly.

## Running Tests

```bash
# All languages
npm run test:docs

# Individual languages
npm run test:docs:ts      # TypeScript
npm run test:docs:python  # Python
npm run test:docs:java    # Java
```

## How It Works

### TypeScript (`scripts/test-ts-docs.js`)

Extracts `typescript` code blocks from markdown and runs `tsc --noEmit` to verify syntax. Ignores module resolution errors (missing SDK at compile time) but catches real syntax errors.

### Python (`tests/test_python_docs.py`)

Uses `mktestdocs` + `pytest` to extract and syntax-check `python` code blocks. Requires:

```bash
pip install mktestdocs pytest pdfdancer-client-python
```

### Java (`scripts/test-java-docs.js`)

Extracts `java` code blocks and runs `javac` syntax check. Ignores missing dependency errors but catches syntax issues.

## CI Integration

Tests run automatically in `.github/workflows/deploy.yml` before build. Failures block deployment.

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
