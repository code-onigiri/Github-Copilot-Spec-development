id: mcp-server-generator
author: aggregation
language: java
version: 0.2.0
category: generation
source: github/awesome-copilot
license: MIT (upstream) / MIT (this repo)
origin_url: https://github.com/github/awesome-copilot
upstream_commit: 17a3ac59314178f4bf4880681dee7b043687a2c8
checksum: 5d3517f9e63430abafdbc142fe3cda89d794a0c0514a354dc25dd2e603564aca
examples_hash: 8ac624ae3468ed0f8f4560c528132f7e2a34e9c0d3f9ac864a648f1e72189bbd
last_synced: 2025-11-12T00:00:00Z

# Java MCP Server Generator

## Mission

与えられた `packageName` と名前群から **Reactor Mono handlers + Tool/Prompt/Resource 定義 + Gradle build + テスト** を備えた最小 Java MCP サーバー骨格を生成せよ。

## Inputs

| name        | type   | required | description                             |
| ----------- | ------ | -------- | --------------------------------------- |
| packageName | string | yes      | ベースパッケージ (com.example.mcp 形式) |
| toolName    | string | yes      | 生成ツール名                            |
| promptName  | string | yes      | 生成プロンプト名                        |
| description | string | no       | 概要                                    |

## Workflow

1. Validate: packageName が `[a-z][a-z0-9\.]*` パターン。
2. ファイルツリー定義: Gradle build.gradle.kts / src/main/java / src/test/java。
3. `build.gradle.kts` 生成: Java 17+, MCP SDK (仮想), Reactor Core, SLF4J, JUnit 5 + Reactor Test。
4. `Application.java`: McpServerBuilder, tool/prompt/resource 登録, listen 起動。
5. `ToolHandlers.java`: Mono<String> 返却 handler (greet / calculate)。
6. `PromptHandlers.java`: code-review prompt 例 (引数: language, code)。
7. `ResourceHandlers.java`: subscribe/unsubscribe 例 (URI ベース)。
8. テスト: ToolHandlersTest (greet OK / divide by zero), PromptHandlersTest (missing arg)。
9. README Excerpt (./gradlew run / test)。
10. すべて Markdown セクション化し出力。

## Output

- File Tree
- build.gradle.kts
- src/main/java/Application.java
- src/main/java/ToolHandlers.java
- src/main/java/PromptHandlers.java
- src/main/java/ResourceHandlers.java
- src/test/java/ToolHandlersTest.java
- README excerpt

## Validation

- packageName 不正時: 明示エラー
- Tool handler で null input → Mono.error(new IllegalArgumentException("bad_request"))
- Divide by zero → Mono.error(new ArithmeticException("divide_by_zero"))
- テスト必須: StepVerifier で expectError 検証
- 未使用変数なし
- **Lint: `./gradlew checkstyleMain spotbugsMain` がゼロエラー必須**
- **Format: `./gradlew spotlessCheck` が diff 無し必須 (Google Java Format)**
- **Style: [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html) 準拠 (2 space, no wildcard imports)**

## Project Structure

```text
<project>/
  build.gradle.kts
  src/
	main/
	  java/
		<package>/
		  Application.java
		  ToolHandlers.java
		  PromptHandlers.java
		  ResourceHandlers.java
	test/
	  java/
		<package>/
		  ToolHandlersTest.java
  README.md (excerpt)
```

## build.gradle.kts (Template)

```kotlin
plugins {
	java
	application
}
group = "{{packageName}}"
version = "0.1.0"
java { toolchain { languageVersion.set(JavaLanguageVersion.of(17)) } }
repositories { mavenCentral() }
dependencies {
	implementation("io.projectreactor:reactor-core:3.6.0")
	implementation("org.slf4j:slf4j-api:2.0.9")
	implementation("ch.qos.logback:logback-classic:1.4.11")
	testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
	testImplementation("io.projectreactor:reactor-test:3.6.0")
}
tasks.test { useJUnitPlatform() }
application { mainClass.set("{{packageName}}.Application") }
```

## Application.java

```java
package {{packageName}};
import org.slf4j.*; import reactor.core.publisher.Mono;
public class Application {
	private static final Logger log = LoggerFactory.getLogger(Application.class);
	public static void main(String[] args){
		log.info("Starting MCP server");
		// Pseudo builder pattern
		// McpServer server = McpServerBuilder.create()
		//   .tool("greet", ToolHandlers::greet)
		//   .tool("calculate", ToolHandlers::calculate)
		//   .prompt("code-review", PromptHandlers::codeReview)
		//   .resource("files", ResourceHandlers::subscribeFiles)
		//   .build();
		// server.listen();
		log.info("Server ready");
	}
}
```

