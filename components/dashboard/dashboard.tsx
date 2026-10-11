'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CalendarCheck, CircleCheck, DollarSign, Heart, Ticket, Users } from 'lucide-react'
import { EventCard } from '@/components/event-card'
import { useEvents } from '@/components/events-provider'
import { formatEventDate, formatPrice, type GatherlyEvent } from '@/lib/events'
import { cn } from '@/lib/utils'

const TABS = [
  { id: 'hosting', label: 'Hosting' },
  { id: 'going', label: 'Going' },
  { id: 'saved', label: 'Saved' },
] as const
type Tab = (typeof TABS)[number]['id']

export function Dashboard() {
  const { events, rsvps, saved } = useEvents()
  const params = useSearchParams()
  const createdId = params.get('created')
  const created = createdId ? events.find((e) => e.id === createdId) : undefined
  const [tab, setTab] = useState<Tab>('hosting')

  const hosting = events.filter((e) => e.hostedByYou)
  const going = events.filter((e) => rsvps.includes(e.id))
  const savedEvents = events.filter((e) => saved.includes(e.id))

  const totalAttendees = hosting.reduce((s, e) => s + e.attendees, 0)
  const revenue = hosting.reduce((s, e) => s + e.attendees * e.price, 0)

  const stats = [
    { label: 'Events hosting', value: hosting.length.toString(), icon: CalendarCheck },
    { label: 'Total attendees', value: totalAttendees.toLocaleString(), icon: Users },
    { label: 'Ticket revenue', value: `$${revenue.toLocaleString()}`, icon: DollarSign },
    { label: "Events you're going to", value: going.length.toString(), icon: Ticket },
  ]

  const lists: Record<Tab, GatherlyEvent[]> = { hosting, going, saved: savedEvents }
  const counts: Record<Tab, number> = { hosting: hosting.length, going: going.length, saved: savedEvents.length }

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      {created && (
        <div role="status" className="-mt-6 mb-8 flex items-center gap-3 rounded-2xl border border-success/30 bg-card p-4 shadow-lg shadow-navy/5">
          <CircleCheck className="size-5 shrink-0 text-success" aria-hidden="true" />
          <p className="text-sm">
            <span className="font-semibold">{created.title}</span> is live.{' '}
            <Link href={`/events/${created.id}`} className="font-medium text-primary hover:underline">
              View event page
            </Link>
          </p>
        </div>
      )}

      <dl className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', !created && '-mt-6')}>
        {stats.map((s) => (
          <div key={s.label} className="rounded-3xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">{s.label}</dt>
              <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <s.icon className="size-4" aria-hidden="true" />
              </span>
            </div>
            <dd className="mt-3 text-3xl font-semibold tracking-tight">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 flex gap-1 rounded-full border bg-card p-1 sm:inline-flex" role="tablist" aria-label="Your events">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition',
              tab === t.id ? 'bg-navy text-navy-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
            <span className={cn('rounded-full px-2 py-0.5 text-xs', tab === t.id ? 'bg-white/15' : 'bg-muted')}>
              {counts[t.id]}
            </span>
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-6">
        {lists[tab].length === 0 ? (
          <EmptyState tab={tab} />
        ) : tab === 'hosting' ? (
          <HostingList events={hosting} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lists[tab].map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function HostingList({ events }: { events: GatherlyEvent[] }) {
  return (
    <ul className="overflow-hidden rounded-3xl border bg-card">
      {events.map((e) => {
        const fill = Math.min(100, Math.round((e.attendees / e.capacity) * 100))
        return (
          <li key={e.id} className="flex flex-col gap-4 border-b p-4 last:border-b-0 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl">
                <Image src={e.image} alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <Link href={`/events/${e.id}`} className="block truncate font-semibold hover:text-primary">
                  {e.title}
                </Link>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {formatEventDate(e.date)} · {e.city}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 sm:w-[26rem]">
              <div>
                <p className="text-xs text-muted-foreground">Attendees</p>
                <p className="font-semibold">
                  {e.attendees.toLocaleString()}
                  <span className="font-normal text-muted-foreground">/{e.capacity.toLocaleString()}</span>
                </p>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${fill}%` }} />
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="font-semibold">{formatPrice(e.price)}</p>
              </div>
              <div className="flex items-start justify-end">
                <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">Published</span>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

function EmptyState({ tab }: { tab: Tab }) {
  const copy = {
    hosting: { title: "You aren't hosting anything yet", cta: 'Create an event', href: '/create' },
    going: { title: 'No RSVPs yet', cta: 'Explore events', href: '/events' },
    saved: { title: 'Nothing saved yet', cta: 'Explore events', href: '/events' },
  }[tab]
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed bg-card px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
        <Heart className="size-6" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-lg font-semibold">{copy.title}</h2>
      <Link href={copy.href} className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
        {copy.cta}
      </Link>
    </div>
  )
}
