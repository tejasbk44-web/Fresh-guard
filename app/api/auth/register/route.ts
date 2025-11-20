import { type NextRequest, NextResponse } from "next/server"
import { hashPassword, createUser, getUserByEmail } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, name, password, confirmPassword } = await request.json()

    // Validation
    if (!email || !name || !password || !confirmPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password)
    const user = await createUser(email, name, passwordHash)

    return NextResponse.json({ message: "User created successfully", user }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
