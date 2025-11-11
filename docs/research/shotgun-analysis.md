# shotgun 詳細分析

**リポジトリ**: https://github.com/shotgun-sh/shotgun  
**作成者**: shotgun-sh  
**分析日**: 2025-01-11

---

## 1. 概要

shotgun は **Codebase-Aware Spec Generation** に特化した TUI/CLI ベースの SDD フレームワーク。最大の特徴は **Neo4j ベースのコードベースグラフ** による既存コード理解。

### 核となる哲学

- **"Research First, Then Spec"**: コードベースを理解してから仕様を書く
- **"One Agent Per Phase"**: 各フェーズ専用のエージェントで品質保証
- **"Export to Any Tool"**: Cursor, Claude Code, Windsurf など複数の AI コーディングツール対応

---

## 2. アーキテクチャ

### 2.1 ディレクトリ構造

```
.shotgun/                        # shotgun 専用ディレクトリ
├── research.md                  # 研究エージェントの出力
├── specification.md             # 仕様エージェントの出力
├── plan.md                      # 計画エージェントの出力
├── tasks.md                     # タスクエージェントの出力
├── contracts/                   # 型定義・スキーマ (コードのみ)
│   ├── user_models.py           # Python Pydantic models
│   ├── auth_types.ts            # TypeScript interfaces
│   └── api_spec.json            # OpenAPI schema
└── exports/                     # エクスポート結果
    └── AGENTS.md / CLAUDE.md    # AI コーディングツール用

codebase_graphs/                 # Neo4j グラフデータベース
└── {project-name}/
    ├── entities.db              # エンティティストア
    └── relationships.db         # 関係グラフ
```

### 2.2 Codebase Graph System (独自機能)

**技術スタック**: Neo4j (グラフデータベース)

**グラフ構造**:

```cypher
// ノードタイプ
(:Class {name, qualified_name, file_path})
(:Function {name, qualified_name, parameters, return_type})
(:Module {name, path})
(:Variable {name, type})

// 関係タイプ
-[:IMPORTS]->
-[:CALLS]->
-[:INHERITS_FROM]->
-[:CONTAINS]->
-[:USES]->
```

**クエリ例**:

```cypher
// すべてのクラスを表示
MATCH (c:Class) RETURN c.name, c.qualified_name;

// 特定クラスのメソッド一覧
MATCH (c:Class {name: "User"})-[:CONTAINS]->(m:Function)
RETURN m.name, m.parameters;

// 依存関係の追跡
MATCH (m1:Module)-[:IMPORTS*1..3]->(m2:Module)
WHERE m1.name = "auth_service"
RETURN m2.name;
```

**利用シーン**:

1. **Research Phase**: 「認証がどう実装されているか」をグラフ検索
2. **Specify Phase**: 既存の User モデルを参照して新機能の型を定義
3. **Plan Phase**: 既存アーキテクチャパターンを特定して再利用

**Cypher System Prompt** (自然言語 → Cypher クエリ変換):

```jinja2
# src/shotgun/prompts/codebase/cypher_system.j2 より

**When to generate Cypher:**
- Structural queries about classes, functions, modules
- Relationship queries (imports, calls, inheritance)
- Pattern matching queries

**When NOT to generate Cypher:**
- Conceptual questions ("What is the main purpose of this codebase?")
- Code quality questions
- Questions requiring semantic understanding beyond structure

Examples:
- "Show all classes" → can_generate_valid_cypher: true
  cypher_query: "MATCH (c:Class) RETURN c.name, c.qualified_name;"
- "What is the main purpose?" → can_generate_valid_cypher: false
  reason_cannot_generate: "Conceptual question requiring interpretation"
```

---

## 3. 5-Phase Workflow

### 3.1 フェーズ概要

```
🔬 Research → 📝 Specify → 📋 Plan → ✅ Tasks → 📤 Export
```

