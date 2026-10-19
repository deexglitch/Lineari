import { Table, TreeStructure } from '@phosphor-icons/react'
import { Logo } from '@/components/atoms/logo'
import { NavTab } from '@/components/molecules/nav-tab'
import { StatusIndicator } from '@/components/molecules/status-indicator'
import { useApiHealth } from '@/hooks/useAPIhealth'

export function AppHeader() {
  const health = useApiHealth()
  const tone = health.isPending ? 'idle' : health.isSuccess ? 'ok' : 'bad'
  const label = health.isPending ? 'Checking API' : health.isSuccess ? 'API connected' : 'API offline'

  return (
    <header className="flex items-center justify-between gap-6 border-b border-border bg-card px-8 py-4">
      <Logo />
      <nav className="flex gap-2" aria-label="Main">
        <NavTab to="/" end icon={<TreeStructure weight="duotone" size={18} />}>
          Hierarchy
        </NavTab>
        <NavTab to="/table" icon={<Table weight="duotone" size={18} />}>
          Table
        </NavTab>
      </nav>
      <StatusIndicator tone={tone} label={label} />
    </header>
  )
}