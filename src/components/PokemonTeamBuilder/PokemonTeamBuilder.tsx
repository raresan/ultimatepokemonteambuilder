'use client'

import { getAllPokemon, getPokemon } from '@/services/pokeapi'
import { useEffect, useState } from 'react'

type PokemonOption = {
  name: string
  url: string
}

type PokemonData = {
  id: number
  sprites: {
    front_default: string | null
    front_shiny: string | null
  }
  stats: {
    effort: number
    stat: {
      name: string
    }
  }[]
}

type PokemonTeamMember = {
  name: string
  data?: PokemonData
  shiny: boolean
  teraType: string
}

const TERA_TYPES = [
  'Normal',
  'Fire',
  'Water',
  'Electric',
  'Grass',
  'Ice',
  'Fighting',
  'Poison',
  'Ground',
  'Flying',
  'Psychic',
  'Bug',
  'Rock',
  'Ghost',
  'Dragon',
  'Dark',
  'Steel',
  'Fairy',
]

export default function PokemonTeamBuilder() {
  const [pokemonList, setPokemonList] = useState<PokemonOption[]>([])

  const [team, setTeam] = useState<PokemonTeamMember[]>(
    Array.from({ length: 6 }, () => ({
      name: '',
      shiny: false,
      teraType: '',
      data: undefined as PokemonData | undefined,
    })),
  )

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAllPokemon() {
      try {
        const allPokemon = await getAllPokemon()

        setPokemonList(allPokemon)
      } catch (error: any) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllPokemon()
  }, [])

  const fetchPokemon = async (name: string) => {
    console.log('FETCH POKEMON')

    try {
      const pokemon = await getPokemon(name)

      console.log(pokemon)

      return pokemon
    } catch (error: any) {
      setError(error)
    }
  }

  const handleNameChange = async (index: number, name: string) => {
    const newTeam = [...team]
    newTeam[index].name = name
    newTeam[index].data = undefined

    const matched = pokemonList.find(
      (p) => p.name.toLowerCase() === name.toLowerCase(),
    )

    if (matched) {
      const data = await fetchPokemon(matched.name)

      if (data) {
        newTeam[index].data = data
        newTeam[index].shiny = false
        newTeam[index].teraType = ''
      }
    }

    setTeam(newTeam)
  }

  const handleToggleShiny = (index: number) => {
    const newTeam = [...team]
    newTeam[index].shiny = !newTeam[index].shiny
    setTeam(newTeam)
  }

  const handleTeraChange = (index: number, teraType: string) => {
    const newTeam = [...team]
    newTeam[index].teraType = teraType
    setTeam(newTeam)
  }

  if (loading) return <div className='p-4'>Loading...</div>
  if (error) return <div className='p-4 text-red-500'>Error: {error}</div>

  return (
    <div className='min-h-screen bg-gray-900 text-white flex flex-col items-center p-8'>
      <h1 className='text-3xl font-bold mb-8'>Montador de Time Pokémon</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl'>
        {team.map((pokemon, index) => {
          const suggestions = pokemonList.filter((p) =>
            p.name.toLowerCase().includes(pokemon.name.toLowerCase()),
          )

          return (
            <div
              key={index}
              className='bg-gray-800 rounded-lg p-4 border border-gray-700'
            >
              <label className='font-semibold'>Pokémon {index + 1}</label>
              <input
                type='text'
                value={pokemon.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder='Digite o nome'
                className='w-full bg-gray-700 rounded px-3 py-2 mt-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                list={`pokemon-suggestions-${index}`}
              />
              <datalist id={`pokemon-suggestions-${index}`}>
                {suggestions.slice(0, 10).map((p) => (
                  <option key={p.name} value={p.name} />
                ))}
              </datalist>

              {pokemon.data && (
                <div className='mt-4 flex flex-col items-center'>
                  <img
                    src={
                      pokemon.shiny
                        ? pokemon.data.sprites.front_shiny
                        : pokemon.data.sprites.front_default
                    }
                    alt={pokemon.name}
                    className='w-24 h-24'
                  />

                  <div className='flex gap-4 mt-4'>
                    <button
                      onClick={() => handleToggleShiny(index)}
                      className={`px-3 py-1 rounded ${
                        pokemon.shiny
                          ? 'bg-yellow-500'
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    >
                      {pokemon.shiny ? 'Shiny ✨' : 'Normal'}
                    </button>

                    <select
                      value={pokemon.teraType}
                      onChange={(e) => handleTeraChange(index, e.target.value)}
                      className='bg-gray-700 rounded px-3 py-1'
                    >
                      <option value=''>Tera Type</option>
                      {TERA_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='mt-4 text-sm text-gray-300'>
                    <h3 className='font-semibold mb-1'>EVs concedidos:</h3>
                    {pokemon.data.stats.filter((s) => s.effort > 0).length ===
                    0 ? (
                      <p>Nenhum EV</p>
                    ) : (
                      <ul className='list-disc list-inside'>
                        {pokemon.data.stats
                          .filter((stat) => stat.effort > 0)
                          .map((stat) => (
                            <li key={stat.stat.name}>
                              {stat.effort} em{' '}
                              {stat.stat.name
                                .replace('-', ' ')
                                .replace('special', 'Sp.')
                                .replace('attack', 'Atk')
                                .replace('defense', 'Def')}
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
