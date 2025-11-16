# SDD（仕様駆動開発）ツール比較（まとめ）

このドキュメントは以下のリポジトリを比較して、目的やワークフロー、構造、特徴を整理したものです。

対象:
- Spec Kit (github/spec-kit)
- Spec Kitty (Priivacy-ai/spec-kitty)
- OpenSpec (Fission-AI/OpenSpec)
- Shotgun (shotgun-sh/shotgun)
- cc-sdd (gotalab/cc-sdd)
- Claude Code Spec Workflow (Pimzino/claude-code-spec-workflow)

---

## 概要比較（要約）

| リポジトリ | 主な焦点 | 主要特徴 | 対応エージェント | 実装言語 | 導入難易度（相対） |
|---|---|---|---|---|---|
| Spec Kit | 新規仕様・テンプレート基盤 | GitHub 公開のベースライン、テンプレ、Slash commands | 多数（Claude / Copilot / Gemini / Cursor 等） | Python | 中 |
| Spec Kitty | リアルタイム可視化 + マルチエージェント | Kanban ダッシュボード、11 agents、Worktree-first | 多数 | Python + Node | 中〜高 |
| OpenSpec | ブラウンフィールド対応（既存コード） | specs/changes で提案管理、軽量導入 | 汎用（CLI スクリプト等） | Node.js | 低〜中 |
| Shotgun | コードベースインデックス + 自動 Research | リポジトリ丸ごと解析して spec を出す、TUI モード | 多数（Claude, Codex, Cursor 等） | Python | 中〜高 |
| cc-sdd | Kiro 互換 + AI-Driven Lifecycle | Kiro 互換、テンプレ多数、7 agents 対応 | Claude, Cursor, Gemini, Copied エージェント | Node / JS（ツール群） | 中 |
| Claude Code Spec Workflow | Claude 特化（MCP へ移行） | Claude 最適化、slash commands とダッシュボード | Claude 最適化 | Node.js | 低〜中 |

---

## 主要な差分・比較ポイント

### 1) 目的と対象
- Spec Kit は汎用の SDD 基盤で、幅広いエージェントをサポートして仕様駆動を開始するための総合テンプレート群を提供。
- Spec Kitty は Spec Kit を fork してダッシュボードやマルチエージェント機能を追加し、チームでの運用・可視化を強化。
- OpenSpec は既存コード（brownfield）の仕様変更に重きを置く。`specs/` と `changes/` の二層設計が特徴で、現行仕様を保ちながら提案を扱う。
- Shotgun はリポジトリ全体を解析し、よりコードベースに合わせた提案・設計生成を行う。
- cc-sdd は Kiro 互換で、既存の Kiro 資産を活かせる設計。
- Claude Code Workflow は Claude 専用のスクリプトやコマンド群を中心とした実装で、MCP（Model Context Protocol）へ移行中。

### 2) ワークフローの共通点と差
- 共通: 要件（specify）→ 設計（plan）→ タスク（tasks）→ 実装（implement）→ レビュー／承認 という流れを採用。
- 差分:
  - Spec Kitty: `spec-kitty.dashboard` によるリアルタイム進捗と `worktree` の概念を強調
  - OpenSpec: `changes` のレビュー・差分に重点。提案のアーカイブ／マージが主な特徴
  - Shotgun: 全リポジトリをインデックス化し、research/analysis を深めることで「コードに沿った」spec を出す
  - cc-sdd: `ai-dlc` の名前で Kiro に近いテンプレによるワークフローの即時利用性
  - Claude コードワークフロー: Claude に最適化した slash-command を中心に簡易コマンドで回す

### 3) エージェント統合と汎用性
- Spec Kit / Spec Kitty / Shotgun / cc-sdd は、複数エージェントをサポート（エージェントごとにコマンドファイルやディレクトリを生成する設計）
- Claude Code Workflow は Claude に最適化されたバリアントで、MCP による拡張が進む
- OpenSpec は導入の敷居が低く、AI 依存やエージェント固定を強制しない傾向がある

### 4) ダッシュボードと UI
- Spec Kitty はリアルタイム Kanban ダッシュボードを備え、マネージャ／クライアントに進捗を見せる点で強力
- Spec Kit 自体は可視化よりテンプレートと手順を主眼としている
- Shotgun は TUI を備え、モード切替で Research → Specify → Plan を行う

### 5) テンプレート・カスタマイズ
- Spec Kit / Spec Kitty / cc-sdd はテンプレート（spec, plan, tasks, task prompt）を拡張／カスタマイズしやすい。
- OpenSpec はシンプルに change/spec の構造化を重視し、カスタマイズより軽量運用向け

### 6) 既存ワークフローとの親和性
- OpenSpec は既存コードベース（ブラウンフィールド）での改修に向く
- Spec Kit / Spec Kitty / Shotgun は 0→1 の新規機能と 1→n 両方に対応しやすい

### 7) ドキュメント・導入容易度
- Spec Kit: ドキュメントが整備されており、導入手順や CLI の詳細がある
- Spec Kitty: ドキュメント充実、ダッシュボードやパラメータの説明が詳細
- OpenSpec: 導入は比較的軽量で直感的
- Shotgun: 事例や CI 導入ガイドが充実している
- cc-sdd: Kiro 由来の互換を生かしテンプレ化されている
- Claude Workflow: Claude 固有の最適化があり、MCP 推奨

