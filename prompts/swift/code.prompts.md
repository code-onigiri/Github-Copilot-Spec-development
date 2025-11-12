# Swift Best Practices

This prompt provides guidance for writing functional and efficient Swift code.

## Core Principles

### Modern Swift
- Use value types (structs) by default
- Use optionals for nullable values
- Leverage type inference
- Use protocol-oriented programming
- Follow Swift naming conventions

```swift
// Value types
struct User {
    let id: String
    let name: String
    let email: String
    
    var isValid: Bool {
        !email.isEmpty && email.contains("@")
    }
}

// Protocol-oriented
protocol UserServiceProtocol {
    func getUser(id: String) async throws -> User
}

final class UserService: UserServiceProtocol {
    private let repository: UserRepository
    
    init(repository: UserRepository) {
        self.repository = repository
    }
    
    func getUser(id: String) async throws -> User {
        try await repository.find(id)
    }
}
```

## Optionals and Error Handling

```swift
// Optional binding
if let user = findUser(id: "123") {
    print(user.name)
}

// Guard for early returns
func processUser(_ user: User?) {
    guard let user = user else { return }
    // process user
}

// Optional chaining
let city = user?.address?.city

// Nil coalescing
let name = user?.name ?? "Anonymous"

// Error handling
enum UserError: Error {
    case notFound(id: String)
    case invalidData
}

func getUser(id: String) throws -> User {
    guard let user = repository.find(id) else {
        throw UserError.notFound(id: id)
    }
    return user
}
```

## Async/Await

```swift
// Async functions
func fetchUser(id: String) async throws -> User {
    let url = URL(string: "https://api.example.com/users/\(id)")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(User.self, from: data)
}

// Task groups for parallel operations
func fetchMultipleUsers(ids: [String]) async throws -> [User] {
    try await withThrowingTaskGroup(of: User.self) { group in
        for id in ids {
            group.addTask {
                try await self.fetchUser(id: id)
            }
        }
        
        var users: [User] = []
        for try await user in group {
            users.append(user)
        }
        return users
    }
}
```

## Testing with XCTest

```swift
final class UserServiceTests: XCTestCase {
    var sut: UserService!
    var mockRepository: MockUserRepository!
    
    override func setUp() {
        super.setUp()
        mockRepository = MockUserRepository()
        sut = UserService(repository: mockRepository)
    }
    
    func testGetUser_ReturnsUser_WhenExists() async throws {
        // Given
        let expectedUser = User(id: "123", name: "John", email: "john@example.com")
        mockRepository.users = ["123": expectedUser]
        
        // When
        let user = try await sut.getUser(id: "123")
        
        // Then
        XCTAssertEqual(user.id, "123")
        XCTAssertEqual(user.name, "John")
    }
}
```

## SwiftUI Best Practices

```swift
struct UserListView: View {
    @StateObject private var viewModel = UserListViewModel()
    
    var body: some View {
        List(viewModel.users) { user in
            UserRow(user: user)
        }
        .task {
            await viewModel.loadUsers()
        }
    }
}

@MainActor
final class UserListViewModel: ObservableObject {
    @Published private(set) var users: [User] = []
    private let service: UserServiceProtocol
    
    init(service: UserServiceProtocol = UserService()) {
        self.service = service
    }
    
    func loadUsers() async {
        do {
            users = try await service.getUsers()
        } catch {
            // Handle error
        }
    }
}
```

## Resources
- [Swift API Design Guidelines](https://swift.org/documentation/api-design-guidelines/)
- [Swift Programming Language](https://docs.swift.org/swift-book/)
