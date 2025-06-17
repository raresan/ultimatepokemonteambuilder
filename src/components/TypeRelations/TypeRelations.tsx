import Image from 'next/image'

type TypeRelationsProps = {
  data: { [type: string]: number }
}

export default function TypeRelations({ data }: TypeRelationsProps) {
  return (
    <div className='grid grid-cols-6 gap-4'>
      {Object.entries(data).map(([type, value]) => (
        <div key={type} className='flex flex-col items-center'>
          <Image
            src={`/assets/images/${type}.png`}
            alt={type}
            width={100}
            height={100}
          />

          <div className='mt-1 text-sm'>{value}</div>
        </div>
      ))}
    </div>
  )
}