| Phase       | Agent            | Input        | Output                            | 目的                                |
| ----------- | ---------------- | ------------ | --------------------------------- | ----------------------------------- |
| 1. Research | `research_agent` | ユーザー質問 | `research.md`                     | コードベース理解 + Web 検索         |
| 2. Specify  | `specify_agent`  | 要件         | `specification.md` + `contracts/` | 仕様定義 (prose + code)             |
| 3. Plan     | `plan_agent`     | 仕様         | `plan.md`                         | 実装計画 (時間参照禁止)             |
| 4. Tasks    | `tasks_agent`    | 計画         | `tasks.md`                        | チェックボックス形式のタスク        |
| 5. Export   | `export_agent`   | 全成果物     | `AGENTS.md` / `CLAUDE.md`         | AI コーディングツール用フォーマット |

### 3.2 Phase 1: Research (研究)

**目的**: コードベースと関連技術を調査

**プロンプト例**:

```
"How do we handle authentication in this codebase?"
"Research how payment processing works in our app"
```

**エージェントの動作** (`src/shotgun/prompts/agents/research.j2`):

```jinja2
You are an experienced Research Assistant.

Your job is to help the user research various subjects related to their software project
and keep the research.md file up to date.

## MEMORY MANAGEMENT PROTOCOL

- You have exclusive write access to: `research.md`
- This is your persistent memory store - ALWAYS load it first
- Compress content regularly to stay within context limits
- Structure your memory as:
  Current Knowledge → Knowledge Gaps → New Findings → Compressed Summary

## AI AGENT PIPELINE AWARENESS

**CRITICAL**: Your output will be consumed by AI coding agents
- Focus on WHAT to build, not HOW to code
- Research specific API endpoints, not general programming tutorials
- Document exact library versions and compatibility requirements
```

**研究手段**:

1. **Codebase Graph Query**: Neo4j でコード構造を検索
2. **File System Access**: 実際のソースコードを読む
3. **Web Search**: 最新のライブラリドキュメント取得

**出力例** (`research.md`):

```markdown
# Research: User Authentication

## Current Implementation

- **Framework**: FastAPI + JWT
- **Storage**: PostgreSQL `users` table
- **Hashing**: bcrypt (cost factor: 12)
- **Token expiry**: 24 hours

## Relevant Files

- `src/auth/service.py`: Main authentication logic
- `src/models/user.py`: User model definition
- `tests/test_auth.py`: Authentication tests

## Web Research

- FastAPI Security Best Practices (2025-01-11)
  Source: https://fastapi.tiangolo.com/tutorial/security/
  Key: Use OAuth2PasswordBearer for production

## Knowledge Gaps

- [ ] How should refresh tokens be implemented?
- [ ] Multi-factor authentication strategy?
```

**特徴的な機能**:

- ✅ **Incremental Research**: 既存の `research.md` を読み込んで追記
- ✅ **Compression**: コンテキスト制限に達したら古い情報を圧縮
- ✅ **Source Citation**: Web 検索結果に URL と日付を記録

### 3.3 Phase 2: Specify (仕様定義)

**目的**: 機能要件を明確化 (prose + code contracts)

**プロンプト例**:

```
"Add OAuth2 authentication with refresh token support"
"Create a user profile management feature"
```

**仕様の二重構造** (prose + contracts):

**specification.md** (prose only):

```markdown
# Specification: OAuth2 Authentication

## Requirements

- Users must authenticate using OAuth2 password flow
- Access tokens expire after 24 hours
- Refresh tokens valid for 7 days
- See contracts/auth_types.ts for type definitions

## Architecture

- Use FastAPI Security utilities
- Store tokens in PostgreSQL (see contracts/database_schema.sql)
- Hash passwords with bcrypt (cost 12)

## Integration Points

- Connects to existing User model (see contracts/user_models.py)
- Uses JWT utility from `src/utils/jwt.py`
```

