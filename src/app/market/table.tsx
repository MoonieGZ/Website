'use client'

import React, {useEffect, useState} from 'react'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table'
import {ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable,} from '@tanstack/react-table'
import {InventoryItem} from '@/app/market/inventoryItem'
import {fetchMarketData} from '@/app/market/api'
import Cookies from 'js-cookie'
import {useRouter} from 'next/navigation'
import {ArrowDown, ArrowUp} from 'lucide-react'
import {cn} from '@/lib/utils'

const columns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <SortableHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <SortableHeader column={column} title="Quantity" />
    ),
    cell: ({ row }) => {
      const quantity = row.getValue('quantity') as number | null
      return quantity !== null ? `${quantity.toLocaleString()}` : 'N/A'
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <SortableHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = row.getValue('price') as number | null
      return price !== null ? `${price.toLocaleString()}` : 'N/A'
    },
  },
  {
    accessorKey: 'total',
    header: ({ column }) => (
      <SortableHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      const price = row.getValue('price') as number | null
      const quantity = row.getValue('quantity') as number
      const total = price !== null ? price * quantity : null
      return total !== null ? `${total.toLocaleString()}` : 'N/A'
    },
    sortingFn: (rowA, rowB) => {
      const totalA = rowA.original.price !== null ? rowA.original.price * rowA.original.quantity : -Infinity
      const totalB = rowB.original.price !== null ? rowB.original.price * rowB.original.quantity : -Infinity
      return totalA - totalB
    },
  },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SortableHeader({ column, title }: { column: any; title: string }) {
  return (
    <div
      className="flex items-center space-x-2 cursor-pointer select-none justify-between"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      <span>{title}</span>
      {column.getIsSorted() === 'asc' ? (
        <ArrowUp className="h-4 w-4" />
      ) : column.getIsSorted() === 'desc' ? (
        <ArrowDown className="h-4 w-4" />
      ) : (
        ''
      )}
    </div>
  )
}

export default function InventoryTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [data, setData] = useState<InventoryItem[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        const [inventoryData] = await Promise.all([
          fetchMarketData(token)
        ])
        console.log(inventoryData)
        setData(inventoryData)
      } catch (err) {
        setError('Failed to load data.\n' + err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData().then(/* noop */)
  }, [router])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  if (isLoading) {
    return <div className="text-center">Loading Market data...</div>
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="h-10">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={cn(
                  'transition-colors',
                  index % 2 === 0 ? 'bg-accent' : 'bg-auto',
                  'hover:bg-gray-700'
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}