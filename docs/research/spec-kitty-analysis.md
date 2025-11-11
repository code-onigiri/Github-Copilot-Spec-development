# spec-kitty 詳細分析

**リポジトリ**: https://github.com/Priivacy-ai/spec-kitty  
**作成者**: Priivacy-ai (GitHub spec-kit の派生プロジェクト)  
**分析日**: 2025-01-11

---

## 1. 概要

spec-kitty は GitHub 公式の spec-kit をベースに、より実践的で柔軟な SDD フレームワークへと進化させたプロジェクト。

### 特徴的な独自機能

- **Mission System**: 異なるドメイン向けのワークフローカスタマイズ
- **Agent Context Update**: AI エージェントごとの自動コンテキスト更新
- **Kanban Workflow Integration**: タスク実行時の自動レーン移動とメタデータ管理
- **Validation Agent System**: 各フェーズで品質検証を自動実行

---

## 2. アーキテクチャ

### 2.1 ディレクトリ構造

```
.kittify/
├── missions/                    # Mission System (独自)
│   ├── software-dev/           # デフォルトミッション
│   │   ├── mission.yaml        # ミッション設定
│   │   ├── templates/          # ミッション固有テンプレート
│   │   │   ├── spec-template.md
│   │   │   ├── plan-template.md
│   │   │   ├── tasks-template.md
│   │   │   └── task-prompt-template.md
│   │   ├── commands/           # コマンドプロンプト
│   │   │   ├── specify.md
│   │   │   ├── plan.md
│   │   │   ├── tasks.md
│   │   │   ├── implement.md
│   │   │   ├── review.md
│   │   │   └── accept.md
│   │   └── constitution/
│   │       └── principles.md
│   ├── research/               # 研究用ミッション (POC)
│   └── active-mission -> missions/software-dev/  # シンボリックリンク
├── memory/                     # プロジェクト記憶
│   └── constitution.md         # Nine Articles Constitution
└── core/                       # 汎用ワークフローエンジン
    ├── scripts/
    └── validators/

kitty-specs/                     # 機能仕様格納先
└── {###-feature-name}/
    ├── spec.md
    ├── plan.md
    ├── tasks.md
    ├── research.md
    ├── data-model.md
    ├── quickstart.md
    ├── contracts/
    └── tasks/                  # Kanban レーン
        ├── planned/            # WPxx-slug.md
        ├── doing/
        ├── for_review/
        └── done/
```

### 2.2 Mission System (独自機能)

**目的**: ドメインごとにワークフローをカスタマイズ

**現在提供されているミッション**:

1. **Software Dev Kitty** (デフォルト): アプリケーション開発用 SDD
2. **Deep Research Kitty**: エビデンス収集・分析・合成用

**ミッション構成要素**:

```yaml
# mission.yaml の例
name: "Software Dev Kitty"
description: "Specification-driven development for shipping features"
workflow_phases:
  - specify: "Define user scenarios and acceptance criteria"
  - plan: "Design technical architecture and implementation plan"
  - tasks: "Break into work packages with TDD workflow"
  - implement: "Execute implementation following test-first methodology"
  - review: "Perform code review and validate against specification"
  - accept: "Validate feature completeness and quality gates"

validation:
  checks:
    - "constitution_compliance"
    - "template_structure"
    - "requirement_traceability"

task_metadata:
  required:
    - task_id
    - lane
    - phase
    - agent
  optional:
    - shell_pid
    - assignee
    - estimated_hours
```

**ミッション切り替え**:

```bash
spec-kitty mission list          # 利用可能なミッション一覧
spec-kitty mission current       # アクティブなミッション情報
spec-kitty mission switch research  # Research Kitty に切り替え
spec-kitty mission info research # ミッション詳細表示
```

---

## 3. コマンドシステム

### 3.1 コア 6 コマンド

