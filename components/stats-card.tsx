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
      bgGradient: "from-blue-500/20 to-blue-600/10",
      borderColor: "border-blue-400/30",
      textColor: "text-blue-300",
      accentColor: "text-blue-100",
      iconColor: "text-blue-400",
    },
    {
      icon: CheckCircle,
      label: "Fresh",
      value: stats.fresh_items,
      bgGradient: "from-green-500/20 to-green-600/10",
      borderColor: "border-green-400/30",
      textColor: "text-green-300",
      accentColor: "text-green-100",
      iconColor: "text-green-400",
    },
    {
      icon: AlertCircle,
      label: "Expiring Soon",
      value: stats.expiring_soon,
      bgGradient: "from-yellow-500/20 to-yellow-600/10",
      borderColor: "border-yellow-400/30",
      textColor: "text-yellow-300",
      accentColor: "text-yellow-100",
      iconColor: "text-yellow-400",
    },
    {
      icon: Trash2,
      label: "Expired",
      value: stats.expired_items,
      bgGradient: "from-red-500/20 to-red-600/10",
      borderColor: "border-red-400/30",
      textColor: "text-red-300",
      accentColor: "text-red-100",
      iconColor: "text-red-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <Card key={idx} className={`p-6 bg-gradient-to-br ${stat.bgGradient} border-2 ${stat.borderColor} shadow-md hover:shadow-lg transition-all backdrop-blur-sm`}>
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
