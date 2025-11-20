import { hash, compare } from "bcryptjs"
import { sql } from "./db"

export async function hashPassword(password: string) {
  return await hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword)
}

export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `
  return result[0] || null
}

export async function createUser(email: string, name: string, passwordHash: string) {
  const result = await sql`
    INSERT INTO users (email, name, password_hash)
    VALUES (${email}, ${name}, ${passwordHash})
    RETURNING id, email, name, created_at
  `
  return result[0]
}

export async function getUserById(id: number) {
  const result = await sql`
    SELECT id, email, name, created_at FROM users WHERE id = ${id}
  `
  return result[0] || null
}
