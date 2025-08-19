import Image from 'next/image'

import type { PokemonOption } from '@/types'

const ITEM_HEIGHT = 96 // HEIGHT OF EACH LIST ITEM
const CONTAINER_HEIGHT = 320 // MAX HEIGHT OF LIST (max-h-80)

// IMAGE CACHE TO AVOID REPEATED REQUESTS
const imageCache = new Map<string, boolean>()

type VirtualizedListProps = {
  items: PokemonOption[]
  scrollTop: number
  onClickName: (pokemonInfo: PokemonOption) => void
  setShowSuggestions: (show: boolean) => void
  handleImageError: (imgUrl: string) => void
}

export default function VirtualizedList({
  items,
  scrollTop,
  onClickName,
  setShowSuggestions,
  handleImageError,
}: VirtualizedListProps) {
  const startIndex = Math.floor(scrollTop / ITEM_HEIGHT)
  const endIndex = Math.min(
    startIndex + Math.ceil(CONTAINER_HEIGHT / ITEM_HEIGHT) + 2,
    items.length,
  )
  const visibleItems = items.slice(startIndex, endIndex)

  return (
    <>
      {/* SPACER FOR ITEMS ABOVE VIEWPORT */}
      <div style={{ height: startIndex * ITEM_HEIGHT }} />

      {visibleItems.map((suggestion) => (
        <li
          key={suggestion.name}
          className='px-3 py-2 hover:bg-darkrai transition-colors duration-300 cursor-pointer flex items-center gap-4'
          style={{ height: ITEM_HEIGHT }}
          onMouseDown={(event) => {
            event.preventDefault()
            onClickName(suggestion)
            setShowSuggestions(false)
          }}
        >
          <Image
            src={suggestion.imgUrl}
            alt={suggestion.name}
            width={80}
            height={80}
            draggable={false}
            unoptimized
            loading='lazy'
            onLoad={() => imageCache.set(suggestion.imgUrl, true)}
            onError={() => handleImageError(suggestion.imgUrl)}
            className='select-none'
          />
          <span>{suggestion.formattedName}</span>
        </li>
      ))}

      {/* SPACER FOR ITEMS BELOW VIEWPORT */}
      <div style={{ height: (items.length - endIndex) * ITEM_HEIGHT }} />
    </>
  )
}
