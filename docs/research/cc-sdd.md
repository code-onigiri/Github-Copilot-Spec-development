# cc-sdd（gotalab/cc-sdd）

## 概要
cc-sdd（Kiro風/cc-sdd）は“AI-Driven Lifecycle”として設計された Spec-Driven Development ツールキットです。Kiro にインスパイアされた仕様とテンプレートを提供し、7 つの主要エージェントをサポートしています。

## 目的・特徴
- AI エージェント（Claude, Cursor, Gemini など）向けに設計された SDD
- 既存の Kiro との互換性を考慮したテンプレート機構
- スペック→設計→タスク→実装のワークフローを単一コマンドで稼働可能にする

## 対応 AI エージェント
- Claude, Cursor, Gemini, Codex, Copilot, Qwen, Windsurf 等を明記

## 言語・実装
- リポジトリは Node/JS を含む実装だが `tools/` 以下に CLI の作業用ファイルあり。

## ディレクトリ構造（代表）
- `tools/cc-sdd`：CLI 実行やテンプレート配置
- `docs/guides/`：導入ガイド、コマンドリファレンス、Spec-Driven ガイド

## ワークフロー（概念）
- `spec-init` → `spec-requirements` → `spec-design` → `spec-tasks` → `spec-impl`
- `steering`（プロジェクトの導き）や `validate-design` などの補助コマンドを備える

## テンプレート
- `.kiro/specs/` のようなディレクトリで requirements.md、design.md、tasks.md のテンプレートが利用される設計

## ライセンス
- LICENSE: MIT

## 使いどころ
- 既存の Kiro に馴染みがあるチームや、複数エージェントで標準化されたテンプレート運用を行いたい場合

## 特筆点
- Kiro 互換という点で、既存の Kiro 資産を移しやすい。カスタムテンプレートによるプロセス適応が容易。

## アーキテクチャの詳細
- テンプレート駆動の CLI: `tools/cc-sdd/` にあるテンプレートと manifest ファイル（`templates/manifests/*.json`）を元に、`.claude/` や `.github/prompts/` のような agent-specific コマンドを生成する
- エージェント manifest: `templates/manifests/` の JSON (例: `claude-code.json`, `qwen-code.json`) がエージェント固有の振る舞いを宣言、CLI はこの manifest を参照して各 agent 用のコマンドを書き出す
- ルールとステアリング: `templates/shared/settings/rules/*` に設けられた設計ルール（`design-discovery`, `ears-format` 等）で、生成される仕様とタスクが組織の設計原則に従うようガード

## プロンプトエンジニアリング（テンプレートとマニフェスト）
- Agent-specific prompt templates: `tools/cc-sdd/templates/agents/<agent>/commands/*.md`（または `.prompt.md`） が、エージェントに渡すプロンプト構造を定義している。各コマンドは背景、実行手順、出力フォーマット、失敗時のサーフェス等を含む
- Manifest driven prompts: manifest JSON にエージェントの `folder`, `language`, `tool_requirements` などを宣言し、CLI がテンプレートに manifest 値を注入して最終的に agent 向け prompt ファイルを生成する

- 具体的な manifest 例や生成テンプレートのサンプルは `docs/research/prompt-engineering-examples.md` を参照してください

### 実例：Manifest と生成されたコマンド（抜粋）
`templates/manifests/claude-code.json` の例:
```json
{
	"name": "claude-code",
	"folder": ".claude/",
	"commands": ["spec-init", "spec-tasks", "spec-impl"],
	"language": "en",
	"tool_requirements": ["read_file", "write_file"]
}
```

CLI がこの manifest を読み込むと `tools/cc-sdd/templates/agents/claude/commands/spec-init.md` のようなコマンドテンプレートが生成されます（抜粋）:
```markdown
---
agent: "claude"
command: "spec-init"
---

# Spec Init (claude)
Please generate a specification using the project's template. Output must follow the `spec-template.md` structure. Use tools `read_file`/`write_file` for code references.
```

この自動生成により、複数エージェントに同一テンプレートを提供し、各 agent の差を manifest で吸収できます。
- ルールテンプレートの利用: `steering` や `design` のルールは、テンプレートと array of rules に基づいて生成物を検証するため、LLM が生成する実装に組織的ルールを反映できる

## 強み・限界・リスク
- 強み:
	- エージェント manifest と多数テンプレートによる広い agent サポート
	- 設計ルール（steering）で一貫性を保つ点が導入の利点
	- 既存の Kiro 資産との互換性により移行が容易
- Limitations / Risks:
	- 多数のテンプレート／manifest の保守負荷が大きい
	- エージェント間のプロンプト差異（形式や機能）により期待した出力が得られないことがある

## 学ぶべきこと
- Manifest-driven generation: エージェント毎の manifest を用いるパターンは、複数 agent を管理する上で再利用性および一貫性を高める良い実践
- ルールテンプレート化: プロジェクトの構造／設計ルールをコードとして保持し、テンプレートと生成物の検査に利用すると品質担保しやすい

---

（参考: `tools/cc-sdd/templates/agents/*`, `tools/cc-sdd/templates/shared/settings`）

---

（参考: README / docs / tools）」}]},