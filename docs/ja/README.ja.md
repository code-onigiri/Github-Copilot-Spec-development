# GitHub Copilot Spec 駆動開発

GitHub Copilotの能力を最大限に活用する、仕様ファーストの開発環境です。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../LICENSE)
[![GitHub Copilot](https://img.shields.io/badge/GitHub%20Copilot-Optimized-blue)](https://github.com/features/copilot)

## 🎯 概要

GitHub Copilotのために最適化された、体系的なSpec駆動開発環境です。
[GitHub spec-kit](https://github.com/github/spec-kit)にインスパイアされ、GitHub Copilot Chatに特化して最適化されています。

**コアコンセプト**: `仕様化` → `計画` → `タスク化` → `実装`

---

## ✨ 主な機能

- **仕様ファースト**: 仕様の定義から始まる開発プロセス
- **AI最適化**: GitHub Copilotに最適化されたプロンプトと構造
- **構造化メモリ**: AIがプロジェクトコンテキストを記憶する仕組み
- **言語非依存**: さまざまなプログラミング言語に対応可能

## 🚀 クイックスタート

### 前提条件

- GitHub Copilotライセンス
- VS Code + GitHub Copilot拡張機能
- Git

### インストール

既存のプロジェクトに必要なファイルをインストールします。

```bash
# 既存プロジェクトに追加
cd your-project
git clone https://github.com/code-onigiri/Github-Copilot-Spec-development.git
cd Github-Copilot-Spec-development
bash scripts/install.sh
```

### 開発フロー

#### 1. プロジェクト憲章の作成（初回のみ）

プロジェクトの原則とルールを定義します。

#### 2. 仕様の作成

アプリケーションの機能と要件を定義します。

#### 3. 実装

仕様に基づいて、GitHub Copilotと協力して機能を実装します。

詳細については、[完全ガイド（日本語）](GUIDE.ja.md)を参照してください。

---

## 📚 ドキュメント

- [完全ガイド（日本語）](GUIDE.ja.md) - 詳細な使い方とベストプラクティス
- [プロジェクト構造（日本語）](SUMMARY.ja.md) - ディレクトリ構造とファイルの説明
- [English Documentation](../../README.md) - English version

---

## 🤝 コントリビューション

コントリビューションを歓迎します！プルリクエストを送る前に、既存のイシューを確認するか、新しいイシューを作成してください。

## 📄 ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。詳細については[LICENSE](../../LICENSE)ファイルを参照してください。

---

**最終更新**: 2025年11月12日  
**バージョン**: 2.0.0
