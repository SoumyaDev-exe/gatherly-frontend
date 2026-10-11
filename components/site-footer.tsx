import Link from 'next/link'
import { Logo } from '@/components/logo'

const COLUMNS = [
  {
    title: 'Discover',
    links: [
      { href: '/events', label: 'All events' },
      { href: '/events?category=Music', label: 'Music' },
      { href: '/events?category=Tech', label: 'Tech' },
      { href: '/events?category=Art', label: 'Art' },
    ],
  },
  {
    title: 'Organize',
    links: [
      { href: '/create', label: 'Create an event' },
      { href: '/dashboard', label: 'Dashboard' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-navy-border bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr] lg:px-8">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-navy-muted">
            The home for people who love to gather. Discover what&apos;s happening near you, or
            host something worth showing up for.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h2 className="text-sm font-semibold">{col.title}</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-navy-muted transition-colors hover:text-navy-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-navy-border">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-navy-muted sm:px-6 lg:px-8">
          {'© 2026 Gatherly, Inc. All rights reserved.'}
        </p>
      </div>
    </footer>
  )
}
