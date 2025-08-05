import { PokemonOption } from '@/types'

export const formatPokemonList = (allPokemon: PokemonOption[]) => {
  const allPokemonUpdated = allPokemon.map((pokemon: PokemonOption) => {
    const splittedName = pokemon.name.split('-')
    const firstLetterUppercase = splittedName.map((name) => {
      return name.charAt(0).toUpperCase() + name.slice(1)
    })

    const firstName = firstLetterUppercase[0]
    const slicedLastNames = firstLetterUppercase.slice(1)
    const lastName = slicedLastNames.join(' ')
    const lastNameFormatted = lastName.length ? ` (${lastName})` : ''
    const formattedName = firstName + lastNameFormatted

    return {
      ...pokemon,
      formattedName,
    }
  })

  allPokemonUpdated.sort((a: PokemonOption, b: PokemonOption) =>
    a.name.localeCompare(b.name),
  )

  return allPokemonUpdated
}
