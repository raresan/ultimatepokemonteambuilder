import type { PokemonData, PokemonOption, TypeDamageRelations } from '@/types'

// CACHE USING LOCALSTORAGE THAT PERSISTS BETWEEN PAGE RELOADS
class PersistentCache<T> {
  private ttl: number
  private prefix: string

  constructor(prefix: string, ttlMinutes: number = 60) {
    this.prefix = prefix
    this.ttl = ttlMinutes * 60 * 1000 // CONVERT TO MS
  }

  set(key: string, data: T): void {
    const item = { data, timestamp: Date.now() }

    localStorage.setItem(`${this.prefix}-${key}`, JSON.stringify(item))
  }

  get(key: string): T | null {
    try {
      const stored = localStorage.getItem(`${this.prefix}-${key}`)

      if (!stored) return null

      const item = JSON.parse(stored)

      // CHECK IF EXPIRED
      if (Date.now() - item.timestamp > this.ttl) {
        localStorage.removeItem(`${this.prefix}-${key}`)
        return null
      }

      return item.data
    } catch {
      return null
    }
  }

  clear(): void {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.prefix))
      .forEach((key) => localStorage.removeItem(key))
  }
}

// POKEMON LIST CACHE (PERSISTS FOR 1 DAY)
export const pokemonListCache = new PersistentCache<PokemonOption[]>(
  'pokemon-list',
  1440,
)

// INDIVIDUAL POKEMON DATA CACHE (PERSISTS FOR 1 DAY)
export const pokemonDataCache = new PersistentCache<PokemonData>(
  'pokemon-data',
  1440,
)

// TYPE DAMAGE RELATIONS CACHE (PERSISTS FOR 1 DAY)
export const typeDamageCache = new PersistentCache<TypeDamageRelations>(
  'type-damage',
  1440,
)
