import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function NavTab({
  to,
  icon,
  children,
  end,
}: {
  to: string
  icon?: ReactNode
  children: ReactNode
  end?: boolean
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors',
          isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-muted',
        )
      }
    >
      {icon}
      {children}
    </NavLink>
  )
}