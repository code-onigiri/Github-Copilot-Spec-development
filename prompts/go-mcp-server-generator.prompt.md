---
id: mcp-server-generator
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

- modulePath: 正規表現 `^[a-zA-Z0-9\.-]+\.[a-zA-Z0-9\.-]+/.+` に一致
- ツール名: 英数字/`-` のみ, 先頭英字
- 重複ファイルなし
- handler 内エラーは `fmt.Errorf("<context>: %w", err)` ラップ
- テストで最低 1 つのエラーアサーション
- **Lint: `go vet ./...` と `golangci-lint run` がゼロエラー必須**
- **Format: `gofmt -d .` と `goimports -d .` が diff 無し必須**
- **Style: [Effective Go](https://go.dev/doc/effective_go) + [Google Go Style](https://google.github.io/styleguide/go/) 準拠**

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
