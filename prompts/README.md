# Language-Specific Coding Prompts

This directory contains language-specific coding best practices and industry-standard rules to help developers write functional, efficient, and maintainable code.

## Directory Structure

Each programming language has its own directory containing two essential prompt files:

```
prompts/
├── rust/
│   ├── code.prompts.md    # Rust best practices
│   └── rule.prompts.md    # Rust coding rules
├── typescript/
│   ├── code.prompts.md    # TypeScript best practices
│   └── rule.prompts.md    # TypeScript coding rules
├── go/
│   ├── code.prompts.md    # Go best practices
│   └── rule.prompts.md    # Go coding rules
├── java/
│   ├── code.prompts.md    # Java best practices
│   └── rule.prompts.md    # Java coding rules
├── csharp/
│   ├── code.prompts.md    # C# best practices
│   └── rule.prompts.md    # C# coding rules
├── ruby/
│   ├── code.prompts.md    # Ruby best practices
│   └── rule.prompts.md    # Ruby coding rules
├── php/
│   ├── code.prompts.md    # PHP best practices
│   └── rule.prompts.md    # PHP coding rules
├── swift/
│   ├── code.prompts.md    # Swift best practices
│   └── rule.prompts.md    # Swift coding rules
├── kotlin/
│   ├── code.prompts.md    # Kotlin best practices
│   └── rule.prompts.md    # Kotlin coding rules
├── manifest.json          # Metadata and structure definition
├── README.md              # This file (human documentation)
├── Source.md              # Attribution, licenses, and references
└── AI_UPDATE_GUIDE.md     # Guide for AI to update content
```

## File Types

### `code.prompts.md` - Best Practices
Contains language-specific best practices for writing **functional and efficient code**:

- **Core Principles**: Fundamental concepts and paradigms
- **Code Organization**: Project structure and module organization
- **Idiomatic Patterns**: Language-specific patterns and idioms
- **Performance Optimization**: Tips for writing efficient code
- **Testing**: Testing frameworks and best practices
- **Common Pitfalls**: Anti-patterns to avoid
- **Resources**: Links to official documentation and guides

**Purpose**: Help developers write code that is:
- Functionally correct
- Performance optimized
- Idiomatic to the language
- Easy to understand and maintain

### `rule.prompts.md` - Coding Rules
Contains **industry-standard coding rules and conventions**:

- **Style Guide Compliance**: Official style guides and standards
- **Formatting Rules**: Indentation, line length, naming conventions
- **Code Quality Tools**: Linters, formatters, static analyzers
- **Naming Conventions**: Consistent naming across the codebase
- **Documentation Standards**: Required documentation and comments
- **Testing Requirements**: Coverage requirements and testing standards
- **CI/CD Requirements**: Automated checks and quality gates
- **Code Review Checklist**: Pre-commit and pre-merge checks

**Purpose**: Ensure code quality through:
- Consistent style and formatting
- Automated quality checks
- Industry-standard conventions
- Enforceable rules and policies

## Supported Languages

| Language | Description | Key Features |
|----------|-------------|--------------|
| **Rust** | Systems programming | Memory safety, zero-cost abstractions |
| **TypeScript** | Type-safe JavaScript | Static typing, modern JavaScript features |
| **Go** | Cloud-native development | Simplicity, built-in concurrency |
| **Java** | Enterprise applications | Object-oriented, JVM ecosystem |
| **C#** | .NET ecosystem | Modern features, cross-platform |
| **Ruby** | Web development | Developer happiness, Rails framework |
| **PHP** | Web applications | Server-side scripting, WordPress ecosystem |
| **Swift** | Apple platforms | Modern, safe, fast |
| **Kotlin** | Android & JVM | Concise, safe, interoperable |

## How to Use

### For Developers

1. **Navigate to your language directory**
   ```bash
   cd prompts/typescript/
   ```

2. **Read the best practices**
   - Open `code.prompts.md` to learn best practices
   - Focus on idiomatic patterns and performance tips

3. **Follow the coding rules**
   - Open `rule.prompts.md` to understand quality standards
   - Set up required tools (linters, formatters)
   - Configure CI/CD according to the guidelines

### For AI Assistants

When helping with code in a specific language:

1. **Consult the language directory** for context
2. **Apply best practices** from `code.prompts.md`
3. **Enforce coding rules** from `rule.prompts.md`
4. **Generate code** that follows both guidelines

### For Teams

1. **Adopt the rules** as team standards
2. **Configure tools** according to `rule.prompts.md`
3. **Set up CI/CD** with required quality checks
4. **Use the code review checklist** before merging

## Purpose and Goals

This prompt structure is designed to:

✅ **Enable Functional Development**
- Write code that works correctly
- Follow language-specific best practices
- Optimize for performance and efficiency

✅ **Ensure Code Quality**
- Maintain consistent style
- Enforce industry standards
- Automate quality checks

✅ **Improve Maintainability**
- Use idiomatic patterns
- Write self-documenting code
- Follow established conventions

✅ **Support Team Collaboration**
- Consistent coding standards
- Clear quality expectations
- Automated enforcement

## Manifest File

The `manifest.json` file contains:
- Metadata about all languages
- Directory structure information
- Usage guidelines
- AI workflow instructions

## Additional Documentation

- **[Source.md](Source.md)** - Complete attribution, licenses, and references for all content
- **[AI_UPDATE_GUIDE.md](AI_UPDATE_GUIDE.md)** - Guide for AI assistants to easily update and add content

## Contributing

When adding a new language:

1. Create a new directory: `prompts/[language]/`
2. Add `code.prompts.md` with best practices
3. Add `rule.prompts.md` with coding rules
4. Update `manifest.json` with the new language
5. Add attribution to `Source.md` with proper licenses

For detailed instructions, see [AI_UPDATE_GUIDE.md](AI_UPDATE_GUIDE.md).

## Version History

- **v3.0.0** (2025-11-12): Complete restructure into language directories
  - Separated best practices (`code.prompts.md`) from rules (`rule.prompts.md`)
  - Created organized directory structure per language
  - Updated manifest to reflect new structure
  - Added `Source.md` for attribution and licenses
  - Added `AI_UPDATE_GUIDE.md` for easy AI-driven updates

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.

All content sources are properly attributed in [Source.md](Source.md) with their respective licenses.

---

**Last Updated**: November 12, 2025  
**Structure Version**: 3.0.0