| コマンド                | フェーズ | 目的           | 前提条件     |
| ----------------------- | -------- | -------------- | ------------ |
| `/spec-kitty.specify`   | 0        | 機能仕様作成   | なし         |
| `/spec-kitty.plan`      | 1        | 設計・契約生成 | spec.md      |
| `/spec-kitty.tasks`     | 2        | タスク分解     | plan.md      |
| `/spec-kitty.implement` | 3        | 実装実行       | tasks.md     |
| `/spec-kitty.review`    | 4        | コードレビュー | 実装完了     |
| `/spec-kitty.accept`    | 5        | 品質ゲート検証 | レビュー完了 |

### 3.2 補助コマンド

| コマンド                   | 用途                             |
| -------------------------- | -------------------------------- |
| `/spec-kitty.clarify`      | 曖昧な仕様の明確化               |
| `/spec-kitty.checklist`    | 検証チェックリスト生成           |
| `/spec-kitty.analyze`      | 成果物の整合性分析               |
| `/spec-kitty.constitution` | Constitution 更新                |
| `/spec-kitty.research`     | Phase 0 研究アーティファクト生成 |

### 3.3 コマンド実行フロー (例: `/spec-kitty.plan`)

**実行ステップ**:

1. **Planning Interrogation** (必須)

   - 機能の複雑度を評価:
     - Trivial/Test: 1-2 質問のみ
     - Simple: 2-3 質問
     - Complex: 3-5 質問
     - Platform/Critical: 5+ 質問
   - ユーザーシグナル検出: "use defaults", "just make it simple", "vanilla HTML/CSS/JS"
   - **Engineering Alignment** サマリー確認後に次へ進む

2. **Setup**: Bash/PowerShell スクリプト実行

   ```bash
   scripts/bash/setup-plan.sh --json
   # Output: FEATURE_SPEC, IMPL_PLAN, SPECS_DIR, BRANCH
   ```

3. **Load Context**:

   - `FEATURE_SPEC` (spec.md) 読み込み
   - `.kittify/memory/constitution.md` 読み込み
   - `IMPL_PLAN` テンプレート読み込み

4. **Execute Plan Workflow**:

   - Phase 0: Outline & Research
   - Phase 1: Design & Contracts
     - `data-model.md` 生成 (エンティティ定義)
     - `/contracts/` 生成 (OpenAPI/GraphQL スキーマ)
     - `quickstart.md` 生成
     - **Agent Context Update** (AI エージェント固有ファイル更新)

5. **Output**: plan.md, data-model.md, contracts/\*, quickstart.md, agent-specific file

### 3.4 Agent Context Update System (独自機能)

**目的**: AI エージェントごとに最適化されたコンテキストファイルを自動更新

**対応エージェント**:

```python
# src/specify_cli/__init__.py より
AGENT_CONFIGS = {
    "claude": {"dir": ".claude/commands", "ext": "md", "arg_format": "$ARGUMENTS"},
    "gemini": {"dir": ".gemini/commands", "ext": "toml", "arg_format": "{{args}}"},
    "copilot": {"dir": ".github/prompts", "ext": "prompt.md", "arg_format": "$ARGUMENTS"},
    "cursor": {"dir": ".cursor/commands", "ext": "md", "arg_format": "$ARGUMENTS"},
    "qwen": {"dir": ".qwen/commands", "ext": "toml", "arg_format": "{{args}}"},
    "opencode": {"dir": ".opencode/command", "ext": "md", "arg_format": "$ARGUMENTS"},
    "windsurf": {"dir": ".windsurf/workflows", "ext": "md", "arg_format": "$ARGUMENTS"},
    "codex": {"dir": ".codex/prompts", "ext": "md", "arg_format": "$ARGUMENTS"},
}
```

**更新スクリプト**:

```bash
scripts/bash/update-agent-context.sh __AGENT__
# 例: update-agent-context.sh claude
```

**agent-file-template.md の構造**:

