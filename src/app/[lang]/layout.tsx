import type { Metadata } from 'next'
import { Saira_Condensed } from 'next/font/google'
import '../globals.css'

const saira = Saira_Condensed({
  variable: '--font-saira',
  subsets: ['latin'],
  weight: ['100', '400', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pokémon Team Builder / Planner',
  description:
    'Choose six Pokémon for your team. You can see their individual weaknesses, resistances and immunities. Down below, you can see how many of them are weak to each type.',
}

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: { lang: string }
}>) {
  const { lang } = await params

  return (
    <html lang={lang} className={`${saira.variable} font-saira`}>
      <body>{children}</body>
    </html>
  )
}
