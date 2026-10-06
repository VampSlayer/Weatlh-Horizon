export type PotCategory = 'Pension' | 'ISA' | 'GIC' | 'Savings' | 'Investments' | 'Crypto' | 'Other'

export interface WealthPot {
  id: string
  name: string
  category: PotCategory
  currentAmount: number
  annualRate: number // Percentage, e.g. 7.5 for 7.5%
  monthlyContribution: number // Monthly deposit
  color: string
}

export interface PotProjection {
  currentAmount: number
  projectedAmount: number
  totalContributed: number
  interestEarned: number
  years: number
}
