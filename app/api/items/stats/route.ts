import { type NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "@/lib/jwt"
import { sql } from "@/lib/db"

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

    const result = await sql`
      SELECT 
        COUNT(*) as total_items,
        SUM(CASE WHEN expiry_date > NOW() THEN 1 ELSE 0 END) as fresh_items,
        SUM(CASE WHEN expiry_date <= NOW() + INTERVAL '3 days' AND expiry_date > NOW() THEN 1 ELSE 0 END) as expiring_soon,
        SUM(CASE WHEN expiry_date <= NOW() THEN 1 ELSE 0 END) as expired_items
      FROM items
      WHERE user_id = ${payload.userId}
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
