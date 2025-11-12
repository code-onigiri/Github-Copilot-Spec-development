# 調査: Awesome Copilot 言語別プロンプト & 規約統合

## 📌 調査目的

`github/awesome-copilot` に散在する言語別 _instructions / prompts / chatmodes / generator_ パターンを統合し、共通プロンプト構造と差異を明確化。言語別詳細サポート機能のデータ源となる正規化スキーマを確立する。

## 🧱 共通プロンプト骨格

| セクション                | 説明                             | 標準化キーワード例           |
| ------------------------- | -------------------------------- | ---------------------------- |
| Mission                   | 目的を 1 ～ 2 行の命令形で       | "You WILL" / "CRITICAL"      |
| Inputs                    | パラメータ型/必須/任意           | `name: string (required)`    |
| Workflow                  | 手順の段階化                     | "1. Validate", "2. Generate" |
| Output                    | 出力フォーマット (Markdown/JSON) | `json schema`, fenced blocks |
| Validation                | 完了条件 / エラー分岐            | "Reject if missing"          |
| Examples (任意)           | 成功/失敗サンプル                | 成功/異常両方                |
| Reasoning (一部 chatmode) | 内部思考記述指針                 | "Reasoning: list tradeoffs"  |

> Imperative / Guardrail 用語: "NEVER", "STRICT", "MUST" が高頻度。

## 🗂 スキーマ案 (正規化)

```json
{
  "language": "typescript",
  "overview": {
    "primary_use": "Web + MCP server tooling",
    "quality_focus": ["型安全", "開発体験", "再利用性"]
  },
  "style": {
    "naming": ["camelCase 関数", "PascalCase クラス"],
    "formatting": ["ES2022 準拠", "trailing commas"],
    "idioms": ["narrowing", "discriminated unions"],
    "pitfalls": ["any 多用回避", "implicit any"],
    "lint": ["ESLint", "TypeScript strict"]
  },
  "prompts": [
    {
      "id": "mcp-server-generator",
      "title": "MCP Server Generator",
      "intent": "サーバー雛形生成",
      "mission": "Generate a minimal MCP server with tool and prompt registration",
      "inputs": ["serverName:string", "tools:string[]"],
      "workflow": [
        "Validate inputs",
        "Scaffold directory",
        "Emit tool registration"
      ],
      "output": {
        "format": "markdown",
        "sections": ["File tree", "tool code", "prompt examples"]
      },
      "validation": ["All files created", "No TODO placeholders"],
      "tags": ["generation", "mcp"]
    }
  ],
  "mcp": {
    "server_patterns": [
      "registerTool(name, { schema })",
      "registerPrompt(name, {...})"
    ],
    "handler_structure": "async function with zod schema validation",
    "schema_lib": "zod"
  },
  "testing": {
    "frameworks": ["vitest", "jest"],
    "minimal_matrix": ["happy path", "validation error"],
    "example_cases": [
      "tool returns structuredContent",
      "prompt registration success"
    ]
  },
  "error_handling": {
    "common_types": ["ValidationError", "TimeoutError"],
    "structured_pattern": "{ is_error: boolean, message, data? }",
    "validation_strategy": "zod refine + early return"
  },
  "performance": {
    "instrumentation": ["sampling tool", "perf hooks"],
    "concurrency": ["Promise.all for parallel fetches"],
    "profiling": ["Node perf hooks"]
  },
  "references": {
    "official": ["https://www.typescriptlang.org/docs"],
    "awesomeCopilot": ["typescript-mcp-server.instructions.md"]
  },
  "version": "0.1.0"
}
```

---

## 🔍 言語別サマリ

### TypeScript / JavaScript

| 項目           | 内容                                                                  |
| -------------- | --------------------------------------------------------------------- |
| スタイル       | ES2022 / strict TS / camelCase / explicit return types                |
| MCP            | `registerTool`, `registerPrompt`, zod スキーマ活用                    |
| プロンプト特徴 | mission 冒頭に命令形 + validation 厳格                                |
| エラー処理     | zod + early return + `is_error` flag                                  |
| パフォーマンス | sampling tool, parallel Promise.all                                   |
| テスト         | vitest/jest + tool handler 単体 + prompt registration                 |
| ソース         | `typescript-mcp-server.instructions.md`, `prompt-builder.chatmode.md` |

