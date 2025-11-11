# spec-kit 詳細分析

**分析日**: 2025-11-11  
**対象リポジトリ**: https://github.com/github/spec-kit

## 概要

spec-kit は、GitHub が開発した Specification-Driven Development (SDD)のための強力なフレームワークです。LLM を活用した仕様駆動開発を実現するための包括的なテンプレートとコマンドシステムを提供します。

---

## 1. 核心的なアーキテクチャ

### 1.1 ディレクトリ構造

```
.specify/
├── templates/
│   ├── spec-template.md          # 機能仕様テンプレート
│   ├── plan-template.md          # 実装計画テンプレート
│   ├── tasks-template.md         # タスク分解テンプレート
│   └── commands/
│       ├── specify.md            # 仕様作成コマンド
│       ├── plan.md               # 計画立案コマンド
│       ├── tasks.md              # タスク生成コマンド
│       ├── implement.md          # 実装コマンド
│       ├── clarify.md            # 曖昧性解消コマンド
│       ├── checklist.md          # チェックリスト生成
│       ├── analyze.md            # 整合性分析
│       └── constitution.md       # 憲法作成
├── scripts/
│   ├── bash/
│   │   ├── create-new-feature.sh
│   │   ├── setup-plan.sh
│   │   └── check-prerequisites.sh
│   └── powershell/
│       └── (同様のスクリプト)
└── memory/
    └── constitution.md           # プロジェクト憲法
specs/
└── [###-feature-name]/
    ├── spec.md                   # 仕様書
    ├── plan.md                   # 実装計画
    ├── tasks.md                  # タスクリスト
    ├── research.md               # 技術調査
    ├── data-model.md             # データモデル
    ├── quickstart.md             # 使用例
    └── contracts/                # API仕様
        ├── api-spec.json
        └── signalr-spec.md
```

### 1.2 ワークフローの厳格な段階制御

```
/speckit.specify → spec.md
       ↓
/speckit.plan → plan.md, research.md, data-model.md, contracts/, quickstart.md
       ↓
/speckit.tasks → tasks.md
       ↓
/speckit.implement → 実装
```

**重要な特徴**:

- 各段階は前段階の完了を必須とする（Prerequisites Check）
- スクリプトベースの自動化（Bash/PowerShell 両対応）
- ブランチとディレクトリの自動作成

---

## 2. プロンプトエンジニアリングの深さ

### 2.1 テンプレート駆動の品質保証

#### (1) 暗黙知の明示化

spec-kit の最大の特徴は、**LLM の行動を制約することで品質を向上させる**アプローチです。

**例: specify.md コマンドテンプレート**

```markdown
### For AI Generation

When creating this spec from a user prompt:

1. **Make informed guesses**: Use context, industry standards, and common patterns to fill gaps
2. **Document assumptions**: Record reasonable defaults in the Assumptions section
3. **Limit clarifications**: Maximum 3 [NEEDS CLARIFICATION] markers - use only for critical decisions that:
   - Significantly impact feature scope or user experience
   - Have multiple reasonable interpretations with different implications
   - Lack any reasonable default
4. **Prioritize clarifications**: scope > security/privacy > user experience > technical details
5. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
```

この指示により、LLM は：

- 推測を恐れず、業界標準を積極的に適用
- 曖昧性マーカーの濫用を避ける
- 重要度に基づく優先順位付けを実施

#### (2) Constitutional Compliance（憲法準拠）

```markdown
### Phase -1: Pre-Implementation Gates

#### Simplicity Gate (Article VII)

- [ ] Using ≤3 projects?
- [ ] No future-proofing?

#### Anti-Abstraction Gate (Article VIII)

- [ ] Using framework directly?
- [ ] Single model representation?

#### Integration-First Gate (Article IX)

- [ ] Contracts defined?
- [ ] Contract tests written?
```

**メカニズム**:

- `memory/constitution.md`に定義された原則
- 計画段階で自動的にゲートチェック
- 違反時は`Complexity Tracking`セクションで正当化を要求

**九つの原則（Nine Articles）**:

