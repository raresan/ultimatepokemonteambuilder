export const getDamageStyles = (damage: string) => {
  switch (damage) {
    case 'x4':
      return 'text-red-400 font-bold'
    case 'x2':
      return 'text-charizard font-bold'
    case 'x1':
      return 'text-foreground'
    case '÷2':
      return 'text-rayquaza'
    case '÷4':
      return 'text-blastoise'
    default:
      return 'text-gray-500'
  }
}

export const getQuantityStyles = (number: number) => {
  if (number >= 3) {
    return 'text-red-400 font-bold'
  } else if (number === 2) {
    return 'text-charizard font-bold'
  } else if (number === 1) {
    return 'text-foreground'
  } else {
    return 'text-rayquaza'
  }
}
