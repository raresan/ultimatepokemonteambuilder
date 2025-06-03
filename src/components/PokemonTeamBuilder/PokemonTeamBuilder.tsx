'use client'

import { getAllPokemon, getPokemon } from '@/services/pokeapi'
import { useEffect, useState } from 'react'
import AutocompleteInput from '@/components/AutocompleteInput/AutocompleteInput'

type PokemonOption = {
  name: string
  url: string
}

type PokemonData = {
  id: number
  sprites: {
    other: {
      home: {
        front_default: string | null
        front_shiny: string | null
      }
    }
  }
  stats: {
    effort: number
    stat: {
      name: string
    }
  }[]
  types: {
    name: string
    damage_relations: {
      double_damage_from: { name: string }[]
      half_damage_from: { name: string }[]
      no_damage_from: { name: string }[]
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

const TYPE_COLORS: { [key: string]: string } = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-blue-200',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-700',
  flying: 'bg-indigo-300',
  psychic: 'bg-pink-500',
  bug: 'bg-green-700',
  rock: 'bg-yellow-800',
  ghost: 'bg-indigo-700',
  dragon: 'bg-indigo-800',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300',
}

function calculateDamageMultipliers(types: PokemonData['types']) {
  const allTypes = Object.keys(TYPE_COLORS)

  const multipliers: { [key: string]: number } = {}

  allTypes.forEach((type) => {
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

export default function PokemonTeamBuilder() {
  const [pokemonList, setPokemonList] = useState<PokemonOption[]>([])

  const [team, setTeam] = useState<PokemonTeamMember[]>(
    Array.from({ length: 6 }, () => ({
      name: '',
      shiny: false,
      teraType: '',
      data: undefined,
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
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAllPokemon()
  }, [])

  const fetchPokemon = async (name: string) => {
    try {
      const pokemon = await getPokemon(name)
      return pokemon
    } catch (error: any) {
      setError(error.message)
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
        {team.map((pokemon, index) => (
          <div
            key={index}
            className='bg-gray-800 rounded-lg p-4 border border-gray-700'
          >
            <label className='font-semibold'>Pokémon {index + 1}</label>

            <AutocompleteInput
              value={pokemon.name}
              onChange={(value) => handleNameChange(index, value)}
              suggestions={pokemonList.map((p) => p.name)}
            />

            {pokemon.data && (
              <div className='mt-4 flex flex-col items-center'>
                <img
                  src={
                    pokemon.shiny
                      ? pokemon.data.sprites.other.home.front_shiny
                      : pokemon.data.sprites.other.home.front_default
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
                    {pokemon.shiny ? 'Shiny ✨' : 'Shiny'}
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

                <div className='flex gap-2 mt-2'>
                  {pokemon.data.types.map((typeInfo) => (
                    <span
                      key={typeInfo.name}
                      className={`px-2 py-1 rounded text-white text-sm ${
                        TYPE_COLORS[typeInfo.name] || 'bg-gray-500'
                      }`}
                    >
                      {typeInfo.name.toUpperCase()}
                    </span>
                  ))}
                </div>

                <div className='mt-6 w-full max-w-sm'>
                  <h3 className='font-semibold mb-2'>
                    Weaknesses / Resistances / Immunities:
                  </h3>
                  <div className='grid grid-cols-6 gap-4'>
                    {Object.entries(
                      calculateDamageMultipliers(pokemon.data.types),
                    ).map(([type, multiplier]) => (
                      <div
                        key={type}
                        className='flex flex-col items-center justify-center'
                        title={type}
                      >
                        <div
                          className={`w-10 h-10 rounded flex items-center justify-center text-white font-bold text-xs ${
                            TYPE_COLORS[type] || 'bg-gray-600'
                          }`}
                        >
                          {type.toUpperCase()}
                        </div>
                        <div className='mt-1 text-sm'>{multiplier}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='mt-4 text-sm text-gray-300'>
                  <h3 className='font-semibold mb-1'>
                    EVs gained when defeated:
                  </h3>
                  {pokemon.data.stats.filter((s) => s.effort > 0).length ===
                  0 ? (
                    <p>No EVs</p>
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
        ))}
      </div>
    </div>
  )
}
