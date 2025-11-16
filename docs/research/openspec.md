# OpenSpec（Fission-AI/OpenSpec）

## 概要
OpenSpec は軽量でブラウンフィールド（既存コードベース）対応を特徴とする SDD ツールです。`specs/`（ソース）と `changes/`（提案）の分離を行い、変更提案 → レビュー → 実装 → アーカイブのサイクルを明確にします。

## 目的・特徴
- 既存コードベース（1→n）を重視した設計
- API キー不要で動作することを明示し、軽量な導入を優先
- プロポーザル（提案）中心のワークフローで、変更の差分を管理

## 対応 AI エージェント
- README に具体的なエージェント一覧は少ないが、カスタムな slash commands やスクリプトとして統合可能。

## 言語・実装
- Node.js ベース。`package.json`, `src` 配下の TypeScript/JS 実装。
- ダッシュボードのスクリーンショットや CLI を備えている。

## ディレクトリ構造（代表）
- `openspec/specs/`：現行仕様のソース
- `openspec/changes/`：提案やドラフトを置く
- `AGENTS.md`, `bin/` や `src/` に CLI 実装がある

## アーキテクチャの詳細
- CLI ベース（TypeScript/Node）: `openspec` CLI がプロジェクト内の `openspec/` を管理して `specs/` と `changes/` を運用する
- 変更提案の単一ソース: `changes/<id>/proposal.md` を中心に `tasks.md`, `design.md`, `specs/`（delta）を置くことで、提案の検証と実装準備が標準化
- バリデータと diff: CLI の `validate`、`diff`、`archive` コマンドがファイル整合性と delta パーシングを担っている
- Agent prompt ファイルの生成: `openspec init` や `openspec update` は `.claude/commands/openspec/` や `.cursor/commands/`、`.github/prompts/` のようなエージェント用ファイルを自動生成して、各エージェントで `proposal` を走らせられるようにする

## プロンプトエンジニアリング（テンプレート）
- Proposal-centered prompts: `proposal.md` 自体が LLM に対する最小の執行指示となる（Why, What, Impact）。その内容が `tasks.md` と `specs/` の delta に反映される
- エージェント向け命令: CLI は proposal を agent-specific promts に変換して各 agent 用の slash commands を生成（例: `.claude/commands/openspec/proposal.md`）
- Delta パーサ: `openspec show --json --deltas-only` と `openspec validate --strict` により、正しいシナリオ/Requirementsフォーマットが保たれるようルールで厳密化
- フォーマット強制: `#### Scenario:` 形式や `## ADDED|MODIFIED|REMOVED` 区切りなど、明確な構文を提示し LLM の出力解釈を容易にしている

- 具体的なプロンプト例や delta-validation の実例は `docs/research/prompt-engineering-examples.md` を参照してください

### 実例：Proposal と Validation
`changes/0001-add-login/proposal.md` の抜粋例：
```markdown
## Why
Add email-based login for existing users.

## What Changes
- ADDED: Endpoint POST /api/auth/email
- MODIFIED: specs/auth/spec.md - Add login scenario

## Impact
- Affects: specs/auth/spec.md, src/auth/*
```

このまま `openspec validate` を実行すると、`specs/auth/spec.md` の `ADDED` セクションと `MODIFIED` セクションの不一致や構文の崩れがないかを検出し、CI からブロックできます。例えば `#### Scenario` の見出しが不適切なレベル（`###` など）で書かれていると `validate` はエラーを返します。

## 強み・限界・リスク
- 強み:
	- ブラウンフィールド（既存コード）に強く、既存仕様に対する提案・差分管理が容易
	- CLI によるバリデータと差分検出が適切に整備されている
	- エージェント用 prompts の自動生成で、複数エージェントへの導入コストを下げる
- リスク / Limitations:
	- 仕様の delta 管理により複雑なマージや競合が発生したときには人間の判断が必要（自動化だけで解消できない）
	- 提案を生成する LLM の信頼性／品質はプロジェクト次第で変わるため、CI ステップや追加のバリデーションが必要

## 学ぶべきこと（実装ノウハウ）
- Proposal（提案）を `specs/` と `changes/` に明確に分離し、delta ベースでの変更追跡を行うのは、ブラウンフィールドでの導入ハードルを下げる良い設計
- CLI とシェルスクリプトで検証を自動化し、`proposal` と `tasks` の品質を守る
- Agent-specific prompt の生成は、各エージェントの discoverable prompt 仕様を活かすことでチーム全体への一貫した導入を可能にする

---

（参考: `openspec/AGENTS.md`, `openspec/changes/*/proposal.md`, `src/commands/validate.ts`）

## ワークフロー（概念）
1. Draft Change Proposal（変更提案）
2. Review & Align（レビュー／合意）
3. Implement Tasks（実装）
4. Archive & Update（アーカイブして specs にマージ）

## テンプレート
- 軽量で、明快な change/spec 分離をサポートするドキュメント構造が中心。

## ライセンス
- LICENSE: MIT

## 使いどころ
- 既存コードベースでの機能改修や設計変更、プロポーザル管理
- 大規模なコードベースで仕様の誤解や無駄な実装を防ぐ

## 特筆点
- proposals と現行 specs の明確な分離により、レビュー／履歴管理がしやすい
- シンプルな導入で既存ワークフローとの衝突を避ける設計

---

（参考: README / openspec/changes / openspec/specs）