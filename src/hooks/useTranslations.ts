'use client'

import { useParams } from 'next/navigation'
import { dictionaries, type TDictionary } from '@/i18n/dictionaries'

export default function useTranslations(): (key: string) => string {
  const { lang } = useParams() as { lang?: string }

  const dictionary: TDictionary =
    (lang && dictionaries[lang]) || dictionaries.en

  function t(key: string): string {
    return (
      (key
        .split('.')
        .reduce<TDictionary | string | undefined>((acc, current) => {
          if (typeof acc === 'object' && acc !== null) {
            return (acc as TDictionary)[current]
          }
          return undefined
        }, dictionary) as string | undefined) || key
    )
  }

  return t
}
