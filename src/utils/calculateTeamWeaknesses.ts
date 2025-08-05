import { TYPE_COLORS } from '@/constants/typeColors'
import { calculateDamageMultipliers } from './calculateDamageMultipliers'
import type { PokemonTeamMember } from '@/types'

export function calculateTeamWeaknesses(team: PokemonTeamMember[]) {
  const weaknessCount: { [type: string]: number } = {}

  Object.keys(TYPE_COLORS).forEach((type) => {
    weaknessCount[type] = 0
  })

  team.forEach((member) => {
    if (!member.data) return

    const multipliers = calculateDamageMultipliers(member.data.types)

    Object.keys(TYPE_COLORS).forEach((type) => {
      if (multipliers[type] > 1) {
        weaknessCount[type] += 1
      }
    })
  })

  return weaknessCount
}
