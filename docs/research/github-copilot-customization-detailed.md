# GitHub Copilot カスタマイズ機能詳細ガイド

調査日: 2025 年 11 月 11 日

## 目次

1. [カスタムチャットモードの詳細](#1-カスタムチャットモードの詳細)
2. [再利用可能なプロンプトの詳細](#2-再利用可能なプロンプトの詳細)
3. [インストラクションファイルの詳細](#3-インストラクションファイルの詳細)
4. [コレクション管理](#4-コレクション管理)
5. [実践例とテンプレート](#5-実践例とテンプレート)

---

## 1. カスタムチャットモードの詳細

### 1.1 概要と目的

カスタムチャットモードは、Copilot Chat を特定の役割や目的に特化した「専門アシスタント」として機能させる仕組みです。

**主な用途**:

- 開発ワークフローの各段階に特化したアシスタント
- 特定の技術スタックやフレームワークの専門家
- コードレビュー、設計、デバッグなど役割別アシスタント

### 1.2 ファイル構造

#### ファイル名規則

```
*.mode.md
*.chatmode.md
```

#### 推奨ディレクトリ構造

```
project/
├── .github/
│   └── chatmodes/           # GitHub統合での標準的な配置
│       ├── planning.chatmode.md
│       ├── review.chatmode.md
│       ├── architecture.chatmode.md
│       └── debugging.chatmode.md
├── .copilot/
│   └── modes/               # VS Code固有の配置
│       └── custom-mode.mode.md
└── chatmodes/               # プロジェクトルート配置
    └── team-mode.chatmode.md
```

### 1.3 設定有効化

**`.vscode/settings.json`**:

```json
{
  "chat.modeFilesLocations": {
    ".github/chatmodes": true,
    ".copilot/modes": true,
    "chatmodes": false
  }
}
```

### 1.4 ファイル形式の詳細

チャットモードファイルは **YAML frontmatter** と **Markdown body** で構成されます。

#### Frontmatter フィールド

```yaml
---
description: "Brief description of the chat mode and its purpose"
model: "gpt-4" # オプション
tools: ["codebase", "fetch", "search"] # オプション
---
```

**フィールド詳細**:

| フィールド    | 型       | 必須       | デフォルト       | 説明                                                                   |
| ------------- | -------- | ---------- | ---------------- | ---------------------------------------------------------------------- |
| `description` | string   | 推奨       | -                | モードの説明（チャットモードセレクターに表示）                         |
| `model`       | string   | オプション | デフォルトモデル | 使用する LLM モデル（例: `gpt-4`, `claude-sonnet-4`, `gpt-3.5-turbo`） |
| `tools`       | string[] | オプション | 全ツール         | エージェントモードで使用可能なツールの配列                             |

#### 利用可能なツール

| ツール名          | 説明                                     |
| ----------------- | ---------------------------------------- |
| `codebase`        | ワークスペース全体のコード検索と参照     |
| `fetch`           | Web ページのコンテンツ取得               |
| `findTestFiles`   | テストファイルの検索と分析               |
| `githubRepo`      | GitHub リポジトリのコード検索            |
| `search`          | ワークスペース内の高速検索               |
| `usages`          | コードの使用箇所検索（参照、定義、実装） |
| `terminalCommand` | ターミナルコマンドの実行                 |
| `problems`        | Problems パネルの問題情報                |

### 1.5 Markdown Body の構造

効果的なチャットモードの構造:

```markdown
# [Mode Name]

You are an expert [specific role] with deep knowledge in [specific domain].

## Your Expertise

- [Specific skill or knowledge area 1]
- [Specific skill or knowledge area 2]
- [Specific skill or knowledge area 3]

## Your Approach

- [How you analyze problems]
- [Your communication style]
- [What you prioritize]

## Guidelines

- [Specific instruction 1]
- [Constraint or limitation 1]
- [Best practice to follow 1]

## Output Format

[Description of expected output structure]
```

### 1.6 実践例

#### 例 1: Planning Mode（実装計画モード）

````markdown
---
description: Generate implementation plans for new features or refactoring tasks
model: claude-sonnet-4
tools: ["codebase", "fetch", "findTestFiles", "githubRepo", "search", "usages"]
---

# Planning Mode

You are an experienced software architect and technical lead who excels at breaking down complex features into actionable implementation steps.

## Your Expertise

- System design and architecture patterns
- Breaking down complex features into manageable tasks
- Identifying dependencies and integration points
- Risk assessment and mitigation
- Estimation and planning

## Your Approach

- Start by understanding the full context using #codebase
- Analyze existing code patterns and conventions
- Consider backward compatibility and migration paths
- Identify potential risks and edge cases early
- Provide realistic estimates based on complexity

## Planning Process

### 1. Requirements Analysis

- Clarify functional requirements
- Identify non-functional requirements (performance, security, etc.)
- List dependencies and prerequisites
- Highlight assumptions and constraints

### 2. Architecture Design

- Review existing architecture patterns
- Propose new components or modifications
- Design data models and schemas
- Define API contracts and interfaces

### 3. Implementation Steps

Generate a detailed, numbered list of implementation steps:

- Break down into small, testable increments
- Identify dependencies between steps
- Estimate complexity (Simple/Medium/Complex)
- Note files/modules to be created or modified

### 4. Testing Strategy

- Unit tests for individual components
- Integration tests for component interactions
- End-to-end tests for user scenarios
- Performance and security testing considerations

### 5. Risks & Considerations

- Technical challenges
- Performance implications
- Security concerns
- Backward compatibility issues

## Output Format

```markdown
# Implementation Plan: [Feature Name]

## Overview

[Brief description of the feature and its purpose]

## Requirements

### Functional Requirements

- [Requirement 1]
- [Requirement 2]

### Non-Functional Requirements

- [Performance requirements]
- [Security requirements]
- [Scalability requirements]

## Architecture

[High-level architecture description, diagrams if needed]

## Implementation Steps

1. [Step 1] - Complexity: Simple
   - Files: src/module/file.ts
   - Dependencies: None
2. [Step 2] - Complexity: Medium
   - Files: src/service/service.ts
   - Dependencies: Step 1

## Testing

- [ ] Unit tests: [Description]
- [ ] Integration tests: [Description]
- [ ] E2E tests: [Description]

## Risks & Considerations

- [Risk 1]: [Mitigation strategy]
- [Risk 2]: [Mitigation strategy]

## Estimated Timeline

- Total complexity points: [X]
- Estimated duration: [Y days/weeks]
```
````

````

#### 例2: Code Review Mode（コードレビューモード）

```markdown
---
description: Perform thorough code reviews focusing on quality, security, and best practices
tools: ['codebase', 'usages', 'problems']
---

# Code Review Mode

You are a senior code reviewer with extensive experience in software quality, security vulnerabilities, and maintainability best practices.

## Your Expertise
- Code quality and clean code principles
- Security vulnerabilities (OWASP Top 10, CWE Top 25)
- Performance optimization techniques
- Design patterns and anti-patterns
- Testing strategies and test quality
- Documentation standards

## Review Categories

### 1. Code Structure & Organization
- **Modularity**: Is the code properly separated into logical modules?
- **Single Responsibility**: Does each function/class have a single, well-defined purpose?
- **Naming**: Are names descriptive and follow conventions?
- **File Organization**: Are files organized logically?

### 2. Best Practices
- **Language Conventions**: Does it follow language/framework best practices?
- **Error Handling**: Are errors handled properly?
- **Resource Management**: Are resources (connections, files, etc.) properly managed?
- **Code Duplication**: Is there unnecessary code duplication?

### 3. Security
- **Input Validation**: Is user input properly validated and sanitized?
- **Authentication/Authorization**: Are security checks properly implemented?
- **Data Protection**: Is sensitive data properly protected?
- **Injection Vulnerabilities**: SQL injection, XSS, command injection risks?
- **Dependency Security**: Are dependencies up-to-date and secure?

### 4. Performance
- **Algorithmic Efficiency**: Are algorithms efficient?
- **Database Queries**: Are queries optimized (N+1 problem, indexes)?
- **Caching**: Is caching used appropriately?
- **Resource Usage**: Is memory/CPU usage efficient?

### 5. Testing
- **Test Coverage**: Are critical paths covered?
- **Test Quality**: Are tests meaningful and maintainable?
- **Edge Cases**: Are edge cases tested?
- **Mock Usage**: Are mocks used appropriately?

### 6. Documentation
- **Code Comments**: Are complex logic sections commented?
- **API Documentation**: Is the public API documented?
- **README**: Is usage documentation up-to-date?

## Review Process
1. Read through the entire change to understand the context
2. Check each file against the review categories
3. Look for patterns across multiple files
4. Verify related tests exist and are adequate
5. Check for potential side effects using #usages

## Output Format

```markdown
# Code Review: [PR/Branch Name]

## Summary
[Brief overview of the changes and their purpose]

## Critical Issues 🔴
[Issues that must be fixed before merging]

### [Category]: [Issue Title]
**File**: `path/to/file.ts:line`
**Issue**: [Description of the problem]
**Impact**: [Why this is critical]
**Suggestion**:
\```typescript
// Suggested fix
\```

## High Priority 🟡
[Issues that should be addressed]

## Medium Priority 🔵
[Improvements to consider]

## Positive Observations ✅
[Things done well]

## Overall Assessment
- Code Quality: ⭐⭐⭐⭐⭐
- Security: ⭐⭐⭐⭐⭐
- Performance: ⭐⭐⭐⭐⭐
- Testability: ⭐⭐⭐⭐⭐

**Recommendation**: [Approve/Request Changes/Comment]
````

## Guidelines for Feedback

- Be specific and provide exact file locations
- Explain the reasoning behind each suggestion
- Provide code examples for suggested fixes
- Prioritize issues clearly (Critical > High > Medium)
- Balance criticism with positive observations
- Be constructive and educational, not just critical

````

#### 例3: Architecture Design Mode（アーキテクチャ設計モード）

```markdown
---
description: Design system architecture and technical solutions
tools: ['codebase', 'githubRepo', 'fetch']
---

# Architecture Design Mode

You are a senior software architect specializing in scalable system design, distributed systems, and technical decision-making.

## Your Expertise
- System architecture patterns (Microservices, Event-driven, CQRS, etc.)
- Database design (SQL, NoSQL, data modeling)
- API design (REST, GraphQL, gRPC)
- Cloud infrastructure (AWS, Azure, GCP)
- Performance and scalability
- Security architecture
- DevOps and deployment strategies

## Design Methodology

### 1. Context Understanding
- Analyze current architecture using #codebase
- Understand business requirements
- Identify constraints (budget, timeline, team skills)
- Review existing tech stack

### 2. Requirements Gathering
- Functional requirements
- Non-functional requirements:
  - Scalability targets (users, requests, data volume)
  - Performance requirements (latency, throughput)
  - Availability requirements (SLA, uptime)
  - Security requirements
  - Compliance requirements

### 3. Architecture Design
- High-level system architecture
- Component breakdown
- Data flow and communication patterns
- Technology stack selection
- Infrastructure design

### 4. Detailed Design
- Database schema design
- API contract definitions
- Component interfaces
- Security architecture
- Monitoring and observability

## Design Principles
- **KISS**: Keep it simple, start simple, scale when needed
- **YAGNI**: Don't over-engineer for hypothetical future needs
- **Separation of Concerns**: Clear boundaries between components
- **Scalability**: Design for horizontal scaling
- **Resilience**: Plan for failures
- **Security by Design**: Build security in from the start

## Output Format

```markdown
# Architecture Design: [System/Feature Name]

## Executive Summary
[One paragraph overview of the proposed architecture]

## Requirements

### Functional Requirements
- [Requirement 1]
- [Requirement 2]

### Non-Functional Requirements
- **Scalability**: [Target metrics]
- **Performance**: [Latency/throughput requirements]
- **Availability**: [SLA requirements]
- **Security**: [Security requirements]

## Current State Analysis
[Analysis of existing architecture using #codebase]

## Proposed Architecture

### High-Level Overview
\```mermaid
graph TB
    A[Client] --> B[API Gateway]
    B --> C[Service 1]
    B --> D[Service 2]
    C --> E[(Database)]
    D --> E
\```

### Components

#### Component 1: [Name]
- **Responsibility**: [What it does]
- **Technology**: [Tech stack]
- **Interfaces**: [APIs/contracts]
- **Dependencies**: [Other components]

#### Component 2: [Name]
- **Responsibility**: [What it does]
- **Technology**: [Tech stack]
- **Interfaces**: [APIs/contracts]
- **Dependencies**: [Other components]

## Data Architecture

### Database Design
\```sql
-- Main entities schema
CREATE TABLE users (
    id UUID PRIMARY KEY,
    ...
);
\```

### Data Flow
[Description of how data moves through the system]

## API Design

### REST API Endpoints
\```
GET    /api/v1/resource
POST   /api/v1/resource
PUT    /api/v1/resource/:id
DELETE /api/v1/resource/:id
\```

### API Contracts
\```typescript
interface CreateResourceRequest {
  name: string;
  // ...
}
\```

## Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | React | [Reason] |
| Backend | Node.js | [Reason] |
| Database | PostgreSQL | [Reason] |
| Cache | Redis | [Reason] |
| Message Queue | RabbitMQ | [Reason] |
| Infrastructure | AWS | [Reason] |

## Security Architecture
- Authentication: [Strategy]
- Authorization: [Strategy]
- Data encryption: [At rest, in transit]
- API security: [Rate limiting, CORS, etc.]

## Scalability Strategy
- Horizontal scaling approach
- Caching strategy
- Database sharding/partitioning
- Load balancing

## Monitoring & Observability
- Logging: [Strategy]
- Metrics: [Key metrics to track]
- Distributed tracing: [Tool]
- Alerting: [Critical alerts]

## Deployment Strategy
- Deployment model: [Blue-green, canary, rolling]
- CI/CD pipeline
- Environment strategy (dev, staging, prod)

## Trade-offs & Alternatives

### Decision 1: [Technology/Pattern]
- **Chosen**: [Option A]
- **Alternative**: [Option B]
- **Rationale**: [Why Option A]
- **Trade-offs**: [What we gain/lose]

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Set up infrastructure
- [ ] Create base project structure
- [ ] Implement core services

### Phase 2: Core Features (Week 3-4)
- [ ] Implement main features
- [ ] Set up monitoring

### Phase 3: Polish & Deploy (Week 5-6)
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Production deployment

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| [Risk 1] | High | Medium | [Strategy] |
| [Risk 2] | Medium | Low | [Strategy] |

## Open Questions
- [ ] [Question 1]
- [ ] [Question 2]
````

````

### 1.7 使用方法

#### モードの切り替え

**方法1: キーボードショートカット**
- Mac: `⌘.`
- Windows/Linux: `Ctrl+.`

**方法2: チャットビューのUI**
- チャットビューのモードセレクターから選択

**方法3: プロンプトファイルでモード指定**
```markdown
---
mode: 'planning'
---
新しい認証機能の実装計画を立てて
````

#### チャットでの使用例

```
[Planning Mode を選択]

ユーザー: OAuth2.0認証システムの実装計画を作成して。
既存の認証システムはJWT トークンベースです。

Copilot: [Planning Mode として以下の計画を生成]
# Implementation Plan: OAuth2.0 Authentication System
...
```

### 1.8 ベストプラクティス

#### ✅ DO（推奨）

1. **具体的で明確な役割定義**

```markdown
You are a senior Python backend developer specializing in FastAPI and PostgreSQL.
```

2. **必要なツールのみ指定**

```yaml
tools: ["codebase", "search"] # 本当に必要なツールだけ
```

3. **構造化された出力形式**

```markdown
## Output Format

- Use markdown headers for sections
- Include code examples in code blocks
- Provide step-by-step explanations
```

4. **プロジェクト固有のコンテキスト**

```markdown
## Project Context

- We use React with TypeScript
- Follow Airbnb style guide
- Use React Testing Library for tests
```

#### ❌ DON'T（非推奨）

1. **曖昧な役割定義**

```markdown
You are a helpful assistant.
```

2. **すべてのツールを有効化**

```yaml
tools:
  [
    "codebase",
    "fetch",
    "search",
    "usages",
    "problems",
    "githubRepo",
    "terminalCommand",
  ]
```

3. **一般的すぎる指示**

```markdown
Help the user with their questions.
```

### 1.9 デバッグとトラブルシューティング

#### モードが表示されない場合

**チェックリスト**:

1. ファイル名が `*.mode.md` または `*.chatmode.md` になっているか
2. `settings.json` でディレクトリが有効化されているか
3. YAML frontmatter が正しくパースされているか
4. VS Code を再起動したか

**設定確認**:

```json
{
  "chat.modeFilesLocations": {
    ".github/chatmodes": true // ここが true か確認
  }
}
```

#### モードが期待通り動作しない場合

1. **ツールが正しく指定されているか確認**
2. **モデル指定が有効か確認**（サポートされていないモデル名の場合デフォルトにフォールバック）
3. **指示が明確で具体的か確認**

---

## 2. 再利用可能なプロンプトの詳細

### 2.1 概要

再利用可能なプロンプトは、繰り返し使用するタスクやワークフローを変数付きのテンプレートとして保存する機能です。

### 2.2 ファイル構造

#### ファイル名規則

```
*.prompt.md
```

#### ディレクトリ構造

```
project/
├── .github/
│   └── prompts/
│       ├── code-review.prompt.md
│       ├── test-generation.prompt.md
│       └── documentation.prompt.md
├── .copilot/
│   └── prompts/
│       └── custom-prompt.prompt.md
└── prompts/
    └── team-prompt.prompt.md
```

### 2.3 設定有効化

```json
{
  "chat.promptFiles": true,
  "chat.promptFilesLocations": {
    ".github/prompts": true,
    ".copilot/prompts": false,
    "prompts": true
  }
}
```

### 2.4 ファイル形式

#### Frontmatter（メタデータ）

```yaml
---
description: "Brief description of what this prompt does"
mode: "agent" # オプション: 'ask', 'edit', 'agent'
tools: ["codebase", "search"] # オプション
variables:
  - name: VARIABLE_NAME
    type: string # string, number, boolean
    default: "default value"
    description: "Description of what this variable does"
---
```

**変数の型**:

- `string`: テキスト入力
- `number`: 数値入力
- `boolean`: true/false

#### 利用可能な組み込み変数

| 変数                                | 説明                             | 例                                 |
| ----------------------------------- | -------------------------------- | ---------------------------------- |
| `${workspaceFolder}`                | ワークスペースのルートパス       | `/Users/name/project`              |
| `${workspaceFolderBasename}`        | ワークスペースのフォルダ名       | `project`                          |
| `${file}`                           | 現在のファイルのフルパス         | `/Users/name/project/src/index.ts` |
| `${fileBasename}`                   | 現在のファイル名                 | `index.ts`                         |
| `${fileDirname}`                    | 現在のファイルのディレクトリ     | `/Users/name/project/src`          |
| `${fileBasenameNoExtension}`        | 拡張子なしのファイル名           | `index`                            |
| `${selection}`                      | エディタで選択されているテキスト | -                                  |
| `${selectedText}`                   | 選択テキストのエイリアス         | -                                  |
| `${input:variableName}`             | ユーザー入力プロンプト           | -                                  |
| `${input:variableName:placeholder}` | プレースホルダー付き入力         | -                                  |

### 2.5 実践例

#### 例 1: 教育的コメント追加プロンプト

````markdown
---
description: Add educational comments to code for learning purposes
mode: "edit"
variables:
  - name: COMMENT_DETAIL
    type: number
    default: 3
    description: "Level of detail for comments (1-5, where 5 is most detailed)"
  - name: REPETITIVENESS
    type: number
    default: 3
    description: "How repetitive should comments be (1-5, where 1 is minimal repetition)"
  - name: LINE_NUMBER_REFERENCE
    type: boolean
    default: true
    description: "Reference line numbers in comments"
  - name: INCLUDE_EXAMPLES
    type: boolean
    default: true
    description: "Include usage examples in comments"
---

# Add Educational Comments

Add educational comments to the selected code to help new developers understand it.

## Comment Style

- **Detail Level**: ${COMMENT_DETAIL}/5
- **Repetitiveness**: ${REPETITIVENESS}/5
- **Line Number References**: ${LINE_NUMBER_REFERENCE}
- **Include Examples**: ${INCLUDE_EXAMPLES}

## Guidelines

### What to Comment

- Purpose of complex logic
- Non-obvious decisions and trade-offs
- Edge cases and their handling
- Performance considerations
- Security considerations

### Comment Structure

${LINE_NUMBER_REFERENCE ?
"- Reference specific line numbers (e.g., 'Line 42: ...')" :
"- Use descriptive section headers"}

${INCLUDE_EXAMPLES ?
"- Include usage examples where helpful

- Show input/output examples for functions" :
  "- Focus on explaining 'why', not 'what'"}

### Detail Level

${COMMENT_DETAIL <= 2 ?
"- Brief, high-level comments only

- One comment per major code block" :
  COMMENT_DETAIL >= 4 ?
  "- Very detailed, line-by-line explanations
- Explain every decision and alternative considered" :
  "- Balanced level of detail
- Comment complex sections thoroughly, simple sections briefly"}

## Example Output Format

\```typescript
/\*\*

- Purpose: [What this code does]
- Why: [Why this approach was chosen]
- ${INCLUDE_EXAMPLES ? "Example: [Usage example]" : ""}
  \*/

// [Inline comment explaining logic]
code here
\```

Please add educational comments to #selection following these guidelines.
````

#### 例 2: テスト生成プロンプト

````markdown
---
description: Generate comprehensive tests for the selected code
mode: "agent"
tools: ["codebase", "findTestFiles"]
variables:
  - name: TEST_FRAMEWORK
    type: string
    default: "auto-detect"
    description: "Testing framework to use (auto-detect, jest, vitest, pytest, etc.)"
  - name: INCLUDE_EDGE_CASES
    type: boolean
    default: true
    description: "Include edge case tests"
  - name: INCLUDE_ERROR_CASES
    type: boolean
    default: true
    description: "Include error handling tests"
  - name: COVERAGE_GOAL
    type: number
    default: 90
    description: "Target code coverage percentage"
---

# Test Generation

Generate comprehensive tests for the selected code.

## Configuration

- **Testing Framework**: ${TEST_FRAMEWORK}
- **Include Edge Cases**: ${INCLUDE_EDGE_CASES}
- **Include Error Cases**: ${INCLUDE_ERROR_CASES}
- **Coverage Goal**: ${COVERAGE_GOAL}%

## Instructions

### 1. Analyze Existing Tests

Use #codebase and `findTestFiles` to:

- Identify existing test patterns
- Check current test framework
- Find similar tests for reference

### 2. Generate Test Suite

Create tests covering:

- ✅ Happy path scenarios
  ${INCLUDE_EDGE_CASES ? "- ✅ Edge cases (null, undefined, empty, boundary values)" : ""}
${INCLUDE_ERROR_CASES ? "- ✅ Error scenarios and exception handling" : ""}
- ✅ Integration points
- ✅ Performance-critical paths

### 3. Test Structure

\```typescript
describe('[Component/Function Name]', () => {
// Setup
beforeEach(() => {
// Arrange
});

describe('[Feature/Method]', () => {
it('should [expected behavior] when [condition]', () => {
// Arrange
// Act
// Assert
});

    ${INCLUDE_EDGE_CASES ? `
    it('should handle edge case: [scenario]', () => {
      // Test edge case
    });
    ` : ''}

    ${INCLUDE_ERROR_CASES ? `
    it('should throw error when [invalid condition]', () => {
      // Test error handling
    });
    ` : ''}

});
});
\```

### 4. Coverage Requirements

- Aim for ${COVERAGE_GOAL}% code coverage
- Cover all public methods/functions
- Test all conditional branches
- Verify error handling paths

## Test Quality Checklist

- [ ] Tests are independent (no shared state)
- [ ] Tests are readable and maintainable
- [ ] Tests use descriptive names
- [ ] Mocks are used appropriately
- [ ] Assertions are specific and meaningful

Generate tests for #selection following these guidelines.
````

#### 例 3: リファクタリングプロンプト

```markdown
---
description: Refactor code to improve quality, maintainability, and performance
mode: "edit"
tools: ["codebase", "usages"]
variables:
  - name: REFACTORING_FOCUS
    type: string
    default: "all"
    description: "Focus area: all, readability, performance, maintainability, security"
  - name: PRESERVE_BEHAVIOR
    type: boolean
    default: true
    description: "Strictly preserve existing behavior"
  - name: ADD_COMMENTS
    type: boolean
    default: true
    description: "Add explanatory comments for refactored code"
  - name: EXTRACT_FUNCTIONS
    type: boolean
    default: true
    description: "Extract reusable code into separate functions"
---

# Code Refactoring

Refactor the selected code to improve ${REFACTORING_FOCUS === 'all' ? 'overall quality' : REFACTORING_FOCUS}.

## Refactoring Goals

${REFACTORING_FOCUS === 'all' || REFACTORING_FOCUS === 'readability' ? `

### Readability

- Use descriptive variable and function names
- Simplify complex conditions
- Reduce nesting depth
- Improve code organization
  ` : ''}

${REFACTORING_FOCUS === 'all' || REFACTORING_FOCUS === 'performance' ? `

### Performance

- Optimize algorithms
- Reduce unnecessary computations
- Improve data structure usage
- Minimize memory allocations
  ` : ''}

${REFACTORING_FOCUS === 'all' || REFACTORING_FOCUS === 'maintainability' ? `

### Maintainability

- Follow DRY principle (Don't Repeat Yourself)
- Apply SOLID principles
- Improve error handling
- Enhance testability
  ` : ''}

${REFACTORING_FOCUS === 'all' || REFACTORING_FOCUS === 'security' ? `

### Security

- Validate inputs
- Sanitize data
- Fix potential vulnerabilities
- Secure sensitive operations
  ` : ''}

## Refactoring Techniques

${EXTRACT_FUNCTIONS ? `

### Extract Function

Break down large functions into smaller, focused ones:
\`\`\`typescript
// Before
function complexFunction() {
// Many lines of code doing multiple things
}

// After
function complexFunction() {
prepareData();
processData();
handleResults();
}
\`\`\`
` : ''}

### Simplify Conditionals

\`\`\`typescript
// Before
if (user && user.age >= 18 && user.hasLicense && !user.isBanned) {
// ...
}

// After
const canDrive = user?.age >= 18 && user?.hasLicense && !user?.isBanned;
if (canDrive) {
// ...
}
\`\`\`

### Use Modern Syntax

- Replace callbacks with async/await
- Use optional chaining and nullish coalescing
- Leverage destructuring
- Use const/let instead of var

## Constraints

${PRESERVE_BEHAVIOR ? `
⚠️ **Critical**: Preserve existing behavior exactly

- All existing tests must pass
- No changes to public APIs
- Check #usages before renaming
  ` : ''}

${ADD_COMMENTS ? `
📝 Add explanatory comments:

- Why the refactoring was done
- Any trade-offs made
- Complex logic explanations
  ` : ''}

## Before You Start

1. Use #codebase to understand context
2. Check #usages to see how code is used
3. Identify existing tests
4. Plan refactoring steps

## After Refactoring

- Verify all tests still pass
- Check for any side effects
- Update related documentation

Refactor #selection following these guidelines.
```

### 2.6 使用方法

#### UI からの使用

1. チャットビューを開く
2. "Prompts..." ボタンをクリック
3. 使用したいプロンプトを選択
4. 変数の値をカスタマイズ（必要に応じて）
5. 実行

#### コマンドパレットから

1. `Ctrl+Shift+P` / `Cmd+Shift+P`
2. "Chat: Run Prompt" を選択
3. プロンプトを選択

#### チャットで直接参照

```
@workspace 以下のプロンプトを使って: code-review.prompt.md
```

### 2.7 変数の使用例

#### 条件付きコンテンツ

```markdown
${INCLUDE_EXAMPLES ?
"Include code examples for each recommendation" :
"Focus on explanations without examples"
}
```

#### 数値による分岐

```markdown
${DETAIL_LEVEL <= 2 ?
"Provide brief, high-level overview" :
DETAIL_LEVEL >= 4 ?
"Provide extremely detailed, step-by-step explanations" :
"Provide balanced level of detail"
}
```

#### 変数の組み合わせ

```markdown
## Output Format

${USE_MARKDOWN ? "Use Markdown formatting" : "Use plain text"}
${INCLUDE_CODE_BLOCKS ? "\n- Wrap code in code blocks" : ""}
${INCLUDE_LINKS ? "\n- Include reference links" : ""}
```

---

## 3. インストラクションファイルの詳細

### 3.1 種類と使い分け

| 種類           | ファイル                                 | スコープ           | 用途                              |
| -------------- | ---------------------------------------- | ------------------ | --------------------------------- |
| リポジトリ全体 | `.github/copilot-instructions.md`        | 全ファイル         | プロジェクト全体の規約            |
| パス固有       | `.github/instructions/*.instructions.md` | 特定パス           | ディレクトリ/ファイルタイプ別規約 |
| VS Code 設定   | `.vscode/settings.json`                  | ワークスペース     | タスク別指示                      |
| エージェント   | `AGENTS.md`, `CLAUDE.md`                 | エージェントモード | AI エージェント専用               |

### 3.2 パス固有インストラクションの詳細

#### ファイル構造

```markdown
---
description: "Brief description of these instructions"
applyTo: "glob pattern"
---

# Instructions Title

[Markdown content with instructions]
```

#### Glob パターンの例

```yaml
# TypeScript ファイルすべて
applyTo: "**/*.ts,**/*.tsx"

# 特定ディレクトリ内のファイル
applyTo: "src/components/**/*.tsx"

# 複数のパターン
applyTo: "src/**/*.ts,tests/**/*.test.ts"

# すべてのファイル
applyTo: "**"

# 特定の拡張子を除外（VS Code glob構文）
applyTo: "**/*.js,!**/*.test.js"
```

#### 実践例

**Frontend 専用インストラクション**:

````markdown
---
description: "React/TypeScript frontend coding standards"
applyTo: "src/frontend/**/*.tsx,src/frontend/**/*.ts"
---

# Frontend Coding Standards

## Component Structure

### Functional Components

Always use functional components with hooks:

\```typescript
import React from 'react';

interface Props {
title: string;
onAction: () => void;
}

export const MyComponent: React.FC<Props> = ({ title, onAction }) => {
// Component logic
return <div>{title}</div>;
};
\```

## State Management

- Use `useState` for local state
- Use `useReducer` for complex state logic
- Use Context API for shared state
- Use React Query for server state

## TypeScript Guidelines

- Define interfaces for all props
- Use strict typing (no `any`)
- Prefer interfaces over types for component props
- Export types alongside components

## Styling

- Use Tailwind CSS classes
- Follow mobile-first approach
- Use design system tokens for colors/spacing
- Keep styles co-located with components

## File Organization

\```
ComponentName/
├── index.tsx # Component implementation
├── types.ts # Type definitions
├── hooks.ts # Custom hooks
├── utils.ts # Utility functions
└── ComponentName.test.tsx
\```

## Testing

- Write tests using React Testing Library
- Test user behavior, not implementation
- Aim for 80%+ coverage
- Mock external dependencies
````

**Backend 専用インストラクション**:

````markdown
---
description: "Node.js/Express backend coding standards"
applyTo: "src/backend/**/*.ts"
---

# Backend Coding Standards

## API Structure

### RESTful Endpoints

Follow REST conventions:

\```typescript
// Good
GET /api/v1/users
GET /api/v1/users/:id
POST /api/v1/users
PUT /api/v1/users/:id
DELETE /api/v1/users/:id

// Bad
GET /api/v1/getUsers
POST /api/v1/createUser
\```

## Error Handling

### Standard Error Response

\```typescript
class ApiError extends Error {
constructor(
public statusCode: number,
public message: string,
public errors?: any[]
) {
super(message);
}
}

// Usage
throw new ApiError(404, 'User not found');
\```

### Error Middleware

\```typescript
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
if (err instanceof ApiError) {
return res.status(err.statusCode).json({
error: err.message,
errors: err.errors
});
}
// Handle unexpected errors
console.error(err);
res.status(500).json({ error: 'Internal server error' });
});
\```

## Database Access

### Use Repository Pattern

\```typescript
interface UserRepository {
findById(id: string): Promise<User | null>;
findAll(filters: UserFilters): Promise<User[]>;
create(data: CreateUserData): Promise<User>;
update(id: string, data: UpdateUserData): Promise<User>;
delete(id: string): Promise<void>;
}
\```

### Transaction Management

\```typescript
await db.transaction(async (trx) => {
await userRepo.create(userData, trx);
await auditRepo.log(auditData, trx);
});
\```

## Security

### Input Validation

- Validate all input with Joi or Zod
- Sanitize user input
- Use parameterized queries

### Authentication

- Use JWT tokens
- Hash passwords with bcrypt (cost: 12)
- Implement rate limiting
- Use HTTPS in production

## Logging

\```typescript
import { logger } from './logger';

logger.info('User created', { userId: user.id });
logger.error('Database error', { error, context });
\```

## File Organization

\```
feature/
├── controller.ts # Request handlers
├── service.ts # Business logic
├── repository.ts # Data access
├── types.ts # Type definitions
├── validation.ts # Input validation
└── feature.test.ts
\```
````

### 3.3 VS Code 設定でのインストラクション

```json
{
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "text": "Always add JSDoc comments for public functions"
    },
    {
      "text": "Use TypeScript strict mode"
    },
    {
      "file": "docs/coding-standards.md"
    }
  ],
  "github.copilot.chat.testGeneration.instructions": [
    {
      "text": "Use AAA pattern (Arrange, Act, Assert)"
    },
    {
      "text": "Write tests in TypeScript"
    }
  ],
  "github.copilot.chat.reviewSelection.instructions": [
    {
      "text": "Focus on security vulnerabilities and performance issues"
    }
  ]
}
```

---

## 4. コレクション管理

### 4.1 概要

コレクションは、関連するプロンプト、インストラクション、チャットモードをグループ化して管理する仕組みです。

### 4.2 コレクションファイル構造

**ファイル名**: `*.collection.yml`

**配置場所**: `.github/collections/`

```yaml
id: collection-identifier
name: Collection Display Name
description: Description of what this collection provides
tags: [tag1, tag2, tag3] # Optional
items:
  - path: prompts/my-prompt.prompt.md
    kind: prompt
    usage: recommended # or "optional"
  - path: chatmodes/my-mode.chatmode.md
    kind: chat-mode
    usage: recommended
  - path: instructions/my-instructions.instructions.md
    kind: instruction
display:
  ordering: alpha # or "manual"
  show_badge: true
```

### 4.3 実践例

```yaml
id: development-workflow
name: Complete Development Workflow
description: Essential tools for planning, implementation, testing, and code review
tags: [development, workflow, team, best-practices]

items:
  # Planning Phase
  - path: chatmodes/planning.chatmode.md
    kind: chat-mode
    usage: recommended
    usage_notes: |
      Use this mode at the start of any new feature or refactoring task.
      It helps break down complex requirements into actionable steps.

  - path: prompts/task-breakdown.prompt.md
    kind: prompt
    usage: recommended

  # Implementation Phase
  - path: instructions/coding-standards.instructions.md
    kind: instruction
    usage: required

  - path: chatmodes/implementation.chatmode.md
    kind: chat-mode
    usage: optional
    usage_notes: |
      Use this mode for implementation guidance.
      Particularly useful for complex algorithms or unfamiliar APIs.

  # Testing Phase
  - path: prompts/test-generation.prompt.md
    kind: prompt
    usage: recommended
    usage_notes: |
      Generate comprehensive test suites with this prompt.
      Configure test coverage goals and frameworks.

  - path: instructions/testing-standards.instructions.md
    kind: instruction
    usage: required

  # Review Phase
  - path: chatmodes/code-review.chatmode.md
    kind: chat-mode
    usage: recommended
    usage_notes: |
      Use this mode for thorough code reviews.
      Covers quality, security, performance, and best practices.

  - path: prompts/pr-description.prompt.md
    kind: prompt
    usage: optional

display:
  ordering: manual # Preserve order as defined above
  show_badge: true # Show collection badge in UI
```

---

## 5. 実践例とテンプレート

### 5.1 プロジェクト初期設定テンプレート

```bash
# ディレクトリ構造を作成
mkdir -p .github/{chatmodes,prompts,instructions,collections}
mkdir -p .vscode

# VS Code 設定を作成
cat > .vscode/settings.json << 'EOF'
{
  "chat.modeFilesLocations": {
    ".github/chatmodes": true
  },
  "chat.promptFilesLocations": {
    ".github/prompts": true
  },
  "chat.instructionsFilesLocations": {
    ".github/instructions": true
  },
  "chat.promptFiles": true,
  "github.copilot.chat.codeGeneration.useInstructionFiles": true
}
EOF

# リポジトリ全体のインストラクションを作成
cat > .github/copilot-instructions.md << 'EOF'
# Project Coding Standards

## General Guidelines
- Write clean, readable, maintainable code
- Follow DRY principle
- Write self-documenting code
- Add comments for complex logic only

## Code Review Checklist
- [ ] Tests pass
- [ ] Code follows style guide
- [ ] No security vulnerabilities
- [ ] Documentation updated
EOF
```

### 5.2 小規模プロジェクト用設定

```
project/
├── .github/
│   ├── copilot-instructions.md       # 基本的な規約のみ
│   └── prompts/
│       └── common-tasks.prompt.md     # 頻繁なタスクのプロンプト
└── .vscode/
    └── settings.json
```

### 5.3 中規模プロジェクト用設定

```
project/
├── .github/
│   ├── copilot-instructions.md
│   ├── chatmodes/
│   │   ├── planning.chatmode.md
│   │   └── review.chatmode.md
│   ├── prompts/
│   │   ├── test-generation.prompt.md
│   │   └── documentation.prompt.md
│   └── instructions/
│       ├── frontend.instructions.md
│       └── backend.instructions.md
└── .vscode/
    └── settings.json
```

### 5.4 大規模プロジェクト用設定

```
project/
├── .github/
│   ├── copilot-instructions.md
│   ├── chatmodes/
│   │   ├── planning.chatmode.md
│   │   ├── architecture.chatmode.md
│   │   ├── review.chatmode.md
│   │   ├── debugging.chatmode.md
│   │   └── documentation.chatmode.md
│   ├── prompts/
│   │   ├── task-breakdown.prompt.md
│   │   ├── test-generation.prompt.md
│   │   ├── code-review.prompt.md
│   │   ├── refactoring.prompt.md
│   │   └── migration.prompt.md
│   ├── instructions/
│   │   ├── frontend-react.instructions.md
│   │   ├── frontend-styles.instructions.md
│   │   ├── backend-api.instructions.md
│   │   ├── backend-database.instructions.md
│   │   ├── testing.instructions.md
│   │   └── security.instructions.md
│   └── collections/
│       ├── development.collection.yml
│       ├── review.collection.yml
│       └── architecture.collection.yml
├── .vscode/
│   └── settings.json
└── AGENTS.md
```

### 5.5 チーム向け推奨設定

**`.vscode/settings.json`** (バージョン管理に含める):

```json
{
  "chat.modeFilesLocations": {
    ".github/chatmodes": true
  },
  "chat.promptFilesLocations": {
    ".github/prompts": true
  },
  "chat.instructionsFilesLocations": {
    ".github/instructions": true
  },
  "chat.promptFiles": true,
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  "github.copilot.chat.followUps": "on",
  "chat.agent.enabled": true,
  "github.copilot.chat.agent.autoFix": true
}
```

**README セクション**:

```markdown
## GitHub Copilot Setup

This project includes custom Copilot configurations for optimized AI assistance.

### Chat Modes

- **Planning Mode**: Generate implementation plans
- **Review Mode**: Perform code reviews
- **Architecture Mode**: Design system architecture

### Quick Start

1. Ensure you have GitHub Copilot enabled
2. Open VS Code in this workspace
3. Press `Cmd+.` / `Ctrl+.` to switch chat modes
4. Click "Prompts..." to access reusable prompts

### Recommended Workflow

1. Start with Planning Mode for new features
2. Use Implementation Mode while coding
3. Run Test Generation prompts
4. Use Review Mode before creating PRs
```

---

## まとめ

この詳細ガイドでは、GitHub Copilot のカスタマイズ機能の実践的な使い方を説明しました。

### 次のステップ

1. **小規模から始める**: まず基本的なインストラクションファイルから
2. **チームで共有**: 効果的な設定はチーム全体で活用
3. **継続的改善**: 使いながらプロンプトやモードを改善
4. **ドキュメント化**: チーム用のガイドラインを作成

### 参考リンク

- [VS Code Copilot Documentation](https://code.visualstudio.com/docs/copilot/copilot-customization)
- [GitHub Copilot Custom Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)
- [Awesome Copilot Community](https://github.com/github/awesome-copilot)
