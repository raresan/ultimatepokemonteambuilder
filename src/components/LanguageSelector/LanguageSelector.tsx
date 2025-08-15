'use client'

import Link from 'next/link'
import { dictionaries } from '@/i18n/dictionaries'
import { Fragment } from 'react'
import { useSearchParams } from 'next/navigation'

export default function LanguageSelector() {
  const searchParams = useSearchParams()

  return (
    <ul className='flex gap-1 p-4 absolute top-0 right-0 z-10'>
      {Object.keys(dictionaries)?.map((lang, index) => (
        <Fragment key={index}>
          {index > 0 && <li>|</li>}
          <li className='uppercase'>
            <Link
              scroll={false}
              href={`/${lang}${
                searchParams.toString() ? `?${searchParams.toString()}` : ''
              }`}
            >
              {lang}
            </Link>
          </li>
        </Fragment>
      ))}
    </ul>
  )
}
