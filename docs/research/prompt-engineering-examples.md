# プロンプトエンジニアリング：具体例集

このドキュメントは、調査した SDD ツール群（Spec Kit / Spec Kitty / OpenSpec / Shotgun / cc-sdd / Claude Code Spec Workflow）で観察された具体的なプロンプトデザインを抜粋し、実例とその目的、効果、注意点を整理したものです。テンプレートやフロントマター、System Prompt、ツールの使い方までカバーしています。

---

## 1. 基本パターン（共通のテンプレート / 役割）

- System Prompt（システム指示）
  - 役割: エージェントの振る舞いを定義する（ex: "You are an experienced Specification Analyst"）
  - 例（Shotgun）: `agents/research.j2` の冒頭は "You are an experienced Research Assistant" で、成果物ファイル（research.md 等）に書き込むことを明記しています。

- Frontmatter（YAML メタデータ）
  - 役割: タスクを構造的に管理するためのメタ情報（`work_package_id`, `lane`, `agent`, `assignee` 等）
  - 例（Spec Kitty / Spec Kit）:

```markdown
---
work_package_id: "WP01"
subtasks:
  - "T001"
title: "Setup & Environment"
lane: "planned"
agent: "claude"
assignee: "alice"
---
```

- Prompt Body（実装指示本体）
  - 役割: 何をするか／成功条件／出力形式／ファイルパスなどを明示的に指示
  - 例: `# Work Package Prompt: WP01 – Setup & Environment` の下に目的・前提・手順・テスト戦略を記載します（Spec Kitty の `task-prompt-template.md` を参照）。

---

## 2. Spec Kit / Specify の具体例

- 目的: `specify` コマンドで要求を受け取り、`spec-template.md` のフォーマットに従って `spec.md` を生成する。テンプレートは「WHAT を書く、HOW を書かせない」よう強く制約します。
- 実例: `templates/commands/specify.md` の要点
  - ユーザ入力から "short name" を生成し、番号を割り当てる（git ブランチ管理と整合）
  - `[NEEDS CLARIFICATION]` マーカーの運用: 最大 3 つまで明確にし、それ以外は合理的なデフォルトで補完
  - Spec チェックリスト（生成・自動検証）：仕様がテスト可能か、設計漏れはないか等を検証する

- 具体プロンプト断片: (コマンドテンプレートに基づく)
```text
Given the user description "$ARGUMENTS", generate:
1. A concise 2-4 word feature short name
2. A prioritized set of user stories (P1/P2/P3)
3. A set of measurable success criteria (SC-001 etc.)
4. Any [NEEDS CLARIFICATION: ...] markers (max 3)
```

- 効果/注意点
  - テンプレートが LLM の出力範囲を制限して、逸脱した実装指示を減らす
  - `constrution`（憲章）と結びつけることで、一貫した設計原則を守る

---

## 3. Spec Kitty（Kanban / Work Package）の具体例

- 目的: `task-prompt-template.md` によって Work Package のプロンプトを標準化し、Kanban（`tasks/{planned,doing,for_review,done}`）運用とダッシュボードを連携
- 実例: `templates/task-prompt-template.md` フロントマターと本文

```markdown
---
work_package_id: "WP01"
subtasks:
  - "T001"
title: "Replace with work package title"
lane: "planned"
agent: "claude"
assignee: ""
review_status: ""
history: []
---

# Work Package Prompt: WP01 – Replace with work package title

## Objectives & Success Criteria
- Summarize the exact outcomes that mark this work package complete.

## Subtasks & Detailed Guidance
- T001: Create project skeleton
- T002: Create test scaffolds

## Definition of Done Checklist
- [ ] All subtasks completed and validated
```

- ダッシュボード連携: `dashboard/scanner.py` が frontmatter を解析して Kanban カードを生成
- 効果/注意点
  - `lane` と `review_status` により、UI と AI の間で状態遷移を一貫して追跡できる
  - `shell_pid` / `history` などのランタイムメタを付与することで、タスクの継続や再利用が追跡できる

---

## 4. OpenSpec（Proposal / Delta）具体例

