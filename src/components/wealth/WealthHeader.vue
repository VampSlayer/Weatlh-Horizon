<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentYear: number
  targetYear: number
  currency: string
  yearsToForecast: number
  currentAge: number
  retirementAge: number
  targetAge: number
  retirementYear: number
  yearsUntilRetirement: number
  lastSavedTime: string
}>()

const emit = defineEmits<{
  'update:targetYear': [year: number]
  'update:currency': [currency: string]
  'update:currentAge': [age: number]
  'update:retirementAge': [age: number]
  syncRetirement: []
  resetDefaults: []
}>()

function confirmReset() {
  if (confirm('Reset your wealth pots back to default sample data?')) {
    emit('resetDefaults')
  }
}

const targetYearModel = computed({
  get: () => props.targetYear,
  set: (val: number) => emit('update:targetYear', val),
})

const currencyModel = computed({
  get: () => props.currency,
  set: (val: string) => emit('update:currency', val),
})

const currentAgeModel = computed({
  get: () => props.currentAge,
  set: (val: number | string) => {
    const num = Number(val)
    if (!isNaN(num) && num >= 0) {
      emit('update:currentAge', num)
    }
  },
})

const retirementAgeModel = computed({
  get: () => props.retirementAge,
  set: (val: number | string) => {
    const num = Number(val)
    if (!isNaN(num) && num >= 0) {
      emit('update:retirementAge', num)
    }
  },
})

function validateCurrentAge() {
  if (props.currentAge < 16) emit('update:currentAge', 18)
  if (props.currentAge > 100) emit('update:currentAge', 100)
}

function validateRetirementAge() {
  if (props.retirementAge <= props.currentAge) {
    emit('update:retirementAge', Math.min(100, props.currentAge + 5))
  } else if (props.retirementAge > 105) {
    emit('update:retirementAge', 100)
  }
}

function setQuickYears(plusYears: number) {
  emit('update:targetYear', props.currentYear + plusYears)
}

const isTargetAtRetirement = computed(() => {
  return props.targetYear === props.retirementYear
})
</script>

