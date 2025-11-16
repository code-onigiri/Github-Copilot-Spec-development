# Spec Kitty（Priivacy-ai/spec-kitty）

## 概要
Spec Kitty は GitHub の Spec Kit をベースにコミュニティがフォーク／拡張した実装で、リアルタイムのカンバンダッシュボードやマルチエージェント調整（11 agents）などの機能を追加しています。

## 目的・特徴
- ライブの可視化（Kanban ボード）を統合し、エージェント進捗の追跡が可能
- マルチエージェントオーケストレーション：複数の AI を協調して運用
- ワークツリー戦略による並列開発（Worktree-first）
- ミッションシステム（research / software-dev など）

## 対応 AI エージェント
- Claude Code, Cursor, Gemin, Copilot 等。公式に 11 agent 対応を明記。

## 言語・実装
- Python + Node（dashboard 等の UI で Node を併用する場合あり）
- CLI: `spec-kitty` で `spec-kitty init` や `spec-kitty dashboard`、`/spec-kitty.specify` などの slash コマンドを生成

## ディレクトリ構造（代表）
- `.kittify/` や `kitty-specs/` を使用し、仕様やテンプレート、dash の config を保管
- `templates/` に `spec-template.md`, `plan-template.md`, `tasks-template.md` 等がある
- `docs/kanban-dashboard-guide.md` などチュートリアルが豊富

## ワークフロー（実例）
1. `spec-kitty init` でダッシュボードやテンプレートを初期化
2. `/spec-kitty.constitution`（プロジェクトポリシー）設定
3. `/spec-kitty.specify` で機能仕様作成（worktree 分離が可能）
4. `/spec-kitty.plan` `/spec-kitty.tasks` `/spec-kitty.implement` と続く
5. `/spec-kitty.dashboard` で進捗を可視化・管理
6. `/spec-kitty.review` → `/spec-kitty.accept` → `/spec-kitty.merge`

## テンプレート
- `agent-file-template`, `plan-template.md`, `spec-template.md`, `tasks-template.md` など。PowerShell / Bash 両対応のスクリプトも用意。

## ライセンス
- LICENSE: MIT

## 使いどころ
- マルチエージェントを使った並列開発の監視・運用
- リアルタイムでチームに進捗を見せたいソリューション

## 特筆点
- ダッシュボードを組み込み、チーム管理者やクライアント向けの可視化を実現
- Spec Kit から継承したチェーン（spec → plan → tasks → implement）を保持しつつ拡張している

## プロンプトエンジニアリングの実例へのリンク
- Kanban の frontmatter や task prompt の例は `docs/research/prompt-engineering-examples.md` に記載しています。spec-kitty でのフロントマターの運用やエンコーディング補正の実装例（`dashboard/scanner.py`）も具体的に記載しています。

## アーキテクチャの詳細
- CLI＋ダッシュボードの分離: CLI (`spec-kitty`) によるテンプレート生成 / エージェント連携と、Node/Python ベースのダッシュボードサーバ（`dashboard/`）が並列に動作します。
- Kanban 一貫管理: `kitty-specs/<feature>/tasks/{planned,doing,for_review,done}` に格納される prompt ファイル（Work Packages）をダッシュボードがスキャンして Kanban カードとして表示します。`dashboard/scanner.py` で前提ファイル（frontmatter + body）を読み取りメタデータ化します。
- エージェント統合: エージェント別のコマンドフォルダ（`.claude/`, `.codebuddy/`, `.cursor/` 等）がテンプレートから自動生成され、各エージェントが一貫したコマンドセットで操作できるようにする
- Worktree 戦略: `git worktree` を活用して、特定機能を別作業ツリーで分離して実装・レビューできる仕組みを支援

## プロンプトエンジニアリング（テンプレートと Kanban）
- フロントマターを中心としたメタ情報: タスク prompt（`task-prompt-template.md`）は YAML frontmatter に `work_package_id`, `subtasks`, `lane`, `agent`, `assignee`, `history` といったキーを持ち、ダッシュボードはこれらからカード内容やアサイン情報を把握します。
- タスク prompt 本文の設計: `# Work Package Prompt: WPxx - Title` でタスクの実行目的、前提、詳細なステップ、テスト方針、リスク、Definition of Done を明記します—つまり prompt が実務的な実装指示（AI 実装に必要な情報）を含む
- 実行ツールのメタ: `shell_pid`, `agent` などの運用メタを frontmatter で保存し、継続的な作業状態とレビューの連続性を担保します
 - サニタイズと可読性: ダッシュボードの scanner はファイルの Encoding を補修（UTF-8 修正）し、非互換な文字のためのエラーカードを作成するなど、実運用の堅牢性を高めます

### 実例：Kanban frontmatter の変更と scanner の反応
1) `tasks/planned/WP01-setup-email.md` を以下で作成
```markdown
---
work_package_id: "WP01"
title: "Setup email service"
lane: "planned"
agent: "claude"
assignee: "alice"
---

# Work Package Prompt: WP01 - Setup email service
## Objectives
- Configure basic SMTP settings and add integration tests
```

2) 実作業で `lane` を `doing` に更新し `assignee` を変えると `dashboard/scanner.py` がスキャンして `history` に記録を追加、Kanban カードが `doing` カラムへ移動します。Encoding エラーがあれば `error` カードを生成します。

## 強み・限界・リスク
- 強み:
	- ライブでエージェントの作業状況を可視化することで、Engineers と AI の協調が容易になる
	- Worktree と Kanban を組み合わせることで並列開発の衝突を減らす
	- タスク prompt の frontmatter による明確な状態管理で、オーケストレーションを自動化できる
- 限界・リスク:
	- ダッシュボードの可用性と encoding の堅牢性を維持するための追加テスト / インフラが必要
	- フロントマターとタスク prompt のフォーマットに強く依存しているため、テンプレートの破壊（人為的変更）が可視化や自動化を壊す場合がある
	- マルチエージェント運用は得られる価値が大きいが「誰がどの agent で何をしているか」の追跡と権限設計が必要

## 学ぶべきこと（実践向けのポイント）
- フロントマターでタスクと状態を厳密に管理することで、ダッシュボード設計が非常にシンプルになる（レンダリングや自動検出が容易）
- 長時間のセッションに対応するための Activity/History 管理（shell_pid、history）をテンプレートに入れることは効果的
- Encoding 自動修復やファイルパース・検証を早い段階で組み込むことで、クイック・スタート後のトラブルシューティング負荷が下がる

---

（参考: `templates/task-prompt-template.md`, `src/specify_cli/dashboard/scanner.py`）

---

（参考: README / templates / docs）