# Scala Best Practices

This prompt provides guidance for writing idiomatic, safe, and performant Scala 2.13+/3 code.

## Core Principles

### Immutability First

- Prefer `val` over `var`
- Use immutable collections (`List`, `Vector`, `Map`)

```scala
final case class User(id: String, name: String)
```

### Expressive Types and Options

- Use `Option` instead of `null`
- Model domain with algebraic data types (ADTs) via `sealed` traits

```scala
sealed trait Payment
final case class Cash(amount: BigDecimal) extends Payment
final case class Card(last4: String, amount: BigDecimal) extends Payment
```

### Functional Style

- Pure functions, referential transparency
- Prefer `map/flatMap/for` comprehensions

```scala
def names(users: List[User]): List[String] = users.map(_.name)
```

### Concurrency

- Use `Future` for simple async
- For effect systems, consider `cats-effect`/`ZIO` (project policy)

```scala
import scala.concurrent.{Future, ExecutionContext}

def fetch(implicit ec: ExecutionContext): Future[String] = Future("ok")
```

## Code Organization

### Project Structure (sbt)

```
project/
src/
  main/scala/
  test/scala/
build.sbt
```

### Module Design

- Keep packages cohesive
- Place one public type per file when practical

## Language-Specific Patterns

### Pattern Matching

```scala
def describe(p: Payment): String = p match {
  case Cash(a)       => s"cash: $a"
  case Card(l4, a)   => s"card($l4): $a"
}
```

### Error Handling with Either

```scala
type Error = String

def parseInt(s: String): Either[Error, Int] =
  s.toIntOption.toRight(s"invalid: $s")
```

## Testing

- Use ScalaTest or MUnit

```scala
import org.scalatest.funsuite.AnyFunSuite

class MathTest extends AnyFunSuite {
  test("add") { assert(1 + 1 === 2) }
}
```

## Performance Optimization

- Prefer `Vector` for indexed access; `List` for prepends
- Avoid unnecessary boxing; enable `-Ywarn-value-discard` (2.13) / `-Wvalue-discard` (3)
- Use `@tailrec` for recursion

```scala
import scala.annotation.tailrec

def sum(xs: List[Int]): Int = {
  @tailrec
  def loop(rest: List[Int], acc: Int): Int = rest match {
    case h :: t => loop(t, acc + h)
    case Nil    => acc
  }
  loop(xs, 0)
}
```

## Common Patterns

### Typeclass Pattern (given/using)

```scala
trait Show[A]{ def show(a: A): String }
object Show {
  given Show[Int] with { def show(a: Int) = a.toString }
}
```

## Common Pitfalls to Avoid

### Anti-Patterns

- ❌ Using `null` instead of `Option`
- ❌ Overusing mutable state
- ❌ Blocking calls on default execution context

### Best Practices

- ✅ Algebraic data types for domain
- ✅ Total functions when possible
- ✅ Exhaustive pattern matching

## Resources

- [Scala Docs](https://docs.scala-lang.org/)
- [Scala Style Guide](https://docs.scala-lang.org/style/)
- [ScalaTest](https://www.scalatest.org/)
