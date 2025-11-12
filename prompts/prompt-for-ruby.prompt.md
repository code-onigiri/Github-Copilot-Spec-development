id: language-prompt
author: aggregation
language: ruby
version: 0.2.0
category: generation
source: github/awesome-copilot
license: MIT (upstream) / MIT (this repo)
origin_url: https://github.com/github/awesome-copilot
upstream_commit: 17a3ac59314178f4bf4880681dee7b043687a2c8
checksum: cad87061b170fc1e6b0e3aae67079011b7c857740622cffedc3ff2c496d81516
examples_hash: 1c20a357186a5aa01cdae56ff4e406f6081a4dcb142c089ef6f95162a169848d
last_synced: 2025-11-12T00:00:00Z

# Ruby MCP Server Generator

## Mission

与えられた `gem_name` と名前群から **class-based MCP::Tool/Prompt + server context 注入 + RSpec テスト** を備えた最小 Ruby MCP サーバー骨格を生成せよ。

## Inputs

| name        | type   | required | description           |
| ----------- | ------ | -------- | --------------------- |
| gem_name    | string | yes      | gem 名称 (snake_case) |
| tool_name   | string | yes      | 生成ツール名          |
| prompt_name | string | yes      | 生成プロンプト名      |
| description | string | no       | 概要                  |

## Input Validation & Discovery

> **Source**: Integrated from github/awesome-copilot prompt-builder.prompt.md

Before generation, validate all inputs and clarify ambiguities:

1. **gem_name Validation**:

   - Must match `^[a-z][a-z0-9_]*$` (snake_case)
   - No spaces, must be valid Ruby gem name
   - If invalid, halt and request valid example (e.g., my_mcp_server)

2. **tool_name Validation**:

   - Non-empty, starts with a letter, only alphanumeric and underscores
   - If ambiguous, ask for clarification

3. **prompt_name Validation**:

   - Non-empty, snake_case preferred
   - If missing semantic meaning, request descriptive name

4. **description Validation**:
   - If empty or too vague (<10 words), request minimum 10-word description for README

**Failure Trigger**: If any required input invalid after 2 clarification attempts, halt with detailed error message listing all validation failures.

## Codebase Consistency Check

> **Source**: Integrated from github/awesome-copilot copilot-instructions-blueprint-generator.prompt.md

Before generating code, scan workspace for existing Ruby MCP servers and match their patterns:

1. **Search for Existing MCP Servers**:

   - Declare intent before tool use: "Searching workspace for existing Ruby MCP server implementations to extract consistent patterns..."
   - Search for: Gemfile, lib/server.rb, tools, prompts, resources
   - If found, analyze: module structure, error handling style, logging approach, test organization

2. **Extract Patterns**:

   - Naming conventions: snake_case for files, classes, methods
   - Error handling: MCP::Error, raise/rescue
   - Logging: puts vs logger, log levels used
   - Test organization: RSpec, test file naming

3. **Apply Patterns to New Code**:

   - Match existing indentation style (2 spaces vs tabs)
   - Follow require ordering (stdlib → external → internal)
   - Use same error propagation approach
   - Mirror file organization (flat vs nested)

4. **Never Introduce New Patterns**:
   - If codebase uses puts, don't add logger
   - If tests use RSpec, don't generate Minitest

**Principle**: Consistency with existing codebase > external best practices.

## Tool Usage Declaration

> **Source**: Integrated from github/awesome-copilot taming-copilot.instructions.md

Before executing any tool, declare intent with concise statement immediately preceding tool call:

1. **File Search**:

   - "Searching workspace for existing Ruby MCP server patterns..."
   - Tool: search/codebase with pattern `**/*.rb` + Gemfile

2. **File Creation**:

   - "Creating Ruby MCP server at lib/server.rb with handler for: ${tool_name}..."
   - Tool: edit/createFile with path lib/server.rb

3. **Lint Validation**:

   - "Running lint validation with rubocop (zero tolerance mode)..."
   - Tool: runCommands with `bundle exec rubocop`

4. **Test Execution**:
   - "Executing test suite with RSpec to verify handlers and input validation..."
   - Tool: runCommands with `bundle exec rspec`

**Purposeful Action Rule**: Every tool invocation must directly fulfill user request. Never search/modify unrelated files.

## Workflow

## Workflow

1. Validate: gem*name が `^[a-z]a-z0-9*]\*$` パターン。
2. ファイルツリー定義: Gemfile / lib / spec。
3. `Gemfile` 生成: mcp gem (仮想), logger, rspec。
4. `lib/server.rb`: MCP::Server 初期化, tool/prompt/resource 登録。
5. `lib/tools/greet_tool.rb`: MCP::Tool 継承, input schema, call メソッド。
6. `lib/tools/calculate_tool.rb`: divide by zero → MCP::Error.invalid_params。
7. `lib/prompts/code_review_prompt.rb`: MCP::Prompt 継承, validation。
8. `lib/resources/example_resource.rb`: subscribe/unsubscribe 例。
9. テスト: `spec/tools/greet_tool_spec.rb` (success / bad_request), `spec/tools/calculate_tool_spec.rb` (divide by zero)。
10. README Excerpt (bundle exec ruby lib/server.rb / rspec)。
11. すべて Markdown セクション化し出力。

