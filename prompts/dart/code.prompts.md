# Dart Best Practices

This prompt provides guidance for writing clean, maintainable, and performant Dart (and Flutter) code.

## Core Principles

### Null Safety

- Leverage Dart's sound null safety; avoid `!` unless proven safe
- Prefer non-nullable fields with late initialization via constructors

```dart
class User {
  final String id;
  final String name;
  const User({required this.id, required this.name});
}
```

### Immutability

- Prefer `const` constructors and immutable data objects
- Use `copyWith` for state updates

```dart
class State {
  final int counter;
  const State(this.counter);
  State copyWith({int? counter}) => State(counter ?? this.counter);
}
```

### Asynchronous Programming

- Use `async`/`await` over nested futures
- Avoid blocking the UI isolate; move heavy work to an isolate

```dart
Future<int> loadValue() async {
  final data = await fetch();
  return parse(data);
}
```

### Layered Architecture (Flutter)

- Separate presentation, domain, and data layers
- Keep widgets lean; extract business logic

## Code Organization

### Project Structure

```
lib/
  main.dart
  src/
    presentation/
    domain/
    data/
    widgets/
```

## Language-Specific Patterns

### Value Objects with Equatable

```dart
import 'package:equatable/equatable.dart';

class Point extends Equatable {
  final int x; final int y;
  const Point(this.x, this.y);
  @override List<Object?> get props => [x,y];
}
```

### State Management (example: Riverpod)

```dart
final counterProvider = StateProvider<int>((ref) => 0);
```

## Error Handling

```dart
try {
  final user = await api.fetchUser();
} on TimeoutException catch (e) {
  // retry or fallback
} catch (e, st) {
  log('Unexpected', error: e, stackTrace: st);
}
```

## Testing

- Use `flutter_test` / `test` package
- Widget tests: isolate logic from rendering side-effects

```dart
import 'package:test/test.dart';
void main(){
  test('copyWith', (){ expect(State(1).copyWith(counter: 2).counter, 2); });
}
```

## Performance Optimization

- Use const widgets to reduce rebuilds
- Memoize heavy computations
- Profile with DevTools first; optimize after measuring

## Common Patterns

### Extension Methods

```dart
extension DurationFormat on Duration {
  String toMinutes() => '${inMinutes}m';
}
```

## Common Pitfalls to Avoid

### Anti-Patterns

- ❌ Overusing `!` null assertion
- ❌ Business logic inside UI widgets
- ❌ Massive widgets with >300 lines

### Best Practices

- ✅ Explicit immutable models
- ✅ Scoped providers/state
- ✅ Structured layering

## Resources

- [Dart Language Tour](https://dart.dev/language)
- [Effective Dart](https://dart.dev/effective-dart)
- [Flutter Docs](https://docs.flutter.dev/)
