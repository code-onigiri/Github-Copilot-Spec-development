# Ruby Best Practices

This prompt provides guidance for writing functional and efficient Ruby code.

## Core Principles

### Ruby Way
- Write code that reads like English
- Favor readability over cleverness
- Follow the "Principle of Least Surprise"
- Use Ruby idioms and conventions
- Embrace duck typing

### Object-Oriented Design
- Everything is an object
- Use classes and modules for organization
- Prefer composition over inheritance
- Keep classes small and focused
- Use mixins for shared behavior

```ruby
# ✅ Idiomatic Ruby
class User
  attr_reader :id, :name, :email
  
  def initialize(id:, name:, email:)
    @id = id
    @name = name
    @email = email
  end
  
  def active?
    @status == :active
  end
end

# Use symbols for internal identifiers
user.update(status: :active)

# Use blocks for iteration
users.each { |user| puts user.name }
users.select { |user| user.active? }
users.map(&:name)
```

## Enumerable and Collections

```ruby
# Use Enumerable methods
active_users = users.select(&:active?)
user_names = users.map(&:name)
total_age = users.sum(&:age)

# Use each_with_object for building collections
user_map = users.each_with_object({}) do |user, hash|
  hash[user.id] = user.name
end

# Use find vs detect (they're aliases, but find is more common)
user = users.find { |u| u.id == target_id }

# Use any? and all?
all_active = users.all?(&:active?)
has_inactive = users.any? { |u| !u.active? }
```

## Error Handling

```ruby
# Use begin/rescue/ensure
def read_file(path)
  File.read(path)
rescue Errno::ENOENT => e
  Rails.logger.error("File not found: #{path}")
  raise FileNotFoundError, "Cannot read #{path}"
ensure
  # cleanup code
end

# Custom exceptions
class ValidationError < StandardError
  attr_reader :field, :value
  
  def initialize(field, value)
    @field = field
    @value = value
    super("Invalid #{field}: #{value}")
  end
end

# Use raise instead of fail
raise ArgumentError, "User ID cannot be nil" if user_id.nil?

# Use throw/catch for control flow (not exceptions)
result = catch(:done) do
  items.each do |item|
    throw :done, item if item.valid?
  end
  nil
end
```

## Blocks, Procs, and Lambdas

```ruby
# Use blocks for DSLs and callbacks
User.transaction do
  user.save!
  user.send_welcome_email
end

# Use lambdas for stored procedures
validator = ->(value) { value.present? && value.length > 3 }
validator.call("test")  # => true

# Use procs for more flexible behavior
greeter = proc { |name| puts "Hello, #{name}!" }
greeter.call("World")

# Yield to blocks
def with_timing
  start = Time.now
  yield
  Time.now - start
end

duration = with_timing { expensive_operation }
```

## Metaprogramming

```ruby
# Use define_method for dynamic methods
class User
  [:name, :email, :phone].each do |attr|
    define_method("#{attr}_present?") do
      send(attr).present?
    end
  end
end

# Use method_missing carefully
class DynamicConfig
  def method_missing(method, *args)
    if method.to_s.end_with?('=')
      @config[method.to_s.chomp('=')] = args.first
    else
      @config[method.to_s]
    end
  end
  
  def respond_to_missing?(method, include_private = false)
    true
  end
end
```

## Testing with RSpec

```ruby
RSpec.describe UserService do
  describe '#create_user' do
    let(:valid_params) { { name: 'John', email: 'john@example.com' } }
    
    it 'creates user with valid params' do
      user = subject.create_user(valid_params)
      
      expect(user).to be_persisted
      expect(user.name).to eq('John')
    end
    
    it 'raises error with invalid email' do
      expect {
        subject.create_user(name: 'John', email: 'invalid')
      }.to raise_error(ValidationError)
    end
    
    context 'when user exists' do
      before { create(:user, email: 'john@example.com') }
      
      it 'raises duplicate error' do
        expect {
          subject.create_user(valid_params)
        }.to raise_error(DuplicateUserError)
      end
    end
  end
end
```

## Rails Best Practices

```ruby
# Use strong parameters
class UsersController < ApplicationController
  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to @user
    else
      render :new
    end
  end
  
  private
  
  def user_params
    params.require(:user).permit(:name, :email, :role)
  end
end

# Use concerns for shared behavior
module Timestamps
  extend ActiveSupport::Concern
  
  included do
    before_save :set_timestamps
  end
  
  private
  
  def set_timestamps
    self.updated_at = Time.current
  end
end

# Use scopes for common queries
class User < ApplicationRecord
  scope :active, -> { where(status: :active) }
  scope :recent, -> { where('created_at > ?', 1.week.ago) }
end
```

## Performance

```ruby
# Use find_each for large datasets
User.find_each(batch_size: 1000) do |user|
  user.process
end

# Use pluck for specific columns
user_ids = User.active.pluck(:id)

# Use select to load only needed columns
users = User.select(:id, :name, :email).where(active: true)

# Eager load associations
users = User.includes(:posts).where(active: true)
```

## Common Idioms

```ruby
# Safe navigation operator
user&.profile&.address&.city

# Double pipe for defaults
name = user.name || 'Anonymous'
config = options[:config] ||= default_config

# Use unless for negative conditions
process_user unless user.inactive?

# Use modifier if/unless for simple conditions
return if user.nil?
raise ArgumentError unless valid?

# Use guard clauses
def process_user(user)
  return if user.nil?
  return unless user.active?
  
  # main logic
end
```

## Resources
- [Ruby Style Guide](https://rubystyle.guide/)
- [The Ruby Programming Language](https://www.oreilly.com/library/view/the-ruby-programming/9780596516178/)
- [Eloquent Ruby](https://www.oreilly.com/library/view/eloquent-ruby/9780321700308/)
