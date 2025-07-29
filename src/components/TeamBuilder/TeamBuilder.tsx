'use client'

import { getAllPokemon } from '@/services/pokeapi'
import { useEffect, useState } from 'react'
import TypeRelations from '@/components/TypeRelations/TypeRelations'
import Pokemon from '@/components/Pokemon/Pokemon'
import { PokemonOption, PokemonTeamMember } from '@/types'
import { calculateTeamWeaknesses } from '@/utils/calculateTeamWeaknesses'
import Image from 'next/image'
import useTranslations from '@/hooks/useTranslations'

const formatPokemonList = (allPokemon: PokemonOption[]) => {
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

export default function TeamBuilder() {
  const [pokemonList, setPokemonList] = useState<PokemonOption[]>([])

  const [team, setTeam] = useState<PokemonTeamMember[]>(
    Array.from({ length: 6 }, () => ({
      shiny: false,
      data: undefined,
    })),
  )

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const t = useTranslations()

  useEffect(() => {
    async function fetchAllPokemon() {
      try {
        const allPokemon = await getAllPokemon()
        const allPokemonUpdated = formatPokemonList(allPokemon)

        setPokemonList(allPokemonUpdated)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAllPokemon()
  }, [])

  const updateTeam = (pokemon: PokemonTeamMember, index: number) => {
    const updatedTeam = [...team]

    updatedTeam[index] = pokemon

    setTeam(updatedTeam)
  }

  if (loading) return <div className='p-4'>Loading...</div>
  if (error) return <div className='p-4 text-red-500'>Error: {error}</div>

  return (
    <div className='min-h-screen flex flex-col items-center p-8'>
      <Image
        src={'/assets/images/pokemon-logo.png'}
        alt={'Pokémon Logo'}
        width={450}
        height={150}
        className='invert'
      />

      <h1 className='text-3xl font-bold mb-8'>{t('teamBuilder.title')}</h1>

      <div className='text-center mb-8'>
        <p>{t('teamBuilder.description')}</p>

        <p>{t('teamBuilder.description2')}</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full max-w-7xl'>
        {team.map((teamMember, index) => (
          <Pokemon
            key={index}
            index={index}
            pokemonList={pokemonList}
            onUpdate={updateTeam}
          />
        ))}
      </div>

      <div className='mt-12 w-full max-w-7xl'>
        <h2 className='text-2xl font-bold mb-4'>
          {t('teamBuilder.teamWeaknessesTitle')}
        </h2>

        <p className='mb-4'>{t('teamBuilder.teamWeaknessesDescription')}</p>

        <TypeRelations data={calculateTeamWeaknesses(team)} />
      </div>
    </div>
  )
}
