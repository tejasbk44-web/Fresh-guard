import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { sendExpiryReminder, sendExpiredReminder } from "@/lib/email"
import { differenceInDays } from "date-fns"

export async function POST(request: NextRequest) {
  try {
    // Get all users with their expiring items
    const users = await sql`
      SELECT DISTINCT u.id, u.email, u.name
      FROM users u
      JOIN items i ON u.id = i.user_id
      WHERE i.expiry_date <= NOW() + INTERVAL '3 days'
      AND i.expiry_date > NOW() - INTERVAL '1 day'
    `

    let emailsSent = 0;
    let errors = 0;

    for (const user of users) {
      try {
        // Get expiring items for this user
        const items = await sql`
          SELECT id, name, expiry_date
          FROM items
          WHERE user_id = ${user.id}
          AND expiry_date <= NOW() + INTERVAL '3 days'
          AND expiry_date > NOW() - INTERVAL '1 day'
          ORDER BY expiry_date ASC
        `

        for (const item of items) {
          const daysRemaining = differenceInDays(new Date(item.expiry_date), new Date())
          
          if (daysRemaining < 0) {
            // Send expired reminder
            await sendExpiredReminder({
              to: user.email,
              subject: `⚠️ ${item.name} has expired`,
              itemName: item.name,
              expiryDate: item.expiry_date,
              daysRemaining,
            })
          } else if (daysRemaining <= 3) {
            // Send expiry reminder
            await sendExpiryReminder({
              to: user.email,
              subject: `📌 ${item.name} expires in ${daysRemaining} days`,
              itemName: item.name,
              expiryDate: item.expiry_date,
              daysRemaining,
            })
          }
          
          emailsSent++
        }
      } catch (error) {
        console.error(`Error sending email to user ${user.id}:`, error)
        errors++
      }
    }

    return NextResponse.json({
      message: "Email notifications processed",
      emailsSent,
      errors,
    })
  } catch (error) {
    console.error("Error processing email notifications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
