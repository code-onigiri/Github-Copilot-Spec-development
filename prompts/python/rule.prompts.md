# Python Coding Rules

This prompt enforces industry-standard coding rules and conventions for Python development.

## Style Guide Compliance

Follow [PEP 8](https://peps.python.org/pep-0008/) and [PEP 257](https://peps.python.org/pep-0257/) for docstrings.

### Formatting

- Indentation: 4 spaces
- Max line length: 88 (Black default) / 100 (team choice) 固定
- Imports: group (stdlib, third-party, local) and sorted

### Black Configuration (pyproject.toml)

```toml
[tool.black]
line-length = 88
target-version = ["py310"]
skip-string-normalization = false
```

## Naming Conventions

- Packages & modules: `lower_snake_case`
- Classes: `PascalCase`
- Functions & variables: `lower_snake_case`
- Constants: `UPPER_SNAKE_CASE`
- Protected: `_leading_underscore`, Private: `__double_leading`

## Code Quality - Ruff / Flake8 / mypy

### Ruff (推奨高速 linter)

```toml
[tool.ruff]
line-length = 88
target-version = "py310"
select = ["E","F","I","B","UP","C90"]
ignore = ["E203"]
```

### mypy

```toml
[tool.mypy]
python_version = 3.10
warn_unused_configs = true
strict = true
ignore_missing_imports = true
```

### Forbidden Practices

- ❌ Mutable default arguments
- ❌ Bare except
- ❌ Runtime code execution `eval`/`exec` (正当性ある検証例外)
- ❌ 相対インポートの乱用 (`from . import x` 多用)

## Category Standards

### Async/Await

```python
# ✅ Correct
async def fetch(session, url):
    async with session.get(url) as resp:
        return await resp.text()

# ❌ Incorrect: blocking call inside async
async def bad(session, path):
    with open(path) as f:  # blocking I/O
        return f.read()
```

## Testing Requirements

### pytest Standards

- 最低 80% カバレッジ
- Fixture は `conftest.py` に集約

```python
# tests/test_math.py
def test_add():
    assert add(1,1) == 2
```

## Documentation Standards

### Docstring (Google or reST style)

```python
def add(a: int, b: int) -> int:
    """Return sum of a and b.

    Args:
        a: First operand.
        b: Second operand.
    Returns:
        Sum.
    """
    return a + b
```

## CI/CD Requirements

```yaml
# .github/workflows/ci.yml
name: ci
on: [push, pull_request]
jobs:
  lint-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install deps
        run: pip install -U pip && pip install -r requirements.txt
      - name: Lint
        run: ruff check . && black --check . && mypy .
      - name: Test
        run: pytest -q --cov=src --cov-report=xml
      - name: Coverage threshold
        run: python - <<'PY'
import xml.etree.ElementTree as ET
root = ET.parse('coverage.xml').getroot()
line_rate = float(root.get('line-rate',0))
assert line_rate >= 0.8, f"Coverage {line_rate:.2%} below threshold"
PY
```

## Code Review Checklist

- [ ] 型ヒントは公開 API に付与されているか
- [ ] 例外処理は具体的か
- [ ] グローバル状態を避けているか
- [ ] テストとカバレッジ基準を満たすか
- [ ] Linter/formatter/type-check 通過済みか

## Enforcement

1. Black - 一貫した整形
2. Ruff/Flake8 - コード品質とスタイル
3. mypy - 型の整合性
