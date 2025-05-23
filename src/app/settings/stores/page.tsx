'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function StoresPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Stores</h1>
        <Link
          href="/api/etsy/auth/initiate"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Etsy Mağazası Ekle
        </Link>
      </div>
      {/* Burada gerçek mağaza listesi gösterilecek. Demo mağaza kaldırıldı. */}
    </div>
  )
} 