import { sql } from "./db"

export interface Item {
  id: number
  user_id: number
  name: string
  category: string
  purchase_date: string
  expiry_date: string
  location: string
  notes?: string
  quantity: number
  unit: string
  status: "fresh" | "expiring_soon" | "expired"
  created_at: string
  updated_at: string
}

export async function getItemsByUserId(userId: number) {
  const result = await sql`
    SELECT * FROM items 
    WHERE user_id = ${userId}
    ORDER BY expiry_date ASC
  `
  return result as Item[]
}

export async function createItem(
  userId: number,
  name: string,
  category: string,
  purchaseDate: string,
  expiryDate: string,
  location: string,
  quantity: number,
  unit: string,
  notes?: string,
) {
  const result = await sql`
    INSERT INTO items (user_id, name, category, purchase_date, expiry_date, location, quantity, unit, notes)
    VALUES (${userId}, ${name}, ${category}, ${purchaseDate}, ${expiryDate}, ${location}, ${quantity}, ${unit}, ${notes || null})
    RETURNING *
  `
  return result[0] as Item
}

export async function updateItem(itemId: number, userId: number, updates: Partial<Item>) {
  const setClauses = Object.entries(updates)
    .filter(([key]) => key !== "id" && key !== "user_id" && key !== "created_at")
    .map(([key, value]) => `${key} = ${value === null ? "NULL" : `'${value}'`}`)
    .join(", ")

  if (!setClauses) return null

  const result = await sql`
    UPDATE items 
    SET ${sql(setClauses)}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${itemId} AND user_id = ${userId}
    RETURNING *
  `
  return result[0] as Item
}

export async function deleteItem(itemId: number, userId: number) {
  await sql`
    DELETE FROM items 
    WHERE id = ${itemId} AND user_id = ${userId}
  `
}

export async function getItemStats(userId: number) {
  const result = await sql`
    SELECT 
      COUNT(*) as total_items,
      SUM(CASE WHEN status = 'fresh' THEN 1 ELSE 0 END) as fresh_items,
      SUM(CASE WHEN status = 'expiring_soon' THEN 1 ELSE 0 END) as expiring_soon,
      SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired_items
    FROM items
    WHERE user_id = ${userId}
  `
  return result[0]
}