- 目的: 既存コードベースに対する変更提案（`changes/<id>`）を明確化し、差分（delta）で `specs/` を更新・検証する
- 実例: `proposal.md` の構成
```markdown
## Why
Problem statement

## What Changes
- ADDED: New login endpoint
- MODIFIED: Existing auth flow

## Impact
- Affects `specs/auth/spec.md` and `specs/users/spec.md`
```
- Delta 例 (`changes/<id>/specs/auth/spec.md`)
```markdown
## ADDED Requirements
### Requirement: New login endpoint
#### Scenario: user login success
- **WHEN** user supplies credentials
- **THEN** system returns token
```
- 効果/注意点
  - `openspec validate` による strict validation によって、構文ミス（`#### Scenario` の不備等）を防げる
  - Proposal の段階で tasks と deltas を合わせて作ることで、実装時の迷いや誤実装を減らす

---

## 5. Shotgun（Tool-as-Agent と System Prompt）の具体例

- 目的: リポジトリ全体をインデックスして LLM にコードベースコンテキストを提供し、Tools（`retrieve_code`, `query_graph` 等）を通して安全にコード断片を読み出す
- 実例: System Prompt + Tools の使い分け
  - System Prompt: `research.j2` では `You are an experienced Research Assistant` と役割を定義し、`read_file("research.md")` で永続的なメモリを参照しなさいと指定する
  - Tools 呼び出しパターン:

```python
# シンプルな実行例（擬似）
result = run_agent(
  agent=specify_agent,
  prompt="Create specification for: Add user auth",
  deps=deps,
  message_history=message_history
)
# ここで agent は `retrieve_code`, `query_graph` などの tool を呼んで、ファイルや依存を取得できる
```

- 効果/注意点
  - Tools は LLM に安全にリポジトリ情報を参照する手段を与え、Context の過負荷を防ぐ
  - `SystemStatusPrompt` により TOC・現在のファイル一覧・時刻や timezone をテンプレート化して渡すと、LLM の推奨が実運用に近づく

---

## 6. cc-sdd（Manifest-Driven Prompt の例）

- 目的: Agent manifest を使って agent-specific prompt を生成する
- 実例: manifest JSON (一部)
```json
{
  "name": "claude-code",
  "folder": ".claude/",
  "commands": [
    "spec-init", "spec-tasks", "spec-impl"
  ]
}
```
- Template + manifest の結合: CLI は manifest の値をテンプレートに注入して `.claude/commands/kiro-spec-init.md` などを生成します
- 効果/注意点
  - manifest により agent の matrix（フォルダ・CLI/IDE サポート・入出力フォーマット）を一元管理できる
  - manifest の維持は大規模な agent サポートでの保守負担を増やす

---

## 7. Claude Code Spec Workflow（`/spec-create` / `spec-execute`）の具体例

- 目的: Claude に最適化した slash command を用い、spec の生成・タスク実行を高速に行う
- 実例: `spec-create.md` のフロー要点
  - 検証パス: `spec-requirements-validator` agent を使って自動検証
  - `spec-execute` によるタスク実行は、`/spec-execute 1 feature-name` などの CLI スラッシュコマンドを用いる
- 効果/注意点
  - LLM に最適化したプロンプトと UI（slash commands）により、反復的な人手の操作が減る
  - Claude 特化で最適化されている点は移植性のトレードオフ

---

## 8. 実践的なプロンプトパターン（まとめ）

- Frontmatter（YAML）で状態／メタを渡す（`lane`, `subtasks`, `work_package_id`）
- System Prompt で "ファイルの読み書き権" を明確にする（どのファイルを読み書きして良いか）
- Tools によるコード参照（`retrieve_code`, `query_graph`, `read_file`）を活用して、長大なコードベースを省略
- Clarification Pattern (例: `NEEDS CLARIFICATION` の運用) - 提案や spec にユーザ選択が必要な箇所を残し、最大数を制限して自動生成を安定化
- Validation / Analyze: `validate` / `analyze` で自動チェックを入れる（必須）
- Success Criteria を必ず「technology-agnostic」に設計する（例: SC-001: 90% の検索応答が 1 秒未満ではなく "ユーザは検索結果を 1 秒以内に得られる" といったユーザ視点）

---

## 9. サンプル・ワークフロー（実装に使える短い例）

