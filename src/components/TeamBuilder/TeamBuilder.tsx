'use client'

import { getAllPokemon } from '@/services/pokeapi'
import { useEffect, useState } from 'react'
import TypeRelations from '@/components/TypeRelations/TypeRelations'
import Pokemon from '@/components/Pokemon/Pokemon'
import { PokemonOption, PokemonTeamMember } from '@/types'
import { calculateTeamWeaknesses } from '@/utils/calculateTeamWeaknesses'
import Image from 'next/image'

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

  // const handleClear = () => {
  //   setTeam(
  //     Array.from({ length: 6 }, () => ({
  //       shiny: false,
  //       data: undefined,
  //     })),
  //   )
  // }

  if (loading) return <div className='p-4'>Loading...</div>
  if (error) return <div className='p-4 text-red-500'>Error: {error}</div>

  return (
    <div className='min-h-screen flex flex-col items-center p-8'>
      <Image
        src={'/assets/images/pokemon-logo.png'}
        alt={'Pokémon Logo'}
        width={450}
        height={150}
      />

      <h1 className='text-3xl font-bold mb-8'>Team Builder / EVs earned</h1>

      <div className='text-center mb-8'>
        <p>
          Choose six Pokémon for your team. You can see their individual
          weaknesses, resistances and immunities.
        </p>

        <p>
          Also, you can check which EVs (Effort Values) they grant when
          defeated, in case you need.
        </p>

        <p>At the end, you can see how many of them are weak to each type.</p>
      </div>

      {/* {team && (
        <button
          onClick={handleClear}
          className='mb-8 px-4 py-2 rounded bg-red-600 hover:bg-red-500 active:bg-red-700 transition-colors duration-200 font-bold text-white shadow-md'
        >
          🧹 Reset Team
        </button>
      )} */}

      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 w-full max-w-7xl'>
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
        <h2 className='text-2xl font-bold mb-4'>Team Overall Weaknesses:</h2>

        <p className='mb-4'>
          Below, find how many Pokémon from your selected team are weak to each
          type.
        </p>

        <TypeRelations data={calculateTeamWeaknesses(team)} />
      </div>
    </div>
  )
}
