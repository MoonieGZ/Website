export const Variants = ['normal', 'shiny', 'albino', 'melanistic']

export const Natures = ['Adamant', 'Bashful', 'Bold', 'Brave',
  'Calm', 'Careful', 'Docile', 'Gentle', 'Hardy',
  'Hasty', 'Impish', 'Jolly', 'Lax', 'Lonely',
  'Mild', 'Modest', 'Naive', 'Naughty',
  'Quiet', 'Quirky', 'Rash', 'Relaxed',
  'Sassy', 'Serious', 'Timid'
]

export const BerryPreferences = ['Any', 'Bitter', 'Dry', 'Sour', 'Spicy', 'Sweet']

export const PokemonTypes = ['Bug', 'Dark', 'Dragon', 'Electric',
  'Fairy', 'Fighting', 'Fire', 'Flying', 'Ghost',
  'Grass', 'Ground', 'Ice', 'Normal', 'Poison',
  'Psychic', 'Rock', 'Steel', 'Water'
]

export const BerryToNatureMap = {
  Any: ['Docile', 'Hardy', 'Bashful', 'Serious', 'Quirky'],
  Sour: ['Bold', 'Impish', 'Relaxed', 'Lax'],
  Spicy: ['Lonely', 'Adamant', 'Brave', 'Naughty'],
  Dry: ['Mild', 'Modest', 'Quiet', 'Rash'],
  Sweet: ['Hasty', 'Timid', 'Jolly', 'Naive'],
  Bitter: ['Gentle', 'Calm', 'Careful', 'Sassy'],
}