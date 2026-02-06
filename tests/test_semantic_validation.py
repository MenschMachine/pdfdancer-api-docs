"""Tests that verify doc tests catch semantic errors.

These tests demonstrate that calling non-existent functions, importing
non-existent modules, or using undefined variables ARE caught by
the doc testing approach:
- Python: AST-based import validation + SDK method introspection
- TypeScript: Full type checking (catches all semantic errors)
- Java: Full compilation (catches all semantic errors)
"""

import subprocess
import ast
import importlib.util
from pathlib import Path

import pytest


class TestPythonSemanticValidation:
    """Verify Python doc tests catch import and SDK method errors."""

    def validate_imports(self, code: str) -> None:
        """Validate Python imports using AST analysis."""
        compile(code, "<test>", "exec")
        tree = ast.parse(code)

        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    module_name = alias.name.split('.')[0]
                    if importlib.util.find_spec(module_name) is None:
                        raise ModuleNotFoundError(f"No module named '{module_name}'")
            elif isinstance(node, ast.ImportFrom):
                if node.module:
                    module_name = node.module.split('.')[0]
                    if importlib.util.find_spec(module_name) is None:
                        raise ModuleNotFoundError(f"No module named '{module_name}'")

    def test_catches_nonexistent_module(self):
        """Importing a module that doesn't exist raises ModuleNotFoundError."""
        code = "import nonexistent_module_xyz"
        with pytest.raises(ModuleNotFoundError):
            self.validate_imports(code)

    def test_catches_nonexistent_from_import(self):
        """Importing from a nonexistent module raises ModuleNotFoundError."""
        code = "from nonexistent_module_xyz import something"
        with pytest.raises(ModuleNotFoundError):
            self.validate_imports(code)

    def test_valid_import_passes(self):
        """Valid imports pass without error."""
        code = "from pathlib import Path\nimport os"
        self.validate_imports(code)  # Should not raise

    def test_sdk_method_validation(self):
        """SDK method typos are caught via introspection."""
        # This test validates the approach used in test_python_docs.py
        try:
            from pdfdancer import PDFDancer
            from pdfdancer.pdfdancer_v1 import PageClient
        except ImportError:
            pytest.skip("pdfdancer SDK not installed")

        sdk_methods = {
            'PDFDancer': {m for m in dir(PDFDancer) if not m.startswith('_')},
            'PageClient': {m for m in dir(PageClient) if not m.startswith('_')},
        }

        # Valid method should exist
        assert 'select_paragraphs_matching' in sdk_methods['PageClient']

        # Typo should not exist
        assert 'select_paragraphs_matchin' not in sdk_methods['PageClient']


class TestTypeScriptSemanticValidation:
    """Verify TypeScript doc tests catch semantic errors."""

    @pytest.fixture
    def ts_checker(self, tmp_path):
        """Create a TypeScript checker that mimics the updated doc test behavior."""
        def check(code: str) -> bool:
            """Returns True if error is caught, False if it passes."""
            ts_file = tmp_path / "test.ts"
            ts_file.write_text(code)

            tsconfig = tmp_path / "tsconfig.json"
            tsconfig.write_text('''{
                "compilerOptions": {
                    "target": "ES2020",
                    "module": "commonjs",
                    "moduleResolution": "node",
                    "esModuleInterop": true,
                    "strict": false,
                    "skipLibCheck": true,
                    "noEmit": true
                }
            }''')

            result = subprocess.run(
                ["npx", "tsc", "--noEmit", str(ts_file)],
                cwd=tmp_path,
                capture_output=True,
                text=True
            )
            output = result.stdout + result.stderr

            # No filters - all errors are caught
            lines = output.split('\n')
            real_errors = [
                line for line in lines
                if 'error TS' in line
                and 'test.ts' in line
            ]
            return len(real_errors) > 0
        return check

    def test_catches_nonexistent_function(self, ts_checker):
        """Calling a function that doesn't exist is caught."""
        code = "nonexistentFunction();"
        assert ts_checker(code), "Should catch call to nonexistent function"

    def test_catches_nonexistent_method(self, ts_checker):
        """Calling a method that doesn't exist is caught."""
        code = "const x = [1,2,3];\nx.nonexistentMethod();"
        assert ts_checker(code), "Should catch call to nonexistent method"

    def test_catches_undefined_variable(self, ts_checker):
        """Using an undefined variable is caught."""
        code = "console.log(undefinedVariable);"
        assert ts_checker(code), "Should catch undefined variable"

    def test_catches_wrong_import_member(self, ts_checker):
        """Importing a non-existent member from a module is caught."""
        code = "import { nonExistentThing } from 'fs';"
        assert ts_checker(code), "Should catch non-existent import member"


class TestJavaSemanticValidation:
    """Verify Java doc tests catch semantic errors."""

    @pytest.fixture
    def java_checker(self, tmp_path):
        """Create a Java checker that mimics the updated doc test behavior."""
        def check(code: str) -> bool:
            """Returns True if error is caught, False if it passes."""
            java_file = tmp_path / "Test.java"

            # Wrap in class if needed (like the doc test does)
            if 'class ' not in code:
                code = f'''
public class Test {{
    public void example() throws Exception {{
        {code}
    }}
}}
'''
            java_file.write_text(code)

            result = subprocess.run(
                ["javac", "-Xlint:none", str(java_file)],
                cwd=tmp_path,
                capture_output=True,
                text=True
            )
            output = result.stdout + result.stderr

            # No filters - all errors are caught
            return 'error:' in output
        return check

    def test_catches_nonexistent_method(self, java_checker):
        """Calling a method that doesn't exist is caught."""
        code = 'String s = "test";\ns.nonExistentMethod();'
        assert java_checker(code), "Should catch call to nonexistent method"

    def test_catches_undefined_variable(self, java_checker):
        """Using an undefined variable is caught."""
        code = "System.out.println(undefinedVariable);"
        assert java_checker(code), "Should catch undefined variable"

    def test_catches_wrong_type(self, java_checker):
        """Assigning wrong type is caught."""
        code = 'String s = 123;'
        assert java_checker(code), "Should catch type mismatch"
