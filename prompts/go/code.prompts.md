# Go Best Practices

This prompt provides guidance for writing functional and efficient Go code.

## Core Principles

### Simplicity and Clarity
- Write simple, clear, and idiomatic Go code
- Prefer explicit code over clever code
- Follow the principle: "Clear is better than clever"
- Use gofmt/goimports for consistent formatting

### Error Handling
- Always check and handle errors explicitly
- Return errors, don't panic
- Wrap errors with context using `fmt.Errorf` with `%w`
- Use custom error types for specific error conditions

```go
// ✅ Correct: Explicit error handling
func ReadFile(path string) ([]byte, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, fmt.Errorf("failed to read file %s: %w", path, err)
    }
    return data, nil
}

// ❌ Incorrect: Ignoring errors
func ReadFile(path string) []byte {
    data, _ := os.ReadFile(path)  // Never do this
    return data
}
```

### Concurrency
- Use goroutines for concurrent operations
- Use channels for communication between goroutines
- Use `sync.WaitGroup` for waiting on goroutines
- Use `context.Context` for cancellation and timeouts
- Avoid shared memory, communicate via channels ("Don't communicate by sharing memory; share memory by communicating")

```go
// Channel-based concurrency
func FetchMultiple(urls []string) []Result {
    results := make(chan Result, len(urls))
    
    for _, url := range urls {
        go func(u string) {
            results <- fetch(u)
        }(url)
    }
    
    collected := make([]Result, 0, len(urls))
    for i := 0; i < len(urls); i++ {
        collected = append(collected, <-results)
    }
    return collected
}
```

### Interface Design
- Keep interfaces small (often 1-2 methods)
- Accept interfaces, return structs
- Define interfaces at point of use, not implementation
- Use composition over inheritance

```go
// Small, focused interfaces
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

// Compose interfaces
type ReadWriter interface {
    Reader
    Writer
}
```

## Code Organization

### Package Structure
```
myapp/
  cmd/
    myapp/
      main.go           # Entry point
  internal/             # Private application code
    user/
      user.go
      user_test.go
    auth/
      auth.go
  pkg/                  # Public library code
    client/
      client.go
  api/                  # API definitions
    proto/
      service.proto
  configs/              # Configuration files
  scripts/              # Build and utility scripts
```

### Package Naming
- Use short, lowercase package names
- No underscores or camelCase
- Package name should match directory name
- Avoid generic names like `util` or `common`

### File Organization
- One main type per file
- Test files alongside implementation: `user.go` and `user_test.go`
- Use `internal/` for private packages
- Use `pkg/` for public reusable packages

## Idiomatic Go Patterns

### Variable Declaration
```go
// Use short variable declaration
user := &User{Name: "John"}

// Use var for zero values
var count int
var enabled bool

// Group related declarations
var (
    maxRetries = 3
    timeout    = time.Second * 30
)
```

### Struct Initialization
```go
// Named fields for clarity
user := User{
    ID:    "123",
    Name:  "John",
    Email: "john@example.com",
}

// Use constructors for complex initialization
func NewUser(id, name string) *User {
    return &User{
        ID:        id,
        Name:      name,
        CreatedAt: time.Now(),
    }
}
```

### Defer for Cleanup
```go
func ProcessFile(path string) error {
    file, err := os.Open(path)
    if err != nil {
        return err
    }
    defer file.Close()  // Always close file
    
    // Process file
    return nil
}
```

### Error Wrapping
```go
// Wrap errors with context
if err != nil {
    return fmt.Errorf("failed to process user %s: %w", userID, err)
}

// Check wrapped errors
if errors.Is(err, ErrNotFound) {
    // Handle not found
}

// Extract error types
var validationErr *ValidationError
if errors.As(err, &validationErr) {
    // Handle validation error
}
```

## Testing

### Table-Driven Tests
```go
func TestParseUser(t *testing.T) {
    tests := []struct {
        name    string
        input   string
        want    *User
        wantErr bool
    }{
        {
            name:  "valid user",
            input: `{"id":"123","name":"John"}`,
            want:  &User{ID: "123", Name: "John"},
        },
        {
            name:    "invalid json",
            input:   `invalid`,
            wantErr: true,
        },
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := ParseUser(tt.input)
            if (err != nil) != tt.wantErr {
                t.Errorf("ParseUser() error = %v, wantErr %v", err, tt.wantErr)
                return
            }
            if !reflect.DeepEqual(got, tt.want) {
                t.Errorf("ParseUser() = %v, want %v", got, tt.want)
            }
        })
    }
}
```

