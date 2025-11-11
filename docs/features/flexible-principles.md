# 柔軟な開発原則の選択

## 概要

Constitution を通じて、プロジェクトに最適な開発原則を自由に定義できます。TDD、SOLID、DDD など、チームが重視する原則を AI に従わせることで、一貫した品質とアーキテクチャを保証します。

## なぜ必要か？

### 問題：押し付けられた原則

従来の多くのフレームワークは、特定の開発手法を強制します：

```
「この仕様書フォーマットに従ってください」
「このアーキテクチャパターンを使ってください」
「このテスト戦略を採用してください」
```

結果：

- プロジェクトの文脈に合わない原則を押し付けられる
- チームの既存の開発文化と衝突
- 学習コストが高い（既に知っている原則が使えない）

### 解決：自由に原則を選ぶ

```
Constitution で原則を宣言 → AI が従う
```

あなたのチームが重視する原則を選び、AI に理解させることができます。

## コア機能

### 1. 原則のカスタマイズ

Constitution で任意の開発原則を定義できます。

#### 例：TDD を採用

```markdown
# .github/constitution.md

## Article 3: Test-Driven Development

### テストファースト

すべての機能は、テストを先に書いてから実装します。

**実装手順**:

1. 失敗するテストを書く（Red）
2. テストが通る最小限の実装（Green）
3. リファクタリング（Refactor）

**AI への指示**:

- 機能実装前に必ずテストコードを提案する
- テストが書けない設計を避ける
- カバレッジ 80%以上を維持
```

#### 例：SOLID 原則を採用

```markdown
# .github/constitution.md

## Article 4: SOLID Principles

### 単一責任の原則（SRP）

1 つのクラスは 1 つの責任のみを持ちます。

**判定基準**:

- クラスの変更理由が 2 つ以上ある場合は分割
- メソッド数が 10 を超える場合は責任を見直す

### オープン・クローズドの原則（OCP）

拡張に対して開いており、修正に対して閉じています。

**実装方針**:

- インターフェースを活用
- 継承よりコンポジションを優先
- Strategy パターン、Template Method パターンを活用

### リスコフの置換原則（LSP）

サブクラスは基底クラスと置き換え可能です。

**禁止事項**:

- 基底クラスの事前条件を強化しない
- 基底クラスの事後条件を弱化しない

### インターフェース分離の原則（ISP）

クライアントに不要なインターフェースを強制しません。

**設計指針**:

- 小さく特化したインターフェースを作る
- Fat Interface を避ける

### 依存性逆転の原則（DIP）

具象ではなく抽象に依存します。

**実装方針**:

- 依存性注入（DI）を活用
- インターフェースに対してプログラミング
```

#### 例：ドメイン駆動設計（DDD）を採用

```markdown
# .github/constitution.md

## Article 5: Domain-Driven Design

### ユビキタス言語

コードとドキュメントで同じ用語を使用します。

**ルール**:

- ドメインエキスパートが使う用語をそのまま採用
- クラス名、メソッド名、変数名に業務用語を使用
- 技術用語と業務用語を混在させない

### 境界づけられたコンテキスト

ドメインを独立したコンテキストに分割します。

**構造**:
```

src/
├── contexts/
│ ├── authentication/ # 認証コンテキスト
│ ├── billing/ # 請求コンテキスト
│ └── inventory/ # 在庫コンテキスト

````

### エンティティと値オブジェクト

**エンティティ**: 一意な識別子を持つオブジェクト
**値オブジェクト**: 不変で等価性で判断されるオブジェクト

**実装例**:

```typescript
// エンティティ
class User {
  constructor(
    private readonly id: UserId, // 識別子
    private name: UserName
  ) {}
}

// 値オブジェクト
class UserName {
  constructor(private readonly value: string) {
    if (value.length < 1 || value.length > 50) {
      throw new Error('Invalid user name');
    }
  }

  equals(other: UserName): boolean {
    return this.value === other.value;
  }
}
````

### 集約

トランザクション境界を明確にします。

**ルール**:

- 集約ルート経由でのみ内部エンティティにアクセス
- 1 トランザクションで 1 つの集約のみを変更

````

### 2. 原則のミックス

複数の原則を組み合わせることも可能です。

```markdown
# .github/constitution.md

## Article 1: Hybrid Approach

