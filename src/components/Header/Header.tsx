'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'

import useTranslations from '@/hooks/useTranslations'

export default function Header() {
  const pathname = usePathname()
  const t = useTranslations()

  const handleClear = () => {
    window.location.assign(pathname)
  }

  return (
    <header className='flex items-center justify-center text-center flex-col gap-8 p-8 pb-12 md:pb-16'>
      <Image
        src={'/assets/images/pokemon-logo.png'}
        alt={'Pokémon Logo'}
        width={450}
        height={150}
        className='select-none'
        draggable='false'
        onClick={handleClear}
      />

      <h1 className='text-3xl font-bold'>
        {t('teamBuilder.title')}{' '}
        <span className='text-red-400'>(Beta v1.0)</span>
      </h1>

      <div className='text-center'>
        <p>{t('teamBuilder.description')}</p>

        <p>{t('teamBuilder.description2')}</p>

        <p>{t('teamBuilder.note')}</p>
      </div>
    </header>
  )
}
