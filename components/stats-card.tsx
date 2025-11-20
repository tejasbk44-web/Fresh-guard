"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Package, CheckCircle, AlertCircle, Trash2 } from "lucide-react"

interface Stats {
  total_items: number
  fresh_items: number
  expiring_soon: number
  expired_items: number
}

export function StatsCard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const response = await fetch("/api/items/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !stats) return null

  const statItems = [
    {
      icon: Package,
      label: "Total Items",
      value: stats.total_items,
      bgGradient: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
      accentColor: "text-blue-900",
      iconColor: "text-blue-500",
    },
    {
      icon: CheckCircle,
      label: "Fresh",
      value: stats.fresh_items,
      bgGradient: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-600",
      accentColor: "text-emerald-900",
      iconColor: "text-emerald-500",
    },
    {
      icon: AlertCircle,
      label: "Expiring Soon",
      value: stats.expiring_soon,
      bgGradient: "from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
      textColor: "text-amber-600",
      accentColor: "text-amber-900",
      iconColor: "text-amber-500",
    },
    {
      icon: Trash2,
      label: "Expired",
      value: stats.expired_items,
      bgGradient: "from-red-50 to-red-100",
      borderColor: "border-red-200",
      textColor: "text-red-600",
      accentColor: "text-red-900",
      iconColor: "text-red-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <Card key={idx} className={`p-6 bg-gradient-to-br ${stat.bgGradient} border-2 ${stat.borderColor} shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-3">
              <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              <span className={`text-sm font-semibold ${stat.textColor}`}>{stat.label}</span>
            </div>
            <p className={`text-4xl font-bold ${stat.accentColor}`}>{stat.value}</p>
          </Card>
        )
      })}
    </div>
  )
}
