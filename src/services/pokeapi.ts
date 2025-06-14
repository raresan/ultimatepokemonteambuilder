import { PokemonData } from '@/types'

const BASE_URL = 'https://pokeapi.co/api/v2'

export async function getAllPokemon() {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=999999&offset=0`)

    if (!response.ok) {
      throw new Error('Error fetching all Pokémon')
    }

    const data = await response.json()

    return data.results
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getTypeDamageRelations(type: string) {
  try {
    const response = await fetch(`${BASE_URL}/type/${type.toLowerCase()}`)

    if (!response.ok) throw new Error('Error fetching type data')

    const data = await response.json()

    return data.damage_relations
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getPokemon(name: string): Promise<PokemonData> {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${name.toLowerCase()}`)

    if (!response.ok) throw new Error('Error fetching Pokémon data')

    const data = await response.json()

    const types = await Promise.all(
      data.types.map(async (type: any) => {
        const damageRelations = await getTypeDamageRelations(type.type.name)

        return {
          name: type.type.name,
          damage_relations: damageRelations,
        }
      }),
    )

    return {
      id: data.id,
      name: data.name,
      sprites: data.sprites,
      stats: data.stats,
      types,
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
