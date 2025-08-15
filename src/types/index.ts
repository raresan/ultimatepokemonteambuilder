export type PokemonOption = {
  name: string
  url: string
  formattedName: string
  imgUrl: string
}

export type TypeDamageRelations = {
  double_damage_from: { name: string }[]
  half_damage_from: { name: string }[]
  no_damage_from: { name: string }[]
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
    base_stat: number
    effort: number
    stat: {
      name: string
    }
  }[]
  types: {
    name: string
    damage_relations: TypeDamageRelations
  }[]
  cries: {
    latest: string
    legacy: string
  }
}

export type PokemonTeamMember = {
  data?: PokemonData
  shiny: boolean
}
