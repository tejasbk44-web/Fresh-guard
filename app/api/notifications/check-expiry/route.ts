import { type NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "@/lib/jwt"
import { sql } from "@/lib/db"
import { createNotification } from "@/lib/notifications"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyJwt(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const userId = payload.userId as number

    // Find items expiring within 3 days
    const expiringItems = await sql`
      SELECT i.*, n.id as notification_id
      FROM items i
      LEFT JOIN notifications n ON i.id = n.item_id AND n.type = 'expiry_warning'
      WHERE i.user_id = ${userId}
      AND i.expiry_date <= NOW() + INTERVAL '3 days'
      AND i.expiry_date > NOW()
      AND (n.id IS NULL OR n.created_at < NOW() - INTERVAL '1 day')
    `

    let notificationsCreated = 0
    const notificationMessages: string[] = []

    for (const item of expiringItems) {
      const daysUntilExpiry = Math.ceil(
        (new Date(item.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      )

      let message = ""
      if (daysUntilExpiry === 0) {
        message = `${item.name} expires today! Use it now to avoid waste.`
      } else if (daysUntilExpiry === 1) {
        message = `${item.name} expires tomorrow! Make sure to use it soon.`
      } else {
        message = `${item.name} expires in ${daysUntilExpiry} days. Plan to use it soon.`
      }

      // Only create notification if one doesn't exist or the old one is > 1 day old
      if (!item.notification_id) {
        await createNotification(
          userId,
          "expiry_warning",
          `⏰ ${item.name} expiring soon`,
          message,
          item.id,
        )
        notificationsCreated++
        notificationMessages.push(`${item.name} (${daysUntilExpiry} days)`)
      }
    }

    return NextResponse.json({
      success: true,
      notificationsCreated,
      itemsChecked: expiringItems.length,
      notifiedItems: notificationMessages,
    })
  } catch (error) {
    console.error("Error checking expiry notifications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
