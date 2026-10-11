export const CATEGORIES = [
  'Tech',
  'Music',
  'Design',
  'Food',
  'Wellness',
  'Art',
  'Sports',
] as const

export type Category = (typeof CATEGORIES)[number]

export type AgendaItem = { time: string; title: string }

export type GatherlyEvent = {
  id: string
  title: string
  category: Category
  date: string
  time: string
  venue: string
  city: string
  price: number
  image: string
  host: { name: string; initials: string }
  attendees: number
  capacity: number
  description: string
  agenda: AgendaItem[]
  featured?: boolean
  hostedByYou?: boolean
}

export const SEED_EVENTS: GatherlyEvent[] = [
  {
    id: 'design-systems-summit',
    title: 'Design Systems Summit 2026',
    category: 'Design',
    date: '2026-10-24',
    time: '9:30 AM',
    venue: 'The Pavilion',
    city: 'San Francisco',
    price: 149,
    image: '/events/design-summit.png',
    host: { name: 'Layer Collective', initials: 'LC' },
    attendees: 412,
    capacity: 500,
    description:
      'A full day of talks and hands-on workshops from the teams building the most respected design systems in the industry. Learn how to scale tokens, components and documentation across products without losing craft.',
    agenda: [
      { time: '9:30 AM', title: 'Doors open & coffee' },
      { time: '10:00 AM', title: 'Keynote: Systems that age well' },
      { time: '1:00 PM', title: 'Workshop tracks' },
      { time: '5:00 PM', title: 'Closing panel & drinks' },
    ],
    featured: true,
    hostedByYou: true,
  },
  {
    id: 'rooftop-jazz-sessions',
    title: 'Rooftop Jazz Sessions',
    category: 'Music',
    date: '2026-10-17',
    time: '7:00 PM',
    venue: 'Skyline Terrace',
    city: 'New York',
    price: 45,
    image: '/events/jazz-night.png',
    host: { name: 'Blue Hour Live', initials: 'BH' },
    attendees: 168,
    capacity: 200,
    description:
      'An evening of live jazz above the city as the sun sets. Featuring the Marcus Lane Quartet with special guests, craft cocktails and a small-plates menu from the terrace kitchen.',
    agenda: [
      { time: '7:00 PM', title: 'Welcome cocktails' },
      { time: '8:00 PM', title: 'First set' },
      { time: '9:30 PM', title: 'Second set & guest sit-ins' },
    ],
    featured: true,
  },
  {
    id: 'ai-builders-meetup',
    title: 'AI Builders Meetup',
    category: 'Tech',
    date: '2026-10-21',
    time: '6:30 PM',
    venue: 'Foundry Loft',
    city: 'Austin',
    price: 0,
    image: '/events/ai-meetup.png',
    host: { name: 'Gatherly Labs', initials: 'GL' },
    attendees: 236,
    capacity: 300,
    description:
      'Founders, engineers and researchers sharing what they are shipping with AI right now. Five lightning demos, open networking and pizza. Bring a laptop if you want to demo.',
    agenda: [
      { time: '6:30 PM', title: 'Check-in & networking' },
      { time: '7:15 PM', title: 'Lightning demos' },
      { time: '8:30 PM', title: 'Open floor' },
    ],
    featured: true,
    hostedByYou: true,
  },
  {
    id: 'night-market-festival',
    title: 'Lantern Night Market',
    category: 'Food',
    date: '2026-11-07',
    time: '5:00 PM',
    venue: 'Harbor Square',
    city: 'Seattle',
    price: 15,
    image: '/events/food-market.png',
    host: { name: 'Street Table Co.', initials: 'ST' },
    attendees: 1240,
    capacity: 2000,
    description:
      'Over 60 vendors, live cooking stations and lantern-lit walkways along the harbor. Sample street food from across the world and vote for the best dish of the night.',
    agenda: [
      { time: '5:00 PM', title: 'Market opens' },
      { time: '7:00 PM', title: 'Chef showdown' },
      { time: '10:00 PM', title: 'Lantern release' },
    ],
  },
  {
    id: 'sunrise-yoga-retreat',
    title: 'Sunrise Yoga Retreat',
    category: 'Wellness',
    date: '2026-11-01',
    time: '6:00 AM',
    venue: 'Cedar Hill Park',
    city: 'Denver',
    price: 30,
    image: '/events/yoga-retreat.png',
    host: { name: 'Still Studio', initials: 'SS' },
    attendees: 54,
    capacity: 80,
    description:
      'Start the month grounded. A guided vinyasa flow at sunrise followed by breathwork, a short meditation and a nourishing breakfast with the community.',
    agenda: [
      { time: '6:00 AM', title: 'Arrival & tea' },
      { time: '6:30 AM', title: 'Sunrise flow' },
      { time: '8:00 AM', title: 'Breakfast' },
    ],
  },
  {
    id: 'gallery-opening-chromatic',
    title: 'Chromatic: Opening Night',
    category: 'Art',
    date: '2026-10-30',
    time: '6:00 PM',
    venue: 'Hale Contemporary',
    city: 'Los Angeles',
    price: 0,
    image: '/events/art-gallery.png',
    host: { name: 'Hale Contemporary', initials: 'HC' },
    attendees: 310,
    capacity: 400,
    description:
      'The opening reception for Chromatic, a new exhibition of large-scale abstract works exploring color as memory. Meet the artists and enjoy wine and live ambient sets.',
    agenda: [
      { time: '6:00 PM', title: 'Doors open' },
      { time: '7:00 PM', title: 'Artist talk' },
      { time: '8:00 PM', title: 'Ambient set' },
    ],
    featured: true,
  },
  {
    id: 'city-half-marathon',
    title: 'Bay Bridge Half Marathon',
    category: 'Sports',
    date: '2026-11-15',
    time: '7:00 AM',
    venue: 'Embarcadero Start Line',
    city: 'San Francisco',
    price: 85,
    image: '/events/marathon.png',
    host: { name: 'Run Bay Club', initials: 'RB' },
    attendees: 3200,
    capacity: 5000,
    description:
      'A scenic 13.1 mile course across the bay with on-course music, hydration every two miles and a finish line festival. Open to all paces with a 4-hour cutoff.',
    agenda: [
      { time: '6:00 AM', title: 'Bib pickup' },
      { time: '7:00 AM', title: 'Start' },
      { time: '10:00 AM', title: 'Finish festival' },
    ],
  },
  {
    id: 'neon-pulse-festival',
    title: 'Neon Pulse Festival',
    category: 'Music',
    date: '2026-12-05',
    time: '8:00 PM',
    venue: 'Warehouse District',
    city: 'Chicago',
    price: 89,
    image: '/events/electronic-festival.png',
    host: { name: 'Pulse Collective', initials: 'PC' },
    attendees: 2780,
    capacity: 4000,
    description:
      'Two stages, twelve artists and an immersive light installation across a restored warehouse. The biggest electronic night of the winter season.',
    agenda: [
      { time: '8:00 PM', title: 'Doors & warm-up' },
      { time: '10:00 PM', title: 'Headliner set' },
      { time: '2:00 AM', title: 'Closing set' },
    ],
  },
]

const parse = (date: string) => new Date(`${date}T00:00:00Z`)

export function formatEventDate(date: string) {
  return parse(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export function formatLongDate(date: string) {
  return parse(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function dateParts(date: string) {
  const d = parse(date)
  return {
    month: d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
    day: d.getUTCDate(),
  }
}

export function formatPrice(price: number) {
  return price === 0 ? 'Free' : `$${price}`
}
