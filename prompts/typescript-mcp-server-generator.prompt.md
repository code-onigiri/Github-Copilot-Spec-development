---
id: mcp-server-generator
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

- toolNames 長さ >=1
- 重複なし / invalid chars (`[^a-zA-Z0-9\-]`)
- すべての handler が `Promise<...>` を返す
- zod parse 失敗例をテストに含む
- **Lint: `npm run lint` がゼロエラー・ゼロ警告で終了必須**
- **Style: Google TypeScript Style Guide 準拠 (2 space indent, single quotes, trailing commas)**

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
