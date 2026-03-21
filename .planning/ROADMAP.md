# Roadmap: Musikverein Wollbach Website — SCSS Redesign

**Core Value:** A noticeably modern look that visitors immediately perceive as fresh and professional, while long-time members still recognize the site as theirs.

**Scope:** SCSS files only. Zero changes to HTML templates, TypeScript, content, or configuration.

---

## Phase Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|-------------|-----------------|
| 1 | Design Tokens | Establish modern design token foundation | TOKEN-01–06 | 4 |
| 2 | Base Typography & Global | Modernize base text, interactions & reset | TYPE-01–06 | 4 |
| 3 | Layout & Structure | Improve spacing, layout rhythm & footer | LAYOUT-01–03 | 3 |
| 4 | Navigation | Redesign nav to be polished and modern | NAV-01–06 | 4 |
| 5 | Cards, Tiles & Images | Modernize the visual card/tile language | TILE-01–04, IMG-01–02 | 4 |
| 6 | Secondary Components | Polish remaining UI components | COMP-01–05 | 3 |
| 7 | Page-Specific & QA | Apply to all pages, verify full quality | PAGE-01–07, QA-01–07 | 5 |

**Total: 7 phases | 42 v1 requirements | All requirements covered ✓**

---

## Phase 1: Design Tokens

**Goal:** Introduce a CSS custom properties layer and update base variable values to create the foundation all other phases build on. This phase has the widest leverage — changes here cascade to every component.

**Requirements:**
- TOKEN-01: CSS custom properties introduced for color, spacing, radius, shadow
- TOKEN-02: Base font size increased from 14px to 15-16px with all size tokens updated
- TOKEN-03: Line height increased from 1.428 to ~1.6
- TOKEN-04: Consistent spacing scale (xs/sm/md/lg/xl) via CSS custom properties
- TOKEN-05: Elevation/shadow scale (sm/md/lg) replacing ad-hoc box-shadow values
- TOKEN-06: Border-radius scale (sm/md/lg) for consistent rounding

**Files affected:**
- `themes/mv-wollbach/assets/scss/_global-variables.scss`

**Success Criteria:**
1. `_global-variables.scss` exports a complete `:root {}` block with color, spacing, radius, and shadow custom properties
2. `$font-size-base` is 15px or 16px; `$line-height-base` is ≥ 1.55
3. `npm run lint` passes with zero errors after the change
4. `hugo serve` builds without errors and the site is visually functional (even if not yet redesigned)

---

## Phase 2: Base Typography & Global Styles

**Goal:** Modernize the base typographic scale, heading hierarchy, link styles, focus states, and button styling. This phase transforms the "feel" of all text-heavy content pages.

**Requirements:**
- TYPE-01: Heading hierarchy visually distinct and scaled for new font-size base
- TYPE-02: H1 uses brand gold accent, improved letter-spacing and weight
- TYPE-03: Body text line-height and paragraph spacing improved
- TYPE-04: Link styles use polished hover state (CSS transition-based)
- TYPE-05: Focus states use `:focus-visible` with brand-color outline
- TYPE-06: Button styles modernized (padding, rounded corners, hover state)

**Files affected:**
- `themes/mv-wollbach/assets/scss/_global-style.scss`
- `themes/mv-wollbach/assets/scss/_typography.scss`

**Success Criteria:**
1. Tabbing through the homepage shows a clearly visible gold-colored focus ring on interactive elements
2. H1 headings are visually prominent with the gold accent, improved from Phase 1 baseline
3. Buttons have rounded corners and a refined hover state (not just a flat color change)
4. Content area links show a smooth CSS transition on hover (no jarring snap)
5. `npm run lint` passes with zero errors

---

## Phase 3: Layout & Structure

**Goal:** Improve the spatial rhythm of the page — more breathing room in content areas, a modernized footer, and a polished page-title area.

**Requirements:**
- LAYOUT-01: Content area has more generous vertical breathing room
- LAYOUT-02: Footer modernized (background, spacing, link styles)
- LAYOUT-03: Page title area has improved visual hierarchy

**Files affected:**
- `themes/mv-wollbach/assets/scss/_structure.scss`

**Success Criteria:**
1. Content pages feel less cramped — visible increase in whitespace around content areas
2. Footer has a noticeably refined appearance (improved spacing, cleaner link styling)
3. Page titles have clear visual separation from body content
4. `npm run lint` passes; no layout breaks at 375px, 768px, or 1200px viewport widths

---

## Phase 4: Navigation

**Goal:** Redesign the navigation to be visually polished with modern hover states, while preserving all existing functionality (hamburger, dropdowns, active states, both dark and inverse/light modes).

**Requirements:**
- NAV-01: Desktop nav has polished hover states (animated underline or modern indicator)
- NAV-02: Active nav item clearly distinguished from hover state
- NAV-03: Dropdown submenu styling modernized (shadow, spacing, border-radius)
- NAV-04: Mobile hamburger menu style polish (transitions already functional)
- NAV-05: Both default (dark) and `.inverse` (light/scroll) nav states look correct and cohesive
- NAV-06: Nav logo fill colors preserved in both nav states

