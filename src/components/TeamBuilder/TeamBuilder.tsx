'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import Pokemon from '@/components/Pokemon/Pokemon'
import TeamWeaknesses from '@/components/TeamWeaknesses/TeamWeaknesses'
import ShareButton from '@/components/ShareButton/ShareButton'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner'

import { formatPokemonList } from '@/utils/formatPokemonList'
import { buildQueryParams, parseQueryParams } from '@/utils/queryParams'

import { getAllPokemon } from '@/services/pokeapi'

import type { PokemonOption, PokemonTeamMember } from '@/types'

export default function TeamBuilder() {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [pokemonList, setPokemonList] = useState<PokemonOption[]>([])
  const [team, setTeam] = useState<PokemonTeamMember[]>([])

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    async function fetchAllPokemon() {
      try {
        const allPokemon = await getAllPokemon()
        const allPokemonUpdated = formatPokemonList(allPokemon)

        setPokemonList(allPokemonUpdated)
      } catch (error: unknown) {
        setError(
          error instanceof Error ? error.message : 'Error loading Pokémon',
        )
      } finally {
        setLoading(false)
      }
    }

    async function getTeamFromUrlParams() {
      try {
        const teamFromParams = await parseQueryParams(searchParams)

        setTeam(teamFromParams)
      } catch (error: unknown) {
        setError(
          error instanceof Error
            ? error.message
            : 'Error loading team from URL',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchAllPokemon()
    getTeamFromUrlParams()
  }, [searchParams])

  useEffect(() => {
    const queryParams = buildQueryParams(team)
    router.replace(`${pathname}?${queryParams}`, { scroll: false })
  }, [pathname, router, team])

  const updateTeam = (pokemon: PokemonTeamMember, index: number) => {
    const updatedTeam = [...team]

    updatedTeam[index] = pokemon

    setTeam(updatedTeam)
  }

  // if (loading) return <div className='p-4'>Loading...</div>
  if (error) return <div className='p-4 text-red-500'>Error: {error}</div>

  return (
    <main className='min-h-screen flex flex-col items-center px-8'>
      <LoadingSpinner visible={loading} fullscreen />

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

      <TeamWeaknesses team={team} />

      <ShareButton />
    </main>
  )
}
