'use client'

import { useState, useEffect, useMemo } from 'react'
import type { PokemonOption } from '@/types'

type Props = {
  value: string
  suggestions: PokemonOption[]
  onTypeName: (name: string) => void
  onClickName: (pokemonInfo: PokemonOption) => void
}

const imageExistenceCache = new Map<string, boolean>()

const checkImageExists = (url: string): Promise<boolean> => {
  if (imageExistenceCache.has(url)) {
    return Promise.resolve(imageExistenceCache.get(url)!)
  }

  return new Promise((resolve) => {
    const img = new Image()
    img.src = url

    img.onload = () => {
      imageExistenceCache.set(url, true)
      resolve(true)
    }

    img.onerror = () => {
      imageExistenceCache.set(url, false)
      resolve(false)
    }
  })
}

export default function AutocompleteInput({
  value,
  suggestions,
  onTypeName,
  onClickName,
}: Props) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestionsWithImage, setFilteredSuggestionsWithImage] =
    useState<PokemonOption[]>([])

  const filteredSuggestions = useMemo(() => {
    return suggestions.filter((suggestion) =>
      // suggestion.name.toLowerCase().startsWith(value.toLowerCase()),
      suggestion.name
        .toLowerCase()
        .replaceAll('-', ' ')
        .includes(value.toLowerCase()),
    )
  }, [value, suggestions])

  useEffect(() => {
    const fetchImages = async () => {
      const results = await Promise.all(
        filteredSuggestions.map(async (suggestion) => {
          const id = suggestion.url.split('/').filter(Boolean).pop()
          const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`
          const exists = await checkImageExists(imgUrl)
          return exists ? suggestion : null
        }),
      )

      setFilteredSuggestionsWithImage(
        results.filter(Boolean) as PokemonOption[],
      )
    }

    if (showSuggestions && filteredSuggestions.length > 0) {
      fetchImages()
    } else {
      setFilteredSuggestionsWithImage([])
    }
  }, [filteredSuggestions, showSuggestions])

  return (
    <div className='relative'>
      <input
        type='text'
        value={value}
        onChange={(event) => onTypeName(event.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setShowSuggestions(false)}
        className='w-full bg-gray-700 rounded px-3 py-2 mt-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
      />

      {showSuggestions && filteredSuggestionsWithImage.length > 0 && (
        <ul className='absolute z-10 bg-gray-800 border border-gray-600 rounded w-full max-h-80 overflow-y-auto'>
          {filteredSuggestionsWithImage.map((suggestion) => {
            const id = suggestion.url.split('/').filter(Boolean).pop()
            return (
              <li
                key={suggestion.name}
                className='px-3 py-2 hover:bg-gray-600 cursor-pointer flex items-center gap-4'
                onPointerDown={() => onClickName(suggestion)}
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`}
                  alt={suggestion.name}
                  className='w-10 h-10'
                />
                <span>{suggestion.formattedName}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
