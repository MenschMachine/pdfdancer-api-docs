"""Validate Python examples in the authored documentation."""

from __future__ import annotations

import ast
import builtins as _builtins_module
import importlib
import importlib.metadata
import importlib.util
import inspect
import json
import os
import re
import typing
from pathlib import Path
from types import ModuleType
from typing import Any

import mktestdocs
import pytest


REPO_ROOT = Path(__file__).parent.parent
DOCS_DIR = Path(os.environ.get("PDFDANCER_DOCS_DIR", "docs"))
if not DOCS_DIR.is_absolute():
    DOCS_DIR = REPO_ROOT / DOCS_DIR
IS_V1 = "versioned_docs" in DOCS_DIR.parts
METADATA_FILE = DOCS_DIR / "sdk-versions.md"


def _read_sdk_metadata() -> dict[str, Any]:
    content = METADATA_FILE.read_text()
    match = re.search(r"<!--\s*sdk-pins\s*\n([\s\S]*?)\n\s*-->", content)
    if not match:
        raise RuntimeError(f"SDK metadata block not found in {METADATA_FILE}")
    try:
        return json.loads(match.group(1))
    except json.JSONDecodeError as error:
        raise RuntimeError(f"Invalid SDK metadata in {METADATA_FILE}: {error}") from error


SDK_METADATA = _read_sdk_metadata()
EXPECTED_SDK_VERSION = SDK_METADATA["python"]["version"]


def _is_generated_or_reference(path: Path) -> bool:
    return bool({"reference", "generated"}.intersection(path.relative_to(DOCS_DIR).parts))


if IS_V1:
    DOC_FILES = [DOCS_DIR / "getting-started-python.md"]
else:
    DOC_FILES = sorted(
        path
        for path in DOCS_DIR.rglob("*.md")
        if not _is_generated_or_reference(path)
    )


DOC_BLOCKS = [
    (
        str(doc_file.relative_to(REPO_ROOT)),
        block,
    )
    for doc_file in DOC_FILES
    if doc_file.exists()
    for block in mktestdocs.grab_code_blocks(
        re.sub(
            r"<!--\s*docs-test:\s*ignore\s*-->\s*```python[ \t]*\r?\n[\s\S]*?```",
            "",
            doc_file.read_text(),
        ),
        lang="python",
    )
]


ANY_TYPE = object()
UNKNOWN_TYPE = object()
TYPING_SELF = getattr(typing, "Self", object())
SDK_CLASSES: dict[str, type] = {}
METHODS_BY_TYPE: dict[object, set[str]] = {}
RETURN_TYPES: dict[tuple[type, str], object] = {}
SDK_ENVIRONMENT_LOADED = False


def _public_members(value: object) -> set[str]:
    return {name for name in dir(value) if not name.startswith("_")}


def _register_type(name: str, value: object) -> None:
    if inspect.isclass(value):
        SDK_CLASSES[name] = value
        METHODS_BY_TYPE[value] = _public_members(value)


def _set_return_type(class_name: str, method_names: tuple[str, ...], return_name: str) -> None:
    receiver = SDK_CLASSES.get(class_name)
    returned = SDK_CLASSES.get(return_name)
    if receiver is None or returned is None:
        return
    for method_name in method_names:
        RETURN_TYPES[(receiver, method_name)] = returned


