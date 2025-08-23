import type { Metadata } from 'next'
import { Saira_Condensed } from 'next/font/google'
import { notFound } from 'next/navigation'

import en from '@/i18n/en'
import pt from '@/i18n/pt'
import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics'

import '@/app/globals.css'

const saira = Saira_Condensed({
  variable: '--font-saira',
  subsets: ['latin'],
  weight: ['100', '400', '700'],
  display: 'swap',
})

type I18nMeta = {
  metadata: {
    title: string
    description: string
    keywords: string
    shareImage: string
    shareImageAlt: string
    websiteUrl: string
    websiteName: string
    locale: string
  }
}

const dictionaries: Record<string, I18nMeta> = { en, pt }

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params

  if (!dictionaries[lang]) {
    notFound()
  }

  const dictionary = dictionaries[lang] || dictionaries.en
  const creator = 'Renan Reis Alonso Santos'

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
    keywords: dictionary.metadata.keywords,
    authors: [
      {
        name: creator,
        url: 'https://raresan.vercel.app/index.html',
      },
    ],
    creator,
    publisher: creator,
    metadataBase: new URL(dictionary.metadata.websiteUrl),
    openGraph: {
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
      url: dictionary.metadata.websiteUrl,
      siteName: dictionary.metadata.websiteName,
      images: [
        {
          url: new URL(
            dictionary.metadata.shareImage,
            dictionary.metadata.websiteUrl,
          ).toString(),
          width: 1200,
          height: 630,
          alt: dictionary.metadata.shareImageAlt,
        },
      ],
      locale: dictionary.metadata.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
      images: new URL(
        dictionary.metadata.shareImage,
        dictionary.metadata.websiteUrl,
      ).toString(),
      creator,
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
    icons: {
      icon: '/assets/images/favicon.png',
      shortcut: '/assets/images/favicon.png',
      apple: '/assets/images/favicon.png',
    },
  }
}

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Props['params']
}>) {
  const { lang } = await params

  if (!dictionaries[lang]) {
    notFound()
  }

  return (
    <html lang={lang} className={`${saira.variable} font-saira`}>
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}
