import { ref, computed, watch } from 'vue'
import type { WealthPot, PotProjection } from '../types/wealth'

const STORAGE_KEY = 'wealth_horizon_v1'

const DEFAULT_POTS: WealthPot[] = [
  {
    id: 'pot-pension',
    name: 'Workplace & SIPP Pension',
    category: 'Pension',
    currentAmount: 45000,
    annualRate: 7.0, // Historical diversified stock index rate
    monthlyContribution: 350,
    color: '#10b981', // Emerald
  },
  {
    id: 'pot-isa',
    name: 'Stocks & Shares ISA',
    category: 'ISA',
    currentAmount: 22000,
    annualRate: 8.5,
    monthlyContribution: 200,
    color: '#6366f1', // Indigo
  },
  {
    id: 'pot-gic',
    name: 'Fixed Term GIC / Bond',
    category: 'GIC',
    currentAmount: 15000,
    annualRate: 4.8,
    monthlyContribution: 0,
    color: '#f59e0b', // Amber
  },
]

interface SavedState {
  pots: WealthPot[]
  currentAge: number
  retirementAge: number
  targetYear: number
  currency: string
}

function loadSavedState(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as SavedState
  } catch (err) {
    console.error('Failed to parse localStorage:', err)
  }
  return null
}

export function useWealthProjection() {
  const saved = loadSavedState()

  const currentYear = ref(new Date().getFullYear())
  const targetYear = ref(saved?.targetYear ?? new Date().getFullYear() + 10)
  const currency = ref(saved?.currency ?? '£')

  // Age & Retirement Settings
  const currentAge = ref(saved?.currentAge ?? 30)
  const retirementAge = ref(saved?.retirementAge ?? 65)

  // Pots array (from storage or defaults)
  const pots = ref<WealthPot[]>(
    saved?.pots && saved.pots.length > 0
      ? saved.pots
      : JSON.parse(JSON.stringify(DEFAULT_POTS))
  )

  // Reactive timestamp of when changes were last saved
  const lastSavedTime = ref<string>('Just now')

  // Vue 3 watch with { deep: true } to auto-save on any change!
  watch(
    [pots, currentAge, retirementAge, targetYear, currency],
    () => {
      try {
        const state: SavedState = {
          pots: pots.value,
          currentAge: currentAge.value,
          retirementAge: retirementAge.value,
          targetYear: targetYear.value,
          currency: currency.value,
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
        const now = new Date()
        lastSavedTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      } catch (err) {
        console.warn('Failed to save state to localStorage:', err)
      }
    },
    { deep: true }
  )

  // Computed: Years until retirement
  const yearsUntilRetirement = computed(() => {
    return Math.max(0, retirementAge.value - currentAge.value)
  })

  // Computed: Calendar year of retirement
  const retirementYear = computed(() => {
    return currentYear.value + yearsUntilRetirement.value
  })

  // Computed: User's age at the currently selected targetYear
  const targetAge = computed(() => {
    return currentAge.value + yearsToForecast.value
  })

  // Computed: 4% Safe Withdrawal Rule passive retirement income
  const annualPassiveIncome = computed(() => {
    return totalProjectedWealth.value * 0.04
  })

  const monthlyPassiveIncome = computed(() => {
    return annualPassiveIncome.value / 12
  })

  // Set target forecast directly to retirement year
  function setTargetToRetirement() {
    targetYear.value = retirementYear.value
  }

  // Computed: Number of years to forecast
  const yearsToForecast = computed(() => {
    return Math.max(0, targetYear.value - currentYear.value)
  })

  // Compound Interest Calculation with Monthly Contributions
  function calculateProjection(pot: WealthPot, years: number): PotProjection {
    const p = Number(pot.currentAmount) || 0
    const annualRate = Number(pot.annualRate) || 0
    const pmt = Number(pot.monthlyContribution) || 0

    if (years <= 0) {
      return {
        currentAmount: p,
        projectedAmount: p,
        totalContributed: p,
        interestEarned: 0,
        years: 0,
      }
    }

    const r = annualRate / 100 / 12 // monthly interest rate
    const n = years * 12 // total compound periods (months)

    let futureValue = 0
    if (r === 0) {
      futureValue = p + pmt * n
    } else {
      // FV = P*(1+r)^n + PMT * [((1+r)^n - 1) / r]
      const principalGrowth = p * Math.pow(1 + r, n)
      const contributionGrowth = pmt * ((Math.pow(1 + r, n) - 1) / r)
      futureValue = principalGrowth + contributionGrowth
    }

    const totalContributed = p + pmt * n
    const interestEarned = Math.max(0, futureValue - totalContributed)

    return {
      currentAmount: p,
      projectedAmount: futureValue,
      totalContributed,
      interestEarned,
      years,
    }
  }

  // Computed: Map pots with real-time projections
  const potsWithProjections = computed(() => {
    return pots.value.map((pot) => ({
      ...pot,
      projection: calculateProjection(pot, yearsToForecast.value),
    }))
  })

  // Computed: Total Wealth Right Now
  const totalWealthNow = computed(() => {
    return pots.value.reduce((sum, pot) => sum + (Number(pot.currentAmount) || 0), 0)
  })

  // Computed: Total Projected Wealth at Target Year
  const totalProjectedWealth = computed(() => {
    return potsWithProjections.value.reduce(
      (sum, item) => sum + item.projection.projectedAmount,
      0
    )
  })

  // Computed: Total Contributions added between now and target year
  const totalFutureContributions = computed(() => {
    const months = yearsToForecast.value * 12
    return pots.value.reduce(
      (sum, pot) => sum + (Number(pot.monthlyContribution) || 0) * months,
      0
    )
  })

  // Computed: Total Growth through Compound Interest
  const totalInterestGained = computed(() => {
    return Math.max(
      0,
      totalProjectedWealth.value - totalWealthNow.value - totalFutureContributions.value
    )
  })

  // Computed: Overall portfolio growth multiplier
  const growthMultiplier = computed(() => {
    if (totalWealthNow.value === 0) return 1
    return totalProjectedWealth.value / totalWealthNow.value
  })

  // Helper actions
  function addPot(newPot: Omit<WealthPot, 'id'>) {
    const id = `pot-${Date.now()}`
    pots.value.push({
      ...newPot,
      id,
    })
  }

  function removePot(id: string) {
    pots.value = pots.value.filter((p) => p.id !== id)
  }

  function updatePot(id: string, updates: Partial<WealthPot>) {
    const pot = pots.value.find((p) => p.id === id)
    if (pot) {
      Object.assign(pot, updates)
    }
  }

  function resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY)
    pots.value = JSON.parse(JSON.stringify(DEFAULT_POTS))
    currentAge.value = 30
    retirementAge.value = 65
    targetYear.value = currentYear.value + 10
    currency.value = '£'
    lastSavedTime.value = 'Reset to defaults'
  }

  function formatCurrency(amount: number): string {
    return `${currency.value}${Math.round(amount).toLocaleString()}`
  }

  return {
    currentYear,
    targetYear,
    currency,
    currentAge,
    retirementAge,
    yearsUntilRetirement,
    retirementYear,
    targetAge,
    annualPassiveIncome,
    monthlyPassiveIncome,
    setTargetToRetirement,
    pots,
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
    formatCurrency,
  }
}