本プロジェクトは TDD + SOLID + 関数型プログラミングを組み合わせます。

### テストファースト（TDD）

すべての機能はテスト駆動で開発します。

### SOLID 原則

オブジェクト指向設計は SOLID 原則に従います。

### 関数型プログラミング

ビジネスロジックは純粋関数で実装します。

**実装例**:

```typescript
// テストファースト
describe('calculateDiscount', () => {
  it('should calculate 10% discount for premium users', () => {
    const result = calculateDiscount({ price: 1000, isPremium: true });
    expect(result).toBe(900);
  });
});

// 純粋関数（関数型）
function calculateDiscount(input: PriceInput): number {
  return input.isPremium ? input.price * 0.9 : input.price;
}

// 単一責任（SOLID）
class OrderService {
  constructor(
    private discountCalculator: DiscountCalculator,
    private orderRepository: OrderRepository
  ) {}

  createOrder(input: CreateOrderInput): Order {
    const discountedPrice = this.discountCalculator.calculate(input);
    return this.orderRepository.save({ ...input, price: discountedPrice });
  }
}
````

````

### 3. プロジェクト固有のルール

チーム独自の規約も定義できます。

```markdown
# .github/constitution.md

## Article 6: Team Conventions

### 命名規則

**ファイル名**:

- コンポーネント: PascalCase（UserProfile.tsx）
- ユーティリティ: camelCase（formatDate.ts）
- 定数: UPPER_SNAKE_CASE（API_BASE_URL.ts）

**変数名**:

- Boolean: is/has/can で始める（isActive, hasPermission）
- 配列: 複数形（users, products）
- 関数: 動詞で始める（getUser, createOrder）

### コードレビュー基準

**必須チェック項目**:

- [ ] テストカバレッジ 80%以上
- [ ] ESLint エラーゼロ
- [ ] TypeScript strict モード
- [ ] 1 ファイル 300 行以内
- [ ] 1 関数 50 行以内

### エラーハンドリング

**原則**:

- すべての async 関数は try-catch で囲む
- ユーザー向けエラーメッセージは日本語
- ログはすべて構造化（JSON）

**実装例**:

```typescript
async function fetchUser(id: string): Promise<Result<User, Error>> {
  try {
    const user = await api.get(`/users/${id}`);
    return { success: true, data: user };
  } catch (error) {
    logger.error({ message: 'Failed to fetch user', userId: id, error });
    return { success: false, error: new Error('ユーザー情報の取得に失敗しました') };
  }
}
````

````

## 使い方

### ステップ 1: Constitution を作成

`.github/constitution.md` に開発原則を記述します。

```bash
# Constitution テンプレートを生成
mkdir -p .github
cat > .github/constitution.md << 'EOF'
# Constitution

## Article 1: Test-Driven Development

すべての機能はテストを先に書いてから実装します。

## Article 2: SOLID Principles

### 単一責任の原則
1 つのクラスは 1 つの責任のみを持ちます。

### 依存性逆転の原則
具象ではなく抽象に依存します。

## Article 3: Naming Conventions

- ファイル名: PascalCase
- 変数名: camelCase
- 定数: UPPER_SNAKE_CASE
EOF
````

### ステップ 2: copilot-instructions.md で読み込み

````markdown
# .github/copilot-instructions.md

## Constitution

Before implementing any feature, load and follow the Constitution:

\```bash
cat .github/constitution.md
\```

**CRITICAL**: All code must comply with the principles defined in Constitution.
````

### ステップ 3: AI に従わせる

仕様作成時や実装時に、AI は自動的に Constitution を参照し、定義された原則に従います。

````
あなた: /copilot:spec ユーザー登録機能を作成してください

AI:
Constitution を確認しました。TDD、SOLID 原則、命名規則に従って仕様を作成します。

## 仕様書

### テスト（TDD に従う）

まず、以下のテストを作成します：

\```typescript
describe('UserRegistration', () => {
  it('should create a new user with valid input', () => { ... });
  it('should throw error if email is invalid', () => { ... });
});
\```

### 実装（SOLID に従う）

**単一責任の原則（SRP）**:
- UserRegistrationService: ユーザー登録のみを担当
- EmailValidator: メール検証のみを担当

**依存性逆転の原則（DIP）**:
- IUserRepository インターフェースに依存

\```typescript
class UserRegistrationService {
  constructor(
    private userRepository: IUserRepository,
    private emailValidator: EmailValidator
  ) {}
}
\```
````

## メリット

### ✅ チームの文化を尊重

既に実践している開発手法をそのまま使えます。

### ✅ 学習コスト削減

新しいフレームワークの原則を学ぶ必要がありません。

### ✅ 一貫性の保証

AI がすべてのコードで同じ原則を適用します。

### ✅ 柔軟性

プロジェクトの成長に合わせて原則を追加・修正できます。

### ✅ ドキュメントとコードの一致

Constitution がチームの開発ガイドラインとして機能します。

## サンプル Constitution

### シンプル版（最小限）

```markdown
# Constitution

