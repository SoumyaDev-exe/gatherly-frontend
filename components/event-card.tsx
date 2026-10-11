'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock, Heart, MapPin } from 'lucide-react'
import { useEvents } from '@/components/events-provider'
import { dateParts, formatEventDate, formatPrice, type GatherlyEvent } from '@/lib/events'
import { cn } from '@/lib/utils'

export function EventCard({ event, priority }: { event: GatherlyEvent; priority?: boolean }) {
  const { saved, rsvps, toggleSave } = useEvents()
  const isSaved = saved.includes(event.id)
  const isGoing = rsvps.includes(event.id)
  const { month, day } = dateParts(event.date)
  const fill = Math.min(100, Math.round((event.attendees / event.capacity) * 100))
  const almostFull = fill >= 80

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={event.image}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 flex flex-col items-center rounded-2xl bg-card/95 px-3 py-1.5 text-center shadow-sm backdrop-blur">
          <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-primary">
            {month}
          </span>
          <span className="text-lg font-semibold leading-none">{day}</span>
        </div>

        <button
          type="button"
          onClick={() => toggleSave(event.id)}
          aria-pressed={isSaved}
          className={cn(
            'absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-card/90 text-foreground shadow-sm backdrop-blur transition hover:scale-105',
            isSaved && 'bg-primary text-primary-foreground',
          )}
        >
          <Heart className={cn('size-4', isSaved && 'fill-current')} aria-hidden="true" />
          <span className="sr-only">{isSaved ? 'Remove from saved' : 'Save event'}</span>
        </button>

        <span className="absolute bottom-4 left-4 rounded-full bg-navy/70 px-3 py-1 text-xs font-medium text-navy-foreground backdrop-blur">
          {event.category}
        </span>
        {isGoing && (
          <span className="absolute bottom-4 right-4 rounded-full bg-success px-3 py-1 text-xs font-medium text-primary-foreground">
            {"You're going"}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold leading-snug tracking-tight">
          <Link href={`/events/${event.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {event.title}
          </Link>
        </h3>
        <dl className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <dt className="sr-only">When</dt>
            <Clock className="size-4 shrink-0" aria-hidden="true" />
            <dd>
              {formatEventDate(event.date)} · {event.time}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="sr-only">Where</dt>
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            <dd className="truncate">
              {event.venue}, {event.city}
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex items-end justify-between gap-4 border-t pt-4">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{event.attendees.toLocaleString()}</span>{' '}
              going{almostFull && <span className="text-primary"> · Almost full</span>}
            </p>
            <div
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={fill}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Capacity filled"
            >
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-[oklch(0.62_0.2_265)]" style={{ width: `${fill}%` }} />
            </div>
          </div>
          <p className="text-lg font-semibold">{formatPrice(event.price)}</p>
        </div>
      </div>
    </article>
  )
}
