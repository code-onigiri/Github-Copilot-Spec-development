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

- packageName 不正時: 明示エラー
- Tool handler で null/blank input → Result.Error("bad_request")
- Divide by zero → Result.Error("divide_by_zero")
- テスト必須: runTest + assertEquals(Result.Error(...))
- Nullable 過剰使用回避 (!! 禁止)
- **Lint: `./gradlew ktlintCheck detekt` がゼロエラー必須**
- **Format: `./gradlew ktlintFormat` で自動整形**
- **Style: [Kotlin Coding Conventions](https://kotlinlang.org/docs/coding-conventions.html) 準拠 (4 space, camelCase)**

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
