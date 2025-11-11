# OpenSpec 詳細分析

**分析日**: 2025-11-11  
**対象リポジトリ**: https://github.com/Fission-AI/OpenSpec

## 概要

OpenSpec は、**変更提案駆動**のスペック管理システムです。「現在の真実（specs/）」と「提案された変更（changes/）」を明確に分離し、AI エージェントが提案を生成 → 人間が承認 → 実装 → アーカイブというサイクルを確立しています。

---

## 1. 核心的なアーキテクチャ

### 1.1 二層ディレクトリ構造

```
openspec/
├── project.md              # プロジェクト規約
├── specs/                  # 【現在の真実】デプロイ済み機能
│   └── [capability]/
│       ├── spec.md         # 要件とシナリオ
│       └── design.md       # 技術パターン（オプション）
├── changes/                # 【提案】変更すべき内容
│   ├── [change-name]/
│   │   ├── proposal.md     # Why, What, Impact
│   │   ├── tasks.md        # 実装チェックリスト
│   │   ├── design.md       # 技術決定（オプション）
│   │   └── specs/          # デルタ変更
│   │       └── [capability]/
│   │           └── spec.md # ADDED/MODIFIED/REMOVED
│   └── archive/            # 完了した変更
└── AGENTS.md               # AIアシスタント指示書
```

**重要な哲学**:

