# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-21)

**Core value:** A noticeably modern look that visitors immediately perceive as fresh and professional, while long-time members still recognize the site as theirs.
**Current focus:** Phase 1 — Design Tokens

## Current Status

**Phase:** 1 of 7
**Status:** Ready to plan
**Last action:** Roadmap created 2026-03-21

## Phase Progress

| Phase | Name | Status |
|-------|------|--------|
| 1 | Design Tokens | ○ Pending |
| 2 | Base Typography & Global Styles | ○ Pending |
| 3 | Layout & Structure | ○ Pending |
| 4 | Navigation | ○ Pending |
| 5 | Cards, Tiles & Images | ○ Pending |
| 6 | Secondary Components | ○ Pending |
| 7 | Page-Specific & QA | ○ Pending |

## Key Files

- `.planning/PROJECT.md` — project context and constraints
- `.planning/REQUIREMENTS.md` — all 42 v1 requirements
- `.planning/ROADMAP.md` — 7-phase roadmap
- `.planning/research/SUMMARY.md` — research findings

## Important Context for Execution

- **SCSS only** — zero changes to HTML, TypeScript, or content files
- **Foundation-first** — always start with `_global-variables.scss` changes
- **Lint after every change** — `npm run lint` must pass before committing
- **Nav has two states** — always test both `.navigation` (dark/default) and `.inverse.navigation` (light/scrolled)
- **Gold #a9852a** — preserve hue throughout; adjust lightness/saturation only
- **Git command prefix** — use `GIT_CONFIG_GLOBAL=/tmp/.gitconfig git -C /workspace` for all git operations