**Files affected:**
- `themes/mv-wollbach/assets/scss/_topnav.scss`
- `themes/mv-wollbach/assets/scss/_topnav-theme.scss`

**Success Criteria:**
1. Desktop nav hover state has a smooth CSS animation (e.g., sliding underline or background fade)
2. Active page link is clearly visually distinct from hovered links
3. Dropdown submenus have rounded corners and a refined shadow
4. Scrolling down the homepage transitions nav from dark to light — both states look polished and logo is visible
5. Mobile hamburger menu opens/closes correctly at 375px viewport; all items visible and styled

---

## Phase 5: Cards, Tiles & Images

**Goal:** Modernize the tile/card components that appear on the homepage and content pages — the primary visual elements users see first.

**Requirements:**
- TILE-01: Tiles have rounded corners with overflow clipping
- TILE-02: Tile hover effect modernized (lift/elevation via transform + shadow)
- TILE-03: Tile overlay refined for better text readability
- TILE-04: Tile text styling improved (size, weight, spacing)
- IMG-01: Image containers have rounded corners with proper overflow clipping
- IMG-02: Figure/figcaption styling refined

**Files affected:**
- `themes/mv-wollbach/assets/scss/_tile.scss`
- `themes/mv-wollbach/assets/scss/_images.scss`

**Success Criteria:**
1. Homepage tiles have visibly rounded corners and images are clipped correctly within them
2. Hovering a tile produces a smooth lift effect (translateY + elevated shadow)
3. Tile title/text is clearly readable over the overlay background
4. Image figures in content pages have rounded corners and refined captions
5. No image overflow outside rounded containers at any viewport width

---

## Phase 6: Secondary Components

**Goal:** Apply the new design system to the remaining UI components — breadcrumbs, tabs, mail popup, and responsive tables — ensuring the whole site feels consistent.

**Requirements:**
- COMP-01: Breadcrumb navigation matches new design system
- COMP-02: Tabs component with modern active/hover states
- COMP-03: Mail popup modernized (border-radius, shadow, spacing)
- COMP-04: Responsive tables retain readable styling
- COMP-05: Blockquote styling modernized (gold left-border accent)

**Files affected:**
- `themes/mv-wollbach/assets/scss/_breadcrumb.scss`
- `themes/mv-wollbach/assets/scss/_tabs.scss`
- `themes/mv-wollbach/assets/scss/_mail-popup.scss`
- `themes/mv-wollbach/assets/scss/_responsive-tables.scss`
- `themes/mv-wollbach/assets/scss/_global-style.scss` (blockquote)

**Success Criteria:**
1. Breadcrumb uses design system spacing and colors — no visual mismatch with new nav
2. Tab active state clearly indicates the selected tab with the brand accent color
3. Mail popup has rounded corners, a refined shadow, and consistent internal spacing
4. Tables are readable on mobile (no horizontal overflow on narrow viewports)
5. Blockquotes have a refined gold left-border with improved spacing

---

## Phase 7: Page-Specific Styles & Final QA

**Goal:** Apply the new design foundation to all page-specific SCSS files, then perform a full quality verification pass across all pages and quality requirements.

**Requirements:**
- PAGE-01: Homepage (index.scss) cohesive with new design
- PAGE-02: Concert/event pages (konzerte.scss, termine.scss) modernized
- PAGE-03: Search page (suche.scss) updated
- PAGE-04: Vorstand page (vorstand.scss) updated
- PAGE-05: Blog/retrospective pages (rueckblick.scss, blog_*.scss) updated
- PAGE-06: Registration/membership pages (register.scss, mitgliedschaft.scss) updated
- PAGE-07: Impressum page (impressum.scss) updated
- QA-01: All SCSS passes `npm run lint`
- QA-02: `npm run build` completes successfully
- QA-03: Responsive layout preserved at all breakpoints
- QA-04: Color contrast ≥ 4.5:1 for all normal-sized text
- QA-05: No horizontal scrollbar at any viewport width
- QA-06: Brand gold accent retained throughout
- QA-07: Print styles verified

**Files affected:**
- `assets/scss/index.scss`
- `assets/scss/konzerte.scss`
- `assets/scss/termine.scss`
- `assets/scss/suche.scss`
- `assets/scss/vorstand.scss`
- `assets/scss/rueckblick.scss`
- `assets/scss/blog_*.scss` (all blog page stylesheets)
- `assets/scss/register.scss`
- `assets/scss/mitgliedschaft.scss`
- `assets/scss/impressum.scss`

**Success Criteria:**
1. Every page in `hugo serve` looks visually consistent — no page feels "unstyled" or inconsistent with the new design
2. `npm run build` exits with code 0 (lint + Hugo build + HTML validation all pass)
3. Homepage, a concert page, search page, and a blog page each look correct at 375px, 768px, and 1440px viewports
4. Browser DevTools accessibility checker shows no contrast failures on text elements
5. Print preview of a content page shows readable text without broken backgrounds

---

*Roadmap created: 2026-03-21*
