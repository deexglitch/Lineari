import { useState } from 'react'
import { cn } from '@/lib/utils'

// Shows the Gravatar image, and falls back to initials if it cannot load.
export function Avatar({
  name,
  src,
  className,
}: {
  name: string
  src?: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <span
      className={cn(
        'inline-flex size-10 items-center justify-center overflow-hidden rounded-full bg-brand-teal text-sm font-bold text-white',
        className,
      )}
    >
      {src && !failed ? (
        <img src={src} alt="" className="size-full object-cover" onError={() => setFailed(true)} />
      ) : (
        initials
      )}
    </span>
  )
}