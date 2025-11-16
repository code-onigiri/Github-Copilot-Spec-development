# Claude Code Spec Workflow（Pimzino/claude-code-spec-workflow）

## 概要
Claude Code Specific な SDD 実装（@Pimzino）で、特に Claude Code に最適化された各種 slash コマンドやテンプレートを提供します。開発は MCP（Model Context Protocol）版へ移行中で、MCP による機能拡張が推奨されています。

## 目的・特徴
- Claude 用に最適化されたエクスペリエンス（slash commands, 4 agents, ダッシュボードなど）
- Spec Workflows：`/spec-create`, `/spec-execute`, `/bug-create`, `/bug-analyze`, `/bug-fix` 等の定義
- MCP バージョンに移行しているため最新機能は MCP 実装を参照することが推奨される

## 対応 AI エージェント
- 主に Claude Code 向けだが、汎用 CLI の場合は他エージェントへ拡張が可能

## 言語・実装
- Node.js（CLI 実装）

## ディレクトリ構造（代表）
- `src/`、`docs/`、`examples/`、`templates/` 等を含む
- `esbuild.config.js`, `src-tauri` 等、ダッシュボードやフロント部分へのエントリが見られる

## ワークフロー（概念）
- `/spec-create` → requirements, design, tasks, commands の生成
- `/spec-execute` でタスク実行（手動制御も可能）
- バグ修正ワークフロー：`/bug-create` → `/bug-analyze` → `/bug-fix` → `/bug-verify`

## テンプレート
- slash command テンプレートやダッシュボード表示用の prompt などを保持

## ライセンス
- LICENSE: MIT

## 使いどころ
- Claude Code を主に利用しており、MCP ベースの環境へ移行を計画しているチーム
- ダッシュボードやプロンプトの自動生成を利用したい場合

## 特筆点
- MCP バージョンへの移行を進めているため、最新機能は MCP 版を参照すること
- Claude 固有のチェーンや最適化がされている

## アーキテクチャの詳細
- CLI とダッシュボード: `claude-code-spec-workflow` は CLI (`src/cli`) と Tauri / Node ベースのダッシュボード (`src-tauri` / `src/dashboard`) を持ち、`claude-spec-dashboard` などのコマンドで起動できる
- `.claude/` フォルダ運用: `.claude/commands/` が slash command テンプレート群の生成先で、`spec-create.md`、`spec-execute.md` 等を生成して Claude と統合する
- `spec-config.json` / steering: `.claude/spec-config.json` や steering templates (`.claude/steering/`) により、CLI が生成するファイル群の挙動やポリシーを管理する

## プロンプトエンジニアリング（テンプレート）
- Command Template: `.claude/commands/spec-create.md` のようなファイルは、入力（`$ARGUMENTS`）→解析→自動生成（spec/plan/tasks）→検証のフローを明確に指示する。CLI スクリプトはテンプレートを読み出し、パラメータ化してコマンドファイルを作成します
- Templates for requirements/tasks: `src/markdown/templates` に維持されたテンプレート (requirements-template.md, tasks-template.md) は、何を期待するかを LLM に示すための明確なフォーマット（Acceptance Criteria、Scenarios、DoD）を提供する
- MCP の導入: MCP（Model Context Protocol）版では、`system prompt` と `context` の扱い、エージェントと CLI 間のプロンプトハンドリングが拡張される（より強力にコンテキスト管理、セッション化）

- 実例：slash command のテンプレートや `spec-create` の結果イメージは `docs/research/prompt-engineering-examples.md` を参照のこと

### 実例：`.claude/commands/spec-create.md` の抜粋と期待出力
`spec-create` で使われるコマンドテンプレート例（抜粋）:
```markdown
---
title: "Create feature spec"
agent: "claude"
---

# Create spec command
Input: $ARGUMENTS (e.g. "Add email login")
Output: `specs/<id>/spec.md` including `User Stories`, `Success Criteria`, `Acceptance Tests`.
```

CLI 利用例:
````bash
./cli.js spec-create "Add email login"
````
期待出力 (`specs/001-add-email-login/spec.md` 抜粋):
```markdown
## User Story: Email-based login
- As a user, I want to login using email and password

## Success Criteria
- SC-001: Successful logins return a JWT and HTTP 200
```

このように `spec-create` は `spec-template.md` に従ってファイルを生成し、`spec-execute` や `spec-implement` と連携してタスクを実行できるようにします。

## 強み・限界・リスク
- 強み:
	- Claude 向けに最適化された slash commands と豊富なテンプレート
	- Dashboard と Tunnel を通して進捗を簡単に共有できる
	- `spec-execute` などの実行コマンドでタスクの制御が容易
- Limitations / Risks:
	- Claude-centric である点（MCP に移行することで対応を拡張する意図はあるが、現時点で Claude に最適化されている）
	- MCP 版へ移行中のため、ドキュメントや機能は変化しやすい

## 学ぶべきこと（実践ノウハウ）
- エージェント特化の最適化: もし特定 LLM をメインにするなら、その LLM の機能・制約に最適化することで生産性改善が見込める（ただし将来的なポータビリティを評価する）
- ダッシュボード連携: ローカルダッシュボードを secure tunnel 経由で共有する機能は、外部レビューやステークホルダー向け報告に有益

---

（参考: `.claude/commands`, `src/markdown/templates/*`, `src/dashboard/`）

---

（参考: README / docs / src）