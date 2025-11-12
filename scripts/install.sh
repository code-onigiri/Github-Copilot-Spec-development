#!/usr/bin/env bash

# GitHub Copilot Spec-Driven Development - Setup Script
# Version: 1.0.0
# Description: Installs and configures the spec-driven development environment

set -euo pipefail  # Exit on error, undefined var errors, and fail on pipe errors

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Functions
print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

check_prerequisites() {
    print_header "Checking Prerequisites"
    
    local all_ok=true
    
    # Check Git
    if command -v git &> /dev/null; then
        print_success "Git is installed ($(git --version))"
    else
        print_error "Git is not installed"
        all_ok=false
    fi
    
    # Check VS Code
    if command -v code &> /dev/null; then
        print_success "VS Code is installed"
    else
        print_warning "VS Code is not found in PATH"
        print_info "You can still use this framework, but VS Code integration won't work"
    fi
    
    # Check if we're in a git repository
    if git rev-parse --git-dir > /dev/null 2>&1; then
        print_success "Running in a Git repository"
    else
        print_warning "Not in a Git repository"
        print_info "Consider initializing: git init"
    fi
    
    if [ "$all_ok" = false ]; then
        print_error "Some prerequisites are missing. Please install them first."
        exit 1
    fi
}

detect_installation_mode() {
    print_header "Detecting Installation Mode"
    
    # Check if we're in the spec-development repo itself
    # Prefer a reliable existence check of the bundled template directory
    if [ -d "$PROJECT_ROOT/template" ]; then
        echo "existing"
        print_info "Detected: Existing spec-development repository (template/ found)"
        print_info "Mode: Copy templates from template/ directory"
    else
        echo "new"
        print_info "Detected: New project"
        print_info "Mode: Copy templates to current project"
    fi
}

setup_directory_structure() {
    print_header "Setting Up Directory Structure"
    
    local target_dir="${1:-.}"
    
    # Create main directories
    mkdir -p "$target_dir/.github/prompts"
    mkdir -p "$target_dir/.github/chatmodes"
    mkdir -p "$target_dir/.github/instructions"
    mkdir -p "$target_dir/.specify/templates/commands"
    mkdir -p "$target_dir/.specify/scripts"
    mkdir -p "$target_dir/memory/context"
    mkdir -p "$target_dir/memory/changelog"
    mkdir -p "$target_dir/specs"
    
    print_success "Directory structure created"
}

copy_templates() {
    print_header "Copying Templates"
    
    local source_dir="$PROJECT_ROOT/template"
    local target_dir="${1:-.}"
    
    # Check if template directory exists
    if [ ! -d "$source_dir" ]; then
        print_error "Template directory not found: $source_dir"
        exit 1
    fi
    
    # Copy .github files
    if [ -d "$source_dir/.github" ]; then
        print_info "Copying GitHub configuration files..."
        cp -r "$source_dir/.github/prompts/"* "$target_dir/.github/prompts/" 2>/dev/null || true
        cp -r "$source_dir/.github/chatmodes/"* "$target_dir/.github/chatmodes/" 2>/dev/null || true
        cp -r "$source_dir/.github/instructions/"* "$target_dir/.github/instructions/" 2>/dev/null || true
        cp "$source_dir/.github/copilot-instructions.md" "$target_dir/.github/" 2>/dev/null || true
        print_success "GitHub configuration copied"
    fi
    
    # Copy .specify templates
    if [ -d "$source_dir/.specify" ]; then
        print_info "Copying spec templates..."
        cp -r "$source_dir/.specify/templates/"* "$target_dir/.specify/templates/" 2>/dev/null || true
        cp -r "$source_dir/.specify/scripts/"* "$target_dir/.specify/scripts/" 2>/dev/null || true
        print_success "Spec templates copied"
    fi
    
    # Copy memory templates
    if [ -d "$source_dir/memory" ]; then
        print_info "Copying memory templates..."
        cp "$source_dir/memory/constitution.md" "$target_dir/memory/" 2>/dev/null || true
        cp "$source_dir/memory/README.md" "$target_dir/memory/" 2>/dev/null || true
        cp -r "$source_dir/memory/context/"* "$target_dir/memory/context/" 2>/dev/null || true
        cp -r "$source_dir/memory/changelog/"* "$target_dir/memory/changelog/" 2>/dev/null || true
        print_success "Memory templates copied"
    fi
}

