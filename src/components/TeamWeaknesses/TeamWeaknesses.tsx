'use client'

import TypeRelations from '@/components/TypeRelations/TypeRelations'

import useTranslations from '@/hooks/useTranslations'

import { calculateTeamWeaknesses } from '@/utils/calculateTeamWeaknesses'

import type { PokemonTeamMember } from '@/types'

type TeamWeaknessesProps = {
  team: PokemonTeamMember[]
}

export default function TeamWeaknesses({ team }: TeamWeaknessesProps) {
  const t = useTranslations()

  return (
    <section className='text-center mt-12 max-w-7xl'>
      <h2 className='text-2xl font-bold mb-4'>
        {t('teamBuilder.teamWeaknessesTitle')}
      </h2>

      <p className='mb-4'>{t('teamBuilder.teamWeaknessesDescription')}</p>

      <TypeRelations data={calculateTeamWeaknesses(team)} />
    </section>
  )
}
