# Pitfalls Research: SCSS-Only Website Redesign

## Overview

CSS-only redesigns feel safe because "you're just changing styles," but they carry real risks. The most common failures are: breaking responsive behavior, creating accessibility regressions, introducing specificity wars, and producing a visually inconsistent result because the redesign wasn't approached systematically.

## Critical Pitfalls (Must Avoid)

### 1. Removing `:focus` Outlines Without `:focus-visible` Replacement
**Risk: Accessibility failure — WCAG 2.1 violation**

The current code has `*:focus, *:hover { outline: none; }` in `_global-style.scss`. This removes all keyboard focus indicators. It works "visually" but is an accessibility problem. The redesign must not perpetuate this — replace with `:focus-visible`:

```scss
// Replace this:
*:focus, *:hover { outline: none; }

// With this:
*:focus { outline: none; }
*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}
```

**Warning sign:** If your redesign passes lint but you can't tab through the site and see where focus is, you've missed this.

### 2. Breaking the Navigation's `.inverse` State
**Risk: Navigation becomes unreadable on scroll**

JavaScript adds `.inverse` class to `.navigation` when the user scrolls. This switches from dark background to a near-white background. The current `_topnav-theme.scss` has explicit color overrides for `.inverse`. If you change nav colors without testing the inverse state, either:
- Text becomes invisible (dark on dark, or light on light)
- The transition looks jarring

**Prevention:** Always test the nav both at page top (dark) and after scrolling down (inverse/light). Test on desktop and mobile.

### 3. Color Contrast Failures After Palette Adjustment
**Risk: Text becomes illegible; WCAG AA failure**

When adjusting the gold accent color or gray palette, computed contrast ratios can silently drop below 4.5:1 (WCAG AA for normal text). Common failures:
- Light gold on white backgrounds (decorative is fine, text links are not)
- Gray text on gray backgrounds (footer, inactive states)
- White text on lightened button backgrounds

**Prevention:** After any color change, check:
- Body text on background: must be ≥ 4.5:1
- Link color on background: must be ≥ 4.5:1
- White text on button background: must be ≥ 4.5:1
- Use browser DevTools accessibility checker or contrast-ratio.com

### 4. Breaking Mobile Navigation Overflow
**Risk: Mobile nav stops working or overflows viewport**

The mobile nav uses `max-height` transitions (`max-height: 0` ↔ `max-height: calc(100vh - ...)`) and `overflow: hidden/auto`. Changes to padding, margin, or `$top-nav-height` can break the transition or cause nav items to be clipped.

**Prevention:** Test hamburger menu on a real narrow viewport (375px width) after any nav changes. Check open and closed states. Check that all nav items are visible when open.

### 5. Stylelint Failures Blocking the Build
**Risk: Changes don't pass CI**

`npm run build` runs linting. The `.stylelintrc` config (stylelint-config-recommended-scss) has several rules. Common violations:
- `no-descending-specificity` (disabled in this project — fine)
- `color-no-invalid-hex` — typos in hex values
- `declaration-block-no-duplicate-properties` — duplicate CSS properties
- `scss/no-global-function-names` (disabled — fine for SCSS built-ins like `lighten`)

**Prevention:** Run `npm run lint` after every significant change. Don't batch up changes and lint at the end — fix as you go.

## Moderate Pitfalls (Watch Out)

### 6. Cascading Variable Changes Breaking Computed Values
**Risk: Unexpected visual changes far from the edit point**

Changing `$font-size-base` from 14px to 16px will cascade through every component that uses `$font-size-base`, `$font-size-large`, `$font-size-larger`, and relative calculations. A change intended for body text also affects navigation, dropdowns, table cells, and more.

**Prevention:** After any base variable change, do a visual pass of: homepage, navigation, a concert page, the search page, a blog post, and the Vorstand page. Check both mobile and desktop.

### 7. Border-Radius Breaking Image Overflow
**Risk: Images don't clip to rounded corners**

Adding `border-radius` to `.tile` or `.image-container` requires `overflow: hidden` on the container, otherwise images overflow the rounded corners. Missing `overflow: hidden` is one of the most common CSS redesign mistakes.

**Prevention:** Whenever adding `border-radius` to a container with children that fill the boundary, always add `overflow: hidden` to the same element.

### 8. Transition on All Properties
**Risk: Jank, performance issues, unexpected animations**

Using `transition: all 0.2s ease` on elements catches too many CSS properties (including layout-triggering ones like `height`, `width`). This causes jank and triggers layout recalculation on hover.

**Prevention:** Always specify explicit properties: `transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease`.

### 9. Forgetting Print Styles
**Risk: Print layout breaks**

`_print.scss` exists. Changes to background colors (adding gradients, dark surfaces) can interfere with print output. Browsers often strip backgrounds in print mode but occasionally don't.

**Prevention:** Check print preview after completing the redesign.

### 10. Over-Abstracting Into CSS Custom Properties
**Risk: Increased complexity without proportional benefit**

There's a temptation to create custom properties for every value. This makes the token file enormous and makes it hard to trace where a visual property comes from. Only create custom properties for values used in 3+ places or for values that form a system (spacing scale, shadow scale, color scale).

**Prevention:** Start with a minimal token set. Add new tokens only when a clear need exists.

## Verification Checklist

After completing each phase, verify:

- [ ] `npm run lint` passes with zero errors
- [ ] `hugo serve` builds without errors
- [ ] Homepage looks correct (desktop + mobile)
- [ ] Navigation: default state (dark), inverse state (light/scroll), mobile hamburger
- [ ] At least one content-heavy page (e.g., a concert/event page)
- [ ] At least one image-heavy page (e.g., a blog/retrospective page)
- [ ] Footer is styled correctly
- [ ] Focus states are visible when tabbing through the page
- [ ] Color contrast: body text, links, buttons all pass ≥ 4.5:1
- [ ] No horizontal scrollbar appears at any viewport width
- [ ] Dropdowns on desktop nav open/close correctly
