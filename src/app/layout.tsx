import type { Metadata } from 'next'
import { Saira_Condensed } from 'next/font/google'
import './globals.css'

const saira = Saira_Condensed({
  variable: '--font-saira',
  subsets: ['latin'],
  weight: ['100', '400', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pokémon Team Builder / EVs earned',
  description:
    'Choose six Pokémon for your team. You can see their individual weaknesses, resistances and immunities. Also, you can check which EVs (Effort Values) they grant when defeated, in case you need. At the end, you can see how many of them are weak to each type.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className={`${saira.variable} font-saira`}>
      <body>{children}</body>
    </html>
  )
}
