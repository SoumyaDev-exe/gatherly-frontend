import { Hero } from '@/components/home/hero'
import { CategoryStrip } from '@/components/home/category-strip'
import { FeaturedEvents } from '@/components/home/featured-events'
import { OrganizerSection } from '@/components/home/organizer-section'
import { SEED_EVENTS } from '@/lib/events'

export default function HomePage() {
  const counts = SEED_EVENTS.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + 1
    return acc
  }, {})

  return (
    <main>
      <Hero />
      <CategoryStrip counts={counts} />
      <FeaturedEvents />
      <OrganizerSection />
    </main>
  )
}
