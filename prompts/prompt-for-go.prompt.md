---
id: language-prompt
author: aggregation
language: go
version: 0.2.0
category: generation
source: github/awesome-copilot
license: MIT (upstream) / MIT (this repo)
origin_url: https://github.com/github/awesome-copilot
upstream_commit: 17a3ac59314178f4bf4880681dee7b043687a2c8
checksum: d7c891480ee69c15af43428313e815a89da3aa627ad46d4f08f5790adbfdcdec
examples_hash: a81a1df5742f33ee3010bf9de1bc9e10ff5576ce1c6c81d88e30512170fcc0d3
last_synced: 2025-11-12T00:00:00Z
---

# Go MCP Server Generator

## Mission

与えられた `modulePath` と名前群から **Graceful Shutdown + Tool + Prompt + 基本テスト** を備えた最小 Go MCP サーバー骨格を生成せよ。

## Inputs

| name        | type   | required | description                               |
| ----------- | ------ | -------- | ----------------------------------------- |
| modulePath  | string | yes      | go module path (github.com/user/app 形式) |
| toolName    | string | yes      | 生成するツール名 (英数字, kebab 可)       |
| promptName  | string | yes      | 生成するプロンプト名                      |
| description | string | no       | README 用概要                             |

## Input Validation & Discovery

> **Source**: Integrated from github/awesome-copilot prompt-builder.prompt.md

Before generation, validate all inputs and clarify ambiguities:

1. **modulePath Validation**:

- Must match `^[a-zA-Z0-9\.-]+\.[a-zA-Z0-9\.-]+/.+`
- No leading `./`, no spaces, must be a valid Go module path
- If invalid, halt and request valid example (e.g., github.com/user/app)

2. **toolName Validation**:

- Non-empty, starts with a letter, only alphanumeric and hyphens
- If ambiguous (e.g., "user management"), ask for clarification

3. **promptName Validation**:

- Non-empty, kebab-case preferred
- If missing semantic meaning, request descriptive name

4. **description Validation**:

- If empty or too vague (<10 words), request minimum 10-word description for README

**Failure Trigger**: If any required input invalid after 2 clarification attempts, halt with detailed error message listing all validation failures.

## Codebase Consistency Check

> **Source**: Integrated from github/awesome-copilot copilot-instructions-blueprint-generator.prompt.md

Before generating code, scan workspace for existing Go MCP servers and match their patterns:

1. **Search for Existing MCP Servers**:

- Declare intent before tool use: "Searching workspace for existing Go MCP server implementations to extract consistent patterns..."
- Search for: go.mod, server/main.go, tool.go, prompt.go
- If found, analyze: package structure, error handling style, logging approach, test organization

2. **Extract Patterns**:

- Naming conventions: camelCase vs kebab-case for tool/prompt names
- Error handling: fmt.Errorf wrapping, custom error types
- Logging: log vs zap, log levels used
- Test organization: \*\_test.go files, testify vs stdlib

3. **Apply Patterns to New Code**:

- Match existing indentation style (tabs vs spaces)
- Follow import ordering (stdlib → external → internal)
- Use same dependency injection approach
- Mirror file organization (flat vs nested)

4. **Never Introduce New Patterns**:

- If codebase uses stdlib log, don't add zap
- If tests use stdlib, don't generate testify

**Principle**: Consistency with existing codebase > external best practices.

## Tool Usage Declaration

> **Source**: Integrated from github/awesome-copilot taming-copilot.instructions.md

Before executing any tool, declare intent with concise statement immediately preceding tool call:

1. **File Search**:

- "Searching workspace for existing Go MCP server patterns..."
- Tool: search/codebase with pattern `**/*.go` + go.mod

2. **File Creation**:

- "Creating Go MCP server at server/main.go with tool handler for: ${toolName}..."
- Tool: edit/createFile with path server/main.go

3. **Lint Validation**:

- "Running lint validation with golangci-lint (zero tolerance mode)..."
- Tool: runCommands with `golangci-lint run --timeout=5m`

4. **Test Execution**:

- "Executing test suite with go test to verify tool handler and input validation..."
- Tool: runCommands with `go test -v -cover ./...`

**Purposeful Action Rule**: Every tool invocation must directly fulfill user request. Never search/modify unrelated files.

