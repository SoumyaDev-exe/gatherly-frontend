'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { EventCard } from '@/components/event-card'
import { useEvents } from '@/components/events-provider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CATEGORIES, type Category, type GatherlyEvent } from '@/lib/events'
import { cn } from '@/lib/utils'

const COVERS = [
  '/events/design-summit.png',
  '/events/ai-meetup.png',
  '/events/jazz-night.png',
  '/events/art-gallery.png',
  '/events/food-market.png',
  '/events/yoga-retreat.png',
]

const TODAY = '2026-10-10'

type Draft = {
  title: string
  category: Category
  date: string
  time: string
  venue: string
  city: string
  price: string
  capacity: string
  description: string
  image: string
}

const INITIAL: Draft = {
  title: '',
  category: 'Tech',
  date: '2026-11-20',
  time: '18:30',
  venue: '',
  city: '',
  price: '0',
  capacity: '100',
  description: '',
  image: COVERS[0],
}

function to12h(time: string) {
  const [h, m] = time.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`
}

function validate(d: Draft) {
  const errors: Partial<Record<keyof Draft, string>> = {}
  if (d.title.trim().length < 4) errors.title = 'Give your event a title of at least 4 characters.'
  if (!d.date || d.date < TODAY) errors.date = 'Choose a date in the future.'
  if (!d.venue.trim()) errors.venue = 'Add a venue name.'
  if (!d.city.trim()) errors.city = 'Add a city.'
  if (Number(d.price) < 0 || Number.isNaN(Number(d.price))) errors.price = 'Price must be 0 or more.'
  if (!Number.isInteger(Number(d.capacity)) || Number(d.capacity) < 1) errors.capacity = 'Capacity must be at least 1.'
  if (d.description.trim().length < 20) errors.description = 'Describe your event in at least 20 characters.'
  return errors
}

export function CreateEventForm() {
  const router = useRouter()
  const { addEvent } = useEvents()
  const [draft, setDraft] = useState<Draft>(INITIAL)
  const [submitted, setSubmitted] = useState(false)
  const errors = validate(draft)
  const showError = (key: keyof Draft) => (submitted ? errors[key] : undefined)

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }))

  const preview: GatherlyEvent = {
    id: 'preview',
    title: draft.title || 'Your event title',
    category: draft.category,
    date: draft.date || TODAY,
    time: draft.time ? to12h(draft.time) : '6:30 PM',
    venue: draft.venue || 'Venue',
    city: draft.city || 'City',
    price: Math.max(0, Number(draft.price) || 0),
    image: draft.image,
    host: { name: 'Alex Rivera', initials: 'AR' },
    attendees: 0,
    capacity: Math.max(1, Number(draft.capacity) || 1),
    description: draft.description,
    agenda: [],
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length) return
    const slug = draft.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const id = `${slug}-${Date.now().toString(36)}`
    addEvent({
      ...preview,
      id,
      title: draft.title.trim(),
      venue: draft.venue.trim(),
      city: draft.city.trim(),
      description: draft.description.trim(),
      agenda: [{ time: preview.time, title: 'Doors open' }],
      hostedByYou: true,
    })
    router.push(`/dashboard?created=${id}`)
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:px-8">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
        <FormSection title="Basics" description="What is it and what kind of event?">
          <Field id="title" label="Event title" error={showError('title')}>
            <Input
              id="title"
              value={draft.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. Product Design Night"
              aria-invalid={!!showError('title')}
            />
          </Field>
          <fieldset>
            <legend className="text-sm font-medium">Category</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => update('category', cat)}
                  aria-pressed={draft.category === cat}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-medium transition',
                    draft.category === cat
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground hover:border-primary/40',
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </fieldset>
        </FormSection>

        <FormSection title="When & where" description="Let guests know where to show up.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="date" label="Date" error={showError('date')}>
              <Input id="date" type="date" min={TODAY} value={draft.date} onChange={(e) => update('date', e.target.value)} aria-invalid={!!showError('date')} />
            </Field>
            <Field id="time" label="Start time">
              <Input id="time" type="time" value={draft.time} onChange={(e) => update('time', e.target.value)} />
            </Field>
            <Field id="venue" label="Venue" error={showError('venue')}>
              <Input id="venue" value={draft.venue} onChange={(e) => update('venue', e.target.value)} placeholder="The Foundry" aria-invalid={!!showError('venue')} />
            </Field>
            <Field id="city" label="City" error={showError('city')}>
              <Input id="city" value={draft.city} onChange={(e) => update('city', e.target.value)} placeholder="San Francisco" aria-invalid={!!showError('city')} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Tickets" description="Set to 0 for a free event.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="price" label="Price (USD)" error={showError('price')}>
              <Input id="price" type="number" min={0} inputMode="decimal" value={draft.price} onChange={(e) => update('price', e.target.value)} aria-invalid={!!showError('price')} />
            </Field>
            <Field id="capacity" label="Capacity" error={showError('capacity')}>
              <Input id="capacity" type="number" min={1} inputMode="numeric" value={draft.capacity} onChange={(e) => update('capacity', e.target.value)} aria-invalid={!!showError('capacity')} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Details" description="Pick a cover and tell people why they should come.">
          <fieldset>
            <legend className="text-sm font-medium">Cover image</legend>
            <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {COVERS.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => update('image', src)}
                  aria-pressed={draft.image === src}
                  className={cn(
                    'relative aspect-square overflow-hidden rounded-2xl ring-2 ring-transparent ring-offset-2 transition',
                    draft.image === src && 'ring-primary',
                  )}
                >
                  <Image src={src} alt={`Cover option ${i + 1}`} fill sizes="120px" className="object-cover" />
                  {draft.image === src && (
                    <span className="absolute inset-0 flex items-center justify-center bg-primary/40">
                      <Check className="size-5 text-primary-foreground" aria-hidden="true" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </fieldset>
          <Field id="description" label="Description" error={showError('description')}>
            <Textarea
              id="description"
              rows={5}
              value={draft.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="What will guests experience?"
              aria-invalid={!!showError('description')}
            />
          </Field>
        </FormSection>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border px-6 py-3 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110"
          >
            Publish event
          </button>
        </div>
        {submitted && Object.keys(errors).length > 0 && (
          <p role="alert" className="text-right text-sm text-destructive">
            Please fix the highlighted fields before publishing.
          </p>
        )}
      </form>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">Live preview</p>
        <div className="mt-4" inert>
          <EventCard event={preview} />
        </div>
      </aside>
    </div>
  )
}

function FormSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 flex flex-col gap-5">{children}</div>
    </section>
  )
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p className="text-sm text-destructive" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}