```markdown
# [PROJECT NAME] Development Guidelines

Auto-generated from all feature plans. Last updated: [DATE]

## Active Technologies

[全 plan.md から抽出]

## Project Structure

[実際のプロジェクト構造]

## Commands

[アクティブな技術向けコマンドのみ]

## Code Style

[使用中の言語のみ]

## Recent Changes

[直近 3 つの機能追加内容]

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
```

**特徴**:

- ✅ 手動追加セクションを保持 (`<!-- MANUAL ADDITIONS -->`)
- ✅ 新規技術のみ追加 (既存は上書きしない)
- ✅ Agent 検出自動化 (現在使用中の AI を判別)

---

## 4. Kanban Workflow Integration (独自機能)

### 4.1 タスクレーン管理

**4 つのレーン**:

```
kitty-specs/{feature}/tasks/
├── planned/      # 計画済み (未着手)
├── doing/        # 実行中
├── for_review/   # レビュー待ち
└── done/         # 完了
```

### 4.2 Work Package Prompt Files

**ファイル名形式**: `WPxx-slug.md`

**Frontmatter メタデータ**:

```yaml
---
work_package_id: WP01
title: "Setup & Environment"
lane: doing # planned | doing | for_review | done
phase: "Phase 0"
priority: P0
agent: claude # 実行中の AI エージェント
shell_pid: 12345 # バックグラウンドプロセス ID
assignee: "user@example.com" # オプション
estimated_hours: 4 # オプション
---
```

### 4.3 `/spec-kitty.implement` の自動化

**実行時の自動処理**:

1. **Prompt Selection**:

   - `/tasks/planned/` からプロンプトを選択
   - ユーザーに確認

2. **Kanban Transition**:

   - `planned/WP01-setup.md` → `doing/WP01-setup.md` に移動
   - Frontmatter 更新:
     ```yaml
     lane: doing
     agent: claude
     shell_pid: 67890
     ```
   - Activity Log 追記:

     ```markdown
     ## Activity Log

     - 2025-01-11 14:30 - Moved to doing by claude (PID: 67890)
     ```

3. **Git Commit**:

   ```bash
   git add .
   git commit -m "chore(tasks): start WP01 - Setup & Environment"
   ```

4. **Implementation Execution**:

   - プロンプトファイルの指示に従って実装
   - コンテキスト読み込み:
     - `.kittify/memory/constitution.md`
     - `kitty-specs/{feature}/plan.md`
     - `kitty-specs/{feature}/tasks.md`
     - `kitty-specs/{feature}/data-model.md`
     - `kitty-specs/{feature}/contracts/`

5. **Completion Transition**:

   - `doing/WP01-setup.md` → `for_review/WP01-setup.md` に移動
   - Frontmatter 更新:
     ```yaml
     lane: for_review
     completed_at: 2025-01-11T16:45:00Z
     ```
   - Activity Log 追記:
     ```markdown
     - 2025-01-11 16:45 - Moved to for_review - implementation complete
     ```

6. **Git Commit**:
   ```bash
   git add .
   git commit -m "feat(WP01): complete Setup & Environment implementation"
   ```

**利点**:

- ✅ タスク状態が Git 履歴に記録される
- ✅ 複数エージェントでの並行作業が可能
- ✅ 進捗の可視化 (どのタスクが誰に割り当てられているか)
- ✅ レビュープロセスの強制 (`for_review` レーンを経由)

---

## 5. Progressive Disclosure (段階的開示)

### 5.1 Planning Interrogation の複雑度適応

**Trivial/Test Features**:

- 質問数: 1-2
- 例: "hello world", 静的ページ, デモ
- 判断基準: tech stack preference のみ聞く → sensible defaults で進行

**Simple Features**:

- 質問数: 2-3
- 例: 小規模コンポーネント, マイナー API 追加
- 判断基準: tech choices と constraints を確認

**Complex Features**:

