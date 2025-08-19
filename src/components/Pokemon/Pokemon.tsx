'use client'

import { useEffect, useRef, useState, useCallback, memo } from 'react'
import Image from 'next/image'

import AutocompleteInput from '@/components/AutocompleteInput/AutocompleteInput'
import TypeRelations from '@/components/TypeRelations/TypeRelations'
import BaseStats from '@/components/BaseStats/BaseStats'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'
import PokemonActions from '@/components/PokemonActions/PokemonActions'
import ShinySparkles from '@/components/ShinySparkles/ShinySparkles'

import { calculateDamageMultipliers } from '@/utils/calculateDamageMultipliers'
import { getBorderColors } from '@/utils/getBorderColors'

import { getPokemon } from '@/services/pokeapi'

import useTranslations from '@/hooks/useTranslations'

import type { PokemonData, PokemonOption, PokemonTeamMember } from '@/types'

type PokemonProps = {
  index: number
  pokemon: PokemonTeamMember
  pokemonList: PokemonOption[]
  onUpdate: (pokemon: PokemonTeamMember, index: number) => void
}

const Pokemon = memo(function Pokemon({
  index,
  pokemon,
  pokemonList,
  onUpdate,
}: PokemonProps) {
  const [shiny, setShiny] = useState<boolean>(pokemon.shiny)
  const [showShinyAnimation, setShowShinyAnimation] = useState<boolean>(false)
  const [pokemonData, setPokemonData] = useState<PokemonData | undefined>(
    pokemon.data,
  )
  const [pokemonNameSearch, setPokemonNameSearch] = useState<string>(
    pokemonData?.name || '',
  )
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false) // novo

  const t = useTranslations()

  useEffect(() => {
    const updatedPokemon = {
      data: pokemonData,
      shiny,
    }

    onUpdate(updatedPokemon, index)
  }, [pokemonData, shiny]) // eslint-disable-line react-hooks/exhaustive-deps

  // FORMAT POKEMON NAME WHEN LOADED FROM URL
  useEffect(() => {
    if (pokemonData && pokemonList.length > 0) {
      const matchedPokemon = pokemonList.find(
        (pokemon) =>
          pokemon.name.toLowerCase() === pokemonData.name.toLowerCase(),
      )

      if (matchedPokemon) {
        setPokemonNameSearch(matchedPokemon.formattedName)
      }
    }
  }, [pokemonData, pokemonList])

  // STOP ANIMATION WHEN SHINY IS DISABLED
  useEffect(() => {
    if (!shiny && showShinyAnimation) {
      setShowShinyAnimation(false)
    }
  }, [shiny, showShinyAnimation])

  const audio = useRef<HTMLAudioElement>(new Audio())

  const playAudio = (src: string, volume: number) => {
    audio.current.src = src
    audio.current.volume = volume
    audio.current.play()
  }

  const fetchPokemon = async (name: string) => {
    try {
      const pokemon = await getPokemon(name)
      return pokemon
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const onTypeName = useCallback((name: string) => {
    setPokemonNameSearch(name)
  }, [])

  const onClickName = useCallback(
    async (pokemonInfo: PokemonOption) => {
      setPokemonNameSearch(pokemonInfo.formattedName)

      const matched = pokemonList.find(
        (pokemon) =>
          pokemon.name.toLowerCase() === pokemonInfo.name.toLowerCase(),
      )

      if (matched) {
        try {
          setLoading(true)
          const data = await fetchPokemon(matched.name)

          if (data) {
            setShiny(false)
            setPokemonData(data)
          }
        } catch (error: unknown) {
          setError(
            error instanceof Error ? error.message : 'Error fetching Pokémon',
          )
        } finally {
          setLoading(false)
        }
      }
    },
    [pokemonList],
  )

  const handleClear = useCallback(() => {
    setPokemonNameSearch('')
    setShiny(false)
    setPokemonData(undefined)

    onUpdate({ data: undefined, shiny: false }, index)
  }, [onUpdate, index])

  return (
    <div
      key={index}
      className='relative rounded-lg p-3 md:p-4 border-3 bg-zekrom border-darkrai shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-shadow duration-300 overflow-hidden group min-h-130 flex flex-col'
      style={pokemonData ? getBorderColors(pokemonData.types) : undefined}
    >
      <LoadingSpinner visible={loading} />

      <div className='h-5 flex items-center justify-between'>
        <div className='flex gap-2'>
          <label className='font-bold'>#{index + 1} Pokémon</label>

          <div className='flex gap-2'>
            {pokemonData?.types.map((type) => (
              <Image
                key={type.name}
                src={`/assets/svg/${type.name}.svg`}
                alt={type.name}
                width={20}
                height={20}
                className='select-none'
              />
            ))}
          </div>
        </div>

        {pokemonData && (
          <PokemonActions
            shiny={shiny}
            onShinyToggle={() => {
              setShiny((previous) => {
                const newShiny = !previous
                if (newShiny) {
                  // ALWAYS SHOW ANIMATION WHEN ENABLING SHINY
                  setShowShinyAnimation(true)
                } else {
                  // STOP ANIMATION WHEN DISABLING SHINY
                  setShowShinyAnimation(false)
                }
                return newShiny
              })
            }}
            onPlayCry={() =>
              playAudio(
                pokemonData.cries.latest || pokemonData.cries.legacy,
                0.05,
              )
            }
            onClear={handleClear}
          />
        )}
      </div>

      <AutocompleteInput
        value={pokemonNameSearch}
        suggestions={pokemonList}
        onTypeName={onTypeName}
        onClickName={onClickName}
      />

      {error && <div className='p-4 text-red-500'>Error: {error}</div>}

      {pokemonData ? (
        <div className='mt-4 flex flex-col grow-1 items-center justify-between'>
          <div className='flex justify-center gap-2 w-full'>
            <div className='aspect-square relative basis-1/2'>
              <Image
                src={
                  shiny
                    ? pokemonData.sprites.other.home.front_shiny
                    : pokemonData.sprites.other.home.front_default
                }
                alt={pokemonData.name}
                fill
                className='relative z-0 group-hover:animate-soft-bounce select-none'
              />

              <ShinySparkles
                isVisible={showShinyAnimation}
                onAnimationEnd={() => setShowShinyAnimation(false)}
              />
            </div>

            <BaseStats pokemonData={pokemonData} />
          </div>

          <div className='mt-4 w-full max-w-2xl'>
            <h3 className='font-bold mb-2'>{t('pokemon.weaknessesTitle')}</h3>

            <TypeRelations
              data={calculateDamageMultipliers(pokemonData.types)}
              isPokemon
            />
          </div>
        </div>
      ) : (
        <div className='grow-1 flex items-center justify-center'>
          <Image
            src={'/assets/images/pokeball.png'}
            alt={'Pokéball'}
            width={100}
            height={100}
            className='grayscale select-none animate-wiggle origin-bottom object-cover'
            draggable='false'
          />
        </div>
      )}
    </div>
  )
})

export default Pokemon
