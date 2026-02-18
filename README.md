# DWP Digital Channels - 2030 Strategy Visualisation

A small, data-driven Eleventy site that visualises how Digital Channels products connect to DWP’s 2030 strategy. It’s designed to be maintained by service and interaction designers: most updates are made by editing JSON files in `src/_data`, not by writing code.

## What this site does

- Shows a **Strategy** view that links outcomes to strategic pillars.
- Shows an **Outcome** view that maps services/activities to outcomes and related products.
- Shows a **Product** view with product tiles, descriptions, and tags.
- Lets you click services/activities or product tiles to highlight related items and reveal more context.

## How it works

Eleventy reads data from `src/_data` and injects it into Nunjucks templates (`.njk`). A small JS file wires up interactions on the page.

Data sources (edit these to change content):

- `src/_data/landingPage.json` — home page heading, intro, and CTAs.
- `src/_data/pillars.json` — strategic pillars (used for the strategy wheel).
- `src/_data/outcomes.json` — outcomes, tied to pillars and services/activities.
- `src/_data/services.json` — services and activities (and the products they relate to).
- `src/_data/products.json` — product tiles, descriptions, icons, and tags-by-service.

Derived data (auto-built from the above):

- `src/_data/productsWithTags.js` — builds product tags from `tagsByService`.
- `src/_data/actionsByProduct.js` — maps products to related services/activities.
- `src/_data/outcomesByAction.js` — maps services/activities to pillar IDs.
- `src/_data/outcomesByPillar.js` — groups outcomes by pillar.

## Project structure

```text
.
├─ src/
│  ├─ _data/            # Content and relationships (edit here most)
│  ├─ _includes/        # Reusable Nunjucks components
│  ├─ styles/           # Sass source
│  ├─ index.njk         # Home
│  ├─ outcome.njk       # Outcome view
│  ├─ product.njk       # Product view
│  └─ strategy/         # Strategy view
│     └─ *.njk          # Pages under /strategy/
├─ assets/              # JS + static assets
├─ icons/               # Product icons
├─ _site/               # Build output
├─ .eleventy.js         # Eleventy config
├─ postcss.config.js    # CSS build config
└─ package.json         # Scripts + dependencies
```

## Common content updates

### Edit or add a product

1. Update `src/_data/products.json`.
2. Ensure the product `id` is unique.
3. Add an icon file to `icons/` and reference its filename in `icon`.
4. Update `productIds` in `src/_data/services.json` so the product appears in the right services/activities.

### Update services or activities

1. Edit entries in `src/_data/services.json`.
2. Each item uses `type: "service"` or `type: "activity"`.
3. Link to products via `productIds`.

### Update outcomes or pillars

1. Edit `src/_data/outcomes.json` (for outcomes and their links to services/activities).
2. Edit `src/_data/pillars.json` (for pillar names and slugs).

### Update the home page text

Edit `src/_data/landingPage.json`.

## Development

Install dependencies:

```bash
npm install
```

Run the site locally:

```bash
npm start
```

This runs Eleventy and Sass in watch mode. Output appears in `_site/` and is served locally.

## Production build

```bash
npm run build
```

This builds the site, compiles Sass, and minifies HTML/CSS for production.

## Notes

- The project is intentionally data-first. Most changes are JSON edits, not code changes.
- If something doesn’t appear as expected, double-check the `id` links between files.
- Keep `id` values stable; other files reference them.
