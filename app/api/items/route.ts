import { type NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "@/lib/jwt"
import { getItemsByUserId, createItem } from "@/lib/items"
import { getUserById } from "@/lib/auth"
import { sendItemCreatedEmail } from "@/lib/email"
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

    const items = await getItemsByUserId(payload.userId)
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
      payload.userId,
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
      const user = await getUserById(payload.userId)
      if (user) {
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
      }
    } catch (emailError) {
      console.error("Failed to send item creation email:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("Error creating item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
