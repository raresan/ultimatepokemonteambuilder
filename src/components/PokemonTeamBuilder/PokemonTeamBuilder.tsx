'use client'

import { getAllPokemon } from '@/services/pokeapi'
import { useEffect, useState } from 'react'
import TypeInfo from '@/components/TypeInfo/TypeInfo'
import Pokemon from '@/components/Pokemon/Pokemon'
import { PokemonOption, PokemonTeamMember } from '@/types'
import { calculateTeamWeaknesses } from '@/utils/calculateTeamWeaknesses'

export default function PokemonTeamBuilder() {
  const [pokemonList, setPokemonList] = useState<PokemonOption[]>([])

  const [team, setTeam] = useState<PokemonTeamMember[]>(
    Array.from({ length: 6 }, () => ({
      shiny: false,
      teraType: '',
      data: undefined,
    })),
  )

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAllPokemon() {
      try {
        const allPokemon = await getAllPokemon()

        setPokemonList(allPokemon)
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
    <div className='min-h-screen bg-gray-900 text-white flex flex-col items-center p-8'>
      <h1 className='text-3xl font-bold mb-8'>Pokémon Team Builder</h1>

      <div className='mb-12 w-full max-w-4xl'>
        <h2 className='text-2xl font-bold mb-4'>Team Overall Weaknesses:</h2>

        <TypeInfo data={calculateTeamWeaknesses(team)} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl'>
        {team.map((teamMember, index) => (
          <Pokemon
            key={index}
            index={index}
            pokemonList={pokemonList}
            onUpdate={updateTeam}
          />
        ))}
      </div>
    </div>
  )
}
