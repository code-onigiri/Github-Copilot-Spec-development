# GitHub Copilot Spec 駆動開発 - 完全ガイド

## 📖 概要

このプロジェクトは、**GitHub Copilot の能力を最大限に引き出す**ための、体系的な Spec 駆動開発環境です。
[spec-kit](https://github.com/github/spec-kit)にインスパイアされ、GitHub Copilot の最新カスタマイズ機能を完全統合しています。

**開発フロー**: `仕様 (Specify)` → `プラン (Plan)` → `タスク (Tasks)` → `実装 (Implement)`

---

## 🎯 このプロジェクトで実現できること

### ✨ 主要機能

1. **体系的な開発プロセス**

   - コマンドベースの段階的開発フロー
   - 仕様書ファーストで設計品質を担保
   - プロジェクト憲法による原則の強制

2. **GitHub Copilot 完全統合**

   - カスタムインストラクションによる自動コンテキスト提供
   - 専用チャットモードで役割特化
   - 再利用可能プロンプトで作業効率化

3. **自動ドキュメント生成**

   - データモデル定義書 (`data-model.md`)
   - API 契約書 (`contracts/*.md`)
   - 技術調査ドキュメント (`research.md`)
   - クイックスタートガイド (`quickstart.md`)

4. **柔軟な計画変更対応**
   - Spec 変更時の自動調整
   - タスク優先度の動的管理
   - 段階的リファクタリング対応

---

## 🏗️ アーキテクチャ

### ディレクトリ構造

```text
.
├── .github/
│   ├── copilot-instructions.md      # リポジトリ全体のAI指示
│   ├── chatmodes/                   # カスタムチャットモード
│   │   ├── planning.chatmode.md
│   │   ├── review.chatmode.md
│   │   └── implementation.chatmode.md
│   ├── prompts/                     # 再利用可能プロンプト
│   │   ├── task-breakdown.prompt.md
│   │   ├── code-review.prompt.md
│   │   └── documentation.prompt.md
│   └── instructions/                # パス固有の指示
│       ├── specs.instructions.md
│       └── implementation.instructions.md
│
├── .specify/                         # Spec駆動開発コア
│   ├── templates/
│   │   ├── spec-template.md         # 仕様書テンプレート
│   │   ├── plan-template.md         # プランテンプレート
│   │   ├── tasks-template.md        # タスクテンプレート
│   │   └── commands/                # コマンド定義
│   │       ├── specify.md           # /ikak:specify
│   │       ├── plan.md              # /ikak:plan
│   │       ├── tasks.md             # /ikak:tasks
│   │       ├── implement.md         # /ikak:implement
│   │       └── status.md            # /ikak:status
│   └── scripts/                     # ヘルパースクリプト
│       ├── setup-plan.sh
│       └── get-feature-docs.sh
│
├── memory/                           # プロジェクトメモリ（三層記憶）
│   ├── constitution.md              # Layer 1: 不変の原則
│   ├── context/                     # Layer 2: 可変のコンテキスト
│   │   ├── architecture.md          # アーキテクチャ決定記録
│   │   ├── conventions.md           # コーディング規約
│   │   ├── domain.md                # ドメイン知識
│   │   └── tech-stack.md            # 技術スタック
│   ├── changelog/                   # Layer 3: 変更履歴
│   │   └── project-changelog.md     # 変更追跡
│   └── project-status.md            # 全体進捗トラッキング
│
├── specs/                            # 機能仕様ディレクトリ
│   └── [###-feature-name]/
│       ├── spec.md                  # 機能仕様
│       ├── plan.md                  # 実装プラン
│       ├── research.md              # 技術調査
│       ├── data-model.md            # データモデル
│       ├── quickstart.md            # 使用例
│       ├── contracts/               # API契約
│       │   ├── rest-api.md
│       │   └── graphql-schema.md
│       └── tasks.md                 # 実装タスク
│
└── .vscode/
    ├── settings.json                # VS Code設定（Copilot統合）
    └── extensions.json              # 推奨拡張機能
```

---

## 🚀 クイックスタート

### 前提条件

- GitHub Copilot ライセンス
- VS Code + GitHub Copilot 拡張機能
- Git

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/code-onigiri/Github-Copilot-Spec-development.git
cd Github-Copilot-Spec-development

# VS Codeで開く
code .
```

### 開発フロー

#### 0️⃣ プロジェクト憲法の作成 (`/ikak:constitution`) - 初回のみ

```text
/ikak:constitution
```

**対話形式で以下を設定**:

- プロジェクト名と目標
- チームサイズと経験レベル
- 開発原則（Simplicity First、TDD など）
- 品質ゲート（仕様完了、設計検証など）
- 違反時の対応方法

**生成されるもの**:

- `memory/constitution.md` - プロジェクト憲法

**テンプレート選択可能**:

- 🚀 Startup Template（スピード重視）
- 🏢 Enterprise Template（品質重視）
- 🌍 Open Source Template（コミュニティ重視）
- 📋 Custom（カスタム設定）

---

#### 1️⃣ 仕様作成 (`/ikak:specify`)

```text
/ikak:specify ユーザー認証システム。メール/パスワードでログイン、新規登録、パスワードリセット機能
```

**生成されるもの**:

- `specs/001-user-authentication/spec.md`

**内容**:

- ユーザーストーリー
- 機能要件
- 受け入れ基準
- 制約条件

---

#### 2️⃣ 実装プラン生成 (`/ikak:plan`)

```text
/ikak:plan Python 3.11 + FastAPI + PostgreSQL。JWT認証、bcryptでパスワードハッシュ化
```

**生成されるもの**:

- `specs/001-user-authentication/plan.md` - 実装プラン
- `specs/001-user-authentication/research.md` - 技術調査
- `specs/001-user-authentication/data-model.md` - データモデル
- `specs/001-user-authentication/contracts/` - API 契約
- `specs/001-user-authentication/quickstart.md` - 使用例

**内容**:

- アーキテクチャ設計
- 技術スタック選定
- データベーススキーマ
- API 設計
- セキュリティ考慮事項

---

#### 3️⃣ タスク分解 (`/ikak:tasks`)

```text
/ikak:tasks
```

**生成されるもの**:

- `specs/001-user-authentication/tasks.md`

**タスク形式**:

```markdown
- [ ] [T001] [P] [US1] Create User model in src/models/user.py
- [ ] [T002] [P] [US1] Set up database schema in migrations/001_create_users.sql
- [ ] [T003] [US1] Implement password hashing in src/utils/security.py
- [ ] [T004] [US1] Create authentication service in src/services/auth.py
```

**タスク要素**:

- `T###` - タスク ID
- `[P]` - 並行実行可能マーク
- `[USX]` - ユーザーストーリー参照
- ファイルパス - 変更対象の具体的なファイル

---

#### 4️⃣ 実装 (`/ikak:implement`)

```text
/ikak:implement T001
```

**動作**:

1. タスク詳細の確認
2. 関連する spec/plan/contracts の読み込み
3. コード生成と実装
4. テストコードの生成
5. タスクの完了マーク

---

#### 5️⃣ デバッグ (`/ikak:debug`) - 必要に応じて

```text
/ikak:debug ユーザー登録時に500エラーが発生する
```

**DDF（Debug-Driven Fixing）プロセス**:

1. **期待値の明示化** - 正しい動作を定義
2. **現状の可視化** - 実際の動作をログで確認
3. **ギャップ分析** - 期待と実際の差異を特定
4. **仮説立案** - 根本原因の候補をリスト化
5. **検証と修正** - 仮説を検証して修正実施

**生成されるもの**:

- DDF レポート（問題・原因・修正・再発防止策）
- 修正コード
- テストケース

---

#### 6️⃣ 状態確認 (`/ikak:status`)

```text
/ikak:status
```

**表示内容**:

- 全機能の進捗状況
- 各機能のタスク完了率
- ブロッカーの有無
- 次に実行すべきタスク

---

## 🎨 GitHub Copilot カスタマイズ機能の活用

このプロジェクトは、GitHub Copilot の以下のカスタマイズ機能を完全統合しています。

### 1. カスタムインストラクション

#### リポジトリ全体のコンテキスト

**ファイル**: `.github/copilot-instructions.md`

```markdown
# GitHub Copilot Instructions

You are an expert development assistant for specification-driven development.

## Development Workflow

All development follows this strict sequence:

1. **Specify** (`/ikak:specify`): Create feature specification
2. **Plan** (`/ikak:plan`): Design architecture and contracts
3. **Tasks** (`/ikak:tasks`): Break down into implementation tasks
4. **Implement** (`/ikak:implement`): Write actual code

**CRITICAL**: Never skip steps. Each phase builds on the previous.
```

**効果**:

- すべての Copilot リクエストに自動適用
- 開発プロセスの強制
- プロジェクト固有の規約を常に遵守

---

#### パス固有のインストラクション

**ファイル**: `.github/instructions/specs.instructions.md`

```markdown
---
applyTo: "specs/**/*.md"
---

# Specification Documents

When working with specification documents:

- Use concrete, measurable acceptance criteria
- Include user scenarios with clear success metrics
- Avoid [TODO] or [PLACEHOLDER] - resolve in research.md
```

**効果**:

- `specs/`配下のファイルでは仕様書専用の指示が適用
- ファイルタイプごとに最適な支援

---

### 2. カスタムチャットモード

#### Planning Mode

**ファイル**: `.github/chatmodes/planning.chatmode.md`

```yaml
---
description: Generate implementation plans for new features
tools: ["codebase", "fetch", "search", "usages"]
---

# Planning Mode

You are an experienced software architect specializing in spec-driven development.

## Your Approach
- Start by understanding requirements from spec.md
- Design data models that cover all entities
- Define API contracts for all user actions
- Break down into testable, incremental steps
```

**使い方**:

1. `⌘.` (Mac) または `Ctrl+.` (Windows/Linux) でモード切り替え
2. "Planning Mode"を選択
3. プラン作成の指示を送信

**メリット**:

- 役割特化により精度向上
- 必要なツールのみ有効化
- 一貫した出力フォーマット

---

#### Review Mode

**ファイル**: `.github/chatmodes/review.chatmode.md`

```yaml
---
description: Perform thorough code reviews against specifications
tools: ["codebase", "usages", "problems"]
---
# Code Review Mode

Check implementation against:
  - Spec requirements coverage
  - API contract compliance
  - Data model consistency
  - Security best practices
```

---

### 3. 再利用可能プロンプト

#### Task Breakdown Prompt

**ファイル**: `.github/prompts/task-breakdown.prompt.md`

```yaml
---
description: Break down implementation plan into concrete tasks
variables:
  - name: TASK_GRANULARITY
    type: string
    default: "medium"
    description: "Task size: small/medium/large"
---

Break down the implementation plan into tasks with ${TASK_GRANULARITY} granularity.

Each task must:
- Have format: `- [ ] [T###] [P?] [USX?] Action in path/to/file.ext`
- Be specific and testable
- Include target file path
- Indicate parallel execution with [P]
```

**使い方**:

1. チャットビューで "Prompts..." をクリック
2. "Task Breakdown"を選択
3. `TASK_GRANULARITY`を調整（small/medium/large）
4. 実行

---

#### Code Review Prompt

**ファイル**: `.github/prompts/code-review.prompt.md`

```yaml
---
description: Review code against specifications
variables:
  - name: FOCUS_AREA
    type: string
    default: "all"
    description: "all/security/performance/maintainability"
---

Review #selection focusing on ${FOCUS_AREA}.

Check:
- Spec compliance
- API contract adherence
- Security vulnerabilities
- Performance implications
```

---

### 4. VS Code 統合設定

**ファイル**: `.vscode/settings.json`

```json
{
  "chat.modeFilesLocations": {
    ".github/chatmodes": true
  },
  "chat.promptFilesLocations": {
    ".github/prompts": true
  },
  "chat.instructionsFilesLocations": {
    ".github/instructions": true
  },
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "text": "Always reference spec.md when implementing features"
    },
    {
      "text": "Follow task format: [T###] [P?] [USX?] Action in file.ext"
    }
  ],
  "github.copilot.chat.testGeneration.instructions": [
    {
      "text": "Generate tests based on acceptance criteria in spec.md"
    }
  ]
}
```

---

## 📋 コマンドリファレンス

### `/ikak:specify [description]`

**目的**: 新機能の仕様書を作成

**引数**:

- `description`: 機能の簡潔な説明

**プロセス**:

1. `.specify/templates/commands/specify.md`を読み込み
2. テンプレートに従って実行
3. `specs/###-feature-name/spec.md`を生成
4. ユーザーストーリー、要件、受け入れ基準を記述

