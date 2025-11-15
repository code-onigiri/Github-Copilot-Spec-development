#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TMP_OUTPUT_DIR="$ROOT_DIR/tmp"
mkdir -p "$TMP_OUTPUT_DIR"
TARGET_PATH="${1:-$TMP_OUTPUT_DIR/copilot-spec-cli.tar.gz}"

echo "Packaging CLI tarball at $TARGET_PATH"

cd "$ROOT_DIR/cli"
npm install
npm run build

WORK_DIR="$(mktemp -d "$TMP_OUTPUT_DIR/copilot-spec-cli-XXXXXX")"
cp -R "$ROOT_DIR/cli" "$WORK_DIR/copilot-spec-cli"
rm -rf "$WORK_DIR/copilot-spec-cli/node_modules"

tar -C "$WORK_DIR" -czf "$TARGET_PATH" copilot-spec-cli

# rm -rf "$WORK_DIR"
echo "Tarball ready: $TARGET_PATH"