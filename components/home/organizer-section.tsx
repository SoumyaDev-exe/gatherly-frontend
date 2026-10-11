import Link from 'next/link'
import { BarChart3, Plus, Ticket, Users } from 'lucide-react'

const FEATURES = [
  {
    icon: Ticket,
    title: 'Ticketing in minutes',
    body: 'Free or paid, capacity limits and tiers — publish a polished event page in a few clicks.',
  },
  {
    icon: Users,
    title: 'Guest management',
    body: 'Track RSVPs in real time, message attendees and check guests in at the door.',
  },
  {
    icon: BarChart3,
    title: 'Insights that matter',
    body: 'See views, conversions and revenue so you know exactly what drives turnout.',
  },
]

export function OrganizerSection() {
  return (
    <section aria-labelledby="organizer-heading" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-navy px-6 py-14 text-navy-foreground sm:px-12 lg:py-20">
        <div aria-hidden="true" className="hero-glow absolute inset-0 -z-10 opacity-80" />
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-widest text-[oklch(0.78_0.15_291)]">
              For organizers
            </p>
            <h2 id="organizer-heading" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need to host something great.
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-navy-muted">
              From a 20-person workshop to a 5,000-person festival, Gatherly scales with you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/create"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/40 transition hover:brightness-110"
              >
                <Plus className="size-4" aria-hidden="true" /> Create an event
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-full border border-navy-border bg-white/5 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
              >
                Open dashboard
              </Link>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {FEATURES.map((f) => (
              <li key={f.title} className="rounded-2xl border border-navy-border bg-white/5 p-6 backdrop-blur">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/20 text-[oklch(0.8_0.14_291)]">
                  <f.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-muted">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
