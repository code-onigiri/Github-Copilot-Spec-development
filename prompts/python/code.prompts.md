# Python Best Practices

This prompt provides guidance for writing clean, maintainable, and efficient Python code (3.10+).

## Core Principles

### Readability and Simplicity

- Prefer explicit over implicit (Zen of Python)
- Keep functions small and focused
- Avoid clever one-liners if they harm readability

```python
def chunk(iterable, size):
    for i in range(0, len(iterable), size):
        yield iterable[i:i+size]
```

### Type Hints and Static Analysis

- Use type hints for public APIs
- Run type checkers (mypy/pyright) in CI
- Prefer `TypedDict`/`dataclasses` for structured data

```python
from dataclasses import dataclass
from typing import Iterable

@dataclass(frozen=True)
class User:
    id: str
    name: str

def find_names(users: Iterable[User]) -> list[str]:
    return [u.name for u in users]
```

### Robust Error Handling

- Raise specific exceptions with clear messages
- Use context managers for resources
- Don't catch broad `Exception` unless re-raising or logging

```python
from contextlib import suppress

with open(path) as f:
    data = f.read()

with suppress(FileNotFoundError):
    os.remove(temp_file)
```

### Functional and Iterators

- Prefer comprehensions and generator expressions
- Avoid building large intermediate lists unnecessarily

```python
total = sum(x for x in numbers if x % 2 == 0)
```

### Concurrency

- Use `asyncio` for IO-bound tasks
- Use multiprocessing for CPU-bound workloads

```python
import asyncio

async def fetch(client, url):
    async with client.get(url) as resp:
        return await resp.text()
```

## Code Organization

### Project Structure

```
project/
  src/
    package_name/
      __init__.py
      module.py
  tests/
  pyproject.toml
```

### Module Design

- Keep `__init__.py` light; expose minimal public API
- Avoid circular imports; refactor shared code to utilities

## Language-Specific Patterns

### Context Managers

```python
from contextlib import contextmanager

@contextmanager
def db_session(engine):
    conn = engine.connect()
    try:
        yield conn
    finally:
        conn.close()
```

### Dataclass for Value Objects

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Money:
    amount: int
    currency: str = "JPY"
```

## Error Handling

### Guard Clauses

```python
def transfer(src, dst, amount):
    if amount <= 0:
        raise ValueError("amount must be positive")
    # ...
```

## Testing

- Use `pytest` with fixtures and parametrization
- Name tests `test_*.py`, functions `test_*`

```python
import pytest

@pytest.mark.parametrize("a,b,ans", [(1,1,2),(2,3,5)])
def test_add(a,b,ans):
    assert add(a,b) == ans
```

## Performance Optimization

### Tips

- Prefer built-ins (`sum`, `min`, `max`) and itertools
- Use `lru_cache` for pure functions
- Profile before optimizing (`cProfile`, `line_profiler`)

```python
from functools import lru_cache

@lru_cache(maxsize=1024)
def fib(n: int) -> int:
    return n if n < 2 else fib(n-1) + fib(n-2)
```

## Common Patterns

### Dependency Injection via Parameters

```python
def service(repo: "UserRepo"):
    # pass dependencies explicitly
    ...
```

## Common Pitfalls to Avoid

### Anti-Patterns

- ❌ Mutable default arguments: `def f(x, y=[])`
- ❌ Bare `except:`
- ❌ Wildcard imports `from x import *`
- ❌ Global mutable state

### Best Practices

- ✅ Use `None` and create defaults inside
- ✅ Specific exceptions
- ✅ Explicit imports
- ✅ Immutable dataclasses where possible

## Resources

- [Python Docs](https://docs.python.org/3/)
- [PEP 8](https://peps.python.org/pep-0008/)
- [pytest](https://docs.pytest.org/)
- [mypy](https://mypy.readthedocs.io/)
