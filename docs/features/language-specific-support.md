# 言語別詳細サポート (Language-Specific Support)

## 🎯 概要

選択されたプログラミング言語に応じて、最適化されたコーディング規約・プロンプト・MCP サーバーパターン・テスト/検証ガイドを即時提示し、AI 対話と自動生成精度を高める機能。`awesome-copilot` の知見 + 標準スタイルガイドを統合し、言語間の差異を体系化。

## ✅ 目的

- 言語選択直後の "迷い" を除去し、一貫した品質指針を表示。
- プロンプト再利用性と標準化（共通セクション構造: Mission / Inputs / Workflow / Output / Validation）。
- AI に対する言語認識 (Style + Error Handling + Test Pattern) を強化し初回提案精度を向上。
- MCP サーバー/ツール生成タスクを高速化（テンプレート/ハンドラパターン提示）。

## 👥 主対象ユーザー

| ロール              | ニーズ                     | 提供価値                     |
| ------------------- | -------------------------- | ---------------------------- |
| アプリ開発者        | 言語毎のベストプラクティス | 規約+例+共通プロンプト       |
| AI プロンプト設計者 | 安定したテンプレート       | セクション化テンプレート     |
| ツール/MCP 開発者   | Handler/Schema パターン    | 言語別実装スニペ概要         |
| テスト/品質担当     | テスト標準/検証観点        | 最低限テスト表 (happy/error) |

## 🧭 ユーザージャーニー (ハイレベル)

1. ユーザーが言語を選択 (UI / 設定 / プロジェクト解析自動検出)。
2. 言語メタデータキャッシュからロード（未キャッシュなら初回構築）。
3. 表示領域に以下 5 ブロックをレンダリング:
   - 概要 & 品質ゴール
   - コーディング規約 / スタイル要点
   - プロンプトパターン & サンプル
   - MCP / ツール / ハンドラ実装パターン
   - テスト & エラー/検証基準
4. ユーザーがプロンプト例をコピー / カスタム生成 (追加フィールド挿入フォーム)。
5. 必要に応じてローカル設定へ "固定"（プロジェクトメモリへ書き込み）。

## 🧩 データモデル (概念)

```text
LanguageSupportMeta
├─ language: string (id)
├─ aliases: string[] ("ts", "javascript")
├─ overview: { role, primary_use, quality_focus }
├─ style: { naming, formatting, idioms, pitfalls }
├─ prompts: PromptPattern[]
│    ├─ id, title, intent, sections { mission, inputs, workflow, output, validation }
│    ├─ tags[] ("generation", "review", "mcp")
├─ mcp: { server_patterns[], handler_structure, schema_lib }
├─ testing: { frameworks[], minimal_matrix[], example_cases[] }
├─ error_handling: { common_types[], structured_pattern, validation_strategy }
├─ performance: { instrumentation, concurrency, profiling }
├─ references: { official[], awesomeCopilot[] }
└─ version: semver
```

### PromptPattern (詳細)

| フィールド | 説明                                 |
| ---------- | ------------------------------------ |
| id         | 一意識別子                           |
| intent     | 目的 ("generate mcp server handler") |
| mission    | 要求を短く命令形で                   |
| inputs     | 必須/任意入力と型                    |
| workflow   | ステップ列 (番号付き)                |
| output     | 出力整形ルール / JSON 期待構造       |
| validation | 完了条件 / チェックポイント          |

## 🖥️ UI コンポーネント (最小構成)

| コンポーネント   | 役割                                    | 交互               |
| ---------------- | --------------------------------------- | ------------------ |
| LanguageSelector | 言語選択/自動検出切替                   | onChange(language) |
| MetaSummaryCard  | 概要/品質焦点                           | copy summary       |
| StyleAccordion   | 規約カテゴリ (Naming/Formatting/Idioms) | expand/collapse    |
| PromptGallery    | パターン一覧 + 検索/タグフィルタ        | select/paste       |
| MCPPatternPanel  | ハンドラ/生成構造ダイジェスト           | view code snippet  |
| TestMatrixTable  | 最低限テストケース matrix               | copy yaml/json     |
| ReferenceFooter  | 公式 & 出典リンク                       | open external      |

## 🔄 同期 & 更新フロー

| トリガー           | 処理                              | キャッシュ戦略        |
| ------------------ | --------------------------------- | --------------------- |
| 初回言語選択       | ローカルに存在確認 → なければ生成 | 永続 (memory/)        |
| リポジトリ更新検知 | バージョン比較 → 差分再生成       | 差分更新 (局所再構築) |
| 手動リフレッシュ   | 強制再フェッチ/再要約             | 全再構築              |

## 🗄️ キャッシュ

- 保存場所: `memory/language-meta/<language>.json` (将来拡張想定)。
- バージョン付与: `sourceVersion` + `schemaVersion`。
- 失効条件: (a) ソース更新検知 (b) スキーマ更新 (c) 明示的 invalidate。

## ⚠️ エッジケース

| ケース                   | 対応                                      |
| ------------------------ | ----------------------------------------- |
| 未対応言語選択           | Fallback: 共通テンプレート + 追加要望案内 |
| 複数言語プロジェクト     | 主要言語推定 (行数/主要拡張子) + 切替タブ |
| 古いキャッシュスキーマ   | 自動マイグレーション or 再生成            |
| オフライン環境           | 最終キャッシュ表示 + 更新不可通知         |
| 異常に巨大プロンプト要求 | サイズ上限提示 + 分割支援                 |

## 🧪 品質保証 (最小テスト)

| テストカテゴリ | チェック                              |
| -------------- | ------------------------------------- |
| 構造検証       | JSON スキーマ適合 (schemaVersion)     |
| レンダリング   | 全コンポーネント初期表示 OK           |
| フィルタ/検索  | タグ+キーワードで正しい reduce        |
| コピー動作     | 改行/Markdown 保持                    |
| 差分更新       | 旧 → 新で未変更部保持, 更新部のみ反映 |

## 🔐 セキュリティ/健全性

- 外部リンクはホワイトリスト化 (公式ドメイン)。
- プロンプト中の未知埋め込み（未展開変数）検知 → 警告。
- 大量ロード防止: 言語メタは lazy + on-demand。

## 📈 将来拡張

| 項目             | 内容                                         |
| ---------------- | -------------------------------------------- |
| 自動 lint 生成   | 言語選択で推奨 Linter 設定ファイル雛形出力   |
| 動的差分学習     | ユーザー修正後プロンプトを逆解析し改善案提示 |
| コードベース走査 | 実プロジェクト AST 解析 → 規約差分レポート   |
| 国際化強化       | 英語/日本語切替 (プロンプト二言語提示)       |
| IDE API 連携     | VS Code 拡張: ホバーでスタイル抜粋表示       |

## 📎 出典/参照

- リポジトリ: `github/awesome-copilot`
- 代表的スタイルガイド: PEP8, Effective Java, Go Code Review Comments, Rust API Guidelines, .NET Naming Guidelines, Ruby Style Guide, PSR-12, Swift API Design Guidelines, Kotlin Coding Conventions

---

最終更新: 2025-01-11  
バージョン: 0.1.0 (draft)
