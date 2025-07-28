import AutocompleteInput from '@/components/AutocompleteInput/AutocompleteInput'
import { PokemonData, PokemonOption, PokemonTeamMember } from '@/types'
import TypeRelations from '@/components/TypeRelations/TypeRelations'
import { calculateDamageMultipliers } from '@/utils/calculateDamageMultipliers'
import { useEffect, useRef, useState } from 'react'
import { getPokemon } from '@/services/pokeapi'
import { getBorderColors } from '@/utils/getBorderColors'
import Image from 'next/image'
import useTranslations from '@/hooks/useTranslations'

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

  const t = useTranslations()

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
      playAudio('/assets/audio/shiny.mp3', 0.2)
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
        setShiny(false)
        setPokemonData(data)
      }
    }
  }

  const handleClear = () => {
    setPokemonNameSearch('')
    setShiny(false)
    setPokemonData(undefined)

    onUpdate({ data: undefined, shiny: false }, index)
  }

  const maxStat = 255
  const maxBaseStatTotal = 780
  let baseStatTotal = 0

  const getBaseStatBarColor = (stat: number, max: number) => {
    const percent = (stat / max) * 100

    if (percent >= 100) return 'bg-gengar'
    if (percent >= 50) return 'bg-blastoise'
    if (percent >= 35) return 'bg-rayquaza'
    if (percent >= 20) return 'bg-zapdos'
    if (percent >= 5) return 'bg-charizard'
    return 'bg-groudon'
  }

  const getBaseStatTotalBarColor = (stat: number, max: number) => {
    const percent = (stat / max) * 100

    if (percent >= 100) return 'bg-gengar'
    if (percent >= 75) return 'bg-blastoise'
    if (percent >= 50) return 'bg-rayquaza'
    if (percent >= 40) return 'bg-zapdos'
    if (percent >= 30) return 'bg-charizard'
    return 'bg-groudon'
  }

  const getBarPercentage = (stat: number, max: number) => {
    return (stat / max) * 100
  }

  return (
    <div
      key={index}
      className='relative rounded-lg p-4 border-3 bg-zekrom border-darkrai shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-shadow duration-300'
      style={pokemonData ? getBorderColors(pokemonData.types) : undefined}
    >
      {pokemonData && (
        <div className='flex justify-between'>
          <label className='font-bold'>#{index + 1} Pokémon</label>

          <ul className='flex gap-2 items-center'>
            <li
              onClick={() => setShiny((previous) => !previous)}
              className={`transition-colors duration-300 cursor-pointer hover:text-charizard ${
                shiny && 'text-groudon'
              }`}
            >
              ✦
            </li>

            <li className='w-[1px] h-3 bg-foreground opacity-10' />

            <li
              onClick={() =>
                playAudio(
                  pokemonData.cries.latest || pokemonData.cries.legacy,
                  0.1,
                )
              }
              className='transition-opacity duration-300 cursor-pointer hover:opacity-50 active:opacity-100'
            >
              🗣
            </li>

            <li className='w-[1px] h-3 bg-foreground opacity-10' />

            <li
              onClick={handleClear}
              className='transition-opacity duration-300 cursor-pointer hover:opacity-50 active:opacity-100'
            >
              ↺
            </li>
          </ul>
        </div>
      )}

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

          <div className='flex gap-4 w-full'>
            <div className='relative basis-1/2'>
              <img
                src={`/assets/gif/shiny.gif?t=${
                  shiny && !hasAnimatedShiny ? Date.now() : undefined
                }`}
                alt='Shiny Sparkles'
                className='absolute inset-0 z-10 pointer-events-none'
                style={{
                  display: shiny && !hasAnimatedShiny ? 'block' : 'none',
                }}
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

            <div className='flex flex-col justify-center basis-1/2 gap-2'>
              <h3 className='font-bold'>{t('pokemon.baseStatsTitle')}</h3>

              {pokemonData.stats.map((stat, index) => {
                baseStatTotal += stat.base_stat

                return (
                  <div key={index} className='flex items-center gap-2 h-3'>
                    <span className='w-10 capitalize text-[0.7rem]/1 text-right'>
                      {stat.stat.name
                        .replace('-', ' ')
                        .replace('special', t('pokemon.baseStatSpecial'))
                        .replace('attack', t('pokemon.baseStatAttack'))
                        .replace('defense', t('pokemon.baseStatDefense'))
                        .replace('speed', t('pokemon.baseStatSpeed'))}
                      :
                    </span>

                    <div className='flex items-center justify-center flex-1 h-full relative overflow-hidden'>
                      <div
                        className={`absolute top-0 left-0 h-full ${getBaseStatBarColor(
                          stat.base_stat,
                          maxStat,
                        )}`}
                        style={{
                          width: `${getBarPercentage(
                            stat.base_stat,
                            maxStat,
                          )}%`,
                        }}
                      />

                      <span className='text-[0.7rem]/1 relative drop-shadow-[0_1px_1px_black]'>
                        {stat.base_stat}
                      </span>
                    </div>
                  </div>
                )
              })}

              <div className='flex items-center gap-2 h-3'>
                <span className='w-10 capitalize text-[0.7rem]/1 text-right'>
                  {t('pokemon.baseStatsTotalTitle')}
                </span>

                <div className='flex items-center justify-center flex-1 h-full relative overflow-hidden'>
                  <div
                    className={`absolute top-0 left-0 h-full ${getBaseStatTotalBarColor(
                      baseStatTotal,
                      maxBaseStatTotal,
                    )}`}
                    style={{
                      width: `${getBarPercentage(
                        baseStatTotal,
                        maxBaseStatTotal,
                      )}%`,
                    }}
                  />

                  <span className='text-[0.7rem]/1 relative drop-shadow-[0_1px_1px_black]'>
                    {baseStatTotal}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-6 w-full max-w-sm'>
            <h3 className='font-bold mb-2'>{t('pokemon.weaknessesTitle')}</h3>

            <TypeRelations
              data={calculateDamageMultipliers(pokemonData.types)}
              isPokemon
            />
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
