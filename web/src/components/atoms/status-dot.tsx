import { cn } from '@/lib/utils'

export function StatusDot({
  tone,
  className,
}: {
  tone: 'ok' | 'bad' | 'idle'
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block size-2.5 rounded-full',
        tone === 'ok' && 'bg-brand-teal',
        tone === 'bad' && 'bg-brand-coral',
        tone === 'idle' && 'bg-brand-mist',
        className,
      )}
    />
  )
}