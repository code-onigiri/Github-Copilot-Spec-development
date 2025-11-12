# Lint Config Auto-Installer

AI agents やユーザーがプロジェクトに超厳格な lint 設定を自動導入するためのスクリプト群です。

## 📦 提供スクリプト

### `install-lint-config.sh` (Bash)

プロジェクトルートで実行し、言語別の lint 設定ファイルを自動配置します。

#### 使い方

```bash
# TypeScript設定のみインストール（GitHub から自動ダウンロード）
./scripts/install-lint-config.sh typescript

# ローカルリポジトリから配置
./scripts/install-lint-config.sh typescript --repo-path /path/to/Github-Copilot-Spec-development

# 全言語の設定を一括インストール
./scripts/install-lint-config.sh all

# ヘルプ表示
./scripts/install-lint-config.sh --help
```

#### サポート言語

- `typescript` - ESLint + Biome (超厳格型チェック、unsafe 禁止、todo/fixme エラー化)
- `go` - golangci-lint (複雑度 10、gosec/goconst/misspell 有効)
- `rust` - clippy + rustfmt (pedantic/nursery deny、unwrap 禁止)
- `java` - Checkstyle + SpotBugs (Google Style、Javadoc 必須)
- `kotlin` - ktlint + detekt (複雑度 25、ネスト深さ 4)
- `swift` - SwiftLint + swift-format (未使用宣言検出、force_try error)
- `csharp` - Roslyn analyzers (.editorconfig、全診断 error 化)
- `ruby` - RuboCop (メソッド長 15、ABC 複雑度 20、ドキュメント必須)
- `php` - PHP_CodeSniffer + PHPStan (PSR-12、level max、警告=エラー)

#### 動作

1. 既存ファイルは `.backup.YYYYMMDD_HHMMSS` にバックアップ
2. GitHub または指定ローカルリポジトリから設定ファイルをダウンロード/コピー
3. プロジェクトルートまたは推奨サブディレクトリに配置
4. 次ステップ（パッケージインストール、ビルド設定）をログ出力

#### AI Agent 向け利用例

```bash
# ユーザーが「TypeScript MCPサーバーを生成」と指示した場合
cd /path/to/new-mcp-server
/path/to/Github-Copilot-Spec-development/scripts/install-lint-config.sh typescript --repo-path /path/to/Github-Copilot-Spec-development

# package.json のscriptsに追記
npm pkg set scripts.lint="eslint . --max-warnings=0"
npm pkg set scripts.format="eslint . --fix"

# 依存追加
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-import eslint-plugin-unused-imports eslint-import-resolver-typescript
```

#### 特徴

- **ゼロ警告ポリシー**: 全設定で警告をエラー扱い（CI 失敗）
- **TODO/FIXME 禁止**: コミット前に解決必須（TypeScript）
- **unsafe 操作検出**: any 型、型アサーション乱用を防止（TypeScript）
- **複雑度制限**: 関数/メソッド長、循環複雑度、ABC 複雑度を厳格化
- **未使用コード検出**: import、変数、関数の未使用を全言語で強制排除
- **スタイル統一**: 公式ガイド準拠（Google/Rust/Ruby/PSR-12/Swift API Design）

#### トラブルシューティング

- **curl/wget がない**: Docker 環境や CI 環境では事前インストールが必要
- **権限エラー**: `chmod +x` で実行権限を付与
- **既存設定との衝突**: バックアップファイルを確認し、手動マージを検討

## 🔧 カスタマイズ

各言語の詳細設定は `lint/` ディレクトリを参照してください。プロジェクト固有の例外が必要な場合:

1. スクリプトで基本設定を配置
2. プロジェクトルートで微調整（例: RuboCop の Metrics/BlockLength を特定ファイルで緩和）
3. 例外理由を README や CONTRIBUTING に明記

## 📚 関連ドキュメント

- [lint/README.md](../lint/README.md) - 全言語の設定ファイル詳細と運用指針
- [prompts/](../prompts/) - 各言語の MCP サーバー生成プロンプト（lint 統合済み）

## ライセンス

MIT License - 自由に使用・改変可能
