'use client'

import useTranslations from '@/hooks/useTranslations'

export default function Footer() {
  const t = useTranslations()
  const currentYear = new Date().getFullYear()

  return (
    <footer className='flex flex-col items-center gap-2 text-center mt-12 p-8 bg-zekrom'>
      <p>
        {t('footer.donate')}

        <a
          href='https://www.paypal.com/donate/?hosted_button_id=9PB8UCMHVKE5L'
          target='blank'
          className='text-blastoise underline hover:text-rayquaza visited:text-gengar'
        >
          PayPal
        </a>
      </p>

      <p>
        {t('footer.issue')}

        <a
          href='mailto:ultimatepokemonteambuilder@gmail.com'
          className='text-blastoise underline hover:text-rayquaza visited:text-gengar'
        >
          ultimatepokemonteambuilder@gmail.com
        </a>
      </p>

      <p>
        {t('footer.data')}

        <a
          href='https://pokeapi.co/'
          target='blank'
          className='text-blastoise underline hover:text-rayquaza visited:text-gengar'
        >
          PokéAPI
        </a>
      </p>

      <p>
        {t('footer.copyright')}, 2025-{currentYear}
      </p>

      <p>
        {t('footer.nintendo')}, 1995-{currentYear}
      </p>
    </footer>
  )
}
