#!/usr/bin/env python3
"""
generate-manifest.py
Scan the `prompts/` directory and produce a `prompts/manifest.json` manifest
that summarizes available prompt files by language.

Usage: python3 scripts/generate-manifest.py
"""
import json
from pathlib import Path
from datetime import datetime
import re

REPO_ROOT = Path(__file__).resolve().parent.parent
PROMPTS_DIR = REPO_ROOT / "prompts"
OUT_PATH = PROMPTS_DIR / "manifest.json"

LANG_DISPLAY = {
    "typescript": "TypeScript",
    "go": "Go",
    "rust": "Rust",
    "java": "Java",
    "kotlin": "Kotlin",
    "swift": "Swift",
    "csharp": "C#",
    "ruby": "Ruby",
    "php": "PHP",
}

def detect_language(fname: str) -> str | None:
    # common patterns:
    # prompt-for-<lang>.prompt.md
    m = re.match(r"prompt-for-([a-z0-9]+)\.prompt\.md$", fname)
    if m:
        return m.group(1)
    # <lang>-prompts-for-[]-generator.prompt.md or go-prompts-for-... pattern
    m = re.match(r"([a-z0-9]+)-prompts-for-.*\.prompt\.md$", fname)
    if m:
        return m.group(1)
    # fallback: <lang>-mcp-server-generator.prompt.md
    m = re.match(r"([a-z0-9]+)-mcp-server-generator\.prompt\.md$", fname)
    if m:
        return m.group(1)
    # instructions or other files: typescript-mcp-server.instructions.md
    m = re.match(r"([a-z0-9]+)-mcp-server\.instructions\.md$", fname)
    if m:
        return m.group(1)
    return None

def display_name(lang: str) -> str:
    return LANG_DISPLAY.get(lang, lang.capitalize())

def main() -> int:
    if not PROMPTS_DIR.exists():
        print(f"Prompts dir not found: {PROMPTS_DIR}")
        return 1

    files = sorted([p for p in PROMPTS_DIR.iterdir() if p.is_file() and p.suffix == '.md'])

    languages: dict[str, dict] = {}

    for f in files:
        lang = detect_language(f.name)
        if not lang:
            # skip files that aren't language prompts
            continue

        with f.open('r', encoding='utf-8') as fh:
            lines = fh.read().splitlines()

        entry = languages.setdefault(lang, {
            'language': lang,
            'displayName': display_name(lang),
            'prompts': [],
            'lines': 0,
            'description': '',
        })

        entry['prompts'].append(f.name)
        entry['lines'] += len(lines)

    # build manifest
    manifest = {
        "$schema": "https://json-schema.org/draft-07/schema#",
        "title": "Model Context Protocol Server Generator Prompts Manifest",
        "schemaVersion": "2.0.0",
        "generated": datetime.utcnow().isoformat() + 'Z',
        "metadata": {
            "total_prompts": sum(len(v['prompts']) for v in languages.values()),
            "total_lines": sum(v['lines'] for v in languages.values()),
            "generated_by": "scripts/generate-manifest.py",
        },
        "languages": [],
        "lint": {
            "repository_path": "../lint/",
            "auto_installer": "../scripts/install-lint-config.sh",
            "usage": "scripts/install-lint-config.sh {language} [--repo-path PATH]"
        },
        "ai_agent_workflow": [
            "1. User requests server generation for language X",
            "2. Read prompts/{language}-prompts prompt files",
            "3. Run scripts/install-lint-config.sh {language} --repo-path .",
            "4. Generate code following prompt Inputs/Workflow/Output structure",
            "5. Run lint commands with cli_flags from manifest",
            "6. Validate against Validation section requirements",
            "7. Commit if all checks pass (zero errors/warnings)"
        ]
    }

    # sort languages by name for deterministic output
    for lang in sorted(languages.keys()):
        manifest['languages'].append(languages[lang])

    OUT_PATH.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding='utf-8')
    print(f"manifest written: {OUT_PATH}")
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
