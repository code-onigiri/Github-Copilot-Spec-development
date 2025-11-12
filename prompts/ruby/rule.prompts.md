# Ruby Coding Rules

This prompt enforces industry-standard coding rules and conventions for Ruby development.

## Style Guide Compliance

Follow the [Ruby Style Guide](https://rubystyle.guide/) and [Rails Style Guide](https://rails.rubystyle.guide/).

### RuboCop Configuration
```yaml
# .rubocop.yml
require:
  - rubocop-rails
  - rubocop-rspec
  - rubocop-performance

AllCops:
  TargetRubyVersion: 3.2
  NewCops: enable
  Exclude:
    - 'db/**/*'
    - 'config/**/*'
    - 'vendor/**/*'

Style/StringLiterals:
  EnforcedStyle: single_quotes

Style/Documentation:
  Enabled: true

Metrics/MethodLength:
  Max: 15
  
Metrics/ClassLength:
  Max: 100
```

## Naming Conventions

- **Classes/Modules**: `PascalCase` - `UserService`, `ApiClient`
- **Methods/Variables**: `snake_case` - `get_user`, `user_name`
- **Constants**: `SCREAMING_SNAKE_CASE` - `MAX_SIZE`, `API_KEY`
- **Files**: `snake_case` - `user_service.rb`
- **Predicates**: End with `?` - `active?`, `valid?`
- **Dangerous methods**: End with `!` - `save!`, `update!`

## Required Checks

```bash
# Format and lint
rubocop -A  # Auto-correct

# Tests
rspec
bundle exec rspec --format documentation

# Security
bundle audit check --update
brakeman -z  # For Rails apps
```

## Testing Requirements

### RSpec Standards
```ruby
# Use let for test data
let(:user) { create(:user) }
let!(:admin) { create(:user, :admin) }  # Use let! when needed immediately

# Use subject when testing instance
subject { described_class.new(params) }

# Use describe for methods, context for conditions
describe '#create_user' do
  context 'with valid params' do
    it 'creates user' do
      # test
    end
  end
  
  context 'with invalid params' do
    it 'raises error' do
      # test
    end
  end
end
```

### Coverage Requirements
- Minimum 90% coverage for Ruby/Rails
- Use SimpleCov for coverage reports
- Test all public methods
- Test edge cases and error paths

## CI/CD Requirements

```yaml
# .github/workflows/ci.yml
name: Ruby CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true
      - run: bundle exec rubocop
      - run: bundle exec rspec
      - run: bundle audit check --update
```

## Code Review Checklist

- [ ] Follows Ruby Style Guide
- [ ] RuboCop passes with no offenses
- [ ] All tests pass
- [ ] Code coverage ≥90%
- [ ] No security vulnerabilities (bundle audit)
- [ ] Public methods documented
- [ ] Error handling implemented
- [ ] No N+1 queries (Rails)
