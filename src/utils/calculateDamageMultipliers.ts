import { TYPE_COLORS } from '@/constants/typeColors'
import { PokemonData } from '@/types'

export function calculateDamageMultipliers(types: PokemonData['types']) {
  const multipliers: { [key: string]: number } = {}

  Object.keys(TYPE_COLORS).forEach((type) => {
    multipliers[type] = 1
  })

  types.forEach(({ damage_relations }) => {
    damage_relations.no_damage_from.forEach(({ name }) => {
      multipliers[name] = 0
    })

    damage_relations.double_damage_from.forEach(({ name }) => {
      if (multipliers[name] !== 0) {
        multipliers[name] *= 2
      }
    })

    damage_relations.half_damage_from.forEach(({ name }) => {
      if (multipliers[name] !== 0) {
        multipliers[name] *= 0.5
      }
    })
  })

  return multipliers
}
