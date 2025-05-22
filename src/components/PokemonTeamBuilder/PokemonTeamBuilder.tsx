'use client'

import { getAllPokemon } from '@/services/pokeapi'
import { useEffect, useState } from 'react'

type PokemonOption = {
  name: string
  url: string
}

export default function PokemonTeamBuilder() {
  const [pokemonList, setPokemonList] = useState<PokemonOption[]>([])
  const [team, setTeam] = useState<(string | null)[]>(Array(6).fill(null))
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAllPokemon() {
      try {
        const allPokemon = await getAllPokemon()

        console.log(allPokemon)

        setPokemonList(allPokemon)
      } catch (error: any) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllPokemon()
  }, [])

  const handleSelectChange = (index: number, value: string) => {
    const newTeam = [...team]
    newTeam[index] = value
    setTeam(newTeam)
  }

  if (loading) return <div className='p-4'>Carregando...</div>
  if (error) return <div className='p-4 text-red-500'>Erro: {error}</div>

  return (
    <div className='min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8'>
      <h1 className='text-3xl font-bold mb-8'>Montador de Time Pokémon</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl'>
        {team.map((pokemon, index) => (
          <div key={index} className='flex flex-col'>
            <label className='mb-2 font-semibold'>Pokémon {index + 1}</label>
            <select
              value={pokemon || ''}
              onChange={(e) => handleSelectChange(index, e.target.value)}
              className='bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Selecione um Pokémon</option>
              {pokemonList.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className='mt-10 w-full max-w-3xl'>
        <h2 className='text-xl mb-4'>Seu Time:</h2>
        <ul className='bg-gray-800 rounded p-4 space-y-2'>
          {team.map((p, idx) => (
            <li key={idx}>
              {p ? p.charAt(0).toUpperCase() + p.slice(1) : '---'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
