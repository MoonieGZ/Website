'use client'

import React, {useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/navigation'
import {Filter, HelpCircle, Info, LogOut, Search} from 'lucide-react'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion'
import {Card, CardContent} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip'
import {OwnedPokemon, Pokemon, Region, UserSettings} from './types'
import {BerryPreferences, BerryToNatureMap, Natures, PokemonTypes, Variants} from './pkmnVars'
import {fetchOwnedPokemon, fetchPokedexData} from './api'
import {cleanFormeName, generateShortLink} from './strings'
import Cookies from 'js-cookie'
import Image from 'next/image'
import Link from 'next/link'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'

const PokemonCard = ({pokemon, isHighlighted, ownedVariants}: {
  pokemon: Pokemon;
  isHighlighted: boolean;
  ownedVariants: { // noinspection JSUnusedLocalSymbols
    [key: string]: number };
}) => {
  return (
    <Card
      className={`mb-2 bg-gray-800 border-gray-700 transition-all duration-300 ${isHighlighted ? 'ring-2 ring-yellow-500 shadow-lg' : ''}`}>
      {
        <CardContent className="flex items-center justify-between p-2">
          <Image
            src={`/images/${pokemon.sprite}`}
            alt={pokemon.name}
            width={32}
            height={32}
          />
          <div className="flex-1 text-left pl-2">
            <span
              className="text-base font-medium">{pokemon.name} {pokemon.formename && ` [${cleanFormeName(pokemon.formename)}]`}</span>
          </div>

          <div className="flex items-center space-x-2">
            {Variants.map((variant) => (
              ownedVariants[variant] ? (
                <Link key={variant} href={`https://pokefarm.com/summary/${generateShortLink(ownedVariants[variant])}`}
                  target="_blank" rel="noopener noreferrer">
                  <Image
                    src={`/assets/${variant === 'normal' ? 'pkmn' : variant}.png`}
                    alt={variant.charAt(0).toUpperCase() + variant.slice(1)}
                    width={16}
                    height={16}
                  />
                </Link>
              ) : (
                <Image
                  key={variant}
                  src={`/assets/${variant === 'normal' ? 'pkmn' : variant}.png`}
                  alt={variant.charAt(0).toUpperCase() + variant.slice(1)}
                  width={16}
                  height={16}
                  className="grayscale opacity-35"
                />
              )
            ))}
          </div>
        </CardContent>
      }
    </Card>
  )
}

const clearCookiesAndReload = () => {
  Cookies.remove('token')
  Cookies.remove('pokedex_settings')
  window.location.reload()
}

const LogoutConfirmationDialog = ({isOpen, onClose, onConfirm}: {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to log out?<br/>This will clear your cookies and reload the page.</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>No</Button>
          <Button variant="destructive" onClick={onConfirm}>Yes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const InfoDialog = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="ml-2">
          <Info className="h-4 w-4"/>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>About this page</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <section>
            <h3 className="font-semibold mb-2">Description</h3>
            <p>
              This tool is designed as a Living Dex on PokéFarm Q. It is a visual representation of the Pokédex, showing
              all Pokémon and their forms.
            </p>
            <br/>
            <p>
              It also shows which Pokémon you own, and which variants you own, based on your live data from PFQ.
            </p>
            <br/>
            <p>
              Via the filter icon, you have the ability to filter by nature, berry preferences, and Pokémon types.
            </p>
            <br/>
            <p>
              You can also search for a specific Pokémon by name.
            </p>
          </section>
          <section>
            <h3 className="font-semibold mb-2">Known Issues</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ordering by dex number is not possible.</li>
              <li>All seasonal formes are displaying when only the current season is possible.</li>
              <li>There are Pokémon other than the Ralts lines displayed.</li>
            </ul>
          </section>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const SettingsDialog = ({settings, onSettingsChange}: {
  settings: UserSettings,
  onSettingsChange: (newSettings: UserSettings) => void
}) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings)
  const [open, setOpen] = useState(false)

  const handleCheckboxChange = (category: keyof UserSettings, item: string) => {
    setLocalSettings(prev => {
      const newSettings = {...prev}
      if(category !== 'displaySettings') {
        if (newSettings[category].includes(item)) {
          newSettings[category] = newSettings[category].filter(i => i !== item)
        } else {
          newSettings[category] = [...newSettings[category], item]
        }
      }

      if (category === 'berryPreferences') {
        const selectedNatures = new Set(newSettings.natures)
        BerryPreferences.forEach(berry => {
          console.log(berry)
          if (newSettings.berryPreferences.includes(berry)) {
            BerryToNatureMap[berry as keyof typeof BerryToNatureMap].forEach(nature => selectedNatures.add(nature))
          } else {
            BerryToNatureMap[berry as keyof typeof BerryToNatureMap].forEach(nature => selectedNatures.delete(nature))
          }
        })
        newSettings.natures = Array.from(selectedNatures)
      }

      return newSettings
    })
  }

  const handleDisplaySettingChange = (variant: keyof UserSettings['displaySettings'], value: 'all' | 'hideUnacquired' | 'showOnlyUnacquired') => {
    setLocalSettings(prev => ({
      ...prev,
      displaySettings: {
        ...prev.displaySettings,
        [variant]: value
      }
    }))
  }

  const handleSave = () => {
    onSettingsChange(localSettings)
    setOpen(false)
    window.location.reload()
  }

  const handleClearFilters = () => {
    setLocalSettings({
      natures: [],
      berryPreferences: [],
      pokemonTypes: [],
      displaySettings: {
        normal: 'all',
        shiny: 'all',
        albino: 'all',
        melanistic: 'all'
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Filter className="h-4 w-4"/>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              Filter Settings
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground"/>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>In a category, if none are selected, all will be displayed.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Natures</AccordionTrigger>
              <AccordionContent>
                <SettingsSection
                  items={Natures}
                  category="natures"
                  localSettings={localSettings}
                  handleCheckboxChange={handleCheckboxChange}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Berry Preferences</AccordionTrigger>
              <AccordionContent>
                <SettingsSection
                  items={BerryPreferences}
                  category="berryPreferences"
                  localSettings={localSettings}
                  handleCheckboxChange={handleCheckboxChange}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Pokémon Types</AccordionTrigger>
              <AccordionContent>
                <SettingsSection
                  items={PokemonTypes}
                  category="pokemonTypes"
                  localSettings={localSettings}
                  handleCheckboxChange={handleCheckboxChange}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Ownership Status</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4">
                  {Variants.map((variant) => (
                    <div key={variant} className="flex items-center space-x-2">
                      <Image
                        src={`/assets/${variant === 'normal' ? 'pkmn' : variant}.png`}
                        alt={variant.charAt(0).toUpperCase() + variant.slice(1)}
                        width={16}
                        height={16}
                      />
                      <Select
                        value={localSettings.displaySettings[variant as keyof UserSettings['displaySettings']]}
                        onValueChange={(value) => handleDisplaySettingChange(variant as keyof UserSettings['displaySettings'], value as 'all' | 'hideUnacquired' | 'showOnlyUnacquired')}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select display option"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Show All</SelectItem>
                          <SelectItem value="hideUnacquired">Show Owned Only</SelectItem>
                          <SelectItem value="showOnlyUnacquired">Show Unowned Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const SettingsSection = ({items, category, localSettings, handleCheckboxChange}: {
  items: string[],
  category: keyof UserSettings,
  localSettings: UserSettings,
  handleCheckboxChange: (category: keyof UserSettings, item: string) => void
}) => (
  <div className="grid gap-2">
    <div className="grid grid-cols-3 gap-2">
      {items.map(item => (
        <div key={item} className="flex items-center space-x-2">
          <Checkbox
            id={`${category}-${item}`}
            checked={category !== 'displaySettings' && localSettings[category].includes(item)}
            onCheckedChange={() => handleCheckboxChange(category, item)}
          />
          <label htmlFor={`${category}-${item}`}>{item}</label>
        </div>
      ))}
    </div>
  </div>
)

export default function Pokedex() {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const savedSettings = Cookies.get('pokedex_settings')
    return savedSettings ? JSON.parse(savedSettings) : {
      natures: [],
      berryPreferences: [],
      pokemonTypes: [],
      displaySettings: {
        normal: 'all',
        shiny: 'all',
        albino: 'all',
        melanistic: 'all'
      }
    }
  })
  const [pokedexData, setPokedexData] = useState<Region[]>([])
  const [ownedPokemon, setOwnedPokemon] = useState<OwnedPokemon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [highlightedPokemon, setHighlightedPokemon] = useState<string | null>(null)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  const router = useRouter()

  const accordionRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const pokemonRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      router.push('/login')
      return
    }

    const loadData = async () => {
      try {
        const [pokedexData, ownedPokemonData] = await Promise.all([
          fetchPokedexData(token, settings),
          fetchOwnedPokemon(token, settings)
        ])

        const sortedData = pokedexData.sort((a, b) => {
          if (a.region_name === 'PokéFarm Q') return 1
          if (b.region_name === 'PokéFarm Q') return -1
          return 0
        })

        setPokedexData(sortedData)
        setOwnedPokemon(ownedPokemonData)
      } catch (err) {
        setError('Failed to load data.\n' + err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData().then(() => {
      /* ignored */
    }).catch(err => {
      throw new Error('Failed to load data.\n' + err)
    })
  }, [router, settings])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm) return

    const lowercaseSearch = searchTerm.toLowerCase()
    for (const region of pokedexData) {
      const pokemonIndex = region.pokemon.findIndex(p => p.name.toLowerCase().includes(lowercaseSearch))

      if (pokemonIndex !== -1) {
        const accordionTrigger = accordionRefs.current[region.region_name]

        if (accordionTrigger) {
          accordionTrigger.click()
        }

        setTimeout(() => {
          const pokemonRef = pokemonRefs.current[region.pokemon[pokemonIndex].formeid]

          if (pokemonRef) {
            pokemonRef.scrollIntoView({behavior: 'smooth', block: 'center'})

            setHighlightedPokemon(region.pokemon[pokemonIndex].formeid)

            setTimeout(() => {
              setHighlightedPokemon(null)
            }, 3000)
          }
        }, 500)

        return
      }
    }

    alert('Pokémon not found!')
  }

  const handleSettingsChange = (newSettings: UserSettings) => {
    setSettings(newSettings)
    Cookies.set('pokedex_settings', JSON.stringify(newSettings), {expires: 365})
  }

  const getOwnedVariants = (formeid: string): { [key: string]: number } => {
    const variants: { [key: string]: number } = {}
    ownedPokemon.forEach(p => {
      if (p.formeid === formeid) {
        variants[p.color] = p.id
      }
    })
    return variants
  }

  const getActiveFilters = () => {
    const activeFilters: string[] = []
    if (settings.natures.length > 0) {
      activeFilters.push(`Natures: ${settings.natures.join(', ')}`)
    }
    if (settings.berryPreferences.length > 0) {
      activeFilters.push(`Berries: ${settings.berryPreferences.join(', ')}`)
    }
    if (settings.pokemonTypes.length > 0) {
      activeFilters.push(`Types: ${settings.pokemonTypes.join(', ')}`)
    }
    return activeFilters.length > 0 ? activeFilters.join(' | ') : 'No filters applied.'
  }

  if (isLoading) {
    return <div className="text-center">Loading PokéDex data...</div>
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={clearCookiesAndReload}>
          Clear cookies and reload.
        </Button>
      </div>
    )
  }

  const shouldDisplayPokemon = (ownedVariants: { [key: string]: number }) => {
    return Variants.every(variant => {
      const isOwned = !!ownedVariants[variant]
      switch (settings.displaySettings[variant as keyof UserSettings['displaySettings']]) {
      case 'hideUnacquired':
        return isOwned
      case 'showOnlyUnacquired':
        return !isOwned
      default:
        return true
      }
    })
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">PokéDex</h1>
        <div className="flex-grow"></div>
        <form onSubmit={handleSearch} className="flex gap-2 mr-2">
          <Input
            type="text"
            placeholder="Search Pokémon"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button variant="secondary" type="submit">
            <Search className="h-4 w-4"/>
          </Button>
        </form>
        <SettingsDialog settings={settings} onSettingsChange={handleSettingsChange}/>
        <InfoDialog/>
        <Button variant="destructive" onClick={() => setIsLogoutDialogOpen(true)} className="ml-2">
          <LogOut className="h-4 w-4"/>
        </Button>
        <LogoutConfirmationDialog
          isOpen={isLogoutDialogOpen}
          onClose={() => setIsLogoutDialogOpen(false)}
          onConfirm={clearCookiesAndReload}
        />
      </div>

      <Accordion type="single" collapsible className="w-full">
        {pokedexData.map((region) => (
          <AccordionItem
            key={region.region_name}
            value={region.region_name}
            className="border-gray-700"
          >
            <AccordionTrigger
              className="text-xl font-semibold px-4"
              ref={el => {
                accordionRefs.current[region.region_name] = el
              }}
            >
              <div className="flex items-center gap-2">
                <Image
                  src={`/assets/${region.region_name === 'PokéFarm Q' ? 'pfq' : region.region_name.toLowerCase()}.png`}
                  alt={region.region_name}
                  width={33}
                  height={22}
                  className="rounded-md pr-1"
                />
                {region.region_name}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {region.pokemon.map((pokemon) => {
                  const ownedVariants = getOwnedVariants(pokemon.formeid)
                  if (!shouldDisplayPokemon(ownedVariants)) {
                    return null
                  }
                  return (
                    <div
                      key={pokemon.formeid}
                      ref={el => {
                        pokemonRefs.current[pokemon.formeid] = el
                      }}
                    >
                      <PokemonCard
                        pokemon={pokemon}
                        isHighlighted={highlightedPokemon === pokemon.formeid}
                        ownedVariants={ownedVariants}
                      />
                    </div>
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-8 text-xs text-muted-foreground">
        <p>{getActiveFilters()}</p>
      </div>
    </>
  )
}
