id: mcp-server-generator
author: aggregation
language: csharp
version: 0.2.0
category: generation
source: github/awesome-copilot
license: MIT (upstream) / MIT (this repo)
origin_url: https://github.com/github/awesome-copilot
upstream_commit: 17a3ac59314178f4bf4880681dee7b043687a2c8
checksum: 2b1827c7595ec882efaa4eebc5ecc1cb063083ba601086eff4fcd35e2a3e4a38
examples_hash: 7a856d579b469d45ab748db81bd6f25a6a11332b0ac7fe067a01a501ced53711
last_synced: 2025-11-12T00:00:00Z

# C# MCP Server Generator

## Mission

与えられた `projectName` と名前群から **async Task + DI (IServiceCollection) + Tool/Prompt attributes + xUnit テスト** を備えた最小 C# MCP サーバー骨格を生成せよ。

## Inputs

| name        | type   | required | description                 |
| ----------- | ------ | -------- | --------------------------- |
| projectName | string | yes      | プロジェクト名 (PascalCase) |
| toolName    | string | yes      | 生成ツール名                |
| promptName  | string | yes      | 生成プロンプト名            |
| description | string | no       | 概要                        |

## Input Validation & Discovery

> **Source**: Integrated from github/awesome-copilot prompt-builder.prompt.md

Before generation, validate all inputs and clarify ambiguities:

1. **projectName Validation**:

   - Must match `^[A-Z][a-zA-Z0-9]*$` (PascalCase)
   - No spaces, must be valid C# project name
   - If invalid, halt and request valid example (e.g., MyMcpServer)

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

Before generating code, scan workspace for existing C# MCP servers and match their patterns:

1. **Search for Existing MCP Servers**:

   - Declare intent before tool use: "Searching workspace for existing C# MCP server implementations to extract consistent patterns..."
   - Search for: .csproj, Program.cs, Tools, Prompts, Tests
   - If found, analyze: project structure, error handling style, logging approach, test organization

2. **Extract Patterns**:

   - Naming conventions: PascalCase for classes, camelCase for methods
   - Error handling: ArgumentException, custom exceptions
   - Logging: Console.WriteLine vs ILogger, log levels used
   - Test organization: xUnit, test file naming

3. **Apply Patterns to New Code**:

   - Match existing indentation style (4 spaces vs tabs)
   - Follow import ordering (stdlib → external → internal)
   - Use same dependency injection approach
   - Mirror file organization (flat vs nested)

4. **Never Introduce New Patterns**:
   - If codebase uses Console.WriteLine, don't add ILogger
   - If tests use xUnit, don't generate NUnit

**Principle**: Consistency with existing codebase > external best practices.

## Tool Usage Declaration

> **Source**: Integrated from github/awesome-copilot taming-copilot.instructions.md

Before executing any tool, declare intent with concise statement immediately preceding tool call:

1. **File Search**:

   - "Searching workspace for existing C# MCP server patterns..."
   - Tool: search/codebase with pattern `**/*.cs` + .csproj

2. **File Creation**:

   - "Creating C# MCP server at Program.cs with handler for: ${toolName}..."
   - Tool: edit/createFile with path Program.cs

3. **Lint Validation**:

   - "Running lint validation with dotnet format/roslyn analyzers (zero tolerance mode)..."
   - Tool: runCommands with `dotnet format --verify-no-changes` and analyzers

4. **Test Execution**:
   - "Executing test suite with xUnit to verify handlers and input validation..."
   - Tool: runCommands with `dotnet test`

**Purposeful Action Rule**: Every tool invocation must directly fulfill user request. Never search/modify unrelated files.

## Workflow

## Workflow

1. Validate: projectName が `^[A-Z][a-zA-Z0-9]*$` パターン。
2. ファイルツリー定義: .csproj / Program.cs / Tools / Prompts / Tests。
3. `.csproj` 生成: .NET 8+, Microsoft.Extensions.DependencyInjection, Microsoft.Extensions.Logging, xUnit。
4. `Program.cs`: DI コンテナ構築, tool/prompt 登録, サーバー起動。
5. `Tools/GreetTool.cs`: async Task<string> + [Tool] attribute 例。
6. `Tools/CalculateTool.cs`: divide by zero → ArgumentException。
7. `Prompts/CodeReviewPrompt.cs`: async Task<string> + validation。
8. テスト: `GreetToolTests.cs` (success / badRequest), `CalculateToolTests.cs` (divide by zero)。
9. README Excerpt (dotnet run / dotnet test)。
10. すべて Markdown セクション化し出力。

## Output

- File Tree
- ProjectName.csproj
- Program.cs
- Tools/GreetTool.cs
- Tools/CalculateTool.cs
- Prompts/CodeReviewPrompt.cs
- Tests/GreetToolTests.cs
- Tests/CalculateToolTests.cs
- README excerpt

## Validation

### Required Checks

