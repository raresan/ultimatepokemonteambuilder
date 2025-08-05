import { getPokemon } from '@/services/pokeapi'
import type { PokemonTeamMember } from '@/types'

export const buildQueryParams = (team: PokemonTeamMember[]): string => {
  const params = new URLSearchParams()

  team.forEach((pokemon, index) => {
    if (pokemon.data?.name) {
      const key = `p${index + 1}`
      const value = `${pokemon.data.name}_${pokemon.shiny ? '1' : '0'}`

      params.append(key, value)
    }
  })

  return params.toString()
}

export const parseQueryParams = async (
  searchParams: URLSearchParams,
): Promise<PokemonTeamMember[]> => {
  const promises = Array.from({ length: 6 }, async (_, index) => {
    const value = searchParams.get(`p${index + 1}`)

    if (value) {
      const [name, shinyString] = value.split('_')

      try {
        const pokemon = await getPokemon(name)

        return {
          data: pokemon,
          shiny: shinyString === '1',
        } as PokemonTeamMember
      } catch (error) {
        console.error(`Erro ao buscar ${name}:`, error)
      }
    }

    return {
      data: undefined,
      shiny: false,
    } as PokemonTeamMember
  })

  return await Promise.all(promises)
}
