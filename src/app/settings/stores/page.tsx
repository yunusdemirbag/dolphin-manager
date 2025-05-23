'use client'

import { useState } from 'react'
import { Plus, Store, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function StoresPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddStore = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/etsy/auth/initiate')
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('Failed to get Etsy auth URL')
      }
    } catch (error) {
      console.error('Error initiating Etsy auth:', error)
      // TODO: Show error toast
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Stores</h1>
        <button
          onClick={handleAddStore}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {isLoading ? 'Connecting...' : 'Add Store'}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Demo store card */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Store className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Demo Store</h3>
                <p className="text-sm text-muted-foreground">demo-store.etsy.com</p>
              </div>
            </div>
            <button className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Products</p>
              <p className="font-medium">24</p>
            </div>
            <div>
              <p className="text-muted-foreground">Orders</p>
              <p className="font-medium">156</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 