def _load_sdk_environment() -> None:
    """Load the installed PyPI SDK and build a runtime method/type registry."""
    global SDK_ENVIRONMENT_LOADED
    if SDK_ENVIRONMENT_LOADED:
        return

    try:
        installed_version = importlib.metadata.version("pdfdancer-client-python")
    except importlib.metadata.PackageNotFoundError as error:
        raise RuntimeError(
            "pdfdancer-client-python is not installed; install the version from sdk-versions.md"
        ) from error

    if installed_version != EXPECTED_SDK_VERSION:
        raise RuntimeError(
            f"Installed pdfdancer-client-python {installed_version} does not match "
            f"documented version {EXPECTED_SDK_VERSION}"
        )

    try:
        pdfdancer = importlib.import_module("pdfdancer")
        _register_type("PDFDancer", getattr(pdfdancer, "PDFDancer"))

        if IS_V1:
            sdk_module = importlib.import_module("pdfdancer.pdfdancer_v1")
            for name in ("PageClient", "TextObjectRef"):
                _register_type(name, getattr(sdk_module, name))
        else:
            sdk_module = importlib.import_module("pdfdancer.pdfdancer_v2")
            for name in ("PageClient", "TextClient"):
                _register_type(name, getattr(sdk_module, name))

        # Register public package classes so imported request builders and models
        # are checked as well as the core client classes.
        for name in getattr(pdfdancer, "__all__", ()):
            value = getattr(pdfdancer, name, None)
            _register_type(name, value)

        type_modules = ["pdfdancer.types"]
        if not IS_V1:
            type_modules.append("pdfdancer.text_editing")
        for module_name in type_modules:
            module = importlib.import_module(module_name)
            for name in dir(module):
                if not name.startswith("_"):
                    _register_type(name, getattr(module, name))

        builder_modules = {
            "pdfdancer.page_builder": ("PageBuilder",),
            "pdfdancer.image_builder": ("ImageBuilder", "ImageOnPageBuilder"),
            "pdfdancer.path_builder": ("PathBuilder", "LineBuilder", "BezierBuilder", "RectangleBuilder"),
        }
        for module_name, names in builder_modules.items():
            try:
                module = importlib.import_module(module_name)
            except ModuleNotFoundError:
                # Builder modules are version-specific; the core API imports
                # above remain mandatory for the selected package version.
                continue
            for name in names:
                _register_type(name, getattr(module, name, None))

    except (ImportError, AttributeError) as error:
        raise RuntimeError(
            f"Could not load the documented SDK API from pdfdancer-client-python {installed_version}"
        ) from error

    # Explicit return mappings cover the fluent API methods used by fragments.
    _set_return_type("PDFDancer", ("open", "new"), "PDFDancer")
    _set_return_type("PDFDancer", ("page",), "PageClient")
    _set_return_type("PDFDancer", ("text",), "TextClient")
    _set_return_type("PDFDancer", ("new_page",), "PageBuilder")
    _set_return_type("PDFDancer", ("new_image",), "ImageBuilder")
    _set_return_type("PDFDancer", ("new_path",), "PathBuilder")
    _set_return_type("PDFDancer", ("new_line",), "LineBuilder")
    _set_return_type("PDFDancer", ("new_bezier",), "BezierBuilder")
    _set_return_type("PDFDancer", ("new_rectangle",), "RectangleBuilder")
    _set_return_type("PageClient", ("text",), "TextClient")
    _set_return_type("PageClient", ("new_image",), "ImageOnPageBuilder")
    _set_return_type("PageClient", ("new_path",), "PathBuilder")
    _set_return_type("PageClient", ("new_line",), "LineBuilder")
    _set_return_type("PageClient", ("new_bezier",), "BezierBuilder")
    _set_return_type("PageClient", ("new_rectangle",), "RectangleBuilder")
    _set_return_type("PageClient", ("select_image_at", "select_image"), "ImageObject")
    _set_return_type("PageClient", ("select_form_at", "select_form"), "FormObject")
    _set_return_type(
        "PageClient",
        ("select_form_field_at", "select_form_field_by_name"),
        "FormFieldObject",
    )
    _set_return_type("PageClient", ("select_path_at", "select_path"), "PathObject")

    SDK_ENVIRONMENT_LOADED = True


def _resolve_import(module_name: str, name: str) -> object:
    module = importlib.import_module(module_name)
    return getattr(module, name)


def _return_type_for(receiver_type: object, method_name: str) -> object:
    if not inspect.isclass(receiver_type):
        return UNKNOWN_TYPE
    method = getattr(receiver_type, method_name, None)
    if method is not None:
        try:
            return_annotation = typing.get_type_hints(method).get("return")
        except (NameError, TypeError, ValueError):
            return_annotation = getattr(method, "__annotations__", {}).get("return")

        if return_annotation is TYPING_SELF or return_annotation is receiver_type:
            return receiver_type
        if inspect.isclass(return_annotation) and return_annotation in METHODS_BY_TYPE:
            return return_annotation
        if isinstance(return_annotation, str):
            name = return_annotation.strip("'\"").rsplit(".", 1)[-1]
            return SDK_CLASSES.get(name, UNKNOWN_TYPE)

        # Optional[T] can still provide a useful receiver type for a
        # subsequent call after the example's explicit None check.
        origin = typing.get_origin(return_annotation)
        if origin in (typing.Union, getattr(typing, "Union", None)):
            candidates = [
                argument
                for argument in typing.get_args(return_annotation)
                if inspect.isclass(argument) and argument in METHODS_BY_TYPE
            ]
            if len(candidates) == 1:
                return candidates[0]
        if origin in (list, tuple, set):
            candidates = [
                argument
                for argument in typing.get_args(return_annotation)
                if inspect.isclass(argument) and argument in METHODS_BY_TYPE
            ]
            if len(candidates) == 1:
                return ("collection", candidates[0])

    return RETURN_TYPES.get((receiver_type, method_name), UNKNOWN_TYPE)


