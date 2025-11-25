import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { verifyJwt } from "@/lib/jwt"
import { DashboardClient } from "@/components/dashboard-client"

export const metadata = {
  title: "Dashboard - FreshGuard",
  description: "Manage your food inventory",
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    redirect("/login")
  }

  const payload = await verifyJwt(token)

  if (!payload) {
    redirect("/login")
  }

  return <DashboardClient userId={payload.userId as number} />
}
