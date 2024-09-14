'use client'

import Cookies from 'js-cookie'
import React, {useEffect, useState} from 'react'
import {BoostsResponse} from './boosts'
import {useRouter} from 'next/navigation'

const apiUrl = process.env.API_URL || 'https://api.pokefarm.com'

const fetchBonusData = async (token: string): Promise<BoostsResponse> => {
  const url = new URL(`${apiUrl}/boosts`)

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch bonus data')
  }

  return response.json()
}

export default function Bonus() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [bonusData, setBonusData] = useState<BoostsResponse>()

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      router.push('/login')
      return
    }

    const loadData = async () => {
      try {
        setIsLoading(true)
        const data = await fetchBonusData(token)
        setBonusData(data)
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
  }, [router])

  if (isLoading) {
    return <div className="text-center">Loading bonus data...</div>
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
      </div>
    )
  }

  const bonusResults = JSON.stringify(bonusData, null, 2)

  return (
    <>
      <div className="prose prose-invert lg:prose-xl">
        <h1 className="text-3xl font-bold">Bonus</h1>
        <div className="mt-8 text-xs text-muted-foreground">
          <pre>{bonusResults}</pre>
        </div>
      </div>
    </>
  )
}