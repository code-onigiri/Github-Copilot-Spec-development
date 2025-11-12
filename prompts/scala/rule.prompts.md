# Scala Coding Rules

This prompt enforces industry-standard coding rules and conventions for Scala projects.

## Style Guide Compliance

Follow the official [Scala Style Guide](https://docs.scala-lang.org/style/).

### Formatting (Scalafmt)

```hocon
# .scalafmt.conf
version = 3.7.17
maxColumn = 100
align.preset = none
newlines.alwaysBeforeTopLevelStatements = true
runner.dialect = scala3
```

## Naming Conventions

- Packages: `lowercase`
- Classes/Traits/Objects: `PascalCase`
- Methods/fields: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

## Code Quality - Scalafmt / Scalafix

### Scalafix (optional but recommended)

```hocon
# .scalafix.conf
rules = [
  RemoveUnused,
  LeakingImplicitClassVal
]
```

### Compiler Flags (sbt)

```scala
// build.sbt
scalacOptions ++= Seq(
  "-deprecation",
  "-unchecked",
  "-feature",
  "-Wvalue-discard",
  "-Xlint:unused",
)
```

### Forbidden Practices

- ❌ Using `null` instead of `Option`
- ❌ Catching `Throwable` broadly
- ❌ Side-effects hidden in pure-looking APIs

## Category Standards

### Error Handling

```scala
// ✅ Correct
parseInt("42").map(_ + 1).getOrElse(0)

// ❌ Incorrect
try { "x".toInt } catch { case _: Exception => 0 }
```

## Testing Requirements

### ScalaTest

- Structure tests under `src/test/scala`
- Use descriptive test names

```scala
import org.scalatest.funsuite.AnyFunSuite
class DemoTest extends AnyFunSuite {
  test("parseInt returns Right for numbers") {
    assert(parseInt("10").contains(10))
  }
}
```

## Documentation Standards

### Scaladoc

```scala
/** Returns sum of a and b. */
def add(a: Int, b: Int): Int = a + b
```

## CI/CD Requirements

```yaml
# .github/workflows/ci.yml
name: ci
on: [push, pull_request]
jobs:
  scala:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: coursier/cache-action@v6
      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: "21"
      - name: Cache sbt
        uses: actions/cache@v4
        with:
          path: |
            ~/.ivy2/cache
            ~/.sbt
          key: ${{ runner.os }}-sbt-${{ hashFiles('**/build.sbt') }}
      - name: Test
        run: sbt -v test
```

## Code Review Checklist

- [ ] Immutability と Option の徹底
- [ ] パターンマッチは網羅的か
- [ ] ブロッキング I/O を適切に隔離しているか
- [ ] Scalafmt/Scalafix/テストに合格

## Enforcement

1. Scalafmt - コード整形
2. Scalafix/Compiler flags - 静的検査
3. CI 上での build/test 強制
