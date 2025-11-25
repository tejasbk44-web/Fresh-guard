import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { sendExpiryReminder } from "@/lib/email"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Crons
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get all items expiring within 3 days that haven't been reminded today
    const expiringItems = await sql`
      SELECT i.id, i.name, i.expiry_date, u.email
      FROM items i
      JOIN users u ON i.user_id = u.id
      WHERE i.expiry_date > NOW()
        AND i.expiry_date <= NOW() + INTERVAL '3 days'
        AND (i.reminder_sent_at IS NULL OR i.reminder_sent_at < NOW() - INTERVAL '1 day')
      ORDER BY i.expiry_date ASC
    `

    let emailsSent = 0
    let emailsFailed = 0

    for (const item of expiringItems) {
      try {
        const daysRemaining = Math.ceil(
          (new Date(item.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
        )

        await sendExpiryReminder({
          to: item.email,
          subject: `Your ${item.name} is expiring soon!`,
          itemName: item.name,
          expiryDate: item.expiry_date,
          daysRemaining: daysRemaining,
        })

        // Mark reminder as sent
        await sql`
          UPDATE items
          SET reminder_sent_at = NOW()
          WHERE id = ${item.id}
        `

        emailsSent++
      } catch (error) {
        console.error(`Failed to send email for item ${item.id}:`, error)
        emailsFailed++
      }
    }

    console.log(`Cron job completed: ${emailsSent} emails sent, ${emailsFailed} failed`)

    return NextResponse.json({
      success: true,
      itemsProcessed: expiringItems.length,
      emailsSent,
      emailsFailed,
    })
  } catch (error) {
    console.error("Cron job error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 },
    )
  }
}
