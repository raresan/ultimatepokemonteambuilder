import type { Metadata } from 'next'
import { Saira_Condensed } from 'next/font/google'
import '@/app/globals.css'
import en from '@/i18n/en'
import pt from '@/i18n/pt'
import { notFound } from 'next/navigation'

const saira = Saira_Condensed({
  variable: '--font-saira',
  subsets: ['latin'],
  weight: ['100', '400', '700'],
  display: 'swap',
})

type I18nMeta = { metadata: { title: string; description: string } }

const dictionaries: Record<string, I18nMeta> = { en, pt }

interface Props {
  params: { lang: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params

  if (!dictionaries[lang]) {
    notFound()
  }

  const dictionary = dictionaries[lang] || dictionaries.en

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
  }
}

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: { lang: string }
}>) {
  const { lang } = await params

  if (!dictionaries[lang]) {
    notFound()
  }

  return (
    <html lang={lang} className={`${saira.variable} font-saira`}>
      <body>{children}</body>
    </html>
  )
}
