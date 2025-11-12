---
id: mcp-server-generator
author: aggregation
language: rust
version: 0.2.0
category: generation
source: github/awesome-copilot
license: MIT (upstream) / MIT (this repo)
origin_url: https://github.com/github/awesome-copilot
upstream_commit: 17a3ac59314178f4bf4880681dee7b043687a2c8
checksum: 485225735e3f74ecfca6584948081383fb3a9623c5326a391aa8ed110692e257
examples_hash: aebbe60476294921510023044f47d31dd4a12176624dfea5df0bae9ddcc73a81
last_synced: 2025-11-12T00:00:00Z
---

# Rust MCP Server Generator

## Mission

与えられた `crateName` / `promptName` から **async/await + attribute macro 風ハンドラ + テスト** を備えた最小 Rust MCP サーバー骨格を生成せよ。

## Inputs

| name        | type   | required | description           |
| ----------- | ------ | -------- | --------------------- |
| crateName   | string | yes      | kebab-case クレート名 |
| promptName  | string | yes      | 生成プロンプト名      |
| description | string | no       | README 用概要         |

## Input Validation & Discovery

> **Source**: Integrated from github/awesome-copilot prompt-builder.prompt.md

Before generation, validate all inputs and clarify ambiguities:

1. **crateName Validation**:

- Must match `^[a-z][a-z0-9\-]+$` (kebab-case)
- No spaces, no uppercase, must be valid crate name
- If invalid, halt and request valid example (e.g., my-mcp-server)

2. **promptName Validation**:

- Non-empty, kebab-case preferred
- If missing semantic meaning, request descriptive name

3. **description Validation**:

- If empty or too vague (<10 words), request minimum 10-word description for README

**Failure Trigger**: If any required input invalid after 2 clarification attempts, halt with detailed error message listing all validation failures.

## Codebase Consistency Check

> **Source**: Integrated from github/awesome-copilot copilot-instructions-blueprint-generator.prompt.md

Before generating code, scan workspace for existing Rust MCP servers and match their patterns:

1. **Search for Existing MCP Servers**:

- Declare intent before tool use: "Searching workspace for existing Rust MCP server implementations to extract consistent patterns..."
- Search for: Cargo.toml, src/main.rs, handlers.rs, prompt.rs
- If found, analyze: module structure, error handling style, logging approach, test organization

2. **Extract Patterns**:

- Naming conventions: snake_case for functions, kebab-case for crates
- Error handling: anyhow, thiserror, Result<T, E>
- Logging: tracing vs log, log levels used
- Test organization: #[cfg(test)], test modules, assert macros

3. **Apply Patterns to New Code**:

- Match existing indentation style (4 spaces vs tabs)
- Follow import ordering (stdlib → external → internal)
- Use same error propagation approach
- Mirror file organization (flat vs nested)

4. **Never Introduce New Patterns**:

- If codebase uses anyhow, don't add custom error types
- If tests use stdlib assert, don't generate custom macros

**Principle**: Consistency with existing codebase > external best practices.

## Tool Usage Declaration

> **Source**: Integrated from github/awesome-copilot taming-copilot.instructions.md

Before executing any tool, declare intent with concise statement immediately preceding tool call:

1. **File Search**:

- "Searching workspace for existing Rust MCP server patterns..."
- Tool: search/codebase with pattern `**/*.rs` + Cargo.toml

2. **File Creation**:

- "Creating Rust MCP server at src/main.rs with handler for: ${promptName}..."
- Tool: edit/createFile with path src/main.rs

3. **Lint Validation**:

- "Running lint validation with cargo clippy (zero tolerance mode)..."
- Tool: runCommands with `cargo clippy -- -D warnings`

4. **Test Execution**:

- "Executing test suite with cargo test to verify handlers and input validation..."
- Tool: runCommands with `cargo test -- --nocapture`

**Purposeful Action Rule**: Every tool invocation must directly fulfill user request. Never search/modify unrelated files.

## Workflow

## Workflow

