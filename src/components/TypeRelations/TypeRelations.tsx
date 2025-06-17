import { TYPE_COLORS } from '@/constants/typeColors'

type TypeRelationsProps = {
  data: { [type: string]: number }
}

export default function TypeRelations({ data }: TypeRelationsProps) {
  return (
    <div className='grid grid-cols-6 gap-4'>
      {Object.entries(data).map(([type, value]) => (
        <div key={type} className='flex flex-col items-center'>
          <div
            className={`w-10 h-10 rounded flex items-center justify-center text-white font-bold text-xs ${
              TYPE_COLORS[type] || 'bg-gray-600'
            }`}
          >
            {type.toUpperCase()}
          </div>
          <div className='mt-1 text-sm'>{value}</div>
        </div>
      ))}
    </div>
  )
}
