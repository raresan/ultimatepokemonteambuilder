'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import AutocompleteInput from '@/components/AutocompleteInput/AutocompleteInput'
import TypeRelations from '@/components/TypeRelations/TypeRelations'
import BaseStats from '@/components/BaseStats/BaseStats'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'

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

export default function Pokemon({
  index,
  pokemon,
  pokemonList,
  onUpdate,
}: PokemonProps) {
  const [shiny, setShiny] = useState<boolean>(pokemon.shiny)
  const [hasAnimatedShiny, setHasAnimatedShiny] = useState<boolean>(false)
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
  }, [pokemonData, shiny])

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
      try {
        setLoading(true)
        const data = await fetchPokemon(matched.name)

        if (data) {
          setShiny(false)
          setPokemonData(data)
          playAudio(data.cries.latest || data.cries.legacy, 0.1)
        }
      } catch (err: any) {
        // já tratado em fetchPokemon, mas caso queira:
        setError(err?.message || 'Erro ao buscar Pokémon')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleClear = () => {
    setPokemonNameSearch('')
    setShiny(false)
    setPokemonData(undefined)

    onUpdate({ data: undefined, shiny: false }, index)
  }

  return (
    <div
      key={index}
      className='relative rounded-lg p-4 border-3 bg-zekrom border-darkrai shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(0,0,0,0.8)] transition-shadow duration-300 overflow-hidden'
      style={pokemonData ? getBorderColors(pokemonData.types) : undefined}
    >
      <LoadingSpinner visible={loading} />

      <div className='flex justify-between'>
        <label className='font-bold'>#{index + 1} Pokémon</label>

        {pokemonData && (
          <ul className='flex gap-2 items-center'>
            <li
              title={t('pokemon.shiny')}
              onClick={() => {
                setShiny((previous) => {
                  const newShiny = !previous

                  if (newShiny) {
                    playAudio('/assets/audio/shiny.mp3', 0.2)
                  }

                  setTimeout(() => {
                    setHasAnimatedShiny(newShiny)
                  }, 1000)

                  return newShiny
                })
              }}
              className={`transition-colors duration-300 cursor-pointer hover:text-charizard ${
                shiny && 'text-groudon'
              }`}
            >
              ✦
            </li>

            <li className='w-[1px] h-3 bg-foreground opacity-10' />

            <li
              title={t('pokemon.cry')}
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
              title={t('pokemon.clear')}
              onClick={handleClear}
              className='transition-opacity duration-300 cursor-pointer hover:opacity-50 active:opacity-100'
            >
              ↺
            </li>
          </ul>
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

            <BaseStats pokemonData={pokemonData} />
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
            className='grayscale select-none'
            draggable='false'
          />
        </div>
      )}
    </div>
  )
}
