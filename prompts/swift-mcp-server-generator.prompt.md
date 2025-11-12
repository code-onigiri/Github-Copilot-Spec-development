id: mcp-server-generator
author: aggregation
language: swift
version: 0.2.0
category: generation
source: github/awesome-copilot
license: MIT (upstream) / MIT (this repo)
origin_url: https://github.com/github/awesome-copilot
upstream_commit: 17a3ac59314178f4bf4880681dee7b043687a2c8
checksum: 15ca26f9d504fdd93582b46327162e3d99745b2649681c13d273dabc89a6150e
examples_hash: 2dd1ba71fe2689186bc125b2d2df0afed72c9126cf626e1a59bee407781b7bec
last_synced: 2025-11-12T00:00:00Z

# Swift MCP Server Generator

## Mission

与えられた `moduleName` と名前群から **async/await + actor isolation + ServiceLifecycle + Tool/Prompt/Resource handlers + Package.swift + XCTest** を備えた最小 Swift MCP サーバー骨格を生成せよ。

## Inputs

| name        | type   | required | description                   |
| ----------- | ------ | -------- | ----------------------------- |
| moduleName  | string | yes      | モジュール名 (UpperCamelCase) |
| toolName    | string | yes      | 生成ツール名                  |
| promptName  | string | yes      | 生成プロンプト名              |
| description | string | no       | 概要                          |

## Workflow

1. Validate: moduleName が `^[A-Z][a-zA-Z0-9]*$` パターン。
2. ファイルツリー定義: Package.swift / Sources / Tests。
3. `Package.swift` 生成: swift-tools-version 5.9+, dependencies (swift-log, service-lifecycle)。
4. `Server.swift`: ServiceLifecycle で graceful start/shutdown, tool/prompt/resource 登録。
5. `ToolHandlers.swift`: async tool (greet / calculate) + MCPError 型。
6. `PromptHandlers.swift`: async prompt (code-review) + validation。
7. `ResourceHandlers.swift`: AsyncStream subscription 例。
8. テスト: `ServerTests.swift` (calculate OK / divide by zero), `ToolHandlersTests.swift` (greet badRequest)。
9. README Excerpt (swift run / swift test)。
10. すべて Markdown セクション化し出力。

## Output

- File Tree
- Package.swift
- Sources/Server.swift
- Sources/ToolHandlers.swift
- Sources/PromptHandlers.swift
- Sources/ResourceHandlers.swift
- Tests/ServerTests.swift
- Tests/ToolHandlersTests.swift
- README excerpt

## Validation

- moduleName 不正時: 明示エラー
- Tool handler で nil/empty input → throw MCPError.badRequest
- Divide by zero → throw MCPError.invalidParams("divide_by_zero")
- テスト必須: XCTAssertThrowsError
- Force unwrap (!) 禁止 (guard / if let 使用)
- **Lint: `swiftlint lint --strict` がゼロ warning/error 必須**
- **Format: `swift-format format --in-place` で自動整形**
- **Style: [Swift.org API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/) 準拠**

## Project Structure

```text
<moduleName>/
  Package.swift
  Sources/
	<moduleName>/
	  Server.swift
	  ToolHandlers.swift
	  PromptHandlers.swift
	  ResourceHandlers.swift
  Tests/
	<moduleName>Tests/
	  ServerTests.swift
	  ToolHandlersTests.swift
  README.md (excerpt)
```

## Package.swift (Template)

```swift
// swift-tools-version: 5.9
import PackageDescription
let package = Package(
	name: "{{moduleName}}",
	platforms: [.macOS(.v13)],
	dependencies: [
		.package(url: "https://github.com/apple/swift-log.git", from: "1.5.0"),
		.package(url: "https://github.com/swift-server/swift-service-lifecycle.git", from: "2.0.0")
	],
	targets: [
		.executableTarget(
			name: "{{moduleName}}",
			dependencies: [
				.product(name: "Logging", package: "swift-log"),
				.product(name: "ServiceLifecycle", package: "swift-service-lifecycle")
			]
		),
		.testTarget(
			name: "{{moduleName}}Tests",
			dependencies: ["{{moduleName}}"]
		)
	]
)
```

## Server.swift

```swift
import Logging
import ServiceLifecycle
let logger = Logger(label: "{{moduleName}}")
@main
struct MCPServer {
	static func main() async throws {
		logger.info("Starting MCP server")
		let service = ServiceGroup(
			configuration: .init(gracefulShutdownSignals: [.sigterm, .sigint])
		)
		// Pseudo registration
		// server.tool("greet", schema: .object(["name": .string]), handler: ToolHandlers.greet)
		// server.tool("calculate", ..., handler: ToolHandlers.calculate)
		// server.prompt("code-review", ..., handler: PromptHandlers.codeReview)
		// server.resource("files", handler: ResourceHandlers.subscribeFiles)
		try await service.run()
		logger.info("Server stopped")
	}
}
```