---

## 選び方のアドバイス（ユースケース別）

- 小規模/軽量な既存プロジェクト（変更提案中心）→ OpenSpec
- 新機能の仕様駆動で GitHub のクラシックテンプレがほしい → Spec Kit
- マルチエージェント運用・進捗可視化が必要 → Spec Kitty
- コードベース全体を解析して仕様生成や研究を行いたい → Shotgun
- Kiro を既に使っている・互換性が欲しい → cc-sdd
- Claude に最適化されたワークフローを素早く始めたい → Claude Code Spec Workflow（ただし MCP バージョンも検討）

---

## 推奨導入フロー（一般的）
1. まずはドキュメントやテンプレートをプロジェクトに導入（`specify init` / `spec-kitty init`）
2. プロジェクト憲章（constitution）を定める
3. `specify`（あるいは `/specify`）から要件を決め、`plan` と `tasks` を生成
4. 小さな機能で試験的に `implement` と `review` を行い、テンプレートやチェックリストを改善
5. 組織的に採用する場合は `worktree` 戦略・ダッシュボード・CI 統合を整備

---

## 補足情報
- 各プロジェクトは MIT 等の寛容なライセンスを用いることが多く、テンプレートのカスタマイズ・再配布が行いやすい。
- Spec Kit 系はテンプレート構成・slash commands が標準化されており、特に複数エージェントで共有可能な設計になっている。

## 共通して学べるプロンプト設計・アーキテクチャパターン

- テンプレート＝プロンプト: テンプレート (spec, plan, tasks, prompt ファイル) は LLM への命令（system+user prompt の役割）で、フォーマットと制約を設けることで LLM の出力をガイドする
- 前提（Memory）を明文化: `constitution` や `research.md`、`specification.md` といったメモリを明示的な読み書き先にして LLM の "state" をハードル化するのは再現可能性を高める
- Agent-specific commands: エージェント向けに別々の command または manifest を用意し、各 agent の CLI / UI 仕様に合わせた prompt を生成する（`.claude/commands`, `.github/prompts/` 等）
- Tooling を Agent に与える: リポジトリ検索、コード抽出、シェル実行などを LLM が呼べる "tools" として提供すると、プロンプトに大量のコードを直接入れずに高精度な出力が得られる（Shotgun の実装例がわかりやすい）
- フロントマター + ペイロード: タスクプロンプトに frontmatter を付与してメタデータ（lane, agent, assignee, ID など）を渡すことで、ダッシュボードと CLI が同じ情報に基づいて動ける
- 厳格なルール/バリデーション: `validate` や `analyze` コマンドなどで生成物を機械的にチェック（成功基準、Scenario 構造、Delta 形式）する仕組みは品質管理に有効

## 実装導入（Quick Adoption Checklist）
- 1) まず `specify init` / `spec-kit init` でテンプレート群を投入し、チームの `constitution` を作る
- 2) 小さな機能で `specify` → `plan` → `tasks` → `implement` の 1 サイクルを試験的に回し、テンプレートとチェックリストを調整
- 3) Agent の選定と manifest の準備（どの agent を正式サポートするかを決め、必要なら agent-specific prompts を生成）
- 4) CI と `openspec validate`/`spec-kit analyze` のようなツール連携を用意し、生成結果を常時検証
- 5) ダッシュボード/Worktree を必要に応じて導入（並列開発やマルチエージェントコラボが必要なら）

## サンプル実行コマンド例（Quick Run）
以下は各ツールで最小の 1 サイクルを回すためのコマンド例と、期待される出力ファイルの抜粋です。

- Spec Kit
````bash
specify specify --title "Add email login"
````
期待: `specs/001-add-email-login/spec.md` を生成（User Stories, Success Criteria を含む）

- Spec Kitty
````bash
spec-kitty init
spec-kitty specify --title "Add email login"
````
期待: `kitty-specs/<feature>/tasks/planned/` にタスクが生成され、Dashbord がカードを表示

- OpenSpec
````bash
openspec changes create --title "Add email login" --desc "Add email authentication"
openspec validate
````
期待: `changes/<id>/proposal.md` と `openspec validate` が成功（構文チェック）

- Shotgun
````bash
shotgun index --repo ./myrepo
shotgun specify --repo ./myrepo --title "Add email login"
````
期待: `research.md`, `specification.md` のドラフトが生成され、`tools` を用いた依存解析結果が返る

- cc-sdd
````bash
tools/cc-sdd/spec-init --title "Add email login"
````
期待: `.claude/commands/spec-init.md` 等の agent 向けコマンドが manifest ベースで生成され、`specs/` にテンプレート準拠の spec が生成される

- Claude Code Spec Workflow
````bash
./cli.js spec-create "Add email login"
````
期待: `.claude/commands/spec-create.md` が参照され、`specs/001-add-email-login/spec.md` が生成される


---

（参考: `spec-driven.md`, `agents/*.j2` テンプレート、各 repo の `AGENTS.md` / `templates`）

---

（参考: 各 README と docs をベースに筆者が整理）