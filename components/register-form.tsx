"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password, confirmPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registration failed")
        return
      }

      router.push("/login?success=registered")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <Input id="name" name="name" placeholder="John Doe" required disabled={isLoading} className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required disabled={isLoading} className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500" />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <Input id="password" name="password" type="password" placeholder="••••••••" required disabled={isLoading} className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500" />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
          disabled={isLoading}
          className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
      <Button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
      <p className="text-sm text-center text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
          Log in
        </Link>
      </p>
    </form>
  )
}
