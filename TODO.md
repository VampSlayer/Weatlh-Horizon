# 📋 WealthHorizon Roadmap & Feature TODO

A comprehensive feature roadmap and implementation plan for **WealthHorizon**. Each feature is designed to reinforce core **Vue 3 (Composition API)** concepts and strictly adhere to **Bootstrap 5 utility classes** (with zero custom CSS).

---

## 🎯 Phase 1: High-Impact Projections & Visuals

- [ ] **1. Inflation Adjustment (Real vs. Nominal Returns)**
  - **Financial Logic:** Toggle between Nominal Wealth (raw projected future amount) and Real Purchasing Power (adjusted by an annual inflation rate, e.g. 2.5% default).
  - **Vue 3 Concepts:** Reactive compound computed pipelines, dynamic calculation branching.
  - **UI (Bootstrap 5):** `form-check form-switch`, `input-group`, secondary badge indicators on cards showing "In today's purchasing power".

- [ ] **2. Financial Milestones & Freedom Age Tracker**
  - **Financial Logic:** Automatically computes and displays the exact calendar year and age when crossing key portfolio milestones (£100k, £250k, £500k, £1M, or Coast FIRE).
  - **Vue 3 Concepts:** Inverse compound mathematical solving, derived computed arrays, reactive date/age projections.
  - **UI (Bootstrap 5):** `card`, `list-group list-group-flush`, `badge bg-success-subtle text-success`, milestone progress indicators.

- [ ] **3. Native Bootstrap 5 Dark Mode Toggle**
  - **Visual Logic:** Toggle between Light, Dark, and System modes using Bootstrap 5.3's native `data-bs-theme="dark"` color system.
  - **Vue 3 Concepts:** `useTheme` composable, DOM attribute mutation via reactive watcher, `localStorage` preference persistence.
  - **UI (Bootstrap 5):** `btn-group`, `btn-outline-secondary` toggle buttons in `WealthHeader`. Zero custom CSS.

---

## 📊 Phase 2: Analytics & Deep Dives

- [ ] **4. Year-by-Year Growth Schedule & Breakdown Table**
  - **Financial Logic:** Expandable table showing the annual breakdown from current age to retirement age:
    - Age & Year
    - Starting Principal
    - Annual Deposits Added
    - Compound Interest Earned That Year
    - Year-End Portfolio Balance
  - **Vue 3 Concepts:** Dynamic table rendering (`v-for`), expandable table rows (`v-if` / collapse transitions), computed tabular aggregations.
  - **UI (Bootstrap 5):** `table table-hover table-striped table-sm`, `table-responsive`, collapsible detail accordions.

- [ ] **5. Visual Growth Stacked Breakdown**
  - **Financial Logic:** Visual representation comparing total out-of-pocket contributions vs. total compound interest gains over time.
  - **Vue 3 Concepts:** Reactive SVG paths or multi-segment Bootstrap progress bars with dynamic `:style="{ width: ... }"` bindings.
  - **UI (Bootstrap 5):** `progress-stacked`, `progress-bar bg-primary` and `progress-bar bg-success`.

---

## 🔀 Phase 3: Advanced Portfolio Management

- [ ] **6. Scenario Planning (Conservative vs. Moderate vs. Aggressive)**
  - **Financial Logic:** Allows creating and switching between 3 parallel scenarios (e.g., Bear Market 4%, Base Case 7%, Bull Market 10%) to assess best and worst-case retirement plans.
  - **Vue 3 Concepts:** Multi-scenario state management in composables, branched reactivity, cloning reactive objects.
  - **UI (Bootstrap 5):** `nav nav-pills`, side-by-side metric comparison cards.

- [ ] **7. Lump Sum Life Events (Windfalls & Major Expenses)**
  - **Financial Logic:** Schedule one-off future financial events:
    - *Injections (+):* Property sale, inheritance, bonus (+£50,000 at age 42).
    - *Withdrawals (-):* Home down-payment, university tuition, sabbatical (-£30,000 at age 50).
  - **Vue 3 Concepts:** Array state management, Vue 3 `<Teleport to="body">` for modal popups, reactive timeline adjustments.
  - **UI (Bootstrap 5):** `modal`, `modal-dialog`, `table table-borderless`, `badge bg-danger-subtle text-danger`.

- [ ] **8. Portfolio Export & Import (JSON & CSV)**
  - **Data Logic:**
    - Export all active pots and settings to a portable `.json` backup file or `.csv` summary.
    - Import a previously exported portfolio to restore configurations or share scenarios.
  - **Vue 3 Concepts:** HTML5 File API (`FileReader`), programmatic Blob generation, client-side download triggers.
  - **UI (Bootstrap 5):** `btn-outline-secondary` export/import buttons with hidden `<input type="file">`.

---

## 🏗️ Phase 4: Architecture & Developer Experience (DX)

- [ ] **9. Provide / Inject App Context**
  - **Architecture:** Provide currency symbol (`£`, `$`, `€`, `¥`), formatting options, and number precision down the component tree without prop drilling.
  - **Vue 3 Concepts:** `provide()` / `inject()`, TypeScript `InjectionKey<T>` for strong type safety.

- [ ] **10. Custom Directives (`v-autofocus` & `v-currency-mask`)**
  - **Usability:** Auto-focus the input field when adding a new pot, and format numbers cleanly on input/blur.
  - **Vue 3 Concepts:** Vue 3 Custom Directive lifecycle hooks (`mounted`, `updated`, `beforeUnmount`).

- [ ] **11. Modern Vue 3.5 APIs**
  - **Architecture:** Refactor form IDs and input focus using Vue 3.5's `useId()` for accessible labels and `useTemplateRef()` for type-safe element references.
