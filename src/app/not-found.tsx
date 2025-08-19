import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='bg-foreground text-zekrom min-h-screen flex flex-col items-center justify-center gap-10'>
      <Image
        src='/assets/images/missigno.png'
        alt='MISSIGNO.'
        width={100}
        height={100}
        draggable={false}
        className='select-none'
      />

      <div className='flex gap-1'>
        <h1 className='border-5 [border-style:double] p-5'>
          Wild MISSIGNO. appeared!
        </h1>

        <Link
          href='/en'
          className='border-5 [border-style:double] p-5 uppercase'
        >
          Run
        </Link>
      </div>
    </div>
  )
}
