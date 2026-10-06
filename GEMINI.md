# Project Guidelines: WealthHorizon

## Tech Stack
- **Framework:** Vue 3 (Composition API, `<script setup lang="ts">`)
- **Package Manager & Runtime:** Bun (`bun install`, `bun run dev`, `bun run build`)
- **Language:** TypeScript (Strict type checking with `vue-tsc`)
- **Styling Framework:** Bootstrap 5 (`bootstrap/dist/css/bootstrap.min.css`)

---

## Strict Styling Rules
1. **Bootstrap Only:** All layout, sizing, spacing, typography, and component styling must use standard Bootstrap 5 classes (`container-fluid`, `row`, `col-*`, `card`, `shadow-sm`, `border-0`, `p-*`, `m-*`, `d-flex`, `gap-*`, `btn`, `badge`, `form-control`, `input-group`, etc.).
2. **NO Custom CSS:**
   - Do **NOT** create custom `.css` files.
   - Do **NOT** add `<style>` or `<style scoped>` blocks in Vue Single File Components.
   - Do **NOT** use static inline `style="..."` attributes on elements.
3. **Allowed Inline Styles:**
   - Dynamic Vue `:style="{ ... }"` bindings are **strictly permitted only** for runtime reactive calculations:
     - Calculated progress bar percentages (`:style="{ width: `${percent}%` }"`)
     - User/pot dynamic theme colors (`:style="{ borderTopColor: pot.color + ' !important' }"` or `:style="{ backgroundColor: cat.color }"`)

---

## Architectural Conventions
- **Composables for Business Logic:** All financial math, projections, and reactive state reside in composables (e.g., `src/composables/useWealthProjection.ts`), keeping `.vue` components focused purely on UI.
- **LocalStorage Persistence:** Auto-save reactive state using Vue 3's `watch()` with `{ deep: true }`.
- **Component Organization:** Keep components modular and feature-focused under `src/components/wealth/`.
- **Package Management:** Always use `bun` commands for dependencies and running scripts.
