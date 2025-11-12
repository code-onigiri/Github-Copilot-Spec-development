# GitHub Copilot Performance Optimization Strategies

> **Attribution**: Integration of best practices from [github/awesome-copilot](https://github.com/github/awesome-copilot) repository  
> **Source Commit**: 17a3ac59314178f4bf4880681dee7b043687a2c8  
> **Integrated**: 2025-01-13

## Overview

このドキュメントは、GitHub Copilot の性能を最大化するためのプロンプト工学戦略と、upstream awesome-copilot リポジトリから抽出したベストプラクティスを統合します。

---

## 1. Prompt Quality Standards (from awesome-copilot)

### 成功するプロンプトの特徴

優れたプロンプトは以下を達成します:

- **明確な実行**: 何をどのように行うかについて曖昧さがない
- **一貫した結果**: 同様の入力が同様の品質の出力を生成
- **完全なカバレッジ**: 必要なすべての側面が適切に対処されている
- **標準への準拠**: 出力が最新のベストプラクティスと規約に従っている
- **研究に基づくガイダンス**: 指示が最新の権威あるソースを反映している
- **効率的なワークフロー**: 不要な複雑さがなく合理化されている
- **検証済みの効果**: テストによりプロンプトが意図通りに機能することを確認

### 避けるべき一般的な問題

| 問題                 | 具体例               | 改善例                                                                                              |
| -------------------- | -------------------- | --------------------------------------------------------------------------------------------------- |
| 曖昧な指示           | "良いコードを書いて" | "Python Flask で GET/POST エンドポイントを持つ REST API を作成し、PEP 8 スタイルガイドラインに従う" |
| コンテキスト不足     | 背景情報なし         | 必要な背景情報と要件を研究から追加                                                                  |
| 矛盾する要件         | 競合する指示         | 権威あるソースを優先して矛盾を排除                                                                  |
| 時代遅れのガイダンス | 非推奨のアプローチ   | 現在のベストプラクティスで置き換え                                                                  |
| 不明確な成功基準     | "うまくいったか？"   | 研究に基づく標準で成功完了を定義                                                                    |
| ツール使用の曖昧さ   | "ツールを使って"     | 研究されたワークフローに基づき、いつどのようにツールを使うか指定                                    |

---

## 2. Discovery Process (Interactive Prompt Refinement)

### 発見プロセスの段階

**フェーズ 1: 目的と範囲の理解**

```markdown
### 質問例:

1. このプロンプトが実行する主要なタスクは？（明示的かつ測定可能に）
2. 二次的またはオプションのタスクは？
3. ユーザーが入力として提供すべきものは？（選択、ファイル、パラメータなど）
4. 従うべき制約や要件は？
```

**フェーズ 2: コンテキストと変数の要件**

```markdown
### チェックリスト:

- [ ] `${selection}` (ユーザーが選択したコード) を使用するか？
- [ ] `${file}` (現在のファイル) または他のファイル参照を使用するか？
- [ ] `${input:variableName}` または `${input:variableName:placeholder}` のような入力変数が必要か？
- [ ] ワークスペース変数 (`${workspaceFolder}` など) を参照するか？
- [ ] 依存関係として他のファイルやプロンプトファイルにアクセスする必要があるか？
```

**フェーズ 3: 詳細な指示と標準**

```markdown
### 指示の質基準:

- 命令形の言語を使用: "これを作成"、"それを確認"、"これらの手順に従う"
- 具体的に: 一貫した実行のための十分な詳細を提供
- 具体例を含める: 研究からの実例を使用してポイントを説明
- 論理的な流れを維持: 指示を実行順に整理
- 一般的なエラーを防ぐ: 研究に基づく潜在的な混乱を予測して対処
```

---

## 3. Tool Usage Intelligence (from taming-copilot.instructions.md)

### インテリジェントなツール使用

#### 原則:

1. **必要な場合にツールを使用**: 外部情報または環境との直接的な相互作用が必要な場合、利用可能なツールを使用してタスクを達成する。正確または効果的な応答に不可欠な場合、ツールを避けない。

2. **要求時にコードを直接編集**: 既存のコードを変更、リファクタリング、または追加するよう明示的に求められた場合、アクセス可能な場合はコードベースに直接変更を適用する。これらのシナリオでは、ユーザーがコピー＆ペーストするコードスニペットの生成を避ける。

3. **目的を持った集中的な行動**: ツールの使用は、ユーザーの要求に直接結びついている必要がある。無関係な検索や変更を実行しない。

4. **ツール使用前に意図を宣言**: ツールを実行する前に、実行しようとしているアクションとその直接的な目的を述べる必要がある。この声明は簡潔で、ツール呼び出しの直前に行う。

---

## 4. Frontmatter Configuration Best Practices

### 必須フィールド

```yaml
---
mode: "agent" # ask, edit, or agent
model: Claude Sonnet 4 # 特定の機能層に依存する場合のみ指定
tools: ["edit", "search", "runCommands"] # タスクを満たすために必要な最小セット
description: "単一文、実行可能な結果" # 簡潔かつ明確
---
```

### フロントマターガイドライン:

- **mode**: `ask` (情報)、`edit` (ファイル変更)、`agent` (複数ステップ) から明示的に選択
- **tools**: タスクを有効にする最小セットに制限。順序が重要な場合は優先実行順にリスト
- **model**: 特定の機能層に依存する場合のみ宣言。それ以外はアクティブモデルを継承
- **description**: 単一文、実行可能な結果。簡潔さと明瞭さのバランス

---

## 5. Codebase-Driven Instruction Generation

### コードベーススキャン指示 (from copilot-instructions-blueprint-generator.prompt.md)

コンテキストファイルが特定のガイダンスを提供しない場合:

1. **変更または作成されるファイルに類似したファイルを特定**
2. **以下のパターンを分析**:

   - 命名規則
   - コード組織
   - エラーハンドリング
   - ログアプローチ
   - ドキュメンテーションスタイル
   - テストパターン

3. **コードベースで見つかった最も一貫性のあるパターンに従う**
4. **矛盾するパターンが存在する場合、新しいファイルまたはテストカバレッジが高いファイルのパターンを優先**
5. **既存のコードベースに見られないパターンを導入しない**

### 一般的なベストプラクティス:

```markdown
- 既存のコードに現れる通りに命名規則に正確に従う
- 類似ファイルからのコード組織パターンに一致
- 既存パターンと一貫したエラーハンドリングを適用
- コードベースで見られるテストと同じアプローチに従う
- 既存コードからのロギングパターンに一致
- コードベースで見られるのと同じ構成アプローチを使用
```

---

## 6. Output Definition Standards

### 出力期待の定義

優れたプロンプトは、期待される結果の形式、構造、および場所を指定します:

```markdown
## 出力期待

### 形式:

- ファイルタイプ: `.md`, `.json`, `.ts` など
- 構造: セクション、フィールド、階層
- 場所: `docs/adr/adr-XXXX.md` のような絶対パス

### 成功基準:

- [ ] すべての必須セクションが存在する
- [ ] 形式がテンプレートに一致する
- [ ] 検証チェックが通過する

### 失敗トリガー:

- 必須入力が欠落している
- ツールアクセスが拒否された
- 検証が 3 回失敗した
```

---

## 7. Quality Assurance Checklist

### プロンプト品質チェックリスト

```markdown
- [ ] フロントマターフィールドが完全、正確、かつ最小権限である
- [ ] 入力にプレースホルダー、デフォルト動作、フォールバックが含まれる
- [ ] ワークフローが準備、実行、事後処理をギャップなくカバーする
- [ ] 出力期待にフォーマットとストレージの詳細が含まれる
- [ ] 検証ステップが実行可能（コマンド、差分チェック、レビュープロンプト）
- [ ] プロンプトが参照するセキュリティ、コンプライアンス、プライバシーポリシーが最新
- [ ] プロンプトが VS Code で代表的なシナリオを使用して正常に実行される (`Chat: Run Prompt`)
```

---

## 8. Integration with Our MCP Server Generator Prompts

### 既存プロンプトへの統合戦略

#### 8.1 Discovery Process の追加

各言語プロンプトに以下のセクションを追加:

```markdown
## Input Validation & Discovery

Before generation, validate:

1. ${projectName}: Valid package/module name? (no spaces, lowercase)
2. ${description}: Sufficient detail? (min 10 words)
3. ${toolsRequired}: Valid tool names from awesome-copilot catalog
4. ${lintTool}: Matches available lint configs for this language

If any input is ambiguous, use joyride_request_human_input to clarify.
```

#### 8.2 Codebase Pattern Matching の強化

```markdown
## Codebase Consistency Check

1. Scan for existing MCP servers in workspace
2. Extract patterns:
   - Package structure conventions
   - Error handling styles
   - Logging approaches
   - Test organization
3. Apply these patterns to new generated code
4. Never introduce patterns not found in existing codebase
```

#### 8.3 Tool Usage Declaration の追加

```markdown
## Tool Usage Declaration

Before using any tool, declare intent:

- "Searching codebase for existing MCP server patterns..."
- "Creating file at prompts/${projectName}-mcp-server-generator.prompt.md..."
- "Creating file at prompts/${projectName}-prompts-for-<language>-generator.prompt.md..."
- "Running lint validation with ${lintTool}..."
```

#### 8.4 Enhanced Validation with Failure Triggers

```markdown
## Validation & Failure Modes

### Success Criteria:

- [ ] All generated files pass lint checks
- [ ] Code matches codebase patterns
- [ ] Tests cover all tool handlers
- [ ] Documentation is complete

### Failure Triggers (halt generation):

- Lint errors exceed 0 after 3 fix attempts
- Required input ${projectName} remains invalid after clarification
- Tool access denied (search, edit, runCommands)
- Validation commands fail 3 consecutive times
```

---

## 9. Maintenance Strategy

### 定期レビュープロセス

1. **四半期ごとのアップストリーム同期**:

   - `github/awesome-copilot` の新しいベストプラクティスを確認
   - 新しいツール統合パターンを抽出
   - 非推奨の指示を更新

2. **プロンプトテスト**:

   - 各プロンプトを代表的なシナリオで実行
   - 生成されたコードの品質を測定
   - リンターエラー率を追跡

3. **バージョン管理**:
   - プロンプトを影響を受けるコードと一緒にバージョン管理
   - 依存関係、ツール、またはレビュープロセスが変更されたときに更新
   - 変更ログでプロンプトの改訂を文書化

---

## 10. Advanced Prompt Engineering Patterns

### パターン 1: Interactive Refinement (from boost-prompt.prompt.md)

```markdown
---
mode: agent
description: "Interactive prompt refinement workflow: interrogates scope, deliverables, constraints"
---

## Workflow:

1. **Understand task scope and objectives**
2. **Ask specific questions using joyride_request_human_input**
3. **Perform project explorations using available tools**
4. **Define expected deliverables and success criteria**
5. **Clarify technical and procedural requirements**
6. **Organize prompt into clear sections**
7. **Produce improved prompt as markdown**
```

### パターン 2: Blueprint Generation (from copilot-instructions-blueprint-generator.prompt.md)

```markdown
## Configuration Variables

${PROJECT_TYPE="Auto-detect|.NET|Java|TypeScript|Go|Rust|Python|Multiple"}
${ARCHITECTURE_STYLE="Layered|Microservices|Monolithic|Domain-Driven"}
${CODE_QUALITY_FOCUS="Maintainability|Performance|Security|All"}
${DOCUMENTATION_LEVEL="Minimal|Standard|Comprehensive"}
${TESTING_REQUIREMENTS="Unit|Integration|E2E|TDD|BDD|All"}

## Generated Prompt Template

Generate copilot-instructions.md that:

- Is strictly based on actual code patterns in codebase
- References only patterns and standards that exist
- Includes explicit version compatibility requirements
- Avoids prescribing practices not evident in code
- Provides concrete examples from codebase
```

---

## 11. Recommended Integration Roadmap

### Phase 1: 既存プロンプトの強化 (Week 1)

- [ ] 全 9 言語プロンプトに Input Validation & Discovery セクション追加
- [ ] Tool Usage Declaration パターン統合
- [ ] Enhanced Failure Triggers セクション追加

### Phase 2: Interactive Refinement 層の追加 (Week 2)

- [ ] boost-prompt 風のインタラクティブワークフロー実装
- [ ] joyride_request_human_input 統合（利用可能な場合）
- [ ] コンテキスト曖昧性検出ロジック追加

### Phase 3: Codebase Pattern Matching (Week 3)

- [ ] 既存 MCP サーバーパターン抽出ロジック
- [ ] 命名規則、エラーハンドリング、テスト組織の一貫性チェック
- [ ] 新コードへのパターン適用自動化

### Phase 4: ドキュメント化とテスト (Week 4)

- [ ] 統合されたベストプラクティスの完全ドキュメント作成
- [ ] 各言語プロンプトで代表的なシナリオテスト
- [ ] 品質メトリクス測定とベースライン確立

---

## 12. Metrics & Success Criteria

### 測定すべきメトリクス

| メトリクス                  | 目標                              | 測定方法                     |
| --------------------------- | --------------------------------- | ---------------------------- |
| Lint Error Rate             | < 5 errors per 1000 lines         | 自動リンターレポート         |
| Pattern Consistency         | > 95% match with codebase         | 手動コードレビュー           |
| Prompt Success Rate         | > 90% first-try success           | テストスイート実行           |
| User Clarification Requests | < 2 per prompt execution          | ユーザーインタラクションログ |
| Generation Time             | < 30 seconds for standard project | パフォーマンスモニタリング   |

---

## Conclusion

このドキュメントは、github/awesome-copilot から抽出した実績あるパターンと、当プロジェクト固有の MCP サーバー生成要件を統合します。定期的なアップストリーム同期と継続的なテストにより、プロンプト品質の維持と改善を図ります。

---

**Next Steps**:

1. Phase 1 の実装開始: 既存 9 言語プロンプトへの強化セクション追加
2. テストハーネス作成: 各プロンプトの品質メトリクス自動測定
3. ドキュメント拡張: 言語ごとの具体的な統合例を`docs/research/`に追加
