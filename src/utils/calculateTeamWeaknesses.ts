import { ALL_TYPES } from '@/constants/allTypes'
import { calculateDamageMultipliers } from './calculateDamageMultipliers'
import { PokemonTeamMember } from '@/types'

export function calculateTeamWeaknesses(team: PokemonTeamMember[]) {
  const weaknessCount: { [type: string]: number } = {}

  ALL_TYPES.forEach((type) => {
    weaknessCount[type] = 0
  })

  team.forEach((member) => {
    if (!member.data) return

    const multipliers = calculateDamageMultipliers(member.data.types)

    ALL_TYPES.forEach((type) => {
      if (multipliers[type] > 1) {
        weaknessCount[type] += 1
      }
    })
  })

  return weaknessCount
}
