import { SectionCard } from '@/components/molecules/section-card'
import { useEmployeeCount } from '@/hooks/useEmployeeCount'

export function TablePage() {
  const count = useEmployeeCount()

  return (
    <SectionCard
      title="Employees"
      description={
        count.isPending
          ? 'Loading...'
          : count.isError
            ? 'Could not load employees. Is the API running?'
            : `${count.data} employees in the database.`
      }
    />
  )
}