- 質問数: 3-5
- 例: 新規サブシステム, マルチコンポーネント機能
- 判断基準: architecture, NFRs, integrations をカバー

**Platform/Critical Features**:

- 質問数: 5+
- 例: コアインフラ, セキュリティ, 決済
- 判断基準: 全質問項目をフル interrogation

**ユーザーシグナル認識**:

```markdown
# コマンドテンプレートより

- "use defaults", "just make it simple", "skip to implementation"
- "vanilla HTML/CSS/JS"
  → これらを検出したら質問数を最小化
```

### 5.2 Context Loading Strategy

**原則**: "必要な部分のみを段階的に読み込む"

**例 (`/spec-kitty.checklist` コマンド)**:

```markdown
## Context Loading Strategy:

- Load only necessary portions relevant to active focus areas
- Prefer summarizing long sections into concise scenario/requirement bullets
- Use progressive disclosure: add follow-on retrieval only if gaps detected
- If source docs are large, generate interim summary items instead of embedding raw text
```

**実装例**:

```python
# Phase 1: 必要最小限のコンテキスト
if focus_area == "UX":
    load(spec_md, sections=["User Stories", "Edge Cases"])
elif focus_area == "API":
    load(spec_md, sections=["Functional Requirements", "API Contracts"])

# Phase 2: ギャップ検出時のみ追加読み込み
if ambiguity_detected:
    load(plan_md, sections=["Technical Context"])
```

---

## 6. Validation Agent System (品質検証)

### 6.1 Validation Workflow

**自動検証タイミング**:

- Requirements 完成後 → `spec-requirements-validator`
- Design 完成後 → `spec-design-validator`
- Tasks 完成後 → `spec-tasks-validator`

**検証項目** (例: Requirements Validator):

```markdown
1. Read requirements.md
2. Validate against all quality criteria:
   - Structure compliance
   - User stories format ("As a [role], I want [feature], so that [benefit]")
   - Acceptance criteria (EARS format: WHEN/IF/THEN)
   - Completeness
3. Check alignment with steering documents (product.md, tech.md, structure.md)
4. Provide specific feedback and improvement suggestions
5. Rate overall quality: PASS, NEEDS_IMPROVEMENT, MAJOR_ISSUES
```

**検証失敗時のフィードバックループ**:

```
1. Agent が初版を生成
2. Validator が検証 → NEEDS_IMPROVEMENT
3. Validator がフィードバックを提供:
   - "User Story 2 lacks a benefit clause"
   - "Acceptance Criteria 3.1 missing WHEN condition"
4. Agent が修正
5. 再検証 → PASS
6. ユーザーに提示
```

**Validation がない場合**:

```markdown
# テンプレートより

- **If validation agent not available**:
  Review the requirements manually against template criteria first
- **Only present to user after validation passes or improvements are made**
```

### 6.2 Constitutional Compliance Check

**Nine Articles Constitution との照合**:

```markdown
## Constitution Check (plan.md より)

Each plan must verify compliance with project principles:

1. **Load constitution**: Read `/memory/constitution.md`
2. **Check each article**:
   - Article I: Simplicity Over Cleverness
   - Article II: Testability Is Non-Negotiable
   - Article III: Progressive Enhancement
   - Article IV: Explicit Over Implicit
   - Article V: Fail Fast, Fail Loud
   - Article VI: Documentation Lives With Code
   - Article VII: Composition Over Inheritance
   - Article VIII: Immutability By Default
   - Article IX: Security Cannot Be An Afterthought
3. **Flag violations**:
   - Note: "This design violates Article II (Testability) because..."
4. **Require justification or revision**
```

**例 (tasks.md でのチェック)**:

```markdown
## Task Validation

Before generating tasks, verify:

- ✅ All tasks reference specific requirements (traceability)
- ✅ No task violates constitutional principles
- ✅ Each task is independently testable (Article II)
- ✅ Security tasks included when needed (Article IX)
```

