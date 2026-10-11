'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Check, Clock, Heart, MapPin, Share2, Users } from 'lucide-react'
import { EventCard } from '@/components/event-card'
import { useEvents } from '@/components/events-provider'
import { formatLongDate, formatPrice } from '@/lib/events'
import { cn } from '@/lib/utils'

export function EventDetail({ id }: { id: string }) {
  const { getEvent, events, rsvps, saved, toggleRsvp, toggleSave } = useEvents()
  const event = getEvent(id)

  if (!event) {
    return (
      <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
        <h1 className="text-2xl font-semibold">Event not found</h1>
        <p className="mt-2 text-muted-foreground">This event may have ended or been removed.</p>
        <Link href="/events" className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
          Explore events
        </Link>
      </main>
    )
  }

  const isGoing = rsvps.includes(event.id)
  const isSaved = saved.includes(event.id)
  const spotsLeft = Math.max(0, event.capacity - event.attendees)
  const related = events.filter((e) => e.category === event.category && e.id !== event.id).slice(0, 3)
  const more = related.length ? related : events.filter((e) => e.id !== event.id).slice(0, 3)

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-navy text-navy-foreground">
        <Image src={event.image} alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-40 blur-sm" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/70 via-navy/85 to-navy" />
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-navy-muted hover:text-navy-foreground">
            <ArrowLeft className="size-4" aria-hidden="true" /> All events
          </Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium">{event.category}</span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{event.title}</h1>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-navy-muted">
                <span className="flex items-center gap-2"><CalendarDays className="size-4" aria-hidden="true" />{formatLongDate(event.date)}</span>
                <span className="flex items-center gap-2"><Clock className="size-4" aria-hidden="true" />{event.time}</span>
                <span className="flex items-center gap-2"><MapPin className="size-4" aria-hidden="true" />{event.venue}, {event.city}</span>
              </div>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-navy-border shadow-2xl shadow-black/40">
              <Image src={event.image} alt={event.title} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:px-8">
        <div className="flex flex-col gap-10">
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="text-xl font-semibold">About this event</h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{event.description}</p>
          </section>

          <section aria-labelledby="agenda-heading">
            <h2 id="agenda-heading" className="text-xl font-semibold">Agenda</h2>
            <ol className="mt-5 flex flex-col">
              {event.agenda.map((item, i) => (
                <li key={item.time + item.title} className="relative flex gap-5 pb-6 last:pb-0">
                  {i < event.agenda.length - 1 && (
                    <span aria-hidden="true" className="absolute left-[5px] top-4 h-full w-px bg-border" />
                  )}
                  <span aria-hidden="true" className="mt-1.5 size-[11px] shrink-0 rounded-full border-2 border-primary bg-card" />
                  <div className="flex flex-1 flex-col gap-0.5 rounded-2xl border bg-card px-5 py-4 sm:flex-row sm:items-center sm:gap-6">
                    <span className="w-20 font-mono text-xs font-medium text-primary">{item.time}</span>
                    <span className="font-medium">{item.title}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="host-heading" className="flex items-center gap-4 rounded-3xl border bg-card p-5">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.5_0.22_265)] font-semibold text-primary-foreground">
              {event.host.initials}
            </span>
            <div className="flex-1">
              <p id="host-heading" className="text-xs text-muted-foreground">Hosted by</p>
              <p className="font-semibold">{event.host.name}</p>
            </div>
            <button type="button" className="rounded-full border px-4 py-2 text-sm font-medium hover:bg-muted">
              Follow
            </button>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border bg-card p-6 shadow-xl shadow-navy/5">
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-semibold tracking-tight">{formatPrice(event.price)}</p>
              {event.price > 0 && <p className="text-sm text-muted-foreground">per ticket</p>}
            </div>
            <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4" aria-hidden="true" />
              <span>
                <span className="font-medium text-foreground">{event.attendees.toLocaleString()}</span> going ·{' '}
                {spotsLeft.toLocaleString()} spots left
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-[oklch(0.62_0.2_265)]"
                style={{ width: `${Math.min(100, (event.attendees / event.capacity) * 100)}%` }}
              />
            </div>

            <button
              type="button"
              onClick={() => toggleRsvp(event.id)}
              aria-pressed={isGoing}
              className={cn(
                'mt-6 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition',
                isGoing
                  ? 'bg-success/15 text-success hover:bg-success/20'
                  : 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:brightness-110',
              )}
            >
              {isGoing ? (
                <>
                  <Check className="size-4" aria-hidden="true" /> {"You're going · Cancel RSVP"}
                </>
              ) : event.price === 0 ? (
                'RSVP for free'
              ) : (
                'Get tickets'
              )}
            </button>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => toggleSave(event.id)}
                aria-pressed={isSaved}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition hover:bg-muted',
                  isSaved && 'border-primary/40 bg-secondary text-secondary-foreground',
                )}
              >
                <Heart className={cn('size-4', isSaved && 'fill-current')} aria-hidden="true" />
                {isSaved ? 'Saved' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
              >
                <Share2 className="size-4" aria-hidden="true" /> Share
              </button>
            </div>
            <p aria-live="polite" className="sr-only">
              {isGoing ? 'RSVP confirmed' : ''}
            </p>
          </div>
        </aside>
      </div>

      <section aria-labelledby="related-heading" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 id="related-heading" className="text-2xl font-semibold tracking-tight">You might also like</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {more.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </section>
    </main>
  )
}
