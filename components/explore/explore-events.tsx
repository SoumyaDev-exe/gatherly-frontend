'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SearchX } from 'lucide-react'
import { EventCard } from '@/components/event-card'
import { useEvents } from '@/components/events-provider'
import { CATEGORIES } from '@/lib/events'
import { cn } from '@/lib/utils'

const SORTS = {
  soonest: 'Soonest',
  popular: 'Most popular',
  price: 'Lowest price',
} as const
type Sort = keyof typeof SORTS

export function ExploreEvents() {
  const params = useSearchParams()
  const router = useRouter()
  const { events } = useEvents()

  const [query, setQuery] = useState(params.get('q') ?? '')
  const [freeOnly, setFreeOnly] = useState(false)
  const [sort, setSort] = useState<Sort>('soonest')
  const category = params.get('category') ?? 'All'

  const setCategory = (cat: string) => {
    const next = new URLSearchParams(params.toString())
    if (cat === 'All') next.delete('category')
    else next.set('category', cat)
    router.replace(`/events${next.size ? `?${next}` : ''}`, { scroll: false })
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = events.filter((e) => {
      if (category !== 'All' && e.category !== category) return false
      if (freeOnly && e.price > 0) return false
      if (!q) return true
      return [e.title, e.venue, e.city, e.host.name, e.category].some((f) => f.toLowerCase().includes(q))
    })
    return filtered.sort((a, b) => {
      if (sort === 'popular') return b.attendees - a.attendees
      if (sort === 'price') return a.price - b.price
      return a.date.localeCompare(b.date)
    })
  }, [events, query, category, freeOnly, sort])

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="-mt-8 rounded-3xl border bg-card p-4 shadow-lg shadow-navy/5 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="flex flex-1 items-center gap-3 rounded-2xl border bg-background px-4 focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/15">
            <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">Search events</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, hosts, venues or cities"
              className="h-12 w-full bg-transparent text-sm focus:outline-none"
            />
          </label>
          <div className="flex gap-3">
            <label className="flex h-12 cursor-pointer items-center gap-2 rounded-2xl border bg-background px-4 text-sm has-checked:border-primary has-checked:bg-secondary has-checked:text-secondary-foreground">
              <input
                type="checkbox"
                checked={freeOnly}
                onChange={(e) => setFreeOnly(e.target.checked)}
                className="size-4 accent-primary"
              />
              Free only
            </label>
            <label className="sr-only" htmlFor="sort">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-12 flex-1 rounded-2xl border bg-background px-4 text-sm focus:border-primary focus:outline-none lg:flex-none"
            >
              {Object.entries(SORTS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by category">
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition',
                category === cat
                  ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25'
                  : 'bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-10 text-sm text-muted-foreground" aria-live="polite">
        Showing <span className="font-medium text-foreground">{results.length}</span>{' '}
        {results.length === 1 ? 'event' : 'events'}
      </p>

      {results.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((event, i) => (
            <EventCard key={event.id} event={event} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed bg-card px-6 py-20 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
            <SearchX className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-lg font-semibold">No events match your filters</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try a different search term or clear your filters to see everything.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setFreeOnly(false)
              setCategory('All')
            }}
            className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
