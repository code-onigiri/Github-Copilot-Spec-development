# 途中計画変更対応 (Adaptive Replanning)

## 概要

開発途中で仕様(spec)が変更された場合でも、既存の計画とタスクを適切に調整・再生成できる機能です。

## 問題意識

現実の開発では、以下のような状況が頻繁に発生します:

- 顧客からの追加要求
- 技術的制約の発見
- より良いアプローチの発見
- ビジネス要件の変更
- 依存関係の変更

従来の仕様駆動開発では、仕様変更時に計画全体を作り直す必要があり、既存の進捗が失われるリスクがありました。

## 解決アプローチ

### 1. 差分ベースの再計画

仕様の変更内容を分析し、影響範囲を特定:

```text
/ikak:replan "ユーザー認証にGoogle OAuth 2.0を追加"
```

**動作**:

1. 現在の `spec.md` と `plan.md` を読み込み
2. 変更内容を分析
3. 影響を受けるコンポーネントを特定
4. 必要な変更のみを `plan.md` に追記
5. `tasks.md` に新規タスクを追加(既存タスクは保持)

### 2. タスク依存関係の自動調整

変更によって影響を受けるタスクを自動検出:

```markdown
## 影響分析

### 変更前のタスク

- [x] T001 パスワード認証の実装
- [ ] T002 ログイン API エンドポイント作成
- [ ] T003 フロントエンドログインフォーム

### 影響を受けるタスク

- [!] T002 OAuth 対応のため修正が必要
- [!] T003 OAuth 用 UI の追加が必要

### 新規タスク

- [ ] T010 Google OAuth 設定追加 in config/oauth.py
- [ ] T011 OAuth コールバック処理 in api/auth/oauth.py
- [ ] T012 OAuth 用ボタン追加 in frontend/Login.tsx
```

### 3. バージョン管理と履歴追跡

変更履歴を自動記録:

```markdown
## 変更履歴 (specs/###-feature-name/CHANGELOG.md)

### 2025-11-11 - OAuth 追加

- **変更理由**: ユーザビリティ向上のためソーシャルログイン追加
- **影響範囲**: 認証モジュール、API エンドポイント、フロントエンド
- **追加タスク**: T010-T012
- **修正タスク**: T002, T003
```

### 4. 段階的移行のサポート

大きな変更は段階的に適用:

```text
/ikak:replan --mode=incremental "認証をJWTからSession-basedに変更"
```

**フェーズ分割**:

- Phase 1: Session-based 認証の並行実装
- Phase 2: 既存 JWT との共存設定
- Phase 3: 段階的移行
- Phase 4: JWT 認証の削除

### 5. コンフリクト検出

変更が既存の設計原則や制約と競合する場合は警告:

```markdown
## ⚠️ コンフリクト検出

### 憲法違反の可能性

- **原則**: "ステートレス設計を維持"
- **変更**: Session-based 認証の導入
- **理由**: スケーラビリティへの影響

### 推奨アクション

1. constitution.md を更新して例外を明記
2. セッションストアのスケーリング戦略を追加
3. 技術的トレードオフを research.md に記録
```

## ワークフロー

### 標準的な変更フロー

```bash
# 1. 仕様の変更を記録
/ikak:specify --update "既存機能にOAuth追加"

# 2. 変更の影響を分析
/ikak:analyze-impact

# 3. 計画の調整
/ikak:replan

# 4. タスクの更新確認
/ikak:status

# 5. 新規・変更タスクの実装
/ikak:implement T010
```

### 大規模変更フロー

```bash
# 1. 変更の提案
/ikak:propose-change "認証システムの全面刷新"

# 2. 影響分析レポート生成
/ikak:analyze-impact --detailed

# 3. 段階的移行計画の作成
/ikak:replan --mode=incremental --phases=4

# 4. フェーズごとの実装
/ikak:implement --phase=1
```

## テクニカル実装

### ファイル構造

```text
specs/###-feature-name/
├── spec.md              # 現在の仕様
├── spec.history/        # 仕様変更履歴
│   ├── v1-spec.md
│   ├── v2-spec.md
│   └── diff-v1-v2.md
├── plan.md              # 現在のプラン
├── plan.history/        # プラン変更履歴
│   └── ...
├── tasks.md             # 統合タスクリスト
├── tasks.deprecated/    # 廃止されたタスク
│   └── deprecated-tasks.md
└── CHANGELOG.md         # 変更履歴サマリー
```

### 自動化スクリプト

```bash
# .specify/scripts/analyze-impact.sh
#!/bin/bash
# 仕様変更の影響を分析

FEATURE_DIR=$1
CHANGE_DESC=$2

# 1. spec.mdの差分を取得
# 2. 影響を受けるplan.mdのセクションを特定
# 3. 関連するtasksを検出
# 4. 影響レポートを生成
```

## メリット

### 開発者視点

- ✅ 変更があっても作業が無駄にならない
- ✅ 影響範囲が明確になる
- ✅ 段階的な移行が可能

### プロジェクト視点

- ✅ 要件変更に柔軟に対応
- ✅ 変更履歴が自動記録される
- ✅ トレーサビリティの向上

### Copilot 視点

- ✅ 変更のコンテキストを正確に理解
- ✅ 既存コードとの整合性を保つ
- ✅ より賢い提案が可能

## 実装例

### Before: 変更に弱い構造

```markdown
# spec.md (変更されると全てがリセット)

## 認証方式

- メール/パスワード認証
```

**問題**: OAuth 追加時にタスク全体を作り直し

### After: 変更に強い構造

```markdown
# spec.md

## 認証方式

- メール/パスワード認証
- Google OAuth 2.0 (v2 で追加) <!-- 変更をマーク -->

# CHANGELOG.md

## v2 - 2025-11-11

### Added

- Google OAuth 2.0 サポート

### Modified

- ログイン API エンドポイントを OAuth 対応に拡張

### Tasks

- 新規: T010-T012
- 修正: T002, T003
```

**改善**: 既存タスクを保持したまま、必要な部分のみ追加・修正

## コマンドリファレンス

| コマンド               | 説明                 | 例                                |
| ---------------------- | -------------------- | --------------------------------- |
| `/ikak:replan`         | 計画を再生成         | `/ikak:replan "OAuth追加"`        |
| `/ikak:analyze-impact` | 変更影響を分析       | `/ikak:analyze-impact`            |
| `/ikak:propose-change` | 大規模変更を提案     | `/ikak:propose-change "認証刷新"` |
| `/ikak:history`        | 変更履歴を表示       | `/ikak:history`                   |
| `/ikak:rollback`       | 前のバージョンに戻す | `/ikak:rollback v1`               |

## ベストプラクティス

### 1. 変更は小さく、頻繁に

大きな変更は複数の小さな変更に分割

### 2. 変更理由を明記

なぜその変更が必要かを記録

### 3. 影響分析を必ず実施

`/ikak:analyze-impact` で影響範囲を確認

### 4. 憲法との整合性を確認

`constitution.md` に違反していないかチェック

### 5. 段階的移行を優先

一度にすべてを変更せず、フェーズ分けを検討

## 関連機能

- [Triple Memory](./triple-memory.md) - 変更履歴を記憶に活用
- [Critical Dialogue](./critical-dialogue.md) - 変更の妥当性を批判的に検証
- [Flexible Principles](./flexible-principles.md) - 原則との整合性チェック

## まとめ

途中計画変更対応により、**仕様駆動開発がアジャイルな開発フローに適応**します。

- 変更を恐れない開発
- 進捗を無駄にしない再計画
- トレーサビリティの維持
- Copilot との協働がより効果的に
