"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ItemList } from "./item-list"
import { AddItemModal } from "./add-item-modal"
import { NotificationsPanel } from "./notifications-panel"
import { StatsCard } from "./stats-card"
import { useRouter } from "next/navigation"
import { Plus, LogOut } from "lucide-react"

interface Item {
  id: number
  name: string
  category: string
  expiry_date: string
  location: string
  quantity: number
  unit: string
  status: string
}

export function DashboardClient({ userId }: { userId: number }) {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    try {
      const response = await fetch("/api/items")
      if (response.status === 401) {
        router.push("/login")
        return
      }
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error("Error fetching items:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🥗</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">FreshGuard</h1>
          </div>
          <div className="flex items-center gap-4">
            <NotificationsPanel />
            <Button onClick={handleLogout} variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300">
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Your Inventory</h2>
              <p className="text-gray-600">Track and manage your food items</p>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
              <Plus size={20} />
              Add Item
            </Button>
          </div>

          <StatsCard />
        </div>

        {showAddModal && (
          <AddItemModal
            onClose={() => setShowAddModal(false)}
            onItemAdded={() => {
              setShowAddModal(false)
              fetchItems()
            }}
          />
        )}

        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
              <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 text-lg">Loading your items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
              <span className="text-4xl">📦</span>
            </div>
            <p className="text-gray-600 mb-6 text-lg">No items in your inventory yet.</p>
            <Button onClick={() => setShowAddModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Plus size={18} />
              Add Your First Item
            </Button>
          </div>
        ) : (
          <ItemList items={items} onItemDeleted={fetchItems} />
        )}
      </main>
    </div>
  )
}
