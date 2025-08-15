import { memo } from 'react'

import useTranslations from '@/hooks/useTranslations'

type PokemonActionsProps = {
  shiny: boolean
  onShinyToggle: () => void
  onPlayCry: () => void
  onClear: () => void
}

const PokemonActions = memo(function PokemonActions({
  shiny,
  onShinyToggle,
  onPlayCry,
  onClear,
}: PokemonActionsProps) {
  const t = useTranslations()

  return (
    <ul className='flex gap-2 items-center select-none'>
      <li
        title={t('pokemon.shiny')}
        onClick={onShinyToggle}
        className={`transition-opacity opacity-50 duration-300 cursor-pointer hover:hover:opacity-100 ${
          shiny && 'opacity-100'
        }`}
      >
        ✦
      </li>

      <li className='w-[1px] h-3 bg-foreground opacity-10' />

      <li
        title={t('pokemon.cry')}
        onClick={onPlayCry}
        className='transition-opacity opacity-50 duration-300 cursor-pointer hover:hover:opacity-100'
      >
        🗣
      </li>

      <li className='w-[1px] h-3 bg-foreground opacity-10' />

      <li
        title={t('pokemon.clear')}
        onClick={onClear}
        className='transition-opacity opacity-50 duration-300 cursor-pointer hover:hover:opacity-100'
      >
        ↺
      </li>
    </ul>
  )
})

export default PokemonActions
