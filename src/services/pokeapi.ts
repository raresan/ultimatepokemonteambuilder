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