1. **Library-First**: 全機能をライブラリとして開始
2. **CLI Interface Mandate**: テキスト I/O の強制
3. **Test-First Imperative**: TDD の厳格な実施
4. **Integration Testing**: 契約テスト優先
5. **Observability**: 構造化ログ必須
6. **Versioning**: セマンティックバージョニング
7. **Simplicity**: プロジェクト数 ≤3、YAGNI 原則
8. **Anti-Abstraction**: 不要な抽象化の禁止
9. **Integration-First**: 契約駆動開発

### 2.2 段階的な情報開示（Progressive Disclosure）

#### plan.md の三相構造

```markdown
### Phase 0: Outline & Research

- Load spec.md to understand requirements
- Generate research.md with technology comparisons
- Resolve all [NEEDS CLARIFICATION] markers

### Phase 1: Design & Contracts

- Extract entities from spec → data-model.md
- Generate API contracts → /contracts/
- Update agent context files
- Create quickstart.md with validation scenarios

### Phase 2: Finalize Plan

- Fill Technical Context section
- Re-evaluate Constitution Check
- Validate completeness
```

**狙い**:

- 一度にすべてを生成せず、段階的に詳細化
- 各段階で依存関係を明確化
- LLM のコンテキスト汚染を防止

### 2.3 タスク形式の強制

```markdown
### Checklist Format (REQUIRED)

Every task MUST strictly follow this format:

- [ ] [TaskID] [P?] [Story?] Description with file path

**Format Components**:

1. **Checkbox**: ALWAYS start with `- [ ]`
2. **Task ID**: Sequential number (T001, T002...)
3. **[P] marker**: Include ONLY if parallelizable
4. **[Story] label**: [US1], [US2]... for user story mapping
5. **Description**: Clear action with exact file path
```

**効果**:

- パース可能な一貫性
- 並列実行の明示化
- ユーザーストーリーとの紐付け

---

## 3. マルチエージェント対応

### 3.1 Agent-Agnostic Design

spec-kit は特定の AI エージェントに依存しない設計です。

**サポートエージェント**（AGENTS.md）:

- Claude Code
- Cursor
- OpenCode
- Amp
- Windsurf
- Amazon Q Developer
- Kilo Code
- Roo Code

### 3.2 コマンドフォーマットの抽象化

```markdown
### Markdown Format (Claude, Cursor, etc.)

---

## description: "Command description"

Command content with {SCRIPT} and $ARGUMENTS placeholders.

### TOML Format (Gemini, Qwen)

description = "Command description"
prompt = """
Command content with {{args}} placeholders.
"""
```

### 3.3 Agent Context Update

```bash
scripts/bash/update-agent-context.sh __AGENT__
scripts/powershell/update-agent-context.ps1 -AgentType __AGENT__
```

- エージェント固有のコンテキストファイルを自動更新
- 技術スタックの変更を各エージェントに伝播

---

## 4. 補助コマンドの戦略的配置

### 4.1 /speckit.clarify

**目的**: 仕様の曖昧性を後から解消

**実行フロー**:

1. spec.md をスキャン
2. タクソノミーベースで分類（User Types, Data Flows, Integration, Edge Cases 等）
3. 最大 5 つの質問を生成（重要度順）
4. 回答を`## Clarifications`セクションに追記

**重要な制約**:

- 投機的な技術スタック質問は避ける
- 機能的明確性を阻害する場合のみ質問
- ユーザーが早期終了できる（"stop", "done"）

### 4.2 /speckit.checklist

**目的**: 要件単体テストの生成

**動的質問生成**:

```markdown
1. Extract signals: feature domain keywords (auth, latency, UX, API)
2. Derive up to THREE contextual questions
3. Only ask about information that materially changes checklist content
```

**出力**:

```markdown
- [ ] CHK001 OAuth token refresh succeeds within 500ms
- [ ] CHK002 Password reset email includes secure link
- [ ] CHK003 Multi-factor auth supports TOTP and SMS
```

**特徴**:

- 各実行で新しいファイルを生成（`ux.md`, `security.md`, `test.md`等）
- 複数の観点でチェックリストを蓄積可能
- `implement`コマンドで完了率を自動集計

### 4.3 /speckit.analyze

**目的**: 実装前の整合性検証

**検証項目**:

1. **Constitution Violations**: 憲法違反は自動的に CRITICAL
2. **Cross-Artifact Discrepancies**: spec vs plan vs tasks の不一致
3. **Missing Coverage**: ユーザーストーリーがタスクに反映されているか
4. **Ambiguity Detection**: 曖昧な記述の検出

