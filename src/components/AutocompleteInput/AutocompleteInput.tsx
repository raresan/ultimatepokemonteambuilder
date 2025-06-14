'use client'

import { useState } from 'react'
import type { PokemonOption } from '@/types'

type Props = {
  value: string
  suggestions: PokemonOption[]
  onUpdate: (value: string) => void
}

export default function AutocompleteInput({
  value,
  suggestions,
  onUpdate,
}: Props) {
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.name.toLowerCase().startsWith(value.toLowerCase()),
  )

  return (
    <div className='relative'>
      <input
        type='text'
        value={value.charAt(0).toUpperCase() + value.slice(1)}
        onChange={(event) => onUpdate(event.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        className='w-full bg-gray-700 rounded px-3 py-2 mt-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
      />

      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className='absolute z-10 bg-gray-800 border border-gray-600 rounded w-full max-h-40 overflow-y-auto'>
          {filteredSuggestions.map((suggestion) => {
            const id = suggestion.url.split('/').filter(Boolean).pop()

            return (
              <li
                key={suggestion.name}
                onClick={() => onUpdate(suggestion.name)}
                className='px-3 py-2 hover:bg-gray-600 cursor-pointer flex items-center gap-4'
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                  alt={suggestion.name}
                  className='w-10 h-10'
                />

                <span>
                  {suggestion.name.charAt(0).toUpperCase() +
                    suggestion.name.slice(1)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
