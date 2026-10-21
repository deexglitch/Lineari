import { StatusDot } from '@/components/atoms/status-dot'

// A dot and a label. It never relies on colour alone, because the label says the same thing.
export function StatusIndicator({
  tone,
  label,
}: {
  tone: 'ok' | 'bad' | 'idle'
  label: string
}) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <StatusDot tone={tone} />
      {label}
    </span>
  )
}