import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "FreshGuard - Keep Your Food Fresh",
  description: "Never waste food again. Track your groceries and get expiry alerts.",
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🥗</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">FreshGuard</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">Never Waste Food Again</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Track your groceries, get smart expiry alerts, and reduce food waste. Save money while helping the environment.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Start Tracking Free
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 rounded-2xl border border-gray-200 bg-gray-50 hover:border-emerald-200 hover:bg-emerald-50 transition-all">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Inventory</h3>
            <p className="text-gray-600">
              Add groceries, categorize them, and track by location and expiry date.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-gray-200 bg-gray-50 hover:border-emerald-200 hover:bg-emerald-50 transition-all">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔔</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Alerts</h3>
            <p className="text-gray-600">Get notified before items expire so you never miss anything.</p>
          </div>

          <div className="p-8 rounded-2xl border border-gray-200 bg-gray-50 hover:border-emerald-200 hover:bg-emerald-50 transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Money</h3>
            <p className="text-gray-600">Reduce waste and save money by keeping track of what you have.</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12 mb-20">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-emerald-600 mb-2">100+</div>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-emerald-600 mb-2">50K+</div>
              <p className="text-gray-600">Items Tracked</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-emerald-600 mb-2">5 Tons</div>
              <p className="text-gray-600">Waste Prevented</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-emerald-600 rounded-2xl p-14 text-center text-white mb-20">
          <h3 className="text-4xl font-bold mb-4">Ready to reduce food waste?</h3>
          <p className="text-lg mb-10 opacity-90 max-w-2xl mx-auto">
            Join thousands of users saving money and protecting the environment.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-50 font-semibold">
              Start Free Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">&copy; 2025 FreshGuard. Reducing food waste, one item at a time.</p>
        </div>
      </footer>
    </div>
  )
}
