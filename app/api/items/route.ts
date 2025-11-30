import { type NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "@/lib/jwt"
import { getItemsByUserId, createItem } from "@/lib/items"
import { getUserById } from "@/lib/auth"
import { sendItemCreatedEmail, sendExpiryReminder } from "@/lib/email"
import { format } from "date-fns"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyJwt(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const items = await getItemsByUserId(payload.userId as number)
    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching items:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    const { name, category, purchaseDate, expiryDate, location, quantity, unit, notes } = await request.json()

    const item = await createItem(
      payload.userId as number,
      name,
      category,
      purchaseDate,
      expiryDate,
      location,
      quantity,
      unit,
      notes,
    )

    // Send confirmation email
    try {
      const user = await getUserById(payload.userId as number)
      if (user) {
        // Send item created email
        await sendItemCreatedEmail({
          to: user.email,
          userName: user.name,
          itemName: name,
          category,
          quantity,
          unit,
          location,
          purchaseDate,
          expiryDate,
        })

        // Calculate days until expiry
        const expiryTime = new Date(expiryDate).getTime()
        const nowTime = new Date().getTime()
        const daysUntilExpiry = Math.ceil((expiryTime - nowTime) / (1000 * 60 * 60 * 24))

        // Send expiry reminder if item expires within 3 days
        if (daysUntilExpiry <= 3 && daysUntilExpiry > 0) {
          await sendExpiryReminder({
            to: user.email,
            subject: `⏰ ${name} expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? "" : "s"}!`,
            itemName: name,
            expiryDate: expiryDate,
            daysRemaining: daysUntilExpiry,
          })
          console.log(`Expiry reminder sent for item: ${name} (${daysUntilExpiry} days remaining)`)
        }
      }
    } catch (emailError) {
      console.error("Failed to send email:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("Error creating item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
