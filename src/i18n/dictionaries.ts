import englishDictionary from '@/i18n/en'
import portugueseDictionary from '@/i18n/pt'

export type TDictionary = {
  [key: string]: string | TDictionary
}

export const dictionaries: Record<string, TDictionary> = {
  en: englishDictionary,
  pt: portugueseDictionary,
}
