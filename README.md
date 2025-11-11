# GitHub Copilot Spec 駆動開発

Specification-Driven Development with GitHub Copilot - 仕様書ファーストの開発環境

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub Copilot](https://img.shields.io/badge/GitHub%20Copilot-Optimized-blue)](https://github.com/features/copilot)

## 🎯 概要

GitHub Copilot の能力を最大限に活用するための、体系的な Spec 駆動開発環境です。
[GitHub spec-kit](https://github.com/github/spec-kit)にインスパイアされ、GitHub Copilot Chat 専用に最適化されています。

**コアコンセプト**: `仕様 (Specify)` → `プラン (Plan)` → `タスク (Tasks)` → `実装 (Implement)`

---

## ✨ 主な特徴

## � リポジトリ構造

このリポジトリは、spec 駆動開発フレームワーク自体の開発用です:

```
Github-Copilot-Spec-development/
├── template/              # ユーザーのプロジェクトにコピーされるファイル
│   ├── .github/          # GitHub Copilot設定
│   ├── .specify/         # 仕様テンプレート
│   ├── memory/           # プロジェクトメモリ
│   └── specs/            # 機能仕様（空）
├── docs/                 # フレームワークのドキュメント
├── scripts/              # インストールスクリプト
├── README.md             # このファイル
└── GUIDE.md              # 詳細ガイド
```

**注意**: ユーザーがインストールすると、`template/`内のファイルが自分のプロジェクトにコピーされます。

## 🚀 クイックスタート

### 前提条件

- GitHub Copilot ライセンス
- VS Code + GitHub Copilot 拡張機能
- Git

### インストール方法

#### 方法 1: ワンライナーインストール（推奨）

```bash
# 既存プロジェクトに追加する場合
cd your-project
curl -fsSL https://raw.githubusercontent.com/code-onigiri/Github-Copilot-Spec-development/main/scripts/quick-install.sh | bash

# または、新規プロジェクトとして開始する場合
git clone https://github.com/code-onigiri/Github-Copilot-Spec-development.git my-project
cd my-project
bash scripts/install.sh
```

#### 方法 2: 手動インストール

```bash
# 1. リポジトリをクローン
git clone https://github.com/code-onigiri/Github-Copilot-Spec-development.git
cd Github-Copilot-Spec-development

# 2. インストールスクリプトを実行
bash scripts/install.sh

# 3. VS Codeで開く
code .
```

#### 方法 3: このリポジトリをそのまま使う

```bash
# 1. リポジトリをクローン
git clone https://github.com/code-onigiri/Github-Copilot-Spec-development.git my-project
cd my-project

# 2. Originを変更（オプション）
git remote remove origin
git remote add origin YOUR_REPO_URL

# 3. VS Codeで開く
code .
```

### 開発フロー

#### 0. プロジェクト憲法の作成（初回のみ）

```text
/ikak:constitution
```

対話形式でプロジェクトの原則とルールを定義します。

#### 1. 仕様作成

```text
/ikak:specify ユーザー認証システム。メール/パスワードでログイン、新規登録機能
```

#### 2. 実装プラン生成

```text
/ikak:plan Python 3.11 + FastAPI + PostgreSQL。JWT認証、bcryptでパスワードハッシュ化
```

#### 3. タスク分解

```text
/ikak:tasks
```

#### 4. 実装

```text
/ikak:implement T001
```

#### 5. デバッグ（必要に応じて）

```text
/ikak:debug ユーザー登録時に500エラーが発生する
```

#### 6. 状態確認

```text
/ikak:status
```

---

## 📋 コマンドリファレンス

### `/ikak:constitution`

対話形式でプロジェクト憲法を作成・更新

**出力**: `memory/constitution.md`

**用途**: プロジェクト開始時に開発原則とルールを定義

### `/ikak:specify [description]`

新機能の仕様書を作成

**出力**: `specs/###-feature-name/spec.md`

### `/ikak:plan [tech-stack-info]`

実装プランと設計ドキュメントを生成

**出力**: `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

### `/ikak:tasks`

プランをタスクリストに分解

**出力**: `tasks.md`

### `/ikak:implement [task-id]`

特定のタスクを実装

### `/ikak:debug [issue]`

構造化された DDF 手法でバグをデバッグ・修正

**用途**: 根本原因を特定し、再発防止策を提案

### `/ikak:status`

プロジェクトと機能の状態を表示

---

## 📚 詳細ドキュメント

より詳細な情報は以下を参照してください：

- **[完全ガイド (GUIDE.md)](GUIDE.md)** - 詳細な使い方、ベストプラクティス、トラブルシューティング
- **[プロジェクト構造 (SUMMARY.md)](SUMMARY.md)** - ディレクトリ構造とファイル一覧

---

## 🎓 ベストプラクティス

### ✅ DO（推奨）

```markdown
# 明確で測定可能な受け入れ基準

**Acceptance Criteria**:

- ✅ Response time < 200ms for 95th percentile
- ✅ Password must be min 8 chars with 1 uppercase, 1 number

# 具体的なタスク記述

- [ ] [T001] Create User model with email, password_hash fields in src/models/user.py

# ユーザーストーリーによる整理

## User Registration [US1]

- [ ] [T001] [US1] Create registration endpoint
- [ ] [T002] [US1] Validate email format
```

### ❌ DON'T（非推奨）

```markdown
# 曖昧な基準

- Fast response
- Secure password

# 不明確なタスク

- [ ] [T001] Create user stuff

# 技術レイヤーで整理

## Backend

- [ ] [T001] All API endpoints
```

---

## 🏗️ ディレクトリ構造

```text
.
├── .github/
│   ├── copilot-instructions.md      # GitHub Copilot AI指示
│   ├── chatmodes/                   # カスタムチャットモード
│   ├── prompts/                     # 再利用可能プロンプト
│   └── instructions/                # パス固有の指示
├── .specify/
│   ├── templates/                   # 仕様・プラン・タスクテンプレート
│   │   └── commands/                # コマンド定義
│   └── scripts/                     # ヘルパースクリプト
├── memory/
│   ├── constitution.md              # プロジェクト憲法
│   └── project-status.md            # 進捗状況
└── specs/                            # 機能仕様（自動生成）
    └── [###-feature-name]/
        ├── spec.md                  # 機能仕様
        ├── plan.md                  # 実装プラン
        ├── research.md              # 技術調査
        ├── data-model.md            # データモデル
        ├── quickstart.md            # 使用例
        ├── contracts/               # API契約
        └── tasks.md                 # 実装タスク
```

---

## 🔧 推奨拡張機能

- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat)
- [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)
- [Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid)

---

## 🔍 トラブルシューティング

### Q: コマンドが認識されない

**A**: `.github/copilot-instructions.md` が存在するか確認。VS Code を再起動してください。

### Q: スクリプトが実行できない

**A**: 実行権限を付与してください:

```bash
chmod +x .specify/scripts/*.sh
```

詳細は [GUIDE.md のトラブルシューティングセクション](GUIDE.md#-トラブルシューティング) を参照。

---

## 🆚 spec-kit との違い

| 項目                 | spec-kit     | このプロジェクト    |
| -------------------- | ------------ | ------------------- |
| **ターゲット**       | Claude Code  | GitHub Copilot Chat |
| **コマンド形式**     | `/speckit.*` | `/ikak:*`           |
| **インストール**     | Python CLI   | Git clone のみ      |
| **プラットフォーム** | Claude 専用  | GitHub Copilot 専用 |

---

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照

---

## 🤝 コントリビューション

Issue や Pull Request を歓迎します！

貢献方法の詳細は [GUIDE.md のコントリビューションセクション](GUIDE.md#-コントリビューション) を参照してください。

---

## 📚 参考リンク

- [GitHub spec-kit](https://github.com/github/spec-kit) - インスピレーション元
- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [VS Code Copilot Customization](https://code.visualstudio.com/docs/copilot/copilot-customization)

---

## 🙏 謝辞

- [GitHub spec-kit](https://github.com/github/spec-kit) - 優れた設計思想の提供
- GitHub Copilot Team - 強力な AI 開発支援ツール

---

**最終更新**: 2025 年 1 月 11 日  
**バージョン**: 1.0.0
