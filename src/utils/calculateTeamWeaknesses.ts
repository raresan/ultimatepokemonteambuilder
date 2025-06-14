import { TYPE_COLORS } from '@/constants/typeColors'
import { calculateDamageMultipliers } from './calculateDamageMultipliers'
import { PokemonTeamMember } from '@/types'

export function calculateTeamWeaknesses(team: PokemonTeamMember[]) {
  const allTypes = Object.keys(TYPE_COLORS)
  const weaknessCount: { [type: string]: number } = {}

  allTypes.forEach((type) => {
    weaknessCount[type] = 0
  })

  team.forEach((member) => {
    if (!member.data) return

    const multipliers = calculateDamageMultipliers(member.data.types)

    allTypes.forEach((type) => {
      if (multipliers[type] > 1) {
        weaknessCount[type] += 1
      }
    })
  })

  return weaknessCount
}
