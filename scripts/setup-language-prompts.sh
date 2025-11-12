#!/usr/bin/env bash
set -euo pipefail

# setup-language-prompts.sh
# リポジトリから主要言語を自動検出し、必要なプロンプトを manifest と突き合わせて不足分を生成/通知します。

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROMPTS_DIR="$REPO_ROOT/prompts"
MANIFEST="$PROMPTS_DIR/manifest.json"
META_DIR="$REPO_ROOT/memory/language-meta"

mkdir -p "$META_DIR"

if [ ! -f "$MANIFEST" ]; then
  echo "[error] manifest.json not found in prompts/"
  echo "[info] The manifest should be AI-managed. Please ensure prompts/manifest.json exists."
  exit 1
fi

PRIMARY_LANG=""

# 拡張子→言語の簡易マッピング
map_ext() {
  case "$1" in
    ts|tsx|js|jsx) echo "typescript" ;;
    go) echo "go" ;;
    rs) echo "rust" ;;
    java) echo "java" ;;
    cs) echo "csharp" ;;
    rb) echo "ruby" ;;
    php) echo "php" ;;
    swift) echo "swift" ;;
    kt|kts) echo "kotlin" ;;
    *) echo "" ;;
  esac
}

# 言語頻度カウント
declare -A counts
while IFS= read -r -d '' file; do
  ext="${file##*.}"
  lang="$(map_ext "$ext")"
  if [ -n "$lang" ]; then
    counts[$lang]=$(( ${counts[$lang]:-0} + 1 ))
  fi
done < <(find "$REPO_ROOT" -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.go' -o -name '*.rs' -o -name '*.java' -o -name '*.cs' -o -name '*.rb' -o -name '*.php' -o -name '*.swift' -o -name '*.kt' -o -name '*.kts' \) -print0)

# 最大頻度言語を primary に
max=0
for lang in "${!counts[@]}"; do
  if [ ${counts[$lang]} -gt $max ]; then
    max=${counts[$lang]}
    PRIMARY_LANG=$lang
  fi
done

if [ -z "$PRIMARY_LANG" ]; then
  echo "[info] No primary language detected (empty or unsupported)."
else
  echo "[info] Primary language: $PRIMARY_LANG (files: $max)"
fi

# manifest と付き合わせて不足プロンプト確認
missing=()

# jq があれば正確に、なければ grep で簡易処理
if command -v jq >/dev/null 2>&1; then
  for lang in "${!counts[@]}"; do
    present=$(jq -r --arg l "$lang" '.languages[] | select(.language==$l) | .prompts[]?' "$MANIFEST" 2>/dev/null || true)
    if [ -z "$present" ]; then
      missing+=("$lang")
    fi
  done
else
  # 簡易: manifest.json 内の言語文字列有無で判定
  for lang in "${!counts[@]}"; do
    if ! grep -q "\"language\": \"$lang\"" "$MANIFEST"; then
      missing+=("$lang")
    fi
  done
fi

# メタ情報 JSON 生成
meta_file="$META_DIR/detected.json"
{
  echo '{'
  echo '  "detected": {'
  # Print detected language counts with proper commas
  i=0
  for lang in "${!counts[@]}"; do
    if [ "$i" -gt 0 ]; then
      echo ','
    fi
    printf '    "%s": %s' "$lang" "${counts[$lang]}"
    i=$((i+1))
  done
  echo
  echo '  },'
  echo "  \"primary\": \"$PRIMARY_LANG\","
  # missingPrompts array
  echo -n '  "missingPrompts": ['
  for idx in "${!missing[@]}"; do
    if [ "$idx" -gt 0 ]; then
      echo -n ', '
    fi
    echo -n "\"${missing[$idx]}\""
  done
  echo ']'
  echo '}'
} > "$meta_file"

echo "[info] meta written: $meta_file"

if [ ${#missing[@]} -gt 0 ]; then
  echo "[warn] Missing prompt definitions for: ${missing[*]}"
  echo "       -> create 'prompt-for-<language>.prompt.md' using template."
fi

echo "[done] setup-language-prompts"
