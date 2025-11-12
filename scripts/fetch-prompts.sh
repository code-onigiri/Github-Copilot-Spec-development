#!/usr/bin/env bash
set -euo pipefail

# fetch-prompts.sh
# awesome-copilot から関連プロンプトをダウンロード/同期し、prompts/ 配下に正規化して保存します。
# 注意: ネットワーク要件あり。GH CLI または curl を使用します。

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROMPTS_DIR="$REPO_ROOT/prompts"
MANIFEST="$PROMPTS_DIR/manifest.json"
UPSTREAM_REPO="github/awesome-copilot"

echo "[fetch-prompts] start"

if ! command -v gh >/dev/null 2>&1; then
  echo "[fetch-prompts] gh CLI not found; falling back to curl read-only mode"
fi

mkdir -p "$PROMPTS_DIR"

# 現状はプレースホルダ: 必要な upstream パスを列挙して保存
# 本スクリプトは安全のため、既存ファイルがある場合は上書きせずに .upstream.md として保存

save_file() {
  local relpath="$1"  # 例: .github/prompts/typescript-mcp-server.instructions.md
  local outname
  outname="$(basename "$relpath")"
  local outpath="$PROMPTS_DIR/${outname%.md}.upstream.md"

  echo "[fetch-prompts] fetching $relpath -> $outpath"
  if command -v gh >/dev/null 2>&1; then
    gh api \
      repos/$UPSTREAM_REPO/contents/$relpath \
      -H "Accept: application/vnd.github.raw" >"$outpath" || echo "[warn] failed: $relpath"
  else
    curl -sSfL \
      "https://raw.githubusercontent.com/$UPSTREAM_REPO/main/$relpath" \
      -o "$outpath" || echo "[warn] failed: $relpath"
  fi
}

# 取得候補の例 (必要に応じて拡張)
UPSTREAM_FILES=(
  ".github/prompts/typescript-mcp-server.instructions.md"
  ".github/prompts/go-mcp-server-generator.prompt.md"
  ".github/prompts/rust-mcp-server-generator.prompt.md"
  ".github/prompts/java-mcp-server-generator.prompt.md"
  ".github/prompts/csharp-mcp-server-generator.prompt.md"
)

for f in "${UPSTREAM_FILES[@]}"; do
  save_file "$f"
done

echo "[fetch-prompts] done"
