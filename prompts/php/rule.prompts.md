# PHP Coding Rules

This prompt enforces industry-standard coding rules and conventions for PHP development.

## Style Guide Compliance

Follow [PSR-12: Extended Coding Style](https://www.php-fig.org/psr/psr-12/).

### PHP CS Fixer
```php
// .php-cs-fixer.php
<?php

$finder = PhpCsFixer\Finder::create()
    ->in(__DIR__)
    ->exclude('vendor');

return (new PhpCsFixer\Config())
    ->setRules([
        '@PSR12' => true,
        'strict_param' => true,
        'array_syntax' => ['syntax' => 'short'],
        'declare_strict_types' => true,
    ])
    ->setFinder($finder);
```

## Naming Conventions

- **Classes**: `PascalCase` - `UserService`, `ApiClient`
- **Methods**: `camelCase` - `getUser()`, `processOrder()`
- **Properties**: `camelCase` - `$userName`, `$isActive`
- **Constants**: `UPPER_SNAKE_CASE` - `MAX_SIZE`
- **Namespaces**: `PascalCase` - `App\Service\User`

## Required Checks

```bash
# Format
vendor/bin/php-cs-fixer fix

# Static analysis
vendor/bin/phpstan analyze

# Tests
vendor/bin/phpunit

# Security
composer audit
```

## Testing Requirements

- Minimum 80% code coverage
- Use PHPUnit for unit tests
- Use data providers for multiple test cases
- Mock dependencies with PHPUnit mocks

## CI/CD Requirements

```yaml
name: PHP CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
      - run: composer install
      - run: vendor/bin/php-cs-fixer fix --dry-run
      - run: vendor/bin/phpstan analyze
      - run: vendor/bin/phpunit --coverage-text
```
