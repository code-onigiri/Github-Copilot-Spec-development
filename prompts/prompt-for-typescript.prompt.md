---
id: language-prompt
author: aggregation
language: typescript
version: 0.2.0
category: generation
source: github/awesome-copilot
license: MIT (upstream) / MIT (this repo)
origin_url: https://github.com/github/awesome-copilot
upstream_commit: 17a3ac59314178f4bf4880681dee7b043687a2c8
checksum: b765bc6ca9bc1f4020496f3e03f5f8b73db6e5afa541fa1da1494a5e7a47f056
examples_hash: 8ac088a18c25b3ad5738fb4b33b021878452bac94f7945cdd4ae8a7c346498a5
last_synced: 2025-11-12T00:00:00Z
---

# TypeScript MCP Server Generator

## Mission

`serverName`, `toolNames`, `promptName` から **型安全 (zod) + ツール/プロンプト登録 + テスト雛形** を備えた最小型 TypeScript MCP サーバーを生成せよ。

## Inputs

| name        | type     | required | description                                     |
| ----------- | -------- | -------- | ----------------------------------------------- |
| serverName  | string   | yes      | サーバー識別名                                  |
| toolNames   | string[] | yes      | 生成するツール名配列 (>=1)                      |
| promptName  | string   | yes      | 生成するプロンプト名                            |
| lintTool    | string   | no       | `eslint` / `biome` から選択 (default: `eslint`) |
| description | string   | no       | README 用概要                                   |

## Input Validation & Discovery

