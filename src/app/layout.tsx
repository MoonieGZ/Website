import type { Metadata } from "next"
import './globals.css'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { MessageCircle, Music2, MoonStar, Video } from 'lucide-react'
import PlausibleProvider from 'next-plausible'

export const metadata: Metadata = {
  title: 'mnsy.dev',
  description: 'Collection of misc tools by Moonsy',
  openGraph: {
    title: 'mnsy.dev',
    description: 'Collection of misc tools by Moonsy',
    images: [
      {
        url: 'https://mnsy.dev/assets/icon.png',
        width: 512,
        height: 512,
        alt: 'mnsy.dev',
      },
    ],
    type: 'website',
  },
  themeColor: '#063f66'
};

const inter = Inter({ subsets: ['latin'] })
const currentYear = new Date().getFullYear()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlausibleProvider domain="mnsy.dev" customDomain="https://staryu.pokefarm.com" selfHosted>
      <html lang="en" className="dark">
        <body className={`${inter.className} bg-gray-900 text-gray-100 min-h-screen flex flex-col`}>
          <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex items-center">
              <MoonStar />
              <Link href="/" className="ml-4 text-xl font-bold">
                Moons&apos; Tools
              </Link>
              <div className="flex-grow"></div> {/* Filler space */}
              <div className="space-x-4">
                <Link href="/" className="hover:text-gray-300">Home</Link>
                <Link href="/pokedex" className="hover:text-gray-300">PokéDex</Link>
                <Link href="/about" className="hover:text-gray-300">About</Link>
              </div>
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
                    <MessageCircle className="h-6 w-6" />
                    <span className="sr-only">Discord</span>
                  </a>
                  <a href="https://tiktok.com/@ilyMoonsy" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400">
                    <Music2 className="h-6 w-6" />
                    <span className="sr-only">TikTok</span>
                  </a>
                  <a href="https://twitch.tv/ilyMoonsy" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400">
                    <Video className="h-6 w-6" />
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