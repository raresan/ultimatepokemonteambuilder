'use client'

import useTranslations from '@/hooks/useTranslations'

export default function Footer() {
  const t = useTranslations()
  const currentYear = new Date().getFullYear()

  return (
    <footer className='flex flex-col items-center gap-2 text-center mt-8 p-8 bg-zekrom'>
      <p>{t('footer.line1')}</p>
      <p>{t('footer.line2')}</p>
      <p>
        {t('footer.line3')}, 2025-{currentYear}
      </p>
      <p>
        {t('footer.line4')}, 1995-{currentYear}
      </p>
    </footer>
  )
}
