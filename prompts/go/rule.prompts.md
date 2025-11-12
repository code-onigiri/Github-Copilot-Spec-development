# Go Coding Rules

This prompt enforces industry-standard coding rules and conventions for Go development.

## Style Guide Compliance

### Official Go Standards
Follow these official resources:
- [Effective Go](https://golang.org/doc/effective_go)
- [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)
- [Go Style Guide](https://google.github.io/styleguide/go/)

### Formatting
- Use `gofmt` for automatic formatting (mandatory)
- Use `goimports` for import management
- Tabs for indentation (not spaces)
- Run before commit: `gofmt -w .` and `goimports -w .`

## Naming Conventions

### Case and Visibility
- **Exported**: Start with uppercase (public API)
  ```go
  type User struct { }
  func NewUser() *User { }
  const MaxSize = 100
  ```

- **Unexported**: Start with lowercase (private)
  ```go
  type userImpl struct { }
  func parseUser() *User { }
  const defaultTimeout = 30
  ```

### Naming Rules
- **Packages**: Short, lowercase, no underscores
  - ✅ `user`, `auth`, `http`
  - ❌ `user_manager`, `UserAuth`, `HTTP_Client`

- **Interfaces**: Often single method ending in `-er`
  ```go
  type Reader interface { Read([]byte) (int, error) }
  type Writer interface { Write([]byte) (int, error) }
  type Closer interface { Close() error }
  ```

- **Variables**: Use short names in small scopes
  ```go
  // Good for small scope
  for i, v := range values {
      // i and v are clear in context
  }
  
  // Good for larger scope
  userRepository := NewUserRepository()
  ```

- **Acronyms**: Keep case consistent
  ```go
  // ✅ Correct
  type UserAPI struct { }
  var userID string
  
  // ❌ Incorrect
  type UserApi struct { }
  var userId string
  ```

## Code Quality - go vet and Linters

### Required Checks
All code must pass these checks:

```bash
# Format check
gofmt -d .
goimports -d .

# Vet check (built-in)
go vet ./...

# Static analysis
staticcheck ./...

# Golangci-lint (comprehensive)
golangci-lint run
```

### golangci-lint Configuration
```yaml
# .golangci.yml
run:
  timeout: 5m
  tests: true

linters:
  enable:
    - errcheck      # Check error handling
    - gosimple      # Simplify code
    - govet         # Report suspicious constructs
    - ineffassign   # Detect ineffectual assignments
    - staticcheck   # Advanced static analysis
    - unused        # Check for unused code
    - gocyclo       # Cyclomatic complexity
    - gofmt         # Format checking
    - goimports     # Import checking
    - misspell      # Spell checking
    - revive        # Fast, configurable linter
    - gosec         # Security checks

linters-settings:
  errcheck:
    check-blank: true
    check-type-assertions: true
  
  gocyclo:
    min-complexity: 15
  
  govet:
    check-shadowing: true
  
  revive:
    rules:
      - name: error-return
      - name: error-strings
      - name: error-naming
```

### Forbidden Practices
- ❌ Ignoring errors: `_, err := f()` without handling
- ❌ Empty error checks: `if err != nil { }`
- ❌ Using `panic()` for normal error handling
- ❌ Not closing resources (files, connections)
- ❌ Race conditions in goroutines
- ❌ Shadowing variables

## Error Handling Standards

### Error Checking
```go
// ✅ Correct: Always check errors
result, err := operation()
if err != nil {
    return fmt.Errorf("operation failed: %w", err)
}

// ❌ Incorrect: Ignoring errors
result, _ := operation()  // NEVER DO THIS

// ❌ Incorrect: Blank error handling
if err != nil {
    // Empty block - at least log it!
}
```

### Error Wrapping
```go
// Use %w to wrap errors for errors.Is and errors.As
if err != nil {
    return fmt.Errorf("failed to fetch user %s: %w", userID, err)
}

// Check wrapped errors
if errors.Is(err, sql.ErrNoRows) {
    // Handle not found
}

// Extract error types
var netErr *net.OpError
if errors.As(err, &netErr) {
    // Handle network error
}
```

### Custom Error Types
```go
// Define custom errors for library code
type ValidationError struct {
    Field string
    Value interface{}
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("invalid %s: %v", e.Field, e.Value)
}

// Sentinel errors for expected conditions
var (
    ErrNotFound     = errors.New("resource not found")
    ErrUnauthorized = errors.New("unauthorized access")
    ErrInvalidInput = errors.New("invalid input")
)
```

## Concurrency Rules

### Goroutine Management
```go
// ✅ Correct: Wait for goroutines
var wg sync.WaitGroup
for i := 0; i < 10; i++ {
    wg.Add(1)
    go func(n int) {
        defer wg.Done()
        process(n)
    }(i)
}
wg.Wait()

// ❌ Incorrect: Goroutine leak
for i := 0; i < 10; i++ {
    go process(i)  // No way to wait or cancel
}
```

### Channel Usage
```go
// ✅ Correct: Close channels from sender
func generate(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for _, n := range nums {
            out <- n
        }
    }()
    return out
}

// ✅ Correct: Use buffered channels to avoid blocking
results := make(chan Result, len(inputs))

// ✅ Correct: Use select for multiple channels
select {
case result := <-results:
    // Handle result
case <-ctx.Done():
    // Handle cancellation
    return ctx.Err()
}
```

### Mutex Usage
```go
// ✅ Correct: Use defer with mutexes
type SafeCounter struct {
    mu    sync.Mutex
    count int
}

func (c *SafeCounter) Inc() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.count++
}

// Use RWMutex for read-heavy workloads
type Cache struct {
    mu    sync.RWMutex
    items map[string]interface{}
}

func (c *Cache) Get(key string) (interface{}, bool) {
    c.mu.RLock()
    defer c.mu.RUnlock()
    val, ok := c.items[key]
    return val, ok
}
```

### Race Detection
```bash
# Always test with race detector
go test -race ./...

# Build with race detector for testing
go build -race

# Run with race detector
go run -race main.go
```

## Testing Requirements

### Test File Naming
- Test files must end with `_test.go`
- Place alongside implementation: `user.go` and `user_test.go`
- Use `internal/` for shared test utilities

### Test Function Naming
```go
// Format: TestFunctionName or TestType_Method
func TestParseUser(t *testing.T) { }
func TestUser_Validate(t *testing.T) { }
func TestUser_Validate_InvalidEmail(t *testing.T) { }
```

### Test Structure
```go
// Use subtests for organization
func TestUser(t *testing.T) {
    t.Run("Validate", func(t *testing.T) {
        t.Run("valid user", func(t *testing.T) {
            // Test valid case
        })
        
        t.Run("invalid email", func(t *testing.T) {
            // Test invalid case
        })
    })
}
```

### Test Coverage
```bash
# Generate coverage report
go test -cover ./...

# Detailed coverage
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out

# Minimum coverage: 80%
```

### Benchmarking
```go
// Benchmark naming: BenchmarkXxx
func BenchmarkParseUser(b *testing.B) {
    input := []byte(`{"id":"123","name":"John"}`)
    
    b.ResetTimer()
    for i := 0; i < b.N; i++ {
        _, _ = ParseUser(input)
    }
}

// Run benchmarks
go test -bench=. -benchmem
```

## Documentation Standards

### Package Documentation
```go
// Package user provides user management functionality.
//
// This package handles user creation, validation, and storage.
// It supports multiple authentication methods.
package user
```

### Function Documentation
```go
// NewUser creates a new User with the given name and email.
//
// The email address is validated before creating the user.
// If the email is invalid, an error is returned.
//
// Example:
//
//     user, err := NewUser("John", "john@example.com")
//     if err != nil {
//         log.Fatal(err)
//     }
func NewUser(name, email string) (*User, error) {
    // implementation
}
```

### Required Documentation
- All exported types, functions, constants, and variables must have documentation
- Documentation should start with the name of the item
- Use complete sentences with proper punctuation
- Include examples for complex functionality

## Module Management

### go.mod Best Practices
```go
module github.com/user/myapp

go 1.21

require (
    github.com/lib/pq v1.10.9
    golang.org/x/sync v0.3.0
)

require (
    // Indirect dependencies (automatically managed)
    golang.org/x/sys v0.10.0 // indirect
)
```

### Dependency Management
```bash
# Add dependency
go get github.com/pkg/errors

# Update dependencies
go get -u ./...

# Tidy dependencies
go mod tidy

# Verify dependencies
go mod verify

# Vendor dependencies (optional)
go mod vendor
```

### Version Selection
- Use semantic versioning
- Pin major versions for stability
- Review dependencies periodically
- Use `go list -m all` to see all dependencies

## Build and Release

### Build Flags
```bash
# Production build
go build -ldflags="-s -w" -o bin/myapp

# With version info
go build -ldflags="-X main.version=1.0.0" -o bin/myapp

# Cross-compilation
GOOS=linux GOARCH=amd64 go build -o bin/myapp-linux
GOOS=windows GOARCH=amd64 go build -o bin/myapp.exe
```

### Makefile Example
```makefile
.PHONY: build test lint clean

build:
	go build -o bin/myapp .

test:
	go test -v -race -cover ./...

lint:
	gofmt -l .
	go vet ./...
	staticcheck ./...
	golangci-lint run

clean:
	rm -rf bin/
	go clean
```

## CI/CD Requirements

### Pre-commit Checks
```bash
# Format
gofmt -w .
goimports -w .

# Lint
go vet ./...
golangci-lint run

# Test
go test -race ./...

# Build
go build ./...
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
      - uses: actions/setup-go@v4
        with:
          go-version: '1.21'
      
      - name: Format check
        run: |
          gofmt -d .
          test -z "$(gofmt -d .)"
      
      - name: Vet
        run: go vet ./...
      
      - name: Lint
        uses: golangci/golangci-lint-action@v3
      
      - name: Test
        run: go test -v -race -cover ./...
      
      - name: Build
        run: go build ./...
```

## Security Best Practices

### Input Validation
```go
// Always validate input
func SetAge(age int) error {
    if age < 0 || age > 150 {
        return fmt.Errorf("invalid age: %d", age)
    }
    return nil
}
```

### SQL Injection Prevention
```go
// ✅ Correct: Use parameterized queries
rows, err := db.Query("SELECT * FROM users WHERE id = ?", userID)

// ❌ Incorrect: String concatenation
query := "SELECT * FROM users WHERE id = " + userID  // NEVER DO THIS
```

### Secure Defaults
- Use crypto/rand for random numbers, not math/rand
- Use bcrypt or argon2 for password hashing
- Enable TLS for network connections
- Validate and sanitize all external input

## Code Review Checklist

Before submitting code for review:
- [ ] `gofmt` and `goimports` applied
- [ ] `go vet ./...` passes
- [ ] `golangci-lint run` passes
- [ ] `go test -race ./...` passes
- [ ] Test coverage ≥80%
- [ ] All exported items have documentation
- [ ] No error checking omitted
- [ ] No goroutine leaks
- [ ] Context used for cancellation
- [ ] Resources properly closed (defer)

## Enforcement

These rules are enforced through:
1. **gofmt** - Mandatory formatting
2. **go vet** - Built-in static analysis
3. **golangci-lint** - Comprehensive linting
4. **go test -race** - Race condition detection
5. **CI/CD** - Automated checks on every commit
6. **Code Review** - Manual review using checklist

Non-compliance will result in:
- CI build failure
- Code review rejection
- Request for changes before merge