> **Source**: Integrated from [github/awesome-copilot prompt-builder.prompt.md](https://github.com/github/awesome-copilot/tree/main/prompts/prompt-builder.prompt.md)

Before generation, validate all inputs and clarify ambiguities:

1. **serverName Validation**:

   - Must be non-empty, lowercase, no spaces
   - Pattern: `^[a-z0-9\-]+$` (alphanumeric + hyphens only)
   - If invalid, halt and request valid name with examples

2. **toolNames Validation**:

   - Array must contain ≥1 element
   - Each tool name: non-empty, no duplicates, pattern `^[a-zA-Z][a-zA-Z0-9\-]*$`
   - If ambiguous (e.g., "user management" → "user-manager" or "manage-users"?), ask for clarification

3. **promptName Validation**:

   - Non-empty, kebab-case preferred
   - If missing semantic meaning (e.g., "test"), request descriptive name

4. **lintTool Selection**:

   - Default: `eslint` (if not specified)
   - Validate choice: must be `eslint` or `biome`
   - If user unsure, explain: "ESLint: mature ecosystem, extensive plugins; Biome: faster, all-in-one toolchain"

5. **description Validation**:
   - If empty or too vague (<10 words), request minimum 10-word description for README
   - Example clarification: "Brief description" → "Please provide at least 10 words describing server purpose, e.g., 'MCP server for managing user authentication and authorization with OAuth2 support'"

**Failure Trigger**: If any required input invalid after 2 clarification attempts, halt with detailed error message listing all validation failures.

## Codebase Consistency Check

> **Source**: Integrated from [github/awesome-copilot copilot-instructions-blueprint-generator.prompt.md](https://github.com/github/awesome-copilot/tree/main/prompts/copilot-instructions-blueprint-generator.prompt.md)

Before generating code, scan workspace for existing MCP servers and match their patterns:

1. **Search for Existing MCP Servers**:

   ```bash
   # Declare intent before tool use
   "Searching workspace for existing MCP server implementations to extract consistent patterns..."
   ```

   - Search for: `@modelcontextprotocol/sdk`, `server.ts`, `tools/`, `prompts/` directories
   - If found, analyze: package structure, error handling style, logging approach, test organization

2. **Extract Patterns**:

   - **Naming conventions**: camelCase vs kebab-case for tool/prompt names
   - **Error handling**: try-catch blocks, custom error classes, or zod safeParse
   - **Logging**: console.log vs winston/pino, log levels used
   - **Test organization**: describe blocks, test file naming (_.test.ts vs _.spec.ts)

3. **Apply Patterns to New Code**:

   - Match existing indentation style (2 spaces, 4 spaces, tabs)
   - Follow existing import ordering (stdlib → external → internal)
   - Use same dependency injection approach (constructor injection, factory functions)
   - Mirror existing file organization (flat vs nested directories)

4. **Never Introduce New Patterns**:
   - If codebase uses `.then()` chains, don't generate `async/await`
   - If codebase has no logger, don't add winston
   - If tests use Jest, don't generate Vitest (unless explicitly requested)

**Principle**: Consistency with existing codebase > external best practices.

## Tool Usage Declaration

> **Source**: Integrated from [github/awesome-copilot taming-copilot.instructions.md](https://github.com/github/awesome-copilot/tree/main/instructions/taming-copilot.instructions.md)

Before executing any tool, declare intent with concise statement immediately preceding tool call:

1. **File Search**:

   - "Searching workspace for existing TypeScript MCP server patterns..."
   - Tool: `search/codebase` with pattern `**/*.ts` + `@modelcontextprotocol/sdk`

2. **File Creation**:

   - "Creating TypeScript MCP server at src/server.ts with tool handlers for: ${toolNames.join(', ')}..."
   - Tool: `edit/createFile` with path `src/server.ts`

3. **Lint Validation**:

   - "Running lint validation with ${lintTool} (zero tolerance mode)..."
   - Tool: `runCommands` with `npm run lint -- --max-warnings=0` (ESLint) or `npm run lint` (Biome)

4. **Test Execution**:
   - "Executing test suite with Vitest to verify tool handlers and input validation..."
   - Tool: `runCommands` with `npm test -- --coverage`

**Purposeful Action Rule**: Every tool invocation must directly fulfill user request. Never search/modify unrelated files.

## Workflow

1. Validate: 空/重複/スペースのみ → エラー。
2. ディレクトリ: `src/server.ts` / `src/tools/*` / `src/prompts/*` / `tests/*`。
3. `package.json` 生成 (deps: typescript, ts-node, @modelcontextprotocol/sdk, zod, vitest)。
4. `tsconfig.json` 生成 (ESNext, strict: すべてのストリクトフラグ有効)。
5. Lint 設定生成:
   - `lintTool=eslint` → `.eslintrc.json` (typescript-eslint, strict rules, no-unused-vars error)
   - `lintTool=biome` → `biome.json` (linter.enabled, recommended + strict, formatter)
6. server 初期化関数 `createServer()` → tool/prompt 登録。
7. 各 tool: zod schema + typed handler + error wrap。
8. prompt: mission コメント + args schema + structuredContent 返却。
9. テスト: greet 正常 / missing field 失敗。
10. README excerpt 追加 (run/test/lint コマンド)。
11. Markdown セクション化出力。

## Output

- File Tree
- package.json
- tsconfig.json
- .eslintrc.json (lintTool=eslint) OR biome.json (lintTool=biome)
- src/server.ts
- src/tools/<tool>.ts (複数)
- src/prompts/<prompt>.ts
- tests/server.test.ts
- README excerpt

## Validation

### Required Checks

- toolNames 長さ >=1
- 重複なし / invalid chars (`[^a-zA-Z0-9\-]`)
- すべての handler が `Promise<...>` を返す
- zod parse 失敗例をテストに含む
- **Lint: `npm run lint` (eslint . --max-warnings=0 OR biome check .) がゼロエラー・ゼロ警告で終了必須**
- **Format: `npm run format:check` が diff 無し必須**
- **Style: Google TypeScript Style Guide 準拠 (2 space indent, single quotes, trailing commas)**

### Commands

```bash
npm run build         # TypeScript compilation must succeed
npm test              # All tests must pass with coverage >80%
npm run lint          # Zero errors/warnings (ESLint --max-warnings=0 or Biome)
npm run format:check  # No formatting diffs (prettier --check or biome format)
npm run type-check    # tsc --noEmit must pass
```

### Edge Cases

- Empty input → zod validation error with clear message
- Invalid tool name (spaces, special chars) → schema rejection
- Missing required field → ZodError with path info
- Large input (>10KB) → graceful error, no crash
- Concurrent requests → async handlers don't block each other

### Failure Modes

- **Type safety violation**: any 型の使用 → ESLint error `@typescript-eslint/no-explicit-any`
- **Unsafe operation**: unchecked Promise → ESLint error `@typescript-eslint/no-floating-promises`
- **Missing error handling**: try-catch 無し → runtime crash, test failure
- **Format violation**: Google Style deviation → prettier/biome format error

### Failure Triggers (Halt Generation)

> **Source**: Integrated from [github/awesome-copilot prompt.instructions.md Quality Assurance Checklist](https://github.com/github/awesome-copilot/tree/main/instructions/prompt.instructions.md)

Generation must halt immediately if any of the following occur:

1. **Input Validation Failures** (after 2 retry attempts):

   - serverName still contains spaces/uppercase after clarification
   - toolNames array empty or contains duplicates after correction
   - promptName remains semantically meaningless (e.g., "test", "tmp")

2. **Lint Errors Exceed Threshold** (after 3 auto-fix attempts):

   - `npm run lint` exits with >0 errors
   - Auto-fix with `npm run lint -- --fix` fails to resolve all issues
   - Biome check reports unfixable errors

3. **Type Safety Violations** (no retries, immediate halt):

   - `any` type detected in generated code (violates `@typescript-eslint/no-explicit-any`)
   - Unsafe type assertions (`as unknown as T`)
   - Missing return type annotations on exported functions

4. **Tool Access Denied** (no retries):

   - `search/codebase` permission denied
   - `edit/createFile` fails due to file system restrictions
   - `runCommands` blocked by security policy

5. **Test Failures** (after 3 fix attempts):

   - `npm test` exits with non-zero code
   - Coverage below 80% threshold (configurable)
   - Timeout errors (tests exceed 30s per suite)

6. **Validation Command Failures** (3 consecutive failures):
   - `npm run build` → TypeScript compilation errors persist
   - `npm run type-check` → tsc --noEmit reports type errors
   - `npm run format:check` → formatting diffs remain after auto-fix

**Error Reporting Format**:

```markdown
❌ **Generation Halted**

**Reason**: [Failure Trigger Category]
**Details**: [Specific error message with file:line references]
**Attempted Fixes**: [List of auto-fix commands executed]
**Manual Action Required**: [Step-by-step resolution guide]

**Context**:

- Input: serverName="${serverName}", toolNames=[${toolNames}]
- Lint Tool: ${lintTool}
- Retry Count: X/3
```

**Success Criteria** (all must pass):

- [ ] All input validations passed
- [ ] Lint errors = 0, warnings = 0
- [ ] Tests pass with coverage ≥80%
- [ ] Type checks pass (`tsc --noEmit`)
- [ ] Format checks pass (no diffs)
- [ ] All tool handlers return `Promise<T>`
- [ ] Zod schemas validate expected input/error cases

## File Tree

```text
src/
  server.ts
  tools/
    <toolName>.ts
  prompts/
    <promptName>.ts
tests/
  server.test.ts
package.json
tsconfig.json
README.md (excerpt)
```

## package.json

```json
{
  "name": "{{serverName}}",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "ts-node src/server.ts",
    "test": "vitest run",
    "lint": "{{#if lintTool === 'biome'}}biome check .{{else}}eslint . --ext .ts{{/if}}",
    "lint:fix": "{{#if lintTool === 'biome'}}biome check --apply .{{else}}eslint . --ext .ts --fix{{/if}}"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.1.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "ts-node": "^10.9.2",
    "vitest": "^1.0.0",
    "{{#if lintTool === 'biome'}}@biomejs/biome{{else}}eslint": "^8.57.0", "@typescript-eslint/eslint-plugin": "^7.0.0", "@typescript-eslint/parser": "^7.0.0{{/if}}": "^1.5.0"
  }
}
```

**Note**: 生成時に lintTool 分岐を実際の JSON に展開。

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## .eslintrc.json (lintTool=eslint)

```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/strict-boolean-expressions": "error",
    "no-console": ["warn", { "allow": ["error", "warn"] }],
    "quotes": ["error", "single"],
    "semi": ["error", "always"]
  }
}
```

## biome.json (lintTool=biome)

```json
{
  "$schema": "https://biomejs.dev/schemas/1.5.0/schema.json",
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": { "noUnusedVariables": "error" },
      "suspicious": { "noExplicitAny": "error" },
      "style": { "useConst": "error", "useTemplate": "error" }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "quoteStyle": "single"
  },
  "organizeImports": { "enabled": true }
}
```

## src/server.ts

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server";
import { z } from "zod";
import { registerTools } from "./tools";
import { registerPrompts } from "./prompts";

export function createServer() {
  const server = new McpServer({ name: "{{serverName}}", version: "0.1.0" });
  registerTools(server);
  registerPrompts(server);
  return server;
}

if (import.meta.main) {
  const server = createServer();
  server.listen().catch((e) => {
    console.error("[fatal]", e);
    process.exit(1);
  });
}
```

## src/tools/<tool>.ts (template)

```ts
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server";
export const inputSchema = z.object({ name: z.string().min(1) });
export function registerTools(server: McpServer) {
  server.tool("{{toolName}}", { input: inputSchema }, async ({ name }) => {
    return `Hello ${name}`;
  });
}
```

複数ツール対応案: 生成時に toolNames を map して同一 register 関数内に列挙。

## src/prompts/<prompt>.ts

```ts
import type { McpServer } from "@modelcontextprotocol/sdk/server";
import { z } from "zod";
const argsSchema = z.array(z.string()).min(1);
export function registerPrompts(server: McpServer) {
  server.prompt("{{promptName}}", {
    input: argsSchema,
    run: async (args) => ({
      type: "text",
      text: `Prompt(${args.length}): ${args.join(", ")}`,
    }),
  });
}
```

## tests/server.test.ts

```ts
import { describe, it, expect } from "vitest";
import { createServer } from "../src/server";

describe("tools", () => {
  it("greet ok", async () => {
    const srv = createServer();
    const out = await srv.invokeTool("{{toolName}}", { name: "Ada" });
    expect(out).toBe("Hello Ada");
  });
  it("greet validation error", async () => {
    const srv = createServer();
    await expect(
      srv.invokeTool("{{toolName}}", { name: "" })
    ).rejects.toThrow();
  });
});
```

## README Excerpt

```markdown
# {{serverName}}

## Run

npm install
npm run dev

## Test

npm test

## Lint

npm run lint
npm run lint:fix

## Style Guide

- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- Enforced via {{lintTool}} with zero-tolerance policy
```

## Examples

### Success: Tree

```text
src/server.ts
src/tools/{{toolName}}.ts
src/prompts/{{promptName}}.ts
tests/server.test.ts
```

### Failure: Empty toolNames

```
Error: toolNames required and must contain at least one name
```

### Failure: Validation

```
ZodError: [name] String must contain at least 1 character(s)
```

## Notes

- Zod により型/ランタイム検証統一。複雑型は `.refine()` で追加。
- 高頻度ツールは単独ファイル分離でコールドスタート回避。
- **Lint 必須**: CI/pre-commit で `npm run lint` 実行推奨。ESLint は type-aware rules、Biome は高速一体型。
- **Style 厳守**: Google TS Style (2 space, single quote, explicit return types for public APIs)。

## Attribution

- Upstream patterns: awesome-copilot TS server examples (MIT)
- Differences: vitest + strict config + multi-tool mapping
- License: MIT 継承
