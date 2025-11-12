# プロンプトコレクション

言語自動検出機能と言語別詳細サポートで利用される標準化済みプロンプト集。ここでは **深い言語別生成支援** のために upstream `github/awesome-copilot` から抽出した具体コード・テスト・エラーパターン・プロンプト構造を厳選統合します。

---

## 📐 フォーマット規約 (Schema)

すべての `.prompt.md` は以下の要素を含みます。追加で `upstream_commit`, `checksum`, `examples_hash` を導入し再現性と改ざん検知を支援します。

```yaml
---
id: mcp-server-generator
language: typescript
version: 0.2.0
category: generation
source: github/awesome-copilot
license: MIT (original) / MIT (aggregation)
origin_url: https://github.com/github/awesome-copilot/tree/<commit>/path
upstream_commit: <commit-sha>
checksum: <sha256-of-body>
examples_hash: <sha256-of-examples-block>
last_synced: 2025-11-12T00:00:00Z
---
```

本文構造:

```markdown
# Title

## Mission # 1-2 行命令形

## Inputs # テーブル。無ければ "(none)"

## Workflow # 手順は番号付き 1 開始

## Output # 生成物の構造 (必ず明確な型/形式)

## Validation # 完了条件 + エラー条件 >=2

## Examples # 成功/失敗/境界 (任意)

## Notes # 制約/リンク (任意)

## Attribution # 原著ライセンス/差分説明
```

---

## 🗃 命名規則

`<language>-<short-purpose>.prompt.md`
例: `go-prompts-for-[]-generator.prompt.md`

---

## 🔄 更新ポリシー

| トリガー                             | 動作                                             |
| ------------------------------------ | ------------------------------------------------ |
| awesome-copilot upstream commit 変化 | `upstream_commit` 更新 + 差分パッチ生成          |
| schema version 変更                  | 全 frontmatter `version` bump + 互換性ノート追加 |
| 新言語追加                           | 雛形生成 → 初期スモークテスト → manifest 反映    |
| 重大エラー学習                       | Validation へ regression ケース追加              |

---

## 📂 言語別最低セット (Baseline Prompts)

| Language   | 必須                     | 追加候補               | テストコマンド例                   |
| ---------- | ------------------------ | ---------------------- | ---------------------------------- |
| typescript | prompts-for-[]-generator | code-review, test-plan | `npm test` / `ts-node src/main.ts` |
| go         | prompts-for-[]-generator | error-audit            | `go test ./...`                    |
| rust       | prompts-for-[]-generator | performance-hints      | `cargo test`                       |
| java       | prompts-for-[]-generator | reactive-handler       | `./gradlew test`                   |
| csharp     | prompts-for-[]-generator | async-pattern          | `dotnet test`                      |
| ruby       | prompts-for-[]-generator | idiom-normalizer       | `bundle exec rspec`                |
| php        | prompts-for-[]-generator | psr-refactor           | `phpunit`                          |
| swift      | prompts-for-[]-generator | api-design-audit       | `swift test`                       |
| kotlin     | prompts-for-[]-generator | coroutine-safety       | `./gradlew test`                   |

---

## 🔍 深堀り言語別例 (抜粋 / 要約 + Attribution)

各言語プロンプトへ転写される典型パターン。ここでは短縮版を示し本体で完全例を保持。

### TypeScript (MCP Server)

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server";
import { z } from "zod";
const server = new McpServer({ name: "ts-mcp", version: "0.1.0" });
server.tool("greet", {
  input: z.object({ name: z.string() }),
  run: async ({ name }) => `Hello, ${name}`,
});
await server.listen();
```

Validation 着目: zod スキーマ → 失敗時 structured error.

### Go (Graceful Shutdown + Tool)

```go
srv := mcp.NewServer("go-mcp", "0.1.0")
// Tool definition
srv.AddTool(mcp.Tool{
  Name: "greet",
  InputSchema: map[string]any{"name": map[string]string{"type": "string"}},
  Handler: func(ctx context.Context, in map[string]any) (any, error) {
    return fmt.Sprintf("Hello %s", in["name"].(string)), nil
  },
})
// Signal handling
sig := make(chan os.Signal, 1)
signal.Notify(sig, os.Interrupt)
go func(){ <-sig; srv.Close() }()
```

Edge: signal 中断時リソース解除 / context cancel.

### Rust (Attribute Macro Handlers)

```rust
#[tool]
async fn greet(name: String) -> Result<String, String> {
    Ok(format!("Hello {name}"))
}
#[tool_router]
pub async fn route_tool(tool: &str, json: Value) -> ToolResult {
    match tool { "greet" => greet(json["name"].as_str().unwrap().to_string()).await.into(), _ => ToolResult::not_found() }
}
```

Edge: `serde_json` 値未存在 → graceful error (avoid panic).

### Kotlin (Coroutines + JSON Schema)

```kotlin
server.tool("greet") {
  input = buildJsonObject { put("type", "object"); put("properties", buildJsonObject { put("name", buildJsonObject { put("type", "string") }) }) }
  handler { input -> "Hello ${input["name"]?.jsonPrimitive?.content}" }
}
```

Edge: `jsonPrimitive` null 安全 / NPE 回避。

### Java (Reactor Mono)

```java
server.tool("greet", ToolBuilder.inputSchema(JsonSchemas.object().prop("name", JsonSchemas.string())))
      .handler(in -> Mono.just("Hello " + in.getString("name")));
