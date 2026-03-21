# Research Summary: SCSS Redesign — Musikverein Wollbach

## Key Findings

**Stack:** Hugo extended + SCSS + PostCSS — no new dependencies needed. Introduce CSS custom properties as a design token layer alongside existing SCSS variables. Use `clamp()` for fluid typography, modern multi-layered shadows, and `:focus-visible` for accessibility. Avoid container queries (require HTML changes) and `transition: all`.

**Table Stakes (must-haves for "modern" look):**
1. Generous whitespace — the single biggest visual upgrade
2. Border radius on cards/tiles/buttons (8-12px cards, 4-6px buttons)
3. Refined shadow system (multi-layered, soft elevation)
4. Typography bump (14px → 15-16px base, better heading hierarchy)
5. Modern navigation hover states (animated underline, smooth transitions)
6. `:focus-visible` replacing blanket `outline: none`

**Architecture:** Foundation-first. Change `_global-variables.scss` (add CSS custom property layer + update base values) first. Then `_global-style.scss` → `_structure.scss` → navigation → tiles/components → page-specific. This cascades changes efficiently and reduces total edits.

**Watch Out For:**
1. **Navigation `.inverse` state** — JS adds this class on scroll; always test both dark and light nav states
2. **Color contrast after palette changes** — verify ≥ 4.5:1 for all text/background combos
3. **Mobile nav overflow** — max-height transition breaks if height/padding values change without re-checking the calculation
4. **`overflow: hidden` on rounded containers** — required whenever adding border-radius to image containers
5. **Stylelint** — run `npm run lint` continuously; don't batch lint failures

## Recommended Phase Structure

| Phase | Focus | Key Files |
|-------|-------|-----------|
| 1 | Design tokens & CSS custom properties | `_global-variables.scss` |
| 2 | Base typography & global styles | `_global-style.scss`, `_typography.scss` |
| 3 | Layout, structure & footer | `_structure.scss` |
| 4 | Navigation redesign | `_topnav.scss`, `_topnav-theme.scss` |
| 5 | Tile/card & image components | `_tile.scss`, `_images.scss` |
| 6 | Secondary components | `_breadcrumb.scss`, `_tabs.scss`, `_mail-popup.scss`, `_responsive-tables.scss` |
| 7 | Page-specific styles | `assets/scss/*.scss` |

## Brand Constraints Summary

- **Gold #a9852a** is the brand anchor — hue preserved, lightness/saturation adjustments acceptable
- **Dark navigation** is a brand element — refine, don't eliminate
- **Conservative aesthetic** — Verein (150+ year institution) — restrained quality over trendy/flashy
- **Open Sans** is fine to keep; only upgrade if a clearly better font is available at zero cost

## Confidence

High confidence on: design token approach, whitespace improvements, border-radius/shadow system, typography scale.
Medium confidence on: exact color palette adjustments (requires visual testing against logo/images).
Low confidence on: estimating time per phase — depends heavily on how thorough the visual polish needs to be.
