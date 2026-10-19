import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/templates/app-layout'
import { HierarchyPage } from '@/pages/hierarchy-page'
import { TablePage } from '@/pages/table-page'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HierarchyPage />} />
        <Route path="table" element={<TablePage />} />
      </Route>
    </Routes>
  )
}