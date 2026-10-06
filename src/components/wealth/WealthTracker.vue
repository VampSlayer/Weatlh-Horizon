<script setup lang="ts">
import { computed } from 'vue'
import { useWealthProjection } from '../../composables/useWealthProjection'
import WealthHeader from './WealthHeader.vue'
import WealthStats from './WealthStats.vue'
import WealthPotCard from './WealthPotCard.vue'
import AddPotForm from './AddPotForm.vue'

const {
  currentYear,
  targetYear,
  currency,
  currentAge,
  retirementAge,
  targetAge,
  retirementYear,
  yearsUntilRetirement,
  monthlyPassiveIncome,
  annualPassiveIncome,
  setTargetToRetirement,
  yearsToForecast,
  potsWithProjections,
  totalWealthNow,
  totalProjectedWealth,
  totalFutureContributions,
  totalInterestGained,
  growthMultiplier,
  lastSavedTime,
  addPot,
  removePot,
  updatePot,
  resetToDefaults,
} = useWealthProjection()

// Computed category asset allocation breakdown
const categoryBreakdown = computed(() => {
  const totals: Record<string, { current: number; projected: number; color: string }> = {}

  for (const pot of potsWithProjections.value) {
    if (!totals[pot.category]) {
      totals[pot.category] = { current: 0, projected: 0, color: pot.color }
    }
    totals[pot.category].current += Number(pot.currentAmount) || 0
    totals[pot.category].projected += pot.projection.projectedAmount
  }

  const grandCurrent = totalWealthNow.value || 1
  const grandProjected = totalProjectedWealth.value || 1

  return Object.entries(totals).map(([category, data]) => ({
    category,
    color: data.color,
    current: data.current,
    currentPercent: (data.current / grandCurrent) * 100,
    projected: data.projected,
    projectedPercent: (data.projected / grandProjected) * 100,
  }))
})
</script>

<template>
  <div class="wealth-tracker-container">
    <!-- Header with interactive age & retirement controls -->
    <WealthHeader
      :current-year="currentYear"
      :target-year="targetYear"
      :currency="currency"
      :years-to-forecast="yearsToForecast"
      :current-age="currentAge"
      :retirement-age="retirementAge"
      :target-age="targetAge"
      :retirement-year="retirementYear"
      :years-until-retirement="yearsUntilRetirement"
      :last-saved-time="lastSavedTime"
      @update:target-year="targetYear = $event"
      @update:currency="currency = $event"
      @update:current-age="currentAge = $event"
      @update:retirement-age="retirementAge = $event"
      @sync-retirement="setTargetToRetirement"
      @reset-defaults="resetToDefaults"
    />

    <!-- Key Metrics & Compound Growth Banner -->
    <WealthStats
      :total-wealth-now="totalWealthNow"
      :total-projected-wealth="totalProjectedWealth"
      :total-interest-gained="totalInterestGained"
      :total-future-contributions="totalFutureContributions"
      :growth-multiplier="growthMultiplier"
      :target-year="targetYear"
      :target-age="targetAge"
      :monthly-passive-income="monthlyPassiveIncome"
      :annual-passive-income="annualPassiveIncome"
      :currency="currency"
    />

    <!-- Section Title -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h2 class="h4 fw-bold text-dark mb-1">Your Wealth Pots ({{ potsWithProjections.length }})</h2>
        <p class="small text-muted mb-0">
          Individual pots with customized interest rates and monthly contributions.
        </p>
      </div>
    </div>

    <!-- Bootstrap 3-Column Responsive Grid (col-12 col-md-6 col-xl-4) -->
    <TransitionGroup name="pot-list" tag="div" class="row g-4 mb-4">
      <div
        v-for="pot in potsWithProjections"
        :key="pot.id"
        class="col-12 col-md-6 col-xl-4"
      >
        <WealthPotCard
          :pot="pot"
          :currency="currency"
          :target-year="targetYear"
          :years-to-forecast="yearsToForecast"
          @update="updatePot"
          @remove="removePot"
        />
      </div>
    </TransitionGroup>

    <!-- Add Pot Form -->
    <AddPotForm :currency="currency" @add="addPot" />

    <!-- Portfolio Allocation Breakdown Card -->
    <section class="card shadow-sm border-0 rounded-3 p-4 mb-4">
      <h3 class="h5 fw-bold text-dark mb-1">Portfolio Allocation Breakdown</h3>
      <p class="small text-secondary mb-4">
        How your wealth distribution shifts between today and {{ targetYear }}
      </p>

      <div class="d-flex flex-column gap-3 mb-4">
        <!-- Today's Allocation -->
        <div class="row align-items-center g-2">
          <div class="col-12 col-sm-3 col-md-2">
            <span class="small fw-bold text-secondary text-uppercase">Today ({{ currentYear }}):</span>
          </div>
          <div class="col-12 col-sm-9 col-md-10">
            <div class="progress">
              <div
                v-for="cat in categoryBreakdown"
                :key="cat.category"
                class="progress-bar"
                :style="{ width: `${cat.currentPercent}%`, backgroundColor: cat.color }"
                :title="`${cat.category}: ${cat.currentPercent.toFixed(1)}%`"
              ></div>
            </div>
          </div>
        </div>

        <!-- Projected Allocation -->
        <div class="row align-items-center g-2">
          <div class="col-12 col-sm-3 col-md-2">
            <span class="small fw-bold text-secondary text-uppercase">Projected ({{ targetYear }}):</span>
          </div>
          <div class="col-12 col-sm-9 col-md-10">
            <div class="progress">
              <div
                v-for="cat in categoryBreakdown"
                :key="cat.category"
                class="progress-bar"
                :style="{ width: `${cat.projectedPercent}%`, backgroundColor: cat.color }"
                :title="`${cat.category}: ${cat.projectedPercent.toFixed(1)}%`"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Allocation Category Legend Badges -->
      <div class="d-flex flex-wrap gap-3 pt-3 border-top">
        <div
          v-for="cat in categoryBreakdown"
          :key="cat.category"
          class="d-flex align-items-center gap-2 small"
        >
          <span class="badge rounded-circle p-1 me-1" :style="{ backgroundColor: cat.color }"></span>
          <span class="fw-semibold text-dark">{{ cat.category }}:</span>
          <span class="text-muted">{{ cat.projectedPercent.toFixed(0) }}% in {{ targetYear }}</span>
        </div>
      </div>
    </section>
  </div>
</template>