**出力例**:

```markdown
# [001] User Authentication System

## User Stories

### US1: As a new user, I want to register with email/password

**Acceptance Criteria**:

- ✅ Email validation
- ✅ Password strength check (min 8 chars)
- ✅ Unique email constraint
- ✅ Confirmation email sent
```

---

### `/ikak:plan [tech-stack-info]`

**目的**: 実装プランと設計ドキュメントを生成

**引数**:

- `tech-stack-info`: 技術スタックの情報（言語、フレームワーク等）

**プロセス**:

1. `spec.md`を読み込み
2. 技術調査（`research.md`）
3. データモデル設計（`data-model.md`）
4. API 契約定義（`contracts/*.md`）
5. 実装プラン作成（`plan.md`）
6. 使用例生成（`quickstart.md`）

**出力ファイル**:

```text
specs/001-user-authentication/
├── plan.md           # メイン実装プラン
├── research.md       # 技術選定の根拠
├── data-model.md     # エンティティ定義
├── quickstart.md     # API使用例
└── contracts/
    ├── rest-api.md   # REST API仕様
    └── events.md     # イベント定義
```

---

### `/ikak:tasks`

**目的**: プランを具体的なタスクに分解

**前提条件**:

- `spec.md`が存在
- `plan.md`が存在

**タスク形式**:

