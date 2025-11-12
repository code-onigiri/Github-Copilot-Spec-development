# Swift Coding Rules

This prompt enforces industry-standard coding rules and conventions for Swift development.

## Style Guide Compliance

Follow [Swift API Design Guidelines](https://swift.org/documentation/api-design-guidelines/) and [Ray Wenderlich Swift Style Guide](https://github.com/raywenderlich/swift-style-guide).

### SwiftLint Configuration
```yaml
# .swiftlint.yml
disabled_rules:
  - trailing_whitespace

opt_in_rules:
  - empty_count
  - empty_string

included:
  - Sources

excluded:
  - Pods
  - build

line_length: 120
type_body_length: 300
function_body_length: 40
```

## Naming Conventions

- **Types**: `PascalCase` - `User`, `UserService`
- **Functions/Variables**: `camelCase` - `getUserName()`, `userId`
- **Constants**: `camelCase` - `maxRetryCount`
- **Enums**: `PascalCase`, cases `camelCase`
- **Protocols**: Often end with `-able` or `-ing`

## Required Checks

```bash
# Lint
swiftlint lint --strict

# Format
swiftformat .

# Build
xcodebuild build

# Test
xcodebuild test
```

## Testing Requirements

- Minimum 80% code coverage
- Use XCTest for unit tests
- Test async code with async/await
- Use dependency injection for testability

## CI/CD Requirements

```yaml
name: Swift CI
on: [push, pull_request]
jobs:
  test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - run: swiftlint lint --strict
      - run: xcodebuild build -scheme MyApp
      - run: xcodebuild test -scheme MyApp
```
