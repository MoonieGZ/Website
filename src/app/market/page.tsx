'use client'

import {Button} from '@/components/ui/button'
import {Info, LogOut} from 'lucide-react'
import React, {useState} from 'react'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import Cookies from 'js-cookie'
import InventoryTable from '@/app/market/table'

const LogoutConfirmationDialog = ({isOpen, onClose, onConfirm}: {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to log out?<br/>This will clear your cookies and reload the page.</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>No</Button>
          <Button variant="destructive" onClick={onConfirm}>Yes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const InfoDialog = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="ml-2">
          <Info className="h-4 w-4"/>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>About this page</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <section>
            <h3 className="font-semibold mb-2">Description</h3>
            <p>
              This tool is designed to let you know your most expensive items in your inventory.
              <br/>
              It uses your inventory and checks the cheapest active sale for each item and displays it here.
            </p>
          </section>
          <section>
            <h3 className="font-semibold mb-2">Known Issues</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ordering by Quantity moves the header slightly.</li>
              <li>Some items names are not displaying up properly.</li>
            </ul>
          </section>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function Market() {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  const clearCookiesAndReload = () => {
    Cookies.remove('token')
    Cookies.remove('pokedex_settings')
    window.location.reload()
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory Market Value</h1>
        <div className="flex-grow"></div>

        <InfoDialog/>
        <Button variant="destructive" onClick={() => setIsLogoutDialogOpen(true)} className="ml-2">
          <LogOut className="h-4 w-4"/>
        </Button>
        <LogoutConfirmationDialog
          isOpen={isLogoutDialogOpen}
          onClose={() => setIsLogoutDialogOpen(false)}
          onConfirm={clearCookiesAndReload}
        />
      </div>
      <InventoryTable />
    </>
  )
}