## ToolHandlers.swift

```swift
import Foundation
enum MCPError: Error, LocalizedError {
	case badRequest(String)
	case invalidParams(String)
	var errorDescription: String? {
		switch self {
		case .badRequest(let msg): return "bad_request: \(msg)"
		case .invalidParams(let msg): return "invalid_params: \(msg)"
		}
	}
}
actor ToolHandlers {
	static func greet(input: [String: Any]) async throws -> String {
		guard let name = input["name"] as? String, !name.isEmpty else {
			throw MCPError.badRequest("name required")
		}
		return "Hello \(name)"
	}
	static func calculate(input: [String: Any]) async throws -> Double {
		guard let a = input["a"] as? Double,
			  let b = input["b"] as? Double,
			  let op = input["op"] as? String else {
			throw MCPError.badRequest("a, b, op required")
		}
		switch op {
		case "add": return a + b
		case "divide":
			guard b != 0 else { throw MCPError.invalidParams("divide_by_zero") }
			return a / b
		default: throw MCPError.invalidParams("unknown_op")
		}
	}
}
```

## PromptHandlers.swift

```swift
import Foundation
actor PromptHandlers {
	static func codeReview(args: [String: Any]) async throws -> String {
		guard let lang = args["language"] as? String,
			  let code = args["code"] as? String else {
			throw MCPError.badRequest("language+code required")
		}
		return "Review for \(lang): \(code.count) chars"
	}
}
```

## ResourceHandlers.swift

```swift
import Foundation
actor ResourceHandlers {
	static func subscribeFiles(uri: String) -> AsyncStream<String> {
		AsyncStream { continuation in
			continuation.yield("file://update1")
			continuation.yield("file://update2")
			continuation.finish()
		}
	}
}
```

## ServerTests.swift

```swift
import XCTest
@testable import {{moduleName}}
final class ServerTests: XCTestCase {
	func testCalculate_ok() async throws {
		let result = try await ToolHandlers.calculate(input: ["a": 10.0, "b": 2.0, "op": "divide"])
		XCTAssertEqual(result, 5.0)
	}
	func testCalculate_divideByZero() async {
		do {
			_ = try await ToolHandlers.calculate(input: ["a": 10.0, "b": 0.0, "op": "divide"])
			XCTFail("Expected error")
		} catch MCPError.invalidParams(let msg) {
			XCTAssertEqual(msg, "divide_by_zero")
		} catch {
			XCTFail("Unexpected error: \(error)")
		}
	}
}
```

## ToolHandlersTests.swift

```swift
import XCTest
@testable import {{moduleName}}
final class ToolHandlersTests: XCTestCase {
	func testGreet_ok() async throws {
		let result = try await ToolHandlers.greet(input: ["name": "Ada"])
		XCTAssertEqual(result, "Hello Ada")
	}
	func testGreet_badRequest() async {
		do {
			_ = try await ToolHandlers.greet(input: [:])
			XCTFail("Expected error")
		} catch MCPError.badRequest(let msg) {
			XCTAssertTrue(msg.contains("name required"))
		} catch {
			XCTFail("Unexpected error: \(error)")
		}
	}
}
```

## README Excerpt

```markdown
# Swift MCP Server

## Run

swift run

## Test

swift test

## Lint & Format

swiftlint lint --strict
swift-format format --in-place -r Sources/ Tests/

## Style Guide

- [Swift.org API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)
- Enforced via SwiftLint (strict mode)
```

## Examples

### Success Tree

```text
Sources/
  Server.swift
  ToolHandlers.swift
  PromptHandlers.swift
  ResourceHandlers.swift
```

### Failure: Invalid moduleName

```
Error: moduleName must be UpperCamelCase
```

### Failure: divide by zero

```
MCPError.invalidParams("divide_by_zero")
```

## Notes

- Actor isolation: data race 防止。高並列時は actor reentrancy 注意。
- ServiceLifecycle: graceful shutdown (signal handling) 自動化。
- AsyncStream: resource subscription の型安全実装。
- **SwiftLint 必須**: `.swiftlint.yml` で `line_length: 120`, `force_unwrapping` disabled, `trailing_whitespace` error。
- **swift-format 設定**: `.swift-format` で `indentation: 2`, `lineLength: 120`。

## Attribution

- Upstream inspiration: awesome-copilot Swift examples (MIT)
- Differences: ServiceLifecycle + actor handlers + AsyncStream resources
- License: MIT 継承
