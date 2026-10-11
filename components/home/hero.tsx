import Image from 'next/image'
import { CalendarDays, MapPin, Search, Sparkles, Users } from 'lucide-react'

const STATS = [
  { value: '48k+', label: 'Events hosted' },
  { value: '1.2M', label: 'Attendees' },
  { value: '320', label: 'Cities' },
]

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy text-navy-foreground">
      <div aria-hidden="true" className="hero-glow absolute inset-0 -z-10" />
      <div aria-hidden="true" className="grid-fade absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 md:pb-28 md:pt-24 lg:grid-cols-[1.1fr_1fr] lg:px-8">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-navy-border bg-white/5 px-3 py-1.5 text-xs font-medium text-navy-muted">
            <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
            Over 2,400 events happening this week
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Find your people.{' '}
            <span className="bg-gradient-to-r from-[oklch(0.78_0.15_291)] to-primary bg-clip-text text-transparent">
              Make the moment.
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-navy-muted sm:text-lg">
            Discover concerts, meetups, workshops and festivals near you — or host your own with
            ticketing, RSVPs and insights built in.
          </p>

          <form
            action="/events"
            role="search"
            className="mt-10 flex flex-col gap-2 rounded-3xl border border-navy-border bg-white/5 p-2 backdrop-blur sm:flex-row sm:rounded-full"
          >
            <label className="flex flex-1 items-center gap-3 rounded-full px-4 py-3 sm:py-2">
              <Search className="size-5 shrink-0 text-navy-muted" aria-hidden="true" />
              <span className="sr-only">Search events</span>
              <input
                name="q"
                placeholder="Search events, hosts, venues"
                className="w-full bg-transparent text-sm text-navy-foreground placeholder:text-navy-muted focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/40 transition hover:brightness-110"
            >
              Find events
            </button>
          </form>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="text-xs text-navy-muted">{s.label}</dt>
                <dd className="mt-1 text-2xl font-semibold tracking-tight">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroVisual />
      </div>
    </section>
  )
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden="true">
      <div className="relative ml-auto aspect-[4/5] w-[82%] overflow-hidden rounded-[2rem] border border-navy-border shadow-2xl shadow-black/40">
        <Image src="/events/jazz-night.png" alt="" fill priority sizes="(min-width: 1024px) 40vw, 80vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/10 to-transparent" />
        <div className="absolute inset-x-5 bottom-5">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium">Music</span>
          <p className="mt-3 text-xl font-semibold">Rooftop Jazz Sessions</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-navy-muted">
            <MapPin className="size-3.5" /> Skyline Terrace, New York
          </p>
        </div>
      </div>

      <div className="absolute -left-2 top-10 w-52 rounded-2xl border border-navy-border bg-navy-elevated/90 p-4 shadow-xl backdrop-blur sm:-left-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <CalendarDays className="size-5" />
          </span>
          <div>
            <p className="text-xs text-navy-muted">Next up</p>
            <p className="text-sm font-semibold">Sat, Oct 17 · 7 PM</p>
          </div>
        </div>
      </div>

      <div className="absolute left-0 top-[52%] w-60 rounded-2xl border border-navy-border bg-card p-4 text-card-foreground shadow-xl sm:left-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">RSVPs today</p>
          <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">+24%</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex -space-x-2">
            {['MJ', 'SK', 'TL', 'AR'].map((i, idx) => (
              <span
                key={i}
                className="flex size-8 items-center justify-center rounded-full border-2 border-card text-[10px] font-semibold text-primary-foreground"
                style={{ backgroundColor: `oklch(${0.5 + idx * 0.06} 0.2 ${265 + idx * 10})` }}
              >
                {i}
              </span>
            ))}
          </div>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="size-4" /> 168 going
          </p>
        </div>
      </div>
    </div>
  )
}