- projectName 不正時: 明示エラー
- Tool handler で null/empty input → throw ArgumentException("bad_request")
- Divide by zero → throw DivideByZeroException
- テスト必須: Assert.Throws<T>
- public メンバーに XML summary コメント
- **Lint: `dotnet format --verify-no-changes` がゼロ diff 必須**
- **Analyzer: Roslyn analyzers (StyleCop/FxCop) がゼロ warning 必須**
- **Style: [C# Coding Conventions](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions) 準拠**

### Commands

```bash
dotnet build                          # Compilation succeeds
dotnet test                           # All xUnit tests pass
dotnet format --verify-no-changes     # No formatting diffs
dotnet build /warnaserror             # Treat all warnings as errors
dotnet tool run dotnet-reportgenerator # Coverage report (aim >80%)
```

### Edge Cases

- Null reference → use nullable reference types (`string?`), not `!` suppression
- Async void → compiler warns, use `async Task` instead
- LINQ deferred execution → `.ToList()` if immediate evaluation needed
- Culture-dependent formatting → CA1305 warns, use `InvariantCulture`

### Failure Modes

- **Missing accessibility**: public なし → dotnet_style_require_accessibility_modifiers error
- **Unused private member**: → IDE0051 error
- **CA1062**: Null check 欠如 → FxCop error, validate parameters
- **CA1822**: Static にできる → FxCop suggests making static

### Failure Triggers (Halt Generation)

> **Source**: Integrated from github/awesome-copilot prompt.instructions.md Quality Assurance Checklist

Generation must halt immediately if any of the following occur:

1. **Input Validation Failures** (after 2 retry attempts):

   - projectName still invalid after clarification
   - toolName empty or invalid after correction
   - promptName remains semantically meaningless

2. **Lint Errors Exceed Threshold** (after 3 auto-fix attempts):

   - dotnet format/analyzers run exits with >0 errors

3. **Type Safety Violations** (no retries, immediate halt):

   - missing accessibility, unused private member, CA1062, CA1822

4. **Tool Access Denied** (no retries):

   - search/codebase permission denied
   - edit/createFile fails due to file system restrictions
   - runCommands blocked by security policy

5. **Test Failures** (after 3 fix attempts):

   - dotnet test exits with non-zero code
   - Coverage below threshold
   - Timeout errors (tests exceed 30s per suite)

6. **Validation Command Failures** (3 consecutive failures):
   - dotnet build reports compilation errors
   - dotnet format reports diffs after auto-fix

**Error Reporting Format**:

```markdown
❌ **Generation Halted**

**Reason**: [Failure Trigger Category]
**Details**: [Specific error message with file:line references]
**Attempted Fixes**: [List of auto-fix commands executed]
**Manual Action Required**: [Step-by-step resolution guide]

**Context**:

- Input: projectName="${projectName}", toolName="${toolName}", promptName="${promptName}"
- Retry Count: X/3
```

**Success Criteria** (all must pass):

- [ ] All input validations passed
- [ ] Lint errors = 0
- [ ] Tests pass
- [ ] dotnet format reports no diffs
- [ ] No missing accessibility, unused private member, CA1062, CA1822
- [ ] All error cases covered in tests

## Project Structure

```text
<projectName>/
  <projectName>.csproj
  Program.cs
  Tools/
	GreetTool.cs
	CalculateTool.cs
  Prompts/
	CodeReviewPrompt.cs
  Tests/
	GreetToolTests.cs
	CalculateToolTests.cs
  README.md (excerpt)
```

## ProjectName.csproj (Template)

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
	<OutputType>Exe</OutputType>
	<TargetFramework>net8.0</TargetFramework>
	<Nullable>enable</Nullable>
	<ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
  <ItemGroup>
	<PackageReference Include="Microsoft.Extensions.DependencyInjection" Version="8.0.0" />
	<PackageReference Include="Microsoft.Extensions.Logging" Version="8.0.0" />
	<PackageReference Include="Microsoft.Extensions.Logging.Console" Version="8.0.0" />
	<PackageReference Include="xunit" Version="2.6.0" />
	<PackageReference Include="xunit.runner.visualstudio" Version="2.5.0" />
  </ItemGroup>
</Project>
```

## Program.cs

```csharp
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using {{projectName}}.Tools;
using {{projectName}}.Prompts;

var services = new ServiceCollection();
services.AddLogging(builder => builder.AddConsole());
services.AddSingleton<GreetTool>();
services.AddSingleton<CalculateTool>();
services.AddSingleton<CodeReviewPrompt>();
var provider = services.BuildServiceProvider();
var logger = provider.GetRequiredService<ILogger<Program>>();
logger.LogInformation("Starting MCP server");
// Pseudo registration
// server.RegisterTool(provider.GetRequiredService<GreetTool>());
// server.RegisterTool(provider.GetRequiredService<CalculateTool>());
// server.RegisterPrompt(provider.GetRequiredService<CodeReviewPrompt>());
// await server.RunAsync();
logger.LogInformation("Server stopped");
```

## Tools/GreetTool.cs

```csharp
namespace {{projectName}}.Tools;

/// <summary>Greet tool</summary>
public class GreetTool
{
	/// <summary>Greets a user by name</summary>
	public async Task<string> ExecuteAsync(Dictionary<string, object?> input)
	{
		if (!input.TryGetValue("name", out var nameObj) || nameObj is not string name || string.IsNullOrWhiteSpace(name))
			throw new ArgumentException("bad_request: name required");
		await Task.Delay(1); // Simulate async
		return $"Hello {name}";
	}
}
```

## Tools/CalculateTool.cs

```csharp
namespace {{projectName}}.Tools;

/// <summary>Calculate tool</summary>
public class CalculateTool
{
	/// <summary>Performs arithmetic operation</summary>
	public async Task<double> ExecuteAsync(Dictionary<string, object?> input)
	{
		if (!input.TryGetValue("a", out var aObj) || aObj is not double a)
			throw new ArgumentException("bad_request: a required");
		if (!input.TryGetValue("b", out var bObj) || bObj is not double b)
			throw new ArgumentException("bad_request: b required");
		if (!input.TryGetValue("op", out var opObj) || opObj is not string op)
			throw new ArgumentException("bad_request: op required");
		await Task.Delay(1);
		return op switch
		{
			"add" => a + b,
			"divide" when b == 0 => throw new DivideByZeroException("divide_by_zero"),
			"divide" => a / b,
			_ => throw new ArgumentException("unknown_op")
		};
	}
}
```

## Prompts/CodeReviewPrompt.cs

```csharp
namespace {{projectName}}.Prompts;

/// <summary>Code review prompt</summary>
public class CodeReviewPrompt
{
	/// <summary>Generates code review</summary>
	public async Task<string> ExecuteAsync(Dictionary<string, object?> args)
	{
		if (!args.TryGetValue("language", out var langObj) || langObj is not string lang)
			throw new ArgumentException("bad_request: language required");
		if (!args.TryGetValue("code", out var codeObj) || codeObj is not string code)
			throw new ArgumentException("bad_request: code required");
		await Task.Delay(1);
		return $"Review for {lang}: {code.Length} chars";
	}
}
```

## Tests/GreetToolTests.cs

```csharp
using Xunit;
using {{projectName}}.Tools;

public class GreetToolTests
{
	[Fact]
	public async Task ExecuteAsync_Ok()
	{
		var tool = new GreetTool();
		var result = await tool.ExecuteAsync(new() { ["name"] = "Ada" });
		Assert.Equal("Hello Ada", result);
	}

	[Fact]
	public async Task ExecuteAsync_BadRequest()
	{
		var tool = new GreetTool();
		var ex = await Assert.ThrowsAsync<ArgumentException>(() => tool.ExecuteAsync(new()));
		Assert.Contains("bad_request", ex.Message);
	}
}
```

## Tests/CalculateToolTests.cs

```csharp
using Xunit;
using {{projectName}}.Tools;

public class CalculateToolTests
{
	[Fact]
	public async Task ExecuteAsync_Divide_Ok()
	{
		var tool = new CalculateTool();
		var result = await tool.ExecuteAsync(new() { ["a"] = 10.0, ["b"] = 2.0, ["op"] = "divide" });
		Assert.Equal(5.0, result);
	}

	[Fact]
	public async Task ExecuteAsync_DivideByZero()
	{
		var tool = new CalculateTool();
		var ex = await Assert.ThrowsAsync<DivideByZeroException>(() =>
			tool.ExecuteAsync(new() { ["a"] = 10.0, ["b"] = 0.0, ["op"] = "divide" }));
		Assert.Contains("divide_by_zero", ex.Message);
	}
}
```

## README Excerpt

```markdown
# C# MCP Server

## Run

dotnet run

## Test

dotnet test

## Lint & Format

dotnet format --verify-no-changes
dotnet format # auto-fix

## Style Guide

- [C# Coding Conventions](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions)
- Enforced via dotnet format + Roslyn analyzers (StyleCop, FxCop)
```

## Examples

### Success Tree

```text
Tools/
  GreetTool.cs
  CalculateTool.cs
Prompts/
  CodeReviewPrompt.cs
```

### Failure: Invalid projectName

```
Error: projectName must be PascalCase
```

### Failure: divide by zero

```
DivideByZeroException: divide_by_zero
```

## Notes

- DI: 実運用で IOptions<T> + appsettings.json 統合推奨。
- Nullable: enable で null 安全性向上。
- Attribute 拡張: カスタム [Tool] attribute で自動登録可。
- **dotnet format 必須**: `.editorconfig` で `csharp_*` ルール設定推奨。
- **Roslyn analyzers**: .csproj に `<EnableNETAnalyzers>true</EnableNETAnalyzers>` 追加。

## Attribution

- Upstream inspiration: awesome-copilot C# examples (MIT)
- Differences: DI container + XML docs + xUnit pattern matching assertions
- License: MIT 継承