```

Edge: Backpressure: fast-return, heavy tasks -> switchIfEmpty / timeout.

### Swift (async/await + ServiceLifecycle)

```swift
let server = Server(name: "swift-mcp", version: "0.1.0")
server.tool("greet", input: .object(["name": .string])) { ctx, input in
    return "Hello \(input.string("name")!)"
}
try await server.start()
```

Edge: unwrap 失敗時 → custom MCPError.badRequest.

### Ruby (Class-based DSL)

```ruby
class Greet < MCP::Tool
  input name: :string
  def call(name:) "Hello #{name}" end
end
server.register_tool Greet
```

Edge: 例外 → `MCP::Error.bad_request` へマッピング。

### C# (Async Task)

```csharp
server.AddTool(new McpTool("greet", new { name = "string" }, async input => {
  return $"Hello {input.name}";
}));
```

Edge: Task 例外 → structured error envelope.

### PHP (Schema Array)

```php
$server->tool('greet', [ 'input' => [ 'type' => 'object', 'properties' => [ 'name' => [ 'type' => 'string' ]]]], function($input){
  return 'Hello '.$input['name'];
});
```

Edge: 未キー存在 → throw custom InvalidArgumentException.

---

## 🧪 テストパターン (要約)

| 言語   | 代表テスト                                            | エラー境界例                                        |
| ------ | ----------------------------------------------------- | --------------------------------------------------- |
| ts     | greet 正常 / name missing → zod error                 | Schema validation message JSON                      |
| go     | divide 成功 / 0 除算 → error                          | `errors.Is(err, ErrDivideByZero)`                   |
| rust   | greet / missing field → Result Err                    | `assert!(matches!(err, ToolError::BadRequest(_)))`  |
| java   | greet / negative param for calc → Mono.error          | StepVerifier expectErrorMessage                     |
| kotlin | greet / null name → handler returns fallback          | assertEquals("Hello ", result) または例外マッピング |
| swift  | calculate / invalid JSON → throws MCPError.badRequest | XCTAssertThrowsError                                |
| ruby   | greet / nil name → validation rescue                  | expect(error.type).to eq(:bad_request)              |
| php    | greet / name absent → InvalidArgumentException        | PHPUnit expectException                             |
| csharp | greet / empty string → validation fails               | Assert.Throws<BadRequestException>                  |

---

## 🧩 Validation 拡張チェックリスト

- 最低 1 つのエラー例 (構造化 JSON or Exception 型名)
- テストコマンド明記
- Edge case: null/未定義/型不一致/timeout/並列 (>=2 選択)
- 再試行戦略 (必要なら) 記述: none / exponential / idempotent のいずれか
- ロギング指針: level, correlation id (任意)

---

## 🔐 改ざん検知

`checksum` / `examples_hash` で CI 上比較し差分が upstream 以外起因か検出。GitHub Actions: 変更時 → 自動再計算 → 乖離警告コメント生成。

---

## 📎 ライセンス / 出典

- 原著: `github/awesome-copilot` (MIT) 抜粋・再構成
- 差分: 正規化スキーマ/テーブル/チェックリスト追加
- 帰属: 各 prompt に `origin_url`, `upstream_commit` 明記
- 再配布: MIT 継承、追加部分も MIT

MIT License 要約: 著作権表示と許諾表示保持条件下で使用/改変/再配布/サブライセンス可能。無保証。

---

## 🛠 Manifest プレビュー

`prompts/manifest.json` (予定):

```jsonc
{
  "version": "2025-11-12.1",
  "languages": {
    "go": {
      "file": "prompts-for-go-generator.prompt.md",
      "upstream_commit": "<sha>",
      "checksum": "<sha256>"
    },
    "rust": {
      "file": "prompts-for-rust-generator.prompt.md",
      "upstream_commit": "<sha>",
      "checksum": "<sha256>"
    },
    "typescript": { "file": "prompts-for-typescript-generator.prompt.md" },
    "java": { "file": "prompts-for-java-generator.prompt.md" },
    "kotlin": { "file": "prompts-for-kotlin-generator.prompt.md" },
    "swift": { "file": "prompts-for-swift-generator.prompt.md" },
    "csharp": { "file": "prompts-for-csharp-generator.prompt.md" },
    "ruby": { "file": "prompts-for-ruby-generator.prompt.md" },
    "php": { "file": "prompts-for-php-generator.prompt.md" }
  }
}
```

---

## ✅ 検証チェックリスト (更新版)

- Frontmatter 全フィールド (id/language/version/source/license/origin_url/upstream_commit/checksum/examples_hash/last_synced)
- Mission が命令形 (動詞開始 / 60 文字未満)
- Inputs: 0 の場合 `(none)` 明示
- Workflow: 番号 + 各行 動詞開始
- Output: 型 + 検証条件 / 空配列許容ポリシー記述
- Validation: 成功/失敗/再試行/ログ/セキュリティ(権限境界)の少なくとも 3 つ
- Examples: 成功 + エラー + 境界 (サイズ/空/不正型) >=3
- Attribution: origin_url + commit + MIT 条文簡要 + 差分説明

---

## 🧪 CI 推奨ステップ

1. JSON Schema Lint (frontmatter)
2. checksum 再計算 diff
3. 例コード最小コンパイル/型チェック (多言語 matrix)
4. エラー例強制実行 (divide by zero など) → 期待エラー型検証
5. レポート Markdown 要約 + コメント

---

## 📝 Notes

- 大量改変時: 部分的 revert 提示用に diff chunk と checksum before/after を manifest に記録
- 生成物の安定性: テストコードを最優先 (README/Docs は後続)

---

最終更新: 2025-11-12
バージョン: 0.2.0
