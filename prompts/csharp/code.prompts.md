# C# Best Practices

This prompt provides guidance for writing functional and efficient C# code.

## Core Principles

### Modern C# Features
- Use nullable reference types (C# 8.0+)
- Use pattern matching and switch expressions
- Use records for immutable data
- Leverage LINQ for collection operations
- Use async/await for asynchronous operations

### Naming and Style
- PascalCase for public members, types, namespaces
- camelCase with _ prefix for private fields
- Use meaningful, descriptive names
- Follow Microsoft C# Coding Conventions

```csharp
// ✅ Correct naming
public class UserService
{
    private readonly IUserRepository _repository;
    private readonly ILogger<UserService> _logger;
    
    public async Task<User?> GetUserAsync(string userId)
    {
        return await _repository.FindByIdAsync(userId);
    }
}
```

## Async/Await Patterns

```csharp
// Always use async/await for I/O operations
public async Task<List<User>> GetUsersAsync()
{
    return await _dbContext.Users.ToListAsync();
}

// Use ValueTask for frequently called methods
public async ValueTask<int> GetCountAsync()
{
    return await _cache.GetOrCreateAsync("count", async entry =>
    {
        return await _dbContext.Users.CountAsync();
    });
}

// ConfigureAwait in libraries
public async Task ProcessAsync()
{
    var data = await FetchDataAsync().ConfigureAwait(false);
    await SaveDataAsync(data).ConfigureAwait(false);
}
```

## LINQ and Collections

```csharp
// Use LINQ for readable transformations
var activeUsers = users
    .Where(u => u.IsActive)
    .OrderBy(u => u.Name)
    .Select(u => new UserDto(u.Id, u.Name))
    .ToList();

// Use IEnumerable for deferred execution
public IEnumerable<User> GetActiveUsers()
{
    return _dbContext.Users.Where(u => u.IsActive);
}

// Use List<T> when materializing
public List<User> GetUserList()
{
    return _dbContext.Users.ToList();
}
```

## Dependency Injection

```csharp
// Constructor injection (preferred)
public class UserService
{
    private readonly IUserRepository _repository;
    private readonly ILogger<UserService> _logger;
    
    public UserService(
        IUserRepository repository,
        ILogger<UserService> logger)
    {
        _repository = repository;
        _logger = logger;
    }
}

// Register services
services.AddScoped<IUserService, UserService>();
services.AddSingleton<ICacheService, CacheService>();
services.AddTransient<IEmailService, EmailService>();
```

## Error Handling

```csharp
// Use specific exceptions
public User GetUser(string id)
{
    var user = _repository.FindById(id);
    if (user == null)
    {
        throw new UserNotFoundException($"User {id} not found");
    }
    return user;
}

// Custom exceptions
public class UserNotFoundException : Exception
{
    public string UserId { get; }
    
    public UserNotFoundException(string message, string userId)
        : base(message)
    {
        UserId = userId;
    }
}
```

## Resource Management

```csharp
// Use using statements
using var stream = File.OpenRead("file.txt");
using var reader = new StreamReader(stream);
var content = await reader.ReadToEndAsync();

// Or using blocks
using (var connection = new SqlConnection(connectionString))
{
    await connection.OpenAsync();
    // Use connection
}
```

## Testing with xUnit

```csharp
public class UserServiceTests
{
    private readonly Mock<IUserRepository> _mockRepository;
    private readonly UserService _service;
    
    public UserServiceTests()
    {
        _mockRepository = new Mock<IUserRepository>();
        _service = new UserService(_mockRepository.Object);
    }
    
    [Fact]
    public async Task GetUser_ReturnsUser_WhenExists()
    {
        // Arrange
        var expectedUser = new User { Id = "123", Name = "John" };
        _mockRepository
            .Setup(r => r.FindByIdAsync("123"))
            .ReturnsAsync(expectedUser);
        
        // Act
        var result = await _service.GetUserAsync("123");
        
        // Assert
        Assert.NotNull(result);
        Assert.Equal("John", result.Name);
    }
    
    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public async Task GetUser_ThrowsException_WhenIdInvalid(string id)
    {
        await Assert.ThrowsAsync<ArgumentException>(
            () => _service.GetUserAsync(id));
    }
}
```

## Modern C# Features

### Records (C# 9.0+)
```csharp
// Immutable data
public record User(string Id, string Name, string Email);

// With validation
public record User(string Id, string Name)
{
    public User(string Id, string Name) : this(Id, Name)
    {
        if (string.IsNullOrEmpty(Id))
            throw new ArgumentException(nameof(Id));
    }
}
```

### Pattern Matching
```csharp
// Switch expressions
var message = user switch
{
    { IsActive: true, Role: "Admin" } => "Active admin",
    { IsActive: true } => "Active user",
    { IsActive: false } => "Inactive user",
    _ => "Unknown"
};

// Property patterns
if (user is { IsActive: true, Age: >= 18 })
{
    // Process adult active user
}
```

### Nullable Reference Types
```csharp
#nullable enable

public class UserService
{
    // User? indicates nullable
    public User? FindUser(string id)
    {
        return _repository.Find(id);
    }
    
    // User indicates non-nullable
    public User GetUser(string id)
    {
        return _repository.Find(id)
            ?? throw new UserNotFoundException(id);
    }
}
```

## Resources
- [C# Coding Conventions](https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions)
- [.NET API Design Guidelines](https://docs.microsoft.com/en-us/dotnet/standard/design-guidelines/)
- [Effective C#](https://www.oreilly.com/library/view/effective-c-50/9780134579290/)
