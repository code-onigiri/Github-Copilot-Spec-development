# AI Update Guide for Language Prompts

This guide helps AI assistants easily update and add content to the language-specific prompts.

## Quick Reference

### File Structure
```
prompts/
├── {language}/
│   ├── code.prompts.md    # Best practices for functional code
│   └── rule.prompts.md    # Industry-standard coding rules
├── manifest.json          # Metadata and structure
├── README.md             # Human documentation
├── Source.md             # Attribution and licenses
└── AI_UPDATE_GUIDE.md    # This file
```

## Adding a New Language

### Step 1: Create Directory
```bash
mkdir prompts/{language}
```

### Step 2: Create `code.prompts.md`

Use this template:

```markdown
# {Language} Best Practices

This prompt provides guidance for writing functional and efficient {Language} code.

## Core Principles

### {Principle 1}
- Key concept 1
- Key concept 2
- Example pattern

```{language}
// Example code
```

### {Principle 2}
...

## Code Organization

### Project Structure
```
project/
  src/
    main.{ext}
```

## {Category} Patterns

```{language}
// Pattern example
```

## Testing

```{language}
// Test example
```

## Performance Optimization

### {Optimization Technique}
...

## Common Patterns

### {Pattern Name}
```{language}
// Implementation
```

## Common Pitfalls to Avoid

### Anti-Patterns
- ❌ {Bad practice}
- ❌ {Another bad practice}

### Best Practices
- ✅ {Good practice}
- ✅ {Another good practice}

## Resources

- [{Official Docs}]({url})
- [{Style Guide}]({url})
```

### Step 3: Create `rule.prompts.md`

Use this template:

```markdown
# {Language} Coding Rules

This prompt enforces industry-standard coding rules and conventions for {Language} development.

## Style Guide Compliance

Follow [{Official Style Guide}]({url}).

### Formatting
- Indentation: {spaces/tabs}
- Max line length: {number}
- {Other rules}

### {Formatter Tool} Configuration
```{config-format}
{configuration}
```

## Naming Conventions

- **Classes**: `{Case}` - Examples
- **Functions**: `{Case}` - Examples
- **Variables**: `{Case}` - Examples
- **Constants**: `{Case}` - Examples

## Code Quality - {Linter}

### Required Configuration
```{config-format}
{linter configuration}
```

### Forbidden Practices
- ❌ {Practice 1}
- ❌ {Practice 2}

## {Category} Standards

### {Subcategory}
```{language}
// ✅ Correct
{example}

// ❌ Incorrect
{counter-example}
```

## Testing Requirements

### {Test Framework} Standards
- Minimum {X}% code coverage
- {Other requirements}

```{language}
// Test example
```

## Documentation Standards

### Required Documentation
```{language}
/// {Documentation format}
```

## CI/CD Requirements

```yaml
# .github/workflows/ci.yml
{CI configuration}
```

## Code Review Checklist

- [ ] {Check 1}
- [ ] {Check 2}
- [ ] {Check 3}

## Enforcement

These rules are enforced through:
1. **{Tool 1}** - {Purpose}
2. **{Tool 2}** - {Purpose}
```

### Step 4: Update `manifest.json`

Add entry to the `languages` array:

```json
{
  "language": "{language}",
  "displayName": "{Display Name}",
  "directory": "{language}/",
  "prompts": [
    "{language}/code.prompts.md",
    "{language}/rule.prompts.md"
  ],
  "description": "{Brief description of language purpose}"
}
```

### Step 5: Update `Source.md`

Add attribution section:

```markdown
### {Language}

#### Best Practices Sources
- **[{Source Name}]({url})**
  - License: {license}
  - Used for: {purpose}

#### Coding Rules Sources
- **[{Source Name}]({url})**
  - License: {license}
  - Used for: {purpose}
```

## Updating Existing Content

### Updating Best Practices (`code.prompts.md`)

1. **Identify the section** to update (e.g., "Core Principles", "Testing", "Performance")
2. **Add new content** following the existing structure
3. **Include code examples** in the language syntax
4. **Reference official documentation** when applicable
5. **Update Source.md** if adding new sources

### Updating Coding Rules (`rule.prompts.md`)

1. **Identify the category** (e.g., "Naming Conventions", "Linting Rules")
2. **Add configuration examples** for tools
3. **Include correct vs incorrect examples**
4. **Update version numbers** for tools and compilers
5. **Update CI/CD configurations** with latest best practices

## Content Guidelines

### Do's ✅

- **Use official documentation** as primary source
- **Include code examples** for all patterns
- **Show both good and bad examples** with ✅/❌
- **Reference specific tool versions** when relevant
- **Provide complete configuration examples**
- **Link to external resources**
- **Keep language consistent** with existing prompts
- **Use markdown formatting** consistently

### Don'ts ❌

