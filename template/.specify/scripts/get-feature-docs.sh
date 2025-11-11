#!/usr/bin/env bash
# Get feature documentation paths and available documents

set -euo pipefail

# Get repository root
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

# Check if feature name/number provided
if [[ $# -eq 0 ]]; then
    echo "Usage: get-feature-docs.sh <feature-name-or-number>"
    echo "Example: get-feature-docs.sh 001-user-auth"
    echo "Example: get-feature-docs.sh user-auth"
    exit 1
fi

FEATURE_INPUT="$1"

# Find feature directory
SPECS_DIR="$REPO_ROOT/specs"
FEATURE_DIR=""

if [[ -d "$SPECS_DIR/$FEATURE_INPUT" ]]; then
    # Exact match
    FEATURE_DIR="$SPECS_DIR/$FEATURE_INPUT"
elif [[ "$FEATURE_INPUT" =~ ^[0-9]{3}$ ]]; then
    # Just a number, find directory with that prefix
    for dir in "$SPECS_DIR"/${FEATURE_INPUT}-*/; do
        if [[ -d "$dir" ]]; then
            FEATURE_DIR="${dir%/}"
            break
        fi
    done
else
    # Search for partial match
    for dir in "$SPECS_DIR"/[0-9][0-9][0-9]-*/; do
        if [[ -d "$dir" && "${dir##*/}" == *"$FEATURE_INPUT"* ]]; then
            FEATURE_DIR="${dir%/}"
            break
        fi
    done
fi

if [[ -z "$FEATURE_DIR" || ! -d "$FEATURE_DIR" ]]; then
    echo "Error: Feature directory not found for '$FEATURE_INPUT'"
    exit 1
fi

# Check for available documents
AVAILABLE_DOCS=()

[[ -f "$FEATURE_DIR/spec.md" ]] && AVAILABLE_DOCS+=("spec.md")
[[ -f "$FEATURE_DIR/plan.md" ]] && AVAILABLE_DOCS+=("plan.md")
[[ -f "$FEATURE_DIR/research.md" ]] && AVAILABLE_DOCS+=("research.md")
[[ -f "$FEATURE_DIR/data-model.md" ]] && AVAILABLE_DOCS+=("data-model.md")
[[ -f "$FEATURE_DIR/quickstart.md" ]] && AVAILABLE_DOCS+=("quickstart.md")
[[ -f "$FEATURE_DIR/tasks.md" ]] && AVAILABLE_DOCS+=("tasks.md")
[[ -d "$FEATURE_DIR/contracts" ]] && AVAILABLE_DOCS+=("contracts/")

# Output in JSON format
DOCS_JSON=$(printf '"%s",' "${AVAILABLE_DOCS[@]}" | sed 's/,$//')
printf '{"FEATURE_DIR":"%s","AVAILABLE_DOCS":[%s],"FEATURE_NAME":"%s"}\n' \
    "$FEATURE_DIR" "$DOCS_JSON" "${FEATURE_DIR##*/}"