```markdown
## Setup & Infrastructure [US1]

- [ ] [T001] [P] Setup database schema in migrations/001_users.sql
- [ ] [T002] [P] [US1] Create User model in src/models/user.py

## Core Features [US1]

- [ ] [T003] [US1] Implement registration endpoint in src/api/auth.py
  - Depends: T001, T002

## Testing [US1]

- [ ] [T004] [US1] Write unit tests in tests/test_auth.py
  - Depends: T003
```

**タスク要素の意味**:

- `[T###]` - シーケンシャルなタスク ID
- `[P]` - 並行実行可能（依存関係なし）
- `[USX]` - 対応するユーザーストーリー番号
- `Depends` - 依存タスクの明記

---

### `/ikak:implement [task-id]`

**目的**: 特定のタスクを実装

**引数**:

- `task-id`: タスク ID（例: `T001`）

**プロセス**:

1. `tasks.md`から該当タスクを取得
2. 関連する`spec.md`, `plan.md`, `contracts/`を読み込み
3. ファイルパスに従って実装
4. 必要に応じてテストコードも生成
5. `tasks.md`のチェックボックスを更新

**実装例**:

```text
User: /ikak:implement T001

Copilot:
# タスク T001 を実装します

## タスク詳細
- Create User model in src/models/user.py
- User Story: US1

## 実装内容
[コード生成...]

## 完了
- ✅ src/models/user.py 作成
- ✅ tasks.mdを更新
```

