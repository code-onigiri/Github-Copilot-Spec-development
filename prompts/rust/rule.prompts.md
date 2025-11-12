# Rust Coding Rules

This prompt enforces industry-standard coding rules and conventions for Rust development.

## Style Guide Compliance

### Official Rust Style Guide
Follow the [Rust Style Guide](https://doc.rust-lang.org/beta/style-guide/) for all code formatting and conventions.

### Formatting
- Use `rustfmt` for automatic code formatting
- Configure in `rustfmt.toml`:
  ```toml
  edition = "2021"
  max_width = 100
  use_small_heuristics = "Max"
  ```
- Run `cargo fmt` before committing
- Enforce in CI with `cargo fmt --check`

### Indentation
- 4 spaces per indentation level (never tabs)
- rustfmt handles this automatically

## Naming Conventions

### Case Styles
- **Types, Traits**: `UpperCamelCase` (e.g., `struct UserData`, `trait Serialize`)
- **Functions, Variables**: `snake_case` (e.g., `fn calculate_total()`, `let user_name`)
- **Constants, Statics**: `SCREAMING_SNAKE_CASE` (e.g., `const MAX_SIZE: usize = 100`)
- **Crate Names**: `kebab-case` in Cargo.toml (e.g., `my-awesome-crate`)
- **Module Names**: `snake_case` (e.g., `mod user_handler`)

### Naming Rules
- Use descriptive names that convey purpose
- Avoid abbreviations unless universally understood (e.g., `id`, `url`)
- Boolean functions should be questions: `is_valid()`, `has_permission()`
- Conversion functions: `to_*()`, `as_*()`, `into_*()`

## Code Quality - Clippy

### Required Clippy Lints
All projects must pass Clippy with the following configuration:

```toml
# .cargo/config.toml or Cargo.toml
[lints.rust]
unsafe_code = "forbid"
dead_code = "warn"
unused_must_use = "deny"

[lints.clippy]
# Deny categories
pedantic = "warn"
nursery = "warn"
cargo = "warn"

# Specific denials
unwrap_used = "deny"
expect_used = "deny"
panic = "deny"
todo = "deny"
unimplemented = "deny"
wildcard_imports = "deny"
missing_docs = "warn"
```

### Clippy Execution
```bash
# Standard check (zero warnings policy)
cargo clippy -- -D warnings

# Strict mode (pedantic + nursery)
cargo clippy -- -D warnings -W clippy::pedantic -W clippy::nursery

# Auto-fix when possible
cargo clippy --fix
```

### Forbidden Practices
- ❌ `unwrap()` - Use `?` or proper error handling
- ❌ `expect()` - Use `?` or match with clear error messages
- ❌ `todo!()` - Complete implementation or use proper Result
- ❌ `unimplemented!()` - Same as above
- ❌ `panic!()` - Use Result for recoverable errors
- ❌ Wildcard imports - Be explicit about imports

## Error Handling Standards

### Error Types
```rust
// Application errors - use anyhow
use anyhow::{Context, Result};

pub fn read_config() -> Result<Config> {
    let contents = fs::read_to_string("config.toml")
        .context("Failed to read config file")?;
    
    toml::from_str(&contents)
        .context("Failed to parse config file")
}

// Library errors - use thiserror
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ConfigError {
    #[error("Configuration file not found at {path}")]
    NotFound { path: String },
    
    #[error("Invalid configuration: {0}")]
    Invalid(String),
    
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
}
```

### Error Propagation
```rust
// ✅ Correct: Use ? operator
fn process_data() -> Result<Data, Error> {
    let raw = read_file()?;
    let parsed = parse_data(&raw)?;
    Ok(transform(parsed))
}

// ❌ Incorrect: Using unwrap
fn process_data() -> Data {
    let raw = read_file().unwrap();  // NEVER DO THIS
    let parsed = parse_data(&raw).unwrap();
    transform(parsed)
}
```

## Safety and Security

### Unsafe Code
- Unsafe code is **FORBIDDEN** unless explicitly required and approved
- If unsafe is necessary:
  - Document why it's needed
  - Document invariants that must be maintained
  - Minimize unsafe blocks
  - Provide safe wrapper functions

```rust
/// SAFETY: This is safe because [detailed explanation]
unsafe {
    // Minimal unsafe code
}
```

### Input Validation
```rust
// Always validate external input
pub fn set_age(age: i32) -> Result<(), ValidationError> {
    if age < 0 || age > 150 {
        return Err(ValidationError::InvalidAge);
    }
    Ok(())
}

// Use newtypes for validated data
pub struct ValidatedEmail(String);

impl ValidatedEmail {
    pub fn new(email: String) -> Result<Self, ValidationError> {
        if !email.contains('@') {
            return Err(ValidationError::InvalidEmail);
        }
        Ok(Self(email))
    }
}
```

## Documentation Standards

### Required Documentation
- All public items must have documentation
- Use `#![warn(missing_docs)]` in lib.rs
- Include examples for complex functions

### Documentation Format
```rust
/// Brief one-line description (ends with period).
///
/// More detailed explanation if needed. Can span
/// multiple paragraphs.
///
/// # Arguments
///
/// * `input` - Description of the input parameter
///
/// # Returns
///
/// Description of what the function returns
///
/// # Errors
///
/// This function will return an error if:
/// - Condition 1
/// - Condition 2
///
/// # Examples
///
/// ```
/// use my_crate::function;
///
/// let result = function(42)?;
/// assert_eq!(result, expected);
/// # Ok::<(), Box<dyn std::error::Error>>(())
/// ```
///
/// # Panics
///
/// This function panics if [condition]
///
/// # Safety
///
/// (Only for unsafe functions)
/// This function is unsafe because...
pub fn function(input: i32) -> Result<Output> {
    // implementation
}
```

## Testing Requirements

### Test Organization
```rust
// Unit tests in same file
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_success_case() {
        // Arrange
        let input = 42;
        
        // Act
        let result = function(input);
        
        // Assert
        assert_eq!(result, expected);
    }

    #[test]
    #[should_panic(expected = "error message")]
    fn test_panic_case() {
        function_that_panics();
    }
}
```

### Test Coverage Requirements
- Minimum 80% code coverage
- Test all error paths
- Test edge cases and boundary conditions
- Use property-based testing for complex logic (proptest)

### Test Naming
- `test_` prefix for test functions
- Descriptive names: `test_parse_valid_email_succeeds()`
- Group related tests in modules

## Performance Rules

### Allocation
- Avoid unnecessary allocations
- Use `Vec::with_capacity()` when size is known
- Prefer stack allocation for small, fixed-size data
- Use `Cow<T>` for conditional ownership

### Cloning
- Minimize cloning - prefer borrowing
- Document why cloning is necessary when used
- Consider `Arc<T>` for shared ownership

### Iteration
```rust
// ✅ Correct: Use iterators
let result: Vec<_> = items.iter()
    .filter(|x| x.is_valid())
    .map(|x| x.process())
    .collect();

