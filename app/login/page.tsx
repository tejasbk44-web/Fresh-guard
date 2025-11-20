import { LoginForm } from "@/components/login-form"

export const metadata = {
  title: "Login - FreshGuard",
  description: "Log in to your FreshGuard account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-block mb-4 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🥗</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">FreshGuard</h1>
            <p className="text-gray-600 mt-2">Keep your food fresh, reduce waste</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
