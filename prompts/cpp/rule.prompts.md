# C++ Coding Rules

このプロンプトは C++ の業界標準のコーディング規約と静的解析の設定をまとめます。

## Style Guide Compliance

- 原則として [Google C++ Style Guide](https://google.github.io/styleguide/cppguide.html) に準拠
- 例外が必要な場合はプロジェクトの `CONTRIBUTING.md` に明記

### Formatting

- インデント: 2 spaces (Google) もしくは 4 spaces をチームで固定
- 最大行長: 100〜120 桁
- ブレース: 関数・クラスは次行、制御構文は同一行
- `#include` はアルファベット順、<> と "" を分離

### clang-format 設定例

```yaml
# .clang-format
BasedOnStyle: Google
IndentWidth: 2
ColumnLimit: 100
DerivePointerAlignment: false
PointerAlignment: Left
SortIncludes: true
IncludeBlocks: Regroup
SpaceBeforeParens: ControlStatements
AllowShortFunctionsOnASingleLine: Empty
```

## Naming Conventions

- クラス/構造体/列挙体: `PascalCase` (例: `HttpClient`)
- 関数/メソッド: `lowerCamelCase` (例: `sendRequest`)
- 変数: `lower_case_with_underscores` (例: `max_size`)
- 定数/定数式: `kPascalCase` または `UPPER_SNAKE_CASE`
- テンプレートパラメータ: `PascalCase` (例: `typename T`)

## Code Quality - clang-tidy

### 推奨設定 (最小)

```yaml
# .clang-tidy
Checks: "-*,bugprone-*,performance-*,modernize-*,readability-*"
WarningsAsErrors: "bugprone-*,performance-*"
HeaderFilterRegex: "^(include|src)/"
FormatStyle: none
```

### Forbidden Practices

- ❌ `using namespace std;`
- ❌ 例外の握りつぶし `catch(...) {}`
- ❌ 生ポインタ所有
- ❌ マクロでのロジック実装 (定数/条件付きコンパイルのみ)

## エラーハンドリング標準

### 例外か `expected`/戻り値か

```cpp
// ✅ 予期しうる失敗は expected
std::expected<int,std::string> parse(std::string_view);

// ✅ リソース獲得や重大な異常は例外
struct Socket { Socket(); ~Socket(); };
```

## Testing Requirements

### GoogleTest Standards

- テストは `tests/` 配下、`*_test.cpp` 命名
- 最低 80% ステートメントカバレッジ (目標)
- テスト毎に前提条件/後片付けを明確化

```cpp
// tests/math_test.cpp
#include <gtest/gtest.h>
TEST(Math, Add){ EXPECT_EQ(2, add(1,1)); }
```

## Documentation Standards

### Doxygen 推奨

```cpp
/// Adds two integers.
/// \param a First value
/// \param b Second value
/// \return Sum of a and b
int add(int a, int b);
```

## CI/CD Requirements

```yaml
# .github/workflows/ci.yml
name: ci
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install deps
        run: sudo apt-get update && sudo apt-get install -y clang clang-tidy cmake ninja-build
      - name: Configure
        run: cmake -S . -B build -G Ninja -DCMAKE_BUILD_TYPE=Release
      - name: Build
        run: cmake --build build --config Release -- -k 0
      - name: Format check
        run: test -z "$(git ls-files | grep -E '\\.(h|hpp|cc|cpp)$' | xargs clang-format -style=file -n 2>&1)"
      - name: clang-tidy
        run: cmake --build build --target clang-tidy
      - name: Tests
        run: ctest --test-dir build --output-on-failure
```

## Code Review Checklist

- [ ] 所有権と寿命は明確か (RAII/スマートポインタ)
- [ ] 例外安全性は満たすか (basic/strong)
- [ ] インクルード依存は最小か (前方宣言)
- [ ] マルチスレッド安全性の検討があるか
- [ ] clang-format/clang-tidy は通過しているか

## Enforcement

これらの規約は以下で強制されます:

1. clang-format - フォーマットの自動化
2. clang-tidy - 静的解析と規約違反検出
