import {InventoryItem} from '@/app/market/inventoryItem'

const apiUrl = process.env.API_URL || 'https://api.pokefarm.com'

export const fetchMarketData = async (token: string): Promise<InventoryItem[]> => {
  const url = new URL(`${apiUrl}/inventory/market`)

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch Market data')
  }

  const data = await response.json()
  return data.inventory.filter((item: InventoryItem) => item.price !== null)
}