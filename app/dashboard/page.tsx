'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, QrCode, Ticket, ArrowLeft, Loader2 } from 'lucide-react'

type RegistrationTicket = {
  registration_id: number
  created_at: string
  qr_code: string
  event: {
    id: number
    title: string
    description: string
    date_time: string
    venue: string
    category: string
  }
}

export default function DashboardPage() {
  const [tickets, setTickets] = useState<RegistrationTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedQr, setSelectedQr] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTickets() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (!token) {
        setError('Please sign in or obtain a token to view your registrations.')
        setLoading(false)
        return
      }

      try {
        const res = await fetch('http://localhost:5000/api/user/registrations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!res.ok) {
          const body = await res.json()
          throw new Error(body.error || 'Failed to fetch registrations')
        }

        const data = await res.json()
        setTickets(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-12 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-2 transition">
            <ArrowLeft className="size-4" /> Back to Explore
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">My Passes & Registrations</h1>
          <p className="text-muted-foreground text-sm mt-1">Access your event admission QR codes and details</p>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="flex items-center justify-center py-24 gap-3 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
          <span>Loading your confirmed passes...</span>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center">
          <p className="text-destructive font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && tickets.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Ticket className="size-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">No active registrations yet</h3>
            <p className="text-muted-foreground text-sm mt-1">You haven't RSVP'd to any events. Browse the directory to register.</p>
          </div>
          <Link
            href="/events"
            className="inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
          >
            Explore Events
          </Link>
        </div>
      )}

      {/* Ticket Grid */}
      {!loading && !error && tickets.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2">
          {tickets.map((item) => {
            const formattedDate = new Date(item.event.date_time).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })

            return (
              <div
                key={item.registration_id}
                className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {item.event.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Pass #{item.registration_id}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mt-3 leading-snug">{item.event.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.event.description}</p>

                  <div className="space-y-2 mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-primary" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-primary" />
                      <span>{item.event.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <button
                    onClick={() => setSelectedQr(item.qr_code)}
                    className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-xs font-semibold hover:bg-secondary/80 transition"
                  >
                    <QrCode className="size-4" />
                    <span>View QR Pass</span>
                  </button>

                  <Link
                    href={`/events/${item.event.id}`}
                    className="text-xs text-muted-foreground hover:text-foreground font-medium"
                  >
                    Event Details &rarr;
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* QR Code Modal */}
      {selectedQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-6 text-center shadow-2xl">
            <h3 className="text-lg font-bold">Fast Check-In Pass</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-4">Present this digital ticket at the venue check-in desk.</p>
            
            <div className="mx-auto flex w-fit items-center justify-center rounded-2xl bg-white p-4 shadow-inner">
              <img
                src={`data:image/png;base64,${selectedQr}`}
                alt="Ticket QR Code"
                className="size-48 object-contain"
              />
            </div>

            <button
              onClick={() => setSelectedQr(null)}
              className="mt-6 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
