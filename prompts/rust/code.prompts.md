# Rust Best Practices

This prompt provides guidance for writing functional and efficient Rust code.

## Core Principles

### Ownership and Borrowing
- Always prefer borrowing over cloning when possible
- Use `&T` for immutable references, `&mut T` for mutable references
- Leverage the borrow checker to prevent data races at compile time
- Use lifetime annotations explicitly when needed for clarity

### Error Handling
- Use `Result<T, E>` for recoverable errors, never `unwrap()` in production code
- Use `?` operator for error propagation instead of `unwrap()` or `expect()`
- Use `anyhow` for application-level error handling
- Use `thiserror` for library-level custom error types
- Handle all error cases explicitly with `match` or `if let`

### Async/Await
- Use `async/await` with tokio for concurrent operations
- Prefer `tokio::spawn` for CPU-bound tasks
- Use `#[tokio::main]` or `#[tokio::test]` for async entry points
- Always specify runtime features in Cargo.toml: `tokio = { version = "1", features = ["rt-multi-thread", "macros"] }`

### Type Safety
- Leverage the type system to encode invariants
- Use newtypes to add semantic meaning: `struct UserId(i64);`
- Use enums for state machines and tagged unions
- Prefer `Option<T>` over nullable values
- Use generic types with trait bounds for reusable code

### Memory Efficiency
- Use `Box<T>` for heap allocation of large types
- Use `Rc<T>` or `Arc<T>` for shared ownership (prefer Arc for thread-safe sharing)
- Use `Cow<T>` for clone-on-write semantics
- Avoid unnecessary clones by designing for borrowing

## Code Organization

### Module Structure
- One module per file or use `mod.rs` for directories
- Use `pub(crate)` for internal-only public items
- Organize by feature, not by layer
- Keep modules focused and cohesive

### Project Layout
```
src/
  main.rs         # Entry point
  lib.rs          # Library root (if applicable)
  handlers/       # Business logic
    mod.rs
    user.rs
    auth.rs
  models/         # Data structures
  services/       # External service integrations
  utils/          # Helper functions
tests/            # Integration tests
  common/         # Shared test utilities
```

## Performance Optimization

### Compilation
- Use `--release` flag for production builds
- Enable link-time optimization (LTO) in Cargo.toml:
  ```toml
  [profile.release]
  lto = true
  codegen-units = 1
  ```

### Runtime Performance
- Use `Vec::with_capacity()` when size is known
- Prefer iterators over loops for transformations
- Use `SmallVec` or `ArrayVec` for stack-allocated collections
- Profile with `cargo-flamegraph` or `perf`

### Concurrency
- Use message passing (channels) over shared state
- Use `Mutex<T>` or `RwLock<T>` for shared mutable state
- Prefer `tokio::sync` primitives for async code
- Avoid blocking operations in async contexts

## Testing

### Unit Tests
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_function() {
        assert_eq!(function(input), expected);
    }

    #[tokio::test]
    async fn test_async_function() {
        let result = async_function().await;
        assert!(result.is_ok());
    }
}
```

### Integration Tests
- Place in `tests/` directory
- Use `common` module for shared test utilities
- Test public API, not internal implementation

### Test Coverage
- Aim for >80% code coverage
- Use `cargo tarpaulin` for coverage reports
- Test error paths, not just happy paths

## Documentation

### Code Documentation
```rust
/// Brief one-line summary
///
/// Detailed explanation of the function's purpose,
/// parameters, and return value.
///
/// # Examples
///
/// ```
/// let result = function(42);
/// assert_eq!(result, expected);
/// ```
///
/// # Errors
///
/// Returns `Err` if the input is invalid.
pub fn function(input: i32) -> Result<Output, Error> {
    // implementation
}
```

### Crate-Level Documentation
- Use `//!` for module-level documentation
- Include usage examples in `lib.rs` or `main.rs`
- Run `cargo doc --no-deps --open` to preview

## Dependencies

### Cargo.toml Best Practices
```toml
[package]
name = "my-app"
version = "0.1.0"
edition = "2021"

[dependencies]
# Core functionality
serde = { version = "1", features = ["derive"] }
tokio = { version = "1", features = ["rt-multi-thread", "macros"] }
anyhow = "1"

# Optional features
[dependencies.optional-feature]
version = "1.0"
optional = true

[dev-dependencies]
# Test-only dependencies
```

### Dependency Management
- Pin major versions, allow minor/patch updates
- Review dependencies periodically for security updates
- Use `cargo-audit` to check for vulnerabilities
- Minimize dependency count

## Idiomatic Patterns

### Builder Pattern
```rust
pub struct Config {
    pub host: String,
    pub port: u16,
}

impl Config {
    pub fn builder() -> ConfigBuilder {
        ConfigBuilder::default()
    }
}

#[derive(Default)]
pub struct ConfigBuilder {
    host: Option<String>,
    port: Option<u16>,
}

impl ConfigBuilder {
    pub fn host(mut self, host: impl Into<String>) -> Self {
        self.host = Some(host.into());
        self
    }

    pub fn port(mut self, port: u16) -> Self {
        self.port = Some(port);
        self
    }

    pub fn build(self) -> Result<Config, Error> {
        Ok(Config {
            host: self.host.ok_or(Error::MissingHost)?,
            port: self.port.unwrap_or(8080),
        })
    }
}
```

### Iterator Pattern
```rust
// Prefer iterator chains
let result: Vec<_> = items
    .iter()
    .filter(|x| x.is_valid())
    .map(|x| x.process())
    .collect();

// Over explicit loops
let mut result = Vec::new();
for item in &items {
    if item.is_valid() {
        result.push(item.process());
    }
}
```

### From/Into Pattern
```rust
impl From<String> for UserId {
    fn from(s: String) -> Self {
        UserId(s)
    }
}

// Use impl Into<T> in function signatures
pub fn set_user_id(&mut self, id: impl Into<UserId>) {
    self.user_id = id.into();
}
```

## Common Pitfalls to Avoid

### Anti-Patterns
- ❌ Using `unwrap()` or `expect()` in library code
- ❌ Ignoring `Result` return values
- ❌ Using `clone()` excessively instead of borrowing
- ❌ Using `panic!()` for error handling
- ❌ Using wildcard imports: `use module::*`

### Best Practices
- ✅ Use `?` for error propagation
- ✅ Handle all Result/Option cases explicitly
- ✅ Design APIs for borrowing
- ✅ Return `Result` for fallible operations
- ✅ Use explicit imports

## Resources

- [The Rust Programming Language Book](https://doc.rust-lang.org/book/)
- [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- [Rust Performance Book](https://nnethercote.github.io/perf-book/)
- [Rust Design Patterns](https://rust-unofficial.github.io/patterns/)
