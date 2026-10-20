import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/templates/app-layout'
import OverviewPage from '@/pages/overview-page'
import OrganisationPage from '@/pages/organisationpage'
// import { TablePage } from '@/pages/table-page'
import { useEmployees } from '@/hooks/useEmployeeCount'
import { useHierarchy } from '@/hooks/useHierarchy'

function OverviewRoute() {
  const { data, isLoading } = useEmployees()
  return (
    <OverviewPage
      isLoading={isLoading}
      employees={data?.map((e) => ({ id: e.id, managerId: e.manager_id }))}
    />
  )
}

function OrganisationRoute() {
  const { data, isLoading, isError } = useHierarchy()
  return <OrganisationPage roots={data} isLoading={isLoading} isError={isError} />
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<OverviewRoute />} />
        <Route path="organisation" element={<OrganisationRoute />} />

        {/* Keeps any old /table links working */}
        <Route path="table" element={<Navigate to="/employees" replace />} />
      </Route>
    </Routes>
  )
}