## ToolHandlers.java

```java
package {{packageName}};
import reactor.core.publisher.Mono;
import java.util.Map;
public class ToolHandlers {
	public static Mono<String> greet(Map<String,Object> input){
		String name = (String) input.get("name");
		if(name == null || name.isBlank()) return Mono.error(new IllegalArgumentException("bad_request: name required"));
		return Mono.just("Hello " + name);
	}
	public static Mono<Double> calculate(Map<String,Object> input){
		Number a = (Number) input.get("a");
		Number b = (Number) input.get("b");
		String op = (String) input.get("op");
		if(a==null||b==null||op==null) return Mono.error(new IllegalArgumentException("bad_request"));
		double av = a.doubleValue(), bv = b.doubleValue();
		switch(op){
			case "add": return Mono.just(av + bv);
			case "divide":
				if(bv == 0.0) return Mono.error(new ArithmeticException("divide_by_zero"));
				return Mono.just(av / bv);
			default: return Mono.error(new IllegalArgumentException("unknown_op"));
		}
	}
}
```

## PromptHandlers.java

```java
package {{packageName}};
import reactor.core.publisher.Mono;
import java.util.Map;
public class PromptHandlers {
	public static Mono<String> codeReview(Map<String,Object> args){
		String lang = (String) args.get("language");
		String code = (String) args.get("code");
		if(lang==null||code==null) return Mono.error(new IllegalArgumentException("bad_request: language+code required"));
		return Mono.just("Review for " + lang + ": " + code.length() + " chars");
	}
}
```

## ResourceHandlers.java

```java
package {{packageName}};
import reactor.core.publisher.Flux;
import java.util.Map;
public class ResourceHandlers {
	public static Flux<String> subscribeFiles(String uri){
		// Pseudo subscription: emit file updates
		return Flux.just("file://update1", "file://update2");
	}
	public static void unsubscribe(String uri){
		// Cleanup
	}
}
```

## ToolHandlersTest.java

```java
package {{packageName}};
import org.junit.jupiter.api.Test;
import reactor.test.StepVerifier;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;
public class ToolHandlersTest {
	@Test void greet_ok(){
		StepVerifier.create(ToolHandlers.greet(Map.of("name","Ada")))
				.expectNext("Hello Ada")
				.verifyComplete();
	}
	@Test void greet_badRequest(){
		StepVerifier.create(ToolHandlers.greet(Map.of()))
				.expectErrorMatches(e -> e instanceof IllegalArgumentException && e.getMessage().contains("bad_request"))
				.verify();
	}
	@Test void calculate_divideByZero(){
		StepVerifier.create(ToolHandlers.calculate(Map.of("a",10,"b",0,"op","divide")))
				.expectErrorMatches(e -> e instanceof ArithmeticException && e.getMessage().contains("divide_by_zero"))
				.verify();
	}
}
```

## README Excerpt

```markdown
# Java MCP Server

## Run

./gradlew run

## Test

./gradlew test --info

## Lint & Format

./gradlew checkstyleMain spotbugsMain
./gradlew spotlessCheck
./gradlew spotlessApply # auto-fix

## Style Guide

- [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)
- Enforced via Checkstyle + SpotBugs + Spotless (Google Java Format)
```

## Examples

### Success Tree

```text
src/main/java/
  Application.java
  ToolHandlers.java
  PromptHandlers.java
  ResourceHandlers.java
```

### Failure: Invalid packageName

```
Error: packageName must be lowercase dotted format
```

### Failure: divide by zero

```
ArithmeticException: divide_by_zero
```

## Notes

- Reactor Mono: 非同期 & backpressure 対応。長時間 I/O は switchIfEmpty / timeout 追加推奨。
- Resource subscription は実運用で WebSocket/SSE マッピング。
- **Spotless 必須**: build.gradle.kts に `id("com.diffplug.spotless")` + `googleJavaFormat()` 追加。
- **Checkstyle 設定**: `config/checkstyle/google_checks.xml` 参照推奨。

## Attribution

- Upstream inspiration: awesome-copilot Java examples (MIT)
- Differences: Gradle Kotlin DSL + StepVerifier tests + multi-handler structure
- License: MIT 継承
