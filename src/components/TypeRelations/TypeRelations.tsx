import Image from 'next/image'

type TypeRelationsProps = {
  data: { [type: string]: number }
  isPokemon?: boolean
}

export default function TypeRelations({ data, isPokemon }: TypeRelationsProps) {
  const getMultiplierInfo = (multiplier: number) => {
    const data: Record<number, { icon: string; label: string }> = {
      0: { icon: '✕', label: 'Has no effect (*0)' },
      0.25: { icon: '▼', label: 'Mostly ineffective (*0.25)' },
      0.5: { icon: '△', label: 'Not very effective (*0.5)' },
      1: { icon: '◯', label: 'Effective (*1)' },
      2: { icon: '⊙', label: 'Super effective (*2)' },
      4: { icon: '★', label: 'Extremely effective (*4)' },
    }

    if (
      typeof multiplier !== 'number' ||
      isNaN(multiplier) ||
      !data.hasOwnProperty(multiplier)
    ) {
      return { icon: '?', label: 'Invalid data' }
    }

    return data[multiplier]
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

            {isPokemon ? (
              <span
                title={getMultiplierInfo(value).label}
                className='grow-1 text-center text-[0.7rem]'
              >
                {getMultiplierInfo(value).icon}
              </span>
            ) : (
              <span className='grow-1 text-center text-[0.7rem]'>{value}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
