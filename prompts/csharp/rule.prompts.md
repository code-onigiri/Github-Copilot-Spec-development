# C# Coding Rules

This prompt enforces industry-standard coding rules and conventions for C# development.

## Style Guide Compliance

Follow [Microsoft C# Coding Conventions](https://docs.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions).

### EditorConfig
```ini
# .editorconfig
root = true

[*.cs]
indent_style = space
indent_size = 4
end_of_line = crlf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

# Naming conventions
dotnet_naming_rule.interfaces_must_be_pascal_cased_and_prefixed_with_I.severity = error
dotnet_naming_rule.interfaces_must_be_pascal_cased_and_prefixed_with_I.symbols = interface_symbols
dotnet_naming_rule.interfaces_must_be_pascal_cased_and_prefixed_with_I.style = IPascalCase

# Code quality
dotnet_diagnostic.CA1000.severity = error  # Do not declare static members on generic types
dotnet_diagnostic.CA1031.severity = warning # Do not catch general exception types
dotnet_diagnostic.CA1062.severity = error  # Validate arguments of public methods
```

## Naming Conventions

- **Namespaces**: `PascalCase` - `Company.Product.Feature`
- **Classes/Interfaces**: `PascalCase` - `UserService`, `IUserRepository`
- **Methods**: `PascalCase` - `GetUser()`, `ProcessOrder()`
- **Properties**: `PascalCase` - `UserName`, `IsActive`
- **Fields (private)**: `_camelCase` - `_userId`, `_logger`
- **Constants**: `PascalCase` - `MaxRetryCount`
- **Local variables**: `camelCase` - `userId`, `userName`

## Code Analysis Rules

### Required Analyzers
```xml
<ItemGroup>
  <PackageReference Include="Microsoft.CodeAnalysis.NetAnalyzers" Version="7.0.0">
    <PrivateAssets>all</PrivateAssets>
    <IncludeAssets>runtime; build; native; contentfiles; analyzers</IncludeAssets>
  </PackageReference>
  <PackageReference Include="StyleCop.Analyzers" Version="1.2.0-beta.435">
    <PrivateAssets>all</PrivateAssets>
    <IncludeAssets>runtime; build; native; contentfiles; analyzers</IncludeAssets>
  </PackageReference>
</ItemGroup>

<PropertyGroup>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  <Nullable>enable</Nullable>
  <LangVersion>latest</LangVersion>
</PropertyGroup>
```

## Testing Requirements

### xUnit Standards
- Test class naming: `ClassNameTests`
- Test method naming: `MethodName_Scenario_ExpectedResult`
- Minimum 80% code coverage
- Use Fluent Assertions for readable assertions

```csharp
[Fact]
public async Task GetUser_ReturnsUser_WhenUserExists()
{
    // Arrange, Act, Assert
}
```

## CI/CD Requirements

```yaml
name: .NET CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '7.0.x'
      - run: dotnet restore
      - run: dotnet build --no-restore
      - run: dotnet test --no-build --verbosity normal
      - run: dotnet format --verify-no-changes
```

## Code Review Checklist

- [ ] Follows Microsoft C# Coding Conventions
- [ ] Nullable reference types enabled
- [ ] All public APIs have XML documentation
- [ ] Async methods use Async suffix
- [ ] IDisposable implemented correctly
- [ ] No compiler warnings
- [ ] StyleCop rules pass
- [ ] Unit tests with 80%+ coverage
