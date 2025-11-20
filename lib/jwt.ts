import { SignJWT, jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export async function jwtSign(payload: { userId: number; email: string }) {
  const token = await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(JWT_SECRET)

  return token
}

export async function verifyJwt(token: string) {
  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload
  } catch (error) {
    console.error("[v0] JWT verification failed:", error)
    return null
  }
}
