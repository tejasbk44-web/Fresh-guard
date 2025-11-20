"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AddItemModalProps {
  onClose: () => void
  onItemAdded: () => void
}

const CATEGORIES = ["Vegetables", "Fruits", "Dairy", "Meat", "Pantry", "Condiments", "Frozen", "Other"]
const UNITS = ["pcs", "kg", "g", "l", "ml", "cup", "tbsp", "tsp"]

export function AddItemModal({ onClose, onItemAdded }: AddItemModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const category = formData.get("category") as string
    const purchaseDate = formData.get("purchaseDate") as string
    const expiryDate = formData.get("expiryDate") as string
    const location = formData.get("location") as string
    const quantity = Number.parseInt(formData.get("quantity") as string)
    const unit = formData.get("unit") as string
    const notes = formData.get("notes") as string

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          purchaseDate,
          expiryDate,
          location,
          quantity,
          unit,
          notes,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Failed to add item")
        return
      }

      onItemAdded()
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Item</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Item Name
            </label>
            <Input id="name" name="name" placeholder="e.g., Milk" required disabled={isLoading} />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              required
              disabled={isLoading}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Date
              </label>
              <Input id="purchaseDate" name="purchaseDate" type="date" required disabled={isLoading} />
            </div>
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <Input id="expiryDate" name="expiryDate" type="date" required disabled={isLoading} />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <Input id="location" name="location" placeholder="e.g., Fridge, Pantry" required disabled={isLoading} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                placeholder="1"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                id="unit"
                name="unit"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                required
                disabled={isLoading}
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Add any notes..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              disabled={isLoading}
            />
          </div>

          {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={isLoading}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 bg-green-600 hover:bg-green-700">
              {isLoading ? "Adding..." : "Add Item"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
