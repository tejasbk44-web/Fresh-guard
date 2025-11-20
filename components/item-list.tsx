"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format, differenceInDays } from "date-fns"
import { Trash2, MapPin, Package, Calendar } from "lucide-react"

interface Item {
  id: number
  name: string
  category: string
  expiry_date: string
  location: string
  quantity: number
  unit: string
  status: string
  purchase_date: string
}

function getStatusColor(expiryDate: string) {
  const daysUntilExpiry = differenceInDays(new Date(expiryDate), new Date())

  if (daysUntilExpiry < 0) return "bg-red-100 text-red-800 border-red-300"
  if (daysUntilExpiry <= 3) return "bg-yellow-100 text-yellow-800 border-yellow-300"
  return "bg-green-100 text-green-800 border-green-300"
}

function getStatusBgColor(expiryDate: string) {
  const daysUntilExpiry = differenceInDays(new Date(expiryDate), new Date())

  if (daysUntilExpiry < 0) return "border-l-4 border-l-red-500 bg-red-50"
  if (daysUntilExpiry <= 3) return "border-l-4 border-l-yellow-500 bg-yellow-50"
  return "border-l-4 border-l-green-500 bg-green-50"
}

function getStatusText(expiryDate: string) {
  const daysUntilExpiry = differenceInDays(new Date(expiryDate), new Date())

  if (daysUntilExpiry < 0) return `Expired ${Math.abs(daysUntilExpiry)} days ago`
  if (daysUntilExpiry === 0) return "Expires today"
  if (daysUntilExpiry === 1) return "Expires tomorrow"
  if (daysUntilExpiry <= 3) return `Expires in ${daysUntilExpiry} days`
  return `Expires in ${daysUntilExpiry} days`
}

async function deleteItem(itemId: number) {
  if (!confirm("Are you sure you want to delete this item?")) return

  try {
    await fetch(`/api/items/${itemId}`, { method: "DELETE" })
  } catch (error) {
    console.error("Error deleting item:", error)
  }
}

export function ItemList({ items, onItemDeleted }: { items: Item[]; onItemDeleted: () => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const daysUntilExpiry = differenceInDays(new Date(item.expiry_date), new Date())
        const isExpired = daysUntilExpiry < 0
        const isExpiringSoon = daysUntilExpiry <= 3 && daysUntilExpiry >= 0

        const bgColor = isExpired ? "bg-red-50" : isExpiringSoon ? "bg-amber-50" : "bg-emerald-50"
        const borderColor = isExpired ? "border-red-200" : isExpiringSoon ? "border-amber-200" : "border-emerald-200"
        const statusBgColor = isExpired ? "bg-red-100 text-red-800" : isExpiringSoon ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"

        return (
          <Card key={item.id} className={`p-6 hover:shadow-lg transition-all border-l-4 ${isExpired ? "border-l-red-500" : isExpiringSoon ? "border-l-amber-500" : "border-l-emerald-500"} ${bgColor} border ${borderColor}`}>
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">{item.category}</span>
              </div>
              <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusBgColor}`}>
                {getStatusText(item.expiry_date)}
              </p>
            </div>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Package size={16} className="text-gray-500" />
                <span><strong>Quantity:</strong> {item.quantity} {item.unit}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={16} className="text-gray-500" />
                <span><strong>Location:</strong> {item.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar size={16} className="text-gray-500" />
                <span><strong>Expires:</strong> {format(new Date(item.expiry_date), "MMM d, yyyy")}</span>
              </div>
            </div>

            <Button
              onClick={async () => {
                await deleteItem(item.id)
                onItemDeleted()
              }}
              variant="outline"
              size="sm"
              className="w-full gap-2 border-red-300 text-red-700 hover:bg-red-50"
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </Card>
        )
      })}
    </div>
  )
}
