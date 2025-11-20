import { sql } from "./db"

export interface Notification {
  id: number
  user_id: number
  item_id?: number
  type: "expiry_warning" | "expired" | "low_stock"
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export async function getNotificationsByUserId(userId: number) {
  const result = await sql`
    SELECT * FROM notifications 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `
  return result as Notification[]
}

export async function createNotification(
  userId: number,
  type: "expiry_warning" | "expired" | "low_stock",
  title: string,
  message: string,
  itemId?: number,
) {
  const result = await sql`
    INSERT INTO notifications (user_id, item_id, type, title, message)
    VALUES (${userId}, ${itemId || null}, ${type}, ${title}, ${message})
    RETURNING *
  `
  return result[0] as Notification
}

export async function markNotificationAsRead(notificationId: number, userId: number) {
  const result = await sql`
    UPDATE notifications 
    SET is_read = true
    WHERE id = ${notificationId} AND user_id = ${userId}
    RETURNING *
  `
  return result[0] as Notification
}

export async function deleteNotification(notificationId: number, userId: number) {
  await sql`
    DELETE FROM notifications 
    WHERE id = ${notificationId} AND user_id = ${userId}
  `
}

export async function getUnreadCount(userId: number) {
  const result = await sql`
    SELECT COUNT(*) as count FROM notifications 
    WHERE user_id = ${userId} AND is_read = false
  `
  return result[0]?.count || 0
}

// Function to check items and create notifications
export async function checkAndCreateExpiryNotifications(userId: number) {
  const items = await sql`
    SELECT * FROM items 
    WHERE user_id = ${userId} 
    AND expiry_date <= NOW() + INTERVAL '3 days'
    AND expiry_date > NOW()
  `

  for (const item of items) {
    await createNotification(
      userId,
      "expiry_warning",
      `${item.name} expiring soon`,
      `${item.name} will expire in 3 days`,
      item.id,
    )
  }

  // Check for expired items
  const expiredItems = await sql`
    SELECT * FROM items 
    WHERE user_id = ${userId} 
    AND expiry_date <= NOW()
  `

  for (const item of expiredItems) {
    await createNotification(
      userId,
      "expired",
      `${item.name} has expired`,
      `${item.name} expired and should be discarded`,
      item.id,
    )
  }
}
