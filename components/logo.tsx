import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn('flex items-center gap-2 font-semibold tracking-tight', className)}
      aria-label="Gatherly home"
    >
      <span
        aria-hidden="true"
        className="relative flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[oklch(0.5_0.22_265)] shadow-lg shadow-primary/30"
      >
        <span className="size-3 rounded-full border-2 border-primary-foreground" />
        <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary-foreground" />
      </span>
      <span className="text-lg">Gatherly</span>
    </Link>
  )
}
