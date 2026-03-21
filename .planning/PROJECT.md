# Musikverein Wollbach Website — SCSS Redesign

## What This Is

A SCSS-only visual redesign of the Musikverein Wollbach 1866 e.V. static website, built with Hugo. The goal is a modern, fresh aesthetic while retaining the existing brand identity (gold accent color, logo, overall character). No HTML templates, TypeScript logic, content, or structural changes are in scope — only SCSS files are touched.

## Core Value

A noticeably more modern look that visitors immediately perceive as fresh and professional, while long-time members still recognize the site as theirs.

## Requirements

### Validated

- ✓ Hugo-based static site with SCSS/TypeScript — existing
- ✓ Responsive layout (mobile/desktop breakpoints at 768px) — existing
- ✓ Fixed top navigation with hamburger on mobile — existing
- ✓ Hero header with image and overlay tiles — existing
- ✓ Carousel component on homepage — existing
- ✓ Footer with social links — existing
- ✓ Search page (Lunr-based) — existing
- ✓ Concert/event listing pages — existing
- ✓ Blog/retrospective pages with image galleries — existing
- ✓ Member registration form styling — existing
- ✓ View transitions between pages — existing

### Active

- [ ] Modernize design token system (CSS custom properties over SCSS-only variables)
- [ ] Refresh typography (scale, weight, spacing — keep Open Sans or upgrade)
- [ ] Modernize color palette (keep gold #a9852a as brand anchor, refine supporting tones)
- [ ] Update navigation styling (modern hover states, cleaner active indicators)
- [ ] Refresh tile/card components (better shadows, border-radius, hover effects)
- [ ] Modernize layout spacing and rhythm (consistent padding/margin system)
- [ ] Improve button and interactive element styling
- [ ] Modernize footer styling
- [ ] Ensure all changes preserve accessibility (contrast ratios, focus states)
- [ ] All existing responsive behavior must continue to work

### Out of Scope

- HTML template changes — structure is frozen, only style changes
- TypeScript / JavaScript logic — no behavioral changes
- Content changes — text, images, page structure untouched
- New pages or components — restyling existing only
- Dark mode — not requested, would require template changes for toggle
- Framework migration — Hugo + SCSS stays as-is

## Context

- **Stack:** Hugo extended (SCSS), TypeScript, PostCSS + Autoprefixer, npm
- **SCSS structure:** Theme styles in `themes/mv-wollbach/assets/scss/`, page-specific in `assets/scss/`
- **Current palette:** Gold `#a9852a` (highlight), dark gray `#333` (text), medium grays for UI chrome
- **Current nav:** Dark `#333` background, fixed position, transitions to semi-transparent white (`.inverse`) on scroll
- **Current fonts:** Open Sans (loaded externally), base 14px
- **Current components:** tiles with dark overlay blur effect, carousel, tabs, breadcrumb, mail popup, responsive tables
- **Linting:** stylelint enforced; all SCSS changes must pass `npm run lint`
- **Build validation:** `npm run build` runs HTML validation — must still pass after all changes

## Constraints

- **Tech stack:** Hugo SCSS only — no CSS-in-JS, no Tailwind, no framework additions
- **Lint:** All SCSS must pass `stylelint '**/*.scss'` with existing `.stylelintrc` config
- **Brand:** Gold accent `#a9852a` is the brand anchor — hue must be preserved (lightness/saturation adjustments allowed)
- **Compatibility:** Autoprefixer handles vendor prefixes; target browsers per package.json browserslist
- **Scope:** Zero changes to `.html`, `.ts`, `.md`, `.yaml`, `.json` (except SCSS files)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| SCSS-only scope | Keep risk minimal, logic already works well | — Pending |
| Retain gold brand color as anchor | Brand recognition requirement | — Pending |
| Modernize via variables/tokens first | Cascading changes from one place | — Pending |

---
*Last updated: 2026-03-21 after initialization*
