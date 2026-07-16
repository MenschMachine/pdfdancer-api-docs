"""Test Python code examples in documentation."""

from pathlib import Path
import ast
import importlib.util
import os
import pytest
import mktestdocs

# Read markdown file content
REPO_ROOT = Path(__file__).parent.parent
DOCS_DIR = Path(os.environ.get("PDFDANCER_DOCS_DIR", "docs"))
if not DOCS_DIR.is_absolute():
    DOCS_DIR = REPO_ROOT / DOCS_DIR
DOC_FILES = (
    [DOCS_DIR / "getting-started-python.md"]
    if "versioned_docs" in DOCS_DIR.parts
    else sorted(DOCS_DIR.glob("*.md"))
)
DOC_BLOCKS = [
    (doc_file.name, block)
    for doc_file in DOC_FILES
    if doc_file.exists()
    for block in mktestdocs.grab_code_blocks(doc_file.read_text(), lang="python")
]

# SDK class to methods mapping (for semantic validation)
SDK_METHODS = {}

def _load_sdk_methods():
    """Load SDK class methods via introspection."""
    global SDK_METHODS
    if SDK_METHODS:
        return SDK_METHODS

    try:
        from pdfdancer import PDFDancer
        if "versioned_docs" in DOCS_DIR.parts:
            from pdfdancer.pdfdancer_v1 import PageClient, TextObjectRef
        else:
            from pdfdancer.pdfdancer_v2 import PageClient, TextClient
            TextObjectRef = TextClient

        SDK_METHODS = {
            'PDFDancer': {m for m in dir(PDFDancer) if not m.startswith('_')},
            'PageClient': {m for m in dir(PageClient) if not m.startswith('_')},
            'TextObjectRef': {m for m in dir(TextObjectRef) if not m.startswith('_')},
        }
    except ImportError:
        SDK_METHODS = {}

    return SDK_METHODS


# Known return types for SDK methods
RETURN_TYPES = {
    ('PDFDancer', 'open'): 'PDFDancer',
    ('PDFDancer', 'page'): 'PageClient',
    ('PDFDancer', 'pages'): 'PageClient',
    ('PageClient', 'select_paragraphs_matching'): 'TextObjectRef',
    ('PageClient', 'select_paragraph_matching'): 'TextObjectRef',
    ('PageClient', 'select_paragraphs'): 'TextObjectRef',
}


import builtins as _builtins_module
_PYTHON_BUILTINS = set(dir(_builtins_module))


class UndefinedNameChecker(ast.NodeVisitor):
    """Check for undefined names in code."""

    def __init__(self):
        self.defined = set()
        self.used = []  # (name, lineno)
        self.errors = []

    def visit_Import(self, node):
        for alias in node.names:
            name = alias.asname or alias.name.split('.')[0]
            self.defined.add(name)
        self.generic_visit(node)

    def visit_ImportFrom(self, node):
        for alias in node.names:
            if alias.name == "*" and node.module:
                spec = importlib.util.find_spec(node.module)
                if spec:
                    module = __import__(node.module, fromlist=["*"])
                    self.defined.update(
                        getattr(module, "__all__", ())
                        or (name for name in dir(module) if not name.startswith("_"))
                    )
            else:
                name = alias.asname or alias.name
                self.defined.add(name)
        self.generic_visit(node)

    def visit_FunctionDef(self, node):
        self.defined.add(node.name)
        # Add parameters
        for arg in node.args.args:
            self.defined.add(arg.arg)
        self.generic_visit(node)

    def visit_ClassDef(self, node):
        self.defined.add(node.name)
        self.generic_visit(node)

    def visit_Name(self, node):
        if isinstance(node.ctx, ast.Store):
            self.defined.add(node.id)
        elif isinstance(node.ctx, ast.Load):
            self.used.append((node.id, node.lineno))
        self.generic_visit(node)

    def visit_For(self, node):
        # Handle loop variable
        if isinstance(node.target, ast.Name):
            self.defined.add(node.target.id)
        self.generic_visit(node)

    def visit_With(self, node):
        # Handle 'as' variable
        for item in node.items:
            if item.optional_vars and isinstance(item.optional_vars, ast.Name):
                self.defined.add(item.optional_vars.id)
        self.generic_visit(node)

    def visit_ExceptHandler(self, node):
        if node.name:
            self.defined.add(node.name)
        self.generic_visit(node)

    def check(self):
        """Check all used names are defined."""
        for name, lineno in self.used:
            if name not in self.defined and name not in _PYTHON_BUILTINS:
                self.errors.append(f"Undefined name '{name}' at line {lineno}")


