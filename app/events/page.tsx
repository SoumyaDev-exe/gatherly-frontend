import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageHeader } from '@/components/page-header'
import { ExploreEvents } from '@/components/explore/explore-events'

export const metadata: Metadata = {
  title: 'Explore events',
  description: 'Search and filter concerts, meetups, workshops and festivals happening near you.',
}

export default function EventsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Explore"
        title="Discover what's happening"
        description="Search by name, venue or city and filter by what you love."
      />
      <Suspense fallback={<div className="mx-auto h-96 max-w-7xl" />}>
        <ExploreEvents />
      </Suspense>
    </main>
  )
}
