# C++ Best Practices

このプロンプトはモダン C++ (C++17/20/23) における高品質で安全かつ効率的なコードを書くための指針を提供します。

## Core Principles

### RAII とリソース管理

- すべてのリソース (メモリ, ファイル, ソケット, ミューテックス) をオブジェクトの寿命に束縛
- `new/delete` を直接使わずスマートポインタ (`std::unique_ptr`, `std::shared_ptr`) を利用
- 例外安全: コンストラクタで獲得しデストラクタで解放

```cpp
// ✅ Correct: RAII による自動解放
class File {
    std::FILE* handle_;
public:
    explicit File(const char* path, const char* mode) : handle_(std::fopen(path, mode)) {
        if (!handle_) throw std::runtime_error("open failed");
    }
    ~File(){ if (handle_) std::fclose(handle_); }
    File(const File&) = delete;
    File& operator=(const File&) = delete;
    std::FILE* get() const { return handle_; }
};
```

### 安全なメモリ管理

- 原則: 所有権は `unique_ptr`、共有は最小限に `shared_ptr`
- 観測のみ: `std::span`, `std::string_view`
- 生ポインタは所有権を持たない参照に限定

```cpp
std::unique_ptr<Foo> makeFoo(){ return std::make_unique<Foo>(); }
void use(const Foo* foo); // 所有権なし
```

### Const Correctness

- 可能な限り `const` を付与し意図を明確化
- メソッドは状態を変更しない場合 `const` 指定

```cpp
class Point { int x_, y_; public:
    Point(int x,int y):x_(x),y_(y){}
    int x() const { return x_; }
    void move(int dx,int dy){ x_+=dx; y_+=dy; }
};
```

### モダン C++ 機能活用

- 範囲ベース for, 構造化束縛, `std::optional`, `std::variant`, `std::filesystem`
- C++20: `concepts` でテンプレート制約 / `ranges` で可読性向上
- C++23: `std::expected` による明示的エラー処理

```cpp
std::expected<int,std::string> parseInt(std::string_view s){
    try { return std::stoi(std::string{s}); }
    catch(const std::exception& e){ return std::unexpected(e.what()); }
}
```

### 例外とエラー処理

- 失敗は例外、状態的失敗/期待されるエラーは `expected` / `optional`
- 例外は回復可能箇所で捕捉しメッセージを整形
- 例外を握りつぶさない

```cpp
try { doWork(); }
catch(const std::exception& e){ logError(e.what()); throw; }
```

### 並行性

- 共有状態最小化、データレース回避
- `std::thread` より高レベル抽象: `std::async`, タスク並列, `std::jthread`
- ミューテックスは `std::lock_guard` / `std::scoped_lock`

```cpp
std::mutex m; int counter = 0;
void inc(){ std::lock_guard lk(m); ++counter; }
```

## Code Organization

### 推奨プロジェクト構成

```
project/
  include/        # 公開ヘッダ (.hpp)
  src/            # 実装 (.cpp)
  tests/          # テスト
  CMakeLists.txt  # ビルド設定
  cmake/          # 追加モジュール
```

### ヘッダ設計

- ヘッダは最小限の依存 (前方宣言活用)
- `#pragma once` または二重インクルードガード
- インターフェースと実装分離

## 言語特有パターン

### PImpl イディオム

```cpp
class Widget {
public:
    Widget();
    ~Widget();
    void doWork();
private:
    struct Impl; // 前方宣言
    std::unique_ptr<Impl> impl_;
};
```

### 移動セマンティクス

```cpp
class Buffer {
    std::vector<char> data_;
public:
    Buffer() = default;
    Buffer(Buffer&&) noexcept = default;
    Buffer& operator=(Buffer&&) noexcept = default;
};
```

## Error Handling

### `expected` パターン

```cpp
std::expected<Result,Error> run();
if(auto r = run(); r) { use(*r); } else { handle(r.error()); }
```

## Testing

- フレームワーク: GoogleTest / Catch2
- 単体テストは小さい範囲・振る舞い重視

```cpp
#include <gtest/gtest.h>
TEST(PointTest, Move){ Point p(0,0); p.move(1,2); EXPECT_EQ(1,p.x()); }
```

## Performance Optimization

### 代表的テクニック

- コピーよりムーブ、不要な仮想関数回避
- `reserve` / `emplace` による割当最適化
- プロファイリング優先: `perf`, `heaptrack`

```cpp
std::vector<int> v; v.reserve(1000);
for(int i=0;i<1000;++i) v.emplace_back(i);
```

## Common Patterns

### Strategy

```cpp
struct SortStrategy { virtual ~SortStrategy()=default; virtual void sort(std::vector<int>&)=0; };
struct QuickSort : SortStrategy { void sort(std::vector<int>& v) override {/*...*/} };
```

## Common Pitfalls to Avoid

### Anti-Patterns

- ❌ `new`/`delete` の直接使用乱用
- ❌ マクロで関数ロジックを記述
- ❌ 例外をキャッチして無視
- ❌ グローバル可変状態の氾濫

### Best Practices

- ✅ スマートポインタと RAII
- ✅ constexpr / const の徹底
- ✅ 明確な所有権モデル
- ✅ 依存を最小化したヘッダ

## Resources

- [cppreference](https://en.cppreference.com/w/) - 標準リファレンス
- [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/) - 推奨指針
- [GoogleTest](https://github.com/google/googletest) - テスト
