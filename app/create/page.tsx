'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Users, Tag, Sparkles, Loader2 } from 'lucide-react'

export default function CreateEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    category: 'Technology',
    venue: '',
    date_time: '',
    capacity: 100,
    description: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAiDraft = () => {
    if (!form.title) {
      setError('Please provide an event title first so AI can draft details.')
      return
    }
    setError('')
    setForm(prev => ({
      ...prev,
      description: `Join us for ${prev.title}! An immersive experience featuring hands-on workshops, keynote presentations from leading industry practitioners, and curated networking sessions with snacks and beverages provided.`,
      venue: prev.venue || 'Tech Arena Main Auditorium & Online',
      capacity: prev.capacity || 150
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      setError('Please sign in via the header button before publishing an event.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('https://gatherly-backend-oey6.onrender.com/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish event')
      }

      router.push('/events')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-12 max-w-3xl mx-auto">
      <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition">
        <ArrowLeft className="size-4" /> Back to Events
      </Link>

      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create a New Event</h1>
            <p className="text-xs text-muted-foreground mt-1">Publish your gathering directly to the live platform directory</p>
          </div>
          <button
            type="button"
            onClick={handleAiDraft}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 border border-primary/20 px-3.5 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition"
          >
            <Sparkles className="size-3.5" /> Draft with AI
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-destructive/10 border border-destructive/20 p-3.5 text-xs text-destructive font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-foreground/80">Event Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. NextGen Web3 & AI Hackathon"
              required
              className="w-full mt-1.5 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                <Tag className="size-3.5 text-primary" /> Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full mt-1.5 rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Technology">Technology</option>
                <option value="Music">Music</option>
                <option value="Education">Education</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Community">Community</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                <Users className="size-3.5 text-primary" /> Maximum Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                min="1"
                required
                className="w-full mt-1.5 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary" /> Venue / Location
              </label>
              <input
                type="text"
                name="venue"
                value={form.venue}
                onChange={handleChange}
                placeholder="e.g. Grand Hall, 4th Avenue"
                required
                className="w-full mt-1.5 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground/80 flex items-center gap-1.5">
                <Calendar className="size-3.5 text-primary" /> Date & Time
              </label>
              <input
                type="datetime-local"
                name="date_time"
                value={form.date_time}
                onChange={handleChange}
                required
                className="w-full mt-1.5 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground/80">Description & Agenda</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Outline what attendees can expect, speakers, prerequisites..."
              required
              className="w-full mt-1.5 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-md"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? 'Publishing Event...' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
