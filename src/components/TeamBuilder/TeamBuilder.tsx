'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
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
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false)

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const isUpdatingUrl = useRef<boolean>(false)

  // LOAD POKEMON LIST ONLY ONCE
  useEffect(() => {
    async function fetchAllPokemon() {
      try {
        const allPokemon = await getAllPokemon()
        const allPokemonUpdated = formatPokemonList(allPokemon)

        setPokemonList(allPokemonUpdated)
      } catch (error: unknown) {
        setError(
          error instanceof Error ? error.message : 'Failed to get Pokémon list',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchAllPokemon()
  }, [])

  // LOAD TEAM FROM URL PARAMS ONLY ON INITIAL LOAD
  useEffect(() => {
    if (initialLoadDone || isUpdatingUrl.current) return

    async function getTeamFromUrlParams() {
      try {
        const teamFromParams = await parseQueryParams(searchParams)

        setTeam(teamFromParams)
      } catch (error: unknown) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load Pokémon Team from URL',
        )
      } finally {
        setInitialLoadDone(true)
      }
    }

    getTeamFromUrlParams()
  }, [searchParams, initialLoadDone])

  // UPDATE URL ONLY WHEN TEAM CHANGES (NOT ON INITIAL LOAD)
  useEffect(() => {
    if (!initialLoadDone) return

    isUpdatingUrl.current = true

    const queryParams = buildQueryParams(team)

    router.replace(`${pathname}?${queryParams}`, { scroll: false })

    // RESET FLAG AFTER URL UPDATE
    setTimeout(() => {
      isUpdatingUrl.current = false
    }, 100)
  }, [team, pathname, router, initialLoadDone])

  const updateTeam = useCallback(
    (pokemon: PokemonTeamMember, index: number) => {
      setTeam((prevTeam) => {
        const updatedTeam = [...prevTeam]

        updatedTeam[index] = pokemon

        return updatedTeam
      })
    },
    [],
  )

  if (error)
    return (
      <div className='flex justify-center p-4 text-red-400'>Error: {error}</div>
    )

  return (
    <main className='min-h-screen flex flex-col items-center px-4 md:px-8'>
      <LoadingSpinner visible={loading} fullscreen />

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full max-w-7xl'>
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
