export const maxStat = 255
export const maxBaseStatTotal = 780

export const getBaseStatBarColor = (stat: number, max: number) => {
  const percent = (stat / max) * 100

  if (percent >= 100) return 'bg-gengar'
  if (percent >= 50) return 'bg-blastoise'
  if (percent >= 35) return 'bg-rayquaza'
  if (percent >= 20) return 'bg-zapdos'
  if (percent >= 5) return 'bg-charizard'
  return 'bg-groudon'
}

export const getBaseStatTotalBarColor = (stat: number, max: number) => {
  const percent = (stat / max) * 100

  if (percent >= 100) return 'bg-gengar'
  if (percent >= 75) return 'bg-blastoise'
  if (percent >= 50) return 'bg-rayquaza'
  if (percent >= 40) return 'bg-zapdos'
  if (percent >= 30) return 'bg-charizard'
  return 'bg-groudon'
}

export const getBarPercentage = (stat: number, max: number) => {
  return (stat / max) * 100
}
