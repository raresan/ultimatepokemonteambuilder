import Link from 'next/link'
import { dictionaries } from '@/i18n/dictionaries'
import { Fragment } from 'react'

export default function LanguageSelector() {
  return (
    <ul className='flex gap-1 p-2 justify-end'>
      {Object.keys(dictionaries)?.map((lang, index) => (
        <Fragment key={index}>
          {index > 0 && <li>|</li>}
          <li className='uppercase'>
            <Link href={`/${lang}`}>{lang}</Link>
          </li>
        </Fragment>
      ))}
    </ul>
  )
}
