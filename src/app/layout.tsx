import type {Metadata} from 'next'
import './globals.css'
import Link from 'next/link'
import {Inter} from 'next/font/google'
import {MessageCircle, MoonStar, Music2, Video} from 'lucide-react'
import PlausibleProvider from 'next-plausible'
import {NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger,} from '@/components/ui/navigation-menu'
import React from 'react'
import {Badge} from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'mnsy.dev',
  description: 'Collection of misc tools by Moonsy',
}

const inter = Inter({subsets: ['latin']})
const currentYear = new Date().getFullYear()

function createMenuLink(href: string, title: string, description: string) {
  return (
    <li key={href}>
      <Link href={href}
        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-700 hover:text-gray-300">
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-gray-400">
          {description}
        </p>
      </Link>
    </li>
  )
}


export default function RootLayout({children}: { children: React.ReactNode }) {
  const menuLinks = [
    createMenuLink('/pokedex', 'PokéDex', 'Livedex viewer'),
    createMenuLink('/melancalc', 'Melanistic Calc', 'Chances calculator'),
  ]

  const devEnv = process.env.NODE_ENV === 'development'

  return (
    <PlausibleProvider domain="mnsy.dev" customDomain="https://staryu.pokefarm.com" selfHosted>
      <html lang="en" className="dark">
        <body className={`${inter.className} bg-gray-900 text-gray-100 min-h-screen flex flex-col`}>
          <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex items-center">
              <MoonStar/>
              <Link href="/" className="ml-4 text-xl font-bold">
                Moons&apos; Tools
              </Link>
              {devEnv && (
                <Badge variant="destructive" className="text-xs ml-2 mt-0.5">
                  Dev
                </Badge>
              )}
              <div className="flex-grow"></div>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href="/" className="text-gray-100 hover:text-gray-300 px-3 py-2">
                      Home
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className="text-gray-100 hover:text-gray-300 bg-transparent">PFQ</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[200px] gap-3 p-4 bg-gray-800 rounded-md">
                        {menuLinks}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/about" className="text-gray-100 hover:text-gray-300 px-3 py-2">
                      About
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </nav>
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="bg-gray-800 text-gray-300 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p>&copy; {currentYear} Moons. All rights reserved.</p>
                </div>
                <div className="flex space-x-6">
                  <a href="https://discord.gg/cKybQqnBK9" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                    <MessageCircle className="h-6 w-6"/>
                    <span className="sr-only">Discord</span>
                  </a>
                  <a href="https://tiktok.com/@ilyMoonsy" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400">
                    <Music2 className="h-6 w-6"/>
                    <span className="sr-only">TikTok</span>
                  </a>
                  <a href="https://twitch.tv/ilyMoonsy" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400">
                    <Video className="h-6 w-6"/>
                    <span className="sr-only">Twitch</span>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </PlausibleProvider>
  )
}