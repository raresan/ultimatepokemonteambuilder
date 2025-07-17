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
  const [hasAnimatedShiny, setHasAnimatedShiny] = useState<boolean>(false)

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

    playAudio(pokemonData.cries.latest || pokemonData.cries.legacy, 0.1)
  }, [pokemonData])

  useEffect(() => {
    if (shiny) {
      playAudio('/assets/audio/shiny.mp3', 0.5)
    }

    setTimeout(() => {
      setHasAnimatedShiny(shiny)
    }, 1000)
  }, [shiny])

  const audio = useRef<HTMLAudioElement>(new Audio())

  const playAudio = (src: string, volume: number) => {
    if (!pokemonData) return

    audio.current.src = src
    audio.current.volume = volume
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
      className='relative rounded-lg p-4 border-3 bg-zekrom border-darkrai shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-shadow duration-300'
      style={pokemonData ? getBorderColors(pokemonData.types) : undefined}
    >
      {pokemonData && (
        <button
          onClick={handleClear}
          className='absolute top-4 right-4 hover:text-red-500 transition-colors duration-300 cursor-pointer'
          aria-label='Remove Pokémon'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 256 256'
            className='w-4 h-4 fill-current'
          >
            <path
              fill='currentColor'
              d='M165.4,20.5c-1.7-1.7-4.7-1.7-6.7,0L11.3,168.2c-1.7,1.7-1.7,4.7,0,6.7l28.6,28.6c1.7,1.7,5.4,3.4,8.1,3.4h91.8
        c2.7,0,6-1.3,8.1-3.4l96.9-96.9c1.7-1.7,1.7-4.7,0-6.7L165.4,20.5z M138.8,185.6c-1.7,1.7-5.4,3.4-8.1,3.4h-71
        c-2.7,0-6-1.3-8.1-3.4l-13.5-13.5c-1.7-1.7-1.7-4.7,0-6.7l54.2-54.2c1.7-1.7,4.7-1.7,6.7,0l53.8,53.8c1.7,1.7,1.7,4.7,0,6.7
        L138.8,185.6z'
            />
            <path fill='currentColor' d='M43.9,221h170.6v15.8H43.9V221z' />
          </svg>
        </button>
      )}

      <label className='font-bold'>#{index + 1} Pokémon</label>

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

          <div className='relative w-[200px] h-[200px]'>
            <img
              src={`/assets/gif/shiny.gif?t=${
                shiny && !hasAnimatedShiny ? Date.now() : undefined
              }`}
              alt='Shiny Sparkles'
              className='absolute inset-0 z-10 pointer-events-none'
              style={{ display: shiny && !hasAnimatedShiny ? 'block' : 'none' }}
            />

            <Image
              src={
                shiny
                  ? pokemonData.sprites.other.home.front_shiny
                  : pokemonData.sprites.other.home.front_default
              }
              alt={pokemonData.name}
              width={200}
              height={200}
              className='relative z-0'
            />
          </div>

          <div className='flex gap-2 mt-4'>
            <button
              onClick={() => setShiny((previous) => !previous)}
              className={`px-3 py-1 rounded transition-colors duration-300 cursor-pointer ${
                shiny ? 'bg-foreground' : 'bg-background hover:bg-darkrai'
              }`}
            >
              ✨
            </button>

            <button
              onClick={() =>
                playAudio(
                  pokemonData.cries.latest || pokemonData.cries.legacy,
                  0.1,
                )
              }
              className={
                'px-3 py-1 rounded transition-colors duration-300 cursor-pointer bg-background hover:bg-darkrai active:bg-foreground'
              }
            >
              🔊
            </button>
          </div>

          <div className='mt-6 w-full max-w-sm'>
            <h3 className='font-bold mb-2'>
              Weaknesses / Resistances / Immunities:
            </h3>

            <TypeRelations
              data={calculateDamageMultipliers(pokemonData.types)}
              isPokemon
            />
          </div>

          <div className='mt-6 w-full max-w-sm'>
            <h3 className='font-bold mb-2'>Effort Values Earned:</h3>

            {pokemonData.stats.filter((s) => s.effort > 0).length === 0 ? (
              <div className='p-4 text-red-500'>Error fetching data.</div>
            ) : (
              <ul className='flex justify-center gap-2'>
                {pokemonData.stats
                  .filter((stat) => stat.effort > 0)
                  .map((stat) => (
                    <li
                      key={stat.stat.name}
                      className='px-6 py-2 rounded bg-darkrai capitalize'
                    >
                      {stat.effort} {stat.stat.name.replace('-', ' ')}
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
