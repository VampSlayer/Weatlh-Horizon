<script setup lang="ts">
import { ref } from 'vue'
import type { PotCategory, WealthPot } from '../../types/wealth'

const props = defineProps<{
  currency: string
}>()

const emit = defineEmits<{
  add: [pot: Omit<WealthPot, 'id'>]
}>()

const isOpen = ref(false)

const categoryPresets: Record<
  PotCategory,
  { defaultName: string; defaultRate: number; color: string }
> = {
  Pension: { defaultName: 'Personal Pension / SIPP', defaultRate: 7.0, color: '#10b981' },
  ISA: { defaultName: 'Stocks & Shares ISA', defaultRate: 8.5, color: '#6366f1' },
  GIC: { defaultName: 'Guaranteed Investment (GIC)', defaultRate: 4.8, color: '#f59e0b' },
  Savings: { defaultName: 'High Yield Savings Account', defaultRate: 4.5, color: '#06b6d4' },
  Investments: { defaultName: 'Index Funds & ETFs', defaultRate: 8.0, color: '#8b5cf6' },
  Crypto: { defaultName: 'Crypto Assets', defaultRate: 12.0, color: '#ec4899' },
  Other: { defaultName: 'Other Asset Pot', defaultRate: 5.0, color: '#64748b' },
}

const name = ref('Stocks & Shares ISA')
const category = ref<PotCategory>('ISA')
const currentAmount = ref(10000)
const annualRate = ref(8.5)
const monthlyContribution = ref(150)
const color = ref('#6366f1')

function selectCategory(cat: PotCategory) {
  category.value = cat
  const preset = categoryPresets[cat]
  name.value = preset.defaultName
  annualRate.value = preset.defaultRate
  color.value = preset.color
}

function handleSubmit() {
  if (!name.value.trim()) return

  emit('add', {
    name: name.value.trim(),
    category: category.value,
    currentAmount: Number(currentAmount.value) || 0,
    annualRate: Number(annualRate.value) || 0,
    monthlyContribution: Number(monthlyContribution.value) || 0,
    color: color.value,
  })

  isOpen.value = false
}
</script>

<template>
  <div class="my-4">
    <!-- Collapsed Trigger Button -->
    <div v-if="!isOpen">
      <button
        type="button"
        class="btn btn-outline-success w-100 py-3 rounded-3 fw-bold fs-6 d-flex align-items-center justify-content-center gap-2"
        @click="isOpen = true"
      >
        <span class="badge bg-success rounded-circle px-2 py-1 fs-6">+</span>
        <span>Add a New Money Pot (Pension, ISA, GIC...)</span>
      </button>
    </div>

    <!-- Expansion Form Card -->
    <div v-else class="card shadow-sm border-0 rounded-3 p-4">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h3 class="h5 fw-bold text-dark mb-1">Create a New Wealth Pot</h3>
          <p class="small text-secondary mb-0">Choose a preset or customize your target asset pot</p>
        </div>
        <button type="button" class="btn btn-sm btn-light border-0" @click="isOpen = false">✕</button>
      </div>

      <!-- Quick Preset Chips -->
      <div class="d-flex align-items-center gap-2 flex-wrap mb-3">
        <span class="small fw-bold text-secondary text-uppercase">Presets:</span>
        <button
          v-for="(_, cat) in categoryPresets"
          :key="cat"
          type="button"
          :class="['btn btn-sm rounded-pill fw-semibold', category === cat ? 'btn-dark text-white' : 'btn-light text-secondary border']"
          @click="selectCategory(cat as PotCategory)"
        >
          {{ cat }}
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="row g-3 mb-3">
          <div class="col-12 col-md-8">
            <label class="form-label small fw-bold text-secondary">Pot Name</label>
            <input
              type="text"
              v-model="name"
              placeholder="e.g. SIPP Pension, Vanguard ISA"
              class="form-control"
              required
            />
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label small fw-bold text-secondary">Category</label>
            <select v-model="category" class="form-select">
              <option value="Pension">Pension</option>
              <option value="ISA">ISA</option>
              <option value="GIC">GIC</option>
              <option value="Savings">Savings</option>
              <option value="Investments">Investments</option>
              <option value="Crypto">Crypto</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div class="row g-3 mb-4">
          <div class="col-12 col-md-4">
            <label class="form-label small fw-bold text-secondary">Current Amount Today</label>
            <div class="input-group">
              <span class="input-group-text bg-light text-muted">{{ currency }}</span>
              <input
                type="number"
                min="0"
                step="100"
                v-model.number="currentAmount"
                class="form-control fw-bold"
                required
              />
            </div>
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label small fw-bold text-secondary">Expected Return (%)</label>
            <div class="input-group">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                v-model.number="annualRate"
                class="form-control fw-bold"
                required
              />
              <span class="input-group-text bg-light text-secondary">% p.a.</span>
            </div>
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label small fw-bold text-secondary">Monthly Contribution</label>
            <div class="input-group">
              <span class="input-group-text bg-light text-secondary">{{ currency }}</span>
              <input
                type="number"
                min="0"
                step="50"
                v-model.number="monthlyContribution"
                class="form-control fw-bold"
              />
              <span class="input-group-text bg-light text-secondary">/mo</span>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-light px-4" @click="isOpen = false">
            Cancel
          </button>
          <button type="submit" class="btn btn-success px-4 fw-bold">
            Add Pot to Portfolio
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