- **Don't copy large blocks** from copyrighted sources
- **Don't include outdated practices**
- **Don't mix multiple languages** in examples
- **Don't add opinions** without industry backing
- **Don't forget attribution** in Source.md
- **Don't use generic examples** - be language-specific
- **Don't skip testing sections**

## Content Structure Standards

### Section Order for `code.prompts.md`

1. Title and introduction
2. Core Principles (2-4 subsections)
3. Code Organization
4. Language-Specific Patterns
5. Error Handling (if applicable)
6. Testing
7. Performance Optimization
8. Common Patterns
9. Common Pitfalls to Avoid
10. Resources

### Section Order for `rule.prompts.md`

1. Title and introduction
2. Style Guide Compliance
3. Formatting
4. Naming Conventions
5. Code Quality Tools
6. Category-Specific Standards
7. Testing Requirements
8. Documentation Standards
9. CI/CD Requirements
10. Code Review Checklist
11. Enforcement

## AI-Specific Instructions

### When Asked to "Update" Prompts

1. **Read the existing file** completely
2. **Identify the specific section** mentioned
3. **Check Source.md** for referenced materials
4. **Add or modify content** following the structure
5. **Update Source.md** if using new references
6. **Verify code examples** are syntactically correct
7. **Maintain consistent tone** with existing content

### When Asked to "Add" a Language

1. **Create both files** from templates above
2. **Research official documentation** for the language
3. **Find the official style guide**
4. **Identify primary linting tools**
5. **Add complete examples** for each section
6. **Update all metadata files** (manifest.json, Source.md)
7. **Follow naming conventions** (lowercase directory names)

### When Asked to "Fix" Content

1. **Identify the issue** (incorrect information, outdated syntax, etc.)
2. **Verify the correction** against official docs
3. **Update the content** with accurate information
4. **Check if Source.md** needs updates
5. **Ensure code examples** compile/run correctly

## Tool Configurations

### Common Linters by Language

- **Rust**: clippy, rustfmt
- **TypeScript**: ESLint, Prettier/Biome
- **Go**: golangci-lint, gofmt
- **Java**: Checkstyle, SpotBugs, PMD
- **C#**: StyleCop, EditorConfig
- **Ruby**: RuboCop
- **PHP**: PHP CS Fixer, PHPStan
- **Swift**: SwiftLint, SwiftFormat
- **Kotlin**: Detekt, ktlint

### Version Standards

- Always specify **minimum required versions**
- Use **latest stable** versions for examples
- Note **breaking changes** between versions
- Include **migration notes** for major updates

## Example Patterns

### Error Handling Pattern Template

```markdown
## Error Handling

### {Pattern Name}
```{language}
// ✅ Correct: {explanation}
{good_example}

// ❌ Incorrect: {explanation}
{bad_example}
```

### Custom Error Types
```{language}
{example}
```
```

### Testing Pattern Template

```markdown
## Testing

### {Test Framework}
```{language}
{test_example}
```

### Test Organization
- Test file naming: `{pattern}`
- Test function naming: `{pattern}`
- Minimum coverage: {percentage}%
```

## Validation Checklist

Before committing updates:

- [ ] Code examples are syntactically correct
- [ ] All links work and point to current documentation
- [ ] Tool versions are up to date
- [ ] Both `code.prompts.md` and `rule.prompts.md` updated if needed
- [ ] `Source.md` updated with new references
- [ ] `manifest.json` reflects any structural changes
- [ ] Consistent formatting with existing files
- [ ] No copyrighted content without attribution
- [ ] All examples follow the language's conventions

## Quick Commands

### Count lines in a language's prompts
```bash
wc -l prompts/{language}/*.prompts.md
```

### Find all TODOs in prompts
```bash
grep -r "TODO\|FIXME" prompts/*/
```

### Validate JSON manifest
```bash
jq '.' prompts/manifest.json
```

### Check for broken links
```bash
find prompts -name "*.md" -exec grep -H "http" {} \;
```

## Getting Help

If you need clarification on:
- **Structure**: Read `README.md`
- **Licenses**: Check `Source.md`
- **Existing patterns**: Review any language directory
- **Manifest format**: Check `manifest.json`

## Maintenance Schedule

### Monthly
- [ ] Check for updated official documentation
- [ ] Verify tool versions are current
- [ ] Test code examples still compile
- [ ] Review and update deprecated patterns

### Quarterly
- [ ] Review all external links
- [ ] Update CI/CD configurations
- [ ] Check for new language versions
- [ ] Audit license information

### Annually
- [ ] Major version updates for tools
- [ ] Comprehensive content review
- [ ] Update all code examples
- [ ] Refresh benchmark data

---

**Version**: 1.0.0  
**Last Updated**: November 12, 2025  
**Maintained by**: code-onigiri  
**Purpose**: Enable easy AI-driven updates to language prompts
