# GitHub Integration（GitHub 統合）

## 概要

GitHub Copilot Chat を使用する開発者が、仕様作成から実装、レビュー、デプロイまでを GitHub エコシステム内で完結できるようにする機能群です。

## なぜ必要か

### 既存の問題

- **断片化されたワークフロー**: 仕様書は Google Docs、タスクは Jira、コードは GitHub と分散
- **手動作業の多さ**: 仕様 → Issue、実装 → PR の作成が手動
- **コンテキストロスト**: ツール間の移動で情報が失われる

### 私たちの解決策

GitHub を唯一の真実の源（Single Source of Truth）として、すべてのプロセスを統合します。

## 主要機能

### 1. 仕様 → GitHub Issue 自動作成

#### 動作フロー

```mermaid
graph LR
    A[/copilot:spec] --> B[spec.md 生成]
    B --> C[GitHub Issue 作成]
    C --> D[ラベル自動付与]
    D --> E[Projects 連携]
```

#### 生成される Issue の構造

```markdown
# [Feature] ユーザー認証機能

## Goal（ゴール）

問い合わせ件数を 30%削減するためのセルフサービス化

## Constraints（制約）

- Auth0 のみ使用
- 新規 DB テーブル作成不可
- API エンドポイントは 3 つ以内

## Reference（参考）

構成は Refund Spec（https://doc/123）の 5 節構成を厳密にコピー

## Tasks

- [ ] [T001] ユーザー登録エンドポイント実装
- [ ] [T002] ログイン機能実装
- [ ] [T003] パスワードリセット機能実装

## Related Files

- `.github/specs/user-auth/spec.md`
- `.github/specs/user-auth/design.md`
```

#### 実装詳細

```yaml
# .github/workflows/spec-to-issue.yml
name: Spec to Issue
on:
  push:
    paths:
      - ".github/specs/**/spec.md"

jobs:
  create-issue:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Parse Spec
        run: |
          # spec.md を解析して Issue 本文を生成
          node .github/scripts/parse-spec.js
      - name: Create Issue
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: process.env.SPEC_TITLE,
              body: process.env.SPEC_BODY,
              labels: ['spec', 'enhancement']
            })
```

### 2. タスク → GitHub Projects 連携

#### 自動カンバン管理

```
Backlog → To Do → In Progress → Review → Done
   ↑         ↑          ↑          ↑       ↑
   自動      自動        手動        自動     自動
```

#### Projects 設定

- **Backlog**: 仕様作成時に自動追加
- **To Do**: Issue がアサインされたら移動
- **In Progress**: PR が Draft として作成されたら移動
- **Review**: PR が Ready for Review になったら移動
- **Done**: PR がマージされたら移動

#### 実装例

```yaml
# .github/workflows/project-automation.yml
name: Project Board Automation
on:
  issues:
    types: [opened, assigned]
  pull_request:
    types: [opened, ready_for_review, closed]

jobs:
  update-board:
    runs-on: ubuntu-latest
    steps:
      - name: Add to Project
        uses: actions/add-to-project@v0.3.0
        with:
          project-url: https://github.com/users/YOUR_USER/projects/1
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### 3. 実装 → Pull Request 自動作成

#### DDF ログを含む PR 生成

````markdown
# [Implement] ユーザー認証機能

## 実装内容

タスク [T001], [T002], [T003] を実装しました。

## DDF ログ

### [T001] ユーザー登録エンドポイント

**期待値**:

```javascript
console.log("Expected: user.id should exist, email should match input");
```
````

**実際の動作**:

```javascript
console.log("Actual: user.id =", user.id, "email =", user.email);
```

**修正内容**:
email のバリデーションが抜けていたため、Joi スキーマに追加しました。

```diff
+ email: Joi.string().email().required()
```

## 批判的対話の記録

**AI の提案**:
「パスワードハッシュ化は bcrypt で実装します。
理由:

- セキュリティ: ソルト付きハッシュで rainbow table 攻撃を防ぐ
- 互換性: Node.js の標準的なライブラリ
- パフォーマンス: 10 rounds で十分な強度と速度のバランス」

**人間のフィードバック**:
「rounds は 12 にしてください（社内セキュリティ基準）」

**AI の修正**:
「承知しました。bcrypt の rounds を 12 に変更します」

## 関連 Issue

Closes #123

## チェックリスト

- [x] 仕様適合テスト通過
- [x] DDF ログ記録
- [x] 批判的対話の記録
- [x] ドキュメント更新

````

#### 自動生成スクリプト

```bash
# .github/scripts/create-pr.sh
#!/bin/bash

FEATURE_NAME=$1
SPEC_FILE=".github/specs/${FEATURE_NAME}/spec.md"
TASKS_FILE=".github/specs/${FEATURE_NAME}/tasks.md"
DDF_LOG=".github/specs/${FEATURE_NAME}/.ddf-log.md"
DIALOGUE_LOG=".github/specs/${FEATURE_NAME}/.dialogue-log.md"

# PR 本文を生成
cat > pr-body.md <<EOF
# [Implement] $(grep '^#' $SPEC_FILE | head -1 | sed 's/# //')

## 実装内容
$(cat $TASKS_FILE | grep '\[x\]')

## DDF ログ
$(cat $DDF_LOG)

## 批判的対話の記録
$(cat $DIALOGUE_LOG)

## 関連 Issue
Closes #$(gh issue list --label "spec:${FEATURE_NAME}" --json number -q '.[0].number')
EOF

# PR 作成
gh pr create \
  --title "[Implement] ${FEATURE_NAME}" \
  --body-file pr-body.md \
  --draft \
  --label "implementation"
````

### 4. GitHub Actions による検証

#### 仕様適合チェック

