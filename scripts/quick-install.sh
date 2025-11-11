#!/bin/bash

# Quick Install Script for GitHub Copilot Spec-Driven Development
# Usage: curl -fsSL https://raw.githubusercontent.com/code-onigiri/Github-Copilot-Spec-development/main/scripts/quick-install.sh | bash

set -e

REPO_URL="https://github.com/code-onigiri/Github-Copilot-Spec-development.git"
TEMP_DIR=$(mktemp -d)

echo "🚀 GitHub Copilot Spec-Driven Development - Quick Install"
echo ""
echo "Downloading latest version..."

# Clone the repository to temp directory
git clone --depth 1 "$REPO_URL" "$TEMP_DIR" 2>&1 | grep -v "Cloning into" || true

# Run the install script
bash "$TEMP_DIR/scripts/install.sh"

# Cleanup
rm -rf "$TEMP_DIR"

echo ""
echo "✨ Installation complete!"
