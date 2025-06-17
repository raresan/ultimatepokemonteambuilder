export type PokemonOption = {
  name: string
  url: string
}

export type PokemonData = {
  id: number
  name: string
  sprites: {
    other: {
      home: {
        front_default: string
        front_shiny: string
      }
    }
  }
  stats: {
    effort: number
    stat: {
      name: string
    }
  }[]
  types: {
    name: string
    damage_relations: {
      double_damage_from: { name: string }[]
      half_damage_from: { name: string }[]
      no_damage_from: { name: string }[]
    }
  }[]
}

export type PokemonTeamMember = {
  data?: PokemonData
  shiny: boolean
}
