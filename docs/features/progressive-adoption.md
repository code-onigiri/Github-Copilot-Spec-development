# Progressive Adoption Path

段階的導入パス

## 概要

Level 0（ゼロコスト）から Level 3（フル機能）まで、プロジェクトの成熟度と学習曲線に合わせて段階的に導入できる仕組みです。

## なぜ必要か

### 既存フレームワークの問題：All-or-Nothing

```
既存フレームワーク:
「フル機能を一度に導入してください」
   ↓
学習コストが高い
   ↓
導入を諦める
```

**問題点**:

- 最初から全機能を理解する必要がある
- 既存プロジェクトへの導入が困難
- 小規模プロジェクトには過剰

### 段階的導入のアプローチ

```
Level 0 (5分)
   ↓
使ってみて便利だったら
   ↓
Level 1 (30分)
   ↓
さらに使い込んで
   ↓
Level 2 (2時間)
   ↓
本格的に導入
   ↓
Level 3 (1日)
```

**メリット**:

- 学習曲線が緩やか
- いつでも止められる（サンクコスト最小）
- 自分のペースで導入

## 4 つのレベル

### Level 0: ゼロコスト開始（5 分）

**目標**: Copilot Chat に「仕様駆動開発の雰囲気」を教える

#### やること

1. `.github/copilot-instructions.md` を作成

```markdown
# GitHub Copilot Instructions

You are a spec-driven development assistant.

## Core Principles

1. **Spec First**: Always ask for specifications before implementation
2. **Explicit Over Implicit**: Make assumptions explicit
3. **Goal-Constraint-Reference**: Use triangulation for intent clarity

## When asked to implement:

1. Ask: "Do we have a spec for this?"
2. If no spec exists, create one first
3. Only then proceed with implementation

## File Structure

Prefer organizing by features, not by technical layers:
```

src/
features/
user-auth/
UserAuth.tsx
UserAuth.test.tsx
user-auth.spec.md ← Spec stays with code

```

That's it. Start simple.
```

2. 使ってみる

```bash
# Copilot Chat で
"ユーザー認証機能を追加して"
```

**Copilot の応答（Level 0）**:

```markdown
仕様はありますか？なければ作成しましょう。

## 最小限の仕様テンプレート

### Goal

何のために作る？

### Constraints

何を使う？何を使わない？

### Implementation

簡単な実装手順

これを埋めてから実装を始めます。
```

#### メリット

- ✅ ファイル 1 つだけ（5 分で完了）
- ✅ 既存のプロジェクト構造を変えない
- ✅ いつでも削除できる（リスクゼロ）
- ✅ 「仕様を考えてから実装する」習慣がつく

#### デメリット

- ❌ 自動化なし（すべて手動）
- ❌ 検証なし
- ❌ GitHub 統合なし

#### こんな人に向いている

- 「とりあえず試したい」
- 「個人プロジェクトで軽く使いたい」
- 「学習コストをかけたくない」

---

### Level 1: 軽量スペック導入（30 分）

**目標**: 仕様をファイルとして管理する

#### やること

1. ディレクトリ構造を追加

```bash
mkdir -p .github/specs
```

2. `copilot-instructions.md` を更新

```markdown
# GitHub Copilot Instructions

## File Structure

Store specs in `.github/specs/`:
```

.github/
specs/
[feature-name]/
spec.md # Specification
tasks.md # Task breakdown (optional)

````

## Workflow

1. Create spec: `/copilot:spec "[feature description]"`
2. Review spec: Human reviews and approves
3. Implement: `/copilot:implement "[task-id]"`

## Spec Template

Use this template:
```markdown
# [Feature Name]

## Goal
Why are we building this?

## Constraints
- ✅ What we CAN use
- ❌ What we CANNOT use

## User Stories
- As a [user], I want to [action], so that [benefit]

## Tasks
- [ ] [T001] Task description
````

````

3. 初めての仕様を作成

```bash
/copilot:spec "ユーザー認証機能"
````

#### メリット

- ✅ 仕様がファイルとして残る（Git で管理）
- ✅ 実装前にレビューできる
- ✅ タスク分解が明確になる
- ✅ まだシンプル（追加機能なし）

#### デメリット

- ❌ 自動化なし
- ❌ 検証なし
- ❌ GitHub 統合なし

#### こんな人に向いている

- 「仕様を残したいが、複雑なツールは避けたい」
- 「チームで仕様レビューしたい」
- 「実装前に計画を立てたい」

---

### Level 2: フルワークフロー（2 時間）

**目標**: Constitution + Context + Delta Specs を導入