## Output

- File Tree
- Gemfile
- lib/server.rb
- lib/tools/greet_tool.rb
- lib/tools/calculate_tool.rb
- lib/prompts/code_review_prompt.rb
- lib/resources/example_resource.rb
- spec/tools/greet_tool_spec.rb
- spec/tools/calculate_tool_spec.rb
- README excerpt

## Validation

### Required Checks

- gem_name 不正時: 明示エラー
- Tool で nil/empty input → raise MCP::Error.bad_request
- Divide by zero → raise MCP::Error.invalid_params("divide_by_zero")
- テスト必須: expect { }.to raise_error(MCP::Error)
- ハッシュキー snake_case 統一
- **Lint: `bundle exec rubocop` がゼロ offense 必須**
- **Format: `bundle exec rubocop -a` で自動整形**
- **Style: [Ruby Style Guide](https://rubystyle.guide/) 準拠 (2 space, snake_case, frozen_string_literal)**

### Commands

```bash
bundle install               # Dependencies install
bundle exec rspec            # All tests pass
bundle exec rubocop          # Zero offenses (MethodLength <=15, AbcSize <=20)
bundle exec rubocop -a       # Auto-correct offenses
simplecov                    # Coverage report (aim >90%)
```

### Edge Cases

- Missing `frozen_string_literal: true` → RuboCop error
- Method length >15 lines → RuboCop Metrics/MethodLength offense
- ABC complexity >20 → RuboCop Metrics/AbcSize offense
- Missing class/module documentation → RuboCop Style/Documentation offense
- Debugger statement (`binding.pry`) → RuboCop Lint/Debugger offense

### Failure Modes

- **Long method**: 15 行超過 → Metrics/MethodLength offense
- **High complexity**: ABC >20 → Metrics/AbcSize offense
- **Missing doc**: class without comment → Style/Documentation offense
- **Variable naming**: camelCase 変数 → Naming/VariableNumber offense

### Failure Triggers (Halt Generation)

> **Source**: Integrated from github/awesome-copilot prompt.instructions.md Quality Assurance Checklist

Generation must halt immediately if any of the following occur:

1. **Input Validation Failures** (after 2 retry attempts):

   - gem_name still invalid after clarification
   - tool_name empty or invalid after correction
   - prompt_name remains semantically meaningless

2. **Lint Errors Exceed Threshold** (after 3 auto-fix attempts):

   - rubocop run exits with >0 offenses

3. **Type Safety Violations** (no retries, immediate halt):

   - long method, high complexity, missing doc, variable naming

4. **Tool Access Denied** (no retries):

   - search/codebase permission denied
   - edit/createFile fails due to file system restrictions
   - runCommands blocked by security policy

5. **Test Failures** (after 3 fix attempts):

   - rspec exits with non-zero code
   - Coverage below threshold
   - Timeout errors (tests exceed 30s per suite)

6. **Validation Command Failures** (3 consecutive failures):
   - bundle install fails
   - rubocop -a reports offenses after auto-fix

**Error Reporting Format**:

```markdown
❌ **Generation Halted**

**Reason**: [Failure Trigger Category]
**Details**: [Specific error message with file:line references]
**Attempted Fixes**: [List of auto-fix commands executed]
**Manual Action Required**: [Step-by-step resolution guide]

**Context**:

- Input: gem_name="${gem_name}", tool_name="${tool_name}", prompt_name="${prompt_name}"
- Retry Count: X/3
```

**Success Criteria** (all must pass):

- [ ] All input validations passed
- [ ] Lint errors = 0
- [ ] Tests pass
- [ ] rubocop -a reports no offenses
- [ ] No long method, high complexity, missing doc, variable naming
- [ ] All error cases covered in tests

## Project Structure

```text
<gem_name>/
	Gemfile
	lib/
		server.rb
		tools/
			greet_tool.rb
			calculate_tool.rb
		prompts/
			code_review_prompt.rb
		resources/
			example_resource.rb
	spec/
		tools/
			greet_tool_spec.rb
			calculate_tool_spec.rb
	README.md (excerpt)
```

## Gemfile (Template)

```ruby
source 'https://rubygems.org'
gem 'logger'
# gem 'mcp', '~> 0.1.0' # Pseudo MCP SDK
group :test do
	gem 'rspec', '~> 3.12'
end
```

## lib/server.rb

```ruby
require 'logger'
require_relative 'tools/greet_tool'
require_relative 'tools/calculate_tool'
require_relative 'prompts/code_review_prompt'
require_relative 'resources/example_resource'

logger = Logger.new(STDOUT)
logger.info "Starting MCP server: {{gem_name}}"

# Pseudo server registration
# server = MCP::Server.new(name: '{{gem_name}}', version: '0.1.0')
# server.register_tool GreetTool.new
# server.register_tool CalculateTool.new
# server.register_prompt CodeReviewPrompt.new
# server.register_resource ExampleResource.new
# server.start

logger.info "Server ready"
```

## lib/tools/greet_tool.rb

```ruby
class GreetTool # < MCP::Tool
	def name; 'greet'; end
	def input_schema
		{ type: 'object', properties: { name: { type: 'string' } }, required: [:name] }
	end
	def call(input)
		name = input[:name] || input['name']
		raise ArgumentError, 'bad_request: name required' if name.nil? || name.empty?
		{ message: "Hello #{name}" }
	end
end
```

## lib/tools/calculate_tool.rb

```ruby
class CalculateTool # < MCP::Tool
	def name; 'calculate'; end
	def input_schema
		{ type: 'object', properties: { a: { type: 'number' }, b: { type: 'number' }, op: { type: 'string' } }, required: [:a, :b, :op] }
	end
	def call(input)
		a = input[:a] || input['a']
		b = input[:b] || input['b']
		op = input[:op] || input['op']
		raise ArgumentError, 'bad_request' if a.nil? || b.nil? || op.nil?
		case op
		when 'add' then { result: a + b }
		when 'divide'
			raise ArgumentError, 'divide_by_zero' if b.zero?
			{ result: a.to_f / b }
		else
			raise ArgumentError, 'unknown_op'
		end
	end
end
```

## lib/prompts/code_review_prompt.rb

```ruby
class CodeReviewPrompt # < MCP::Prompt
	def name; 'code_review'; end
	def args_schema
		{ type: 'object', properties: { language: { type: 'string' }, code: { type: 'string' } }, required: [:language, :code] }
	end
	def generate(args)
		lang = args[:language] || args['language']
		code = args[:code] || args['code']
		raise ArgumentError, 'bad_request: language+code required' if lang.nil? || code.nil?
		"Review for #{lang}: #{code.length} chars"
	end
end
```

## lib/resources/example_resource.rb

```ruby
class ExampleResource # < MCP::Resource
	def uri; 'files://project'; end
	def subscribe
		# Yield updates
		['file://update1', 'file://update2']
	end
	def unsubscribe
		# Cleanup
	end
end
```

## spec/tools/greet_tool_spec.rb

```ruby
require 'rspec'
require_relative '../../lib/tools/greet_tool'

RSpec.describe GreetTool do
	let(:tool) { GreetTool.new }

	it 'greets successfully' do
		result = tool.call(name: 'Ada')
		expect(result[:message]).to eq('Hello Ada')
	end

	it 'raises bad_request when name missing' do
		expect { tool.call({}) }.to raise_error(ArgumentError, /bad_request/)
	end
end
```

## spec/tools/calculate_tool_spec.rb

```ruby
require 'rspec'
require_relative '../../lib/tools/calculate_tool'

RSpec.describe CalculateTool do
	let(:tool) { CalculateTool.new }

	it 'divides successfully' do
		result = tool.call(a: 10, b: 2, op: 'divide')
		expect(result[:result]).to eq(5.0)
	end

	it 'raises divide_by_zero' do
		expect { tool.call(a: 10, b: 0, op: 'divide') }.to raise_error(ArgumentError, /divide_by_zero/)
	end
end
```

## README Excerpt

```markdown
# Ruby MCP Server

## Run

bundle exec ruby lib/server.rb

## Test

bundle exec rspec

## Lint & Format

bundle exec rubocop
bundle exec rubocop -a # auto-fix

## Style Guide

- [Ruby Style Guide](https://rubystyle.guide/)
- Enforced via RuboCop (all cops enabled)
```

## Examples

### Success Tree

```text
lib/tools/
	greet_tool.rb
	calculate_tool.rb
lib/prompts/
	code_review_prompt.rb
```

### Failure: Invalid gem_name

```
Error: gem_name must be snake_case
```

### Failure: divide by zero

```
ArgumentError: divide_by_zero
```

## Notes

- Class-based DSL: 継承で標準インターフェース保証。
- Context injection: server instance を initialize で渡す拡張可。
- Symbol/String key 互換: hash fetch で統一推奨。
- **RuboCop 必須**: `.rubocop.yml` で `Style/FrozenStringLiteralComment: enabled`, `Metrics/LineLength: 120` 推奨。
- **frozen_string_literal**: 全ファイル先頭に `# frozen_string_literal: true` 追加必須。

## Attribution

- Upstream inspiration: awesome-copilot Ruby examples (MIT)
- Differences: class-based tool/prompt structure + RSpec matchers + resource example
- License: MIT 継承
