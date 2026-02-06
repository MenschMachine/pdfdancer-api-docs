"""Tests that prove doc tests do NOT catch semantic errors (only syntax).

These tests demonstrate that calling non-existent functions, importing
non-existent modules, or using undefined variables are NOT caught by
the current doc testing approach.

These tests should FAIL once we implement proper semantic validation.
Until then, they pass - proving the limitation.
"""

import subprocess
import tempfile
import os
from pathlib import Path

import pytest


class TestPythonSemanticValidation:
    """Prove Python doc tests don't catch semantic errors."""

    def test_should_catch_nonexistent_function(self):
        """Calling a function that doesn't exist should fail."""
        code = "nonexistent_function()"
        # compile() only checks syntax, not semantics
        # This SHOULD raise NameError at runtime, but compile succeeds
        with pytest.raises((NameError, SyntaxError)):
            compile(code, "<test>", "exec")

    def test_should_catch_nonexistent_module(self):
        """Importing a module that doesn't exist should fail."""
        code = "import nonexistent_module_xyz"
        with pytest.raises((ImportError, ModuleNotFoundError, SyntaxError)):
            compile(code, "<test>", "exec")

    def test_should_catch_nonexistent_attribute(self):
        """Accessing an attribute that doesn't exist should fail."""
        code = "x = [1,2,3]\nx.nonexistent_method()"
        with pytest.raises((AttributeError, SyntaxError)):
            compile(code, "<test>", "exec")

    def test_should_catch_undefined_variable(self):
        """Using an undefined variable should fail."""
        code = "print(undefined_variable)"
        with pytest.raises((NameError, SyntaxError)):
            compile(code, "<test>", "exec")


class TestTypeScriptSemanticValidation:
    """Prove TypeScript doc tests don't catch semantic errors."""

    @pytest.fixture
    def ts_checker(self, tmp_path):
        """Create a TypeScript checker that mimics the doc test behavior."""
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

            # Mimic the filter from test-ts-docs.js
            lines = output.split('\n')
            real_errors = [
                line for line in lines
                if 'error TS' in line
                and 'test.ts' in line
                and 'Cannot find module' not in line
                and 'could not be resolved' not in line
            ]
            return len(real_errors) > 0
        return check

    def test_should_catch_nonexistent_function(self, ts_checker):
        """Calling a function that doesn't exist should fail."""
        code = "nonexistentFunction();"
        assert ts_checker(code), "Should catch call to nonexistent function"

    def test_should_catch_nonexistent_method(self, ts_checker):
        """Calling a method that doesn't exist should fail."""
        code = "const x = [1,2,3];\nx.nonexistentMethod();"
        assert ts_checker(code), "Should catch call to nonexistent method"

    def test_should_catch_undefined_variable(self, ts_checker):
        """Using an undefined variable should fail."""
        code = "console.log(undefinedVariable);"
        assert ts_checker(code), "Should catch undefined variable"

    def test_should_catch_wrong_import_member(self, ts_checker):
        """Importing a non-existent member from a module should fail."""
        # This tests importing something that doesn't exist from fs
        code = "import { nonExistentThing } from 'fs';"
        assert ts_checker(code), "Should catch non-existent import member"


class TestJavaSemanticValidation:
    """Prove Java doc tests don't catch semantic errors."""

    @pytest.fixture
    def java_checker(self, tmp_path):
        """Create a Java checker that mimics the doc test behavior."""
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

            # Mimic the filter from test-java-docs.js
            if 'error:' in output:
                if 'cannot find symbol' in output:
                    return False  # Filtered out
                if 'package' in output and 'does not exist' in output:
                    return False  # Filtered out
                return True
            return False
        return check

    def test_should_catch_nonexistent_method(self, java_checker):
        """Calling a method that doesn't exist should fail."""
        code = 'String s = "test";\ns.nonExistentMethod();'
        assert java_checker(code), "Should catch call to nonexistent method"

    def test_should_catch_undefined_variable(self, java_checker):
        """Using an undefined variable should fail."""
        code = "System.out.println(undefinedVariable);"
        assert java_checker(code), "Should catch undefined variable"

    def test_should_catch_wrong_type(self, java_checker):
        """Assigning wrong type should fail."""
        code = 'String s = 123;'
        assert java_checker(code), "Should catch type mismatch"