// ❌ Incorrect: Manual loops when iterator would work
let mut result = Vec::new();
for item in &items {
    if item.is_valid() {
        result.push(item.process());
    }
}
```

## Dependency Management

### Cargo.toml Rules
```toml
[dependencies]
# Always specify feature requirements
tokio = { version = "1.35", features = ["rt-multi-thread", "macros"] }

# Use workspace for multi-crate projects
[workspace]
members = ["crate1", "crate2"]

# Lock versions for applications, use ranges for libraries
serde = "1.0"  # For libraries
# serde = "=1.0.195"  # For applications (exact version)
```

### Dependency Hygiene
- Run `cargo update` regularly
- Use `cargo audit` to check for vulnerabilities
- Review dependency licenses
- Minimize dependency count
- Prefer maintained, well-tested crates

## CI/CD Requirements

### Pre-commit Checks
```bash
# All must pass
cargo fmt --check
cargo clippy -- -D warnings
cargo test
cargo audit
```

### CI Pipeline
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: dtolnay/rust-toolchain@stable
      - run: cargo fmt --check
      - run: cargo clippy -- -D warnings
      - run: cargo test --all-features
      - run: cargo audit
```

## Version Control

### Commit Messages
- Follow [Conventional Commits](https://www.conventionalcommits.org/)
- Format: `type(scope): description`
- Examples:
  - `feat(auth): add OAuth2 support`
  - `fix(parser): handle edge case in validation`
  - `docs(readme): update installation instructions`

### .gitignore
```gitignore
# Rust
/target/
**/*.rs.bk
Cargo.lock  # Include for apps, ignore for libraries

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db
```

## Code Review Checklist

Before submitting code for review, verify:
- [ ] `cargo fmt` passes
- [ ] `cargo clippy -- -D warnings` passes with zero warnings
- [ ] `cargo test` passes all tests
- [ ] `cargo audit` reports no vulnerabilities
- [ ] All public items have documentation
- [ ] No `unwrap()`, `expect()`, `todo!()`, or `panic!()`
- [ ] Error handling uses `Result` and `?`
- [ ] Tests cover new functionality and edge cases
- [ ] No unnecessary allocations or cloning
- [ ] Dependencies are justified and minimal

## Enforcement

These rules are enforced through:
1. **rustfmt** - Automatic formatting
2. **Clippy** - Lint checking with `-D warnings`
3. **CI/CD** - Automated checks on every commit
4. **Code Review** - Manual review using checklist above

Non-compliance will result in:
- CI build failure
- Code review rejection
- Request for changes before merge
