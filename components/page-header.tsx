export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy text-navy-foreground">
      <div aria-hidden="true" className="hero-glow absolute inset-0 -z-10 opacity-70" />
      <div aria-hidden="true" className="grid-fade absolute inset-0 -z-10" />
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 md:pt-16 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            {eyebrow && (
              <p className="font-mono text-xs font-medium uppercase tracking-widest text-[oklch(0.78_0.15_291)]">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">{title}</h1>
            {description && <p className="mt-3 max-w-xl text-navy-muted">{description}</p>}
          </div>
          {children}
        </div>
      </div>
    </section>
  )
}
