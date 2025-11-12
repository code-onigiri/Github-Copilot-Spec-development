id: mcp-server-generator
author: aggregation
language: kotlin
version: 0.2.0
category: generation
source: github/awesome-copilot
license: MIT (upstream) / MIT (this repo)
origin_url: https://github.com/github/awesome-copilot
upstream_commit: 17a3ac59314178f4bf4880681dee7b043687a2c8
checksum: 8bbfb940da992fbef7fb798b4581b74c3524cc625015218d2da65fdf116fd67d
examples_hash: f5153122f05db10cb0c0217b057d739b7027083dae44b8033942a3ee0f537fbc
last_synced: 2025-11-12T00:00:00Z

# Kotlin MCP Server Generator

## Mission

与えられた `packageName` と名前群から **coroutines + buildJsonObject schema DSL + sealed Result 型 + multiplatform 対応 + テスト** を備えた最小 Kotlin MCP サーバー骨格を生成せよ。

## Inputs

| name        | type   | required | description                             |
| ----------- | ------ | -------- | --------------------------------------- |
| packageName | string | yes      | ベースパッケージ (com.example.mcp 形式) |
| toolName    | string | yes      | 生成ツール名                            |
| promptName  | string | yes      | 生成プロンプト名                        |
| description | string | no       | 概要                                    |

## Input Validation & Discovery

> **Source**: Integrated from github/awesome-copilot prompt-builder.prompt.md

Before generation, validate all inputs and clarify ambiguities:

1. **packageName Validation**:

   - Must match `[a-z][a-z0-9\.]*` (Kotlin package pattern)
   - No spaces, no uppercase, must be valid package name
   - If invalid, halt and request valid example (e.g., com.example.mcp)

2. **toolName Validation**:

   - Non-empty, starts with a letter, only alphanumeric and hyphens
   - If ambiguous, ask for clarification

3. **promptName Validation**:

   - Non-empty, kebab-case preferred
   - If missing semantic meaning, request descriptive name

4. **description Validation**:
   - If empty or too vague (<10 words), request minimum 10-word description for README

**Failure Trigger**: If any required input invalid after 2 clarification attempts, halt with detailed error message listing all validation failures.

## Codebase Consistency Check

> **Source**: Integrated from github/awesome-copilot copilot-instructions-blueprint-generator.prompt.md

Before generating code, scan workspace for existing Kotlin MCP servers and match their patterns:

1. **Search for Existing MCP Servers**:

   - Declare intent before tool use: "Searching workspace for existing Kotlin MCP server implementations to extract consistent patterns..."
   - Search for: build.gradle.kts, src/commonMain/kotlin, src/commonTest/kotlin
   - If found, analyze: package structure, error handling style, logging approach, test organization

2. **Extract Patterns**:

   - Naming conventions: camelCase for methods, kebab-case for prompts
   - Error handling: sealed Result, custom exceptions
   - Logging: println vs logger, log levels used
   - Test organization: kotest, runTest

3. **Apply Patterns to New Code**:

   - Match existing indentation style (4 spaces vs tabs)
   - Follow import ordering (stdlib → external → internal)
   - Use same dependency injection approach
   - Mirror file organization (flat vs nested)

4. **Never Introduce New Patterns**:
   - If codebase uses println, don't add logger
   - If tests use kotest, don't generate JUnit

**Principle**: Consistency with existing codebase > external best practices.

## Tool Usage Declaration

> **Source**: Integrated from github/awesome-copilot taming-copilot.instructions.md

Before executing any tool, declare intent with concise statement immediately preceding tool call:

1. **File Search**:

   - "Searching workspace for existing Kotlin MCP server patterns..."
   - Tool: search/codebase with pattern `**/*.kt` + build.gradle.kts

2. **File Creation**:

   - "Creating Kotlin MCP server at src/commonMain/kotlin/Server.kt with handler for: ${toolName}..."
   - Tool: edit/createFile with path src/commonMain/kotlin/Server.kt

3. **Lint Validation**:

   - "Running lint validation with ktlint/detekt (zero tolerance mode)..."
   - Tool: runCommands with `./gradlew ktlintCheck detekt`

4. **Test Execution**:
   - "Executing test suite with kotest to verify handlers and input validation..."
   - Tool: runCommands with `./gradlew test`

**Purposeful Action Rule**: Every tool invocation must directly fulfill user request. Never search/modify unrelated files.

## Workflow

## Workflow

1. Validate: packageName が `[a-z][a-z0-9\.]*` パターン。
2. ファイルツリー定義: Gradle build.gradle.kts (Kotlin Multiplatform) / src/commonMain/kotlin / src/commonTest/kotlin。
3. `build.gradle.kts` 生成: Kotlin 1.9+, serialization, coroutines, kotlinx-datetime, Ktor (optional SSE transport)。
4. `Server.kt`: MCP server 初期化, tool/prompt 登録 (buildJsonObject schema)。
5. `Tools.kt`: suspend tool handler (greet / divide) + sealed Result 型。
6. `Prompts.kt`: suspend prompt handler (code-review) + validation。
7. `Config.kt`: data class for server 設定。
8. テスト: `ServerTest.kt` (runTest, greet OK / divide by zero)。
9. README Excerpt (./gradlew run / test)。
10. すべて Markdown セクション化し出力。

