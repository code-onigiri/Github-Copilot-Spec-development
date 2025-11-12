# Java Best Practices

This prompt provides guidance for writing functional and efficient Java code.

## Core Principles

### Object-Oriented Design
- Follow SOLID principles
- Favor composition over inheritance
- Use interfaces for abstraction
- Keep classes focused and cohesive (Single Responsibility Principle)
- Design for testability

### Immutability
- Prefer immutable objects when possible
- Use `final` keyword for variables, parameters, and class members
- Use `record` classes (Java 14+) for immutable data holders
- Avoid mutable static fields

```java
// ✅ Correct: Immutable class
public final class User {
    private final String id;
    private final String name;
    
    public User(String id, String name) {
        this.id = Objects.requireNonNull(id);
        this.name = Objects.requireNonNull(name);
    }
    
    public String getId() { return id; }
    public String getName() { return name; }
}

// Or use record (Java 14+)
public record User(String id, String name) {
    public User {
        Objects.requireNonNull(id);
        Objects.requireNonNull(name);
    }
}
```

### Exception Handling
- Use checked exceptions for recoverable conditions
- Use unchecked exceptions for programming errors
- Always include meaningful error messages
- Clean up resources with try-with-resources
- Never catch and ignore exceptions

```java
// ✅ Correct: try-with-resources
try (BufferedReader reader = new BufferedReader(new FileReader(path))) {
    return reader.lines().collect(Collectors.toList());
} catch (IOException e) {
    throw new RuntimeException("Failed to read file: " + path, e);
}

// ✅ Correct: Custom exceptions
public class ValidationException extends Exception {
    public ValidationException(String message) {
        super(message);
    }
}
```

### Streams and Functional Programming
- Use Stream API for collection operations
- Prefer method references over lambda expressions when possible
- Use Optional to avoid null checks
- Keep lambda expressions short and readable

```java
// Stream operations
List<String> activeUserNames = users.stream()
    .filter(User::isActive)
    .map(User::getName)
    .sorted()
    .collect(Collectors.toList());

// Optional usage
Optional<User> user = findUser(id);
String name = user.map(User::getName).orElse("Unknown");
```

## Code Organization

### Package Structure
```
com.company.myapp/
  config/           # Configuration classes
  controller/       # REST controllers (Spring)
  service/          # Business logic
  repository/       # Data access
  model/            # Domain models
    entity/         # JPA entities
    dto/            # Data transfer objects
  exception/        # Custom exceptions
  util/             # Utility classes
```

### Class Design
- One public class per file
- Class name matches file name
- Keep classes under 300 lines
- Maximum method length: 50 lines
- Use inner classes sparingly

## Best Practices

### Null Safety
```java
// Use Objects methods
Objects.requireNonNull(value, "value must not be null");

// Use Optional for return values that might be null
public Optional<User> findUser(String id) {
    // Return Optional.of, Optional.empty, or Optional.ofNullable
}

// Never return null for collections
public List<User> getUsers() {
    return users != null ? users : Collections.emptyList();
}
```

### Collection Operations
```java
// Use appropriate collection types
List<String> list = new ArrayList<>();  // Random access
Set<String> set = new HashSet<>();      // Uniqueness
Map<String, User> map = new HashMap<>(); // Key-value

// Use unmodifiable collections
List<String> immutableList = Collections.unmodifiableList(list);
List<String> immutableList2 = List.of("a", "b", "c"); // Java 9+

// Use Stream API
List<String> filtered = list.stream()
    .filter(s -> s.startsWith("A"))
    .collect(Collectors.toList());
```

### Resource Management
```java
// Always use try-with-resources
try (Connection conn = dataSource.getConnection();
     PreparedStatement stmt = conn.prepareStatement(sql)) {
    // Use connection and statement
} // Automatically closed

// For custom resources, implement AutoCloseable
public class MyResource implements AutoCloseable {
    @Override
    public void close() {
        // Cleanup code
    }
}
```

## Concurrency

