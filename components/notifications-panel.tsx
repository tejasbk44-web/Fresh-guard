"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"

interface Notification {
  id: number
  type: "expiry_warning" | "expired" | "low_stock"
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  async function fetchNotifications() {
    try {
      const response = await fetch("/api/notifications")
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  async function markAsRead(id: number) {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PATCH" })
      fetchNotifications()
    } catch (error) {
      console.error("Error marking notification:", error)
    }
  }

  async function deleteNotification(id: number) {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" })
      fetchNotifications()
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  function getNotificationColor(type: string) {
    switch (type) {
      case "expired":
        return "bg-red-50 border-red-200"
      case "expiry_warning":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-gray-600 hover:text-gray-900">
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className={`p-4 border-b ${getNotificationColor(notif.type)}`}>
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 flex-1">{notif.title}</h4>
                    <button onClick={() => deleteNotification(notif.id)} className="text-gray-400 hover:text-gray-600">
                      ✕
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                  <p className="text-xs text-gray-500 mb-2">{format(new Date(notif.created_at), "MMM d, h:mm a")}</p>
                  {!notif.is_read && (
                    <Button onClick={() => markAsRead(notif.id)} size="sm" variant="outline" className="w-full text-xs">
                      Mark as Read
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
