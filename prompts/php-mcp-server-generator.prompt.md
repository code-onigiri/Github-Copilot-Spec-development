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

## Input Validation & Discovery

> **Source**: Integrated from github/awesome-copilot prompt-builder.prompt.md

Before generation, validate all inputs and clarify ambiguities:

1. **packageName Validation**:

   - Must match `^[a-z0-9-]+\/[a-z0-9-]+$` (composer package)
   - No spaces, must be valid PHP composer package name
   - If invalid, halt and request valid example (e.g., vendor/name)

2. **toolName Validation**:

   - Non-empty, starts with a letter, only alphanumeric and hyphens
   - If ambiguous, ask for clarification

3. **promptName Validation**:

   - Non-empty, kebab-case preferred
   - If missing semantic meaning, request descriptive name

4. **description Validation**:
   - If empty or too vague (<10 words), request minimum 10-word description for README

**Failure Trigger**: If any required input invalid after 2 clarification attempts, halt with detailed error message listing all validation failures.

## Codebase Consistency Check

> **Source**: Integrated from github/awesome-copilot copilot-instructions-blueprint-generator.prompt.md

Before generating code, scan workspace for existing PHP MCP servers and match their patterns:

1. **Search for Existing MCP Servers**:

   - Declare intent before tool use: "Searching workspace for existing PHP MCP server implementations to extract consistent patterns..."
   - Search for: composer.json, src/Server.php, Tools, Prompts, Tests
   - If found, analyze: module structure, error handling style, logging approach, test organization

2. **Extract Patterns**:

   - Naming conventions: PSR-4, camelCase for methods, kebab-case for files
   - Error handling: InvalidArgumentException, custom exceptions
   - Logging: echo vs logger, log levels used
   - Test organization: PHPUnit, test file naming

3. **Apply Patterns to New Code**:

   - Match existing indentation style (4 spaces vs tabs)
   - Follow require ordering (stdlib → external → internal)
   - Use same error propagation approach
   - Mirror file organization (flat vs nested)

4. **Never Introduce New Patterns**:
   - If codebase uses echo, don't add logger
   - If tests use PHPUnit, don't generate Codeception

**Principle**: Consistency with existing codebase > external best practices.

## Tool Usage Declaration

> **Source**: Integrated from github/awesome-copilot taming-copilot.instructions.md

Before executing any tool, declare intent with concise statement immediately preceding tool call:

1. **File Search**:

   - "Searching workspace for existing PHP MCP server patterns..."
   - Tool: search/codebase with pattern `**/*.php` + composer.json

2. **File Creation**:

   - "Creating PHP MCP server at src/Server.php with handler for: ${toolName}..."
   - Tool: edit/createFile with path src/Server.php

3. **Lint Validation**:

   - "Running lint validation with phpcs/phpstan (zero tolerance mode)..."
   - Tool: runCommands with `vendor/bin/phpcs --standard=PSR12 src/` and `vendor/bin/phpstan analyse --level=max src/`

4. **Test Execution**:
   - "Executing test suite with PHPUnit to verify handlers and input validation..."
   - Tool: runCommands with `vendor/bin/phpunit`

**Purposeful Action Rule**: Every tool invocation must directly fulfill user request. Never search/modify unrelated files.

## Workflow

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

### Required Checks

- packageName 不正 → エラー。
- strict_types=1 を全ファイル先頭に。
- 未定義キーアクセスで Notice を出さない実装 (null 合体 / ??)
- 例外は InvalidArgumentException に統一 (bad_request/unknown_op など)
- **Lint: `vendor/bin/phpcs --standard=PSR12` がゼロ error 必須 (警告もエラー扱い)**
- **Static: `vendor/bin/phpstan analyse --level=max` がゼロ error 必須**
- **Style: [PSR-12](https://www.php-fig.org/psr/psr-12/) 準拠 (4 space, declare(strict_types=1))**

### Commands

```bash
composer install                            # Dependencies install
vendor/bin/phpunit                          # All tests pass
vendor/bin/phpcs --standard=PSR12 src/      # Zero errors/warnings
vendor/bin/phpcbf --standard=PSR12 src/     # Auto-fix violations
vendor/bin/phpstan analyse --level=max src/ # Type safety, zero errors
```

### Edge Cases

- Missing `declare(strict_types=1)` → PHPStan error (implicit type coercion detected)
- Undefined array key → Notice, use `$arr['key'] ?? null`
- Mixed type → PHPStan level max error, explicit type hints required
- Nullable parameter without default → PHPStan error, add `= null`
- Always-true condition → PHPStan checkAlwaysTrueBooleanCondition error

### Failure Modes

- **Missing strict_types**: 型安全性低下 → PHPStan treatPhpDocTypesAsCertain detects
- **Line length >120**: → phpcs Generic.Files.LineLength error
- **Explicit mixed**: → PHPStan checkExplicitMixed error, use specific type
- **Missing callable signature**: → PHPStan checkMissingCallableSignature error

### Failure Triggers (Halt Generation)

> **Source**: Integrated from github/awesome-copilot prompt.instructions.md Quality Assurance Checklist

Generation must halt immediately if any of the following occur:

1. **Input Validation Failures** (after 2 retry attempts):

   - packageName still invalid after clarification
   - toolName empty or invalid after correction
   - promptName remains semantically meaningless

2. **Lint Errors Exceed Threshold** (after 3 auto-fix attempts):

   - phpcs/phpstan run exits with >0 errors

3. **Type Safety Violations** (no retries, immediate halt):

   - missing strict_types, line length, explicit mixed, missing callable signature

4. **Tool Access Denied** (no retries):

   - search/codebase permission denied
   - edit/createFile fails due to file system restrictions
   - runCommands blocked by security policy

5. **Test Failures** (after 3 fix attempts):

   - phpunit exits with non-zero code
   - Coverage below threshold
   - Timeout errors (tests exceed 30s per suite)

6. **Validation Command Failures** (3 consecutive failures):
   - composer install fails
   - phpcbf reports errors after auto-fix

**Error Reporting Format**:

```markdown
❌ **Generation Halted**

**Reason**: [Failure Trigger Category]
**Details**: [Specific error message with file:line references]
**Attempted Fixes**: [List of auto-fix commands executed]
**Manual Action Required**: [Step-by-step resolution guide]

**Context**:

- Input: packageName="${packageName}", toolName="${toolName}", promptName="${promptName}"
- Retry Count: X/3
```

**Success Criteria** (all must pass):

- [ ] All input validations passed
- [ ] Lint errors = 0
- [ ] Tests pass
- [ ] phpcbf reports no errors
- [ ] No missing strict_types, line length, explicit mixed, missing callable signature
- [ ] All error cases covered in tests

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
