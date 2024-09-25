import type {Metadata} from 'next'
import './globals.css'
import Link from 'next/link'
import {Inter} from 'next/font/google'
import {Dot, MessageCircle, MoonStar, Music2, Video} from 'lucide-react'
import PlausibleProvider from 'next-plausible'
import React from 'react'
import {Badge} from '@/components/ui/badge'
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator} from '@/components/ui/breadcrumb'
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/components/ui/dropdown-menu'
import {ChevronDownIcon} from '@radix-ui/react-icons'

export const metadata: Metadata = {
  title: 'mnsy.dev',
  description: 'Collection of misc tools by Moonsy',
}

const inter = Inter({subsets: ['latin']})
const currentYear = new Date().getFullYear()

export default function RootLayout({children}: { children: React.ReactNode }) {
  const devEnv = process.env.NODE_ENV === 'development'

  const menuLinks = [
    {href: '/pokedex', name: 'PokéDex', description: 'Livedex viewer'},
    {href: '/market', name: 'Inventory Value', description: 'Market value calculator'},
    {href: '/melancalc', name: 'Melanistic Calc', description: 'Chances calculator'},
    {href: '/staff', name: 'Staff Area', description: 'Tools for staff'},
  ]

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
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <Dot />
                  </BreadcrumbSeparator>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                      PFQ
                      <ChevronDownIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {menuLinks.map((item, index) => (
                        <DropdownMenuItem key={index}>
                          <Link href={item.href ? item.href : '#'}>
                            {item.name}<br /><div className="text-xs">{item.description}</div>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <BreadcrumbSeparator>
                    <Dot />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/privacy">Privacy & Cookies</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
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