class UndefinedNameChecker(ast.NodeVisitor):
    """Check for undefined names in a focused documentation fragment."""

    def __init__(self):
        self.defined = set()
        self.used = []
        self.errors = []

    def visit_Import(self, node):
        for alias in node.names:
            name = alias.asname or alias.name.split(".")[0]
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
                self.defined.add(alias.asname or alias.name)
        self.generic_visit(node)

    def visit_FunctionDef(self, node):
        self.defined.add(node.name)
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
        if isinstance(node.target, ast.Name):
            self.defined.add(node.target.id)
        self.generic_visit(node)

    def visit_With(self, node):
        for item in node.items:
            if item.optional_vars and isinstance(item.optional_vars, ast.Name):
                self.defined.add(item.optional_vars.id)
        self.generic_visit(node)

    def visit_ExceptHandler(self, node):
        if node.name:
            self.defined.add(node.name)
        self.generic_visit(node)

    def check(self):
        for name, lineno in self.used:
            if name not in self.defined and name not in set(dir(_builtins_module)):
                self.errors.append(f"Undefined name '{name}' at line {lineno}")


class MethodCallValidator(ast.NodeVisitor):
    """Validate calls using types discovered from the installed SDK and imports."""

    def __init__(self):
        _load_sdk_environment()
        self.symbol_types: dict[str, object] = {
            "pdf": SDK_CLASSES.get("PDFDancer", UNKNOWN_TYPE),
            "page": SDK_CLASSES.get("PageClient", UNKNOWN_TYPE),
            "image": SDK_CLASSES.get("ImageObject", ANY_TYPE),
            "path": SDK_CLASSES.get("PathObject", ANY_TYPE),
            "form": SDK_CLASSES.get("FormObject", ANY_TYPE),
            "field": SDK_CLASSES.get("FormFieldObject", ANY_TYPE),
            "response": SDK_CLASSES.get("TextEditResponse", ANY_TYPE),
            "request": ANY_TYPE,
            "selected": ANY_TYPE,
            "result": ANY_TYPE,
        }
        self.errors: list[str] = []

    def _register_import(self, name: str, value: object) -> None:
        self.symbol_types[name] = value if value is not None else UNKNOWN_TYPE
        if inspect.isclass(value):
            _register_type(name, value)

    def _infer_expr_type(self, node: ast.AST) -> object:
        if isinstance(node, ast.Name):
            return self.symbol_types.get(node.id, UNKNOWN_TYPE)
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name):
                constructor = self.symbol_types.get(node.func.id, UNKNOWN_TYPE)
                if inspect.isclass(constructor):
                    return constructor
            if isinstance(node.func, ast.Attribute):
                receiver = self._infer_expr_type(node.func.value)
                return _return_type_for(receiver, node.func.attr)
            return UNKNOWN_TYPE
        if isinstance(node, ast.Attribute):
            receiver = self._infer_expr_type(node.value)
            if isinstance(receiver, ModuleType):
                return getattr(receiver, node.attr, UNKNOWN_TYPE)
            if inspect.isclass(receiver):
                return getattr(receiver, node.attr, UNKNOWN_TYPE)
            return UNKNOWN_TYPE
        if isinstance(node, ast.Subscript):
            collection = self._infer_expr_type(node.value)
            if isinstance(collection, tuple) and collection[0] == "collection":
                return collection[1]
            return UNKNOWN_TYPE
        return UNKNOWN_TYPE

    def visit_Import(self, node):
        for alias in node.names:
            name = alias.asname or alias.name.split(".")[0]
            try:
                self._register_import(name, importlib.import_module(alias.name))
            except ImportError:
                self._register_import(name, UNKNOWN_TYPE)
        self.generic_visit(node)

    def visit_ImportFrom(self, node):
        if node.module:
            for alias in node.names:
                if alias.name == "*":
                    try:
                        module = importlib.import_module(node.module)
                        for name in getattr(module, "__all__", ()):
                            self._register_import(name, getattr(module, name))
                    except ImportError:
                        pass
                else:
                    name = alias.asname or alias.name
                    try:
                        self._register_import(name, _resolve_import(node.module, alias.name))
                    except (ImportError, AttributeError):
                        self._register_import(name, UNKNOWN_TYPE)
        self.generic_visit(node)

    def visit_AnnAssign(self, node):
        if isinstance(node.target, ast.Name):
            annotation = node.annotation
            if isinstance(annotation, ast.Name) and annotation.id == "Any":
                if node.target.id not in self.symbol_types:
                    self.symbol_types[node.target.id] = ANY_TYPE
            else:
                self.symbol_types[node.target.id] = self._annotation_type(annotation)
        self.generic_visit(node)

    def _annotation_type(self, annotation: ast.AST) -> object:
        if isinstance(annotation, ast.Name):
            return SDK_CLASSES.get(annotation.id, self.symbol_types.get(annotation.id, UNKNOWN_TYPE))
        return UNKNOWN_TYPE

    def visit_Assign(self, node):
        inferred = self._infer_expr_type(node.value)
        for target in node.targets:
            if isinstance(target, ast.Name):
                self.symbol_types[target.id] = inferred
        self.generic_visit(node)

    def visit_With(self, node):
        for item in node.items:
            if isinstance(item.optional_vars, ast.Name):
                self.symbol_types[item.optional_vars.id] = self._infer_expr_type(item.context_expr)
        self.generic_visit(node)

    def visit_For(self, node):
        if isinstance(node.target, ast.Name):
            self.symbol_types[node.target.id] = ANY_TYPE
        self.generic_visit(node)

    def visit_Call(self, node):
        if isinstance(node.func, ast.Attribute):
            receiver = self._infer_expr_type(node.func.value)
            method_name = node.func.attr
            if receiver is not ANY_TYPE:
                if receiver is UNKNOWN_TYPE:
                    self.errors.append(
                        f"Unresolved receiver for '.{method_name}()' at line {node.lineno}"
                    )
                elif isinstance(receiver, ModuleType):
                    if not hasattr(receiver, method_name):
                        self.errors.append(
                            f"Module '{receiver.__name__}' has no member '{method_name}' at line {node.lineno}"
                        )
                elif inspect.isclass(receiver):
                    valid_methods = METHODS_BY_TYPE.get(receiver, _public_members(receiver))
                    if method_name not in valid_methods:
                        similar = sorted(m for m in valid_methods if m.startswith(method_name[:8]))
                        suggestion = f" Did you mean: {', '.join(similar[:3])}?" if similar else ""
                        self.errors.append(
                            f"'{receiver.__name__}' has no method '{method_name}' at line {node.lineno}.{suggestion}"
                        )
        self.generic_visit(node)


