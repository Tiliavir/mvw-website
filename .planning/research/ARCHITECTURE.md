# Architecture Research: SCSS Redesign Within Existing Hugo Theme

## Recommended Approach

### Foundation-First Strategy

Change the design token layer first (variables, custom properties), then work outward to components. This ensures all downstream changes inherit the new foundations automatically.

**Order:**
1. `_global-variables.scss` — Extend with CSS custom properties, adjust base values
2. `_global-style.scss` — Typography scale, base element styles
3. `_structure.scss` — Layout spacing, footer
4. `_topnav-theme.scss` + `_topnav.scss` — Navigation (high visibility, touch carefully)
5. `_tile.scss` — Tile/card components
6. `_typography.scss` — Any remaining typographic details
7. `_breadcrumb.scss`, `_tabs.scss`, `_mail-popup.scss` — Secondary components
8. `assets/scss/*.scss` — Page-specific files last

### Why Foundation-First

- Changing SCSS variables cascades through all files that import `_global-variables.scss`
- Adding CSS custom properties to `:root` in `_global-variables.scss` makes them available everywhere
- Reduces total number of changes — one variable change can update 20 components

## Token/Variable Strategy

### Hybrid Approach (Recommended)

Keep existing SCSS variables for compile-time operations (SCSS math, `lighten()`, `darken()`, `rgba()` with variables). Add a CSS custom properties layer on top for values that benefit from runtime cascading.

```scss
// _global-variables.scss — EXISTING (keep for SCSS functions)
$highlight-color: #a9852a;
$gray-base: #333;
// ...

// ADD: CSS custom property layer
:root {
  // Colors
  --color-accent: #{$highlight-color};
  --color-accent-subtle: #{rgba($highlight-color, 0.1)};
  --color-text: #{$gray-base};
  --color-text-muted: #{$gray};
  --color-bg: #{$body-bg};
  --color-surface: #{$gray-lightest};
  --color-border: #{$gray-lighter};

  // Typography
  --font-size-base: 15px;  // bump from 14px
  --font-size-sm: 13px;
  --font-size-lg: 17px;
  --font-size-xl: 20px;
  --font-size-display: 24px;
  --line-height-base: 1.6;  // up from 1.428

  // Spacing
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 40px;

  // Radius
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  // Shadows
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.10), 0 4px 10px rgba(0,0,0,0.07);
}
```

**Note:** Also update the SCSS `$font-size-base`, `$line-height-base` etc. to match new values — the existing SCSS that uses these directly will then also update.

### Don't Over-Abstract

Only introduce CSS custom properties for values that:
1. Are used in 3+ places (worth abstracting)
2. Benefit from consistency (spacing scale, shadow scale)
3. Might change per-component context (not needed here but future-proof)

Do NOT create custom properties for one-off values — that's over-engineering.

## Change Order (Phase Mapping)

| Phase | Files | Risk |
|-------|-------|------|
| 1: Tokens | `_global-variables.scss` | Low — cascading benefit |
| 2: Base styles | `_global-style.scss`, `_typography.scss` | Low-Medium — broad impact |
| 3: Layout | `_structure.scss`, `_breadcrumb.scss` | Low |
| 4: Navigation | `_topnav.scss`, `_topnav-theme.scss` | High — always visible, complex |
| 5: Components | `_tile.scss`, `_tabs.scss`, `_images.scss` | Medium |
| 6: Secondary | `_mail-popup.scss`, `_responsive-tables.scss`, `_print.scss` | Low |
| 7: Page-specific | `assets/scss/*.scss` | Low-Medium — isolated per page |

## Page-Specific SCSS

`assets/scss/` contains per-page stylesheets. These typically import nothing from the theme (they rely on the global CSS being already loaded). Changes here should:
- Use the CSS custom properties introduced in Phase 1 (they'll be available at runtime)
- Not duplicate theme-level styles — only truly page-specific overrides
- Be addressed after theme-level work is complete and stable

## Risk Areas

### 1. Navigation (High Risk)
The nav has multiple states: default dark, `.inverse` (light/scroll state), mobile vs desktop, hamburger animation, dropdown hover. Test all states after any nav change. The `.inverse` class is added/removed by JavaScript — ensure both modes look correct.

**Mitigation:** Change nav last (after other components), test at multiple scroll positions and viewports.

### 2. SCSS Variable Cascades (Medium Risk)
Changing `$font-size-base` or `$highlight-color` cascades through many files. A seemingly small change can have wide visual impact.

**Mitigation:** Run `hugo serve` and visually check all major pages after each variable change. Check pages: index, konzerte, termine, blog posts, suche, vorstand.

### 3. `lighten()`/`darken()` Functions (Medium Risk)
The codebase uses SCSS color functions extensively. Changing base colors can make these computed values look wrong (e.g., `lighten($highlight-color, 10%)` on an already-light color).

**Mitigation:** After changing base color values, audit all uses of color functions. Consider replacing with CSS custom property variants.

### 4. SVG Logo Fill (Low-Medium Risk)
The navbar brand SVG uses `fill: $brand-fill` and `fill: $highlight-color` for the logo parts. Any color token changes must not break the logo rendering. The logo SVG structure in `_topnav-theme.scss` uses deep SCSS selectors on SVG `g > use` elements.

**Mitigation:** Check logo display (both nav states) after any color changes.

### 5. Print Styles (Low Risk)
`_print.scss` exists. Ensure any background-color/color changes don't break print layout.

**Mitigation:** Do a final check of print styles at the end.
