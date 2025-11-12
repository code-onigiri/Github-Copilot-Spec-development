# PHP Best Practices

This prompt provides guidance for writing functional and efficient PHP code.

## Core Principles

### Modern PHP (8.0+)
- Use strict types
- Use type declarations for parameters and return types
- Leverage constructor property promotion
- Use named arguments for clarity
- Follow PSR standards

```php
<?php

declare(strict_types=1);

namespace App\Service;

use App\Repository\UserRepositoryInterface;

final class UserService
{
    public function __construct(
        private readonly UserRepositoryInterface $repository,
        private readonly LoggerInterface $logger,
    ) {}
    
    public function getUser(string $id): ?User
    {
        return $this->repository->find($id);
    }
}
```

## Type System

```php
// Use strict types
declare(strict_types=1);

// Type declarations
function processUser(User $user, int $limit = 10): array
{
    // implementation
}

// Return type hints
function findUser(string $id): ?User
{
    return $this->repository->find($id);
}

// Union types (PHP 8.0+)
function process(int|float $number): string
{
    return (string) $number;
}

// Mixed type when necessary
function handle(mixed $data): void
{
    // handle any type
}
```

## Error Handling

```php
// Use exceptions
class UserNotFoundException extends Exception
{
    public function __construct(string $userId)
    {
        parent::__construct("User $userId not found");
    }
}

// Try-catch
try {
    $user = $this->userService->getUser($id);
} catch (UserNotFoundException $e) {
    $this->logger->error($e->getMessage());
    throw $e;
} finally {
    // cleanup
}

// Use finally for cleanup
$file = fopen('file.txt', 'r');
try {
    // process file
} finally {
    fclose($file);
}
```

## Dependency Injection

```php
// Constructor injection
class UserController
{
    public function __construct(
        private readonly UserService $userService,
        private readonly ValidatorInterface $validator,
    ) {}
    
    public function create(Request $request): Response
    {
        $data = $request->getParsedBody();
        
        $errors = $this->validator->validate($data, UserRules::class);
        if ($errors) {
            return new JsonResponse(['errors' => $errors], 400);
        }
        
        $user = $this->userService->createUser($data);
        return new JsonResponse($user, 201);
    }
}
```

## Testing with PHPUnit

```php
final class UserServiceTest extends TestCase
{
    private UserService $service;
    private MockObject $repository;
    
    protected function setUp(): void
    {
        $this->repository = $this->createMock(UserRepositoryInterface::class);
        $this->service = new UserService($this->repository);
    }
    
    public function testGetUserReturnsUser(): void
    {
        $expectedUser = new User('123', 'John');
        
        $this->repository
            ->expects($this->once())
            ->method('find')
            ->with('123')
            ->willReturn($expectedUser);
        
        $result = $this->service->getUser('123');
        
        $this->assertSame($expectedUser, $result);
    }
    
    /**
     * @dataProvider invalidUserIdProvider
     */
    public function testGetUserThrowsExceptionWithInvalidId(string $id): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->service->getUser($id);
    }
    
    public function invalidUserIdProvider(): array
    {
        return [
            [''],
            [' '],
        ];
    }
}
```

## Resources
- [PHP: The Right Way](https://phptherightway.com/)
- [PHP-FIG PSR Standards](https://www.php-fig.org/psr/)
- [Modern PHP](https://www.oreilly.com/library/view/modern-php/9781491905173/)
