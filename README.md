# 💎 WealthHorizon

> **Multi-Pot Compound Wealth & Retirement Projector**  
> Built with **Vue 3**, **Bun**, **TypeScript**, and **Bootstrap 5**.

🌐 **Live Demo:** [https://vampslayer.github.io/Weatlh-Horizon/](https://vampslayer.github.io/Weatlh-Horizon/)

---

## 🚀 Features

- **Multi-Pot Wealth Management:** Add and manage custom pots (Pension, Stocks & Shares ISA, GIC / Fixed Bonds, Savings, Index Funds, Crypto).
- **Compound Interest Forecaster:** Live calculations incorporating current balances, annual return rates (% p.a.), and ongoing monthly deposits.
- **Age & Retirement Horizon Planner:** Enter your current age and desired retirement age to forecast exact calendar milestones and portfolio value at retirement.
- **4% Safe Withdrawal Rule (SWR):** Computes estimated sustainable monthly and annual passive retirement income without touching the principal.
- **Portfolio Asset Allocation:** Visual breakdown illustrating how your wealth distribution shifts between today and the target year.
- **Automatic LocalStorage Persistence:** State changes are reactively auto-saved to your browser using Vue 3's `watch()` with `{ deep: true }`.
- **Responsive 3-Column Layout:** Built with a fluid, wide-screen Bootstrap 5 grid that scales down gracefully on tablets and mobile devices.

---

## 🛠️ Tech Stack & Constraints

- **Framework:** Vue 3 (Composition API, `<script setup lang="ts">`)
- **Runtime & Package Manager:** [Bun](https://bun.sh/)
- **Language:** TypeScript
- **Styling:** **Bootstrap 5 only** (`bootstrap/dist/css/bootstrap.min.css`)
  - No custom `.css` files
  - No `<style>` or `<style scoped>` blocks
  - No static inline `style="..."` attributes (only dynamic Vue `:style` bindings for runtime percentages and category colors)

---

## 🏁 Getting Started

### 1. Install Dependencies
```bash
bun install
```

### 2. Run the Development Server
```bash
bun run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Build for Production
```bash
bun run build
```

---

## 🚢 Deployment to GitHub Pages

This repository includes a pre-configured GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Every commit pushed to the `main` branch will automatically:
1. Set up the Bun runtime.
2. Install dependencies with `bun install`.
3. Build the production bundle with `bun run build`.
4. Deploy the build to **GitHub Pages**.

> **Note:** To enable deployments in your GitHub repository, ensure GitHub Pages is enabled under:  
> **Repository Settings ➔ Pages ➔ Build and deployment ➔ Source: GitHub Actions**.

---

## 🗺️ Roadmap & Upcoming Features

Check out the detailed feature plan in [TODO.md](TODO.md) covering:
- 📉 **Inflation Adjustment (Real vs. Nominal Wealth)**
- 🎯 **Financial Milestones & Freedom Age Tracker**
- 🌙 **Native Bootstrap 5 Dark Mode Toggle**
- 📊 **Year-by-Year Growth Schedule & Breakdown Table**
- 🔀 **Scenario Planning (Conservative / Moderate / Aggressive)**
- 🎁 **Lump Sum Life Events (Windfalls & Major Expenses)**
- 📁 **JSON/CSV Export & Import**

---

## 📂 Project Structure

```
├── GEMINI.md                    # AI agent guidelines & architectural rules
├── README.md                    # Project overview & documentation
├── TODO.md                      # Feature roadmap & task list
├── index.html                   # HTML entry point
├── package.json                 # Dependencies & scripts
├── public/
│   └── favicon.svg              # App icon
└── src/
    ├── App.vue                  # Root application container (Bootstrap fluid)
    ├── main.ts                  # App initialization & Bootstrap CSS import
    ├── composables/
    │   └── useWealthProjection.ts # Core reactive state, compound math & storage watcher
    ├── components/
    │   └── wealth/
    │       ├── WealthTracker.vue # Main wealth tracker orchestrator
    │       ├── WealthHeader.vue  # Controls, currency picker, age & retirement planner
    │       ├── WealthStats.vue   # Top portfolio metrics & retirement drawdown cards
    │       ├── WealthPotCard.vue # Individual money pot card with live inputs
    │       └── AddPotForm.vue    # Modal/drawer for adding new asset pots
    └── types/
        └── wealth.ts            # TypeScript interfaces and types
```
