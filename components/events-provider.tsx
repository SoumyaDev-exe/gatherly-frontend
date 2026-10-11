'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { SEED_EVENTS, type GatherlyEvent } from '@/lib/events'

type EventsContextValue = {
  events: GatherlyEvent[]
  saved: string[]
  rsvps: string[]
  toggleSave: (id: string) => void
  toggleRsvp: (id: string) => Promise<void>
  addEvent: (event: GatherlyEvent) => void
  getEvent: (id: string) => GatherlyEvent | undefined
  loading: boolean
}

const EventsContext = createContext<EventsContextValue | null>(null)

const toggle = (list: string[], id: string) =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id]

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<GatherlyEvent[]>(SEED_EVENTS)
  const [saved, setSaved] = useState<string[]>([])
  const [rsvps, setRsvps] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const refreshEvents = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/events')
      if (!res.ok) throw new Error('Failed to load events')
      const data = await res.json()

      const fallbackImage =
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'

      const mapped: GatherlyEvent[] = data.map((item: any) => ({
        id: String(item.id),
        title: item.title,
        description: item.description || 'Join us for this exciting event.',
        category: item.category || 'General',
        date: item.date_time.split('T')[0],
        time: item.date_time.split('T')[1]?.substring(0, 5) || '18:00',
        venue: item.venue,
        city: item.venue.split(',')[1]?.trim() || item.venue,
        price: 0,
        capacity: item.capacity,
        attendees: item.registered_count,
        image: fallbackImage,
        coverImage: fallbackImage,
        host: {
          name: 'Gatherly Host',
          avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          role: 'Organizer',
        },
        agenda: [
          { time: '18:00', title: 'Check-in & Welcome', description: 'Arrive, get badges, and settle in.' },
          { time: '18:30', title: 'Keynote & Main Session', description: 'Core presentations and discussion.' },
          { time: '20:00', title: 'Networking & Wrap-up', description: 'Meet other attendees and speakers.' },
        ],
        faqs: [
          { question: 'Is parking available?', answer: 'Check with the venue for visitor parking options.' },
          { question: 'What is the refund policy?', answer: 'This event is free to register.' },
        ],
        tags: [item.category || 'Community', 'Networking', 'Live'],
      }))

      if (mapped.length > 0) {
        setEvents(mapped)
      }
    } catch (err) {
      console.warn('Backend not reachable, using fallback seed events:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshEvents()
  }, [refreshEvents])

  const toggleSave = useCallback((id: string) => setSaved((s) => toggle(s, id)), [])

  const toggleRsvp = useCallback(
    async (id: string) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

      if (token) {
        try {
          const res = await fetch(`http://localhost:5000/api/events/${id}/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })
          const body = await res.json()
          if (!res.ok) {
            alert(body.error || 'Failed to register')
            return
          }
          alert('Registration successful!')
        } catch (e) {
          console.error(e)
          alert('Failed to connect to registration server')
          return
        }
      }

      const delta = rsvps.includes(id) ? -1 : 1
      setRsvps((r) => toggle(r, id))
      setEvents((evts) =>
        evts.map((e) => (e.id === id ? { ...e, attendees: e.attendees + delta } : e)),
      )
    },
    [rsvps],
  )

  const addEvent = useCallback((event: GatherlyEvent) => setEvents((e) => [event, ...e]), [])

  const value = useMemo<EventsContextValue>(
    () => ({
      events,
      saved,
      rsvps,
      toggleSave,
      toggleRsvp,
      addEvent,
      getEvent: (id) => events.find((e) => e.id === id),
      loading,
    }),
    [events, saved, rsvps, toggleSave, toggleRsvp, addEvent, loading],
  )

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
}

export function useEvents() {
  const ctx = useContext(EventsContext)
  if (!ctx) throw new Error('useEvents must be used within EventsProvider')
  return ctx
}