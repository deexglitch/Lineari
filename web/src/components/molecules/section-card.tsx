import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

// A titled card, the basic building block of every page.
export function SectionCard({
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <section className={cn('rounded-2xl border border-border bg-card p-8', className)}>
      <h1 className="font-display text-2xl font-bold">{title}</h1>
      {description && <p className="mt-2 text-muted-foreground">{description}</p>}
      {children}
    </section>
  )
}