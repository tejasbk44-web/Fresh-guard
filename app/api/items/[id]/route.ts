import { type NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "@/lib/jwt"
import { deleteItem } from "@/lib/items"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyJwt(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    await deleteItem(Number.parseInt(params.id), payload.userId)
    return NextResponse.json({ message: "Item deleted" })
  } catch (error) {
    console.error("Error deleting item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
