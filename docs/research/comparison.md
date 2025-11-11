# 3 プロジェクト比較分析

**分析日**: 2025-11-11  
**対象**: spec-kit vs OpenSpec vs cc-sdd

## 1. 多次元比較表

### 1.1 基本情報

| 項目               | spec-kit                     | OpenSpec     | cc-sdd        |
| ------------------ | ---------------------------- | ------------ | ------------- |
| **開発元**         | GitHub                       | Fission AI   | gotalab       |
| **主言語**         | Bash/PowerShell + Python CLI | TypeScript   | Node.js (NPM) |
| **ライセンス**     | MIT                          | MIT          | MIT           |
| **最新バージョン** | v0.0.17 (2025-09)            | 活発な開発中 | v2.0.0 (2025) |
| **GitHub Stars**   | ~数百                        | ~数十        | ~数十         |
| **コミュニティ**   | GitHub 主導                  | 小規模       | Kiro IDE 連携 |

### 1.2 核心哲学

| 項目         | spec-kit                       | OpenSpec               | cc-sdd               |
| ------------ | ------------------------------ | ---------------------- | -------------------- |
| **核心概念** | Template-Driven Quality        | Change-Driven Workflow | AI-DLC + Steering    |
| **主眼点**   | LLM 制約による品質向上         | 変更提案の明確化       | プロジェクトメモリー |
| **対象**     | 個人〜小規模チーム             | 個人〜中規模チーム     | チーム開発           |
| **哲学**     | Constitution（憲法）ガバナンス | デルタスペック         | ボルト駆動開発       |

### 1.3 ディレクトリ構造

| 要素             | spec-kit                 | OpenSpec                        | cc-sdd                      |
| ---------------- | ------------------------ | ------------------------------- | --------------------------- |
| **設定**         | `.specify/`              | `openspec/`                     | `.kiro/`                    |
| **仕様**         | `specs/[###-feature]/`   | `openspec/specs/[capability]/`  | `.kiro/specs/[feature]/`    |
| **変更管理**     | -                        | `openspec/changes/[change-id]/` | -                           |
| **記憶**         | `memory/constitution.md` | -                               | `.kiro/steering/`           |
| **テンプレート** | `.specify/templates/`    | 埋め込み                        | `.kiro/settings/templates/` |
| **スクリプト**   | `.specify/scripts/`      | -                               | -                           |

### 1.4 コマンド体系

| ステージ           | spec-kit                | OpenSpec                 | cc-sdd                    |
| ------------------ | ----------------------- | ------------------------ | ------------------------- |
| **初期化**         | `/speckit.constitution` | `openspec init`          | `/kiro:steering`          |
| **仕様作成**       | `/speckit.specify`      | `openspec change <desc>` | `/kiro:spec-init`         |
| **要件定義**       | (specify 内包)          | (change 内包)            | `/kiro:spec-requirements` |
| **計画立案**       | `/speckit.plan`         | (proposal.md)            | `/kiro:spec-design`       |
| **タスク分解**     | `/speckit.tasks`        | (tasks.md)               | `/kiro:spec-tasks`        |
| **実装**           | `/speckit.implement`    | `openspec show <change>` | `/kiro:spec-impl`         |
| **曖昧性解消**     | `/speckit.clarify`      | -                        | -                         |
| **チェックリスト** | `/speckit.checklist`    | -                        | -                         |
| **整合性分析**     | `/speckit.analyze`      | `openspec validate`      | `/kiro:validate-*`        |
| **アーカイブ**     | -                       | `openspec archive`       | -                         |
| **進捗確認**       | -                       | `openspec view`          | `/kiro:spec-status`       |
| **合計**           | **8 コマンド**          | **8 コマンド**           | **11 コマンド**           |

### 1.5 ワークフロー

| フェーズ      | spec-kit                                                  | OpenSpec             | cc-sdd                                  |
| ------------- | --------------------------------------------------------- | -------------------- | --------------------------------------- |
| **0. 初期化** | constitution.md                                           | project.md           | steering/\*.md                          |
| **1. 仕様**   | specify → spec.md                                         | change → proposal.md | spec-init + requirements                |
| **2. 設計**   | plan → plan.md + research.md + data-model.md + contracts/ | (proposal.md 内)     | spec-design → design.md (+ research.md) |
| **3. タスク** | tasks → tasks.md                                          | tasks.md             | spec-tasks → tasks.md                   |
| **4. 実装**   | implement                                                 | (手動)               | spec-impl                               |
| **5. 検証**   | analyze                                                   | validate             | validate-gap/design/impl                |
| **6. 完了**   | -                                                         | archive              | (spec 完了)                             |

