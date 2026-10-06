<script setup lang="ts">
import { ref } from 'vue'
import type { FinancialMilestone } from '../../types/wealth'

const props = defineProps<{
  milestones: FinancialMilestone[]
  nextMilestone: FinancialMilestone | null
  totalWealthNow: number
  totalProjectedWealth: number
  currentAge: number
  retirementAge: number
  currentYear: number
  currency: string
  coastRetirementValue: number
  coastFireTargetToday: number
  isCoastFireReached: boolean
}>()

const emit = defineEmits<{
  (e: 'add-milestone', payload: { label: string; targetAmount: number }): void
  (e: 'remove-milestone', id: string): void
}>()

// Custom milestone form state
const showAddForm = ref(false)
const customLabel = ref('')
const customAmount = ref<number | null>(null)
const formError = ref('')

function handleAddMilestone() {
  if (!customLabel.value.trim()) {
    formError.value = 'Please provide a name or label for the milestone.'
    return
  }
  if (!customAmount.value || customAmount.value <= 0) {
    formError.value = 'Please enter a target amount greater than zero.'
    return
  }

  emit('add-milestone', {
    label: customLabel.value.trim(),
    targetAmount: Number(customAmount.value),
  })

  customLabel.value = ''
  customAmount.value = null
  formError.value = ''
  showAddForm.value = false
}

function formatMoney(amount: number): string {
  return `${props.currency}${Math.round(amount).toLocaleString()}`
}
</script>