- 1) `/speckit.specify Add user authentication with email`（Spec Kit）
  - 自動生成: `specs/001-user-auth/spec.md`
  - `spec-template.md` に従って `User Stories`、`FR-xxx`、`SC-xxx` を生成

- 2) `spec-kitty.tasks` で `tasks/planned/WP01-setup.md` を生成
  - `task-prompt-template` の frontmatter で `agent: claude` や `lane: planned` を設定

- 3) `specify` agent が `read_file("research.md")` を呼び、`specification.md` を作成
  - `validate` を通過したら `specify` は `plan` へハンドオフ

---

## 11. 追加の具体例（実行に使えるサンプル）

### 11.1 System Prompt（Constitution + System Status 結合）
以下は実際の運用でよく見るパターンで、`constitution`（プロジェクト方針）を明示して `system status` を注入するパターンです。

````text
System: You are an experienced specification engineer who must follow the project's Constitution and respond in the requested format.

Constitution (from `.specify/memory/constitution.md`):
- Keep designs minimal
- Prefers secure default configuration
- Use pragmatic tradeoffs when TLDR required

SystemStatus:
- TOC: ["specs/auth/spec.md", "specs/users/spec.md"]
- RepoFiles: 173 files, 15MB
- Existing Specs: 4
- Timezone: UTC

Instruction:
1) Produce only markdown within code blocks unless asked
2) Output must follow the JSON schema provided as `OUTPUT_SCHEMA`
3) Use `NEEDS CLARIFICATION` markers only when user input is needed
4) When referencing code, prefer `retrieve_code(path)` tool rather than copying large files

OUTPUT_SCHEMA:
{
  "spec_id": "string",
  "short_name": "string",
  "user_stories": ["string"],
  "success_criteria": [{"id":"string","text":"string"}]
}
````

この System Prompt は `Shotgun` の Jinja テンプレートや `spec-kit` の `constitution` に組み合わせて使われます。

### 11.2 Jinja Prompt テンプレート例（Shotgun / Spec Kit）
テンプレート側では Jinja 変数を宣言しておき、CLI や agent 実行時にコンテキストを注入します:

````jinja
{% raw %}---
work_package_id: "{{ work_package_id }}"
title: "{{ title }}"
agent: "{{ agent | default('claude') }}"
lane: "{{ lane | default('planned') }}"
---

# Prompt: {{title}}

## Context
- Repo: {{ repo_name }}
- Files: {{ files | join(', ') }}

## Task
1. Write a concise description
2. Provide 3 user stories
3. Provide 2 success criteria
{% endraw %}
````

使用時は CLI や Agent の `render_template` 呼び出し時に `work_package_id, title, repo_name, files, agent` 等の値を渡します。

### 11.3 Tools 呼び出し例（Shotgun 範例）
Shotgun の agent は `retrieve_code(path)` や `query_graph(query)` といったツールを持ちます。実際のメッセージ例:

````text
User: Please produce a spec fragment for adding an email login.
Agent: Calling retrieve_code("specs/auth/spec.md")
Tool: [File content returned]
Agent: Based on the current spec file, proposed changes are: (list)...
````

ツールを使うことで、LLM が一度に全てのファイルを持たずとも必要な断片を参照できます。

### 11.4 Token Compaction（Token Limit 対策）の実例
長大なコードベースを扱う Shotgun では token limit を超えないように、`token_limit_compactor`（要約器）を使います。使い方の例（概念）:

````text
# Pseudo code
context = get_context_files(file_list)
compact = token_limit_compactor(context, max_tokens=4000)
agent_prompt += compact
run_agent(agent_prompt)
````

token_limit_compactor は、重要度の低いファイルを短い要約に置き換え、重要なファイルはフルテキストのまま残すなどして、LLM に渡すトークン量を調整します。

### 11.5 Spec Kit の PoC 具体例（Spec -> Plan -> Tasks の実行イメージ）
以下は実際の PoC で行うとよい最小のシナリオです（コマンド例）。

1) Spec を作成（CLI 使用）
````bash
specify specify --title "Add email login" --desc "Allow users to login using email and password"
````
期待出力: `specs/001-add-email-login/spec.md` が生成され、こんな記述を含む:

```markdown
## User Story: Email-based login (P1)
- As a user, I want to login with email and password so that I can access my account

## Success Criteria
- SC-001: Users can sign in with email and be redirected to dashboard on success.
```

