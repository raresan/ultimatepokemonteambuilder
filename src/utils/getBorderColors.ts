import { TYPE_COLORS } from '@/constants/typeColors'

export const getBorderColors = (types: { name: string }[]) => {
  if (types.length === 1) {
    return {
      border: `3px solid ${TYPE_COLORS[types[0].name]}`,
    }
  }

  const color1 = TYPE_COLORS[types[0].name]
  const color2 = TYPE_COLORS[types[1].name]

  return {
    border: '3px solid transparent',
    backgroundImage: `
      linear-gradient(var(--zekrom), var(--zekrom)),
      linear-gradient(121deg, ${color1} 30%, ${color2} 70%)
    `,
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
  }
}