### Benchmarks
```go
func BenchmarkParseUser(b *testing.B) {
    input := `{"id":"123","name":"John"}`
    
    b.ResetTimer()
    for i := 0; i < b.N; i++ {
        ParseUser(input)
    }
}
```

### Example Tests
```go
func ExampleParseUser() {
    user, _ := ParseUser(`{"id":"123","name":"John"}`)
    fmt.Printf("%s: %s\n", user.ID, user.Name)
    // Output: 123: John
}
```

## Performance Optimization

### Preallocate Slices
```go
// ✅ Correct: Preallocate capacity
users := make([]User, 0, len(ids))
for _, id := range ids {
    users = append(users, fetchUser(id))
}

// ❌ Incorrect: Growing slice repeatedly
var users []User
for _, id := range ids {
    users = append(users, fetchUser(id))
}
```

### Use Pointers Wisely
```go
// Use pointers for large structs or when mutation is needed
func UpdateUser(u *User) {
    u.UpdatedAt = time.Now()
}

// Use values for small structs
type Point struct {
    X, Y int
}

func Distance(p1, p2 Point) float64 {
    // Small struct, pass by value
}
```

### String Building
```go
// ✅ Correct: Use strings.Builder for concatenation
var b strings.Builder
for _, s := range parts {
    b.WriteString(s)
}
result := b.String()

// ❌ Incorrect: String concatenation in loop
var result string
for _, s := range parts {
    result += s  // Creates new string each time
}
```

### Avoid Allocations
```go
// Reuse buffers
var bufPool = sync.Pool{
    New: func() interface{} {
        return new(bytes.Buffer)
    },
}

func Process(data []byte) []byte {
    buf := bufPool.Get().(*bytes.Buffer)
    defer bufPool.Put(buf)
    
    buf.Reset()
    buf.Write(data)
    // Process
    return buf.Bytes()
}
```

## Context Usage

### Timeouts and Cancellation
```go
func FetchWithTimeout(url string) (*Response, error) {
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    
    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        return nil, err
    }
    
    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    
    // Process response
    return parseResponse(resp)
}
```

### Context Values
```go
// Use context for request-scoped values
type contextKey string

const userIDKey contextKey = "userID"

func WithUserID(ctx context.Context, userID string) context.Context {
    return context.WithValue(ctx, userIDKey, userID)
}

func GetUserID(ctx context.Context) (string, bool) {
    userID, ok := ctx.Value(userIDKey).(string)
    return userID, ok
}
```

## Common Patterns

### Options Pattern
```go
type Server struct {
    host string
    port int
    timeout time.Duration
}

type Option func(*Server)

func WithPort(port int) Option {
    return func(s *Server) {
        s.port = port
    }
}

func WithTimeout(timeout time.Duration) Option {
    return func(s *Server) {
        s.timeout = timeout
    }
}

func NewServer(host string, opts ...Option) *Server {
    s := &Server{
        host:    host,
        port:    8080,  // default
        timeout: 30 * time.Second,  // default
    }
    
    for _, opt := range opts {
        opt(s)
    }
    
    return s
}

// Usage
server := NewServer("localhost", WithPort(9000), WithTimeout(60*time.Second))
```

### Worker Pool
```go
func WorkerPool(jobs <-chan Job, results chan<- Result, workers int) {
    var wg sync.WaitGroup
    
    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobs {
                results <- process(job)
            }
        }()
    }
    
    wg.Wait()
    close(results)
}
```

## Common Pitfalls to Avoid

### Anti-Patterns
- ❌ Not checking errors
- ❌ Using panic for error handling
- ❌ Goroutine leaks (not waiting or canceling)
- ❌ Shared memory without synchronization
- ❌ Ignoring context cancellation

### Best Practices
- ✅ Always check and handle errors
- ✅ Use defer for cleanup
- ✅ Pass context to long-running operations
- ✅ Use channels for goroutine communication
- ✅ Profile before optimizing

## Resources

- [Effective Go](https://golang.org/doc/effective_go)
- [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)
- [Go Proverbs](https://go-proverbs.github.io/)
- [Uber Go Style Guide](https://github.com/uber-go/guide/blob/master/style.md)
