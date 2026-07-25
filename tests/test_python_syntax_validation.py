"""Test that Python doc tests properly validate syntax."""

import pytest
from test_python_docs import _testable_code, validate_python_syntax


class TestPythonSyntaxValidation:
    """Verify that validate_python_syntax catches Python syntax errors."""

    def test_catches_missing_colon(self):
        """validate_python_syntax should catch missing colon in if statement."""
        broken_code = "if True\n    print('missing colon')"
        with pytest.raises(SyntaxError):
            validate_python_syntax(broken_code)

    def test_catches_missing_bracket(self):
        """validate_python_syntax should catch missing closing bracket."""
        broken_code = "x = [1, 2, 3\nprint(x)"
        with pytest.raises(SyntaxError):
            validate_python_syntax(broken_code)

    def test_catches_unclosed_function(self):
        """validate_python_syntax should catch unclosed function definition."""
        broken_code = "def foo(\n    return 'x'"
        with pytest.raises(SyntaxError):
            validate_python_syntax(broken_code)

    def test_catches_indentation_error(self):
        """validate_python_syntax should catch indentation errors."""
        broken_code = "def foo():\nprint('wrong indent')"
        with pytest.raises((SyntaxError, IndentationError)):
            validate_python_syntax(broken_code)

    def test_valid_code_passes(self):
        """validate_python_syntax should accept valid Python code."""
        valid_code = "x = 1\nprint(x)"
        validate_python_syntax(valid_code)  # Should not raise

    def test_catches_invalid_pdfdancer_method(self):
        """SDK receiver types should reject Java-style method names."""
        with pytest.raises(AttributeError, match="getPage"):
            validate_python_syntax(_testable_code("pdf.getPage(2)"))

    def test_accepts_valid_pdfdancer_method(self):
        """SDK receiver types should accept the documented page method."""
        validate_python_syntax(_testable_code("pdf.page(2)"))
