'use client'

import Image from 'next/image'
import useTranslations from '@/hooks/useTranslations'

type TypeRelationsProps = {
  data: { [type: string]: number }
  isPokemon?: boolean
}

export default function TypeRelations({ data, isPokemon }: TypeRelationsProps) {
  const t = useTranslations()

  const getMultiplierInfo = (multiplier: number) => {
    const data: Record<number, { icon: string; label: string }> = {
      0: { icon: '✕', label: t('typeRelations.hasNoEffect') },
      0.25: { icon: '▼', label: t('typeRelations.mostlyIneffective') },
      0.5: { icon: '△', label: t('typeRelations.notVeryEffective') },
      1: { icon: '◯', label: t('typeRelations.effective') },
      2: { icon: '⊙', label: t('typeRelations.superEffective') },
      4: { icon: '★', label: t('typeRelations.extremelyEffective') },
    }

    if (
      typeof multiplier !== 'number' ||
      isNaN(multiplier) ||
      !data.hasOwnProperty(multiplier)
    ) {
      return { icon: '?', label: 'Invalid data' }
    }

    return data[multiplier]
  }

  return (
    <div
      className={`grid gap-2 mx-auto  ${
        isPokemon ? 'grid-cols-3' : 'grid-cols-3 md:grid-cols-6 xl:grid-cols-9'
      }`}
    >
      {Object.entries(data).map(([type, value]) => (
        <div
          key={type}
          className='flex items-center bg-darkrai gap-1.5 rounded-full pr-2 hover:scale-110 transition-transform ease-out duration-300 will-change-transform md:(gap-2 pr-3)'
          title={isPokemon ? getMultiplierInfo(value).label : undefined}
        >
          <div className='relative shrink-0'>
            <Image
              src={`/assets/images/${type}.png`}
              alt={type}
              width={80}
              height={80}
            />
          </div>

          {isPokemon ? (
            <span className='grow-1 text-center text-[0.6rem] md:text-[0.7rem] select-none'>
              {getMultiplierInfo(value).icon}
            </span>
          ) : (
            <span className='grow-1 text-center text-[0.7rem] select-none'>
              {value}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