### 1.6 品質保証

| 機能                 | spec-kit                             | OpenSpec          | cc-sdd                    |
| -------------------- | ------------------------------------ | ----------------- | ------------------------- |
| **憲法ガバナンス**   | ✅ Nine Articles                     | ❌ なし           | ⚠️ 暗黙（Steering 内）    |
| **テンプレート制約** | ✅ 強制                              | ⚠️ 推奨           | ✅ カスタマイズ可能       |
| **段階的依存関係**   | ✅ Prerequisites Check               | ⚠️ 手動確認       | ✅ Phase 順守             |
| **曖昧性マーカー**   | ✅ [NEEDS CLARIFICATION] (最大 3 つ) | ❌ なし           | ❌ なし                   |
| **整合性分析**       | ✅ /analyze                          | ✅ validate (Zod) | ⚠️ validate-\* (詳細不明) |
| **タスク形式**       | ✅ `[T###] [P] [US#]`                | ⚠️ 緩い           | ⚠️ 緩い                   |

---

## 2. 深堀り比較

### 2.1 プロジェクト記憶（Memory/Context）

#### spec-kit: Constitution

```markdown
memory/constitution.md

- Nine Articles（9 原則）
- Simplicity Gate, Anti-Abstraction Gate
- Complexity Tracking（違反時の正当化）
```

**特徴**:

- ✅ 過度な複雑化を防止
- ✅ 実装前のゲートチェック
- ❌ プロジェクト固有のコンテキストは弱い

#### OpenSpec: なし

**特徴**:

- ✅ project.md で最小限の規約
- ❌ 永続的記憶なし
- ❌ セッション間の一貫性が弱い

#### cc-sdd: Steering

```markdown
.kiro/steering/

- product.md（ドメイン知識、ビジネスルール）
- tech.md（アーキテクチャ、技術スタック、規約）
- structure.md（ディレクトリ、命名規則）
- custom/\*.md（ドメイン固有知識）
```

**特徴**:

- ✅ 永続的プロジェクトメモリー
- ✅ 全セッションで参照
- ✅ カスタム知識ベース拡張
- ❌ 原則の強制力は Constitution より弱い

**結論**: spec-kit は「禁止事項」、cc-sdd は「記憶」、OpenSpec は「なし」

---

### 2.2 変更管理

#### spec-kit: ブランチベース

```
specs/001-user-auth/
specs/002-payment/
specs/003-chat/
```

- ブランチ番号で管理
- 変更履歴は Git 依存

#### OpenSpec: デルタスペック

```
openspec/changes/add-oauth/
├── proposal.md
├── tasks.md
└── specs/user-auth/
    └── spec.md  # ADDED/MODIFIED/REMOVED
```

- 変更内容を明示的に保存
- アーカイブで履歴管理
- 未来状態をクリーンに保存

#### cc-sdd: 機能ベース

```
.kiro/specs/user-auth/
├── requirements.md
├── design.md
└── tasks.md
```

- 変更追跡なし
- Git 履歴に依存

**結論**: OpenSpec が最も変更追跡に優れる

---

### 2.3 AI エージェント対応

| エージェント   | spec-kit | OpenSpec        | cc-sdd          |
| -------------- | -------- | --------------- | --------------- |
| Claude Code    | ✅       | ✅              | ✅              |
| Cursor         | ✅       | ✅              | ✅              |
| GitHub Copilot | ⚠️       | ✅              | ✅              |
| Windsurf       | ✅       | ✅              | ✅              |
| Codex          | ❌       | ✅ (グローバル) | ✅ (グローバル) |
| Gemini Code    | ⚠️ TOML  | ❌              | ✅              |
| Qwen Code      | ⚠️ TOML  | ❌              | ✅              |
| Kilo Code      | ✅       | ✅              | ❌              |
| OpenCode       | ✅       | ✅              | ❌              |
| Amp            | ✅       | ❌              | ❌              |
| Roo Code       | ✅       | ❌              | ❌              |