def validate_python_syntax(code: str, filename: str = "<doc>") -> None:
    """Validate syntax, imports, names, and SDK method calls."""
    compile(code, filename, "exec")
    tree = ast.parse(code)

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                module_name = alias.name.split(".")[0]
                if importlib.util.find_spec(module_name) is None:
                    raise ModuleNotFoundError(f"No module named '{module_name}'")
        elif isinstance(node, ast.ImportFrom) and node.module:
            module_name = node.module.split(".")[0]
            if importlib.util.find_spec(module_name) is None:
                raise ModuleNotFoundError(f"No module named '{module_name}'")
            module = __import__(node.module, fromlist=[alias.name for alias in node.names])
            for alias in node.names:
                if alias.name != "*" and not hasattr(module, alias.name):
                    raise ImportError(f"cannot import name '{alias.name}' from '{node.module}'")

    undefined_checker = UndefinedNameChecker()
    undefined_checker.visit(tree)
    undefined_checker.check()
    if undefined_checker.errors:
        raise NameError("; ".join(undefined_checker.errors))

    validator = MethodCallValidator()
    validator.visit(tree)
    if validator.errors:
        raise AttributeError("; ".join(validator.errors))


def _testable_code(code: str) -> str:
    """Supply named context for focused fragments without changing examples."""
    return """
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
""" + "\n" + code


@pytest.mark.parametrize("filename,codeblock", DOC_BLOCKS)
def test_python_examples(filename, codeblock):
    """Test each Python code block from the selected documentation pages."""
    validate_python_syntax(_testable_code(codeblock), filename)
