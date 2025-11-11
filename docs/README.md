# GitHub Copilot Spec-Driven Development

**オープンソース仕様駆動開発フレームワーク for GitHub Copilot Chat**

## プロジェクトビジョン

GitHub Copilot Chat を使用する世界中の開発者が、より良い仕様管理と実装の一貫性を実現できるようにする。オープンソースの力で、仕様駆動開発のベストプラクティスを誰もが利用できる形で提供する。

## コアバリュー

### 🌍 Universal Access（普遍的なアクセス）

- 完全無料・オープンソース（MIT License）
- 言語の壁をなくす（多言語対応）
- あらゆる規模のプロジェクトで使用可能

### 🤝 Community-Driven（コミュニティ駆動）

- 世界中の開発者からのフィードバックで進化
- 透明性の高い開発プロセス
- 誰もが貢献できる仕組み

### 💡 Innovation First（革新優先）

- 既存フレームワークの良い部分を統合
- 新しいアイデア（DDF、批判的対話）を実験
- GitHub Copilot Chat の可能性を最大化

### 📚 Learning & Growth（学習と成長）

- 実践的なチュートリアルとサンプル
- 失敗例も含めた透明な記録
- コミュニティで知識を共有

## 主要機能

### 1️⃣ 完全 GitHub 統合

仕様から実装、レビューまでを GitHub エコシステム内で完結。Issues、Pull Requests、Projects、Actions との自動連携。

### 2️⃣ デバッグ駆動修正（DDF）

AI が「なぜそう修正したか」を明確に説明できる構造化デバッグフロー。根本原因の特定を支援。

### 3️⃣ 批判的対話と意図の三角測量

AI が質問ではなく提案形式で応答し、Goal・Constraint・Reference の 3 軸で意図を固定。曖昧性を構造的に排除。

### 4️⃣ 三層記憶アーキテクチャ

Constitution（不変の原則）+ Context（可変の記憶）+ Changelog（変更履歴）の統合メモリシステム。

### 5️⃣ 段階的導入パス

Level 0（ゼロコスト）から Level 3（フル機能）まで、プロジェクトの成熟度に合わせて段階的に導入可能。

### 6️⃣ 多言語対応

日本語、英語を含む多言語でのプロンプト最適化。各言語の特性に合わせた AI 対応。

### 7️⃣ 柔軟な開発原則の選択

Constitution で自由に開発原則を定義可能。TDD、SOLID、DDD など、プロジェクトに最適な原則を選択し、AI に従わせることができます。

### 8️⃣ 途中計画変更対応

開発途中で仕様が変更されても、既存の進捗を無駄にせず、影響範囲を分析して適切に再計画。差分ベースの更新により、変更に強い開発プロセスを実現。

## プロジェクト構成

```
docs/
├── README.md                    # このファイル
├── features/                    # 機能詳細
│   ├── github-integration.md
│   ├── debug-driven-fixing.md
│   ├── critical-dialogue.md
│   ├── triple-memory.md
│   ├── progressive-adoption.md
│   └── multilingual.md
├── architecture/                # アーキテクチャ設計
│   ├── overview.md
│   ├── file-structure.md
│   ├── command-system.md
│   └── workflow.md
├── guides/                      # 実装・利用ガイド
│   ├── getting-started.md
│   ├── contribution.md
│   └── tutorial/
└── research/                    # 競合分析・研究
    ├── comparison.md
    └── unique-value-proposition.md
```

## 開発原則

### オープンソース第一

- すべての意思決定は公開
- コミュニティの意見を最優先
- 企業利益よりユーザー利益

### 実用性重視

- 机上の空論ではなく、実際に使えるツール
- 実プロジェクトでのフィードバックを反映
- シンプルさと強力さのバランス

### 実験的精神

- 新しいアイデアを積極的に試す
- 失敗を恐れず、学びを共有
- 従来の常識に囚われない

## コントリビューション

このプロジェクトは世界中の開発者の貢献で成り立っています。

- 🐛 バグ報告・修正
- 💡 新機能の提案・実装
- 📝 ドキュメントの改善
- 🌍 多言語化の支援
- 📚 チュートリアル・サンプルの追加

詳細は [docs/guides/contribution.md](guides/contribution.md) をご覧ください。

## ライセンス

MIT License - 誰でも自由に使用、改変、配布が可能です。

## コミュニティ

- GitHub Discussions: 質問・議論の場
- GitHub Issues: バグ報告・機能要望
- GitHub Projects: ロードマップの透明化

---

**一緒により良い開発体験を作りましょう！**
