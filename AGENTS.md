# AGENTS.md

## Project Overview

Static HTML portfolio website for David Lakubu. Two subsystems:

- **Portfolio** (root): Single `index.html` page using **Alpine.js 3.15.4** (CDN), vanilla JavaScript, CSS custom properties for theming, JSON data files. No build step.
- **Blog** (`blog/`): **Zola** static site generator with the "serene" theme (git submodule). Served at `blog.lakubudavid.me`.

## Build / Lint / Test Commands

### Portfolio (main site)

There is **no build pipeline, linter, or test suite** for the portfolio. It is deployed as raw static files to GitHub Pages.

- **Serve locally**: Use any static file server from the repo root.
  ```sh
  python3 -m http.server 8000
  # or
  npx serve .
  ```
- **Deploy**: Push to `main`. GitHub Actions (`.github/workflows/static.yml`) uploads the repo root to GitHub Pages with no build step.

### Blog (Zola)

```sh
# Install Zola via mise (configured in mise.toml)
mise install

# Serve blog locally with live reload
zola serve          # from blog/ directory

# Build blog for production
zola build          # from blog/ directory
```

### No test commands exist

There are no unit tests, integration tests, or end-to-end tests in this project. If adding tests, consider a lightweight approach matching the vanilla JS codebase (e.g., Vitest with jsdom for `app-alpine.js` logic).

## Architecture

```
portfolio/
  index.html                # Single-page entry point
  assets/
    app-alpine.js           # Alpine.js app logic (ACTIVE)
    app.js                  # Legacy vanilla JS (NOT loaded, kept for reference)
    style.css               # All styles (CSS custom properties for theming)
    me.json                 # Personal info (i18n: en/fr)
    projects.json           # Projects data (i18n: en/fr)
    skills.json             # Skills data
    work_experience.json    # Work experience data
    img/                    # Images
  blog/                     # Zola blog (separate subsystem)
    content/                # Blog markdown content
    themes/serene/          # Theme (git submodule, do NOT edit)
    zola.toml               # Zola config
  .github/workflows/        # CI/CD (GitHub Pages deploy)
  mise.toml                 # Tool versions (zola)
```

**Key point**: `app.js` is the legacy version and is NOT loaded by `index.html`. All active logic is in `app-alpine.js`. The two files should not diverge intentionally -- `app.js` exists only as a reference.

## Code Style Guidelines

### Language & Runtime

- **Vanilla JavaScript** (ES2020+). No TypeScript, no bundler, no module system.
- Modern JS features are used freely: `async/await`, optional chaining (`?.`), nullish coalescing (`??`), template literals, destructuring.
- All scripts are loaded via `<script>` tags in `index.html`. No `import`/`export` statements.

### Formatting

- **2-space indentation** in all files (JS, CSS, HTML, JSON).
- **Double quotes** for strings in JavaScript.
- **No trailing semicolons** are NOT enforced -- semicolons ARE used consistently.
- No formatter config exists (no Prettier/ESLint/Biome). Follow the existing style.

### Naming Conventions

| Context | Convention | Examples |
|---------|-----------|----------|
| JS variables & functions | camelCase | `fetchProjects`, `themeSelector`, `currentLanguage` |
| Alpine.js component functions | camelCase, descriptive noun | `meSection`, `skillsSection`, `themeSelector` |
| Data fetching functions | `fetch` prefix | `fetchMe()`, `fetchSkills()`, `fetchProjects()` |
| CSS classes & IDs | kebab-case | `collapse-trigger`, `blog-list-item`, `big-title` |
| JSON data properties | snake_case | `tech_used`, `github_link`, `profile_image` |
| JS files | kebab-case | `app-alpine.js` |
| JSON data files | snake_case | `work_experience.json` |
| HTML files | lowercase | `index.html` |

### Alpine.js Component Pattern

Every section component follows this template:

```js
function xSection() {
  return {
    data: null,       // or [] for collections
    loading: true,

    async init() {
      this.data = await fetchX();
      this.loading = false;
    },

    get i18n() {
      return Alpine.store("i18n");
    },

    isCollapsed() {
      return Alpine.store("collapse").isCollapsed("#x");
    },
    toggleCollapse() {
      Alpine.store("collapse").toggle("#x");
    },
    get buttonText() {
      return Alpine.store("collapse").getButtonText("#x");
    },

    // Section-specific computed getters...
  };
}
```

- Use **function declarations** (not arrow functions or classes) for component data.
- Return **object literals** with reactive state, `async init()`, computed getters, and methods.
- Access Alpine stores via **getters** (e.g., `get i18n()`).

### Error Handling

All data fetching functions use this pattern:

```js
async function fetchX() {
  try {
    const response = await fetch("assets/x.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching x:", error);
    return [];  // Return safe fallback: [] for arrays, null for objects
  }
}
```

- **Always** wrap `fetch()` in try/catch.
- **Always** check `response.ok` and throw on failure.
- **Always** return a safe fallback value (`[]` or `null`).
- Log errors with `console.error()` only -- no custom error classes or user-facing error UI.

### State Management

- **Alpine.store()** for shared state (`i18n`, `theme`, `collapse`).
- **localStorage** for persistence (theme, language, collapse states).
- Read pattern: `localStorage.getItem("key") || defaultValue`.
- Write pattern: `localStorage.setItem("key", value)`.

### i18n (Internationalization)

- Supports English (`en`) and French (`fr`).
- UI strings: `Alpine.store("i18n").t("key")` with translations defined in `app-alpine.js`.
- Data content: JSON files use `{ en: "...", fr: "..." }` objects. Resolved via `Alpine.store("i18n").localize(obj)`.
- Always fall back to `en` if the current language key is missing.

### CSS / Theming

- Single `style.css` file. No preprocessor, no CSS modules, no Tailwind on the main site.
- **CSS custom properties** for theming: `--background-color`, `--text-color`, `--border-color`, `--dot-color`, `--bold-text-color`, `--link-color`.
- Theme classes on `<body>`: `.theme-cocoa`, `.theme-noir`, `.theme-lila`, `.theme-latte`, `.theme-frappe`, `.theme-macchiato`, `.theme-mocha`.
- Uses **modern CSS nesting** syntax.
- Layout: CSS Grid and Flexbox.
- Responsive design via `@media` queries.

### Data Architecture

- Content is externalized to JSON files in `assets/` -- treat them as a lightweight CMS.
- JSON property names use **snake_case** (not camelCase).
- Translatable fields use `{ en: "...", fr: "..." }` objects.
- When adding new data fields, update both `en` and `fr` values.

### Things to Avoid

- Do NOT edit files inside `blog/themes/serene/` -- it is a git submodule.
- Do NOT add `import`/`export` statements -- there is no module bundler.
- Do NOT add TypeScript -- the project is vanilla JS by design.
- Do NOT introduce a build step for the main portfolio without explicit approval.
- Do NOT modify `app.js` -- it is the legacy file. All changes go to `app-alpine.js`.