### Java

| 項目           | 内容                                                                           |
| -------------- | ------------------------------------------------------------------------------ |
| スタイル       | PascalCase クラス, メソッド camelCase, SLF4J ロギング                          |
| MCP            | `PromptHandlers.java` / `PromptDefinitions.java` テンプレート, reactive (Mono) |
| プロンプト特徴 | 成果物明示 ("Return only...") + Validation 条件列挙                            |
| エラー処理     | 検証例外 / null 回避 / 明確メッセージ                                          |
| パフォーマンス | 非同期 Mono / キャッシュ戦略可能性                                             |
| テスト         | JUnit: handler 成功 + validation failure                                       |
| ソース         | `java-mcp-server-generator.prompt.md`                                          |

### Go

| 項目           | 内容                                                                         |
| -------------- | ---------------------------------------------------------------------------- |
| スタイル       | 小文字パッケージ / エクスポート PascalCase / error wrapping                  |
| MCP            | `AddPrompt(name, Prompt{Args: []PromptArg{...}})` + struct タグで jsonschema |
| プロンプト特徴 | 引数定義テーブル化 / 検証条件明示                                            |
| エラー処理     | `error` + sentinel + wrapping 注記                                           |
| パフォーマンス | goroutine + channel パターン / シンプル計測                                  |
| テスト         | `go test` table-driven (成功 + エラー)                                       |
| ソース         | `go-mcp-server-generator.prompt.md`, `go.instructions.md`                    |

### Rust

| 項目           | 内容                                                                     |
| -------------- | ------------------------------------------------------------------------ |
| スタイル       | 明示型 / `Result<T, E>` / Clippy 準拠                                    |
| MCP            | async trait handler (`list_prompts`, `get_prompt`)                       |
| プロンプト特徴 | mission 厳格 + 出力 JSON 構造指定多い                                    |
| エラー処理     | `ErrorData::invalid_params` / `anyhow` オプション                        |
| パフォーマンス | async/await + minimal allocation                                         |
| テスト         | `cargo test` (正常 + invalid params)                                     |
| ソース         | `rust-mcp-server-generator.prompt.md`, `rust-mcp-server.instructions.md` |

### C# (.NET)

| 項目           | 内容                                                                          |
| -------------- | ----------------------------------------------------------------------------- |
| スタイル       | PascalCase 型/メソッド, async/await, DI パターン                              |
| MCP            | ジェネレーター prompt: プロジェクト雛形 + handler stub                        |
| プロンプト特徴 | YAML frontmatter + 目的宣言 + validation 強調                                 |
| エラー処理     | 例外 + 明確メッセージ + guard clause                                          |
| パフォーマンス | async/await 非同期 / 構造化ログ                                               |
| テスト         | xUnit/NUnit minimal (成功 + guard failure)                                    |
| ソース         | `csharp-mcp-server-generator.prompt.md`, `semantic-kernel-dotnet.chatmode.md` |

### Ruby

| 項目           | 内容                                                |
| -------------- | --------------------------------------------------- |
| スタイル       | snake_case, クラス PascalCase, シンプル明快         |
| MCP            | アノテーション的クラス構造 / prompt クラス generate |
| プロンプト特徴 | mission 直截的 / 簡潔 output 指定                   |
| エラー処理     | 例外+メッセージ / statsD 計測時の失敗ログ           |
| パフォーマンス | 軽量 (I/O 最小) + 計測フック                        |
| テスト         | RSpec/Minitest minimal (正常 + 例外)                |
| ソース         | `ruby-mcp-server-generator.prompt.md`               |

### PHP

