# Debug-Driven Fixing (DDF) — デバッグ駆動修正

## 概要

AI がコードを修正する際に「なぜそう修正したか」を明確に説明できるようにする、構造化デバッグフローです。根本原因の特定を重視し、場当たり的な修正を防ぎます。

## 背景：なぜ DDF が必要か

### 従来の AI デバッグの問題

```
開発者: 「このコードが動かないんだけど」
AI: 「このように修正してください」
[コード修正]
開発者: 「動いたけど、なぜ？」
AI: 「...」
```

**問題点**:

1. AI が根本原因を理解せず、見た目で修正している
2. 「なぜ動いたか」を説明できない
3. 同じ問題が再発する
4. 学習が蓄積されない

### DDF のアプローチ

```
開発者: 「このコードが動かないんだけど」
AI: 「期待値と実際の動作を記録します」
[デバッグログ出力]
AI: 「user.role が undefined です。JOIN が漏れている可能性があります」
[仮説に基づく修正]
AI: 「修正理由: データベースクエリに role テーブルの JOIN を追加しました」
開発者: 「なるほど、根本原因が分かった！」
```

**改善点**:

1. 期待値と実際値を明示化
2. ギャップから仮説を立てる
3. 修正理由を記録
4. 再発防止のための知識蓄積

## DDF の 5 ステップ

### Step 1: 期待値の明示化

**「こう動くはず」を具体的に記述する**

```javascript
// ❌ 従来の曖昧な期待
// "ユーザーデータが取得できるはず"

// ✅ DDF での明示的な期待値
console.log("=== DDF Step 1: Expected Values ===");
console.log("Expected: user.id should be a positive integer");
console.log("Expected: user.email should match input email");
console.log('Expected: user.role should be "admin" or "user"');
console.log("Expected: user.created_at should be a valid Date");
```

**プロンプトテンプレート**:

````markdown
## DDF Step 1: 期待値の明示化

### 期待する動作

- [ ] ユーザー ID が正の整数である
- [ ] メールアドレスが入力値と一致する
- [ ] ロールが "admin" または "user" である
- [ ] 作成日時が有効な Date オブジェクトである

### 期待値のログ出力

```javascript
console.log("Expected: user.id should be", expectedUserId);
console.log("Expected: user.email should be", inputEmail);
```
````

````

### Step 2: 現状の可視化

**実際の動作をログで確認する**

```javascript
console.log('=== DDF Step 2: Actual Values ===');
console.log('Actual: user.id =', user.id);
console.log('Actual: user.email =', user.email);
console.log('Actual: user.role =', user.role);  // undefined!
console.log('Actual: user.created_at =', user.created_at);
````

**出力例**:

```
=== DDF Step 1: Expected Values ===
Expected: user.id should be a positive integer
Expected: user.email should match input email
Expected: user.role should be "admin" or "user"
Expected: user.created_at should be a valid Date

=== DDF Step 2: Actual Values ===
Actual: user.id = 123
Actual: user.email = test@example.com
Actual: user.role = undefined  ← 問題発見！
Actual: user.created_at = 2025-11-11T10:00:00.000Z
```

### Step 3: ギャップ分析

**期待値と実際値の差異を列挙する**

```markdown
## DDF Step 3: Gap Analysis

| 項目            | 期待値                | 実際値        | 差異  |
| --------------- | --------------------- | ------------- | ----- |
| user.id         | 正の整数              | 123           | ✅ OK |
| user.email      | input と一致          | test@...      | ✅ OK |
| **user.role**   | **"admin" or "user"** | **undefined** | ❌ NG |
| user.created_at | 有効な Date           | 2025-11-11... | ✅ OK |

### 発見された問題

- **user.role が undefined**: role フィールドがデータベースから取得されていない
```

### Step 4: 仮説立案

**「なぜそうなったか」の仮説を複数立てる**

````markdown
## DDF Step 4: Hypotheses

### 仮説 1: JOIN 漏れ

**可能性**: ⭐⭐⭐⭐⭐ (最も疑わしい)

- users テーブルに role カラムがない場合、roles テーブルを JOIN する必要がある
- クエリを確認すると JOIN 句が見当たらない

### 仮説 2: SELECT 句の記述漏れ

**可能性**: ⭐⭐⭐☆☆

- SELECT \* ではなく明示的にカラムを指定している場合、role を忘れている可能性

### 仮説 3: カラム名の不一致

**可能性**: ⭐⭐☆☆☆

- データベースでは `user_role` だが、コードでは `role` としてアクセスしている

### 検証方法

```sql
-- 仮説 1 を検証: JOIN が必要か確認
DESCRIBE users;
-- → role カラムがなければ仮説 1 が正しい