## Article 1: Keep It Simple

複雑な設計を避け、シンプルに保ちます。

## Article 2: Test Everything

すべての機能にテストを書きます。

## Article 3: DRY Principle

同じコードを繰り返しません。
```

### 標準版（バランス型）

```markdown
# Constitution

## Article 1: Test-Driven Development

すべての機能はテストを先に書いてから実装します。

## Article 2: SOLID Principles

### 単一責任の原則

1 つのクラスは 1 つの責任のみを持ちます。

### 依存性逆転の原則

具象ではなく抽象に依存します。

## Article 3: Functional Core, Imperative Shell

ビジネスロジックは純粋関数で実装。副作用は Shell 層に限定。

## Article 4: Naming Conventions

- ファイル名: PascalCase
- 変数名: camelCase
- 関数名: 動詞で始める
```

### 完全版（エンタープライズ）

```markdown
# Constitution

## Article 1: Domain-Driven Design

ドメインモデルを中心に設計します。

### ユビキタス言語

コードとドキュメントで同じ用語を使用します。

### 境界づけられたコンテキスト

ドメインを独立したコンテキストに分割します。

## Article 2: Hexagonal Architecture

アプリケーションをレイヤーに分割します：

- Domain: ビジネスロジック（純粋）
- Application: ユースケース
- Infrastructure: 外部システム連携

## Article 3: Test Strategy

### Unit Test

すべてのビジネスロジックをテスト（カバレッジ 80%以上）。

### Integration Test

主要なユースケースをテスト。

### E2E Test

クリティカルパスをテスト。

## Article 4: Code Quality Standards

- TypeScript strict モード
- ESLint Airbnb 準拠
- 1 ファイル 300 行以内
- 1 関数 50 行以内
- 循環的複雑度 10 以下

## Article 5: Security First

- すべての入力をバリデーション
- SQL インジェクション対策（Prepared Statement）
- XSS 対策（サニタイズ）
- 認証・認可を必須化
```

## 原則の選び方

### 個人プロジェクト

- **シンプル版** を推奨
- TDD + 命名規則程度で OK

### 小規模チーム（2-5 人）

- **標準版** を推奨
- TDD + SOLID + 命名規則

### 中〜大規模チーム（5 人以上）

- **完全版** を推奨
- DDD + Hexagonal Architecture + 品質基準

## よくある質問

### Q: 原則を途中で変更できますか？

はい、可能です。Constitution は Git で管理されており、チームで合意すれば自由に変更できます。

### Q: 複数の原則が矛盾する場合は？

Constitution 内で優先順位を明記してください：

```markdown
## Article 10: Conflict Resolution

原則が矛盾する場合、以下の優先順位で判断します：

1. セキュリティ
2. パフォーマンス
3. 可読性
4. DRY
```

### Q: フレームワーク独自の原則はありますか？

いいえ、ありません。すべての原則をあなたが自由に定義できます。

ただし、以下の基本原則は推奨します：

- **Simplicity First**: 複雑な設計を避ける
- **Test-Driven**: テストを書く
- **Document Decisions**: 意思決定を記録する

## 次のステップ

- [Constitution サンプル集](./constitution-examples.md)
- [TDD 実践ガイド](./tdd-guide.md)
- [SOLID 原則の適用例](./solid-examples.md)
- [DDD 入門](./ddd-introduction.md)

## 関連リンク

- [三層記憶アーキテクチャ](./triple-memory.md) - Constitution の詳細
- [批判的対話](./critical-dialogue.md) - 原則の適用を AI に提案させる
- [Getting Started](../guides/getting-started.md) - 最初の Constitution を作る