| 項目           | 内容                                       |
| -------------- | ------------------------------------------ |
| スタイル       | PSR-12 / 名前空間厳格 / 型ヒント (>=8)     |
| MCP            | Attribute ベース定義 (推測) / 配列構造検証 |
| プロンプト特徴 | バリデーション条件列挙 / 出力 JSON 丸め    |
| エラー処理     | 例外階層 / null 回避 / 型宣言              |
| パフォーマンス | オーバーヘッド低減 (配列コピー最小)        |
| テスト         | PHPUnit: 成功 + 例外ケース                 |
| ソース         | (awesome-copilot 内関連 instructions)      |

### Swift

| 項目           | 内容                                                  |
| -------------- | ----------------------------------------------------- |
| スタイル       | UpperCamelType / lowerCamel members / 明確 API design |
| MCP            | Handler struct + protocol (推測)                      |
| プロンプト特徴 | mission 精密 / safety 強調                            |
| エラー処理     | `enum Error: Swift.Error` + switch 分岐               |
| パフォーマンス | 値型活用 / copy-on-write 意識                         |
| テスト         | XCTest minimal (成功 + エラー)                        |
| ソース         | (推測補完 / 追加検証要)                               |

### Kotlin

| 項目           | 内容                                     |
| -------------- | ---------------------------------------- |
| スタイル       | lowerCamel / data class / coroutine      |
| MCP            | suspend handler + sealed result          |
| プロンプト特徴 | ステップ列挙 + null safety 明記          |
| エラー処理     | `sealed class` for Result / early return |
| パフォーマンス | coroutine 並行 / lazy init               |
| テスト         | JUnit + coroutine test                   |
| ソース         | (awesome-copilot 抜粋 + 一般規約補完)    |

### 共通クロスカッティング

| 項目               | 観点                                        |
| ------------------ | ------------------------------------------- |
| Prompt Imperative  | "You WILL", "STRICT", "NEVER" 使用頻度高    |
| Validation         | 入力チェック早期 + 明確エラー返却           |
| Output Structuring | JSON or Markdown sections / fenced blocks   |
| Tool Registration  | 言語ごとに登録 API / パターン差異           |
| Test Minimum       | 成功 + 1 つの失敗 (validation or exception) |
| Error Flag         | `is_error` or structured `Result` variant   |

---

## 🧪 テストマトリクス例 (共通)

| ケース             | 期待                                 |
| ------------------ | ------------------------------------ |
| 正常生成           | すべて必須セクション埋まり lint パス |
| 入力欠落           | validation セクションで拒否          |
| 出力逸脱           | schema mismatch → エラー表示         |
| パフォーマンス簡易 | 平均生成時間閾値内                   |

## ⚠️ 既知のギャップ / 追加調査候補

| 項目                    | 詳細                                                |
| ----------------------- | --------------------------------------------------- |
| Swift 具体例不足        | awesome-copilot 内で直接的 generator パターンが少量 |
| PHP Attribute 実装      | MCP prompt registration 具体コード要確認            |
| Python 未統合           | 現段階で要求外だが将来拡張候補                      |
| Chatmode Reasoning 標準 | reasoning セクション汎用化方針検討                  |

## 🔄 正規化手順

1. 抽出: リポジトリ内 `*.instructions.md` / `*.prompt.md` / `*.chatmode.md` を対象。
2. パース: Frontmatter (YAML) / セクション見出し抽出。
3. マッピング: Mission→mission / Inputs→inputs / Workflow→workflow / Output→output / Validation→validation。
4. 要約: 行動動詞 + 禁則語句 (NEVER) カウント。
5. スキーマ化: 言語単位 JSON 化 → キャッシュ。

## 🔐 品質/検証指標

| 指標                   | 目標                    |
| ---------------------- | ----------------------- |
| セクション欠落率       | < 5%                    |
| 重複プロンプトタイトル | 0                       |
| バリデーション記述率   | 100% (全主要プロンプト) |
| 引数型明確化率         | 90% 以上                |

## 📎 参考リンク

- `github/awesome-copilot` リポジトリ各種 instructions/prompt/chatmode ファイル
- 言語公式ガイド: TS / Java / Go / Rust / .NET / Ruby / PHP / Swift / Kotlin

---

最終更新: 2025-01-11  
バージョン: 0.1.0 (draft)
