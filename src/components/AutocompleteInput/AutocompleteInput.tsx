'use client'

import { useState } from 'react'

type Props = {
  value: string
  onChange: (value: string) => void
  suggestions: string[]
}

export default function AutocompleteInput({
  value,
  onChange,
  suggestions,
}: Props) {
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.toLowerCase().startsWith(value.toLowerCase()),
  )

  return (
    <div className='relative'>
      <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        placeholder='Digite o nome'
        className='w-full bg-gray-700 rounded px-3 py-2 mt-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className='absolute z-10 bg-gray-800 border border-gray-600 rounded w-full max-h-40 overflow-y-auto'>
          {filteredSuggestions.map((suggestion) => (
            <li
              key={suggestion}
              onClick={() => onChange(suggestion)}
              className='px-3 py-2 hover:bg-gray-600 cursor-pointer'
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
