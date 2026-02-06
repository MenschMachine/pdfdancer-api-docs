"""Test Python code examples in documentation."""

from pathlib import Path
import pytest
import mktestdocs

# Read markdown file content
DOC_FILE = Path(__file__).parent.parent / "docs" / "getting-started-python.md"
DOC_CONTENT = DOC_FILE.read_text()


def validate_python_syntax(code: str, filename: str = "<doc>") -> None:
    """Validate Python code syntax using compile()."""
    compile(code, filename, "exec")


@pytest.mark.parametrize(
    "codeblock",
    mktestdocs.grab_code_blocks(DOC_CONTENT, lang="python"),
)
def test_python_examples(codeblock):
    """Test each Python code block from the getting started guide."""
    validate_python_syntax(codeblock, DOC_FILE.name)
