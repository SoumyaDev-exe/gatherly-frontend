'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LogIn, LogOut, User, X, Loader2 } from 'lucide-react'

export function SiteHeader() {
  const [token, setToken] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState('user@gatherly.com')
  const [password, setPassword] = useState('user123')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('token')
      setToken(stored)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErr('')
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        setShowModal(false)
        window.location.reload()
      } else {
        setErr(data.error || 'Authentication failed. Please check credentials.')
      }
    } catch {
      setErr('Cannot connect to Gatherly backend.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/events" className="flex items-center gap-2 font-bold text-lg">
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold shadow-sm">
              G
            </span>
            Gatherly
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition">Home</Link>
            <Link href="/events" className="hover:text-foreground transition">Explore</Link>
            <Link href="/dashboard" className="hover:text-foreground transition">Dashboard</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/create"
            className="hidden sm:inline-flex rounded-xl bg-secondary px-3.5 py-1.5 text-xs font-semibold hover:bg-secondary/80 transition"
          >
            + Create Event
          </Link>

          {token ? (
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold" title="Logged In">
                <User className="size-4" />
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition text-muted-foreground hover:text-foreground"
              >
                <LogOut className="size-3.5" /> Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition shadow-sm"
            >
              <LogIn className="size-3.5" /> Sign In
            </button>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold tracking-tight">Sign In to Gatherly</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground transition"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Use the default test credentials or your registered account.</p>

            {err && (
              <div className="mb-3 rounded-xl bg-destructive/10 border border-destructive/20 p-2.5 text-xs text-destructive font-medium">
                {err}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-foreground/80">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground/80">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold hover:bg-muted transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition inline-flex items-center justify-center gap-1.5"
                >
                  {loading && <Loader2 className="size-3.5 animate-spin" />}
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  )
}

export default SiteHeader