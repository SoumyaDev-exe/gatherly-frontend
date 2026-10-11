export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://gatherly-backend-oey6.onrender.com/api';

export async function fetchEvents() {
  const res = await fetch(`${API_BASE}/events`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function registerForEvent(eventId: number, token: string) {
  const res = await fetch(`${API_BASE}/events/${eventId}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}
