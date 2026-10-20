import logoDark from '@/assets/logo-dark.webp'
import logoLight from '@/assets/logo-light.webp'
import { cn } from '@/lib/utils'

// Full logo. Use variant="light" on dark backgrounds (the plum one).
export function Logo({
  variant = 'dark',
  className,
}: {
  variant?: 'dark' | 'light'
  className?: string
}) {
  return (
    <img
      src={variant === 'dark' ? logoDark : logoLight}
      alt="Lineari"
      className={cn('h-9 w-auto', className)}
    />
  )
}