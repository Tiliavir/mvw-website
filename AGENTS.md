# AGENTS.md - Development Guide for Musikverein Wollbach Website

This is a static website built with Hugo, SCSS, and TypeScript. It uses npm for package management and builds to static HTML/CSS/JS.

## Project Overview

- **Framework**: Hugo (static site generator)
- **Package Manager**: npm
- **Languages**: TypeScript, SCSS, HTML/Markdown (Hugo templates)
- **Prerequisites**: [Hugo extended version](https://gohugo.io/getting-started/installing/) (supports SCSS)

---

## Build / Lint / Test Commands

### Development Server
```bash
hugo serve
```
Runs a local development server with live reload.

### Production Build
```bash
npm run build
```
Runs `hugo --minify` followed by HTML validation via `npm run validate`.

### Linting
```bash
npm run lint
```
Runs both stylelint (SCSS) and ESLint (TypeScript/JavaScript):
- `stylelint '**/*.scss'`
- `npx eslint .`

### Validation Only
```bash
npm run validate
```
Runs HTML validation without full build. Displays warning about view-transitions rule status.

### Search Index Generation
```bash
npm run index
```
Generates the Lunr search index for the site search functionality.

### Single File Linting
```bash
# Lint a single SCSS file
npx stylelint path/to/file.scss

# Lint a single JS/TS file
npx eslint path/to/file.ts
```

### CI/CD
The project uses GitHub Actions (see `.github/workflows/ci.yml`). CI runs:
1. `npm ci` - Install dependencies
2. `npm run build` - Full production build
3. `npm run index` - Generate search index

**Note**: There are no automated tests in this project. The CI pipeline only validates linting and build.

---

## Code Style Guidelines

### General Principles

- **No comments** in code (unless explaining complex business logic)
- Keep files small and focused
- Use modern ES6+ JavaScript/TypeScript features

### TypeScript / JavaScript

- **Classes**: Use PascalCase (e.g., `class Index`, `class App`)
- **Methods**: Use camelCase (e.g., `initialize()`, `registerScroll()`)
- **Visibility**: Use explicit `public` and `private` keywords
- **Types**: Always specify types for function parameters and return types
- **DOM Queries**: Use generic type parameter (e.g., `querySelector<HTMLElement>`)
- **Null Safety**: Use optional chaining (`?.`) and nullish coalescing where appropriate
- **Initialization**: Use non-null assertion (`!`) only when DOM element existence is guaranteed

Example from codebase:
```typescript
class App {
  public static initialize(): void {
    const nav = document.querySelector<HTMLElement>(".navigation");
    if (!nav) return;
    // ...
  }

  private static registerScroll(): void {
    // ...
  }
}
```

### SCSS / CSS

- **Naming**: Use BEM-like nesting (e.g., `.parent { .child { ... } }`)
- **Variables**: Define in `themes/mv-wollbach/assets/scss/_global-variables.scss`
- **Mixins**: Place in `themes/mv-wollbach/assets/scss/mixins/`
- **Organization**: One logical block per file, use descriptive names
- **Vendor prefixes**: Handled by Autoprefixer (configured in PostCSS)

Example from codebase:
```scss
.carousel {
  position: relative;

  ul {
    overflow: auto;
    display: flex;
    
    li {
      position: relative;
      
      > * {
        position: absolute;
        inset: 0;
      }
    }
  }
}
```

### Imports / Build Structure

- **SCSS imports**: Use tilde-free paths relative to project root
- **Theme assets**: Stored in `themes/mv-wollbach/assets/`
- **Page-specific assets**: Stored in `assets/scss/` and `assets/ts/`
- **Hugo templates**: Stored in `themes/mv-wollbach/layouts/`

### Hugo Templates

- Use Hugo's built-in templating functions
- Follow Hugo conventions for content organization (`content/[section]/[page]/index.md`)
- Use archetypes for consistent page scaffolding

### Error Handling

- **TypeScript**: Let TypeScript handle type errors; do not use `any` type
- **DOM operations**: Always check for null before accessing elements
- **Build errors**: Fix lint errors before building; production build will fail on lint errors

### File Naming

- **TypeScript**: PascalCase for classes (e.g., `Index.ts`, `App.ts`)
- **SCSS**: Underscore prefix for partials (e.g., `_global-variables.scss`)
- **Content pages**: Use `index.md` for page content in Hugo

---

## Project Structure

```
/workspace
├── .github/workflows/      # CI/CD pipelines
├── assets/
│   ├── scss/               # Page-specific SCSS
│   └── ts/                 # Page-specific TypeScript
├── content/                # Hugo content pages
├── themes/mv-wollbach/
│   ├── assets/
│   │   ├── scss/           # Theme SCSS (global styles, variables, mixins)
│   │   └── ts/             # Theme TypeScript
│   ├── layouts/            # Hugo templates
│   └── postcss.config.js
├── package.json            # npm configuration
├── .stylelintrc           # Stylelint configuration
└── README.md
```

---

## Common Development Tasks

### Adding a New Page
1. Create content in `content/[section]/[page]/index.md`
2. Add page-specific SCSS in `assets/scss/[page].scss`
3. Add page-specific TS in `assets/ts/[page].ts` if needed

### Adding Images
Optimize images before adding to the site:
```bash
mogrify -format webp -strip -auto-orient -resize 2000x2000 -quality 80 **/*.{jpg,jpeg,png}
```

### Adding Dependencies
```bash
npm install <package>
```

---

## Editor Configuration

The project uses:
- **ESLint**: JavaScript/TypeScript linting
- **Stylint**: SCSS linting
- **PostCSS + Autoprefixer**: CSS processing

Ensure your editor has appropriate extensions for ESLint and Stylelint support.
