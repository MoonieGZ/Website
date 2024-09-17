'use client'

import React, {useState} from 'react'
import {useRouter} from 'next/navigation'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import Cookies from 'js-cookie'
import Link from 'next/link'

export default function LoginPanel({Destination}: { Destination: string }) {
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const API_URL = process.env.API_URL || 'https://api.pokefarm.com'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey
        },
      })

      if (response.ok) {
        Cookies.set('token', apiKey, {expires: 7})
        router.push(Destination || '/')
      } else {
        const error = await response.json()
        setError('Error: ' + error.message)
      }
    } catch (err) {
      setError('An error occurred. Please try again.\n' + err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Enter your PFQ API key, you can find it <Link href="https://pokefarm.com/farm#tab=5.7" className="text-blue-500" target="_blank">here</Link>.</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}