**結論**: spec-kit が最多対応（11+）、cc-sdd は主要 7 つ

---

### 2.4 スクリプト自動化

#### spec-kit: フル自動化

```bash
scripts/bash/
├── create-new-feature.sh    # 番号自動採番、ブランチ作成
├── setup-plan.sh            # ディレクトリ準備、テンプレートコピー
├── check-prerequisites.sh   # 依存関係確認
└── update-agent-context.sh  # エージェント固有ファイル更新

scripts/powershell/
└── (同等)
```

**特徴**:

- ✅ Bash/PowerShell 両対応
- ✅ JSON 出力でツールチェーン構築
- ✅ エージェント別コンテキスト自動更新

#### OpenSpec: TypeScript CLI

```bash
openspec init
openspec change
openspec validate
openspec archive
```

**特徴**:

- ✅ Zod 検証
- ✅ Interactive mode
- ❌ 自動化スクリプトは少ない

#### cc-sdd: NPM スクリプト

```bash
npx cc-sdd [agent]
```

**特徴**:

- ✅ ワンコマンドセットアップ
- ❌ 内部自動化は不明確

**結論**: spec-kit が最も自動化進んでいる

---

### 2.5 多言語対応

| 言語   | spec-kit | OpenSpec | cc-sdd      |
| ------ | -------- | -------- | ----------- |
| 英語   | ✅       | ✅       | ✅          |
| 日本語 | ❌       | ❌       | ✅ 完全対応 |
| 中国語 | ❌       | ❌       | ✅ 繁体中文 |

**結論**: cc-sdd のみ日本語完全対応

---

## 3. 独自性マトリクス

### 3.1 spec-kit の独自性

| 機能                           | 独自度 | 説明                     |
| ------------------------------ | ------ | ------------------------ |
| **Nine Articles Constitution** | ★★★★★  | 他にない強力なガバナンス |
| **Clarify Command**            | ★★★★☆  | 動的な曖昧性解消         |
| **Checklist Command**          | ★★★★☆  | 要件単体テスト生成       |
| **Analyze Command**            | ★★★★☆  | 実装前の整合性分析       |
| **Progressive Disclosure**     | ★★★☆☆  | 段階的詳細化             |
| **Bash/PowerShell 自動化**     | ★★★★☆  | クロスプラットフォーム   |

### 3.2 OpenSpec の独自性

| 機能                       | 独自度 | 説明                                |
| -------------------------- | ------ | ----------------------------------- |
| **Delta Specs**            | ★★★★★  | ADDED/MODIFIED/REMOVED マーカー     |
| **Change-Driven Workflow** | ★★★★★  | 変更提案 → 承認 → 実装 → アーカイブ |
| **Structured Scenarios**   | ★★★★☆  | WHEN/THEN/AND フォーマット          |
| **Zod Validation**         | ★★★☆☆  | ランタイムスキーマ検証              |
| **TL;DR Checklist**        | ★★★☆☆  | 最頻使用情報を先頭配置              |

### 3.3 cc-sdd の独自性

| 機能                           | 独自度 | 説明                           |
| ------------------------------ | ------ | ------------------------------ |
| **Steering (Project Memory)**  | ★★★★★  | 永続的プロジェクトコンテキスト |
| **AI-DLC (Bolts not Sprints)** | ★★★★☆  | 時間〜日単位の集中サイクル     |
| **Template Customization**     | ★★★★☆  | チームプロセスへの適応         |
| **Fast-to-Review Design**      | ★★★★☆  | 要約テーブル、構造化           |
| **日本語完全対応**             | ★★★★★  | ドキュメント、ワークフロー     |
| **Kiro IDE 互換**              | ★★★☆☆  | 商用 IDE との相互運用          |
| **7 Agents × 12 Languages**    | ★★★★☆  | 最大規模の対応                 |

---

## 4. 適用シーン別推奨

### 4.1 個人開発者

**推奨**: spec-kit

- 理由: Constitution で過度な複雑化を防止
- 補助コマンド（clarify, checklist, analyze）が充実
- 自動化スクリプトで効率的

### 4.2 小規模チーム（2-5 人）

**推奨**: OpenSpec

- 理由: 変更提案駆動で合意形成が容易
- デルタスペックで変更内容が明確
- 軽量で学習曲線が緩い

