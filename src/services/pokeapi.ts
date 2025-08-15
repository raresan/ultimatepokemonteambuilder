import type { PokemonData } from '@/types'
import {
  pokemonListCache,
  pokemonDataCache,
  typeDamageCache,
} from '@/utils/cache'

const BASE_URL = 'https://pokeapi.co/api/v2'

export async function getAllPokemon() {
  const cacheKey = 'all'
  const cached = pokemonListCache.get(cacheKey)

  if (cached) return cached

  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=999999&offset=0`)

    if (!response.ok) {
      throw new Error('Error fetching all Pokémon')
    }

    const data = await response.json()

    pokemonListCache.set(cacheKey, data.results)

    return data.results
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getTypeDamageRelations(type: string) {
  const cacheKey = type.toLowerCase()
  const cached = typeDamageCache.get(cacheKey)

  if (cached) return cached

  try {
    const response = await fetch(`${BASE_URL}/type/${type.toLowerCase()}`)

    if (!response.ok) throw new Error('Error fetching type data')

    const data = await response.json()

    typeDamageCache.set(cacheKey, data.damage_relations)

    return data.damage_relations
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getPokemon(name: string): Promise<PokemonData> {
  const cacheKey = name.toLowerCase()
  const cached = pokemonDataCache.get(cacheKey)

  if (cached) return cached

  try {
    const response = await fetch(`${BASE_URL}/pokemon/${name.toLowerCase()}`)

    if (!response.ok) throw new Error('Error fetching Pokémon data')

    const data = await response.json()

    const types = await Promise.all(
      data.types.map(async (type: { type: { name: string } }) => {
        const damageRelations = await getTypeDamageRelations(type.type.name)

        return {
          name: type.type.name,
          damage_relations: damageRelations,
        }
      }),
    )

    const pokemonData = {
      id: data.id,
      name: data.name,
      sprites: data.sprites,
      stats: data.stats,
      types,
      cries: data.cries,
    }

    pokemonDataCache.set(cacheKey, pokemonData)

    return pokemonData
  } catch (error) {
    console.error(error)
    throw error
  }
}
