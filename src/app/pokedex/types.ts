export type Pokemon = {
  sprite: string
  formeid: string
  name: string
  formename: string
}

export type Region = {
  region_name: string
  pokemon: Pokemon[]
}

export type OwnedPokemon = {
  id: number
  formeid: string
  color: string
}

export type UserSettings = {
  natures: string[];
  berryPreferences: string[];
  pokemonTypes: string[];
  displaySettings: {
    normal: 'all' | 'hideUnacquired' | 'showOnlyUnacquired';
    shiny: 'all' | 'hideUnacquired' | 'showOnlyUnacquired';
    albino: 'all' | 'hideUnacquired' | 'showOnlyUnacquired';
    melanistic: 'all' | 'hideUnacquired' | 'showOnlyUnacquired';
  };
};