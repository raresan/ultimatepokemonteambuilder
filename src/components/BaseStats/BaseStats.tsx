'use client'

import { useRef } from 'react'

import useTranslations from '@/hooks/useTranslations'

import {
  maxStat,
  maxBaseStatTotal,
  getBaseStatBarColor,
  getBaseStatTotalBarColor,
  getBarPercentage,
} from '@/utils/statsBar'

import type { PokemonData } from '@/types'

type BaseStatsProps = {
  pokemonData: PokemonData
}

export default function BaseStats({ pokemonData }: BaseStatsProps) {
  const t = useTranslations()

  const baseStatTotal = useRef<number>(0)

  return (
    <div className='flex flex-col justify-center basis-1/2 gap-2'>
      <h3 className='font-bold'>{t('pokemon.baseStatsTitle')}</h3>

      {pokemonData.stats.map((stat, index) => {
        // RESETTING COUNT TO ZERO IN THE FIRST ITERATION
        if (index === 0) {
          baseStatTotal.current = 0
        }

        baseStatTotal.current += stat.base_stat

        return (
          <div key={index} className='flex items-center gap-2 h-3'>
            <span className='w-10 capitalize text-[0.7rem]/1 text-right'>
              {stat.stat.name
                .replace('-', ' ')
                .replace('special', t('pokemon.baseStatSpecial'))
                .replace('attack', t('pokemon.baseStatAttack'))
                .replace('defense', t('pokemon.baseStatDefense'))
                .replace('speed', t('pokemon.baseStatSpeed'))}
              :
            </span>

            <div className='flex items-center justify-center flex-1 h-full relative overflow-hidden'>
              <div
                className={`absolute top-0 left-0 h-full ${getBaseStatBarColor(
                  stat.base_stat,
                  maxStat,
                )}`}
                style={{
                  width: `${getBarPercentage(stat.base_stat, maxStat)}%`,
                }}
              />

              <span className='text-[0.7rem]/1 relative drop-shadow-[0_1px_1px_black]'>
                {stat.base_stat}
              </span>
            </div>
          </div>
        )
      })}

      <div className='flex items-center gap-2 h-3'>
        <span className='w-10 capitalize text-[0.7rem]/1 text-right'>
          {t('pokemon.baseStatsTotalTitle')}
        </span>

        <div className='flex items-center justify-center flex-1 h-full relative overflow-hidden'>
          <div
            className={`absolute top-0 left-0 h-full ${getBaseStatTotalBarColor(
              baseStatTotal.current,
              maxBaseStatTotal,
            )}`}
            style={{
              width: `${getBarPercentage(
                baseStatTotal.current,
                maxBaseStatTotal,
              )}%`,
            }}
          />

          <span className='text-[0.7rem]/1 relative drop-shadow-[0_1px_1px_black]'>
            {baseStatTotal.current}
          </span>
        </div>
      </div>
    </div>
  )
}
