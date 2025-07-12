import AutocompleteInput from '@/components/AutocompleteInput/AutocompleteInput'
import { PokemonData, PokemonOption, PokemonTeamMember } from '@/types'
import TypeRelations from '@/components/TypeRelations/TypeRelations'
import { calculateDamageMultipliers } from '@/utils/calculateDamageMultipliers'
import { useEffect, useRef, useState } from 'react'
import { getPokemon } from '@/services/pokeapi'
import { getBorderColors } from '@/utils/getBorderColors'
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

  useEffect(() => {
    if (!pokemonData) return

    playAudio()
  }, [pokemonData])

  const audio = useRef<HTMLAudioElement>(new Audio())

  const playAudio = () => {
    if (!pokemonData) return

    audio.current.src = pokemonData.cries.latest || pokemonData.cries.legacy
    audio.current.volume = 0.2
    audio.current.play()
  }

  const fetchPokemon = async (name: string) => {
    try {
      const pokemon = await getPokemon(name)
      return pokemon
    } catch (error: any) {
      setError(error.message)
    }
  }

  const onTypeName = async (name: string) => {
    setPokemonNameSearch(name)
  }

  const onClickName = async (pokemonInfo: PokemonOption) => {
    setPokemonNameSearch(pokemonInfo.formattedName)

    const matched = pokemonList.find(
      (pokemon) =>
        pokemon.name.toLowerCase() === pokemonInfo.name.toLowerCase(),
    )

    if (matched) {
      const data = await fetchPokemon(matched.name)

      if (data) {
        setPokemonData(data)
      }
    }
  }

  const handleClear = () => {
    setPokemonData(undefined)
    setPokemonNameSearch('')
    setShiny(false)

    onUpdate({ data: undefined, shiny: false }, index)
  }

  return (
    <div
      key={index}
      className='relative bg-gray-800 rounded-lg p-4 border border-gray-700'
      style={pokemonData ? getBorderColors(pokemonData.types) : undefined}
    >
      {pokemonData && (
        <button
          onClick={handleClear}
          className='absolute top-2 right-2 text-gray-400 hover:text-white text-xl font-bold'
          aria-label='Remove Pokémon'
        >
          ×
        </button>
      )}

      <label className='font-semibold'>#{index + 1} Pokémon</label>

      <AutocompleteInput
        value={pokemonNameSearch}
        suggestions={pokemonList}
        onTypeName={onTypeName}
        onClickName={onClickName}
      />

      {error && <div className='p-4 text-red-500'>Error: {error}</div>}

      {pokemonData ? (
        <div className='mt-4 flex flex-col items-center'>
          <div className='flex gap-2 mb-2'>
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

          <Image
            src={
              shiny
                ? pokemonData.sprites.other.home.front_shiny
                : pokemonData.sprites.other.home.front_default
            }
            alt={pokemonData.name}
            width={200}
            height={200}
          />

          <div className='flex gap-4 mt-4'>
            <button
              onClick={() => setShiny((previous) => !previous)}
              className={`px-3 py-1 rounded ${
                shiny ? 'bg-yellow-100' : 'bg-gray-600 hover:bg-gray-500'
              }`}
            >
              ✨
            </button>

            <button
              onClick={playAudio}
              className={
                'px-3 py-1 rounded bg-gray-600 hover:bg-gray-500 active:bg-gray-700'
              }
            >
              🔊
            </button>
          </div>

          <div className='mt-6 w-full max-w-sm'>
            <h3 className='font-semibold mb-2'>
              Weaknesses / Resistances / Immunities:
            </h3>

            <TypeRelations
              data={calculateDamageMultipliers(pokemonData.types)}
              isPokemon
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
      ) : (
        <div className='flex-1 flex items-center justify-center min-h-[450px]'>
          <Image
            src={'/assets/images/pokeball.png'}
            alt={'Pokéball'}
            width={100}
            height={100}
          />
        </div>
      )}
    </div>
  )
}
