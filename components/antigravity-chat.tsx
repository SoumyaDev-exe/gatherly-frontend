'use client'

import { useState } from 'react'
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react'

type Message = {
  sender: 'user' | 'assistant'
  text: string
}

export function AntigravityChat({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: `Hi! I'm the **Antigravity AI** assistant for *${eventTitle}*. Ask me about the venue, schedule, tickets, or remaining spots!`
    }
  ])

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const query = input.trim()
    if (!query || loading) return

    setMessages((prev) => [...prev, { sender: 'user', text: query }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(`https://gatherly-backend-oey6.onrender.com/api/events/${eventId}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query })
      })

      const data = await res.json()
      if (res.ok && data.reply) {
        setMessages((prev) => [...prev, { sender: 'assistant', text: data.reply }])
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'assistant', text: data.error || 'Sorry, I could not process your question.' }
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: 'Unable to reach the assistant server. Ensure the backend is running.' }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-white shadow-xl hover:opacity-95 transition"
        >
          <Sparkles className="size-5" />
          <span className="text-sm font-semibold">Ask Antigravity AI</span>
        </button>
      )}

      {isOpen && (
        <div className="flex h-[480px] w-88 flex-col rounded-3xl border border-border bg-card shadow-2xl sm:w-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5" />
              <div>
                <p className="text-sm font-bold leading-tight">Antigravity AI</p>
                <p className="text-xs text-purple-100">Event Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-white hover:bg-white/20 transition"
              aria-label="Close chat"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground whitespace-pre-line'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                <span>Antigravity is thinking...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="border-t p-3 bg-background flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about schedule, parking, etc..."
              className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-full bg-primary p-2 text-primary-foreground disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