- **specs/** = IS（現在の状態）
- **changes/** = SHOULD（将来あるべき姿）
- **デルタスペック**: 変更内容を`## ADDED/MODIFIED/REMOVED Requirements`で明示

### 1.2 変更のライフサイクル

```
1. Creating → proposal.md, tasks.md, design.md, delta specs
       ↓
2. Implementing → proposal理解 → design確認 → tasks実行 → 完了マーク
       ↓
3. Archiving → archive/へ移動 → specs更新
```

---

## 2. 革新的なデルタスペック方式

### 2.1 クリーンな未来状態保存

従来の diff 形式ではなく、**変更後の完全な状態**を保存：

**悪い例（diff 汚染）**:

```markdown
- User can login with email

* User can login with email or OAuth
```

**OpenSpec の方式**:

```markdown
## MODIFIED Requirements

### Requirement: User Authentication

User can login with email or OAuth.

#### Scenario: OAuth login

- **WHEN** user clicks "Login with Google"
- **THEN** redirect to OAuth provider
- **AND** create session on callback
```

**利点**:

- ✅ 可読性が高い（diff 記号なし）
- ✅ AI 互換性（標準的な Markdown）
- ✅ ツール非依存（任意の diff ツールで差分表示可能）
- ✅ 意図が明確（explicit な提案）

### 2.2 構造化シナリオフォーマット

```markdown
### Requirement: [要件名]

[要件の説明文]

#### Scenario: [シナリオ名]

- **WHEN** [トリガー条件]
- **THEN** [期待される結果]
- **AND** [追加条件や結果]
  - サブポイント（詳細）
  - さらに詳細
```

**特徴**:

- ボールド化されたキーワード（WHEN/THEN/AND）
- 一貫した構造でパース可能
- Gherkin 風だがより柔軟

### 2.3 変更マーカー

```markdown
## ADDED Requirements

## MODIFIED Requirements

## REMOVED Requirements

## RENAMED Requirements
```

これにより：

- 何が追加されたか明確
- 何が変更されたか明確
- 何が削除されたか明確

---

## 3. AI エージェント協調の深い統合

### 3.1 AGENTS.md の役割

```markdown
# OpenSpec Instructions

Instructions for AI coding assistants using OpenSpec for spec-driven development.

## TL;DR Quick Checklist

- Search existing work: `openspec spec list --long`, `openspec list`
- Decide scope: new capability vs modify existing
- Pick unique `change-id`: kebab-case, verb-led (add-, update-, remove-)
- Scaffold: proposal.md, tasks.md, design.md, delta specs
- Validate: `openspec validate [change-id] --strict`
- Request approval: Do not start until approved

## Three-Stage Workflow

...
```

**設計原則**:

- **Quick Checklist at Top**: 最頻使用情報を先頭配置
- **Progressive Disclosure**: 初心者 → 上級者で段階的に情報開示
- **Copy/Paste Templates**: テンプレートを埋め込み
- **Pre-validation Checklist**: lint 失敗を事前防止

### 3.2 マルチエージェント対応のスラッシュコマンド

```
# Claude Code
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md

# Cursor
.cursor/commands/
├── openspec-proposal.md
├── openspec-apply.md
└── openspec-archive.md

# Windsurf
.windsurf/workflows/
├── openspec-proposal.md
├── openspec-apply.md
└── openspec-archive.md

# Kilo Code
.kilocode/workflows/
├── openspec-proposal.md
├── openspec-apply.md
└── openspec-archive.md

# GitHub Copilot
.github/prompts/
├── openspec-proposal.prompt.md
├── openspec-apply.prompt.md
└── openspec-archive.prompt.md

# Codex (グローバル)
~/.codex/prompts/
├── openspec-proposal.md
├── openspec-apply.md
└── openspec-archive.md
```

**共通テンプレート戦略**:

- 共有テンプレートを OpenSpec マーカーで囲む
- `openspec update`で一括更新
- エージェント固有のメタデータ（YAML フロントマター等）を維持

### 3.3 実装ワークフロー指示

```markdown
**Steps**

1. Read `changes/<id>/proposal.md`, `design.md`, `tasks.md`
2. Work through tasks sequentially
3. Confirm completion before updating statuses
4. Update checklist after all work done: `- [x]`
```

**重要な指示**:

- 提案 → 設計 → タスクの順で読む
- タスクを一つずつ完了
- 完了後すぐにマーク（バッチ処理禁止）

---

## 4. CLI ツールチェーン

### 4.1 openspec CLI

```bash
# 変更管理
openspec init [path]                   # 初期化
openspec change <description>          # 変更提案作成
openspec show [change]                 # 詳細表示
openspec validate [change] [--strict]  # 検証
openspec archive <change> [--yes]      # アーカイブ

# 仕様管理
openspec spec list [--long]            # 仕様一覧
openspec show <spec> --type spec       # 仕様詳細

# デバッグ
openspec show <change> --json --deltas-only  # JSON出力
openspec view                                 # ダッシュボード
```

### 4.2 検証システム

```typescript
export const SpecSchema = z.object({
  name: z.string().min(1),
  overview: z.string().min(1),
  requirements: z.array(RequirementSchema).min(1),
  metadata: z
    .object({
      version: z.string().default("1.0.0"),
      format: z.literal("openspec"),
    })
    .optional(),
});
```

**Zod 活用**:

- ランタイム検証
- TypeScript 型推論
- 明確なエラーメッセージ

### 4.3 プログレスダッシュボード

```bash
$ openspec view

## Active Changes
┌────────────────────┬──────────┬────────────┐
│ Change             │ Progress │ Status     │
├────────────────────┼──────────┼────────────┤
│ add-oauth          │ ████░░░░ │ 12/30 (40%)│
│ refactor-auth      │ ██░░░░░░ │ 3/15 (20%) │
└────────────────────┴──────────┴────────────┘

## Specs
- cli-init (5 requirements)
- cli-list (3 requirements)
...
```

---

## 5. プロンプトエンジニアリングの戦略

### 5.1 Decision Tree（決定木）

```markdown
### Decision Tree

Does this change add/modify system behavior that users/systems interact with?
├─ YES → Create change proposal
└─ NO → Is it a bug fix restoring intended behavior?
├─ YES → Fix directly (no proposal)
└─ NO → Create change proposal
```

**効果**:

- AI の判断を明確化
- 曖昧な条件を排除
- 各分岐に具体例

### 5.2 Embedded Templates

````markdown
## Proposal Template

```markdown
## Why

[Problem statement]

## What Changes

[Solution description]

## Impact

- Affected specs: [list]
- Affected code: [areas]
```
````

**特徴**:

- コピー&ペースト可能
- AI がテンプレートをそのまま使用
- 人間のレビューが容易

### 5.3 Pre-validation Checklist

```markdown
Before running `openspec validate`:

- [ ] All Requirement headers use `### Requirement:`
- [ ] All Scenario headers use `#### Scenario:`
- [ ] Bold keywords: **WHEN**, **THEN**, **AND**
- [ ] No [TODO] or [PLACEHOLDER] markers
- [ ] File paths use forward slashes
```

**狙い**:

- lint 失敗を事前防止
- 共通ミスの学習
- フィードバックループの短縮

---

## 6. 強みと限界

### 6.1 強み

✅ **変更駆動アプローチ**: 提案 → 実装 → アーカイブの明確なサイクル  
✅ **デルタスペック方式**: クリーンな未来状態保存  
✅ **構造化フォーマット**: パース可能な一貫性  
✅ **マルチエージェント対応**: 7 種類以上の AI 対応  
✅ **CLI ツールチェーン**: TypeScript + Zod 検証  
✅ **プログレッシブディスクロージャ**: 段階的情報開示  
✅ **リポジトリベース**: 全体を Git 管理

### 6.2 限界と課題

❌ **学習曲線**: 二層構造（specs/と changes/）の理解が必要  
❌ **設計ドキュメントがオプション**: 技術決定の記録が弱い  
❌ **Constitution 概念なし**: ガバナンス機能が不足  
❌ **タスク形式が緩い**: 並列実行の明示が弱い  
❌ **スクリプト自動化なし**: 手動操作が多い  
❌ **日本語対応なし**

---

## 7. 学ぶべきベストプラクティス

### 7.1 変更管理

1. **デルタスペック**: 差分をクリーンに保存
2. **Active vs Archive**: 作業中と完了を明確に分離
3. **Proposal-First**: 必ず提案から始める

### 7.2 エージェント指示

1. **TL;DR Checklist**: 最頻使用情報を最上部に
2. **Embedded Templates**: コピペ可能なテンプレート
3. **Pre-validation**: lint 実行前のチェックリスト

### 7.3 CLI 設計

1. **Zod Validation**: スキーマ駆動の検証
2. **JSON Output**: ツール連携のための構造化出力
3. **Interactive Mode**: プロンプトで選択可能

---

## 8. 進化の歴史

### 8.1 構造化フォーマット導入（2025-08-19）

- 従来: フリーフォーマットの Markdown
- 改善: `### Requirement:` + `#### Scenario:` の強制
- 効果: パース可能性の向上

### 8.2 Agent Instructions 改善（2025-10-14）

- Quick Reference を先頭配置
- 実装ワークフロー明示化（read proposal → read design → execute tasks → mark complete）
- Spec Discovery Workflow 追加（既存仕様確認の強制）

### 8.3 エージェント対応拡大

- 2025-10-14: GitHub Copilot 対応
- 2025-10-22: Cline, Crush, Factory 対応
- 継続的な新エージェント追加

---

## 9. 独自の価値提案

OpenSpec の本質的価値は以下の 3 点：

### 9.1 変更駆動の明確性

**問題**: 仕様と実装の同期が難しい  
**解決**: 変更提案 → 実装 → 仕様更新の強制フロー

### 9.2 AI ネイティブ設計

**問題**: AI が一貫性のない出力を生成  
**解決**: 構造化フォーマット + テンプレート + 検証

### 9.3 ツール非依存

**問題**: 特定ツールへのロックイン  
**解決**: 標準 Markdown + Git で完結

---

## 結論

OpenSpec は、**変更提案駆動 + 構造化フォーマット**という明確な哲学を持つ、軽量かつ強力なフレームワークです。

**核心的価値**:

1. **Change-Driven Workflow**: 提案 → 承認 → 実装 → アーカイブ
2. **Delta Specs**: クリーンな未来状態保存
3. **Structured Format**: パース可能な一貫性
4. **Multi-Agent First**: 7+エージェント対応

**私たちのプロジェクトへの示唆**:

- デルタスペック方式は採用すべき（差分管理の明確化）
- 構造化フォーマットでパース可能性を確保
- TL;DR Checklist パターンは有効
- Constitution との統合で補完可能
