'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { EventCard } from '@/components/event-card'
import { useEvents } from '@/components/events-provider'

export function FeaturedEvents() {
  const { events } = useEvents()
  const featured = events.filter((e) => e.featured).slice(0, 4)

  return (
    <section aria-labelledby="featured-heading" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-primary">Featured</p>
          <h2 id="featured-heading" className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Trending this month
          </h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            Hand-picked events our community can&apos;t stop talking about.
          </p>
        </div>
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          View all events <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {featured.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  )
}
