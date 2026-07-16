#!/usr/bin/env python3
"""Extract the runtime public interface exported by pdfdancer.__all__."""

from __future__ import annotations

import enum
import inspect
import json
import re
import sys
from typing import Any


def clean(value: str) -> str:
    value = re.sub(r"<([A-Za-z_][\w.]*) object at 0x[0-9a-fA-F]+>", r"<\1 object>", value)
    return re.sub(r"\s+", " ", value).strip()


def signature(value: Any, name: str) -> str:
    try:
        return f"{name}{clean(str(inspect.signature(value)))}"
    except (TypeError, ValueError):
        return name


def arity(value: Any) -> int | None:
    try:
        return len(inspect.signature(value).parameters)
    except (TypeError, ValueError):
        return None


def member(owner: type[Any], name: str, value: Any) -> dict[str, Any] | None:
    raw = inspect.getattr_static(owner, name)
    if isinstance(raw, property):
        annotation = None
        if raw.fget is not None:
            annotation = inspect.signature(raw.fget).return_annotation
        suffix = "" if annotation in (None, inspect.Signature.empty) else f": {clean(inspect.formatannotation(annotation))}"
        return {"id": f"property:{name}", "name": name, "kind": "property", "signature": f"{name}{suffix}"}

    is_static = isinstance(raw, staticmethod)
    is_class = isinstance(raw, classmethod)
    callable_value = raw.__func__ if is_static or is_class else value
    if inspect.isroutine(callable_value) or inspect.ismethoddescriptor(callable_value):
        result: dict[str, Any] = {
            "id": f"method:{name}",
            "name": name,
            "kind": "method",
            "signature": signature(callable_value, name),
            "static": is_static or is_class,
        }
        count = arity(callable_value)
        if count is not None:
            result["arity"] = count
        return result
    return None


def class_symbol(export_name: str, value: type[Any]) -> dict[str, Any]:
    kind = "enum" if issubclass(value, enum.Enum) else "class"
    members: list[dict[str, Any]] = []
    if kind == "enum":
        for enum_name, enum_value in value.__members__.items():
            members.append({
                "id": f"enum-value:{enum_name}",
                "name": enum_name,
                "kind": "enum-value",
                "signature": f"{enum_name} = {clean(repr(enum_value.value))}",
                "static": True,
            })

    for name, item in inspect.getmembers(value):
        if name != "__init__" and name.startswith("_"):
            continue
        declaring_module = getattr(item, "__module__", "")
        raw = inspect.getattr_static(value, name)
        if isinstance(raw, property) and raw.fget is not None:
            declaring_module = getattr(raw.fget, "__module__", "")
        if not declaring_module.startswith("pdfdancer"):
            continue
        extracted = member(value, name, item)
        if extracted is not None:
            members.append(extracted)

    return {
        "id": export_name,
        "name": export_name,
        "kind": kind,
        "signature": signature(value, export_name),
        "members": members,
    }


def extract() -> dict[str, Any]:
    import pdfdancer

    exports = getattr(pdfdancer, "__all__", None)
    if exports is None:
        raise RuntimeError("pdfdancer does not define __all__; the public export boundary is ambiguous")

    symbols: list[dict[str, Any]] = []
    for export_name in exports:
        value = getattr(pdfdancer, export_name)
        if inspect.isclass(value):
            symbols.append(class_symbol(export_name, value))
        elif inspect.isroutine(value):
            item: dict[str, Any] = {
                "id": export_name,
                "name": export_name,
                "kind": "function",
                "signature": signature(value, export_name),
                "members": [],
            }
            symbols.append(item)
        else:
            symbols.append({
                "id": export_name,
                "name": export_name,
                "kind": "value",
                "signature": f"{export_name}: {type(value).__module__}.{type(value).__qualname__}",
                "members": [],
            })
    return {"symbols": symbols}


if __name__ == "__main__":
    json.dump(extract(), sys.stdout, indent=2, sort_keys=True)
    sys.stdout.write("\n")
