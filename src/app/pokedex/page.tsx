"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Settings, HelpCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Pokemon, OwnedPokemon, Region, UserSettings } from "./types"
import { BerryPreferences, BerryToNatureMap, Natures, PokemonTypes, Variants } from "./pkmnVars"
import { fetchOwnedPokemon, fetchPokedexData } from "./api"
import { cleanFormeName, generateShortLink } from "./strings"
import Cookies from "js-cookie"
import Image from "next/image"
import Link from "next/link"

const PokemonCard = ({ pokemon, isHighlighted, ownedVariants }: { 
  pokemon: Pokemon; 
  isHighlighted: boolean; 
  ownedVariants: { [key: string]: number } 
}) => (
  <Card className={`mb-2 bg-gray-800 border-gray-700 transition-all duration-300 ${isHighlighted ? 'ring-2 ring-yellow-500 shadow-lg' : ''}`}>
    {
      <CardContent className="flex items-center justify-between p-2">
        <Image
          src={`/images/${pokemon.sprite}`}
          alt={pokemon.name}
          width={32}
          height={32}
        />
        <div className="flex-1 text-left pl-2">
          <span className="text-base font-medium">{pokemon.name} {pokemon.formename && ` [${cleanFormeName(pokemon.formename)}]`}</span>
        </div>

        <div className="flex items-center space-x-2">
          {Variants.map((variant) => (
            ownedVariants[variant] ? (
              <Link key={variant} href={`https://pokefarm.com/summary/${generateShortLink(ownedVariants[variant])}`} target="_blank" rel="noopener noreferrer">
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

const SettingsDialog = ({ settings, onSettingsChange }: { settings: UserSettings, onSettingsChange: (newSettings: UserSettings) => void }) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings)
  const [open, setOpen] = useState(false)

  const handleCheckboxChange = (category: keyof UserSettings, item: string) => {
    setLocalSettings(prev => {
      const newSettings = { ...prev }
      if (newSettings[category].includes(item)) {
        newSettings[category] = newSettings[category].filter(i => i !== item)
      } else {
        newSettings[category] = [...newSettings[category], item]
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

  const handleSave = () => {
    onSettingsChange(localSettings)
    setOpen(false)
    window.location.reload()
  }

  const handleClearFilters = () => {
    setLocalSettings({
      natures: [],
      berryPreferences: [],
      pokemonTypes: []
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
            Pokédex Settings
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
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
          <SettingsSection
            title="Natures"
            items={Natures}
            category="natures"
            localSettings={localSettings}
            handleCheckboxChange={handleCheckboxChange}
          />
          <SettingsSection
            title="Berry Preferences"
            items={BerryPreferences}
            category="berryPreferences"
            localSettings={localSettings}
            handleCheckboxChange={handleCheckboxChange}
          />
          <SettingsSection
            title="Pokémon Types"
            items={PokemonTypes}
            category="pokemonTypes"
            localSettings={localSettings}
            handleCheckboxChange={handleCheckboxChange}
          />
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleClearFilters}>Clear Filters</Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const SettingsSection = ({ title, items, category, localSettings, handleCheckboxChange }: {
  title: string,
  items: string[],
  category: keyof UserSettings,
  localSettings: UserSettings,
  handleCheckboxChange: (category: keyof UserSettings, item: string) => void
}) => (
  <div className="grid gap-2">
    <h3 className="font-semibold">{title}</h3>
    <div className="grid grid-cols-3 gap-2">
      {items.map(item => (
        <div key={item} className="flex items-center space-x-2">
          <Checkbox
            id={`${category}-${item}`}
            checked={localSettings[category].includes(item)}
            onCheckedChange={() => handleCheckboxChange(category, item)}
          />
          <label htmlFor={`${category}-${item}`}>{item}</label>
        </div>
      ))}
    </div>
  </div>
)

export default function Pokedex() {
  const [pokedexData, setPokedexData] = useState<Region[]>([])
  const [ownedPokemon, setOwnedPokemon] = useState<OwnedPokemon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [highlightedPokemon, setHighlightedPokemon] = useState<string | null>(null)
  const [settings, setSettings] = useState<UserSettings>(() => {
    const savedSettings = Cookies.get("pokedex_settings")
    return savedSettings ? JSON.parse(savedSettings) : {
      natures: [],
      berryPreferences: [],
      pokemonTypes: []
    }
  })

  const router = useRouter()

  const accordionRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const pokemonRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    const token = Cookies.get("token")
    const username = Cookies.get("username")
    if (!token || !username) {
      router.push("/login")
      return
    }

    const loadData = async () => {
      try {
        const [pokedexData, ownedPokemonData] = await Promise.all([
          fetchPokedexData(token, settings),
          fetchOwnedPokemon(token, username, settings)
        ])

        const sortedData = pokedexData.sort((a, b) => {
          if (a.region_name === 'PokéFarm Q') return 1;
          if (b.region_name === 'PokéFarm Q') return -1;
          return 0;
        });
        
        setPokedexData(sortedData)
        setOwnedPokemon(ownedPokemonData)
      } catch (err) {
        setError("Failed to load data.\n" + err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
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

          if(pokemonRef) {
            pokemonRef.scrollIntoView({ behavior: 'smooth', block: 'center' })

            setHighlightedPokemon(region.pokemon[pokemonIndex].formeid)
  
            setTimeout(() => {
              setHighlightedPokemon(null)
            }, 3000)
          }
        }, 500)

        return
      }
    }

    alert("Pokémon not found!")
  }

  const handleSettingsChange = (newSettings: UserSettings) => {
    setSettings(newSettings)
    Cookies.set("pokedex_settings", JSON.stringify(newSettings), { expires: 365 })
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
      activeFilters.push(`Berry Preferences: ${settings.berryPreferences.join(', ')}`)
    }
    if (settings.pokemonTypes.length > 0) {
      activeFilters.push(`Pokémon Types: ${settings.pokemonTypes.join(', ')}`)
    }
    return activeFilters.length > 0 ? activeFilters.join(' | ') : 'No filters applied.'
  }

  const clearCookiesAndReload = () => {
    Cookies.remove("token")
    Cookies.remove("username")
    Cookies.remove("pokedex_settings")
    window.location.reload()
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

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">PokéDex</h1>
        <div className="flex-grow"></div>
        <SettingsDialog settings={settings} onSettingsChange={handleSettingsChange} />
        <form onSubmit={handleSearch} className="flex gap-2 ml-4">
          <Input
            type="text"
            placeholder="Search Pokémon"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">
            <Search className="h-4 w-4" />
          </Button>
        </form>
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
                accordionRefs.current[region.region_name] = el;
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
                {region.pokemon.map((pokemon) => (
                  <div 
                    key={pokemon.formeid} 
                    ref={el => { pokemonRefs.current[pokemon.formeid] = el; }}
                  >
                    <PokemonCard 
                      pokemon={pokemon} 
                      isHighlighted={highlightedPokemon === pokemon.formeid}
                      ownedVariants={getOwnedVariants(pokemon.formeid)}
                    />
                  </div>
                ))}
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
