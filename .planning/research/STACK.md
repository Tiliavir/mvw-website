# Stack Research: Modern SCSS/CSS for Hugo Redesign

## Overview

The existing stack (Hugo extended, SCSS, PostCSS + Autoprefixer) is well-suited for a 2025-2026 redesign. No new dependencies are needed. The focus is on applying modern CSS/SCSS techniques within the existing toolchain.

## Recommended Techniques

### 1. CSS Custom Properties (Design Token Layer)
**Confidence: High**

Introduce CSS custom properties alongside or replacing SCSS variables for values that benefit from runtime flexibility (colors, spacing, fonts). SCSS variables are compile-time only; CSS custom properties cascade and can be overridden per-component.

Pattern:
```scss
// In _global-variables.scss — define both
$highlight-color: #a9852a;  // keep for SCSS math/functions
:root {
  --color-accent: #{$highlight-color};
  --color-text: #{$gray-base};
  --space-md: 1rem;
  --radius-md: 6px;
}
```

**Rationale:** Enables consistent theming, easier iteration, and future dark mode without template changes. Browser support is universal (2020+).

### 2. Modern Color Spaces (oklch)
**Confidence: Medium**

`oklch()` provides perceptually uniform color manipulation — tints/shades look more natural than `lighten()`/`darken()`. Supported in all modern browsers (2023+), with PostCSS fallback available.

```scss
// Modern approach
--color-accent: oklch(62% 0.12 75);  // gold
--color-accent-light: oklch(75% 0.10 75);
```

**Caveat:** Requires PostCSS `postcss-oklab-function` plugin for older browser support. If not adding plugins, stick to hex/hsl but use CSS custom properties for the token layer.

**Alternative without new plugins:** Use `hsl()` values in CSS custom properties for easier manipulation:
```scss
--color-accent-h: 38;
--color-accent-s: 59%;
--color-accent-l: 41%;
--color-accent: hsl(var(--color-accent-h), var(--color-accent-s), var(--color-accent-l));
```

### 3. Modern Typography Scale
**Confidence: High**

Replace fixed px font sizes with a fluid type scale using `clamp()`:
```scss
:root {
  --font-size-base: clamp(0.875rem, 0.8rem + 0.25vw, 1rem);
  --font-size-lg: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
  --font-size-xl: clamp(1.25rem, 1rem + 1vw, 1.75rem);
}
```

Universally supported (2021+). No new dependencies.

### 4. Logical Properties
**Confidence: Medium**

Use `margin-inline`, `padding-block` etc. for spacing. Improves maintainability and future i18n. Supported universally (2022+).

### 5. Modern Box Shadows & Borders
**Confidence: High**

Replace flat/harsh shadows with multi-layered, soft shadows (elevation system):
```scss
--shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
--shadow-md: 0 4px 12px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05);
--shadow-lg: 0 10px 25px rgba(0,0,0,0.10), 0 4px 10px rgba(0,0,0,0.07);
```

### 6. Container Queries
**Confidence: Low for this project**

Container queries are powerful but the existing HTML structure isn't built with containment in mind. Adding `container-type` to elements requires HTML changes. **Avoid** — stick to viewport-based media queries via existing breakpoint mixin.

### 7. Smooth Transitions (CSS)
**Confidence: High**

Add tasteful transitions to interactive elements without JS:
```scss
transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
```

### 8. :focus-visible
**Confidence: High**

Replace `:focus` outline removal with `:focus-visible` — hides outlines for mouse users but keeps them for keyboard navigation:
```scss
*:focus { outline: none; }
*:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
```
Universally supported (2022+).

## What to Avoid

- **Adding npm packages** just for CSS — no new PostCSS plugins unless truly necessary
- **Container queries** — requires HTML changes
- **CSS layers (`@layer`)** — adds complexity without clear benefit in this codebase
- **`:has()` pseudo-class** — powerful but risky without testing; no HTML changes allowed
- **CSS nesting (native)** — browser support still patchy (2024); keep SCSS nesting
- **Removing SCSS variables entirely** — keep them for SCSS functions (lighten, darken, math)

## Browser Support Notes

Target: "last 1 version, >1%, maintained node versions, not dead" (package.json browserslist)

| Technique | Support |
|-----------|---------|
| CSS custom properties | ✓ Universal |
| `clamp()` | ✓ Universal (2021+) |
| `oklch()` | ✓ Modern browsers, needs PostCSS for old |
| `:focus-visible` | ✓ Universal (2022+) |
| Container queries | Partial — avoid |
| `@layer` | ✓ Universal but unnecessary complexity |

## Confidence Assessment

- CSS custom properties as token layer: **High** — clear win, low risk
- `clamp()` fluid typography: **High** — easy, universally supported
- Modern shadows/borders: **High** — pure aesthetic, low risk
- `oklch` colors: **Medium** — great if PostCSS plugin added; skip if not
- `:focus-visible`: **High** — accessibility improvement, straightforward
