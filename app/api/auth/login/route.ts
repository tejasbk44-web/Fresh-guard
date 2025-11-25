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
      console.log(`[Login] User not found: ${email}`)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if (!user.password_hash) {
      console.log(`[Login] User has no password hash: ${email}`)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const passwordValid = await verifyPassword(password, user.password_hash)
    if (!passwordValid) {
      console.log(`[Login] Invalid password for user: ${email}`)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    console.log(`[Login] Successful login for user: ${email}`)
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
    console.error("[Login] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
