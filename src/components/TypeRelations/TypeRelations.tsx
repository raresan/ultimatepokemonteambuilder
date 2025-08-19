'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

import { getDamageStyles, getQuantityStyles } from '@/utils/getValueStyles'

import useTranslations from '@/hooks/useTranslations'

type TypeRelationsProps = {
  data: { [type: string]: number }
  isPokemon?: boolean
}

export default function TypeRelations({ data, isPokemon }: TypeRelationsProps) {
  const t = useTranslations()
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)

  // CLOSE TOOLTIP WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleClickOutside = () => {
      if (activeTooltip && !window.matchMedia('(hover: hover)').matches) {
        setActiveTooltip(null)
      }
    }

    if (activeTooltip) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [activeTooltip])

  const getMultiplierInfo = (multiplier: number) => {
    const data: Record<number, { damage: string; label: string }> = {
      0: { damage: '-', label: t('typeRelations.hasNoEffect') },
      0.25: { damage: '÷4', label: t('typeRelations.mostlyIneffective') },
      0.5: { damage: '÷2', label: t('typeRelations.notVeryEffective') },
      1: { damage: 'x1', label: t('typeRelations.effective') },
      2: { damage: 'x2', label: t('typeRelations.superEffective') },
      4: { damage: 'x4', label: t('typeRelations.extremelyEffective') },
    }

    if (
      typeof multiplier !== 'number' ||
      isNaN(multiplier) ||
      !data.hasOwnProperty(multiplier)
    ) {
      return { damage: '?', label: 'Invalid data' }
    }

    return data[multiplier]
  }

  return (
    <div
      className={`grid gap-x-2 gap-y-4 grid-cols-9 ${
        !isPokemon && 'sm:grid-cols-18'
      }`}
    >
      {Object.entries(data).map(([type, value]) => {
        const tooltipKey = `${type}-${value}`
        const isTooltipActive = activeTooltip === tooltipKey
        const { damage, label } = getMultiplierInfo(value)

        return (
          <div
            key={type}
            className='relative flex flex-col items-center hover:scale-110 transition-transform ease-out duration-300 will-change-transform'
            onMouseEnter={() => {
              if (isPokemon && window.matchMedia('(hover: hover)').matches) {
                setActiveTooltip(tooltipKey)
              }
            }}
            onMouseLeave={() => {
              if (isPokemon && window.matchMedia('(hover: hover)').matches) {
                setActiveTooltip(null)
              }
            }}
            onClick={(e) => {
              if (isPokemon) {
                e.stopPropagation() // PREVENT CLOSING WHEN CLICKING ON ELEMENT
                // ON MOBILE, ALWAYS TOGGLE. ON DESKTOP, ONLY IF NO HOVER
                if (!window.matchMedia('(hover: hover)').matches) {
                  setActiveTooltip(isTooltipActive ? null : tooltipKey)
                }
              }
            }}
          >
            <div className='bg-darkrai rounded-full'>
              <div className='relative shrink-0'>
                <Image
                  src={`/assets/svg/${type}.svg`}
                  alt={type}
                  width={30}
                  height={30}
                  draggable={false}
                  className='select-none'
                />
              </div>

              {isPokemon ? (
                <span
                  className={`grow-1 text-center text-2 select-none block pt-1 pb-2 w-full ${getDamageStyles(
                    damage,
                  )}`}
                >
                  {damage}
                </span>
              ) : (
                <span
                  className={`grow-1 text-center text-2 select-none block pt-1 pb-2 w-full ${getQuantityStyles(
                    value,
                  )}`}
                >
                  {value}
                </span>
              )}
            </div>

            {/* CUSTOM TOOLTIP */}
            {isPokemon && isTooltipActive && (
              <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-zekrom text-xs font-medium rounded-lg shadow-xl border-2 border-gray-300 whitespace-nowrap z-20'>
                {label}
                <div className='absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground'></div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