## Output

- File Tree
- build.gradle.kts
- src/commonMain/kotlin/Server.kt
- src/commonMain/kotlin/Tools.kt
- src/commonMain/kotlin/Prompts.kt
- src/commonMain/kotlin/Config.kt
- src/commonTest/kotlin/ServerTest.kt
- README excerpt

## Validation

### Required Checks

- packageName 不正時: 明示エラー
- Tool handler で null/blank input → Result.Error("bad_request")
- Divide by zero → Result.Error("divide_by_zero")
- テスト必須: runTest + assertEquals(Result.Error(...))
- Nullable 過剰使用回避 (!! 禁止)
- **Lint: `./gradlew ktlintCheck detekt` がゼロエラー必須**
- **Format: `./gradlew ktlintFormat` で自動整形**
- **Style: [Kotlin Coding Conventions](https://kotlinlang.org/docs/coding-conventions.html) 準拠 (4 space, camelCase)**

### Commands

```bash
./gradlew build                # Compilation + tests
./gradlew test                 # All kotest tests pass
./gradlew ktlintCheck          # ktlint style verification
./gradlew detekt               # Complexity + code smells (threshold 25)
./gradlew koverReport          # Coverage report (aim >80%)
```

### Edge Cases

- `!!` operator → detekt error (NullSafety rule)
- Long method (>25 lines) → detekt LongMethod error
- Nested blocks >4 levels → detekt NestedBlockDepth error
- Magic number → detekt MagicNumber warning (use const)
- Sealed class 未処理 branch → compiler exhaustiveness check

### Failure Modes

- **Force unwrap**: `value!!` → detekt error, use `?.let` or `?:`
- **Cognitive complexity >25**: 条件分岐多すぎ → detekt CognitiveComplexity
- **Too many functions (>15)**: クラス肥大化 → detekt TooManyFunctions
- **Missing kdoc**: public function without doc → detekt UndocumentedPublicFunction

### Failure Triggers (Halt Generation)

> **Source**: Integrated from github/awesome-copilot prompt.instructions.md Quality Assurance Checklist

Generation must halt immediately if any of the following occur:

1. **Input Validation Failures** (after 2 retry attempts):

   - packageName still invalid after clarification
   - toolName empty or invalid after correction
   - promptName remains semantically meaningless

2. **Lint Errors Exceed Threshold** (after 3 auto-fix attempts):

   - ktlintCheck/detekt run exits with >0 errors
   - ktlintFormat reports diffs after auto-fix

3. **Type Safety Violations** (no retries, immediate halt):

   - !! operator, long method, nested blocks, missing kdoc

4. **Tool Access Denied** (no retries):

   - search/codebase permission denied
   - edit/createFile fails due to file system restrictions
   - runCommands blocked by security policy

5. **Test Failures** (after 3 fix attempts):

   - gradlew test exits with non-zero code
   - Coverage below 80% threshold
   - Timeout errors (tests exceed 30s per suite)

6. **Validation Command Failures** (3 consecutive failures):
   - gradlew build reports compilation errors
   - ktlintFormat reports diffs after auto-fix

**Error Reporting Format**:

```markdown
❌ **Generation Halted**

**Reason**: [Failure Trigger Category]
**Details**: [Specific error message with file:line references]
**Attempted Fixes**: [List of auto-fix commands executed]
**Manual Action Required**: [Step-by-step resolution guide]

**Context**:

- Input: packageName="${packageName}", toolName="${toolName}", promptName="${promptName}"
- Retry Count: X/3
```

**Success Criteria** (all must pass):

- [ ] All input validations passed
- [ ] Lint errors = 0
- [ ] Tests pass with coverage ≥80%
- [ ] ktlintFormat reports no diffs
- [ ] No !! operator, long method, nested blocks, missing kdoc
- [ ] All error cases covered in tests

## Project Structure

```text
<project>/
  build.gradle.kts
  src/
	commonMain/
	  kotlin/
		<package>/
		  Server.kt
		  Tools.kt
		  Prompts.kt
		  Config.kt
	commonTest/
	  kotlin/
		<package>/
		  ServerTest.kt
  README.md (excerpt)
```

## build.gradle.kts (Template)

```kotlin
plugins {
	kotlin("multiplatform") version "1.9.20"
	kotlin("plugin.serialization") version "1.9.20"
}
group = "{{packageName}}"
version = "0.1.0"
repositories { mavenCentral() }
kotlin {
	jvm { withJava() }
	js(IR) { nodejs() }
	sourceSets {
		val commonMain by getting {
			dependencies {
				implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
				implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.0")
				implementation("io.github.oshai:kotlin-logging:5.1.0")
			}
		}
		val commonTest by getting {
			dependencies {
				implementation(kotlin("test"))
				implementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.7.3")
			}
		}
	}
}
```

## Server.kt

```kotlin
package {{packageName}}
import kotlinx.serialization.json.*
import mu.KotlinLogging
private val logger = KotlinLogging.logger {}
fun createServer(config: Config) {
	logger.info { "Starting MCP server: ${config.name}" }
	// Pseudo registration
	// server.tool("greet", input = buildJsonObject {
	//   put("type", "object")
	//   put("properties", buildJsonObject {
	//     put("name", buildJsonObject { put("type", "string") })
	//   })
	// }, handler = { Tools.greet(it) })
	// server.tool("divide", ..., handler = { Tools.divide(it) })
	// server.prompt("code-review", ..., handler = { Prompts.codeReview(it) })
	logger.info { "Server ready" }
}
```

## Tools.kt

```kotlin
package {{packageName}}
import kotlinx.serialization.json.*
sealed class Result<out T> {
	data class Success<T>(val value: T) : Result<T>()
	data class Error(val message: String) : Result<Nothing>()
}
suspend fun greet(input: JsonObject): Result<String> {
	val name = input["name"]?.jsonPrimitive?.content
	if (name.isNullOrBlank()) return Result.Error("bad_request: name required")
	return Result.Success("Hello $name")
}
suspend fun divide(input: JsonObject): Result<Double> {
	val a = input["a"]?.jsonPrimitive?.doubleOrNull ?: return Result.Error("bad_request: a required")
	val b = input["b"]?.jsonPrimitive?.doubleOrNull ?: return Result.Error("bad_request: b required")
	if (b == 0.0) return Result.Error("divide_by_zero")
	return Result.Success(a / b)
}
```

## Prompts.kt

```kotlin
package {{packageName}}
import kotlinx.serialization.json.*
suspend fun codeReview(args: JsonObject): Result<String> {
	val lang = args["language"]?.jsonPrimitive?.content
	val code = args["code"]?.jsonPrimitive?.content
	if (lang.isNullOrBlank() || code.isNullOrBlank()) return Result.Error("bad_request: language+code required")
	return Result.Success("Review for $lang: ${code.length} chars")
}
```

## Config.kt

```kotlin
package {{packageName}}
import kotlinx.serialization.Serializable
@Serializable
data class Config(
	val name: String,
	val version: String = "0.1.0",
	val logLevel: String = "INFO"
)
```

## ServerTest.kt

```kotlin
package {{packageName}}
import kotlinx.coroutines.test.runTest
import kotlinx.serialization.json.*
import kotlin.test.*
class ServerTest {
	@Test fun greet_ok() = runTest {
		val input = buildJsonObject { put("name", "Ada") }
		val result = greet(input)
		assertTrue(result is Result.Success)
		assertEquals("Hello Ada", (result as Result.Success).value)
	}
	@Test fun greet_badRequest() = runTest {
		val result = greet(buildJsonObject {})
		assertTrue(result is Result.Error)
		assertTrue((result as Result.Error).message.contains("bad_request"))
	}
	@Test fun divide_zero() = runTest {
		val input = buildJsonObject { put("a", 10); put("b", 0) }
		val result = divide(input)
		assertTrue(result is Result.Error)
		assertEquals("divide_by_zero", (result as Result.Error).message)
	}
}
```

## README Excerpt

```markdown
# Kotlin MCP Server

## Run

./gradlew run

## Test

./gradlew test --info

## Lint & Format

./gradlew ktlintCheck detekt
./gradlew ktlintFormat # auto-fix

## Style Guide

- [Kotlin Coding Conventions](https://kotlinlang.org/docs/coding-conventions.html)
- Enforced via ktlint + detekt (static analysis)
```

## Examples

### Success Tree

```text
src/commonMain/kotlin/
  Server.kt
  Tools.kt
  Prompts.kt
  Config.kt
```

### Failure: Invalid packageName

```
Error: packageName must be lowercase dotted format
```

### Failure: divide by zero

```
Result.Error(message=divide_by_zero)
```

## Notes

- Coroutines: suspend + structured concurrency。long-running は withTimeout 推奨。
- Multiplatform: JVM/JS/Native 対応準備。実運用で platform-specific transport 追加可。
- buildJsonObject DSL: 型安全 schema 定義 (nested object も容易)。
- **ktlint 必須**: `.editorconfig` で `indent_size=4`, `max_line_length=120` 設定推奨。
- **detekt 設定**: `detekt.yml` で complexity/style/potential-bugs ルール有効化。

## Attribution

- Upstream inspiration: awesome-copilot Kotlin examples (MIT)
- Differences: Multiplatform setup + sealed Result + buildJsonObject DSL
- License: MIT 継承
