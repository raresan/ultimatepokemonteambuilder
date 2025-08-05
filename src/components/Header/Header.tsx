'use client'

import Image from 'next/image'

import useTranslations from '@/hooks/useTranslations'

export default function Header() {
  const t = useTranslations()

  return (
    <header className='flex items-center justify-center text-center flex-col gap-8 p-8 pb-12 md:pb-16'>
      <Image
        src={'/assets/images/pokemon-logo.png'}
        alt={'Pokémon Logo'}
        width={450}
        height={150}
        className='invert select-none'
        draggable='false'
      />

      <h1 className='text-3xl font-bold'>{t('teamBuilder.title')}</h1>

      <div className='text-center'>
        <p>{t('teamBuilder.description')}</p>

        <p>{t('teamBuilder.description2')}</p>
      </div>
    </header>
  )
}
