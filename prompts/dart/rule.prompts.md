# Dart Coding Rules

This prompt enforces industry-standard coding rules and conventions for Dart (and Flutter) development.

## Style Guide Compliance

Follow [Effective Dart](https://dart.dev/effective-dart) for style, documentation, and usage guidelines.

### Formatting

- Use `dart format` (built-in) with default options
- Max line length: 80 or 100; choose and enforce in `analysis_options.yaml`

### analyzer (linter) Configuration

```yaml
# analysis_options.yaml
include: package:lints/recommended.yaml

linter:
  rules:
    - always_declare_return_types
    - prefer_const_constructors
    - prefer_final_locals
    - avoid_print

analyzer:
  language:
    strict-casts: true
    strict-inference: true
    strict-raw-types: true
```

## Naming Conventions

- Classes, enums, typedefs: `UpperCamelCase`
- Libraries, packages, files: `lowercase_with_underscores`
- Members, variables, functions: `lowerCamelCase`
- Constants: `lowerCamelCase` with `const`

## Code Quality - Static Analysis

### Forbidden Practices

- ❌ Using `print` in production code (use logging)
- ❌ Catching broad `catch (e)` without handling
- ❌ Ignoring analyzer warnings

## Category Standards

### Async and Streams

```dart
// ✅ Correct
await for (final x in stream) {
  // handle x
}

// ❌ Incorrect: forgetting await
stream.forEach((x) { /* ... */ }); // may not complete before test ends
```

## Testing Requirements

### test / flutter_test

- Minimum 80% coverage (project policy)
- Use `setUp`/`tearDown` for fixtures

```dart
import 'package:test/test.dart';
void main(){
  setUp((){ /* create deps */ });
  test('works', (){ expect(add(1,1), 2); });
}
```

## Documentation Standards

### dartdoc

```dart
/// Returns sum of [a] and [b].
int add(int a, int b) => a + b;
```

## CI/CD Requirements

```yaml
# .github/workflows/ci.yml
name: ci
on: [push, pull_request]
jobs:
  dart:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dart-lang/setup-dart@v1
        with:
          sdk: "stable"
      - run: dart pub get
      - run: dart format --output=none --set-exit-if-changed .
      - run: dart analyze --fatal-infos --fatal-warnings
      - run: dart test -r expanded
```

## Code Review Checklist

- [ ] `analysis_options.yaml` に準拠しているか
- [ ] 重要な型に `const` / immutability が適用されているか
- [ ] UI とビジネスロジックは適切に分離されているか
- [ ] テストは十分で読みやすいか

## Enforcement

1. dart format - 自動整形
2. analyzer (package:lints) - 静的解析
3. CI での format/analyze/test の必須化