create_project_status() {
    print_header "Creating Project Status File"
    
    local target_dir="${1:-.}"
    local project_name="${2:-My Project}"
    
    cat > "$target_dir/memory/project-status.md" <<EOF
# Project Status

**Project Name**: $project_name
**Created**: $(date +%Y-%m-%d)
**Last Updated**: $(date +%Y-%m-%d)

## Features

No features yet. Run \`/ikak:specify\` to create your first feature!

## Progress Summary

- Total Features: 0
- Completed: 0
- In Progress: 0
- Not Started: 0

## Next Steps

1. Run \`/ikak:constitution\` to set up your project principles
2. Run \`/ikak:specify "your feature"\` to create your first specification
3. Start developing!
EOF

    print_success "Project status file created"
}

setup_vscode_integration() {
    print_header "Setting Up VS Code Integration"
    
    local target_dir="${1:-.}"
    
    mkdir -p "$target_dir/.vscode"
    
    # Create settings.json
    cat > "$target_dir/.vscode/settings.json" <<'EOF'
{
  "github.copilot.enable": {
    "*": true
  },
  "github.copilot.editor.enableAutoCompletions": true,
  "files.associations": {
    "*.prompt.md": "markdown",
    "*.chatmode.md": "markdown",
    "*.instructions.md": "markdown"
  },
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/bower_components": true,
    "**/.git": true
  }
}
EOF

    print_success "VS Code settings created"
    
    # Create extensions.json
    cat > "$target_dir/.vscode/extensions.json" <<'EOF'
{
  "recommendations": [
    "github.copilot",
    "github.copilot-chat"
  ]
}
EOF

    print_success "VS Code extensions recommendations created"
}

create_gitignore() {
    print_header "Creating .gitignore"
    
    local target_dir="${1:-.}"
    
    if [ -f "$target_dir/.gitignore" ]; then
        print_info ".gitignore already exists, appending spec-development entries..."
        echo "" >> "$target_dir/.gitignore"
        echo "# Spec-Driven Development" >> "$target_dir/.gitignore"
    else
        cat > "$target_dir/.gitignore" <<'EOF'
# Spec-Driven Development
EOF
    fi
    
    cat >> "$target_dir/.gitignore" <<'EOF'
.DS_Store
*.swp
*.swo
*~

# IDE
.vscode/settings.json
.idea/

# Temporary files
*.tmp
*.bak

# Don't ignore spec files
!specs/**/*.md
!memory/**/*.md
EOF

    print_success ".gitignore configured"
}

run_interactive_constitution() {
    print_header "Interactive Constitution Setup"
    
    echo -e "${YELLOW}Would you like to create your project constitution now?${NC}"
    echo "This will guide you through setting up your development principles."
    echo ""
    read -p "Create constitution now? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Opening VS Code to run /ikak:constitution..."
        print_info "In VS Code, open GitHub Copilot Chat and run: /ikak:constitution"
        
        if command -v code &> /dev/null; then
            code .
        else
            print_warning "VS Code not found. Please open your project and run /ikak:constitution manually."
        fi
    else
        print_info "Skipping constitution setup. You can run it later with: /ikak:constitution"
    fi
}

generate_readme() {
    print_header "Generating Project README"
    
    local target_dir="${1:-.}"
    local project_name="${2:-My Project}"
    
    if [ -f "$target_dir/README.md" ]; then
        print_info "README.md already exists, creating SPEC-DEVELOPMENT.md instead..."
        local readme_file="$target_dir/SPEC-DEVELOPMENT.md"
    else
        local readme_file="$target_dir/README.md"
    fi
    
    cat > "$readme_file" <<EOF
# $project_name

Developed using [GitHub Copilot Spec-Driven Development](https://github.com/code-onigiri/Github-Copilot-Spec-development)

## Quick Start

### 1. Create Project Constitution (First Time)

\`\`\`text
/ikak:constitution
\`\`\`

### 2. Create a Feature Specification

\`\`\`text
/ikak:specify "Your feature description"
\`\`\`

### 3. Generate Implementation Plan

\`\`\`text
/ikak:plan "Your tech stack info"
\`\`\`

### 4. Break Down Into Tasks

\`\`\`text
/ikak:tasks
\`\`\`

### 5. Implement Tasks

\`\`\`text
/ikak:implement T001
\`\`\`

### 6. Debug Issues (if needed)

\`\`\`text
/ikak:debug "Issue description"
\`\`\`

### 7. Check Status

\`\`\`text
/ikak:status
\`\`\`

## Project Structure

\`\`\`
.
├── .github/
│   ├── copilot-instructions.md   # AI instructions
│   ├── prompts/                  # Reusable prompts
│   ├── chatmodes/                # Custom chat modes
│   └── instructions/             # Path-specific instructions
├── .specify/
│   ├── templates/                # Spec templates
│   └── scripts/                  # Helper scripts
├── memory/
│   ├── constitution.md           # Project principles
│   ├── context/                  # Project knowledge
│   └── changelog/                # Change history
└── specs/
    └── [###-feature-name]/
        ├── spec.md               # Feature specification
        ├── plan.md               # Implementation plan
        ├── tasks.md              # Task breakdown
        └── ...
\`\`\`

## Documentation

- Full framework guide: [GitHub Copilot Spec-Driven Development](https://github.com/code-onigiri/Github-Copilot-Spec-development)

## Features

See \`memory/project-status.md\` for current feature list and progress.
EOF

    print_success "README created: $readme_file"
}

print_completion_summary() {
    print_header "Installation Complete! 🎉"
    
    echo -e "${GREEN}GitHub Copilot Spec-Driven Development is now set up!${NC}"
    echo ""
    echo "📁 Files created:"
    echo "   ✅ .github/copilot-instructions.md"
    echo "   ✅ .github/prompts/* (10 prompts)"
    echo "   ✅ .specify/templates/*"
    echo "   ✅ memory/constitution.md (template)"
    echo "   ✅ memory/context/* (4 context files)"
    echo "   ✅ .vscode/settings.json"
    echo ""
    echo "🚀 Next Steps:"
    echo ""
    echo "   1. Open your project in VS Code:"
    echo "      ${BLUE}code .${NC}"
    echo ""
    echo "   2. Create your project constitution:"
    echo "      ${BLUE}/ikak:constitution${NC}"
    echo ""
    echo "   3. Create your first feature:"
    echo "      ${BLUE}/ikak:specify \"your feature description\"${NC}"
    echo ""
    echo "📚 Documentation:"
    echo "   • Full Guide: https://github.com/code-onigiri/Github-Copilot-Spec-development"
    echo "   • Commands: See .github/copilot-instructions.md"
    echo ""
    echo "💡 Tips:"
    echo "   • All commands start with ${BLUE}/ikak:${NC}"
    echo "   • Constitution defines your project principles"
    echo "   • Specs are stored in ${BLUE}specs/###-feature-name/${NC}"
    echo ""
}

# Main installation flow
main() {
    print_header "GitHub Copilot Spec-Driven Development - Setup"
    
    echo "This script will set up the spec-driven development environment."
    echo ""
    
    # Get project name
    read -p "Enter your project name [My Project]: " project_name
    project_name=${project_name:-"My Project"}
    
    # Get target directory
    read -p "Install in current directory? (y/n) [y]: " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        read -p "Enter target directory path: " target_dir
        target_dir=${target_dir:-"."}
        
        if [ ! -d "$target_dir" ]; then
            print_info "Creating directory: $target_dir"
            mkdir -p "$target_dir"
        fi
    else
        target_dir="."
    fi
    
    # Check prerequisites
    check_prerequisites
    
    # Detect mode
    mode=$(detect_installation_mode)
    
    if [ "$mode" = "new" ]; then
        # New project installation
        setup_directory_structure "$target_dir"
        copy_templates "$target_dir"
        create_project_status "$target_dir" "$project_name"
        setup_vscode_integration "$target_dir"
        create_gitignore "$target_dir"
        generate_readme "$target_dir" "$project_name"
    else
        # Existing repo - just ensure structure
        setup_directory_structure "$target_dir"
        create_project_status "$target_dir" "$project_name"
        setup_vscode_integration "$target_dir"
    fi
    
    # Print completion summary
    print_completion_summary
    
    # Interactive constitution
    run_interactive_constitution
}

# Run main function
main "$@"