---

### `/ikak:status`

**目的**: プロジェクト全体の状態を確認

**表示内容**:

```markdown
# Project Status

## Active Features

### [001] User Authentication System

- Status: In Progress
- Tasks: 15/20 completed (75%)
- Blocker: None
- Next: T016 - Implement password reset flow

### [002] Product Catalog

- Status: Planning
- Tasks: 0/0 (plan not completed)
- Blocker: Waiting for T020 (User Auth)

## Summary

- Total Features: 2
- Completed: 0
- In Progress: 1
- Blocked: 0
```

---

## 🔧 高度な使い方

### 途中計画変更への対応

**シナリオ**: Spec 変更後の調整

```bash
# 1. Specを更新
User: /ikak:specify [修正内容]

# 2. Planを再生成（既存のresearch.mdを参考に）
User: /ikak:plan --replan

# 3. 既存タスクとの差分を確認
User: @workspace 新旧のtasks.mdを比較して、影響範囲を教えて

# 4. タスクを再生成（完了済みタスクは保持）
User: /ikak:tasks --preserve-completed
```

---

### Constitution（憲法）の活用

**ファイル**: `memory/constitution.md`

```markdown
## Principle 1: Simplicity First

**Rule**: Choose the simplest solution that meets requirements.
**Enforcement**: Plans must document rejected simpler alternatives.
```

