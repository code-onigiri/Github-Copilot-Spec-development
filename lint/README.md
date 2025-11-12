# Lint & Style Baseline

各言語向けの厳格な初期設定ファイル群です。プロジェクトにコピーし、必要に応じて微調整してください。CI では "lint" / "format" / "analyse" をゼロエラー必須にする運用を推奨します。

## ディレクトリ構成

- typescript: ESLint / Biome
- go: golangci-lint
- rust: clippy / rustfmt
- java: Checkstyle / SpotBugs (exclude) ※ Spotless は Gradle 側
- kotlin: detekt / ktlint (.editorconfig)
- swift: SwiftLint / swift-format
- csharp: Roslyn analyzers (.editorconfig)
- ruby: RuboCop
- php: PHP_CodeSniffer / PHPStan

## 推奨 CI コマンド例

```
# TypeScript (選択制)
npx eslint . --max-warnings=0
npx biome check .

# Go
golangci-lint run --timeout=5m

# Rust
cargo fmt -- --check
cargo clippy -- -D warnings

# Java (Gradle)
./gradlew spotlessCheck checkstyleMain spotbugsMain

# Kotlin (Gradle)
./gradlew ktlintCheck detekt

# Swift
swiftlint --strict
swift-format lint --recursive Sources

# C#
dotnet format --verify-no-changes
dotnet build /warnaserror

# Ruby
bundle exec rubocop

# PHP
vendor/bin/phpcs --standard=PSR12 src/
vendor/bin/phpstan analyse --level=max src/
```

## 運用指針

1. 例外的緩和は Pull Request で理由を明示 ("lint-ignore rationale")。
2. 自動整形 (format) 後に差分ゼロを確認してからコミット。
3. 新規ルール追加時は README の "Linter Rationale" に理由追記。
4. 依存更新でツール挙動が変わった場合はロックファイルを更新し再検証。

## 変更時チェックリスト

- 新規ルールは既存コードに大量違反を出さないか (段階適用)。
- ビルド時間・CI 時間への影響 (タイムアウト設定)。
- クロス言語一貫性 (命名・Complexity 閾値)。

## 参考

- Google / Rust / Ruby / PSR-12 / Swift API Design / Kotlin conventions 各公式スタイルガイド。
