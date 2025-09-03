import { memo } from 'react'

import ShinyIcon from '@/components/Icons/ShinyIcon'
import CryIcon from '@/components/Icons/CryIcon'
import ClearIcon from '@/components/Icons/ClearIcon'

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
    <ul className='flex gap-2 items-center select-none h-full'>
      <li
        title={t('pokemon.shiny')}
        onClick={onShinyToggle}
        className={`h-full transition-opacity duration-300 cursor-pointer  ${
          shiny
            ? 'text-red-400 opacity-100 hover:opacity-50'
            : 'opacity-50 hover:opacity-100'
        }`}
      >
        <ShinyIcon className='h-full' />
      </li>

      <li className='w-[1px] h-3 bg-foreground opacity-10' />

      <li
        title={t('pokemon.cry')}
        onClick={onPlayCry}
        className='h-full transition-opacity opacity-50 duration-300 cursor-pointer hover:opacity-100'
      >
        <CryIcon className='h-full p-[1px]' />
      </li>

      <li className='w-[1px] h-3 bg-foreground opacity-10' />

      <li
        title={t('pokemon.clear')}
        onClick={onClear}
        className='h-full transition-opacity opacity-50 duration-300 cursor-pointer hover:opacity-100'
      >
        <ClearIcon className='h-full p-[2px]' />
      </li>
    </ul>
  )
})

export default PokemonActions
