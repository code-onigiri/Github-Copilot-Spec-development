#!/usr/bin/env bash
# Auto-deploy lint configs from Github-Copilot-Spec-development repository
# Usage: ./install-lint-config.sh [language] [--repo-path /path/to/spec/repo]
# Example: ./install-lint-config.sh typescript

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_URL="https://raw.githubusercontent.com/code-onigiri/Github-Copilot-Spec-development/main/lint"
REPO_PATH=""
TARGET_DIR="$(pwd)"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

usage() {
    cat <<EOF
Usage: $0 [language] [options]

Languages:
  typescript    TypeScript (.eslintrc.json, biome.json, tsconfig strict settings)
  go            Go (.golangci.yml)
  rust          Rust (clippy.toml, rustfmt.toml)
  java          Java (checkstyle.xml, spotbugs-exclude.xml)
  kotlin        Kotlin (.editorconfig, detekt.yml)
  swift         Swift (.swiftlint.yml, .swift-format)
  csharp        C# (.editorconfig)
  ruby          Ruby (.rubocop.yml)
  php           PHP (phpcs.xml.dist, phpstan.neon)
  all           All available languages

Options:
  --repo-path PATH   Use local repository instead of downloading from GitHub
  --help             Show this help message

Examples:
  # Download TypeScript configs from GitHub
  $0 typescript

  # Use local repository
  $0 typescript --repo-path /path/to/Github-Copilot-Spec-development

  # Install all configs
  $0 all
EOF
    exit 0
}

download_file() {
    local lang="$1"
    local filename="$2"
    local target_path="$3"

    if [[ -n "$REPO_PATH" ]]; then
        # Local repository mode
        local source_file="${REPO_PATH}/lint/${lang}/${filename}"
        if [[ -f "$source_file" ]]; then
            log_info "Copying ${filename} from local repo..."
            cp "$source_file" "$target_path"
        else
            log_error "File not found: ${source_file}"
            return 1
        fi
    else
        # GitHub download mode
        local url="${REPO_URL}/${lang}/${filename}"
        log_info "Downloading ${filename} from ${url}..."
        if command -v curl &> /dev/null; then
            curl -fsSL "$url" -o "$target_path"
        elif command -v wget &> /dev/null; then
            wget -q "$url" -O "$target_path"
        else
            log_error "Neither curl nor wget found. Please install one of them."
            return 1
        fi
    fi
}

backup_if_exists() {
    local file="$1"
    if [[ -f "$file" ]]; then
        local backup="${file}.backup.$(date +%Y%m%d_%H%M%S)"
        log_warn "File exists: ${file}, backing up to ${backup}"
        mv "$file" "$backup"
    fi
}

install_typescript() {
    log_info "Installing TypeScript lint configs..."
    backup_if_exists "${TARGET_DIR}/.eslintrc.json"
    backup_if_exists "${TARGET_DIR}/biome.json"
    
    download_file "typescript" ".eslintrc.json" "${TARGET_DIR}/.eslintrc.json"
    download_file "typescript" "biome.json" "${TARGET_DIR}/biome.json"
    
    log_info "TypeScript configs installed. Don't forget to:"
    echo "  - npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-import eslint-plugin-unused-imports"
    echo "  - OR npm install --save-dev @biomejs/biome"
    echo "  - Add 'lint' script to package.json: \"eslint . --max-warnings=0\" or \"biome check .\""
}

install_go() {
    log_info "Installing Go lint configs..."
    backup_if_exists "${TARGET_DIR}/.golangci.yml"
    
    download_file "go" ".golangci.yml" "${TARGET_DIR}/.golangci.yml"
    
    log_info "Go configs installed. Don't forget to:"
    echo "  - Install golangci-lint: https://golangci-lint.run/usage/install/"
    echo "  - Run: golangci-lint run"
}

install_rust() {
    log_info "Installing Rust lint configs..."
    backup_if_exists "${TARGET_DIR}/clippy.toml"
    backup_if_exists "${TARGET_DIR}/rustfmt.toml"
    
    download_file "rust" "clippy.toml" "${TARGET_DIR}/clippy.toml"
    download_file "rust" "rustfmt.toml" "${TARGET_DIR}/rustfmt.toml"
    
    log_info "Rust configs installed. Run:"
    echo "  - cargo fmt -- --check"
    echo "  - cargo clippy -- -D warnings"
}