### Thread-Safe Code
```java
// Use concurrent collections
Map<String, User> cache = new ConcurrentHashMap<>();
List<String> list = new CopyOnWriteArrayList<>();

// Synchronize when necessary
public synchronized void increment() {
    count++;
}

// Or use locks for finer control
private final ReentrantLock lock = new ReentrantLock();

public void update() {
    lock.lock();
    try {
        // Update state
    } finally {
        lock.unlock();
    }
}
```

### CompletableFuture
```java
// Async operations
CompletableFuture<User> future = CompletableFuture.supplyAsync(() -> {
    return fetchUser(id);
});

// Chaining operations
future
    .thenApply(user -> user.getName())
    .thenAccept(name -> System.out.println(name))
    .exceptionally(ex -> {
        log.error("Failed to fetch user", ex);
        return null;
    });

// Combining futures
CompletableFuture<User> userFuture = fetchUserAsync(id);
CompletableFuture<List<Order>> ordersFuture = fetchOrdersAsync(id);

CompletableFuture.allOf(userFuture, ordersFuture)
    .thenRun(() -> {
        User user = userFuture.join();
        List<Order> orders = ordersFuture.join();
        // Process both
    });
```

## Testing

### JUnit 5
```java
@Test
@DisplayName("Should create user with valid data")
void shouldCreateUserWithValidData() {
    // Arrange
    String name = "John Doe";
    String email = "john@example.com";
    
    // Act
    User user = userService.createUser(name, email);
    
    // Assert
    assertNotNull(user.getId());
    assertEquals(name, user.getName());
    assertEquals(email, user.getEmail());
}

@ParameterizedTest
@ValueSource(strings = {"", " ", "invalid-email"})
void shouldRejectInvalidEmail(String email) {
    assertThrows(ValidationException.class, () -> {
        userService.createUser("John", email);
    });
}
```

### Mocking with Mockito
```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    private UserRepository repository;
    
    @InjectMocks
    private UserService service;
    
    @Test
    void shouldFindUser() {
        // Given
        String id = "123";
        User expectedUser = new User(id, "John");
        when(repository.findById(id)).thenReturn(Optional.of(expectedUser));
        
        // When
        Optional<User> result = service.findUser(id);
        
        // Then
        assertTrue(result.isPresent());
        assertEquals(expectedUser, result.get());
        verify(repository).findById(id);
    }
}
```

## Common Patterns

### Builder Pattern
```java
public class User {
    private final String id;
    private final String name;
    private final String email;
    
    private User(Builder builder) {
        this.id = builder.id;
        this.name = builder.name;
        this.email = builder.email;
    }
    
    public static class Builder {
        private String id;
        private String name;
        private String email;
        
        public Builder id(String id) {
            this.id = id;
            return this;
        }
        
        public Builder name(String name) {
            this.name = name;
            return this;
        }
        
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        
        public User build() {
            Objects.requireNonNull(id);
            Objects.requireNonNull(name);
            return new User(this);
        }
    }
}

// Usage
User user = new User.Builder()
    .id("123")
    .name("John")
    .email("john@example.com")
    .build();
```

### Dependency Injection (Spring)
```java
@Service
public class UserService {
    private final UserRepository repository;
    private final EmailService emailService;
    
    // Constructor injection (preferred)
    public UserService(UserRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }
    
    public User createUser(CreateUserRequest request) {
        User user = repository.save(new User(request));
        emailService.sendWelcomeEmail(user);
        return user;
    }
}
```

## Performance Optimization

### String Handling
```java
// Use StringBuilder for concatenation
StringBuilder sb = new StringBuilder();
for (String s : strings) {
    sb.append(s);
}
String result = sb.toString();

// Use String.format or formatted (Java 15+) sparingly
String message = String.format("User %s logged in", userName);
```

### Lazy Initialization
```java
// Lazy initialization with volatile (thread-safe)
private volatile UserCache cache;

public UserCache getCache() {
    if (cache == null) {
        synchronized (this) {
            if (cache == null) {
                cache = new UserCache();
            }
        }
    }
    return cache;
}
```

## Resources

- [Effective Java (3rd Edition)](https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/)
- [Java Code Conventions](https://www.oracle.com/java/technologies/javase/codeconventions-contents.html)
- [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)
- [Spring Framework Best Practices](https://spring.io/guides)
