id: mcp-server-generator
author: aggregation
language: php
version: 0.2.0
category: generation
source: github/awesome-copilot
license: MIT (upstream) / MIT (this repo)
origin_url: https://github.com/github/awesome-copilot
upstream_commit: 17a3ac59314178f4bf4880681dee7b043687a2c8
checksum: 984143b507b9c735e6dc960e6bb6b7ad4263df47c5a00adcbd85f6bb2186d9bf
examples_hash: b84fa89afe655a68a4a2186a8b1e0d66ae15ace1934e66a7c9dcbfa029967c86
last_synced: 2025-11-12T00:00:00Z

# PHP MCP Server Generator

## Mission

与えられた `packageName` と名前群から **attribute-based 登録 + PSR-4 + strict_types + schema array + PHPUnit** を備えた最小 PHP MCP サーバー骨格を生成せよ。

## Inputs

| name        | type   | required | description                    |
| ----------- | ------ | -------- | ------------------------------ |
| packageName | string | yes      | composer package (vendor/name) |
| toolName    | string | yes      | 生成ツール名                   |
| promptName  | string | yes      | 生成プロンプト名               |
| description | string | no       | 概要                           |

## Workflow

1. Validate: `^[a-z0-9-]+\/[a-z0-9-]+$` (composer package)。
2. ファイルツリー定義: composer.json / src / tests。
3. `composer.json`: PSR-4 autoload, require php >=8.2, require-dev phpunit。
4. `src/Server.php`: prompt/tool 登録, run() 実装 (疑似)。
5. `src/Tools/GreetTool.php`: schema array + invoke() + 例外。
6. `src/Tools/CalculateTool.php`: divide by zero → InvalidArgumentException。
7. `src/Prompts/CodeReviewPrompt.php`: args 検証 + 出力。
8. `tests/GreetToolTest.php`: 成功/失敗, `tests/CalculateToolTest.php`: divide by zero。
9. README Excerpt (composer install / phpunit)。
10. すべて Markdown セクション化し出力。

## Output

- File Tree
- composer.json
- src/Server.php
- src/Tools/GreetTool.php
- src/Tools/CalculateTool.php
- src/Prompts/CodeReviewPrompt.php
- tests/GreetToolTest.php
- tests/CalculateToolTest.php
- README excerpt

## Validation

