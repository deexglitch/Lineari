import { cn } from '@/lib/utils'

// The mark on its own, for loading states, empty states and avatars.
export function LineariMark({ className }: { className?: string }) {
  return (
    <svg viewBox="234 424 1566 1152" className={cn('size-10', className)} role="img" aria-label="Lineari">
      <g fill="none" stroke="#0B6E6A" strokeWidth="90">
        <path d="M358.5 898.5H1675.5" />
        <path d="M1016.5 548.5V898.5" />
        <path d="M358.5 898.5V1529" strokeLinecap="round" />
        <path d="M1675.5 898.5V1529" strokeLinecap="round" />
      </g>
      <circle cx="1016.5" cy="548.5" r="124" fill="#B6D777" />
      <circle cx="358.5" cy="898.5" r="124" fill="#F2674A" />
      <circle cx="1675.5" cy="898.5" r="124" fill="#F2674A" />
    </svg>
  )
}