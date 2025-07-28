'use client'

import { useParams } from 'next/navigation'
import englishDictionary from '@/i18n/en'
import portugueseDictionary from '@/i18n/pt'

type Dictionary = {
  [key: string]: string | Dictionary
}

const dictionaries: Record<string, Dictionary> = {
  en: englishDictionary,
  pt: portugueseDictionary,
}

export default function useTranslations(): (key: string) => string {
  const { lang } = useParams() as { lang?: string }

  const dictionary: Dictionary = (lang && dictionaries[lang]) || dictionaries.en

  function t(key: string): string {
    return (
      (key
        .split('.')
        .reduce<Dictionary | string | undefined>((acc, current) => {
          if (typeof acc === 'object' && acc !== null) {
            return (acc as Dictionary)[current]
          }
          return undefined
        }, dictionary) as string | undefined) || key
    )
  }

  return t
}
