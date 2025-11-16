# Shotgun（shotgun-sh/shotgun）

## 概要
Shotgun はコードベースを丸ごと解析して「コードベースに沿った」仕様（spec）を生成し、AI コーディングエージェント向けに実装計画やタスクを作成する CLI ツールです。リポジトリをインデックス化して参照する点が特徴です。

## 目的・特徴
- リポジトリ全体を読み取り、既存のアーキテクチャに整合した仕様・設計を出す
- コードベースを理解したうえで AI 実装へ橋渡しする (AGENTS.md などへの出力)
- 生成出力は AI エージェントに安全に渡せるように設計されている

## 対応 AI エージェント
- Claude Code, Cursor, Codex など複数に対応（README に実装やドキュメント多数）

## 言語・実装
- Python ベース
- CLI 実装のほか Docker と CI/CD に関するドキュメントが充実

## ディレクトリ構造（代表）
- `src/shotgun/agents/`：`specify`, `tasks`, `plan` 等の agent 実装
- `docs/`：詳しい導入と事例（CASE_STUDY.md など）
- テストや CI ファイルが整備されている

## ワークフロー（概念）
- `specify` エージェントで仕様を生成
- `research` -> `plan` -> `tasks` -> `implement` という流れを CLI で実装
- TUI（ターミナル UI）によりモードごとに Research / Specify / Plan / Tasks / Export を進められる

## テンプレート
- AGENTS.md 生成、出力フローなどのテンプレート類

## ライセンス
- LICENSE: MIT

## 使いどころ
- リポジトリを丸ごと理解させてから仕様を生成したい場合
- CI や Docker 環境で reproducible な SDD を行いたい場合

## 特筆点
- リポジトリインデックス（全体を読む）を前提に仕様を導出する点が差別化要因
- 事例（CASE_STUDY）や CI による実装の安定性が高い

- Codebase Service: `get_codebase_service()` により独自のインデクサ（グラフ）を保持し、`query_graph` や `retrieve_code` から抽出したコードスニペットや依存関係を利用して仕様を「コードベース準拠」に生成します。

## プロンプトエンジニアリングの実例へのリンク
 - Shotgun における Jinja ベースの system prompt の例、前述のツール利用例、そして token limit を考慮した compactor の運用は `docs/research/prompt-engineering-examples.md` に具体例をまとめました。

## 使いどころ
 - リポジトリを丸ごと理解させてから仕様を生成したい場合
 - CI や Docker 環境で reproducible な SDD を行いたい場合

## プロンプトエンジニアリング（テンプレート設計）
 - テンプレート群（`src/shotgun/prompts/agents/*.j2`）に、各モード固有のシステム・プロンプトを定義。研究系 Agent は Research 用テンプレート (`research.j2`) を、specify/plan/tasks それぞれに最適化されたテンプレートを持つ。
- メモリ／ファイルアクセスのガイドライン: 各テンプレートは agent の書き込み先（`research.md`／`specification.md`／`contracts/`）を明確にし、ツール呼び出し (`write_file`, `read_file`) を使用するよう指示。これにより LLM の出力は意図しないコード実装やファイル書き込みを避けられる。
- SystemState の差し込み: `SystemStatusPrompt` で TOC・ファイルリスト・現在日時などを渡すことで、LLM が現在のプロジェクト文脈を把握し、正確な提案を行えるようにしている

### 実例：Tools 呼び出し + Token Compaction
以下は Shotgun でよく見る実行例（擬似コード）です。Tool 経由でコード断片を読み出し、必要に応じ token limit に合わせて要約を行う流れを示します。

````text
# run_agent は LLM に prompt とツールデプスを与える擬似 API
prompt = render_template('research.j2', context)
context_files = ['specs/auth/spec.md', 'src/auth/login.py']
compact_context = token_limit_compactor(context_files, max_tokens=3500)
result = run_agent(agent='research', prompt=prompt + compact_context, tools=['retrieve_code','query_graph','read_file'])

# 期待される内部フロー
# 1) Agent が retrieve_code('specs/auth/spec.md') を呼ぶ -> ファイルの抜粋を受け取る
# 2) Agent は query_graph('Find all services that call auth') を呼ぶ -> 依存情報を得る
# 3) Agent は `specification.md` の変更案を構築して返す
````

このように Tools を組み合わせると、LLM はファイル全体をハンドリングせずに必要な断片のみを参照できるため、安全かつ効率的です。

## 強み・限界・リスク
- 強み:
	- LLM に「リポジトリの理解」という能力を与えるツールの登録（`query_graph`, `retrieve_code`, `file_read`）により、出力の正確性を高められる
	- System prompts のテンプレート化によりエージェントごとに一貫した動作が期待できる
	- きめ細かいユニットテストと CI 構成で品質を担保している
- Limitations / Risks:
	- 複雑なエージェント向けテストインフラ（provider の設定、モデルキー等）のセットアップコストが高い
	- Tool 呼び出しの誤用により、ファイルが不要に変更されるリスク（ツールの安全性と権限設計が要）

## 学ぶべきこと（実践ノウハウ）
- Tools-as-Agents: リポジトリ探索・クエリを LLM の "ツール" として提供すると、プロンプトに複雑なデータを直接含める必要がなくなる
- SystemStatus と TOC: 現状 TOC とファイルリストをテンプレートに注入してコンテキストを的確に与えるアプローチは、文脈消失を軽減する
- Token コンパクションと履歴処理: `token_limit_compactor` のように履歴を賢く縮約することで、会話中の重要な情報を残しつつコンテキスト制限に適合できる

---

（参考: `src/shotgun/agents/common.py`, `src/shotgun/prompts/agents/research.j2`）

---

（参考: README / docs / src）