<script setup lang="ts">
const props = defineProps<{
  totalWealthNow: number
  totalProjectedWealth: number
  totalInterestGained: number
  totalFutureContributions: number
  growthMultiplier: number
  targetYear: number
  targetAge: number
  monthlyPassiveIncome: number
  annualPassiveIncome: number
  currency: string
}>()

function fmt(amount: number): string {
  return `${props.currency}${Math.round(amount).toLocaleString()}`
}
</script>

<template>
  <div class="row g-3 mb-4">
    <!-- Card 1: Today's Net Worth -->
    <div class="col-12 col-sm-6 col-xl-3">
      <div class="card h-100 shadow-sm border-0 p-3">
        <div class="d-flex align-items-center gap-2 mb-2">
          <span class="fs-5">💼</span>
          <span class="small fw-bold text-secondary text-uppercase">Total Wealth Now</span>
        </div>
        <div class="fs-2 fw-bold text-dark">
          {{ fmt(totalWealthNow) }}
        </div>
        <p class="small text-secondary mb-0 mt-2">Combined sum across all active pots today</p>
      </div>
    </div>

    <!-- Card 2: Projected Net Worth (Hero Card) -->
    <div class="col-12 col-sm-6 col-xl-3">
      <div class="card h-100 shadow-sm border border-success border-opacity-50 p-3 bg-success bg-opacity-10">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="d-flex align-items-center gap-2">
            <span class="fs-5">🚀</span>
            <span class="small fw-bold text-success text-uppercase">
              At Age {{ targetAge }} ({{ targetYear }})
            </span>
          </div>
          <span class="badge bg-success rounded-pill px-2 py-1">
            {{ growthMultiplier.toFixed(1) }}x
          </span>
        </div>

        <div class="fs-2 fw-bold text-success">
          {{ fmt(totalProjectedWealth) }}
        </div>

        <!-- Bootstrap Multi-Segment Progress Bar -->
        <div class="progress mt-2">
          <div
            class="progress-bar bg-info"
            :style="{ width: `${Math.min(100, (totalWealthNow / totalProjectedWealth) * 100)}%` }"
            title="Base"
          ></div>
          <div
            class="progress-bar bg-primary"
            :style="{ width: `${Math.min(100, (totalFutureContributions / totalProjectedWealth) * 100)}%` }"
            title="Deposits"
          ></div>
          <div
            class="progress-bar bg-success"
            :style="{ width: `${Math.min(100, (totalInterestGained / totalProjectedWealth) * 100)}%` }"
            title="Growth"
          ></div>
        </div>

        <div class="d-flex justify-content-between text-secondary small mt-2">
          <span><span class="badge bg-info p-1 me-1"></span>Base</span>
          <span><span class="badge bg-primary p-1 me-1"></span>Deposits</span>
          <span><span class="badge bg-success p-1 me-1"></span>Interest</span>
        </div>
      </div>
    </div>

    <!-- Card 3: Compound Interest Gain -->
    <div class="col-12 col-sm-6 col-xl-3">
      <div class="card h-100 shadow-sm border-0 p-3">
        <div class="d-flex align-items-center gap-2 mb-2">
          <span class="fs-5">✨</span>
          <span class="small fw-bold text-secondary text-uppercase">Compound Interest Gain</span>
        </div>
        <div class="fs-2 fw-bold text-success">
          +{{ fmt(totalInterestGained) }}
        </div>
        <p class="small text-secondary mb-0 mt-2">Pure passive returns accumulated from interest</p>
      </div>
    </div>

    <!-- Card 4: Retirement Drawdown (4% Rule) -->
    <div class="col-12 col-sm-6 col-xl-3">
      <div class="card h-100 shadow-sm border-0 p-3">
        <div class="d-flex align-items-center gap-2 mb-2">
          <span class="fs-5">🏖️</span>
          <span class="small fw-bold text-primary text-uppercase">Retirement Drawdown</span>
        </div>
        <div class="fs-2 fw-bold text-primary">
          {{ fmt(monthlyPassiveIncome) }}<span class="fs-6 text-secondary fw-normal">/mo</span>
        </div>
        <p class="small text-secondary mb-0 mt-2">
          <strong>{{ fmt(annualPassiveIncome) }}/yr</strong> under the 4% Safe Withdrawal Rule
        </p>
      </div>
    </div>
  </div>
</template>
