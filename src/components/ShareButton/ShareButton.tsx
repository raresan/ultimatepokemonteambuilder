'use client'

import { useState } from 'react'

import useTranslations from '@/hooks/useTranslations'

export default function ShareButton() {
  const [copied, setCopied] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const t = useTranslations()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError(t('shareButton.error'))
      setTimeout(() => setError(null), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`relative overflow-hidden px-4 py-2 w-100 text-2xl mt-12 rounded cursor-pointer transition-colors duration-300 ${
        error
          ? 'bg-groudon text-foreground'
          : copied
          ? 'bg-rayquaza text-foreground'
          : 'bg-foreground text-zekrom animate-pulse hover:bg-indigo-500'
      }`}
    >
      {error
        ? error
        : copied
        ? t('shareButton.copied')
        : t('shareButton.share')}

      <div
        className={`bg-foreground w-full h-1 absolute bottom-0 left-0 scale-x-0 origin-left ${
          (copied || error) && 'scale-x-100 transition-transform duration-2000'
        }`}
      />
    </button>
  )
}