**検証**:

```bash
User: @workspace このプランはconstitution.mdの原則に違反していないか確認して
```

Copilot は自動的に：

1. `memory/constitution.md`を読み込み
2. `plan.md`の内容と照合
3. 違反項目をリストアップ
4. 修正案を提示

---

### 並行開発の管理

```markdown
## Parallel Tasks [US1]

- [ ] [T001] [P] Setup database
- [ ] [T002] [P] Create models
- [ ] [T003] [P] Setup authentication middleware

## Sequential Tasks [US1]

- [ ] [T004] Integrate auth into API (Depends: T001, T002, T003)
```

**実装**:

```bash
# 3つのタスクを並行実行
/ikak:implement T001
/ikak:implement T002
/ikak:implement T003

# すべて完了後
/ikak:implement T004
```

---

## 🎓 ベストプラクティス

### ✅ DO（推奨）

#### 1. 明確で測定可能な受け入れ基準

**Good**:

```markdown
**Acceptance Criteria**:

- ✅ Response time < 200ms for 95th percentile
- ✅ Password must be min 8 chars with 1 uppercase, 1 number
- ✅ Email confirmation sent within 5 seconds
```

**Bad**:

```markdown
**Acceptance Criteria**:

- Fast response
- Secure password
- Email notification
```

---

#### 2. 具体的なタスク記述

**Good**:

```markdown
- [ ] [T001] Create User model with email, password_hash fields in src/models/user.py
```

**Bad**:

```markdown
- [ ] [T001] Create user stuff
- [ ] [T002] Add authentication
```

---

#### 3. ユーザーストーリーによる整理

**Good**:

```markdown
## User Registration [US1]

- [ ] [T001] [US1] Create registration endpoint
- [ ] [T002] [US1] Validate email format
- [ ] [T003] [US1] Hash password with bcrypt

## User Login [US2]

- [ ] [T004] [US2] Create login endpoint
- [ ] [T005] [US2] Generate JWT token
```

**Bad**:

```markdown
## Backend

- [ ] [T001] All API endpoints
- [ ] [T002] Authentication logic

## Database

- [ ] [T003] All database tables
```

---

### ❌ DON'T（非推奨）

#### 1. 段階をスキップしない

```bash
# Bad
User: ユーザー認証を実装して

# Good
User: /ikak:specify ユーザー認証システム
[spec完成後]
User: /ikak:plan FastAPI + PostgreSQL
[plan完成後]
User: /ikak:tasks
[tasks完成後]
User: /ikak:implement T001
```