```yaml
# .github/workflows/spec-validation.yml
name: Spec Validation
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Check DDF Log Exists
        run: |
          FEATURE=$(echo ${{ github.head_ref }} | sed 's/implement\///')
          DDF_LOG=".github/specs/${FEATURE}/.ddf-log.md"

          if [ ! -f "$DDF_LOG" ]; then
            echo "::error::DDF ログが見つかりません"
            exit 1
          fi

      - name: Validate Spec Compliance
        run: |
          # spec.md に記載された要件を抽出
          # 実装コードがすべての要件を満たしているか確認
          node .github/scripts/validate-spec.js

      - name: Check Critical Dialogue
        run: |
          DIALOGUE_LOG=".github/specs/${FEATURE}/.dialogue-log.md"

          if ! grep -q "Goal:" $DIALOGUE_LOG; then
            echo "::warning::批判的対話に Goal が記録されていません"
          fi
```

### 5. Repository Context 認識

#### 既存設定の自動読み込み

Copilot Chat は `.github/` ディレクトリの既存設定を自動認識します：

```javascript
// .github/scripts/load-context.js
const fs = require("fs");
const path = require("path");

function loadRepositoryContext() {
  const context = {
    workflows: [],
    codeowners: null,
    templates: {},
    specs: [],
  };

  // GitHub Actions の読み込み
  const workflowsDir = ".github/workflows";
  if (fs.existsSync(workflowsDir)) {
    context.workflows = fs
      .readdirSync(workflowsDir)
      .filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"))
      .map((f) => path.join(workflowsDir, f));
  }

  // CODEOWNERS の読み込み
  const codeownersPath = ".github/CODEOWNERS";
  if (fs.existsSync(codeownersPath)) {
    context.codeowners = fs.readFileSync(codeownersPath, "utf8");
  }

  // Issue/PR テンプレートの読み込み
  ["ISSUE_TEMPLATE", "PULL_REQUEST_TEMPLATE"].forEach((dir) => {
    const templateDir = `.github/${dir}`;
    if (fs.existsSync(templateDir)) {
      context.templates[dir] = fs.readdirSync(templateDir);
    }
  });

  // 既存の spec の読み込み
  const specsDir = ".github/specs";
  if (fs.existsSync(specsDir)) {
    context.specs = fs.readdirSync(specsDir);
  }

  return context;
}

module.exports = { loadRepositoryContext };
```

## 導入方法

### ステップ 1: GitHub Actions の設定

```bash
mkdir -p .github/workflows
mkdir -p .github/scripts

# ワークフローファイルをコピー
cp templates/workflows/* .github/workflows/
cp templates/scripts/* .github/scripts/
```

### ステップ 2: GitHub Token の設定

```bash
# Repository Settings → Secrets and variables → Actions
# GITHUB_TOKEN は自動で利用可能
# Projects API を使う場合は PAT が必要

gh secret set PROJECT_TOKEN
```

### ステップ 3: Projects の作成

```bash
# GitHub Projects (Beta) でカンバンボードを作成
gh project create --owner @me --title "Spec-Driven Development"
```

## 使用例

### 基本的な使用フロー

```bash
# 1. 仕様作成（Copilot Chat で）
/copilot:spec "ユーザー認証機能を追加したい"

# 2. Issue が自動作成される（GitHub Actions）
# → https://github.com/USER/REPO/issues/123

# 3. 実装開始
git checkout -b implement/user-auth

# 4. DDF を記録しながら実装
/copilot:implement T001 --enable-ddf

# 5. PR 自動作成
git push origin implement/user-auth
# → GitHub Actions が Draft PR を作成

# 6. Ready for Review にする
gh pr ready

# 7. マージ後、Issue が自動クローズ
```

## 設定オプション

### `.github/copilot-sdd.yml`

```yaml
# GitHub 統合の設定
github:
  # Issue 作成の設定
  issues:
    enabled: true
    labels: ["spec", "enhancement"]
    assignees: auto # spec 作成者を自動アサイン

  # Projects 連携
  projects:
    enabled: true
    project_id: 1 # Projects ID
    auto_move: true # ステータス自動更新

  # PR 作成の設定
  pull_requests:
    enabled: true
    draft: true # 最初は Draft で作成
    require_ddf_log: true # DDF ログ必須
    require_dialogue_log: true # 批判的対話の記録必須

  # Actions による検証
  validation:
    enabled: true
    fail_on_missing_ddf: false # DDF なしでも通す
    fail_on_spec_mismatch: true # 仕様不適合はブロック
```

## トラブルシューティング

### Issue が自動作成されない

```bash
# GitHub Actions のログを確認
gh run list --workflow=spec-to-issue.yml
gh run view <run-id> --log

# 権限を確認
# .github/workflows/spec-to-issue.yml
permissions:
  issues: write
  contents: read
```

### Projects に自動追加されない

```bash
# PAT の scope を確認（project scope が必要）
# Settings → Developer settings → Personal access tokens
# - repo (full)
# - project (full)
```

## コミュニティからのフィードバック

> 「GitHub 統合により、Notion やドキュメントツールを行き来する必要がなくなった。すべてが GitHub で完結するのが素晴らしい」
> — @user1

> 「DDF ログが PR に自動で含まれるので、レビュアーがコンテキストを理解しやすい」
> — @user2

## 今後の展開

- [ ] GitHub Discussions との連携
- [ ] GitHub Packages への自動公開
- [ ] GitHub Pages へのドキュメント自動デプロイ
- [ ] GitHub Security Advisories との連携
- [ ] GitHub Sponsors による貢献者支援

## 関連ドキュメント

- [アーキテクチャ概要](../architecture/overview.md)
- [コマンドシステム](../architecture/command-system.md)
- [Getting Started](../guides/getting-started.md)
