# Requirements: Musikverein Wollbach Website — SCSS Redesign

**Defined:** 2026-03-21
**Core Value:** A noticeably modern look that visitors immediately perceive as fresh and professional, while long-time members still recognize the site as theirs.

## v1 Requirements

### Design Tokens

- [ ] **TOKEN-01**: CSS custom properties introduced for color, spacing, radius, and shadow scales in `_global-variables.scss`
- [ ] **TOKEN-02**: Base font size increased from 14px to 15-16px with all dependent size tokens updated
- [ ] **TOKEN-03**: Line height increased from 1.428 to ~1.6 for improved readability
- [ ] **TOKEN-04**: Consistent spacing scale defined (xs/sm/md/lg/xl) using CSS custom properties
- [ ] **TOKEN-05**: Elevation/shadow scale defined (sm/md/lg) replacing ad-hoc box-shadow values
- [ ] **TOKEN-06**: Border-radius scale defined (sm/md/lg) for consistent rounding

### Base Typography & Global Styles

- [ ] **TYPE-01**: Heading hierarchy visually distinct and scaled appropriately for the new font-size base
- [ ] **TYPE-02**: H1 uses brand gold accent, improved letter-spacing and weight
- [ ] **TYPE-03**: Body text line-height and paragraph spacing improved for readability
- [ ] **TYPE-04**: Link styles in content areas use polished hover state (CSS transition-based)
- [ ] **TYPE-05**: Focus states use `:focus-visible` with brand-color outline — keyboard navigation is clearly visible
- [ ] **TYPE-06**: Button styles modernized: more padding, rounded corners, refined hover state

### Layout & Structure

- [ ] **LAYOUT-01**: Content area has more generous vertical breathing room (increased margins/padding)
- [ ] **LAYOUT-02**: Footer modernized: refined background, spacing, and link styles
- [ ] **LAYOUT-03**: Page title area has improved visual hierarchy

### Navigation

- [ ] **NAV-01**: Desktop navigation has polished hover states (animated underline or modern indicator)
- [ ] **NAV-02**: Active nav item clearly distinguished from hover state
- [ ] **NAV-03**: Dropdown submenu styling modernized (shadow, spacing, border-radius)
- [ ] **NAV-04**: Mobile hamburger menu opens/closes with smooth transition (already functional — style polish)
- [ ] **NAV-05**: Both default (dark) and `.inverse` (light/scroll) nav states look correct and cohesive
- [ ] **NAV-06**: Nav logo fill colors preserved correctly in both nav states

### Cards & Tiles

- [ ] **TILE-01**: Tiles have rounded corners (border-radius applied with overflow: hidden)
- [ ] **TILE-02**: Tile hover effect modernized (lift/elevation effect via transform + shadow)
- [ ] **TILE-03**: Tile overlay (blur/dark) refined for better text readability
- [ ] **TILE-04**: Tile text styling improved (size, weight, spacing)

### Image & Media Components

- [ ] **IMG-01**: Image containers have rounded corners with proper overflow clipping
- [ ] **IMG-02**: Figure/figcaption styling refined

### Secondary Components

- [ ] **COMP-01**: Breadcrumb navigation styled to match new design system
- [ ] **COMP-02**: Tabs component updated with modern active/hover states
- [ ] **COMP-03**: Mail popup styling modernized (border-radius, shadow, spacing)
- [ ] **COMP-04**: Responsive tables retain readable styling at all viewport widths
- [ ] **COMP-05**: Blockquote styling modernized (gold left-border accent retained or enhanced)

### Page-Specific Styles

- [ ] **PAGE-01**: Homepage (index.scss) carousel section and layout look cohesive with new design
- [ ] **PAGE-02**: Concert/event listing page (konzerte.scss, termine.scss) modernized
- [ ] **PAGE-03**: Suche (search) page styling updated
- [ ] **PAGE-04**: Vorstand (board) page styling updated
- [ ] **PAGE-05**: Blog/retrospective pages (rueckblick.scss, blog_*.scss) updated
- [ ] **PAGE-06**: Registration/membership pages (register.scss, mitgliedschaft.scss) updated
- [ ] **PAGE-07**: Impressum page (impressum.scss) updated

### Quality & Consistency

- [ ] **QA-01**: All SCSS passes `npm run lint` (stylelint + eslint) with zero errors
- [ ] **QA-02**: `npm run build` completes successfully (Hugo build + HTML validation)
- [ ] **QA-03**: Responsive layout preserved at all breakpoints (mobile, tablet, desktop)
- [ ] **QA-04**: Color contrast ≥ 4.5:1 for all normal-sized body text and links
- [ ] **QA-05**: No horizontal scrollbar at any viewport width
- [ ] **QA-06**: Brand gold accent color (#a9852a hue family) retained throughout
- [ ] **QA-07**: Print styles verified (no broken backgrounds or missing content)

## v2 Requirements

### Future Enhancements (Deferred)

- **ENH-01**: Fluid typography using `clamp()` for fully responsive type scale
- **ENH-02**: Dark mode support (requires JS toggle and template changes — out of scope for SCSS-only)
- **ENH-03**: `oklch()` color space for perceptually uniform tints/shades (requires PostCSS plugin)
- **ENH-04**: CSS-only image lazy loading shimmer effects
- **ENH-05**: View transitions enhancement (visual polish of existing view-transitions.scss)

## Out of Scope

| Feature | Reason |
|---------|--------|
| HTML template changes | Scope constraint — SCSS only |
| TypeScript / JavaScript changes | Scope constraint — logic untouched |
| Content or copy changes | Scope constraint |
| New pages or components | Restyling existing only |
| Dark mode | Requires JS toggle + template changes |
| Font replacement | Open Sans works fine; swap is higher risk for low gain |
| New npm dependencies | No additions to package.json |
| CSS framework adoption | Hugo SCSS stays as-is |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| TOKEN-01 through TOKEN-06 | Phase 1 | Pending |
| TYPE-01 through TYPE-06 | Phase 2 | Pending |
| LAYOUT-01 through LAYOUT-03 | Phase 3 | Pending |
| NAV-01 through NAV-06 | Phase 4 | Pending |
| TILE-01 through TILE-04 | Phase 5 | Pending |
| IMG-01 through IMG-02 | Phase 5 | Pending |
| COMP-01 through COMP-05 | Phase 6 | Pending |
| PAGE-01 through PAGE-07 | Phase 7 | Pending |
| QA-01 through QA-07 | All Phases | Pending |

**Coverage:**
- v1 requirements: 42 total
- Mapped to phases: 42
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-21*
*Last updated: 2026-03-21 after initial definition*