---

## 7. Template-Driven Quality (テンプレート駆動の品質保証)

### 7.1 LLM 制約としてのテンプレート

**原理**: "テンプレートは構造化プロンプト"

**効果**:

1. **実装詳細の早期混入を防止**:

```markdown
# spec-template.md より

**IMPORTANT**: This specification should focus on WHAT and WHY, not HOW.

❌ BAD: "Use JWT tokens stored in localStorage"
✅ GOOD: "System must authenticate users securely"
```

2. **不確実性マーカーの強制**:

```markdown
# plan-template.md より

[NEEDS CLARIFICATION: How should we handle offline sync conflicts?]
[ASSUMPTION: Using PostgreSQL as decided in tech stack]
[TODO: Verify with security team on encryption requirements]
```

3. **チェックリストによる構造化思考**:

```markdown
# tasks-template.md より

## Definition of Done Checklist

- [ ] All subtasks completed
- [ ] Unit tests passing (>80% coverage)
- [ ] Integration tests written
- [ ] API documentation updated
- [ ] Security scan clean
- [ ] Performance benchmarks met
```

4. **Constitutional Gates**:

```markdown
# plan-template.md より

## Constitution Check

- Article I (Simplicity): ✅ Design avoids unnecessary abstractions
- Article II (Testability): ✅ All components have test interfaces
- Article IX (Security): ⚠️ NEEDS REVIEW - OAuth scope validation unclear
```

5. **階層的詳細管理**:

```markdown
# plan-template.md より

**IMPORTANT**: This plan should remain high-level and readable.
Any code samples, detailed algorithms, or extensive technical specifications
must be placed in `/contracts/` or `implementation-details/` files.
```

6. **Test-First Thinking**:

```markdown
# tasks-template.md より

### File Creation Order

1. Create `contracts/` with API specifications
2. Create test files: contract → integration → e2e → unit
3. Create source files to make tests pass
```

### 7.2 Compound Effect (複利効果)

**テンプレート × コマンド × Validation の相乗効果**:

```
Quality = Template Structure × Command Automation × Validation Gates × Progressive Disclosure

例:
- Template: "User stories must have 'As a / I want / so that' format"
- Command: `/spec-kitty.specify` が自動生成
- Validation: Validator が形式チェック
- Disclosure: Trivial feature なら質問を最小化

→ 結果: 高品質な仕様が短時間で完成
```

---

## 8. 独自性の評価

### 8.1 spec-kit (GitHub 公式) との差分

| 要素                   | spec-kit                | spec-kitty                         | 評価          |
| ---------------------- | ----------------------- | ---------------------------------- | ------------- |
| Mission System         | ❌                      | ✅ (software-dev / research)       | **独自**      |
| Agent Context Update   | ❌                      | ✅ (8+ agents 対応)                | **独自**      |
| Kanban Workflow        | ❌                      | ✅ (4 lanes + metadata)            | **独自**      |
| Validation Agents      | ❌                      | ✅ (自動品質検証)                  | **独自**      |
| Progressive Disclosure | ⚠️ 基本的               | ✅ 複雑度適応型                    | **強化**      |
| Constitution           | ✅ Nine Articles        | ✅ 継承 + ミッション固有拡張       | **継承+拡張** |
| CLI Tooling            | ⚠️ Bash/PowerShell のみ | ✅ Python CLI (spec-kitty command) | **強化**      |

### 8.2 他フレームワークと比較した独自性

**Mission System**:

- OpenSpec: ドメイン切り替え機能なし
- cc-sdd: Steering は単一プロジェクト向け
- **spec-kitty**: 複数ミッション間の切り替え可能 (**独自**)

**Kanban Integration**:

- shotgun: タスク管理は `tasks.md` のチェックボックスのみ
- claude-code-spec-workflow: レーン概念なし
- **spec-kitty**: Git 連動のレーン移動 + メタデータ管理 (**独自**)

