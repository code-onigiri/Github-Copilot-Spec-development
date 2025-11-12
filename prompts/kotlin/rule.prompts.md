# Kotlin Coding Rules

This prompt enforces industry-standard coding rules and conventions for Kotlin development.

## Style Guide Compliance

Follow [Kotlin Coding Conventions](https://kotlinlang.org/docs/coding-conventions.html).

### Detekt Configuration
```yaml
# detekt.yml
build:
  maxIssues: 0

style:
  MaxLineLength:
    maxLineLength: 120
  FunctionNaming:
    functionPattern: '[a-z][a-zA-Z0-9]*'
```

## Naming Conventions

- **Classes**: `PascalCase` - `UserService`
- **Functions**: `camelCase` - `getUser()`
- **Properties**: `camelCase` - `userId`
- **Constants**: `UPPER_SNAKE_CASE` - `MAX_SIZE`
- **Packages**: `lowercase` - `com.company.myapp`

## Required Checks

```bash
# Lint
./gradlew detekt

# Format
./gradlew ktlintFormat

# Test
./gradlew test

# Build
./gradlew build
```

## Testing Requirements

- Minimum 80% code coverage
- Use JUnit 5 for unit tests
- Use MockK for mocking
- Test coroutines with kotlinx-coroutines-test

## CI/CD Requirements

```yaml
name: Kotlin CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
      - run: ./gradlew detekt
      - run: ./gradlew test
      - run: ./gradlew build
```
