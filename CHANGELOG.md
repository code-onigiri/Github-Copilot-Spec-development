# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-11-12

### Breaking Changes

- Removed Python dependency (scripts/generate-manifest.py)
- Removed quick-install script (scripts/quick-install.sh)
- Restructured documentation with English-first approach

### Added

- **AI-Managed Memory System**
  - Comprehensive `template/memory/README.md` explaining AI-managed memory
  - Enhanced copilot instructions with AI memory management responsibilities
  - Three-layer memory architecture (Constitution, Context, Changelog)

- **Japanese Documentation**
  - Created `docs/ja/` directory for Japanese documentation
  - `docs/ja/README.ja.md` - Japanese README
  - `docs/ja/GUIDE.ja.md` - Complete Japanese guide
  - `docs/ja/SUMMARY.ja.md` - Japanese project summary

- **Production-Ready Focus**
  - Updated README.md to emphasize production use
  - Enhanced documentation to clarify this is not for prototypes
  - Added production-ready architecture details

### Changed

- **README.md** - Completely rewritten with English-first, production-ready focus
- **GUIDE.md** - Updated installation instructions to use standard install.sh
- **STRUCTURE.md** - Enhanced with AI-managed memory documentation
- **prompts/manifest.json** - Updated to reflect AI management
- **scripts/setup-language-prompts.sh** - Removed Python dependency
- **scripts/uninstall.sh** - Updated installation references
- **template/.github/copilot-instructions.md** - Added AI memory management section
- **template/memory/constitution.md** - Added AI management note

### Removed

- **scripts/generate-manifest.py** - Python-based manifest generator
- **scripts/quick-install.sh** - Quick installation script
- All references to quick-install in documentation
- Prototype-oriented language from documentation

### Installation Changes

**Before (v1.x):**
```bash
curl -fsSL https://raw.githubusercontent.com/code-onigiri/Github-Copilot-Spec-development/main/scripts/quick-install.sh | bash
```

**Now (v2.0):**
```bash
git clone https://github.com/code-onigiri/Github-Copilot-Spec-development.git
cd Github-Copilot-Spec-development
bash scripts/install.sh
```

## [1.0.0] - 2025-01-11

### Initial Release

- Core specification-driven development workflow
- GitHub Copilot integration
- Custom instructions and chat modes
- Memory system
- Template system

---

For detailed information about the framework, see:
- [README.md](README.md) - English documentation
- [docs/ja/README.ja.md](docs/ja/README.ja.md) - Japanese documentation (日本語ドキュメント)
