import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail, verifyPassword } from "@/lib/auth"
import { jwtSign } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
    }

    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const passwordValid = await verifyPassword(password, user.password_hash)
    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = await jwtSign({ userId: user.id, email: user.email })

    const response = NextResponse.json(
      { message: "Login successful", user: { id: user.id, email: user.email, name: user.name } },
      { status: 200 },
    )

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
