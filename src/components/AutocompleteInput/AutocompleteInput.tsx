'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import type { PokemonOption } from '@/types'
import { erroredImagesCache } from '@/utils/erroredImagesCache'
import Fuse from 'fuse.js'
import useTranslations from '@/hooks/useTranslations'
import MicIcon from '@/components/Icons/MicIcon'
import HearingIcon from '@/components/Icons/HearingIcon'

interface ISpeechRecognition {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  onstart: () => void
  onend: () => void
  onresult: (event: SpeechRecognitionEvent) => void
}

type TSpeechRecognitionConstructor = {
  new (): ISpeechRecognition
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string
      }
    }
  }
}

declare global {
  interface Window {
    SpeechRecognition?: TSpeechRecognitionConstructor
    webkitSpeechRecognition?: TSpeechRecognitionConstructor
  }
}

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
  const [listening, setListening] = useState(false)

  const t = useTranslations()

  const recognitionRef = useRef<ISpeechRecognition | null>(null)

  const fuse = useMemo(() => {
    const items = suggestions.map((s) => ({ name: s.name }))
    return new Fuse(items, { keys: ['name'], includeScore: true })
  }, [suggestions])

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
  }, [filteredSuggestions, updateTrigger]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleImageError = (imgUrl: string) => {
    if (!erroredImagesCache.has(imgUrl)) {
      erroredImagesCache.add(imgUrl)
      setUpdateTrigger((trigger) => trigger + 1)
    }
  }

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert(t('autocompleteInput.notSupported'))
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = t('autocompleteInput.voiceLanguage')
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript: string = event.results[0][0].transcript
      onTypeName(transcript)

      const results = fuse.search(transcript)

      if (results.length > 0) {
        const matchName = results[0].item.name
        const matchedOption = suggestions.find((s) => s.name === matchName)

        if (matchedOption) {
          onClickName(matchedOption)
        }
      }
    }

    recognitionRef.current = recognition
  }, [suggestions, onTypeName, onClickName, fuse, t])

  const handleVoiceSearch = () => {
    if (listening) {
      recognitionRef.current?.stop()
    } else {
      recognitionRef.current?.start()
    }
  }

  return (
    <div className='relative'>
      <div className='flex items-center h-10 my-2 relative'>
        <input
          type='text'
          value={value}
          onChange={(e) => onTypeName(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setShowSuggestions(false)}
          className='w-full h-full bg-background rounded px-3 py-2 mt-2 mb-2 focus:outline-none focus:ring-2 focus:ring-foreground'
        />

        <button
          title={t('autocompleteInput.title')}
          type='button'
          onClick={handleVoiceSearch}
          className={`h-full aspect-square p-2 transition-opacity duration-300 focus:outline-none absolute top-0 right-0 cursor-pointer ${
            !listening && 'opacity-50 hover:opacity-100'
          }`}
        >
          {listening ? <HearingIcon className='text-groudon' /> : <MicIcon />}
        </button>
      </div>

      {showSuggestions && suggestionsWithImages.length > 0 && (
        <ul className='absolute z-10 bg-background border border-darkrai rounded w-full max-h-80 overflow-y-auto'>
          {suggestionsWithImages.map((suggestion) => (
            <li
              key={suggestion.name}
              className='px-3 py-2 hover:bg-darkrai cursor-pointer flex items-center gap-4'
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
