'use client'

import React from 'react'

type LoadingSpinnerProps = {
  visible: boolean
  fullscreen?: boolean
}

export default function LoadingSpinner({
  visible,
  fullscreen = false,
}: LoadingSpinnerProps) {
  if (!visible) return null

  return (
    <div
      role='status'
      aria-live='polite'
      className={`flex items-center justify-center inset-0 z-50 bg-black/80 ${
        fullscreen ? 'fixed' : 'absolute'
      }`}
    >
      <div className='flex flex-col items-center gap-3'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          className={`block ${fullscreen ? 'h-14 w-14' : 'h-10 w-10'}`}
          aria-hidden='true'
        >
          <circle
            cx='12'
            cy='12'
            r='10'
            fill='none'
            stroke='currentColor'
            strokeWidth='1'
            opacity='0.95'
          />

          <g className='origin-center animate-spin'>
            <path
              d='M2 12 A10 10 0 0 1 22 12 L2 12 Z'
              fill='currentColor'
              stroke='none'
              opacity='0.95'
            />
          </g>

          <circle
            cx='12'
            cy='12'
            r='4'
            fill='currentColor'
            stroke='var(--color-zekrom)'
            strokeWidth='1.5'
          />
        </svg>

        <span className={`select-none ${fullscreen ? 'text-sm' : 'text-xs'}`}>
          Loading
        </span>
      </div>
    </div>
  )
}
