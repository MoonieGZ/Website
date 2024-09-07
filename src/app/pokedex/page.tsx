"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Cookies from "js-cookie"
import Image from "next/image"
import Link from "next/link"

type Pokemon = {
    sprite: string
    formeid: string
    name: string
    formename: string
}

type Region = {
    region_name: string
    pokemon: Pokemon[]
}

type OwnedPokemon = {
  id: number
  formeid: string
  color: string
}

const variants = ['normal', 'shiny', 'albino', 'melanistic'];

const natures = [
  "All", "Adamant", "Bashful", "Bold", "Brave", "Calm", "Careful", "Docile", "Gentle", "Hardy",
  "Hasty", "Impish", "Jolly", "Lax", "Lonely", "Mild", "Modest", "Naive", "Naughty",
  "Quiet", "Quirky", "Rash", "Relaxed", "Sassy", "Serious", "Timid"
]

const fetchPokedexData = async (token: string): Promise<Region[]> => {
  const response = await fetch("https://api.pokefarm.com/dex", {
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch PokéDex data")
  }

  return response.json()
}

const fetchOwnedPokemon = async (token: string, username: string, nature: string): Promise<OwnedPokemon[]> => {
  const url = `https://api.pokefarm.com/pokemon?username=${username}&nature=${nature.toLowerCase()}`;
  console.log('url: ' + url)
  const response = await fetch(url, {
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch owned Pokémon data.")
  }

  return response.json()
}

function generateShortLink(id: number) {
  const ab = "0JbyY7pLxMVG6kjR-sCz4Fhl_Ttw2qgNX5ZQn9S1v8fc3PDdrKHBmW";
  let ret = "";
  const base = ab.length;
  let iterations = 6;

  while (id && iterations) {
    ret = ab[id % base] + ret;
    id = Math.floor(id / base);
    iterations--;
  }

  if (id) {
    throw new Error('Failed to process ID');
  }

  return ret;
}

function cleanFormeName(formename: string) {
  return formename
    .replace(" Forme", "")
    .replace(" Flower", "")
    .replace(" Pattern", "")
    .replace(" Drive", "")
    .replace("Type: ", "");
}

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
          {variants.map((variant) => (
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


export default function Pokedex() {
  const [pokedexData, setPokedexData] = useState<Region[]>([])
  const [ownedPokemon, setOwnedPokemon] = useState<OwnedPokemon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [highlightedPokemon, setHighlightedPokemon] = useState<string | null>(null)
  const [selectedNature, setSelectedNature] = useState(Cookies.get("pref_nature") || "All")

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
          fetchPokedexData(token),
          fetchOwnedPokemon(token, username, selectedNature)
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
  }, [router, selectedNature])

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

  const handleNatureChange = (nature: string) => {
    setSelectedNature(nature)
    Cookies.set("pref_nature", nature, { expires: 365 })
    window.location.reload()
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

  if (isLoading) {
    return <div className="text-center">Loading PokéDex data...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">PokéDex</h1>
        <div className="flex-grow"></div> {/* Filler space */}
        <Select value={selectedNature} onValueChange={handleNatureChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select nature" />
          </SelectTrigger>
          <SelectContent>
            {natures.map((nature) => (
              <SelectItem key={nature} value={nature}>
                {nature}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
              {region.region_name}
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
    </>
  )
}