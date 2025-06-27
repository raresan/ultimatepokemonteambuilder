import { TYPE_COLORS } from '@/constants/typeColors'

export const getBorderColors = (types: { name: string }[]) => {
  if (types.length === 1) {
    return {
      border: `4px solid ${TYPE_COLORS[types[0].name]}`,
    }
  }

  const color1 = TYPE_COLORS[types[0].name]
  const color2 = TYPE_COLORS[types[1].name]

  return {
    border: '4px solid transparent',
    backgroundImage: `
      linear-gradient(#1f2937, #1f2937),
      linear-gradient(90deg, ${color1} 50%, ${color2} 50%)
    `,
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
  }
}