2) Plan を生成
````bash
specify plan --spec specs/001-add-email-login/spec.md
````
期待出力: `plans/001-add-email-login/plan.md` が生成され、技術方針（認証フロー、token management、DB schema など）を列挙

3) Tasks を生成
````bash
specify tasks --plan plans/001-add-email-login/plan.md
````
期待出力: `tasks/planned/WP01-add-email-login.md` が生成され、frontmatter に `agent`, `lane`, `assignee` などが記載される

### 11.6 Spec Kitty: Kanban での状態遷移の具体例
Kanban の `lane` を `planned` -> `doing` -> `for_review` -> `done` に変化させるために、以下の frontmatter を更新します:

```markdown
---
work_package_id: "WP01"
lane: "doing"
assignee: "bob"
history:
  - {lane: "planned", when: "2025-11-01T10:00:00Z", actor: "alice"}
---
```

`dashboard/scanner.py` は `history` の変更を履歴として残すため、Kanban の UI で変更が一覧できるようになります。

### 11.7 OpenSpec: Delta Validation 実例

OpenSpec の `changes/` を使った場合、`openspec validate` は次のような不正を検出します:

- Scenario: `proposal.md` が `MODIFIED: spec.md` と書かれているが、実際には `spec.md` に `ADDED` セクションを入れず構文ミス（### と #### の関係が崩れている）
- `openspec validate` は `delta` に不整合がある旨を返し、CI からのブロックが可能

### 11.8 Clarification Pattern（NEEDS CLARIFICATION）の実例
生成プロンプトで曖昧さが残る場合、`NEEDS CLARIFICATION` を使った質問を残すことで自動化の破綻を防ぎます。以下は例です。

````text
User Input: "Add login support"

Agent Generated Spec (partial):
- Short name: "add-login"
- Needs Clarification: [NEEDS CLARIFICATION: Do we require OAuth integration?]
````

このように `NEEDS CLARIFICATION` を残し max=3 のルールをテンプレート側で設けることで、LLM による推定値のみの補完を避け、ユーザ判断を促すことができます。

---

これらの追加例は、プロンプトテンプレートの実務運用で役に立つ短い例を意図しています。さらに具体的な PoC（実行ログ、実際の agent の呼び出し、期待される JSON スキーマでの Validation など）が必要であれば、どのツールで PoC を行うかを教えてください。PoC 用のコマンド列、仮想環境セットアップ手順、テスト仕様を作成して、実行サポートします。

---

## 10. 参考（調査済みファイル）
- Spec Kit: `templates/commands/specify.md`, `templates/spec-template.md`, `spec-driven.md`
- Spec Kitty: `templates/task-prompt-template.md`, `src/specify_cli/dashboard/scanner.py`
- OpenSpec: `openspec/AGENTS.md`, `openspec/changes/*` の `proposal.md`
- Shotgun: `src/shotgun/prompts/agents/*.j2`, `src/shotgun/agents/common.py` `build_agent_system_prompt`
- cc-sdd: `tools/cc-sdd/templates/manifests/*`, `tools/cc-sdd/templates/agents/*` 
- Claude Code Spec Workflow: `.claude/commands/*.md`, `src/markdown/templates/*`

---

このドキュメントをベースとして PoC でテンプレートを実行する例（`specify init` → 1 サイクル）や、テンプレート差分比較、CI での `validate` 組み込み手順などを順次追加可能です。どの例を PoC に使うか指定いただければ、その実行手順（install / init / run）の具体コマンドとチェック手順を組んで検証をサポートします。

### 11.9 ガードレール（JSON Schema）による出力検証の例
システムプロンプトで `OUTPUT_SCHEMA` を規定し、LLM の返却がこの JSON スキーマに準拠するかを `jsonschema` で検証するパターンは、テストや CI で運用されます。例:

````json
{"type": "object", "properties": { "spec_id": {"type":"string"}, "short_name": {"type":"string"}, "user_stories": {"type":"array", "items":{"type":"string"}} }, "required":["spec_id","short_name","user_stories"] }
````

LLM 生成の末尾に `OUTPUT_JSON:` のコードブロックを要求し、CI 側で `jsonschema` 検証を行うと自動的に構造化された検証が可能になります。