**出力形式**:

```markdown
| Finding ID | Severity | Category | Description                      | Location   |
| ---------- | -------- | -------- | -------------------------------- | ---------- |
| ANA001     | CRITICAL | CONST    | Violates Article VII: 4 projects | plan.md:45 |
| ANA002     | HIGH     | MISSING  | US3 not in tasks.md              | spec.md:89 |
```

**重要**: Read-Only モード（ファイル変更なし）

---

## 5. Bash/PowerShell スクリプト戦略

### 5.1 自動番号付けロジック

**create-new-feature.sh**:

```bash
# リモート・ローカルブランチとspecsディレクトリをスキャン
# パターンマッチで最大番号を取得
# 001, 002, 003...と自動採番
```

### 5.2 前提条件チェック

**check-prerequisites.sh**:

```bash
--require-tasks    # tasks.mdの存在を確認
--include-tasks    # tasks.mdの内容も出力
--paths-only       # パスのみ返す
--json             # JSON形式で出力
```

### 5.3 エージェントコンテキスト更新

**update-agent-context.sh**:

```bash
# Claude Code → CLAUDE.md
# Cursor → .cursorrules
# Windsurf → .windsurfrules
```

---

## 6. 強みと限界

### 6.1 強み

✅ **厳格な段階制御**: 各フェーズの前提条件チェック  
✅ **憲法ベースのガバナンス**: 過度な複雑化を防止  
✅ **テンプレート駆動品質**: LLM の出力を構造化  
✅ **マルチエージェント対応**: 8 種類以上のエージェント  
✅ **スクリプト自動化**: Bash/PowerShell 両対応  
✅ **Progressive Disclosure**: 段階的詳細化でコンテキスト管理  
✅ **補助コマンド充実**: clarify, checklist, analyze 等

### 6.2 限界と課題

❌ **GitHub Copilot Chat 特化の最適化が不十分**  
❌ **コマンド数が多い（11 個）**: 学習コスト高  
❌ **スクリプト依存**: CLI 環境が必須  
❌ **日本語ドキュメント不足**  
❌ **既存コードベースへの適用事例が少ない**  
❌ **チーム協調機能が弱い**（個人開発向け）

---

## 7. 学ぶべきベストプラクティス

### 7.1 プロンプトエンジニアリング

1. **制約による品質向上**: "Maximum 3 [NEEDS CLARIFICATION]"
2. **優先順位の明示化**: "scope > security > UX > technical"
3. **Think like a tester**: テスタブルな要件を強制
4. **Reasonable defaults**: デフォルト値の提供で質問を削減

### 7.2 ワークフロー設計

1. **段階的依存関係**: 各コマンドが前段階の完了を確認
2. **JSON 出力の活用**: スクリプト連携でツールチェーン構築
3. **マーカーベース管理**: OpenSpec 互換の更新システム

### 7.3 品質ゲート

1. **Constitution as Code**: 原則をチェックリスト化
2. **Complexity Tracking**: 違反時の正当化を強制
3. **Read-Only Analysis**: 実装前の検証コマンド

---

## 8. 今後の発展可能性

### 8.1 v0.0.17 での進化

- `/clarify`コマンド: 曖昧性の動的解消
- `/analyze`コマンド: 整合性分析の自動化
- `--force`フラグ: 非空ディレクトリでの強制初期化

### 8.2 コミュニティ動向

- `specify`CLI: Python 実装によるクロスプラットフォーム化
- Roo Code 対応: 新興エージェントへの迅速な対応
- Changelog 活発: 2 週間単位での機能追加

---

## 結論

spec-kit は、**テンプレート駆動の LLM 制御**という明確な哲学を持つ、成熟した SDD フレームワークです。

**核心的価値**:

1. **Constraint-Based Quality**: 制約によって LLM の出力品質を向上
2. **Constitutional Governance**: 憲法による過度な複雑化の防止
3. **Multi-Agent Abstraction**: エージェント非依存の設計
4. **Script-Driven Automation**: Bash/PowerShell による自動化

**私たちのプロジェクトへの示唆**:

- GitHub Copilot Chat 専用の最適化余地が大きい
- 憲法システムは採用すべき
- コマンド数を減らしつつ、柔軟性を保つ工夫が必要
- 日本語対応と実践的なチュートリアルで差別化