<template>
  <header class="card bg-dark text-white border-0 shadow-sm mb-4 p-4 rounded-3">
    <!-- Header Top: Brand & Global Controls -->
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 pb-3 mb-3 border-bottom border-secondary">
      <div class="d-flex align-items-center gap-3">
        <div class="bg-white bg-opacity-10 border border-white border-opacity-10 rounded-3 p-2 fs-3">
          💎
        </div>
        <div>
          <h1 class="h3 mb-0 fw-bold">
            Wealth<span class="text-success">Horizon</span>
          </h1>
          <p class="small text-secondary mb-0">Multi-Pot Compound Wealth &amp; Retirement Projector</p>
        </div>
      </div>

      <div class="d-flex align-items-center gap-2 flex-wrap">
        <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill d-flex align-items-center gap-2">
          <span class="bg-success rounded-circle d-inline-block p-1"></span>
          <span>Auto-saved ({{ lastSavedTime }})</span>
        </span>

        <button
          type="button"
          class="btn btn-outline-secondary btn-sm px-3"
          title="Reset to default sample pots"
          @click="confirmReset"
        >
          ↺ Reset
        </button>

        <div class="d-flex align-items-center gap-2 bg-white bg-opacity-10 px-2 py-1 rounded-3">
          <label for="currency-select" class="small text-secondary mb-0 fw-semibold">Currency</label>
          <select
            id="currency-select"
            v-model="currencyModel"
            class="form-select form-select-sm bg-dark text-white border-secondary w-auto"
          >
            <option value="£">£ GBP</option>
            <option value="$">$ USD / CAD</option>
            <option value="€">€ EUR</option>
            <option value="₹">₹ INR</option>
            <option value="¥">¥ JPY</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Age & Retirement Planner Section -->
    <div class="card bg-black bg-opacity-25 border border-white border-opacity-10 rounded-3 p-3 mb-4">
      <div class="row g-3 align-items-center">
        <!-- Current Age Input -->
        <div class="col-auto">
          <label for="current-age-input" class="form-label text-secondary small fw-bold text-uppercase mb-1">
            Current Age
          </label>
          <div class="input-group input-group-sm">
            <input
              id="current-age-input"
              type="number"
              v-model.number="currentAgeModel"
              @blur="validateCurrentAge"
              class="form-control bg-dark text-white border-secondary fw-bold text-center"
            />
            <span class="input-group-text bg-secondary bg-opacity-25 text-white-50 border-secondary">yrs</span>
          </div>
        </div>

        <div class="col-auto text-secondary fs-5 d-none d-sm-block mt-4">➜</div>

        <!-- Target Retirement Age Input -->
        <div class="col-auto">
          <label for="retirement-age-input" class="form-label text-secondary small fw-bold text-uppercase mb-1">
            Retirement Age
          </label>
          <div class="input-group input-group-sm">
            <input
              id="retirement-age-input"
              type="number"
              v-model.number="retirementAgeModel"
              @blur="validateRetirementAge"
              class="form-control bg-dark text-white border-secondary fw-bold text-center"
            />
            <span class="input-group-text bg-secondary bg-opacity-25 text-white-50 border-secondary">yrs</span>
          </div>
        </div>

        <!-- Retirement Milestone Badge -->
        <div class="col-auto">
          <div class="bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 p-2 px-3">
            <div class="text-success small fw-bold text-uppercase">Retirement Milestone</div>
            <div class="small text-white fw-semibold">
              Year <strong>{{ retirementYear }}</strong> (in <strong>{{ yearsUntilRetirement }} yrs</strong>)
            </div>
          </div>
        </div>

        <!-- Sync Button -->
        <div class="col-auto ms-auto">
          <button
            type="button"
            :class="['btn btn-sm px-3 fw-bold', isTargetAtRetirement ? 'btn-success text-dark' : 'btn-outline-light']"
            @click="emit('syncRetirement')"
          >
            🎯 {{ isTargetAtRetirement ? 'Synced to Retirement' : `Forecast to Retirement (Age ${retirementAge})` }}
          </button>
        </div>
      </div>
    </div>

    <!-- Timeline & Slider Controls -->
    <div>
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
        <div class="d-flex align-items-center gap-2">
          <span class="text-secondary small fw-bold text-uppercase">Forecast:</span>
          <span class="badge bg-secondary">Now (Age {{ currentAge }})</span>
          <span class="text-secondary">➜</span>
          <span class="badge bg-success fs-6 fw-bold">
            Year {{ targetYear }}
            <span class="badge bg-dark ms-1">Age {{ targetAge }}</span>
            <span class="badge bg-success-subtle text-success ms-1">+{{ yearsToForecast }}y</span>
          </span>
        </div>

        <!-- Presets -->
        <div class="btn-group btn-group-sm">
          <button
            type="button"
            :class="['btn', yearsToForecast === 5 ? 'btn-success text-dark fw-bold' : 'btn-outline-secondary text-white-50']"
            @click="setQuickYears(5)"
          >
            +5 Yrs
          </button>
          <button
            type="button"
            :class="['btn', yearsToForecast === 10 ? 'btn-success text-dark fw-bold' : 'btn-outline-secondary text-white-50']"
            @click="setQuickYears(10)"
          >
            +10 Yrs
          </button>
          <button
            type="button"
            :class="['btn', yearsToForecast === 20 ? 'btn-success text-dark fw-bold' : 'btn-outline-secondary text-white-50']"
            @click="setQuickYears(20)"
          >
            +20 Yrs
          </button>
          <button
            type="button"
            :class="['btn', isTargetAtRetirement ? 'btn-success text-dark fw-bold' : 'btn-outline-secondary text-white-50']"
            @click="emit('syncRetirement')"
          >
            Retirement (Age {{ retirementAge }})
          </button>
        </div>
      </div>

      <!-- Range Slider -->
      <input
        id="horizon-slider"
        type="range"
        :min="currentYear"
        :max="currentYear + 40"
        v-model.number="targetYearModel"
        class="form-range"
      />

      <div class="d-flex justify-content-between text-secondary small">
        <span>{{ currentYear }} (Age {{ currentAge }})</span>
        <span>{{ currentYear + 10 }} (Age {{ currentAge + 10 }})</span>
        <span>{{ currentYear + 20 }} (Age {{ currentAge + 20 }})</span>
        <span>{{ currentYear + 30 }} (Age {{ currentAge + 30 }})</span>
        <span>{{ currentYear + 40 }} (+40y)</span>
      </div>
    </div>
  </header>
</template>
