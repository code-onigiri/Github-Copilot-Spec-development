# Spec Kit（github/spec-kit）

## 概要
Spec Kit は GitHub が公開している Spec-Driven Development（SDD）向けのオープンソースツールキットです。コマンドラインツール `specify` を提供し、仕様（spec）を起点に要件、設計、タスク分解、実装までの一貫したワークフローをサポートします。

## 目的・特徴
- 仕様（spec）を実行可能な単位に変換して、AIアシスタントや開発者が実装を進めやすくする。
- プロジェクト内にテンプレートを持ち、Git ワークフローと連携してスムーズに導入できる。
- 各フェーズを CLI（slash commands）で操作できる。`/speckit.specify`、`/speckit.plan`、`/speckit.tasks`、`/speckit.implement` など。

## 対応 AI エージェント
- 多数の AI エージェントをサポートする設計（例: Claude Code、Copilot、Gemini、Cursor 等）。

## 言語・実装
- Python ベース。`pyproject.toml` を含む。
- CLI ベースのテンプレート生成とスクリプト（bash/PowerShell）を提供。

## ディレクトリ構造（代表）
- `.specify/`：テンプレート、スクリプト、メモリ（constitution）など
- `templates/`：spec, plan, tasks, implement 等のテンプレート
- `docs/`：詳細ドキュメントとガイド

## ワークフロー（概念）
1. `specify init` でプロジェクトに導入
2. `/speckit.constitution` でガバナンスやコーディング原則を定義
3. `/speckit.specify` で WHAT（要求）を決める
4. `/speckit.plan` で HOW（技術方針）を定義
5. `/speckit.tasks` でタスク分解
6. `/speckit.implement` でタスク実行（AI による実装）
7. `/speckit.review`, `/speckit.accept`, `/speckit.merge` で承認・マージ

## テンプレート
- `spec-template.md`, `plan-template.md`, `tasks-template.md`, `task prompt templates` などが用意されている。

### 実例：最小 Spec -> Plan -> Tasks の流れ
以下は Spec Kit の CLI を使った最小 PoC の例です。`specify` コマンドがテンプレートに従ってファイルを生成する挙動の確認に使えます。

1) Spec を作る
```bash
specify specify --title "Add email login" --desc "Enable users to login using email and password"
```
生成される `specs/001-add-email-login/spec.md`（抜粋）:
```markdown
## User Story: Email-based login (P1)
- As a user, I want to login with email and password so that I can access my account

## Success Criteria
- SC-001: Users can sign in with valid credentials and be redirected to the dashboard
```

2) Plan を作る
```bash
specify plan --spec specs/001-add-email-login/spec.md
```
生成される `plans/001-add-email-login/plan.md` には、認証フローや DB スキーマ・テスト案が含まれる。

3) Tasks を生成
```bash
specify tasks --plan plans/001-add-email-login/plan.md
```
生成される `tasks/planned/WP01-add-email-login.md` の frontmatter に `agent`, `lane`, `assignee` が入ることを確認できます。

この簡単な PoC によりテンプレートの動作、`constitution` の適用、フロントマターの自動注入をテストできます。

## ライセンス
- LICENSE: MIT

## 使いどころ（適用ケース）
- 0→1 の新規機能開発の仕様駆動
- 複数 AI エージェントや CI を統合する開発プロセス

## 特筆点
- 仕様テンプレートや slash command を通じた人＋AI の協調に強い。
- GitHub Pages にドキュメントが整備されている。

## プロンプトエンジニアリングの実例へのリンク
- 詳細なプロンプト設計の具体例、フロントマターベースのタスク prompt、システムプロンプトの見本などは `docs/research/prompt-engineering-examples.md` にまとめました。Spec Kit の `specify` コマンドとテンプレートの解説例も含めています。

## アーキテクチャの詳細
- CLI 中心のアーキテクチャ（`specify`）: 起点は CLI で、`specify init` を実行するとテンプレートや slash commands（AI エージェント別のコマンドファイル）が `.specify/` やエージェント別のフォルダ（`.claude/`, `.cursor/`, `.github/prompts/` 等）へ生成されます。
- テンプレートとスクリプト: `.specify/templates/`（Jinja/markdown ベースのテンプレート群）と `.specify/scripts/`（bash / PowerShell）が、AI に投げるプロンプト（＝テンプレート）とワークフローの自動化を担います。
- プロジェクトメモリ: `.specify/memory/constitution.md` のような "constitution" ファイルにより、プロジェクト固有のポリシーや設計哲学を保存し、生成物の品質ガードレールとして利用します。
- エージェント対応: `src/specify_cli/__init__.py` に `AGENT_CONFIG` があり、各エージェント向けのコマンド/フォルダを定義。CLI は選択したエージェント向けにコマンド群を生成して IDE / AI に公開します。

## プロンプトエンジニアリング（テンプレートの設計）
- テンプレートがプロンプトそのもの: `templates/commands/*` や `templates/*.md` のテンプレートは、AI に投げるシステム的な指示（期待する出力形式、品質チェック、作成手順）を具体的に列挙することで、LLM の出力を制約し誤動作を抑えます。
- 明確な制約と品質ゲート: `spec-template.md` などは "WHAT を書いて HOW を書かせない"、"測定可能な Success Criteria"、"最大 3 個の [NEEDS CLARIFICATION]" などのルールを提示し、生成物の安定性を担保します。
- フロントマター + 引数: コマンドテンプレートは YAML frontmatter や `$ARGUMENTS` といったプレースホルダを使用し、テンプレートは CLI によって実行時にパラメタイズされます。
- スクリプト実行と検証ループ: `templates/commands/*` のテンプレートは生成→検証→ユーザー（または別のコマンド）へのハンドオフ（`specify`→`plan`→`tasks`）の流れを内包し、チェックリストを作成・検証するための手順を実行します。

## 強み・限界・リスク
- 強み:
	- 「憲章 (constitution)」を明文化し LLM の動作をチーム標準に合わせることで、複数回にわたる LLM の出力でも一定の品質が期待できる
	- CLI とテンプレートを介して AI と密に連携しつつ、テンプレート／ガイドラインを一元化できる
	- エージェント (Claude/Colab/Cursor 等) 対応が整理され、エージェント向けのコマンド生成が自動化されている
- 限界・リスク:
	- LLM の解釈/出力に依存するため、テンプレート設計が破綻すると誤った設計が生成される可能性がある（人によるレビューフェーズは必須）
	- small-team / ad-hoc のケースでは重厚に感じられるため、導入コストが発生する
	- 対象エージェントの機能差（slash command 対応や CLI 機能）により、同じテンプレートの挙動が微妙に異なる可能性がある

## 学ぶべきこと（実践的なポイント）
- 憲章（constitution）をテンプレート化し、LLM に明確な制約を与えること。これにより「品質ゲート」を自動化できる
- テンプレートは「指示書」でもあるため、書式と表現で LLM の挙動を直接制御する
- フロントマターとメタ情報（`agent`, `work_package_id`, `lane` など）を活用して、AI が状態を理解して適切に出力を生成するようにする
- 自動化された検証（`/speckit.checklist` や `/speckit.analyze`）を導入して、仕様→設計→タスク生成サイクルが破綻しないようにする

---

（参考: `templates/commands/specify.md`, `templates/spec-template.md`, `spec-driven.md`）

---

（参考: README / docs 以下）