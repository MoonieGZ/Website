import type { Metadata } from "next";
import "./globals.css";
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { Twitch, Music2, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: "Moons' Tools",
  description: "Collection of misc tools by Moonsy",
};

const inter = Inter({ subsets: ['latin'] })
const currentYear = new Date().getFullYear()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-gray-100 min-h-screen flex flex-col`}>
        <nav className="bg-gray-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">Moons&apos; Tools</Link>
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
                <a href="https://twitch.tv/ilymoonsy" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400">
                  <Twitch className="h-6 w-6" />
                  <span className="sr-only">Twitch</span>
                </a>
                <a href="https://tiktok.com/@ilyMoonsy" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400">
                  <Music2 className="h-6 w-6" />
                  <span className="sr-only">TikTok</span>
                </a>
                <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                  <MessageCircle className="h-6 w-6" />
                  <span className="sr-only">Discord</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}