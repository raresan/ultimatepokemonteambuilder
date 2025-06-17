import AutocompleteInput from '@/components/AutocompleteInput/AutocompleteInput'
import { PokemonData, PokemonOption, PokemonTeamMember } from '@/types'
import TypeRelations from '@/components/TypeRelations/TypeRelations'
import { calculateDamageMultipliers } from '@/utils/calculateDamageMultipliers'
import { useEffect, useState } from 'react'
import { getPokemon } from '@/services/pokeapi'
import Image from 'next/image'

type PokemonProps = {
  index: number
  pokemonList: PokemonOption[]
  onUpdate: (pokemon: PokemonTeamMember, index: number) => void
}

export default function Pokemon({
  index,
  pokemonList,
  onUpdate,
}: PokemonProps) {
  const [shiny, setShiny] = useState<boolean>(false)
  const [pokemonData, setPokemonData] = useState<PokemonData>()
  const [pokemonNameSearch, setPokemonNameSearch] = useState<string>(
    pokemonData?.name || '',
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const updatedPokemon = {
      data: pokemonData,
      shiny,
    }

    onUpdate(updatedPokemon, index)
  }, [pokemonData, shiny])

  const fetchPokemon = async (name: string) => {
    try {
      const pokemon = await getPokemon(name)
      return pokemon
    } catch (error: any) {
      setError(error.message)
    }
  }

  const onUpdateName = async (name: string) => {
    setPokemonNameSearch(name)

    const matched = pokemonList.find(
      (pokemon) => pokemon.name.toLowerCase() === name.toLowerCase(),
    )

    if (matched) {
      const data = await fetchPokemon(matched.name)

      if (data) {
        setPokemonData(data)
      }
    }
  }

  return (
    <div
      key={index}
      className='bg-gray-800 rounded-lg p-4 border border-gray-700'
    >
      <label className='font-semibold'>Pokémon {index + 1}</label>

      <AutocompleteInput
        value={pokemonNameSearch}
        suggestions={pokemonList}
        onUpdate={onUpdateName}
      />

      {error && <div className='p-4 text-red-500'>Error: {error}</div>}

      {pokemonData && (
        <div className='mt-4 flex flex-col items-center'>
          <img
            src={
              shiny
                ? pokemonData.sprites.other.home.front_shiny
                : pokemonData.sprites.other.home.front_default
            }
            alt={pokemonData.name}
            className='w-24 h-24'
          />

          <div className='flex gap-4 mt-4'>
            <button
              onClick={() => setShiny((previous) => !previous)}
              className={`px-3 py-1 rounded ${
                shiny ? 'bg-yellow-100' : 'bg-gray-600 hover:bg-gray-500'
              }`}
            >
              {shiny ? '✨' : '✨'}
            </button>
          </div>

          <div className='flex gap-2 mt-2'>
            {pokemonData.types.map((type) => (
              <Image
                key={type.name}
                src={`/assets/images/${type.name}.png`}
                alt={type.name}
                width={100}
                height={100}
              />
            ))}
          </div>

          <div className='mt-6 w-full max-w-sm'>
            <h3 className='font-semibold mb-2'>
              Weaknesses / Resistances / Immunities:
            </h3>

            <TypeRelations
              data={calculateDamageMultipliers(pokemonData.types)}
            />
          </div>

          <div className='mt-4 text-sm text-gray-300'>
            <h3 className='font-semibold mb-1'>EVs gained when defeated:</h3>

            {pokemonData.stats.filter((s) => s.effort > 0).length === 0 ? (
              <p>No EVs</p>
            ) : (
              <ul className='list-disc list-inside'>
                {pokemonData.stats
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
}
