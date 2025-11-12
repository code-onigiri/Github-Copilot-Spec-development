# Java Coding Rules

This prompt enforces industry-standard coding rules and conventions for Java development.

## Style Guide Compliance

### Google Java Style Guide
Follow the [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html) as the primary reference.

### Formatting
- 2 spaces for indentation (not tabs)
- 100 characters max line length
- K&R style braces (opening brace on same line)
- One statement per line
- Use Checkstyle or Spotless for enforcement

## Naming Conventions

### Case Styles
- **Classes/Interfaces**: `PascalCase` (e.g., `UserService`, `Runnable`)
- **Methods/Variables**: `camelCase` (e.g., `getUserName()`, `userId`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_SIZE`, `DEFAULT_TIMEOUT`)
- **Packages**: `lowercase` (e.g., `com.company.myapp.service`)
- **Type Parameters**: Single capital letter (e.g., `T`, `E`, `K`, `V`)

### Naming Rules
- Classes should be nouns: `User`, `OrderProcessor`
- Interfaces can be nouns or adjectives: `List`, `Runnable`, `Serializable`
- Methods should be verbs: `getName()`, `processOrder()`, `isValid()`
- Boolean methods: prefix with `is`, `has`, `can`: `isActive()`, `hasPermission()`
- Constants should be descriptive: `MAX_RETRY_COUNT`, not `MAX`

## Code Quality - Checkstyle

### Required Checks
```xml
<!-- checkstyle.xml -->
<?xml version="1.0"?>
<!DOCTYPE module PUBLIC
    "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
    "https://checkstyle.org/dtds/configuration_1_3.dtd">

<module name="Checker">
    <module name="TreeWalker">
        <!-- Naming -->
        <module name="TypeName"/>
        <module name="MethodName"/>
        <module name="ConstantName"/>
        <module name="LocalVariableName"/>
        <module name="ParameterName"/>
        
        <!-- Imports -->
        <module name="UnusedImports"/>
        <module name="IllegalImport"/>
        <module name="RedundantImport"/>
        
        <!-- Size Violations -->
        <module name="LineLength">
            <property name="max" value="100"/>
        </module>
        <module name="MethodLength">
            <property name="max" value="50"/>
        </module>
        
        <!-- Whitespace -->
        <module name="WhitespaceAfter"/>
        <module name="WhitespaceAround"/>
        
        <!-- Coding -->
        <module name="EmptyStatement"/>
        <module name="EqualsHashCode"/>
        <module name="SimplifyBooleanExpression"/>
        <module name="SimplifyBooleanReturn"/>
    </module>
</module>
```

### SpotBugs/PMD
```xml
<!-- pom.xml -->
<plugin>
    <groupId>com.github.spotbugs</groupId>
    <artifactId>spotbugs-maven-plugin</artifactId>
    <version>4.7.3.0</version>
    <configuration>
        <effort>Max</effort>
        <threshold>Low</threshold>
    </configuration>
</plugin>
```

## Exception Handling Rules

### Exception Types
- Use checked exceptions for recoverable conditions
- Use unchecked exceptions for programming errors
- Never catch `Throwable` or `Error`
- Always include cause when wrapping exceptions

```java
// ✅ Correct
try {
    processData();
} catch (IOException e) {
    throw new DataProcessingException("Failed to process data", e);
}

// ❌ Incorrect
try {
    processData();
} catch (Exception e) {
    // Too broad
}
```

### Required Patterns
- Never return null for collections - return empty collections
- Use Optional for nullable return values
- Clean up resources with try-with-resources
- Document all exceptions with @throws

## Testing Requirements

### JUnit 5 Standards
```java
@Test
@DisplayName("Description of test")
void testMethod() {
    // Arrange, Act, Assert
}

@ParameterizedTest
@MethodSource("provideTestData")
void parameterizedTest(String input, String expected) {
    assertEquals(expected, process(input));
}
```

### Coverage Requirements
- Minimum 80% line coverage
- 100% coverage for critical paths
- Test all public methods
- Test edge cases and error conditions

### Naming Conventions
- Test classes: `ClassNameTest`
- Test methods: `shouldDoSomethingWhenCondition()`
- Use `@DisplayName` for readable descriptions

## Documentation Standards

### JavaDoc Requirements
```java
/**
 * Brief description of the class.
 *
 * <p>Detailed description with usage examples.
 *
 * @author Author Name
 * @since 1.0
 */
public class MyClass {
    /**
     * Brief description of method.
     *
     * @param param1 description of param1
     * @param param2 description of param2
     * @return description of return value
     * @throws IOException if I/O error occurs
     * @since 1.0
     */
    public String myMethod(String param1, int param2) throws IOException {
        // implementation
    }
}
```

## Maven/Gradle Standards

### Maven pom.xml
```xml
<properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
```

### Gradle build.gradle
```gradle
java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

tasks.withType(JavaCompile) {
    options.encoding = 'UTF-8'
}
```

## CI/CD Requirements

```yaml
# .github/workflows/ci.yml
name: Java CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
      
      - name: Build
        run: mvn clean install
      
      - name: Test
        run: mvn test
      
      - name: Checkstyle
        run: mvn checkstyle:check
      
      - name: SpotBugs
        run: mvn spotbugs:check
```

## Code Review Checklist

- [ ] Follows Google Java Style Guide
- [ ] All public APIs have JavaDoc
- [ ] No checked exceptions for programming errors
- [ ] try-with-resources used for all AutoCloseable
- [ ] No raw types (use generics)
- [ ] Equals and hashCode implemented together
- [ ] toString() implemented for debugging
- [ ] Thread-safety documented
- [ ] Unit tests with 80%+ coverage
- [ ] No compiler warnings
