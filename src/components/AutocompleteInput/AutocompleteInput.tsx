'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import type { PokemonOption } from '@/types'
import { erroredImagesCache } from '@/utils/erroredImagesCache'

type Props = {
  value: string
  suggestions: PokemonOption[]
  onTypeName: (name: string) => void
  onClickName: (pokemonInfo: PokemonOption) => void
}

export default function AutocompleteInput({
  value,
  suggestions,
  onTypeName,
  onClickName,
}: Props) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [updateTrigger, setUpdateTrigger] = useState(0)

  const filteredSuggestions = useMemo(() => {
    return suggestions.filter((suggestion) =>
      suggestion.name
        .toLowerCase()
        .replaceAll('-', ' ')
        .includes(value.toLowerCase()),
    )
  }, [value, suggestions])

  const suggestionsWithImages = useMemo(() => {
    return filteredSuggestions
      .map((suggestion) => {
        const id = suggestion.url.split('/').filter(Boolean).pop()!
        const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`

        return { ...suggestion, imgUrl }
      })
      .filter((suggestion) => !erroredImagesCache.has(suggestion.imgUrl))
  }, [filteredSuggestions, updateTrigger])

  const handleImageError = (imgUrl: string) => {
    if (!erroredImagesCache.has(imgUrl)) {
      erroredImagesCache.add(imgUrl)
      setUpdateTrigger((trigger) => trigger + 1)
    }
  }

  return (
    <div className='relative'>
      <input
        type='text'
        value={value}
        onChange={(e) => onTypeName(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setShowSuggestions(false)}
        className='w-full bg-gray-700 rounded px-3 py-2 mt-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
      />

      {showSuggestions && suggestionsWithImages.length > 0 && (
        <ul className='absolute z-10 bg-gray-800 border border-gray-600 rounded w-full max-h-80 overflow-y-auto'>
          {suggestionsWithImages.map((suggestion) => (
            <li
              key={suggestion.name}
              className='px-3 py-2 hover:bg-gray-600 cursor-pointer flex items-center gap-4'
              onPointerDown={() => onClickName(suggestion)}
            >
              <Image
                src={suggestion.imgUrl}
                alt={suggestion.name}
                width={80}
                height={80}
                unoptimized
                onError={() => handleImageError(suggestion.imgUrl)}
              />

              <span>{suggestion.formattedName}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