---

#### 2. [TODO]や[PLACEHOLDER]を残さない

**Bad**:

```markdown
## Database Schema

[TODO: Decide between PostgreSQL and MySQL]

## API Design

[PLACEHOLDER: Define endpoints later]
```

**Good**:

````markdown
## Database Schema

**Decision**: PostgreSQL
**Rationale**:

- JSONB support for flexible user metadata
- Strong ACID compliance
- Wide ecosystem support

## API Design

### POST /api/v1/auth/register

**Request**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```
````

---

#### 3. 技術スタック情報なしで Plan を作らない

**Bad**:

```bash
User: /ikak:plan
```

**Good**:

```bash
User: /ikak:plan Python 3.11 + FastAPI + PostgreSQL + Redis for caching
```

---

## 🔍 トラブルシューティング

### Q1: チャットモードが表示されない

**確認項目**:

1. ファイル名が`*.chatmode.md`または`*.mode.md`になっているか
2. `.vscode/settings.json`で有効化されているか
   ```json
   {
     "chat.modeFilesLocations": {
       ".github/chatmodes": true
     }
   }
   ```
3. VS Code を再起動したか

---

### Q2: コマンドが認識されない

**確認項目**:

1. `.github/copilot-instructions.md`が存在するか
2. コマンド定義ファイル（`.specify/templates/commands/`）が存在するか
3. Copilot に明示的にコマンドを指示
   ```text
   .specify/templates/commands/specify.mdの内容に従って実行してください
   ```

---

### Q3: タスク形式が統一されない

**対策**:

1. `.github/instructions/tasks.instructions.md`を作成

   ```markdown
   ---
   applyTo: "specs/**/tasks.md"
   ---

   # Task Format

   All tasks must follow: `- [ ] [T###] [P?] [USX?] Action in path/to/file.ext`
   ```

2. `.vscode/settings.json`に指示を追加
   ```json
   {
     "github.copilot.chat.codeGeneration.instructions": [
       {
         "text": "Task format: [T###] [P?] [USX?] Action in path/to/file.ext"
       }
     ]
   }
   ```

---

## 📚 参考資料

### 公式ドキュメント

- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [VS Code Copilot Customization](https://code.visualstudio.com/docs/copilot/copilot-customization)
- [GitHub spec-kit](https://github.com/github/spec-kit)

### プロジェクト内ドキュメント

- [調査資料: GitHub Copilot カスタマイズ機能](/docs/research/github-copilot-customization.md)
- [詳細ガイド: カスタマイズ機能](/docs/research/github-copilot-customization-detailed.md)
- [機能一覧](/docs/features/)

---

## 🤝 コントリビューション

### 貢献方法

1. このプロジェクトをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. この Spec 駆動フローに従って開発
   ```bash
   /ikak:specify [your feature description]
   /ikak:plan [tech stack]
   /ikak:tasks
   /ikak:implement T001
   ```
4. コミット (`git commit -m 'Add amazing feature'`)
5. プッシュ (`git push origin feature/amazing-feature`)
6. Pull Request を作成

### コントリビューションガイドライン

- すべての機能は`specs/`ディレクトリから開始
- `memory/constitution.md`の原則を遵守
- タスク形式を統一
- テストコードを含める

---

## 📄 ライセンス

MIT License - 詳細は[LICENSE](LICENSE)を参照

---

## 🙏 謝辞

- [GitHub spec-kit](https://github.com/github/spec-kit) - インスピレーション元
- GitHub Copilot Team - 強力な AI 開発支援ツールの提供

---

## 📞 サポート

- **Issues**: [GitHub Issues](https://github.com/code-onigiri/Github-Copilot-Spec-development/issues)
- **Discussions**: [GitHub Discussions](https://github.com/code-onigiri/Github-Copilot-Spec-development/discussions)

---

**最終更新**: 2025 年 11 月 12 日  
**バージョン**: 1.0.0