#### やること

1. 三層記憶を構築

```bash
mkdir -p .github/memory/context
touch .github/memory/constitution.md
touch .github/memory/context/architecture.md
touch .github/memory/context/conventions.md
```

2. Constitution を作成

```markdown
# Constitution

## Article I: Simplicity First

3 回以上の継承は禁止

## Article II: Test-First

実装前にテストを書く

## Article III: Spec-First

仕様を作成してから実装する
```

3. Context を作成

```markdown
# Architecture

## Pattern

レイヤードアーキテクチャ

## Layers

- presentation/
- application/
- domain/
- infrastructure/
```

4. 変更管理を導入

```bash
mkdir -p .github/changes
```

5. `copilot-instructions.md` を更新

```markdown
# GitHub Copilot Instructions

## Memory System

Load these before starting:

1. `.github/memory/constitution.md` - Immutable principles
2. `.github/memory/context/*.md` - Project knowledge

## Workflow

### For new features:

1. `/copilot:spec` - Create spec
2. `/copilot:plan` - Create implementation plan
3. `/copilot:tasks` - Break down into tasks
4. `/copilot:implement` - Implement task by task
5. `/copilot:validate` - Validate against Constitution

### For changes:

1. `/copilot:change` - Create change proposal
2. Review Delta Specs (ADDED/MODIFIED/REMOVED)
3. Approve and implement
```

6. 検証を追加

```bash
# 手動で検証
/copilot:validate --constitution
```

#### メリット

- ✅ Constitution で品質を強制
- ✅ Context でプロジェクト知識を蓄積
- ✅ Delta Specs で変更追跡
- ✅ 段階的ゲート（仕様 → 計画 → タスク → 実装）

#### デメリット

- ❌ 自動化は手動（GitHub Actions なし）
- ❌ Issue/PR 連携なし

#### こんな人に向いている

- 「本格的に仕様駆動開発を導入したい」
- 「チームで Constitution を定めたい」
- 「変更履歴を追跡したい」

---

### Level 3: チーム統合（1 日）

**目標**: GitHub Issues/Projects/Actions と完全統合

#### やること

1. GitHub Actions をセットアップ

```bash
mkdir -p .github/workflows
mkdir -p .github/scripts
```

2. ワークフローファイルを作成

```yaml
# .github/workflows/spec-to-issue.yml
name: Spec to Issue
on:
  push:
    paths:
      - ".github/specs/**/spec.md"

jobs:
  create-issue:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Create Issue
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const spec = fs.readFileSync('.github/specs/[feature]/spec.md', 'utf8');
            await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: '[Spec] Feature Name',
              body: spec,
              labels: ['spec']
            });
```

3. Projects を作成

```bash
# GitHub Projects でカンバンボードを作成
gh project create --owner @me --title "Spec-Driven Development"
```

4. 自動化スクリプトを追加

```bash
# .github/scripts/create-pr.sh
#!/bin/bash
FEATURE=$1
gh pr create \
  --title "[Implement] ${FEATURE}" \
  --body-file ".github/specs/${FEATURE}/.ddf-log.md" \
  --label "implementation"
```

5. 検証を自動化

```yaml
# .github/workflows/validate.yml
name: Validate Spec Compliance
on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check Constitution
        run: |
          # Constitution 違反をチェック
          node .github/scripts/validate-constitution.js
```

#### メリット

- ✅ 仕様 → Issue 自動作成
- ✅ タスク → Projects 自動登録
- ✅ 実装 → PR 自動作成
- ✅ CI/CD で検証
- ✅ チーム全体で統一されたワークフロー

#### デメリット

- ⚠️ セットアップに時間がかかる（1 日）
- ⚠️ GitHub Actions の知識が必要

#### こんな人に向いている

- 「チーム全体で導入したい」
- 「完全自動化したい」
- 「GitHub を Single Source of Truth にしたい」

## レベル間の移行

### Level 0 → Level 1

**移行時間**: 10 分

**手順**:

1. `.github/specs/` ディレクトリを作成
2. 既存の仕様を移動
3. `copilot-instructions.md` にテンプレートを追加

**互換性**: 100%（既存の動作は変わらない）

### Level 1 → Level 2

**移行時間**: 1 時間

**手順**:

1. `.github/memory/` を作成
2. Constitution を定義（チームで合意）
3. Context を作成（既存の暗黙知を明文化）
4. `copilot-instructions.md` を更新

**互換性**: 100%（既存の仕様ファイルはそのまま使える）

### Level 2 → Level 3

**移行時間**: 4 時間

**手順**:

1. GitHub Actions を作成
2. Projects を設定
3. スクリプトを配置
4. チームに周知

**互換性**: 100%（Level 2 の手動運用も継続可能）

## ダウングレード（元に戻す）

### Level 3 → Level 2

```bash
# GitHub Actions を無効化
rm -rf .github/workflows
rm -rf .github/scripts

