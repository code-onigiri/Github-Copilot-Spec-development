#!/bin/bash

# GitHub Copilot Spec-Driven Development - Uninstall Script
# Version: 1.0.0
# Description: Removes the spec-driven development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

confirm_uninstall() {
    print_header "Uninstall Confirmation"
    
    echo -e "${RED}WARNING: This will remove all spec-driven development files!${NC}"
    echo ""
    echo "The following will be removed:"
    echo "  • .github/copilot-instructions.md"
    echo "  • .github/prompts/"
    echo "  • .github/chatmodes/"
    echo "  • .github/instructions/"
    echo "  • .specify/"
    echo "  • memory/ (constitution, context, changelog)"
    echo "  • .vscode/settings.json (spec-development parts only)"
    echo ""
    echo -e "${YELLOW}Your specs/ directory will be preserved!${NC}"
    echo ""
    read -p "Are you sure you want to uninstall? (type 'yes' to confirm): " confirmation
    
    if [ "$confirmation" != "yes" ]; then
        print_info "Uninstall cancelled."
        exit 0
    fi
}

backup_specs() {
    print_header "Backing Up Specs"
    
    if [ -d "specs" ]; then
        local backup_name="specs-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
        print_info "Creating backup: $backup_name"
        tar -czf "$backup_name" specs/
        print_success "Specs backed up to: $backup_name"
    else
        print_info "No specs directory found, skipping backup"
    fi
}

remove_files() {
    print_header "Removing Spec-Development Files"
    
    # Remove .github files
    if [ -f ".github/copilot-instructions.md" ]; then
        rm .github/copilot-instructions.md
        print_success "Removed .github/copilot-instructions.md"
    fi
    
    if [ -d ".github/prompts" ]; then
        rm -rf .github/prompts
        print_success "Removed .github/prompts/"
    fi
    
    if [ -d ".github/chatmodes" ]; then
        rm -rf .github/chatmodes
        print_success "Removed .github/chatmodes/"
    fi
    
    if [ -d ".github/instructions" ]; then
        rm -rf .github/instructions
        print_success "Removed .github/instructions/"
    fi
    
    # Remove .specify
    if [ -d ".specify" ]; then
        rm -rf .specify
        print_success "Removed .specify/"
    fi
    
    # Remove memory
    if [ -d "memory" ]; then
        rm -rf memory
        print_success "Removed memory/"
    fi
    
    # Clean up .vscode if empty
    if [ -d ".vscode" ] && [ ! "$(ls -A .vscode)" ]; then
        rmdir .vscode
        print_success "Removed empty .vscode/"
    fi
}

cleanup_gitignore() {
    print_header "Cleaning Up .gitignore"
    
    if [ -f ".gitignore" ]; then
        # Remove spec-development section
        sed -i.bak '/# Spec-Driven Development/,/!specs\/\*\*\/\*.md/d' .gitignore 2>/dev/null || true
        rm -f .gitignore.bak
        print_success "Cleaned .gitignore"
    fi
}

print_completion() {
    print_header "Uninstall Complete"
    
    echo -e "${GREEN}Spec-Driven Development has been uninstalled.${NC}"
    echo ""
    echo "📁 Preserved:"
    echo "   ✅ specs/ directory (backed up)"
    echo ""
    echo "🗑️  Removed:"
    echo "   ❌ .github/copilot-instructions.md"
    echo "   ❌ .github/prompts/"
    echo "   ❌ .specify/"
    echo "   ❌ memory/"
    echo ""
    
    if ls specs-backup-*.tar.gz 1> /dev/null 2>&1; then
        echo "💾 Backup files:"
        ls -1 specs-backup-*.tar.gz
        echo ""
    fi
    
    echo "To reinstall, run:"
    echo "  ${BLUE}bash scripts/install.sh${NC}"
    echo "  or clone the repository and run install.sh from the scripts directory"
    echo ""
}

main() {
    print_header "GitHub Copilot Spec-Driven Development - Uninstall"
    
    # Check if we're in the right directory
    if [ ! -d ".github" ] && [ ! -d ".specify" ] && [ ! -d "memory" ]; then
        print_error "No spec-development installation found in current directory"
        exit 1
    fi
    
    # Confirm
    confirm_uninstall
    
    # Backup specs
    read -p "Create a backup of specs/ directory? (y/n) [y]: " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        backup_specs
    fi
    
    # Remove files
    remove_files
    
    # Cleanup
    cleanup_gitignore
    
    # Print completion
    print_completion
}

main "$@"
