import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/templates/app-layout'
import OverviewPage from '@/pages/overview-page'
// import { HierarchyPage } from '@/pages/hierarchy-page'
// import { TablePage } from '@/pages/table-page'
import { useEmployees } from '@/hooks/useEmployeeCount'

function OverviewRoute() {
  const { data, isLoading } = useEmployees()
  return (
    <OverviewPage
      isLoading={isLoading}
      employees={data?.map((e) => ({ id: e.id, managerId: e.manager_id }))}
    />
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<OverviewRoute />} />
        
        {/* Keeps any old /table links working */}
        <Route path="table" element={<Navigate to="/employees" replace />} />
      </Route>
    </Routes>
  )
}