**Agent Context Update**:

- 他フレームワーク: 汎用的な `AGENTS.md` / `CLAUDE.md` のみ
- **spec-kitty**: AI エージェントごとに最適化されたファイル自動更新 (**独自**)

---

## 9. 統合可能性

### 9.1 私たちのフレームワークへの統合アイデア

**採用すべき要素**:

1. **Mission System のコンセプト**:

   - 用途: Spec 駆動開発 / Debug-Driven Fix / Critical Dialogue 用に切り替え
   - 実装: `.specify/missions/{mode}/` 配下にコマンド・テンプレートを配置

2. **Agent Context Update**:

   - 用途: GitHub Copilot 向けの `.github/copilot-instructions.md` を自動更新
   - 実装: `plan` コマンド実行時に新規技術スタックを追記

3. **Kanban Workflow Integration** (簡易版):

   - 用途: タスク進捗の可視化
   - 実装: `tasks.md` に `lane:` フィールドを追加 (`TODO | DOING | REVIEW | DONE`)

4. **Progressive Disclosure の複雑度適応**:

   - 用途: ユーザー負担軽減
   - 実装: `plan` コマンドで機能の複雑度を判定 → 質問数を調整

5. **Validation System** (軽量版):
   - 用途: 品質保証
   - 実装: 各コマンド終了時にセルフチェック項目を表示

### 9.2 避けるべき要素

❌ **Python CLI の完全移植**:

- 理由: GitHub Copilot Chat は Python CLI 呼び出しが困難
- 代替: Bash スクリプトの活用 (VS Code 統合が容易)

❌ **Mission System の複雑な YAML 設定**:

- 理由: 小規模個人プロジェクトには過剰
- 代替: シンプルなディレクトリ切り替え (`/ikak:mode research`)

---

## 10. 弱点とリスク

### 10.1 学習コストの高さ

**問題**:

- Mission System, Kanban Workflow, Validation Agents など機能が多岐にわたる
- 初心者が全体を理解するのに時間がかかる

**対策**:

- チュートリアル動画・ドキュメント整備
- デフォルト設定で即座に使えるようにする

### 10.2 Python 依存

**問題**:

- CLI ツールが Python で実装されている
- Python 環境がない場合はセットアップが必要

**影響**:

- GitHub Copilot Chat との統合が難しい (Python 実行が必要)

### 10.3 オーバーエンジニアリングのリスク

**問題**:

- 小規模機能にも Mission System, Kanban, Validation を強制すると重い

**spec-kitty の対策**:

- Progressive Disclosure で Trivial features は質問を最小化
- Mission 切り替えでワークフローを調整可能

---

## 11. まとめ

### 強み

1. ✅ **Mission System**: ドメインごとのワークフロー最適化
2. ✅ **Kanban Workflow Integration**: タスク状態管理の自動化
3. ✅ **Agent Context Update**: 複数 AI エージェント対応
4. ✅ **Validation System**: 品質保証の自動化
5. ✅ **Progressive Disclosure**: 複雑度適応型の質問調整
6. ✅ **Template-Driven Quality**: テンプレートが LLM の出力を制約

### 弱み

1. ❌ Python 依存 (GitHub Copilot Chat との統合が困難)
2. ❌ 学習コストが高い (機能が多岐)
3. ❌ 小規模プロジェクトには過剰な可能性

### 私たちのフレームワークへの示唆

**採用**:

- Mission System のコンセプト (モード切り替え)
- Agent Context Update (GitHub Copilot 向け)
- Progressive Disclosure (質問数の調整)
- Validation System (セルフチェック)

**回避**:

- Python CLI の完全移植
- 複雑な YAML 設定
- フルスペックの Kanban Workflow (簡易版で十分)

---

**次のステップ**: shotgun と claude-code-spec-workflow の分析を完了し、全 6 フレームワークの比較表を更新する。
