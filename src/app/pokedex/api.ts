import {OwnedPokemon, Region, UserSettings} from './types'

const apiUrl = process.env.API_URL || 'http://localhost:2138'

export const fetchPokedexData = async (token: string, settings: UserSettings): Promise<Region[]> => {
  const url = new URL(`${apiUrl}/dex`)
  if (settings.pokemonTypes.length > 0) url.searchParams.append('types', settings.pokemonTypes.join(','))

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch PokéDex data')
  }

  return response.json()
}

export const fetchOwnedPokemon = async (token: string, settings: UserSettings): Promise<OwnedPokemon[]> => {
  const url = new URL(`${apiUrl}/pokemon`)

  if (settings.natures.length > 0) url.searchParams.append('natures', settings.natures.join(','))

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch owned Pokémon data.')
  }

  return response.json()
}