## Workflow

## Workflow

1. Validate: 空文字 / 先頭 `./` / スラッシュなし → エラー。
2. ファイルツリー定義 & 衝突チェック。
3. `go.mod` 内容生成 (`go 1.22` 推奨)。
4. `server/main.go` 作成: server 初期化, tool/prompt 登録, シグナル待ちで graceful shutdown。
5. `server/tool.go`: 入力 struct + JSON Schema tag + handler (エラーラップ例)。
6. `server/prompt.go`: 引数検証 + 返却構造。
7. `server/main_test.go`: 正常ケース + validation 異常ケース (missing field)。
8. README スニペット生成 (実行方法 / テスト方法)。
9. すべて Markdown セクション化し出力。

## Output

以下セクションを Markdown で出力:

- File Tree
- go.mod
- main.go
- tool.go
- prompt.go
- main_test.go
- README excerpt

## Validation

### Required Checks

- modulePath: 正規表現 `^[a-zA-Z0-9\.-]+\.[a-zA-Z0-9\.-]+/.+` に一致
- ツール名: 英数字/`-` のみ, 先頭英字
- 重複ファイルなし
- handler 内エラーは `fmt.Errorf("<context>: %w", err)` ラップ
- テストで最低 1 つのエラーアサーション
- **Lint: `go vet ./...` と `golangci-lint run` がゼロエラー必須**
- **Format: `gofmt -d .` と `goimports -d .` が diff 無し必須**
- **Style: [Effective Go](https://go.dev/doc/effective_go) + [Google Go Style](https://google.github.io/styleguide/go/) 準拠**

### Commands

```bash
go build ./...                  # Compilation must succeed
go test -v -cover ./...         # All tests pass, coverage >70%
go vet ./...                    # Static analysis zero errors
golangci-lint run --timeout=5m  # All linters pass (complexity <=10)
gofmt -d . | wc -l             # Must output 0 (no diffs)
goimports -d . | wc -l         # Must output 0 (no diffs)
```

### Edge Cases

- nil pointer dereference → error with context, not panic
- Context cancellation → handlers return ctx.Err() wrapped
- Empty struct input → defaults applied or validation error
- Race condition → use mutex or channel, detected by `go test -race`

### Failure Modes

- **Unwrapped error**: `return err` instead of `fmt.Errorf`: 失敗 → golangci-lint wrapcheck
- **Unused variable**: 宣言後使用なし → `go vet` or `golangci-lint unused`
- **Cyclomatic complexity >10**: 関数が複雑すぎ → golangci-lint gocyclo
- **Missing error check**: `_, err := f(); doSomething()` → golangci-lint errcheck

### Failure Triggers (Halt Generation)

> **Source**: Integrated from github/awesome-copilot prompt.instructions.md Quality Assurance Checklist

Generation must halt immediately if any of the following occur:

1. **Input Validation Failures** (after 2 retry attempts):

- modulePath still invalid after clarification
- toolName empty or invalid after correction
- promptName remains semantically meaningless

2. **Lint Errors Exceed Threshold** (after 3 auto-fix attempts):

- golangci-lint run exits with >0 errors
- go vet reports errors

3. **Type Safety Violations** (no retries, immediate halt):

- Unwrapped error detected (wrapcheck)
- Cyclomatic complexity >10 (gocyclo)

4. **Tool Access Denied** (no retries):

- search/codebase permission denied
- edit/createFile fails due to file system restrictions
- runCommands blocked by security policy

5. **Test Failures** (after 3 fix attempts):

- go test exits with non-zero code
- Coverage below 70% threshold
- Timeout errors (tests exceed 30s per suite)

6. **Validation Command Failures** (3 consecutive failures):

- go build reports compilation errors
- gofmt/goimports report diffs after auto-fix

**Error Reporting Format**:

```markdown
❌ **Generation Halted**

**Reason**: [Failure Trigger Category]
**Details**: [Specific error message with file:line references]
**Attempted Fixes**: [List of auto-fix commands executed]
**Manual Action Required**: [Step-by-step resolution guide]

**Context**:

- Input: modulePath="${modulePath}", toolName="${toolName}", promptName="${promptName}"
- Retry Count: X/3
```

**Success Criteria** (all must pass):

- [ ] All input validations passed
- [ ] Lint errors = 0
- [ ] Tests pass with coverage ≥70%
- [ ] gofmt/goimports report no diffs
- [ ] All handlers wrap errors with fmt.Errorf
- [ ] No cyclomatic complexity >10
- [ ] All \*\_test.go files cover error cases

## Project Structure

```text
<modulePath>/
  server/
    main.go
    tool.go
    prompt.go
    main_test.go
  go.mod
  README.md (excerpt)
```

## main.go (Template)

```go
package main
import (
  "context"; "fmt"; "os"; "os/signal"; "syscall"; "time"
)
// NOTE: 擬似的な MCP Server 型 (awesome-copilot 抽象) を想定。
func main(){
  srv := NewServer("go-mcp", "0.1.0")
  RegisterTools(srv)
  RegisterPrompts(srv)
  ctx, cancel := context.WithCancel(context.Background())
  sig := make(chan os.Signal,1)
  signal.Notify(sig, os.Interrupt, syscall.SIGTERM)
  go func(){ <-sig; fmt.Println("[shutdown] signal received"); cancel() }()
  if err := srv.Listen(ctx); err != nil { fmt.Println("server error:", err); os.Exit(1) }
  fmt.Println("server stopped")
}
```

## tool.go

```go
package main
import (
  "context"; "fmt"
)
// Input schema struct with jsonschema tags
type GreetInput struct {
  Name string `json:"name" jsonschema:"type=string,description=User name"`
}
func RegisterTools(s *Server){
  s.AddTool(Tool{
    Name: "{{toolName}}",
    Input: SchemaObject(map[string]Schema{ "name": SchemaString() }),
    Handler: func(ctx context.Context, raw map[string]any) (any, error) {
      name, ok := raw["name"].(string)
      if !ok || name == "" { return nil, fmt.Errorf("bad_request: name required") }
      return fmt.Sprintf("Hello %s", name), nil
    },
  })
}
```

## prompt.go

```go
package main
import "fmt"
func RegisterPrompts(s *Server){
  s.AddPrompt(Prompt{
    Name: "{{promptName}}",
    Input: SchemaArray(SchemaString()),
    Handler: func(args []string) (string, error) {
      if len(args) == 0 { return "", fmt.Errorf("bad_request: at least one arg required") }
      return fmt.Sprintf("Prompt(%d): %v", len(args), args), nil
    },
  })
}
```

## main_test.go

```go
package main
import ("testing")
func TestGreet_OK(t *testing.T){
  out, err := testCallTool("{{toolName}}", map[string]any{"name": "Ada"})
  if err != nil { t.Fatalf("unexpected error: %v", err) }
  if out != "Hello Ada" { t.Fatalf("unexpected output: %v", out) }
}
func TestGreet_BadRequest(t *testing.T){
  _, err := testCallTool("{{toolName}}", map[string]any{})
  if err == nil || !contains(err.Error(), "bad_request") { t.Fatalf("expected bad_request error") }
}
```

## README Excerpt

````markdown
# Go MCP Server

## Run

```bash
go run ./server
```
````

## Test

```bash
go test ./server -count=1
```

## Lint & Format

```bash
go vet ./...
golangci-lint run
gofmt -w .
goimports -w .
```

## Style Guide

- [Effective Go](https://go.dev/doc/effective_go)
- [Google Go Style](https://google.github.io/styleguide/go/)
- Enforced via golangci-lint (revive, staticcheck, goimports)

````

## Examples
### Success: File Tree
```text
server/
  main.go
  tool.go
  prompt.go
  main_test.go
````

### Failure: Invalid module

```
Error: modulePath must contain domain or host segment
```

### Failure: Missing tool input

```
Error: bad_request: name required
```

## Notes

- Graceful shutdown は SIGTERM/SIGINT のみ実装。拡張で context timeout / draining 可。
- JSON Schema は簡易表現。実運用では draft2020-12 フル対応ライブラリ推奨。
- **golangci-lint 必須**: `.golangci.yml` で revive, staticcheck, errcheck, gofmt, goimports 有効化推奨。

## Attribution

- Upstream inspiration: awesome-copilot Go server examples (MIT)
- Differences: checksum / structured validation / README excerpt 自動生成
- License: MIT 継承 (著作権表示保持)
