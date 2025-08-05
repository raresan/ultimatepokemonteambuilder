'use client'

import { getAllPokemon } from '@/services/pokeapi'
import { useEffect, useState } from 'react'
import TypeRelations from '@/components/TypeRelations/TypeRelations'
import Pokemon from '@/components/Pokemon/Pokemon'
import { PokemonOption, PokemonTeamMember } from '@/types'
import { calculateTeamWeaknesses } from '@/utils/calculateTeamWeaknesses'
import Image from 'next/image'
import useTranslations from '@/hooks/useTranslations'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { formatPokemonList } from '@/utils/formatPokemonList'
import { buildQueryParams, parseQueryParams } from '@/utils/queryParams'

export default function TeamBuilder() {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [pokemonList, setPokemonList] = useState<PokemonOption[]>([])
  const [team, setTeam] = useState<PokemonTeamMember[]>([])

  const t = useTranslations()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

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

    async function getTeamFromUrlParams() {
      try {
        const teamFromParams = await parseQueryParams(searchParams)

        setTeam(teamFromParams)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAllPokemon()
    getTeamFromUrlParams()
  }, [])

  useEffect(() => {
    const queryParams = buildQueryParams(team)
    router.replace(`${pathname}?${queryParams}`, { scroll: false })
  }, [team])

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
        className='invert select-none'
        draggable='false'
      />

      <h1 className='text-3xl font-bold mb-8'>{t('teamBuilder.title')}</h1>

      <div className='text-center mb-8'>
        <p>{t('teamBuilder.description')}</p>

        <p>{t('teamBuilder.description2')}</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full max-w-7xl'>
        {team?.map((teamMember, index) => (
          <Pokemon
            key={index}
            index={index}
            pokemon={teamMember}
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
