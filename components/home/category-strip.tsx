import Link from 'next/link'
import { Cpu, Dumbbell, Flower2, Music, Palette, PenTool, UtensilsCrossed, type LucideIcon } from 'lucide-react'
import type { Category } from '@/lib/events'

const ICONS: Record<Category, LucideIcon> = {
  Tech: Cpu,
  Music: Music,
  Design: PenTool,
  Food: UtensilsCrossed,
  Wellness: Flower2,
  Art: Palette,
  Sports: Dumbbell,
}

export function CategoryStrip({ counts }: { counts: Record<string, number> }) {
  return (
    <section aria-labelledby="categories-heading" className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
      <h2 id="categories-heading" className="text-sm font-medium text-muted-foreground">
        Browse by category
      </h2>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {(Object.keys(ICONS) as Category[]).map((cat) => {
          const Icon = ICONS[cat]
          return (
            <li key={cat}>
              <Link
                href={`/events?category=${cat}`}
                className="group flex items-center gap-3 rounded-2xl border bg-card p-3 transition hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 lg:flex-col lg:items-start lg:p-4"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{cat}</span>
                  <span className="block text-xs text-muted-foreground">{counts[cat] ?? 0} {(counts[cat] ?? 0) === 1 ? 'event' : 'events'}</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
