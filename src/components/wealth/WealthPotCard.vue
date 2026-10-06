<script setup lang="ts">
import { computed } from 'vue'
import type { WealthPot, PotProjection } from '../../types/wealth'

const props = defineProps<{
  pot: WealthPot & { projection: PotProjection }
  currency: string
  targetYear: number
  yearsToForecast: number
}>()

const emit = defineEmits<{
  update: [id: string, updates: Partial<WealthPot>]
  remove: [id: string]
}>()

const currentAmount = computed({
  get: () => props.pot.currentAmount,
  set: (val: number) => emit('update', props.pot.id, { currentAmount: Math.max(0, val || 0) }),
})

const annualRate = computed({
  get: () => props.pot.annualRate,
  set: (val: number) => emit('update', props.pot.id, { annualRate: Math.max(0, val || 0) }),
})

const monthlyContribution = computed({
  get: () => props.pot.monthlyContribution,
  set: (val: number) => emit('update', props.pot.id, { monthlyContribution: Math.max(0, val || 0) }),
})

function format(num: number): string {
  return `${props.currency}${Math.round(num).toLocaleString()}`
}

const potGainPercent = computed(() => {
  if (props.pot.projection.totalContributed === 0) return 0
  return (
    (props.pot.projection.interestEarned / props.pot.projection.totalContributed) *
    100
  )
})
</script>

<template>
  <div class="card shadow-sm border-0 border-top border-4 rounded-3 p-3 h-100" :style="{ borderTopColor: pot.color + ' !important' }">
    <!-- Card Header: Category Badge & Title -->
    <div class="d-flex justify-content-between align-items-start mb-2">
      <div>
        <span class="badge rounded-pill mb-1 fw-bold text-uppercase" :style="{ backgroundColor: `${pot.color}20`, color: pot.color }">
          {{ pot.category }}
        </span>
        <h3 class="h5 fw-bold text-dark mb-0">{{ pot.name }}</h3>
      </div>
      <button
        type="button"
        class="btn btn-sm btn-outline-danger border-0 rounded-circle"
        title="Remove pot"
        @click="emit('remove', pot.id)"
      >
        ✕
      </button>
    </div>

    <!-- Projected Future Value Highlight Box -->
    <div class="bg-light border rounded-3 p-3 mb-3">
      <div class="text-secondary small fw-bold text-uppercase">
        Projected in {{ targetYear }}
      </div>
      <div class="fs-3 fw-bold text-dark my-1">
        {{ format(pot.projection.projectedAmount) }}
      </div>
      <div class="small text-secondary d-flex align-items-center gap-1">
        <span>Interest Gain:</span>
        <strong class="text-success">+{{ format(pot.projection.interestEarned) }} (+{{ potGainPercent.toFixed(1) }}%)</strong>
      </div>
    </div>

    <!-- Live Inputs Grid -->
    <div class="row g-2 mb-3">
      <div class="col-12 col-sm-4">
        <label class="form-label text-secondary small fw-bold mb-1">
          Current Value
        </label>
        <div class="input-group input-group-sm">
          <span class="input-group-text bg-light text-secondary">{{ currency }}</span>
          <input
            type="number"
            min="0"
            step="500"
            v-model.number="currentAmount"
            class="form-control fw-bold"
          />
        </div>
      </div>

      <div class="col-12 col-sm-4">
        <label class="form-label text-secondary small fw-bold mb-1">
          Interest Rate
        </label>
        <div class="input-group input-group-sm">
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            v-model.number="annualRate"
            class="form-control fw-bold"
          />
          <span class="input-group-text bg-light text-secondary">%</span>
        </div>
      </div>

      <div class="col-12 col-sm-4">
        <label class="form-label text-secondary small fw-bold mb-1">
          Monthly Deposit
        </label>
        <div class="input-group input-group-sm">
          <span class="input-group-text bg-light text-secondary">{{ currency }}</span>
          <input
            type="number"
            min="0"
            step="50"
            v-model.number="monthlyContribution"
            class="form-control fw-bold"
          />
        </div>
      </div>
    </div>

    <!-- Mini Progress Breakdown Bar -->
    <div class="mt-auto">
      <div class="progress">
        <div
          class="progress-bar bg-info"
          :style="{
            width: `${(pot.projection.currentAmount / pot.projection.projectedAmount) * 100}%`,
          }"
          title="Current Balance"
        ></div>
        <div
          class="progress-bar bg-primary"
          :style="{
            width: `${((pot.projection.totalContributed - pot.projection.currentAmount) / pot.projection.projectedAmount) * 100}%`,
          }"
          title="Contributions"
        ></div>
        <div
          class="progress-bar bg-success"
          :style="{
            width: `${(pot.projection.interestEarned / pot.projection.projectedAmount) * 100}%`,
          }"
          title="Compound Growth"
        ></div>
      </div>
    </div>
  </div>
</template>
