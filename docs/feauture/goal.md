# このSDDkitの目標

## 要旨

- 従来のSDD（Software Design Document）の強みを受け継ぎつつ、AIと人間の共同開発を前提にしたワークフローを提供する。
- GitHub Copilotなどを使えるようにする。
- 計画立案（Plan）・設計（Design）に重点を置き、人間が理解しやすく、AIが正しくコードを生成できるようサポートする。
- TDDやSOLIDなどの設計原則を尊重し、リファクタリングと継続的な品質改善を推奨する。

## 目的（Objectives）

- 明確で再現可能な設計と実装のワークフローを定義し、AIがより正確かつ安全にコードを生成できるようにする。
- 人間開発者とAIの役割分担を明示し、意思決定すべき箇所を人間が管理しやすくする。
- 仕様変更やバグ修正の際、設計と実装の差分を簡単に追跡できるようにする。

## 想定ユーザー

- 個人開発者

## ワークフローの概略

Constitution → Plan → Research → Design → Tasks → Write ⇄ Debug/Refactor

各フェーズの役割は以下の通りです。

### Constitution（憲法）

開発時にAIが従うべきルールやプロジェクト固有の制約を定義します。用途に応じて2種類の憲法を想定します。

- Plan/Design用憲法（例: 大局的なアーキテクチャ指針や開発方針）
- Writing用憲法（例: コード品質、TDD、命名規則、互換性ルール）

例:
```md
## Plan Constitution
- Keep changes small and reviewable.
- Prefer clarity over cleverness.
```

```md
## Code Constitution
- Enforce TDD.
- Apply SOLID principles when appropriate.
```

### Plan（計画）

機能追加や改修に対する短中期の計画を立てます。プランには、目的、成功条件、主要タスク、期限、リスクを含めると良いです。AIはこの計画に従ってタスクを分割し、実装案を提案します。

計画の要点:

- 目的（What）と成功条件（How to verify）
- ステップ（小さなタスク）と優先順位
- 必要なリサーチや前提条件
- リスクと既知の制約

### Research（調査）

設計上の判断に必要なデータや外部の情報を集め、結果をドキュメント化します。AIはAPI仕様、既存のコード参照、ベンチマークなどを検索し、候補案を提示します。

### Design（設計）

実装に必要な構成、インターフェース、データフローを定義します。設計には対外API、データスキーマ、エラーケース処理、テスト方針などを含めます。

### Tasks（タスク化）

設計を実際の作業に落とし込むフェーズです。ここでは、設計で定義された要件に基づいて「アトミックなタスク（実装・テスト・ドキュメント）」を作成し、優先順位・担当者・見積もりを付与します。AIはタスクの分解、実装に必要な前提、テストケースの生成、関連ファイルや変更箇所の候補リスト化などを手伝います。

タスクの主な内容:

- 目的・受け入れ条件（Acceptance Criteria）を明確にする
- 小さな実装単位（コミット/PR 単位）に分割する
- テストケース（ユニット/統合）を紐づける
- 見積もり（ラフな時間・複雑さ）を付与する
- 依存関係と優先度を明示する

タスクはそのままIssueやStoryに変換できるレベルまで細かくするのが望ましく、CI/CD や Copilot などのツールと連携して自動で骨組みを生成することができます。

### Write（実装）

設計に基づきコードを生成・実装します。TDDを採用する場合は、先にテストを作成し、その後コードを生成します。AIはテスト、モジュール、ドキュメントの骨組みを提案し、実装をサポートします。

### Debug / Refactor（デバッグ・リファクタリング）

実装後にテストを実行して問題を洗い出し、必要に応じて設計・コードを見直します。AIにより修正案を生成し、変更のインパクトを提示します。

#### Replan / Redesign（再計画／再設計）

バグや仕様変更、性能問題、あるいは運用上の要請により、最初の計画や設計を見直す必要が出た場合の手順です。再計画・再設計（replan/redesign）は、問題の根本原因を評価し、新しい方針を決定してタスクへ反映する一連の作業を支援します。

再計画／再設計に含めるべきポイント:

- 問題の現状把握（テスト結果、ログ、ユーザーフィードバック）
- 変更のスコープ評価（小修正か設計レベルか）
- 新しい設計案とトレードオフの提示
- 影響範囲（既存機能、API、データ）と移行計画
- 更新されたタスクセットと優先順位付け

AIは失敗の解析（failing tests, stack traces, metrics）を手助けし、再計画案や短期的修正、長期的改修の候補を生成してくれます。生成された案は必ず人間のレビューを通すようにしてください。

## 実践的な利用ケース

- Planで分割したタスクを順に実装していく。
- CIでテストが落ちた場合、Design/Writeフェーズの差分に沿って自動的に修正案を提示・検証する。
- プロジェクト独自の憲法に基づき、AIの提案をフィルタし、品質を担保する。

## 今後の拡張と注意点