1. crateName バリデーション (正規表現 `^[a-z][a-z0-9\-]+$`)。
2. ファイルツリー定義: Cargo.toml / src/main.rs / src/handlers.rs / src/prompt.rs / tests/basic.rs。
3. `Cargo.toml` 生成: edition=2021, deps: tokio, serde, serde_json, anyhow, thiserror, tracing。
4. `src/handlers.rs`: `greet` + `divide` (0 除算エラー) + attribute macro スタイルコメント。
5. `src/prompt.rs`: list_prompts / get_prompt のデータモデル (struct PromptMeta)。
6. `src/main.rs`: server builder, register tools/prompts, tracing 初期化。
7. テスト: greet 正常 / divide by zero / get_prompt 不正名。
8. README Excerpt 生成 (run/test コマンド)。
9. Markdown セクション化し順序固定で出力。

## Output

- File Tree
- Cargo.toml
- src/main.rs
- src/handlers.rs
- src/prompt.rs
- tests/basic.rs
- README excerpt

## Validation

### Required Checks

- crateName 不正時: 明示エラー
- `divide` 0 除算 → Result Err("divide_by_zero")
- すべての `pub fn` が使用されるかテストで参照
- テスト 1 つでも失敗する設計は不可
- **Lint: `cargo clippy -- -D warnings` がゼロエラー必須 (pedantic + nursery deny)**
- **Format: `cargo fmt --check` が diff 無し必須**
- **Style: [Rust Style Guide](https://doc.rust-lang.org/beta/style-guide/) 準拠 (4 space, snake_case, explicit lifetimes)**

### Commands

```bash
cargo build --release          # Compilation with optimizations
cargo test -- --nocapture      # All tests pass, see output
cargo clippy -- -D warnings    # Pedantic+nursery deny, zero warnings
cargo fmt -- --check           # No formatting diffs
cargo doc --no-deps            # Documentation builds successfully
```

### Edge Cases

- `unwrap()` / `expect()` 使用 → clippy deny error (use `?` or match)
- `todo!()` / `unimplemented!()` → clippy deny error
- Wildcard import `use module::*` → clippy deny error
- Panic in handler → test catches with `#[should_panic]` or Result
- Async runtime not initialized → tokio::test attribute required

### Failure Modes

- **Missing error propagation**: `let x = f().unwrap()` → clippy::unwrap_used
- **Unused Result**: `f();` で Result 無視 → clippy::unused_must_use
- **Dead code**: 未使用関数 → cargo warn dead_code (CI fail)
- **Non-exhaustive match**: enum variant 未処理 → compiler error

### Failure Triggers (Halt Generation)

> **Source**: Integrated from github/awesome-copilot prompt.instructions.md Quality Assurance Checklist

Generation must halt immediately if any of the following occur:

1. **Input Validation Failures** (after 2 retry attempts):

- crateName still invalid after clarification
- promptName empty or invalid after correction

2. **Lint Errors Exceed Threshold** (after 3 auto-fix attempts):

- cargo clippy exits with >0 errors
- cargo fmt reports diffs after auto-fix

3. **Type Safety Violations** (no retries, immediate halt):

- unwrap()/expect()/todo!()/wildcard imports detected (clippy deny)

4. **Tool Access Denied** (no retries):

- search/codebase permission denied
- edit/createFile fails due to file system restrictions
- runCommands blocked by security policy

5. **Test Failures** (after 3 fix attempts):

- cargo test exits with non-zero code
- Coverage below threshold
- Timeout errors (tests exceed 30s per suite)

6. **Validation Command Failures** (3 consecutive failures):

- cargo build reports compilation errors
- cargo fmt reports diffs after auto-fix

**Error Reporting Format**:

```markdown
❌ **Generation Halted**

**Reason**: [Failure Trigger Category]
**Details**: [Specific error message with file:line references]
**Attempted Fixes**: [List of auto-fix commands executed]
**Manual Action Required**: [Step-by-step resolution guide]

**Context**:

- Input: crateName="${crateName}", promptName="${promptName}"
- Retry Count: X/3
```

**Success Criteria** (all must pass):

- [ ] All input validations passed
- [ ] Lint errors = 0
- [ ] Tests pass
- [ ] cargo fmt reports no diffs
- [ ] No unwrap/expect/todo!/wildcard imports
- [ ] All error cases covered in tests

## Project Structure

```text
<crateName>/
  Cargo.toml
  src/
    main.rs
    handlers.rs
    prompt.rs
  tests/
    basic.rs
  README.md (excerpt)
```

## Cargo.toml (Template)

```toml
[package]
name = "{{crateName}}"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { version = "1", features=["derive"] }
serde_json = "1"
anyhow = "1"
thiserror = "1"
tokio = { version = "1", features=["rt-multi-thread","macros"] }
tracing = "0.1"
tracing-subscriber = { version = "0.3", features=["fmt","env-filter"] }
```

## src/handlers.rs

```rust
use anyhow::Result;
use serde::{Deserialize, Serialize};
#[derive(Debug, Deserialize)]
pub struct GreetInput { pub name: String }
#[derive(Debug, Serialize)]
pub struct GreetOutput { pub message: String }

pub async fn greet(input: GreetInput) -> Result<GreetOutput> {
    if input.name.trim().is_empty() { anyhow::bail!("bad_request: name required") }
    Ok(GreetOutput { message: format!("Hello {}", input.name) })
}

#[derive(Debug, Deserialize)]
pub struct DivideInput { pub a: f64, pub b: f64 }
#[derive(Debug, Serialize)]
pub struct DivideOutput { pub result: f64 }

pub async fn divide(input: DivideInput) -> Result<DivideOutput> {
    if input.b == 0.0 { anyhow::bail!("divide_by_zero") }
    Ok(DivideOutput { result: input.a / input.b })
}
```

## src/prompt.rs

```rust
use serde::Serialize;
#[derive(Debug, Serialize, Clone)]
pub struct PromptMeta { pub name: String, pub description: String }

pub fn list_prompts() -> Vec<PromptMeta> {
    vec![PromptMeta { name: "{{promptName}}".into(), description: "Generated prompt".into() }]
}
pub fn get_prompt(name: &str) -> Option<PromptMeta> {
    list_prompts().into_iter().find(|p| p.name == name)
}
```

## src/main.rs

```rust
mod handlers; mod prompt;
use handlers::*; use prompt::*; use tracing::*;
#[tokio::main]
async fn main(){
    tracing_subscriber::fmt().with_env_filter("info").init();
    info!("starting server");
    // Pseudo server registration placeholders
    // register_tool("greet", greet);
    // register_tool("divide", divide);
    // register_prompts(list_prompts, get_prompt);
    info!("server ready");
}
```

## tests/basic.rs

```rust
use {{crateName}}::*; // if library style else adjust path
#[tokio::test]
async fn greet_ok(){
  let out = handlers::greet(handlers::GreetInput { name: "Ada".into() }).await.unwrap();
  assert_eq!(out.message, "Hello Ada");
}
#[tokio::test]
async fn divide_zero(){
  let err = handlers::divide(handlers::DivideInput { a:1.0, b:0.0 }).await.unwrap_err();
  assert!(err.to_string().contains("divide_by_zero"));
}
#[test]
fn prompt_lookup(){
  assert!(prompt::get_prompt("{{promptName}}" ).is_some());
  assert!(prompt::get_prompt("missing" ).is_none());
}
```

## README Excerpt

```markdown
# Rust MCP Server

## Run

cargo run

## Test

cargo test -- --nocapture

## Lint & Format

cargo clippy -- -D warnings
cargo fmt --check
cargo fmt # auto-fix

## Style Guide

- [Rust Style Guide](https://doc.rust-lang.org/beta/style-guide/)
- Enforced via rustfmt + clippy (all warnings as errors)
```

## Examples

### Success Tree

```text
src/
  main.rs
  handlers.rs
  prompt.rs
tests/
  basic.rs
```

### Failure: Invalid crateName

```
Error: crateName must be kebab-case
```

### Failure: divide by zero

```
Error: divide_by_zero
```

## Notes

- Attribute macro 化はコメント placeholder。必要なら proc-macro クレート追加。
- エラー語彙統一: bad_request / divide_by_zero / not_found。
- **Clippy 必須**: `clippy.toml` で pedantic 有効化推奨。CI で `-D warnings` 実行。
- **rustfmt 設定**: `rustfmt.toml` で `max_width=100`, `edition="2021"` 推奨。

## Attribution

- Upstream inspiration: awesome-copilot Rust examples (MIT)
- Differences: structured tests + divide tool + prompt meta separation
- License: MIT 継承
