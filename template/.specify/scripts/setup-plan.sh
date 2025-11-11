#!/usr/bin/env bash
# Setup implementation plan for a feature

set -euo pipefail

# Get repository root
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

# Check if feature name/number provided
if [[ $# -eq 0 ]]; then
    echo "Usage: setup-plan.sh <feature-name-or-number>"
    echo "Example: setup-plan.sh 001-user-auth"
    echo "Example: setup-plan.sh user-auth"
    exit 1
fi

FEATURE_INPUT="$1"

# Normalize feature directory name
if [[ "$FEATURE_INPUT" =~ ^[0-9]{3}- ]]; then
    # Already has number prefix
    FEATURE_NAME="$FEATURE_INPUT"
else
    # Find next number
    SPECS_DIR="$REPO_ROOT/specs"
    mkdir -p "$SPECS_DIR"
    
    # Get highest existing number
    HIGHEST=0
    for dir in "$SPECS_DIR"/[0-9][0-9][0-9]-*/; do
        if [[ -d "$dir" ]]; then
            NUM="${dir##*/}"
            NUM="${NUM%%-*}"
            if [[ "$NUM" =~ ^[0-9]{3}$ ]] && [[ "$NUM" -gt "$HIGHEST" ]]; then
                HIGHEST=$((10#$NUM))
            fi
        fi
    done
    
    # Next number
    NEXT=$((HIGHEST + 1))
    FEATURE_NUM=$(printf "%03d" $NEXT)
    FEATURE_NAME="${FEATURE_NUM}-${FEATURE_INPUT}"
fi

# Setup directories
FEATURE_DIR="$REPO_ROOT/specs/$FEATURE_NAME"
mkdir -p "$FEATURE_DIR"

FEATURE_SPEC="$FEATURE_DIR/spec.md"
IMPL_PLAN="$FEATURE_DIR/plan.md"

# Check for spec
if [[ ! -f "$FEATURE_SPEC" ]]; then
    echo "Warning: spec.md not found. Please run /ikak.specify first."
fi

# Copy plan template if plan doesn't exist
TEMPLATE="$REPO_ROOT/.specify/templates/plan-template.md"
if [[ ! -f "$IMPL_PLAN" && -f "$TEMPLATE" ]]; then
    cp "$TEMPLATE" "$IMPL_PLAN"
    echo "Created plan.md from template"
elif [[ ! -f "$IMPL_PLAN" ]]; then
    echo "Warning: Plan template not found at $TEMPLATE"
    touch "$IMPL_PLAN"
fi

# Get git info
HAS_GIT="false"
CURRENT_BRANCH="main"
if git rev-parse --git-dir >/dev/null 2>&1; then
    HAS_GIT="true"
    CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
fi

# Output in JSON format for easy parsing
printf '{"FEATURE_SPEC":"%s","IMPL_PLAN":"%s","FEATURE_DIR":"%s","BRANCH":"%s","HAS_GIT":"%s","FEATURE_NAME":"%s"}\n' \
    "$FEATURE_SPEC" "$IMPL_PLAN" "$FEATURE_DIR" "$CURRENT_BRANCH" "$HAS_GIT" "$FEATURE_NAME"
