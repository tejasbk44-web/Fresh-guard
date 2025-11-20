import { type NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "@/lib/jwt"
import { markNotificationAsRead, deleteNotification } from "@/lib/notifications"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyJwt(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const notification = await markNotificationAsRead(Number.parseInt(params.id), payload.userId)
    return NextResponse.json(notification)
  } catch (error) {
    console.error("Error marking notification:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    await deleteNotification(Number.parseInt(params.id), payload.userId)
    return NextResponse.json({ message: "Notification deleted" })
  } catch (error) {
    console.error("Error deleting notification:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
