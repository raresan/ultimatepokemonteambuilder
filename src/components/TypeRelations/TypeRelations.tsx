import Image from 'next/image'

type TypeRelationsProps = {
  data: { [type: string]: number }
  isPokemon?: boolean
}

export default function TypeRelations({ data, isPokemon }: TypeRelationsProps) {
  const formatMultiplier = (multiplier: number) => {
    return multiplier === 0 ? '-' : `*${multiplier}`
  }

  return (
    <div className={`grid ${isPokemon ? 'grid-cols-3' : 'grid-cols-6'} gap-2`}>
      {Object.entries(data).map(([type, value]) => (
        <div key={type} className=''>
          <div className='flex items-center bg-darkrai gap-2 rounded-full pr-3'>
            <div className='relative shrink-0'>
              <Image
                src={`/assets/images/${type}.png`}
                alt={type}
                width={80}
                height={80}
              />
            </div>

            <span className='grow-1 text-center text-[0.7rem]'>
              {isPokemon ? formatMultiplier(value) : value}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