# 手動運用に戻す
```

**影響**: 自動化のみ停止。仕様や記憶は保持される。

### Level 2 → Level 1

```bash
# Constitution と Context を削除
rm -rf .github/memory

# 変更管理を削除
rm -rf .github/changes
```

**影響**: 記憶システムが停止。仕様ファイルは残る。

### Level 1 → Level 0

```bash
# 仕様ディレクトリを削除
rm -rf .github/specs

# copilot-instructions.md を簡易版に戻す
```

**影響**: 仕様ファイルが削除される（Git 履歴には残る）。

## 比較表

| 項目                 | Level 0 | Level 1 | Level 2 | Level 3 |
| -------------------- | ------- | ------- | ------- | ------- |
| **セットアップ時間** | 5 分    | 30 分   | 2 時間  | 1 日    |
| **ファイル数**       | 1       | 3+      | 10+     | 20+     |
| **仕様管理**         | ❌      | ✅      | ✅      | ✅      |
| **記憶システム**     | ❌      | ❌      | ✅      | ✅      |
| **自動化**           | ❌      | ❌      | ⚠️ 手動 | ✅ 完全 |
| **GitHub 統合**      | ❌      | ❌      | ❌      | ✅      |
| **学習コスト**       | 極低    | 低      | 中      | 高      |
| **個人向き**         | ★★★★★   | ★★★★☆   | ★★★☆☆   | ★☆☆☆☆   |
| **チーム向き**       | ★☆☆☆☆   | ★★☆☆☆   | ★★★★☆   | ★★★★★   |
| **ダウングレード**   | —       | 簡単    | 簡単    | 簡単    |

## 推奨パス

### 個人開発者

```
Level 0（1週間試す）
   ↓
気に入ったら Level 1（1ヶ月）
   ↓
本格的に使うなら Level 2（長期）
```

### 小規模チーム（2-5 人）

```
Level 1（全員で試す、2週間）
   ↓
チームで Constitution を決める
   ↓
Level 2（2ヶ月）
   ↓
自動化が必要なら Level 3
```

### 中〜大規模チーム（5 人以上）

```
パイロットプロジェクトで Level 2（1ヶ月）
   ↓
効果を測定
   ↓
全体展開で Level 3
```

## 効果測定

### Level 0 → Level 1 の効果

| 指標               | Level 0 | Level 1 | 改善  |
| ------------------ | ------- | ------- | ----- |
| 仕様の残存率       | 10%     | 90%     | +800% |
| 実装前レビュー     | なし    | あり    | —     |
| 後から理解できる率 | 30%     | 80%     | +167% |

### Level 1 → Level 2 の効果

| 指標                 | Level 1 | Level 2 | 改善  |
| -------------------- | ------- | ------- | ----- |
| Constitution 遵守率  | 40%     | 90%     | +125% |
| セッション間の一貫性 | 50%     | 95%     | +90%  |
| 変更の追跡           | 手動    | 自動    | —     |

### Level 2 → Level 3 の効果

| 指標              | Level 2 | Level 3 | 改善  |
| ----------------- | ------- | ------- | ----- |
| 仕様 → 実装の時間 | 3 時間  | 1 時間  | -67%  |
| Issue 作成の手間  | 10 分   | 0 分    | -100% |
| PR レビューの時間 | 30 分   | 15 分   | -50%  |

## ベストプラクティス

### ✅ DO

- まず Level 0 で 1 週間試す
- Level up は必要になってから
- チーム全員が納得してから Level up
- ダウングレードを恐れない

### ❌ DON'T

- 最初から Level 3 を目指さない
- 使わない機能を導入しない
- 学習コストを過小評価しない

## コミュニティへの貢献

- 📝 各レベルの導入体験記を共有
- 💡 新しいレベルの提案
- 🔧 移行スクリプトの改善
- 📊 効果測定データの共有

詳細は [Contribution Guide](../guides/contribution.md) をご覧ください。

## 関連ドキュメント

- [Getting Started](../guides/getting-started.md) - Level 0 の詳細手順
- [GitHub 統合](github-integration.md) - Level 3 の詳細
- [三層記憶](triple-memory.md) - Level 2 の詳細