class MethodCallValidator(ast.NodeVisitor):
    """AST visitor that validates method calls against SDK classes."""

    def __init__(self, sdk_methods: dict):
        self.sdk_methods = sdk_methods
        self.errors = []
        # Track variable types: var_name -> class_name
        self.var_types = {}

    def _infer_call_type(self, call_node) -> str | None:
        """Infer the return type of a call expression."""
        if not isinstance(call_node, ast.Call):
            return None

        if isinstance(call_node.func, ast.Attribute):
            method_name = call_node.func.attr

            # Class.method() style like PDFDancer.open()
            if isinstance(call_node.func.value, ast.Name):
                obj_name = call_node.func.value.id

                # Direct class call: PDFDancer.open()
                if obj_name in self.sdk_methods:
                    return RETURN_TYPES.get((obj_name, method_name), obj_name)

                # Variable call: pdf.page()
                obj_type = self.var_types.get(obj_name)
                if obj_type:
                    return RETURN_TYPES.get((obj_type, method_name))

        return None

    def visit_ImportFrom(self, node):
        """Track imports from pdfdancer."""
        if node.module and 'pdfdancer' in node.module:
            for alias in node.names:
                name = alias.asname or alias.name
                if alias.name in self.sdk_methods:
                    self.var_types[name] = alias.name
        self.generic_visit(node)

    def visit_With(self, node):
        """Track context manager assignments (with X as y)."""
        for item in node.items:
            if item.optional_vars and isinstance(item.optional_vars, ast.Name):
                var_name = item.optional_vars.id
                inferred = self._infer_call_type(item.context_expr)
                if inferred:
                    self.var_types[var_name] = inferred
        self.generic_visit(node)

    def visit_Assign(self, node):
        """Track variable assignments to infer types."""
        if len(node.targets) == 1 and isinstance(node.targets[0], ast.Name):
            var_name = node.targets[0].id
            inferred = self._infer_call_type(node.value)
            if inferred:
                self.var_types[var_name] = inferred
        self.generic_visit(node)

    def visit_Call(self, node):
        """Check method calls against SDK class methods."""
        if isinstance(node.func, ast.Attribute):
            method_name = node.func.attr

            # Get the object being called on
            if isinstance(node.func.value, ast.Name):
                obj_name = node.func.value.id
                obj_type = self.var_types.get(obj_name)

                if obj_type and obj_type in self.sdk_methods:
                    valid_methods = self.sdk_methods[obj_type]
                    if method_name not in valid_methods:
                        # Find similar methods for suggestion
                        similar = sorted(m for m in valid_methods if m.startswith(method_name[:8]))
                        suggestion = f" Did you mean: {', '.join(similar[:3])}?" if similar else ""
                        self.errors.append(
                            f"'{obj_type}' has no method '{method_name}'.{suggestion}"
                        )

        self.generic_visit(node)


def validate_python_syntax(code: str, filename: str = "<doc>") -> None:
    """Validate Python code syntax, imports, and SDK method calls."""
    # First, compile to check syntax
    compile(code, filename, "exec")

    # Parse AST
    tree = ast.parse(code)

    # Validate imports exist
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
                module = __import__(node.module, fromlist=[alias.name for alias in node.names])
                for alias in node.names:
                    if alias.name != "*" and not hasattr(module, alias.name):
                        raise ImportError(
                            f"cannot import name '{alias.name}' from '{node.module}'"
                        )

    # Check for undefined names
    undefined_checker = UndefinedNameChecker()
    undefined_checker.visit(tree)
    undefined_checker.check()
    if undefined_checker.errors:
        raise NameError("; ".join(undefined_checker.errors))

    # Validate SDK method calls
    sdk_methods = _load_sdk_methods()
    if sdk_methods:
        validator = MethodCallValidator(sdk_methods)
        validator.visit(tree)
        if validator.errors:
            raise AttributeError("; ".join(validator.errors))


def _testable_code(code: str) -> str:
    """Supply named context for focused fragments without changing rendered examples."""
    if "versioned_docs" in DOCS_DIR.parts:
        return code
    prelude = """
from typing import Any
from pdfdancer import *

pdf: Any = None
page: Any = None
image: Any = None
path: Any = None
form: Any = None
field: Any = None
response: Any = None
input_bytes: bytes = b""
image_bytes: bytes = b""
replacement_bytes: bytes = b""
font_data: bytes = b""
request: Any = None
selected: Any = None
result: Any = None
"""
    return prelude + "\n" + code


@pytest.mark.parametrize(
    "filename,codeblock",
    DOC_BLOCKS,
)
def test_python_examples(filename, codeblock):
    """Test each Python code block from the selected documentation pages."""
    validate_python_syntax(_testable_code(codeblock), filename)