- packageName 不正 → エラー。
- strict_types=1 を全ファイル先頭に。
- 未定義キーアクセスで Notice を出さない実装 (null 合体 / ??)
- 例外は InvalidArgumentException に統一 (bad_request/unknown_op など)
- **Lint: `vendor/bin/phpcs --standard=PSR12` がゼロ error 必須**
- **Static: `vendor/bin/phpstan analyse --level=max` がゼロ error 必須**
- **Style: [PSR-12](https://www.php-fig.org/psr/psr-12/) 準拠 (4 space, declare(strict_types=1))**

## Project Structure

```text
<package>/
	composer.json
	src/
		Server.php
		Tools/
			GreetTool.php
			CalculateTool.php
		Prompts/
			CodeReviewPrompt.php
	tests/
		GreetToolTest.php
		CalculateToolTest.php
	README.md (excerpt)
```

## composer.json (Template)

```json
{
  "name": "{{packageName}}",
  "type": "project",
  "require": { "php": ">=8.2" },
  "autoload": { "psr-4": { "App\\": "src/" } },
  "require-dev": { "phpunit/phpunit": "^10" },
  "scripts": { "test": "phpunit" }
}
```

## src/Server.php

```php
<?php declare(strict_types=1);
namespace App;
use App\Tools\GreetTool; use App\Tools\CalculateTool; use App\Prompts\CodeReviewPrompt;
final class Server {
	public function run(): void {
		// Pseudo registration
		$greet = new GreetTool();
		$calc  = new CalculateTool();
		$prompt = new CodeReviewPrompt();
		// server->registerTool($greet) ...
	}
}
```

## src/Tools/GreetTool.php

```php
<?php declare(strict_types=1);
namespace App\Tools;
final class GreetTool {
	public function schema(): array { return [
		'type' => 'object', 'properties' => ['name' => ['type' => 'string']], 'required' => ['name']
	]; }
	public function __invoke(array $input): string {
		$name = $input['name'] ?? null;
		if ($name === null || $name === '') throw new \InvalidArgumentException('bad_request: name required');
		return "Hello $name";
	}
}
```

## src/Tools/CalculateTool.php

```php
<?php declare(strict_types=1);
namespace App\Tools;
final class CalculateTool {
	public function __invoke(array $input): float {
		$a = isset($input['a']) ? (float)$input['a'] : throw new \InvalidArgumentException('bad_request: a required');
		$b = isset($input['b']) ? (float)$input['b'] : throw new \InvalidArgumentException('bad_request: b required');
		$op = $input['op'] ?? throw new \InvalidArgumentException('bad_request: op required');
		return match($op){
			'add' => $a + $b,
			'divide' => $b == 0.0 ? throw new \InvalidArgumentException('divide_by_zero') : $a / $b,
			default => throw new \InvalidArgumentException('unknown_op')
		};
	}
}
```

## src/Prompts/CodeReviewPrompt.php

```php
<?php declare(strict_types=1);
namespace App\Prompts;
final class CodeReviewPrompt {
	public function __invoke(array $args): string {
		$lang = $args['language'] ?? null;
		$code = $args['code'] ?? null;
		if ($lang === null || $code === null) throw new \InvalidArgumentException('bad_request: language+code required');
		return "Review for $lang: ".strlen($code)." chars";
	}
}
```

## tests/GreetToolTest.php

```php
<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;
use App\Tools\GreetTool;
final class GreetToolTest extends TestCase {
	public function testOk(): void {
		$tool = new GreetTool();
		$this->assertSame('Hello Ada', $tool(['name' => 'Ada']));
	}
	public function testBadRequest(): void {
		$tool = new GreetTool();
		$this->expectException(InvalidArgumentException::class);
		$this->expectExceptionMessage('bad_request');
		$tool([]);
	}
}
```

## tests/CalculateToolTest.php

```php
<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;
use App\Tools\CalculateTool;
final class CalculateToolTest extends TestCase {
	public function testDivideOk(): void {
		$tool = new CalculateTool();
		$this->assertSame(5.0, $tool(['a'=>10,'b'=>2,'op'=>'divide']));
	}
	public function testDivideByZero(): void {
		$tool = new CalculateTool();
		$this->expectException(InvalidArgumentException::class);
		$this->expectExceptionMessage('divide_by_zero');
		$tool(['a'=>10,'b'=>0,'op'=>'divide']);
	}
}
```

## README Excerpt

```markdown
# PHP MCP Server

## Install

composer install

## Test

vendor/bin/phpunit

## Lint & Static Analysis

vendor/bin/phpcs --standard=PSR12 src/ tests/
vendor/bin/phpcbf --standard=PSR12 src/ tests/ # auto-fix
vendor/bin/phpstan analyse --level=max src/

## Style Guide

- [PSR-12: Extended Coding Style](https://www.php-fig.org/psr/psr-12/)
- Enforced via PHP_CodeSniffer + PHPStan (max level)
```

## Examples

### Success Tree

```text
src/Tools/
	GreetTool.php
	CalculateTool.php
src/Prompts/
	CodeReviewPrompt.php
```

### Failure: Invalid packageName

```
Error: packageName must be vendor/name
```

### Failure: divide by zero

```
InvalidArgumentException: divide_by_zero
```

## Notes

- PSR-4: 名前空間とディレクトリ同期を厳守。
- strict_types: キャストとバリデーションで Notice/Warning を抑止。
- 例外語彙: bad_request / divide_by_zero / unknown_op を統一。
- Lint Config: `phpcs.xml.dist` で PSR-12 ルールセット指定、`phpstan.neon` で level max + strict rules 有効化。CI で composer lint & composer analyse を必須化。

## Attribution

- Upstream inspiration: awesome-copilot PHP examples (MIT)
- Differences: strict_types + match + PHPUnit 10 スタイル
- License: MIT 継承