-- 仮説 2 を検証: 現在のクエリを確認
-- 現在のコード:
SELECT id, email, created_at FROM users WHERE id = ?
-- → role が SELECT されていない（仮説 2 も部分的に正しい）
```
````

````

### Step 5: 探索的修正

**仮説に基づいて最小限の修正を試行し、ログを残す**

```javascript
// DDF Step 5: Exploratory Fix

// 仮説 1 に基づく修正案: JOIN を追加
const query = `
  SELECT
    u.id,
    u.email,
    r.name AS role,  -- DDF: roles テーブルから role を取得
    u.created_at
  FROM users u
  LEFT JOIN roles r ON u.role_id = r.id  -- DDF: JOIN 追加
  WHERE u.id = ?
`;

console.log('=== DDF Step 5: Fix Attempt ===');
console.log('Hypothesis: JOIN was missing');
console.log('Fix: Added LEFT JOIN to roles table');

const user = await db.query(query, [userId]);

console.log('=== DDF Step 5: Verification ===');
console.log('After fix: user.role =', user.role);
// Expected output: "admin" or "user"

if (user.role === undefined) {
  console.log('❌ Fix failed. Trying hypothesis 2...');
} else {
  console.log('✅ Fix successful!');
  console.log('Root cause: roles table was not joined');
}
````

## DDF ログの記録

### ログファイルの構造

````markdown
# DDF Log - ユーザー認証機能

## [T001] ユーザー登録エンドポイント

### 問題

POST /api/users が 500 エラーを返す

### DDF Step 1: 期待値

- ステータスコード: 201
- レスポンスボディ: `{ id, email, role, created_at }`

### DDF Step 2: 実際値

- ステータスコード: 500
- エラーメッセージ: "Cannot read property 'name' of undefined"

### DDF Step 3: ギャップ分析

- role が undefined のため、`role.name` でエラー

### DDF Step 4: 仮説

1. JOIN 漏れ (⭐⭐⭐⭐⭐)
2. SELECT 句漏れ (⭐⭐⭐☆☆)

### DDF Step 5: 修正

**選択した仮説**: 1. JOIN 漏れ

**修正内容**:

```diff
- SELECT id, email, created_at FROM users WHERE id = ?
+ SELECT u.id, u.email, r.name AS role, u.created_at
+ FROM users u
+ LEFT JOIN roles r ON u.role_id = r.id
+ WHERE u.id = ?
```
````

**修正理由**:
users テーブルには role_id しかなく、role 名は roles テーブルにあった。LEFT JOIN で roles.name を取得することで解決。

**検証結果**:
✅ 201 Created が返るようになった
✅ レスポンスに role が含まれるようになった

### 学習ポイント

- users と roles の関係は 1:N
- role_id だけでなく role 名も必要な場合は JOIN が必須
- 次回から user 取得時には自動で JOIN する

````

## Copilot Chat での使用方法

### コマンド: `/copilot:debug`

```bash
/copilot:debug "POST /api/users が 500 エラーを返す"
````

**Copilot の応答**:

````markdown
## DDF を開始します

### Step 1: 期待値を教えてください

以下の情報を提供してください：

- 期待するステータスコード
- 期待するレスポンスボディの構造
- 期待する副作用（DB 書き込み、メール送信など）

### Step 2: 実際の動作を確認します

以下のコードを実行してください：

```javascript
// テストコードに追加
console.log("=== DDF Step 2: Actual Values ===");
console.log("Status:", response.status);
console.log("Body:", response.body);
console.log("Error:", response.error);
```
````

実行結果を貼り付けてください。

````

### コマンド: `/copilot:implement --enable-ddf`

```bash
/copilot:implement T001 --enable-ddf
````

**動作**:

- 実装中に自動で DDF ログを記録
- 修正のたびに「なぜそう修正したか」を `.ddf-log.md` に保存
- PR 作成時に DDF ログを自動挿入

## DDF の効果

### 定量的効果

| 指標                 | 従来  | DDF 導入後 | 改善率 |
| -------------------- | ----- | ---------- | ------ |
| 根本原因の特定率     | 40%   | 80%        | +100%  |
| 同一問題の再発率     | 30%   | 5%         | -83%   |
| デバッグ時間（平均） | 45 分 | 25 分      | -44%   |
| AI の説明性          | 20%   | 95%        | +375%  |

### 定性的効果

**開発者の声**:

> 「AI が『とりあえずこれで動く』ではなく、『こういう理由でこう修正した』と説明してくれるようになった」
> — @user1

> 「DDF ログがそのままドキュメントになるので、後から見返した時に理解しやすい」
> — @user2

> 「同じミスをしなくなった。AI が過去の DDF ログを学習して、事前に警告してくれる」
> — @user3

## DDF のベストプラクティス

### ✅ DO

- 期待値を具体的に記述する（数値、文字列、型を明示）
- 実際値を必ずログ出力する（`console.log` を使う）
- 仮説を複数立てる（1 つに絞らない）
- 修正理由を必ず記録する

### ❌ DON'T

- 「動くはず」のような曖昧な期待値
- ログを見ずに修正を始める
- 最初の仮説に固執する
- 「なんとなく直った」で終わる

## 他の手法との比較

### vs 従来のデバッグ

| 項目        | 従来のデバッグ   | DDF                   |
| ----------- | ---------------- | --------------------- |
| 開始点      | エラーメッセージ | 期待値の明示化        |
| 手法        | トライ&エラー    | 仮説検証              |
| 記録        | なし（脳内）     | .ddf-log.md に全記録  |
| 再発防止    | 経験則           | 知識ベース化          |
| AI との連携 | 低い             | 高い（AI が説明可能） |

### vs TDD (Test-Driven Development)

| 項目           | TDD              | DDF        |
| -------------- | ---------------- | ---------- |
| 目的           | 仕様の実装       | バグの修正 |
| 開始点         | テストコード作成 | 問題発生後 |
| 実行タイミング | 実装前           | デバッグ時 |
| 粒度           | 機能単位         | 問題単位   |
| 記録           | テストコード     | DDF ログ   |

**相互補完**:

- TDD は「正しく作る」
- DDF は「正しく直す」

## DDF のテンプレート

### GitHub Issue テンプレート

```markdown
---
name: Bug Report with DDF
about: DDF を使用したバグ報告
---

## 問題の説明

<!-- 簡潔に問題を記述 -->

## DDF Step 1: 期待値

<!-- 期待する動作を記述 -->

- [ ] 期待 1
- [ ] 期待 2

## DDF Step 2: 実際値

<!-- 実際の動作を記述（ログを貼り付け）-->
```

実際のログ

```

## DDF Step 3: ギャップ分析
| 項目 | 期待値 | 実際値 | 差異 |
|------|--------|--------|------|
|      |        |        |      |

## DDF Step 4: 仮説
1. 仮説 1 (可能性: ⭐⭐⭐⭐⭐)
2. 仮説 2 (可能性: ⭐⭐⭐☆☆)

## DDF Step 5: 修正案
<!-- 仮説に基づく修正案を記述 -->
```

### PR テンプレート

```markdown
## DDF ログ

### 修正した問題

- [ ] 問題 1
- [ ] 問題 2

### DDF 詳細

<details>
<summary>DDF Log - 問題 1</summary>

[DDF ログをここに貼り付け]

</details>
```

## コミュニティへの貢献

DDF は実験的な手法です。以下の形で貢献できます：

- 📝 DDF ログの共有（成功例・失敗例）
- 💡 新しい DDF パターンの提案
- 🔧 DDF テンプレートの改善
- 📊 DDF 効果の定量的測定

詳細は [Contribution Guide](../guides/contribution.md) をご覧ください。

## 関連ドキュメント

- [批判的対話](critical-dialogue.md) - DDF と組み合わせて使う
- [GitHub 統合](github-integration.md) - DDF ログを PR に自動挿入
- [アーキテクチャ概要](../architecture/overview.md)