<template>
  <section class="card shadow-sm border-0 rounded-3 p-4 mb-4">
    <!-- Header -->
    <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="fs-4">🎯</span>
          <h3 class="h5 fw-bold text-dark mb-0">Financial Milestones &amp; Freedom Age</h3>
        </div>
        <p class="small text-secondary mb-0">
          Inverse compound solver calculating the exact year and age you will cross each financial horizon.
        </p>
      </div>

      <button
        type="button"
        class="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
        @click="showAddForm = !showAddForm"
      >
        <span>{{ showAddForm ? '✕ Close Form' : '+ Add Custom Goal' }}</span>
      </button>
    </div>

    <!-- Quick Highlights: Next Milestone + Coast FIRE Banner -->
    <div class="row g-3 mb-4">
      <!-- Next Horizon Highlight Card -->
      <div class="col-12 col-lg-7">
        <div class="card h-100 border border-primary-subtle bg-primary-subtle bg-opacity-10 rounded-3 p-3">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <span class="badge bg-primary text-white">Next Horizon</span>
            <span v-if="nextMilestone" class="badge bg-primary-subtle text-primary border border-primary-subtle">
              {{ formatMoney(nextMilestone.targetAmount) }}
            </span>
          </div>

          <div v-if="nextMilestone">
            <h4 class="h6 fw-bold text-dark mb-1">{{ nextMilestone.label }}</h4>
            <p class="small text-secondary mb-3">{{ nextMilestone.description }}</p>

            <div class="row g-2 align-items-center">
              <div class="col-12 col-md-6">
                <span class="small text-muted d-block">Estimated Arrival</span>
                <span class="fw-bold text-primary fs-6">
                  <template v-if="nextMilestone.yearsToReach !== null">
                    In {{ nextMilestone.yearsToReach }} yrs (Age {{ nextMilestone.projectedAge }}, {{ nextMilestone.projectedYear }})
                  </template>
                  <template v-else>
                    Trajectory adjustment needed
                  </template>
                </span>
              </div>
              <div class="col-12 col-md-6">
                <span class="small text-muted d-block">Remaining to Goal</span>
                <span class="fw-bold text-dark fs-6">
                  {{ formatMoney(Math.max(0, nextMilestone.targetAmount - totalWealthNow)) }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-2">
            <span class="fs-4 d-block mb-1">👑</span>
            <span class="fw-bold text-success">All preset milestones achieved!</span>
            <p class="small text-muted mb-0">Add a custom milestone above to set new horizons.</p>
          </div>
        </div>
      </div>

      <!-- Coast FIRE Status Card -->
      <div class="col-12 col-lg-5">
        <div
          class="card h-100 rounded-3 p-3 border"
          :class="isCoastFireReached ? 'border-success-subtle bg-success-subtle bg-opacity-10' : 'border-secondary-subtle bg-light'"
        >
          <div class="d-flex justify-content-between align-items-start mb-2">
            <span
              class="badge"
              :class="isCoastFireReached ? 'bg-success text-white' : 'bg-secondary text-white'"
            >
              Coast FIRE Status
            </span>
            <span
              class="badge"
              :class="isCoastFireReached ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-secondary-subtle text-secondary border border-secondary-subtle'"
            >
              {{ isCoastFireReached ? 'Unlocked 🎉' : 'In Progress' }}
            </span>
          </div>

          <h4 class="h6 fw-bold text-dark mb-1">Zero-Deposit Retirement Growth</h4>
          <p class="small text-secondary mb-3">
            If you stopped saving today, current wealth compounds to
            <strong class="text-dark">{{ formatMoney(coastRetirementValue) }}</strong> by age {{ retirementAge }}.
          </p>

          <div>
            <span class="small text-muted d-block">Target Wealth Today to Coast:</span>
            <span class="fw-bold fs-6" :class="isCoastFireReached ? 'text-success' : 'text-dark'">
              {{ formatMoney(coastFireTargetToday) }}
            </span>
            <span v-if="!isCoastFireReached" class="small text-muted ms-2">
              ({{ formatMoney(Math.max(0, coastFireTargetToday - totalWealthNow)) }} needed)
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Collapsible Add Custom Milestone Form -->
    <div v-if="showAddForm" class="card bg-light border p-3 rounded-3 mb-4">
      <h4 class="h6 fw-bold text-dark mb-2">Create Custom Financial Horizon</h4>
      <div class="row g-2">
        <div class="col-12 col-md-6">
          <label class="form-label small text-muted mb-1">Goal / Milestone Name</label>
          <input
            v-model="customLabel"
            type="text"
            class="form-control form-control-sm"
            placeholder="e.g. Dream House Deposit, Sabbatical Fund"
          />
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label small text-muted mb-1">Target Amount ({{ currency }})</label>
          <div class="input-group input-group-sm">
            <span class="input-group-text">{{ currency }}</span>
            <input
              v-model.number="customAmount"
              type="number"
              min="1000"
              step="5000"
              class="form-control"
              placeholder="75000"
            />
          </div>
        </div>
        <div class="col-12 col-md-2 d-flex align-items-end">
          <button
            type="button"
            class="btn btn-primary btn-sm w-100"
            @click="handleAddMilestone"
          >
            Save Goal
          </button>
        </div>
      </div>
      <div v-if="formError" class="text-danger small mt-2">
        {{ formError }}
      </div>
    </div>

    <!-- Milestones List Group -->
    <div class="list-group list-group-flush rounded-3 border">
      <div
        v-for="m in milestones"
        :key="m.id"
        class="list-group-item p-3"
        :class="{ 'bg-light bg-opacity-50': m.isReached }"
      >
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
          <div class="d-flex align-items-center gap-2">
            <span class="h6 fw-bold text-dark mb-0">
              {{ formatMoney(m.targetAmount) }}
            </span>
            <span class="text-secondary small fw-semibold">— {{ m.label }}</span>
            <span v-if="m.isCustom" class="badge bg-info-subtle text-info border border-info-subtle">
              Custom Goal
            </span>
          </div>

          <div class="d-flex align-items-center gap-2">
            <span
              v-if="m.isReached"
              class="badge bg-success-subtle text-success border border-success-subtle"
            >
              Achieved 🎉
            </span>
            <span
              v-else-if="m.yearsToReach !== null"
              class="badge bg-primary-subtle text-primary border border-primary-subtle"
            >
              In {{ m.yearsToReach }} yrs (Age {{ m.projectedAge }}, {{ m.projectedYear }})
            </span>
            <span
              v-else
              class="badge bg-secondary-subtle text-secondary border border-secondary-subtle"
            >
              Unreachable at current rates
            </span>

            <!-- Delete button for custom goals -->
            <button
              v-if="m.isCustom"
              type="button"
              class="btn btn-outline-danger btn-sm py-0 px-2"
              title="Remove milestone"
              @click="emit('remove-milestone', m.id)"
            >
              ✕
            </button>
          </div>
        </div>

        <p class="small text-muted mb-2">{{ m.description }}</p>

        <!-- Progress Bar (Dynamic width binding strictly permitted) -->
        <div class="progress mb-2" role="progressbar" :aria-valuenow="m.progressPercent" aria-valuemin="0" aria-valuemax="100">
          <div
            class="progress-bar"
            :class="m.isReached ? 'bg-success' : 'bg-primary'"
            :style="{ width: `${m.progressPercent}%` }"
          ></div>
        </div>

        <!-- Footnote details -->
        <div class="d-flex justify-content-between align-items-center small text-secondary">
          <span>{{ m.progressPercent.toFixed(1) }}% achieved</span>
          <span v-if="m.isReached" class="text-success fw-semibold">
            Goal surpassed by {{ formatMoney(totalWealthNow - m.targetAmount) }}!
          </span>
          <span v-else class="text-muted">
            {{ formatMoney(Math.max(0, m.targetAmount - totalWealthNow)) }} remaining
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