install_java() {
    log_info "Installing Java lint configs..."
    mkdir -p "${TARGET_DIR}/config/checkstyle"
    mkdir -p "${TARGET_DIR}/config/spotbugs"
    
    backup_if_exists "${TARGET_DIR}/config/checkstyle/checkstyle.xml"
    backup_if_exists "${TARGET_DIR}/config/spotbugs/spotbugs-exclude.xml"
    
    download_file "java" "checkstyle.xml" "${TARGET_DIR}/config/checkstyle/checkstyle.xml"
    download_file "java" "spotbugs-exclude.xml" "${TARGET_DIR}/config/spotbugs/spotbugs-exclude.xml"
    
    log_info "Java configs installed. Add to build.gradle(.kts):"
    echo "  - Checkstyle plugin: configFile = file('config/checkstyle/checkstyle.xml')"
    echo "  - SpotBugs plugin: excludeFilter = file('config/spotbugs/spotbugs-exclude.xml')"
    echo "  - Spotless plugin with Google Java Format"
}

install_kotlin() {
    log_info "Installing Kotlin lint configs..."
    backup_if_exists "${TARGET_DIR}/.editorconfig"
    backup_if_exists "${TARGET_DIR}/detekt.yml"
    
    download_file "kotlin" ".editorconfig" "${TARGET_DIR}/.editorconfig"
    download_file "kotlin" "detekt.yml" "${TARGET_DIR}/detekt.yml"
    
    log_info "Kotlin configs installed. Add to build.gradle(.kts):"
    echo "  - ktlint plugin"
    echo "  - detekt plugin: detekt { config = files('detekt.yml') }"
}

install_swift() {
    log_info "Installing Swift lint configs..."
    backup_if_exists "${TARGET_DIR}/.swiftlint.yml"
    backup_if_exists "${TARGET_DIR}/.swift-format"
    
    download_file "swift" ".swiftlint.yml" "${TARGET_DIR}/.swiftlint.yml"
    download_file "swift" ".swift-format" "${TARGET_DIR}/.swift-format"
    
    log_info "Swift configs installed. Run:"
    echo "  - swiftlint --strict"
    echo "  - swift-format lint --recursive Sources"
}

install_csharp() {
    log_info "Installing C# lint configs..."
    backup_if_exists "${TARGET_DIR}/.editorconfig"
    
    download_file "csharp" ".editorconfig" "${TARGET_DIR}/.editorconfig"
    
    log_info "C# configs installed. Run:"
    echo "  - dotnet format --verify-no-changes"
    echo "  - dotnet build /warnaserror"
}

install_ruby() {
    log_info "Installing Ruby lint configs..."
    backup_if_exists "${TARGET_DIR}/.rubocop.yml"
    
    download_file "ruby" ".rubocop.yml" "${TARGET_DIR}/.rubocop.yml"
    
    log_info "Ruby configs installed. Run:"
    echo "  - bundle exec rubocop"
}

install_php() {
    log_info "Installing PHP lint configs..."
    backup_if_exists "${TARGET_DIR}/phpcs.xml.dist"
    backup_if_exists "${TARGET_DIR}/phpstan.neon"
    
    download_file "php" "phpcs.xml.dist" "${TARGET_DIR}/phpcs.xml.dist"
    download_file "php" "phpstan.neon" "${TARGET_DIR}/phpstan.neon"
    
    log_info "PHP configs installed. Run:"
    echo "  - vendor/bin/phpcs --standard=PSR12 src/"
    echo "  - vendor/bin/phpstan analyse --level=max src/"
}

install_all() {
    log_info "Installing all available lint configs..."
    install_typescript
    install_go
    install_rust
    install_java
    install_kotlin
    install_swift
    install_csharp
    install_ruby
    install_php
    log_info "All configs installed!"
}

# Parse arguments
if [[ $# -eq 0 ]]; then
    usage
fi

LANGUAGE=""
while [[ $# -gt 0 ]]; do
    case $1 in
        --help)
            usage
            ;;
        --repo-path)
            REPO_PATH="$2"
            if [[ ! -d "$REPO_PATH/lint" ]]; then
                log_error "Invalid repo path: ${REPO_PATH}/lint not found"
                exit 1
            fi
            shift 2
            ;;
        typescript|go|rust|java|kotlin|swift|csharp|ruby|php|all)
            LANGUAGE="$1"
            shift
            ;;
        *)
            log_error "Unknown argument: $1"
            usage
            ;;
    esac
done

if [[ -z "$LANGUAGE" ]]; then
    log_error "No language specified"
    usage
fi

# Execute installation
case $LANGUAGE in
    typescript) install_typescript ;;
    go) install_go ;;
    rust) install_rust ;;
    java) install_java ;;
    kotlin) install_kotlin ;;
    swift) install_swift ;;
    csharp) install_csharp ;;
    ruby) install_ruby ;;
    php) install_php ;;
    all) install_all ;;
esac

log_info "Done! Check ${TARGET_DIR} for installed configs."