### 4.3 中〜大規模チーム（5-20 人）

**推奨**: cc-sdd

- 理由: Steering でプロジェクト知識を共有
- テンプレートカスタマイズでチームプロセスに適応
- 多言語対応（日本語チーム）

### 4.4 既存プロジェクトへの導入

**推奨**: cc-sdd → OpenSpec → spec-kit

- cc-sdd: validate-gap で既存コード分析
- OpenSpec: デルタスペックで段階的変更
- spec-kit: 新規開発向き

### 4.5 厳格なガバナンス要求

**推奨**: spec-kit

- 理由: Constitution の強制力
- Complexity Tracking で違反を可視化

### 4.6 頻繁な変更管理

**推奨**: OpenSpec

- 理由: 変更追跡が本質
- アーカイブで履歴管理

---

## 5. 統合可能性

### 5.1 spec-kit + OpenSpec

```
.specify/              # spec-kitの設定
├── templates/
└── memory/
    └── constitution.md

specs/                 # spec-kit仕様
└── 001-feature/

openspec/              # OpenSpec変更管理
├── specs/
└── changes/
```

**メリット**:

- Constitution ガバナンス + デルタスペック
- 強い原則 + 明確な変更追跡

### 5.2 spec-kit + cc-sdd

```
.specify/              # spec-kit設定
.kiro/
├── steering/          # cc-sddのSteering
└── specs/
```

**メリット**:

- Constitution + Steering
- 原則 + プロジェクトメモリー

### 5.3 OpenSpec + cc-sdd

```
.kiro/
├── steering/          # cc-sddのSteering
└── specs/

openspec/              # OpenSpec変更管理
├── specs/
└── changes/
```

**メリット**:

- Steering + デルタスペック
- プロジェクトメモリー + 変更追跡

---

## 6. 弱点の相互補完

| 弱点                     | 持つプロジェクト   | 補完可能プロジェクト |
| ------------------------ | ------------------ | -------------------- |
| 変更追跡なし             | spec-kit, cc-sdd   | OpenSpec             |
| プロジェクトメモリーなし | spec-kit, OpenSpec | cc-sdd               |
| Constitution なし        | OpenSpec, cc-sdd   | spec-kit             |
| 日本語対応なし           | spec-kit, OpenSpec | cc-sdd               |
| スクリプト自動化弱い     | OpenSpec, cc-sdd   | spec-kit             |
| CLI ツール弱い           | spec-kit, cc-sdd   | OpenSpec             |

---

## 7. 次世代への進化可能性

### 7.1 spec-kit

- ✅ 成熟度高い
- ✅ GitHub 主導で継続的更新
- ⚠️ マーケットシェア拡大が課題

### 7.2 OpenSpec

- ⚠️ 小規模コミュニティ
- ✅ 明確な哲学（変更駆動）
- ⚠️ エンタープライズ機能不足

### 7.3 cc-sdd

- ✅ Kiro IDE との連携
- ✅ 実践的機能充実
- ⚠️ オープンソース活動が不透明

---

## 結論

### どれを選ぶべきか？

**質問 1**: 個人開発か、チーム開発か？

- 個人 → spec-kit
- チーム → cc-sdd

**質問 2**: 新規プロジェクトか、既存プロジェクトか？

- 新規 → spec-kit
- 既存 → cc-sdd

**質問 3**: 変更管理を重視するか？

- はい → OpenSpec
- いいえ → spec-kit or cc-sdd

**質問 4**: 日本語対応が必要か？

- はい → cc-sdd
- いいえ → spec-kit or OpenSpec

**質問 5**: 厳格なガバナンスが必要か？

- はい → spec-kit
- いいえ → OpenSpec or cc-sdd

### 私たちのプロジェクトへの示唆

**採用すべき要素**:

1. ✅ spec-kit の**Constitution**
2. ✅ OpenSpec の**Delta Specs**
3. ✅ cc-sdd の**Steering**
4. ✅ spec-kit の**Progressive Disclosure**
5. ✅ OpenSpec の**Structured Scenarios**
6. ✅ cc-sdd の**Template Customization**

**独自の価値提案**:

- **GitHub Copilot Chat 特化最適化**
- **3 プロジェクトのベストプラクティス統合**
- **日本語ファースト**
- **実践的チュートリアル**