**contracts/** (code only):

```python
# contracts/auth_types.py
from pydantic import BaseModel, Field
from typing import Optional

class AuthUser(BaseModel):
    """User authentication contract."""
    id: int
    email: str = Field(..., description="User email address")
    username: str
    is_active: bool = True

class TokenResponse(BaseModel):
    """OAuth2 token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 86400  # 24 hours
```

**Why separate prose and code?** (プロンプトより):

```jinja2
## WHAT GOES IN SPECIFICATION.MD

**INCLUDE in specification.md:**
- Requirements and business context
- Architecture overview and system design decisions
- Component descriptions and how they interact
- Directory structure as succinct prose
- References to contract files (e.g., "See contracts/user_models.py")

**DO NOT INCLUDE in specification.md:**
- Code blocks, type definitions, or function signatures (those go in contracts/)
- Implementation details or algorithms
- Actual configuration files or build manifests
```

**Contract Files の厳格なルール**:

```jinja2
**ONLY put these in `.shotgun/contracts/`:**
- Type definitions ONLY - Shape and structure, NO behavior or logic:
  - Python: Pydantic models, dataclasses, `typing.Protocol`
  - TypeScript: interfaces, type aliases
  - Rust: struct definitions
  - Go: interface types, struct definitions
- Schema definitions:
  - OpenAPI/Swagger specs
  - JSON Schema definitions
  - GraphQL schemas

**NEVER put in contracts/:**
- Functions with implementation
- Business logic or algorithms
- Configuration files (.env, config.yaml)
- Directory structure files
- SQL migration files

**Path format rule**: Always use `contracts/filename.ext`,
never `.shotgun/contracts/filename.ext`
```

**Bad Examples (コードを prose に混ぜる)**:

````markdown
❌ BAD:

## User Model

```python
class User:
    def __init__(self, name):
        self.name = name
```
````

✅ GOOD:

## User Model

See contracts/user_models.py for the User type definition.

````

### 3.4 Phase 3: Plan (計画)

**目的**: 実装ロードマップを作成 (時間参照は厳禁)

**CRITICAL RULE** (プロンプトより):
```jinja2
⚠️ **CRITICAL RULE**: If you use ANY time references
(Week, Day, Month, Hour, Quarter, Year), your plan is INVALID and will be rejected.
Use ONLY Stage/Step numbering based on technical dependencies.

**NEVER INCLUDE:**
- Weeks, days, hours, months, quarters, or ANY time measurements
- "Phase 1 (Week 1-2)" or "Day 1-2" style headers
- "8-10 weeks to complete" or similar time predictions

**ALWAYS USE:**
- "Stage 1", "Stage 2" or "Step 1", "Step 2"
- Prerequisites and technical dependencies
- High-level components and architecture
````

**Plan Format Example**:

```markdown
# Implementation Plan: OAuth2 Authentication

## Stage 1: Authentication Foundation

**Prerequisites**: None
**Goal**: Establish core authentication infrastructure

### Components:

1. JWT token generation utility
2. Password hashing service
3. User repository interface

**Success Criteria**:

- Token can be generated and validated
- Passwords are securely hashed

---

## Stage 2: OAuth2 Password Flow

**Prerequisites**: Stage 1 complete
**Goal**: Implement OAuth2 password grant flow

### Components:

1. `/token` endpoint for password authentication
2. Token refresh endpoint
3. Token validation middleware

**Success Criteria**:

- Users can authenticate with username/password
- Access tokens are issued and validated

---

## Stage 3: Integration with Existing System

**Prerequisites**: Stage 2 complete
**Goal**: Connect authentication to existing user management

### Components:

1. User model integration
2. Permission checking middleware
3. Logout functionality

**Success Criteria**:

- Authenticated users can access protected routes
- Permissions are enforced
```

**Why NO time references?** (プロンプトより):

```jinja2
**REMEMBER:**
- Plans should be HIGH-LEVEL architecture and approach
- Leave specific file paths and function names to the task agent
- Focus on WHAT to build, not HOW to code it
- AI agents execute immediately based on dependencies, not schedules
```

**MANDATORY: Load context before planning**:

```jinja2
## PLANNING WORKFLOW

For PLANNING tasks:
1. **Load existing plan**: ALWAYS first use `read_file("plan.md")`
2. **MANDATORY: Load context files**:
   You MUST read `specification.md` and `research.md` BEFORE asking questions
3. **Analyze requirements**: Understand project goals and constraints
4. **Define specifications**: Create detailed technical and functional plans
5. **REQUIRED: Write the plan**: You MUST use `write_file("plan.md", content)`.
   NOT writing the plan means FAILURE.
```

**Validation Before Writing**:

```jinja2
## FINAL VALIDATION BEFORE WRITING

Before writing to plan.md, verify:
✅ NO time references (week, day, month, hour, year, quarter)
✅ Uses Stage/Step numbering only
✅ Based on technical dependencies, not schedules
✅ High-level architecture focus (details for task agent)
✅ Follows the example format shown above
```

### 3.5 Phase 4: Tasks (タスク分解)

**目的**: Atomic, agent-friendly なタスクリストを生成

**Task Format** (チェックボックス必須):

```markdown
# Task Management

## Instructions

- Mark tasks as complete by replacing `[ ]` with `[X]`
- Tasks without an `[X]` are not finished yet

## Backlog

- [ ] In src/auth/jwt.py, create generate_access_token() function using PyJWT
- [ ] In src/auth/jwt.py, create verify_token() function with expiry checking
- [ ] In src/models/user.py, add is_active field to User model

## In Progress

- [ ] In src/api/auth.py, implement POST /token endpoint with OAuth2PasswordBearer
- [ ] In tests/test_auth.py, add unit tests for token generation (>80% coverage)

## Done

- [x] In src/utils/password.py, implement hash_password() using bcrypt cost 12
- [x] In src/utils/password.py, implement verify_password()
```

**AI Agent Pipeline Awareness** (プロンプトより):

````jinja2
## AI AGENT PIPELINE AWARENESS

**CRITICAL**: Your output will be consumed by AI coding agents
- These agents already know how to code - don't teach programming concepts
- Each task MUST have a checkbox `[ ]` for tracking completion
- Format: `- [ ] In [file path], [add/modify/delete] [specific code/feature]`
- Include acceptance criteria as executable commands (npm test, curl endpoints)
- Reference specific line numbers or function names when modifying existing code

Example task format:
```markdown
- [ ] In src/api/auth.py, add JWT token validation to authenticate() function
- [ ] In tests/test_auth.py, add unit tests for JWT validation (must achieve 80% coverage)
- [ ] In docs/API.md, update authentication section with JWT token requirements
````

````

**Task Creation Principles**:
```jinja2
## TASK CREATION PRINCIPLES

- Base tasks on available research findings and plan requirements
- Create specific, actionable tasks with clear acceptance criteria
- Include effort estimates and priority levels when possible
- Consider dependencies between tasks
- Make tasks testable and verifiable
- Keep tasks.md as the single source of truth
- Group related tasks under clear section headings
- Mark completed tasks with `[X]` when updating the file
````

**Clarifying Questions (Interactive Mode)**:

```jinja2
{% if interactive_mode %}
USER INTERACTION - ASK CLARIFYING QUESTIONS:

- ALWAYS ask clarifying questions when the request is vague or ambiguous
- Use clarifying questions to gather specific details about:
  - Specific features or functionality to prioritize
  - Technical constraints or preferences
  - Timeline and resource constraints
  - Definition of "done" for key deliverables
  - Testing and quality requirements
{% else %}
NON-INTERACTIVE MODE - MAKE REASONABLE ASSUMPTIONS:

- Make reasonable assumptions based on industry best practices
- Use sensible defaults for technical constraints and timelines
{% endif %}
```

### 3.6 Phase 5: Export (エクスポート)

**目的**: AI コーディングツール向けにフォーマット

**対応ツール**:

- Cursor
- Claude Code
- Windsurf
- Lovable
- その他 `AGENTS.md` 対応ツール

**Export Format** (agents.md standard):

```markdown
# Agents.md - [Project Name]

## Research, Specifications, and Planning

The `.shotgun/` folder contains background research, specifications,
and implementation planning files. Refer to these files for additional context:

- `research.md` - Codebase analysis and research findings
- `specification.md` - Project requirements and specifications
- `plan.md` - Development plan and implementation approach
- `tasks.md` - Task breakdown and implementation progress

## Project Overview

- REST API for product catalog management with authentication
- Built with Python/FastAPI for high performance async operations
- Supports CRUD operations and advanced search functionality

## Dev Environment Setup

- Install Python 3.11+
- Clone repository: `git clone [repo-url]`
- Install dependencies: `pip install -r requirements.txt`
- Run dev server: `uvicorn main:app --reload`
- Run tests: `pytest tests/`

## Code Style Guidelines

- Follow PEP 8 for Python code
- Use type hints for all function signatures
- Write docstrings in Google style
- Keep functions under 50 lines
- Prefer composition over inheritance

## Testing Instructions

- Run tests: `pytest tests/`
- Coverage requirement: >80%
- Integration tests for all API endpoints
- Unit tests for business logic

## Build and Deployment

- Build: `docker build -t myapp .`
- Deploy: `docker run -p 8000:8000 myapp`
- Environment variables: DB_URL, SECRET_KEY

## Additional Notes

- Security: All passwords hashed with bcrypt
- Performance: Use database connection pooling
- API rate limiting: 100 requests per minute per IP
```

**CRITICAL: What NOT to export** (プロンプトより):

````jinja2
**Agents.md/CLAUDE.md Requirements**:
- DO NOT combine all pipeline files into one document
- DO NOT create "how to use Claude" guides or prompt templates
- DO NOT include ```prompt blocks or interaction instructions
- CLAUDE.md is FOR Claude Code to read, not ABOUT how to use Claude

**Example of BAD Content**:
```markdown
❌ WRONG:
## Claude AI Assistant Guide
## Prompt Templates
```prompt
Help me with [task]
````

❌ ALSO WRONG:

## Claude Integration Guide for AI Agent CLI

### Overview

This document provides comprehensive guidance for integrating Claude models...

````

**Proper Workflow**:
```jinja2
## Step 1: MANDATORY: Read ALL pipeline files
content_research = read_file('research.md')
content_spec = read_file('specification.md')
content_plan = read_file('plan.md')
content_tasks = read_file('tasks.md')

## Step 2: ANALYZE what you read
- Project name: "Shotgun"
- Purpose: AI agent pipeline tool using Pydantic AI
- Tech stack: Python, Pydantic AI, CLI/TUI interfaces
- NOT about: Claude integration, API guides, or generic topics

## Step 3: CREATE relevant content based on ACTUAL project
- How to set up Shotgun development environment
- Shotgun's code style and conventions
- NOT generic Claude guides
````

---

## 4. TUI (Terminal User Interface)

### 4.1 モード切り替え

**Keyboard Shortcuts**:

```
Shift+Tab    : モード切り替え
Ctrl+P       : コマンドパレット
Ctrl+C       : キャンセル
Escape       : Q&A 終了
Ctrl+U       : 使用統計表示
```

**5 つのモード**:
| Mode | What It Does | Output |
|------|-------------|--------|
| 🔬 Research | コードベース + Web 検索 | `research.md` |
| 📝 Specify | 技術仕様作成 | `specification.md` |
| 📋 Plan | 実装ロードマップ | `plan.md` |
| ✅ Tasks | タスク分解 | `tasks.md` |
| 📤 Export | AI ツール向けフォーマット | `AGENTS.md` |

**モード切り替えの視覚化**:

```
[Research] → Shift+Tab → [Specify] → Shift+Tab → [Plan] → ...
```

### 4.2 Onboarding Modal

**初回起動時の案内** (3 ページ):

```python
# src/shotgun/tui/screens/onboarding.py より

# Page 1: Welcome
"Welcome to Shotgun! Let's get you started..."

# Page 2: Better Prompts
"""
### 1. Ask for Research First
> "Can you research how authentication works in this codebase?"

### 2. Request Clarifying Questions
> "I want to add user profiles. Please ask me clarifying questions first."

### 3. Be Specific About Context
> "I'm working on the payment flow. I need to add support for refunds."
"""

# Page 3: Mode Switching
"""
- Use **Research** for exploration
- Use **Specify** for requirements
- Use **Plan** for implementation strategy
- Use **Tasks** for actionable next steps
"""
```

### 4.3 Context Management Commands

**Clear Conversation**:

- 用途: 完全に新しいタスクを開始
- 操作: `Ctrl+P` → "Clear Conversation"

**Compact Conversation**:

- 用途: トークン制限対策
- 操作: `Ctrl+P` → "Compact Conversation"
- 動作: 古いメッセージを要約 (重要コンテキストは保持)

**Compact の仕組み** (`src/shotgun/prompts/history/summarization.j2`):

```jinja2
If agent listed files, code or retrieved parts of the code,
preserve it verbatim unless it's very long, then summarize it.
ALWAYS IN THE CONTEXT OF WHAT THE AGENT NEEDS.

# Timeline
- User: asked to handle task X: <summary>
- Assistant: handled by doing A, B, C...
- Tools used and output summary

# Current status, task and objectives
Based on the conversation, include the current status, task and objectives.
```

---

## 5. Interactive Mode と Non-Interactive Mode

### 5.1 Interactive Mode (デフォルト)

**特徴**: AI が積極的に質問する

**Structured Output Format**:

```json
{
  "response": "Your main response text here",
  "clarifying_questions": ["Question 1?", "Question 2?"]
}
```

**When to Use Clarifying Questions** (プロンプトより):

```jinja2
## When to Use Clarifying Questions

- BEFORE GETTING TO WORK: If the user's request is ambiguous
- DURING WORK: After using write_file(), suggest user review and ask questions
- Don't assume - ask for confirmation
- When in doubt, include clarifying_questions
```

**Example (Plan Agent)**:

```jinja2
{% if interactive_mode %}
USER INTERACTION - REDUCE UNCERTAINTY:

- FIRST read `research.md` and `specification.md` before asking ANY questions
- ONLY ask clarifying questions AFTER reading the context files
- Questions should be about gaps not covered in research/specification
- Use clarifying questions to gather specific details about:
  - Information not found in the context files
  - Clarifications on ambiguous specifications
  - Priorities when multiple options exist
- Better to ask 2-3 targeted questions than create a generic plan
{% endif %}
```

### 5.2 Non-Interactive Mode (CI/CD 用)

**特徴**: AI が自律的に判断

**使用シーン**:

```bash
shotgun plan "Implement OAuth2" --non-interactive
shotgun tasks "Break down payment feature" --non-interactive
```

**Agent Behavior** (プロンプトより):

```jinja2
{% else %}
NON-INTERACTIVE MODE - MAKE REASONABLE ASSUMPTIONS:

- Make reasonable assumptions based on industry best practices
- Use sensible defaults for technical constraints and timelines
- Create tasks with standard definitions of "done"
- Include common testing and quality assurance tasks
{% endif %}
```

---

## 6. Codebase Understanding Tools

### 6.1 Graph First, Then Files

**原則** (プロンプトより):

```jinja2
## Codebase Understanding Workflow

4. **Graph First, Then Files**: Query the knowledge graph to understand code structure:
   - Use natural language queries like "Show me the WebSocketServer class and its methods"
   - To find specific code snippet, use `retrieve_code` first, and only if you cannot find it, use the file system tools.
   - If entities are not found, try different variations or explore the file system
5. **Path Resolution**: When accessing files:
   - Always use the graph_id parameter
   - File paths are relative to the repository root
6. **Error Handling**: When errors occur:
   - If "entity not found", try alternative names or explore the file system
   - If "graph not found", verify the exact graph name with `list_graphs()`
```

### 6.2 Retrieve Code Tool

**使用例**:

```python
# 自然言語クエリ
query = "Show me the User class and its methods"

# Cypher 変換 (内部)
cypher = """
MATCH (c:Class {name: 'User'})-[:CONTAINS]->(m:Function)
RETURN c, m
"""

# 結果
"""
Class: User
- Methods:
  - __init__(self, email: str, username: str)
  - authenticate(self, password: str) -> bool
  - update_profile(self, data: dict) -> None
"""
```

---

## 7. 独自性の評価

### 7.1 他フレームワークとの差分

| 要素                     | spec-kit      | shotgun                       | claude-code-spec-workflow |
| ------------------------ | ------------- | ----------------------------- | ------------------------- |
| Codebase Graph           | ❌            | ✅ Neo4j                      | ❌                        |
| 5-Phase Workflow         | ⚠️ 6 フェーズ | ✅ 5 フェーズ (Research 強化) | ⚠️ 4 フェーズ             |
| TUI                      | ❌            | ✅ Textual ベース             | ❌                        |
| Contract Files           | ❌            | ✅ (prose と code 分離)       | ⚠️ (軽い分離)             |
| Interactive Mode         | ⚠️ 基本的     | ✅ Structured Output          | ⚠️ 基本的                 |
| Export to Multiple Tools | ❌            | ✅ (Cursor/Claude/Windsurf)   | ⚠️ (Claude のみ)          |

### 7.2 最大の独自性: Codebase Graph

**Why Unique?**

- 他フレームワーク: ファイル検索とテキストマッチング
- **shotgun**: グラフクエリで構造的に理解

**例**:

```
# 他ツール
grep -r "class User" src/  # テキストマッチング

# shotgun
MATCH (c:Class {name: 'User'})-[:CONTAINS]->(m:Function)
WHERE m.name CONTAINS 'auth'
RETURN m
# → User クラスの認証関連メソッドのみ抽出
```

---

## 8. 統合可能性

### 8.1 私たちのフレームワークへの統合アイデア

**採用すべき要素**:

1. **Research-First Approach**:

   - 用途: `/ikak:specify` 実行前に `/ikak:research` を推奨
   - 実装: コマンドテンプレートに「既存コード調査」ステップを追加

2. **Prose と Code の分離** (Contract Files):

   - 用途: `spec.md` に型定義を埋め込まない
   - 実装: `/specs/{feature}/contracts/` ディレクトリを作成

3. **時間参照の厳禁**:

   - 用途: `plan.md` で "Week 1-2" などを禁止
   - 実装: `/ikak:plan` コマンドに検証ルールを追加

4. **Structured Output for Questions**:

   - 用途: AI の質問を JSON 形式で返す
   - 実装: GitHub Copilot Chat で `clarifying_questions` フィールドを使用

5. **Compact Conversation**:
   - 用途: 長い会話のトークン削減
   - 実装: GitHub Copilot Chat のコンテキスト管理機能を活用

### 8.2 避けるべき要素

❌ **Neo4j Codebase Graph の完全移植**:

- 理由: セットアップが複雑 (Neo4j のインストールが必要)
- 代替: GitHub Copilot の既存コード検索機能を活用

❌ **TUI の実装**:

- 理由: GitHub Copilot Chat は VS Code 統合型
- 代替: VS Code の UI を利用

---

## 9. 弱点とリスク

### 9.1 Neo4j 依存

**問題**:

- Codebase Graph を使うには Neo4j のインストールが必要
- セットアップが複雑で初心者には敷居が高い

**対策**:

- Fallback: Neo4j なしでもファイル検索で動作するようにする

### 9.2 TUI のメンテナンスコスト

**問題**:

- Textual ライブラリへの依存
- CLI と TUI の二重実装

**shotgun の対応**:

- CLI は別途提供 (ドキュメントは `docs/CLI.md`)
- TUI を推奨 (UX が優れている)

### 9.3 Export フォーマットの乱立リスク

**問題**:

- 各 AI ツール (Cursor, Claude Code, Windsurf) で微妙に求められる形式が異なる
- メンテナンスコストが増大

**shotgun の対応**:

- `AGENTS.md` 標準フォーマット (https://agents.md/) に準拠
- Claude Code には `CLAUDE.md` という名前でエクスポート (内容は同じ)

---

## 10. まとめ

### 強み

1. ✅ **Codebase Graph**: Neo4j による構造的コード理解
2. ✅ **Research-First**: コードベース調査を最優先
3. ✅ **Prose/Code 分離**: `specification.md` と `contracts/` の明確な役割分担
4. ✅ **Time Reference 禁止**: "Week 1-2" などの時間参照を排除
5. ✅ **TUI**: 使いやすいターミナル UI
6. ✅ **Multi-Tool Export**: 複数の AI コーディングツール対応

### 弱み

1. ❌ Neo4j 依存 (セットアップが複雑)
2. ❌ TUI のメンテナンスコスト
3. ❌ Export フォーマットの乱立リスク

### 私たちのフレームワークへの示唆

**採用**:

- Research-First Approach
- Prose/Code 分離 (Contract Files)
- 時間参照の厳禁
- Structured Output for Questions
- Compact Conversation

**回避**:

- Neo4j Codebase Graph (GitHub Copilot の既存機能で代替)
- TUI (VS Code 統合を優先)

---

**次のステップ**: claude-code-spec-workflow の分析を完了し、全 6 フレームワークの比較表を更新する。