- 複雑なアーキテクチャの自動設計や意図的な設計トレードオフは人間の判断を必須とする。
- 実運用では、AIの提案をそのままマージせず必ずレビューとテストを挟むこと。
- スペックや憲法はプロジェクトに応じて進化させ、履歴を追える形で管理すること。

---

以上が本SDDkitにおける基本方針と期待する機能の概要です。今後、テンプレートやCLIとの連携、Copilot連携の実装を通じて、実用的なワークフローを整備していきます。

## 指示用のプロンプト例（Prompt Templates）

このセクションでは、各フェーズでAIに出すと良いプロンプトの例を示します。ポイントは「憲法（Constitution）を最初に与える」「期待する出力形式を明確にする」「必要なコンテキストを添える」ことです。

### 基本方針

- 憲法（Code/Plan Constitution）の要点を冒頭に示す。
- 出力は「目的・受け入れ基準・候補・実装例・テスト案」のように構造化して返すように指示する。
- 不明点や曖昧な要件があれば最初に確認するよう促す。

### Constitution（憲法）用プロンプト
短い例:
```md
You are a coding assistant. Follow the Code Constitution: Enforce TDD, prefer clarity over cleverness, and keep PRs small.
```

詳細例:
```md
You are a coding assistant for ProjectX. Rules:
- Enforce TDD and include tests in PRs.
- Apply SOLID when appropriate.
- Avoid changing public APIs without specification.
When proposing changes, include minimal tests and patch examples.
```

### Plan（計画）用プロンプト
短い例:
```md
Task: Add a rate-limiter to /api/upload. Output: goal, acceptance criteria, atomic tasks, and estimates.
```

テンプレート例:
```md
Constitution: Follow Plan Constitution ('Keep changes small', 'Prefer clarity').
Task: Implement rate-limiter for /api/upload.
Context: Node.js/Express, auth required, distributed instances.
Please output:
1) Goal
2) Acceptance criteria (specific tests/metrics to verify)
3) Atomic tasks with priority and estimated time
4) Required research or dependencies
```

### Research（調査）用プロンプト
```md
Task: Research candidate rate-limiter libraries for Node.js.
Context: Must be Redis-backed for distributed use, low latency, and permissive license.
Please list 3-5 options with pros, cons, license, and a short integration snippet (3-5 lines).
```

### Design（設計）用プロンプト
```md
Constitution: Follow Plan Constitution.
Task: Design the API, storage format, and sequence for the rate-limiter.
Context: Provide endpoints, headers, key schema, error handling, and test ideas.
Please output: interface spec, data model, call flow (text), and test scenarios.
```

### Tasks（タスク）用プロンプト
```md
Constitution: Follow Plan Constitution.
Task: Convert the design into atomic tasks for implementation of the rate-limiter.
Context: Provide task titles, acceptance criteria, rough estimates, priority, and required files to change.
Please output:
1) Atomic tasks with short descriptions
2) Acceptance criteria for each task
3) Estimated effort (small/medium/large or hours)
4) Suggested test cases and any necessary mocks or fixtures
```


### Write（実装）用プロンプト（TDD）
```md
Constitution: Follow Code Constitution (TDD, SOLID).
Task: Implement rate-limiter to pass tests.
Context: Use 'rate-limiter-flexible' with Redis on Node.js/Express.
Please output:
1) Unit tests covering normal, edge, and failure cases.
2) Minimal implementation code to satisfy tests.
3) Integration test plan for distributed behavior.
```

### Debug / Refactor（デバッグ・リファクタリング）用プロンプト
```md
Constitution: Follow Code Constitution.
Problem: CI fails; /api/upload returns 500 with 'RedisError' intermittently.
Context: Include the failing test file and stack trace if available.
Please output:
1) Likely root causes with confidence estimates.
2) Minimal code patch to fix the issue with explanation.
3) Tests to reproduce and prevent regression.
4) Optional refactor proposals to improve resilience.
```

### Replan / Redesign（再計画／再設計）用プロンプト
```md
Constitution: Follow Plan/Code Constitution.
Problem: Tests/regression indicate a design flaw or requirement changed; we need to replan and redesign.
Context: Include failing tests, error logs, and a short summary of observed problems.
Please output:
1) Summary of the problem and impact.
2) Recommended replan or redesign options with trade-offs.
3) Updated tasks or task deltas required to implement the chosen plan.
4) Suggested acceptance criteria and test updates.
```

### 使い方のヒント

- 小さく分割された指示は成功しやすい。1つの目的だけを伝える。
- 出力形式（JSON、箇条書き、テストファイルなど）を明示すると、使い勝手が良くなる。
- ファイルパスや関連関数の抜粋、既存コードの一部を示すと精度が上がる。
- AIの提案は必ず人間がレビューし、CIでテストしてからマージする。

---

このプロンプト集は基本例です。プロジェクト固有の憲法やテンプレートを追加し、`templates/` フォルダで管理すると便利です。

---
**Wrote by AI and Human**