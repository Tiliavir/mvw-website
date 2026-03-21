# Features Research: Modern Design for Community/Association Websites

## Overview

Community/association websites (Verein, cultural organizations, brass bands) have a distinct audience: local community members of mixed ages, primarily German-speaking. The design must feel trustworthy and rooted in the community, while looking contemporary enough to not feel neglected. The gold brand color (#a9852a) is an asset — it reads as warm, prestigious, and musical.

## Table Stakes

These are the minimum changes needed for the redesign to read as "modern":

### 1. Generous Whitespace & Breathing Room
Current spacing is tight (10-20px margins). Modern design uses significantly more padding and vertical rhythm. Content areas need room to breathe.
- **Effort:** Low — CSS padding/margin changes
- **Impact:** High — single biggest visual shift

### 2. Border Radius on Components
Sharp corners on cards, tiles, buttons, and nav dropdowns feel dated (pre-2020 aesthetic). Consistent `border-radius: 8-12px` on cards and `4-6px` on buttons/inputs immediately modernizes.
- **Effort:** Low
- **Impact:** High

### 3. Refined Shadow System
Current shadows use blunt `box-shadow: 0 10px 15px -10px black`. Modern shadows are multi-layered and subtle, creating a sense of elevation rather than stark contrast.
- **Effort:** Low
- **Impact:** Medium-High

### 4. Typography Improvement
14px base font size is small by modern standards. Bump to 15-16px. Improve heading hierarchy and letter-spacing. Consider a display font for h1 or use font-weight 600-700 for headings.
- **Effort:** Low
- **Impact:** High

### 5. Modern Navigation States
Active/hover states in the current nav are subtle. Modern nav has clear, polished hover underline animations (CSS-only: scaleX transform on ::after pseudo-element), smooth transitions, and better visual hierarchy between nav levels.
- **Effort:** Medium
- **Impact:** High (nav is always visible)

### 6. Accessible Focus Styles
Current code removes `:focus` outlines entirely (`outline: none`). This is an accessibility failure. Replace with `:focus-visible` using brand-colored outlines.
- **Effort:** Very Low
- **Impact:** Accessibility — critical

### 7. Button Modernization
Current buttons are flat gold. A subtle gradient, more padding, and rounded corners transform the feel.
- **Effort:** Low
- **Impact:** Medium

### 8. Link Styling Refinement
Content links currently use underline-on-hover with a bottom border. Modern approach: animated underline using CSS transforms for a polished feel.
- **Effort:** Low
- **Impact:** Medium

## Differentiators

These go beyond "modern baseline" and would elevate the design:

### 1. Gradient Hero/Header Overlay
Add a subtle gradient overlay to header images (dark-to-transparent from bottom) instead of a flat tile background. Creates depth.
- **Effort:** Low
- **SCSS-only:** Yes

### 2. Tile Hover Elevation
Tiles currently just darken the overlay on hover. Add `transform: translateY(-3px)` + elevated shadow on hover for a lift effect.
- **Effort:** Low
- **SCSS-only:** Yes

### 3. Animated Navigation Underlines
CSS-only animated underline on desktop nav items (scaleX from 0 to 1 on hover):
```scss
a::after { content: ''; transform: scaleX(0); transition: transform 0.2s ease; }
a:hover::after { transform: scaleX(1); }
```
- **Effort:** Low
- **SCSS-only:** Yes

### 4. Section Dividers with Brand Color
Subtle horizontal rules or section accents using the gold brand color create visual structure.
- **Effort:** Low
- **SCSS-only:** Yes

### 5. Fluid Type Scale
Replace fixed px font sizes with `clamp()`-based fluid values. Text scales smoothly across viewport widths.
- **Effort:** Medium
- **SCSS-only:** Yes

### 6. Image Card Polish
Add `overflow: hidden` + border-radius to image containers so images clip to rounded corners. Subtle `scale` transform on image hover.
- **Effort:** Low
- **SCSS-only:** Yes (CSS transform on img, no HTML change needed)

## Anti-Features

These would harm the redesign:

### 1. Excessive Animation
Complex keyframe animations, parallax, or page-element entrance animations feel gimmicky for a community association site. The audience expects professionalism, not a portfolio.

### 2. Dark Background on Main Content
While dark navs work, making the content area dark would reduce readability for an older audience and clash with text-heavy event pages.

### 3. Trendy but Illegible Typography
Display fonts that sacrifice readability (thin weights, decorative scripts) would alienate the community audience. Open Sans is fine — or a switch to a clean, slightly more contemporary sans like Inter or Source Sans 3.

### 4. Removing the Gold Accent
The gold color is the brand anchor. Replacing it with a "trendier" color (e.g., teal, coral) would break brand recognition. Adjustments to shade are fine; hue shifts are not.

### 5. Oversimplifying the Navigation
The current nav structure (with dropdowns) serves the site's content depth. Removing dropdown functionality via CSS (accidentally hiding submenus) would break usability.

### 6. Neon/High-Saturation Accents
The site represents a 150+ year old institution. Neon or ultra-saturated accent colors would undermine the established, trustworthy character.

## Notes on Brand Retention

- **Gold #a9852a** — warm, musical, prestigious. Keep the hue (orange-gold family). Lightness adjustments (e.g., lighter tints for backgrounds, darker shades for text-on-light) are fine.
- **Dark navigation** — the dark nav bar is a brand element. A complete shift to a white nav would lose identity, though a refined dark (e.g., very dark warm gray vs flat #333) is acceptable.
- **Logo** — SVG logo in nav uses fill with the highlight color. Ensure any color token changes propagate correctly.
- **Conservative aesthetic** — This is a Verein (registered association), not a startup. Restrained, quality design signals trustworthiness.
