# Kotlin Best Practices

This prompt provides guidance for writing functional and efficient Kotlin code.

## Core Principles

### Idiomatic Kotlin
- Use data classes for data holders
- Use extension functions for utility methods
- Leverage null safety
- Use coroutines for asynchronous operations
- Follow Kotlin coding conventions

```kotlin
// Data class
data class User(
    val id: String,
    val name: String,
    val email: String
) {
    fun isValid(): Boolean = email.isNotEmpty() && email.contains("@")
}

// Extension function
fun String.isValidEmail(): Boolean = contains("@") && isNotEmpty()

// Null safety
fun processUser(user: User?) {
    user?.let { safeUser ->
        println(safeUser.name)
    }
}
```

## Coroutines

```kotlin
// Suspend functions
suspend fun fetchUser(id: String): User {
    return withContext(Dispatchers.IO) {
        repository.find(id)
    }
}

// Async operations
suspend fun fetchMultipleUsers(ids: List<String>): List<User> {
    return coroutineScope {
        ids.map { id ->
            async { fetchUser(id) }
        }.awaitAll()
    }
}

// Flow for streams
fun observeUsers(): Flow<List<User>> = flow {
    while (true) {
        val users = repository.getAll()
        emit(users)
        delay(5000)
    }
}
```

## Testing with JUnit

```kotlin
class UserServiceTest {
    private lateinit var service: UserService
    private lateinit var mockRepository: UserRepository
    
    @BeforeEach
    fun setUp() {
        mockRepository = mockk()
        service = UserService(mockRepository)
    }
    
    @Test
    fun `getUser returns user when exists`() = runTest {
        // Given
        val expectedUser = User("123", "John", "john@example.com")
        coEvery { mockRepository.find("123") } returns expectedUser
        
        // When
        val result = service.getUser("123")
        
        // Then
        assertEquals(expectedUser, result)
    }
}
```

## Resources
- [Kotlin Coding Conventions](https://kotlinlang.org/docs/coding-conventions.html)
- [Kotlin Coroutines Guide](https://kotlinlang.org/docs/coroutines-guide.html)
