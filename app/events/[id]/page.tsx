import { notFound } from 'next/navigation'
import { EventDetail } from '@/components/event-detail/event-detail'
import { AntigravityChat } from '@/components/antigravity-chat'

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const eventId = resolvedParams.id

  if (!eventId) {
    notFound()
  }

  return (
    <>
      <EventDetail id={eventId} />
      <AntigravityChat eventId={eventId} eventTitle="Gatherly Event" />
    </>
  )
}