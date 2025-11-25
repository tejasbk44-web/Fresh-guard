import { hash, compare } from "bcryptjs"
import { sql } from "./db"

export async function hashPassword(password: string) {
  return await hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword)
}

export async function getUserByEmail(email: string) {
  try {
    const result = await sql`
      SELECT id, email, name, password_hash, created_at FROM users WHERE email = ${email}
    `
    return result && result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

export async function createUser(email: string, name: string, passwordHash: string) {
  try {
    const result = await sql`
      INSERT INTO users (email, name, password_hash)
      VALUES (${email}, ${name}, ${passwordHash})
      RETURNING id, email, name, created_at
    `
    return result && result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

export async function getUserById(id: number) {
  try {
    const result = await sql`
      SELECT id, email, name, created_at FROM users WHERE id = ${id}
    `
    return result && result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}
