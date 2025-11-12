id: mcp-server-generator
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

- gem_name 不正時: 明示エラー
- Tool で nil/empty input → raise MCP::Error.bad_request
- Divide by zero → raise MCP::Error.invalid_params("divide_by_zero")
- テスト必須: expect { }.to raise_error(MCP::Error)
- ハッシュキー snake_case 統一
- **Lint: `bundle exec rubocop` がゼロ offense 必須**
- **Format: `bundle exec rubocop -a` で自動整形**
- **Style: [Ruby Style Guide](https://rubystyle.guide/) 準拠 (2 space, snake_case, frozen_string_literal)**

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
